import { http, HttpResponse } from "msw";
import { 
  getMockUsers, 
  saveMockUsers, 
  getMockOrders, 
  saveMockOrders, 
  getMockChatSessions, 
  saveMockChatSessions, 
  mockProducts 
} from "./db";
import { Order, OrderItem, ChatMessage, ChatSession, User } from "../types";

const BASE_URL = "/api";

export const handlers = [
  // ==========================================
  // CATALOG DOMAIN HANDLERS
  // ==========================================
  
  // Get dynamic catalog products list
  http.get(`${BASE_URL}/catalog/products`, () => {
    return HttpResponse.json(mockProducts);
  }),

  // Calculate pricing based on options and quantity
  http.post(`${BASE_URL}/catalog/calculate-price`, async ({ request }) => {
    try {
      const { productId, options, quantity } = (await request.json()) as {
        productId: string;
        options: { [key: string]: string };
        quantity: number;
      };

      const product = mockProducts.find((p) => p.id === productId);
      if (!product) {
        return HttpResponse.json({ message: "محصول پیدا نشد" }, { status: 404 });
      }

      // Start with product base price
      let unitPrice = product.basePrice;

      // Add factors from each selected option
      Object.entries(options).forEach(([optionId, val]) => {
        const option = product.options.find((o) => o.id === optionId);
        if (option) {
          const optValue = option.values.find((v) => v.value === val);
          if (optValue) {
            unitPrice += optValue.priceFactor;
          }
        }
      });

      // Simple volume discount formula
      let discount = 0;
      if (quantity >= 500) {
        discount = 0.15; // 15% discount for bulk
      } else if (quantity >= 200) {
        discount = 0.10; // 10% discount
      } else if (quantity >= 100) {
        discount = 0.05; // 5% discount
      }

      unitPrice = Math.round(unitPrice * (1 - discount));
      const totalPrice = unitPrice * quantity;

      return HttpResponse.json({
        unitPrice,
        totalPrice,
        discountPercent: discount * 100,
        basePrice: product.basePrice,
      });
    } catch {
      return HttpResponse.json({ message: "پارامترهای نادرست" }, { status: 400 });
    }
  }),

  // ==========================================
  // AUTH DOMAIN HANDLERS
  // ==========================================

  // User Authentication / Login
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    try {
      const { email, password } = (await request.json()) as { email: string; password: string };
      
      const users = getMockUsers();
      // Match password or look for defaults
      let mathedUser: User | undefined;
      
      if (email === "admin@example.com") {
        mathedUser = users.find((u) => u.email === "admin@example.com");
      } else if (email === "client@example.com") {
        mathedUser = users.find((u) => u.email === "client@example.com");
      } else {
        // Fallback or dynamic user
        mathedUser = users.find((u) => u.email === email);
      }

      if (!mathedUser) {
        return HttpResponse.json(
          { message: "کاربری با این مشخصات یافت نشد یا رمز عبور اشتباه است." },
          { status: 400 }
        );
      }

      const dummyToken = `jwt-mock-token-${mathedUser.role}-${Date.now()}`;
      return HttpResponse.json({
        user: mathedUser,
        token: dummyToken,
        message: "ورود با موفقیت انجام شد."
      });
    } catch {
      return HttpResponse.json({ message: "ساختار درخواست نامعتبر است" }, { status: 400 });
    }
  }),

  // User Account Registration
  http.post(`${BASE_URL}/auth/register`, async ({ request }) => {
    try {
      const { name, email, phone } = (await request.json()) as {
        name: string;
        email: string;
        phone: string;
      };

      const users = getMockUsers();
      if (users.some((u) => u.email === email)) {
        return HttpResponse.json(
          { message: "این ایمیل قبلاً در سامانه ثبت شده است." },
          { status: 400 }
        );
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        role: "client",
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      };

      users.push(newUser);
      saveMockUsers(users);

      const dummyToken = `jwt-mock-token-client-${Date.now()}`;
      return HttpResponse.json({
        user: newUser,
        token: dummyToken,
        message: "ثبت‌نام با موفقیت انجام شد."
      });
    } catch {
      return HttpResponse.json({ message: "داده‌های ورودی نادرست است" }, { status: 400 });
    }
  }),

  // Token refresh handler
  http.post(`${BASE_URL}/auth/refresh`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "توکن نامعتبر است" }, { status: 401 });
    }
    
    // Simply return another fresh token
    const oldToken = authHeader.split(" ")[1];
    const role = oldToken.includes("admin") ? "admin" : "client";
    const freshToken = `jwt-mock-token-${role}-${Date.now()}`;
    
    return HttpResponse.json({ token: freshToken });
  }),

  // Get active user profile
  http.get(`${BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "شما وارد نشده‌اید" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const role = token.includes("admin") ? "admin" : "client";
    const users = getMockUsers();
    const active = users.find((u) => u.role === role);

    if (!active) {
      return HttpResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }
    return HttpResponse.json(active);
  }),

  // ==========================================
  // ORDERS DOMAIN HANDLERS
  // ==========================================

  // Create an order
  http.post(`${BASE_URL}/orders/create`, async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return HttpResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
      }

      const { items, totalAmount, shippingAddress, paymentMethod } = (await request.json()) as {
        items: Omit<OrderItem, "id">[];
        totalAmount: number;
        shippingAddress: string;
        paymentMethod: string;
      };

      const token = authHeader.split(" ")[1];
      const role = token.includes("admin") ? "admin" : "client";
      const users = getMockUsers();
      const user = users.find((u) => u.role === role) || users[0];

      const orders = getMockOrders();
      const numericalCode = Math.floor(1000 + Math.random() * 9000);
      
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `N-${numericalCode}`,
        userId: user.id,
        userName: user.name,
        items: items.map((i, idx) => ({ ...i, id: `item-${Date.now()}-${idx}` })),
        totalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
        shippingAddress,
        paymentMethod,
      };

      orders.unshift(newOrder); // Add to the front of list
      saveMockOrders(orders);

      return HttpResponse.json({
        order: newOrder,
        message: "سفارش شما با موفقیت ثبت گردید."
      });
    } catch {
      return HttpResponse.json({ message: "ثبت سفارش با شکست مواجه شد" }, { status: 400 });
    }
  }),

  // Get all user or system orders (dependent on role)
  http.get(`${BASE_URL}/orders`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return HttpResponse.json({ message: "عدم احراز هویت" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const isAdmin = token.includes("admin");
    const users = getMockUsers();
    const currentUser = users.find((u) => u.role === (isAdmin ? "admin" : "client"));

    const orders = getMockOrders();

    if (isAdmin) {
      // Admin sees everything
      return HttpResponse.json(orders);
    } else {
      // Standard client sees only their orders
      const userOrders = orders.filter((o) => o.userId === (currentUser?.id || "usr-client"));
      return HttpResponse.json(userOrders);
    }
  }),

  // Update order status (Admin function)
  http.patch(`${BASE_URL}/orders/:id/status`, async ({ params, request }) => {
    try {
      const { id } = params;
      const { status } = (await request.json()) as { status: string };

      const orders = getMockOrders();
      const orderIndex = orders.findIndex((o) => o.id === id);

      if (orderIndex === -1) {
        return HttpResponse.json({ message: "سفارش یافت نشد" }, { status: 404 });
      }

      orders[orderIndex].status = status as any;
      saveMockOrders(orders);

      return HttpResponse.json({
        order: orders[orderIndex],
        message: "وضعیت سفارش با موفقیت ویرایش شد."
      });
    } catch {
      return HttpResponse.json({ message: "خطایی پیش آمد" }, { status: 400 });
    }
  }),

  // Update order tracking code (Admin function)
  http.patch(`${BASE_URL}/orders/:id/tracking`, async ({ params, request }) => {
    try {
      const { id } = params;
      const { trackingNumber } = (await request.json()) as { trackingNumber: string };

      const orders = getMockOrders();
      const orderIndex = orders.findIndex((o) => o.id === id);

      if (orderIndex === -1) {
        return HttpResponse.json({ message: "سفارش یافت نشد" }, { status: 404 });
      }

      orders[orderIndex].trackingNumber = trackingNumber;
      orders[orderIndex].status = "shipped";
      saveMockOrders(orders);

      return HttpResponse.json({
        order: orders[orderIndex],
        message: "کد پیگیری مرسوله با موفقیت ثبت شد."
      });
    } catch {
      return HttpResponse.json({ message: "خطایی پیش آمد" }, { status: 400 });
    }
  }),

  // ==========================================
  // CHAT / MESSAGE DOMAIN HANDLERS
  // ==========================================

  // Get chat history for current client
  http.get(`${BASE_URL}/chat/messages`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return HttpResponse.json({ message: "عدم احراز هویت" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const isLocalAdmin = token.includes("admin");
    const userRole = isLocalAdmin ? "admin" : "client";
    const users = getMockUsers();
    const currentUser = users.find((u) => u.role === userRole) || users[0];

    const chats = getMockChatSessions();
    // Default chat session for user-client
    let targetSession = chats.find((c) => c.userId === currentUser.id);
    if (!targetSession && !isLocalAdmin) {
      targetSession = {
        id: `chat-${currentUser.id}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        messages: [],
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      };
      chats.push(targetSession);
      saveMockChatSessions(chats);
    }

    return HttpResponse.json(targetSession ? targetSession.messages : []);
  }),

  // Client sending a chat message
  http.post(`${BASE_URL}/chat/send`, async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return HttpResponse.json({ message: "عدم احراز هویت" }, { status: 401 });
      }

      const { text } = (await request.json()) as { text: string };
      const token = authHeader.split(" ")[1];
      const users = getMockUsers();
      const currentUser = users.find((u) => u.role === "client") || users[0];

      const chats = getMockChatSessions();
      let targetSession = chats.find((c) => c.userId === currentUser.id);

      if (!targetSession) {
        targetSession = {
          id: `chat-${currentUser.id}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          messages: [],
          lastMessageAt: new Date().toISOString(),
          unreadCount: 0,
        };
        chats.push(targetSession);
      }

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        text,
        createdAt: new Date().toISOString(),
        isAdmin: false,
      };

      targetSession.messages.push(newMsg);
      targetSession.lastMessageAt = new Date().toISOString();
      targetSession.unreadCount += 1; // Unread for admin

      saveMockChatSessions(chats);

      return HttpResponse.json(newMsg);
    } catch {
      return HttpResponse.json({ message: "خطا در پیوست پیام" }, { status: 400 });
    }
  }),

  // Admin getting all chat conversations list
  http.get(`${BASE_URL}/admin/chat/sessions`, () => {
    const chats = getMockChatSessions();
    return HttpResponse.json(chats);
  }),

  // Admin sending reply to a particular user session
  http.post(`${BASE_URL}/admin/chat/reply`, async ({ request }) => {
    try {
      const { sessionId, text } = (await request.json()) as { sessionId: string; text: string };

      const chats = getMockChatSessions();
      const targetSessionIndex = chats.findIndex((c) => c.id === sessionId);

      if (targetSessionIndex === -1) {
        return HttpResponse.json({ message: "گفتگو یافت نشد" }, { status: 404 });
      }

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: "usr-admin",
        senderName: "سهراب سپهری (پشتیبانی)",
        text,
        createdAt: new Date().toISOString(),
        isAdmin: true,
      };

      chats[targetSessionIndex].messages.push(newMsg);
      chats[targetSessionIndex].lastMessageAt = new Date().toISOString();
      chats[targetSessionIndex].unreadCount = 0; // Cleared on reply

      saveMockChatSessions(chats);
      return HttpResponse.json(newMsg);
    } catch {
      return HttpResponse.json({ message: "ارسال پیام با شکست مواجه شد" }, { status: 400 });
    }
  }),
];
