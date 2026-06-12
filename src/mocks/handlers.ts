import { http, HttpResponse, delay } from "msw";
import { users, categories, products, orders, chatSessions, cmsPages, cmsMenus, sliders, faqs, blogPosts } from "./db";
import { PaginatedResponse, Product, Category, Order, ChatSession, User } from "../types";

export const handlers = [
  // Chat endpoint
  http.get("/api/chat/:orderId", async ({ params }) => {
    await delay(300);
    const { orderId } = params;
    return HttpResponse.json({
      sessionId: `sess_${orderId}`,
      messages: [
        {
          id: "m1",
          type: "status_change",
          sessionId: `sess_${orderId}`,
          senderId: "system",
          senderRole: "admin",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          oldStatus: "registered",
          newStatus: "in_review"
        },
        {
          id: "m2",
          type: "text",
          content: "سلام، فایل شما دارای حاشیه امن کافی نیست. لطفا از هر طرف نیم سانت فاصله بگذارید.",
          sessionId: `sess_${orderId}`,
          senderId: "admin_1",
          senderName: "پشتیبانی انتشارات رابوک",
          senderRole: "admin",
          createdAt: new Date(Date.now() - 80000000).toISOString(),
          seen: true
        }
      ]
    });
  }),
  // Authentication
  http.post("/api/auth/otp/send", async ({ request }) => {
    await delay(500);
    const { phone } = await request.json() as any;
    if (!phone) return HttpResponse.json({ error: "شماره موبایل الزامی است." }, { status: 400 });
    return HttpResponse.json({ message: "کد تایید ارسال شد." });
  }),

  http.post("/api/auth/otp/verify", async ({ request }) => {
    await delay(500);
    const { phone, code } = await request.json() as any;
    if (code !== "11111") {
      return HttpResponse.json({ error: "کد وارد شده صحیح نیست." }, { status: 400 });
    }
    
    // Check if user exists
    let user = users.find(u => u.phone === phone);
    if (!user) {
      user = {
        id: Math.random().toString(36).substring(7),
        name: "کاربر جدید",
        email: "",
        phone: phone,
        role: "customer"
      };
      users.push(user);
    }
    
    return HttpResponse.json({ user, token: "mock-jwt-token", refreshToken: "mock-refresh-token" });
  }),

  http.post("/api/auth/login", async ({ request }) => {
    await delay(500);
    const { email, password } = await request.json() as any;
    const user = users.find(u => u.email === email);
    if (!user) {
      return HttpResponse.json({ error: "ایمیل یا رمز عبور اشتباه است." }, { status: 401 });
    }
    return HttpResponse.json({ user, token: "mock-jwt-token" });
  }),

  http.post("/api/auth/register", async ({ request }) => {
    await delay(500);
    const body = await request.json() as any;
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: "customer"
    };
    users.push(newUser);
    return HttpResponse.json({ user: newUser, token: "mock-jwt-token" });
  }),

  // Catalog
  http.get("/api/categories", async () => {
    await delay(300);
    // Return tree structure
    const level1 = categories.filter(c => c.level === 1);
    const getChildren = (parentId: string): Category[] => 
      categories.filter(c => c.parentId === parentId).map(c => ({
        ...c,
        children: getChildren(c.id)
      }));
    const tree = level1.map(c => ({
      ...c,
      children: getChildren(c.id)
    }));
    return HttpResponse.json(tree);
  }),

  http.get("/api/products", async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    let filtered = [...products];
    if (categoryId) filtered = filtered.filter(p => p.categoryId === categoryId);
    if (search) filtered = filtered.filter(p => p.title.includes(search));

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return HttpResponse.json({
      data: paginated,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit)
    } as PaginatedResponse<Product>);
  }),

  http.get("/api/products/:id", async ({ params }) => {
    await delay(300);
    const product = products.find(p => p.id === params.id || p.slug === params.id);
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);
  }),

  http.post("/api/catalog/calculate-price", async ({ request }) => {
    await delay(300);
    const body = await request.json() as any;
    const product = products.find(p => p.id === body.productId);
    
    if (!product) return new HttpResponse(null, { status: 404 });

    let unitPrice = 0;
    if (product.pricing.type === "tier_table") {
      unitPrice = product.pricing.tiers[0].unitPrice;
      // Mock logic: apply price impacts for options
      Object.entries(body.options || {}).forEach(([optId, val]) => {
         const option = product.options.find(o => o.id === optId);
         if (option && option.type === "select") {
            const ch = option.choices?.find(c => c.value === val);
            if (ch && ch.priceImpact) unitPrice += ch.priceImpact;
         }
      });
    } else if (product.pricing.type === "area_based" || product.pricing.type === "formula") {
      unitPrice = (product.pricing as any).basePrice || (product.pricing as any).basePricePerSquareMeter || 50000;
    }

    let discountPercent = body.quantity >= 500 ? 15 : 0;
    const finalUnitPrice = unitPrice * (1 - discountPercent / 100);
    const totalPrice = finalUnitPrice * body.quantity;

    return HttpResponse.json({
      unitPrice: finalUnitPrice,
      totalPrice,
      discountPercent,
      basePrice: unitPrice
    });
  }),

  // Orders
  http.get("/api/orders", async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const admin = url.searchParams.get("admin") === "true"; // just checking caller role theoretically

    let filtered = [...orders];
    if (customerId) filtered = filtered.filter(o => o.customerId === customerId);

    // Simple sorting
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
      page: 1,
      pageSize: 50,
      totalPages: 1
    } as PaginatedResponse<Order>);
  }),

  http.get("/api/orders/:id", async ({ params }) => {
    await delay(300);
    const order = orders.find(o => o.id === params.id);
    if (!order) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(order);
  }),

  // Chat
  http.get("/api/orders/:id/chat", async ({ params }) => {
    await delay(400);
    const session = chatSessions.find(s => s.orderId === params.id);
    if (!session) return HttpResponse.json({ messages: [] });
    return HttpResponse.json(session);
  }),

  http.post("/api/orders/:id/chat/message", async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as any;
    let session = chatSessions.find(s => s.orderId === params.id);
    if (!session) {
      session = {
        id: "chat-" + params.id,
        orderId: params.id.toString(),
        customerId: "cust1", // mock fallback
        messages: [],
        lastUpdatedAt: new Date().toISOString()
      };
      chatSessions.push(session);
    }
    const newMessage = {
      ...body,
      id: Math.random().toString(36).substring(7),
      sessionId: session.id,
      createdAt: new Date().toISOString()
    };
    session.messages.push(newMessage);
    session.lastUpdatedAt = new Date().toISOString();

    return HttpResponse.json(newMessage);
  }),

  // CMS
  http.get("/api/cms/pages/:slug", async ({ params }) => {
    await delay(300);
    const page = cmsPages.find(p => p.slug === params.slug);
    if (!page) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(page);
  }),

  http.get("/api/cms/menus/:location", async ({ params }) => {
    await delay(300);
    const menu = cmsMenus.find(m => m.location === params.location);
    if (!menu) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(menu);
  }),

  http.get("/api/cms/sliders", async () => {
    await delay(300);
    return HttpResponse.json(sliders);
  }),

  http.get("/api/cms/faqs", async () => {
    await delay(300);
    return HttpResponse.json(faqs);
  }),

  http.get("/api/blog", async () => {
    await delay(300);
    return HttpResponse.json(blogPosts);
  }),

  http.get("/api/blog/:slug", async ({ params }) => {
    await delay(300);
    const post = blogPosts.find(p => p.slug === params.slug);
    if (!post) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(post);
  })
];
