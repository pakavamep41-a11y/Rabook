import { Product, Order, User, ChatMessage, ChatSession } from "../types";

// Base Mock Products
export const mockProducts: Product[] = [
  {
    id: "business-card",
    name: "کارت ویزیت خلاقانه",
    description: "انواع کارت‌های ویزیت با جنس‌های گلاسه، کرافت، لمینت برجسته و معمولی با برش‌های خاص.",
    basePrice: 120000,
    imageUrl: "https://images.unsplash.com/photo-1589149013915-0496ac31ecba?w=500&auto=format&fit=crop&q=80",
    options: [
      {
        id: "size",
        name: "سایز برش",
        label: "سایز",
        values: [
          { value: "9x5", label: "استاندارد ۹×۵ سانتی‌متر", priceFactor: 0 },
          { value: "6x6", label: "مربعی ۶×۶ سانتی‌متر", priceFactor: 25000 },
          { value: "doretiz", label: "دورگرد کارتونی ۹.۵×۵.۵", priceFactor: 40000 },
        ],
      },
      {
        id: "paper",
        name: "نوع کاغذ",
        label: "کاغذ",
        values: [
          { value: "glace-300", label: "گلاسه ۳۰۰ گرم ضخیم", priceFactor: 0 },
          { value: "kraft-300", label: "کرافت ۳۰۰ گرم کرم", priceFactor: 15000 },
          { value: "fancy", label: "کتان بافت‌دار فانتزی ۲۵0 گرم", priceFactor: 55000 },
        ],
      },
      {
        id: "lamination",
        name: "پوشش روی کارت",
        label: "روکش",
        values: [
          { value: "none", label: "بدون روکش", priceFactor: 0 },
          { value: "matte", label: "سلفون مات حرارتی", priceFactor: 30000 },
          { value: "glossy", label: "سلفون براق حرارتی", priceFactor: 25000 },
          { value: "uv-spot", label: "موضعی برجسته UV", priceFactor: 85000 },
        ],
      },
    ],
  },
  {
    id: "poster",
    name: "پوستر عریض تبلیغاتی",
    description: "چاپ پوستر با تراکم رنگ فوق‌العاده بالا و کاغذهای باکیفیت برای فضاهای داخلی و همایش‌ها.",
    basePrice: 85000,
    imageUrl: "https://images.unsplash.com/photo-1561070791-26c113006238?w=500&auto=format&fit=crop&q=80",
    options: [
      {
        id: "size",
        name: "ابعاد پوستر",
        label: "ابعاد",
        values: [
          { value: "A4", label: "سایز کاغذ A4", priceFactor: 0 },
          { value: "A3", label: "سایز کاغذ A3(دو برابر)", priceFactor: 45000 },
          { value: "50x70", label: "بزرگ ۵۰ در ۷۰ سانتی‌متر", priceFactor: 110000 },
          { value: "70x100", label: "بزرگترین ۷۰ در ۱۰۰ سانتی‌متر", priceFactor: 210000 },
        ],
      },
      {
        id: "paper",
        name: "نوع جنس کاغذ پوستر",
        label: "کاغذ",
        values: [
          { value: "glace-135", label: "گلاسه سبک ۱۳۵ گرم", priceFactor: 0 },
          { value: "glace-170", label: "گلاسه نیمه سنگین ۱۷۰ گرم", priceFactor: 15000 },
          { value: "glace-300", label: "گلاسه آلبومی سنگین ۳۰۰ گرم", priceFactor: 50000 },
        ],
      },
      {
        id: "lamination",
        name: "روکش محافظتی",
        label: "روکش حفاظتی",
        values: [
          { value: "none", label: "بدون روکش حفاظتی", priceFactor: 0 },
          { value: "matte", label: "سلفون کشی مات", priceFactor: 35000 },
          { value: "glossy", label: "سلفون کشی براق", priceFactor: 35000 },
        ],
      },
    ],
  },
  {
    id: "brochure",
    name: "بروشور چند لت نمایشگاهی",
    description: "بروشورهای با تاخوردگی اختصاصی، خط تا دقیق و تمیز برای معرفی کاتالوگ محصولات.",
    basePrice: 190000,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
    options: [
      {
        id: "size",
        name: "نوع تاخوردگی و سایز",
        label: "فرم تا",
        values: [
          { value: "a4-2fold", label: "برگه A4 دولَت (یک خط تا)", priceFactor: 0 },
          { value: "a4-3fold", label: "برگه A4 سه‌لَت (دو خط تا)", priceFactor: 15000 },
          { value: "a5-2fold", label: "برگه A5 دولَت جمع‌وجور", priceFactor: -40000 },
        ],
      },
      {
        id: "paper",
        name: "ضخامت برگه‌ها",
        label: "کاغذ",
        values: [
          { value: "glace-150", label: "گلاسه ۱۵۰ گرم براق", priceFactor: 0 },
          { value: "glace-200", label: "گلاسه ۲۰۰ گرم نیمه‌سخت", priceFactor: 25000 },
          { value: "tahrir-100", label: "کاغذ تحریر ۱۰۰ گرم معمولی", priceFactor: -15000 },
        ],
      },
      {
        id: "lamination",
        name: "پوشش لت‌ها",
        label: "سلفون محافظ",
        values: [
          { value: "none", label: "بدون محافظ", priceFactor: 0 },
          { value: "matte", label: "سلفون مات فاقد رفلکس نور", priceFactor: 28000 },
          { value: "glossy", label: "سلفون براق شاین", priceFactor: 28000 },
        ],
      },
    ],
  },
  {
    id: "banner",
    name: "بنر سردرب و محیطی عریض",
    description: "چاپ بنرهای مقاوم در برابر اشعه آفتاب و باد، مناسب مصارف خیابانی، نمایشگاهی و تسلیت.",
    basePrice: 150000,
    imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&auto=format&fit=crop&q=80",
    options: [
      {
        id: "size",
        name: "ابعاد پهنا و ارتفاع",
        label: "متراژ",
        values: [
          { value: "1x1", label: "یک در یک متر (۱ مترمربع)", priceFactor: 0 },
          { value: "2x1", label: "دو در یک متر (۲ مترمربع)", priceFactor: 90000 },
          { value: "3x1", label: "سه در یک متر (۳ مترمربع)", priceFactor: 180000 },
          { value: "3x2", label: "سه در دو متر (۶ مترمربع)", priceFactor: 350000 },
        ],
      },
      {
        id: "paper",
        name: "تراکم و کیفیت بافت بنر",
        label: "متریال بنر",
        values: [
          { value: "banner-10oz", label: "بنر معمولی ۱۰ انس اکونومی", priceFactor: 0 },
          { value: "banner-13oz", label: "بنر ۱۳ انس کره‌ای ضخیم بلندمدت", priceFactor: 70000 },
          { value: "flex-china", label: "فلکسی پشت نور درجه دو", priceFactor: 190000 },
        ],
      },
      {
        id: "lamination",
        name: "امکانات پانچ و دوردوزی",
        label: "پانچ و حاشیه",
        values: [
          { value: "none", label: "ساده دور سفید بدون عملیات", priceFactor: 0 },
          { value: "punch", label: "پانچ فلزی چهارگوشه جهت آویز", priceFactor: 20000 },
          { value: "wooden-rod", label: "نصب چوب و کنف آویز", priceFactor: 35000 },
        ],
      },
    ],
  },
];

// Helper to load from LocalStorage
function getStored<T>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  if (!item) return defaultValue;
  try {
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initial Users DB
const initialUsers: User[] = [
  {
    id: "usr-client",
    name: "علی رضایی",
    email: "client@example.com",
    role: "client",
    phone: "09123456789",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Ali",
  },
  {
    id: "usr-admin",
    name: "سهراب سپهری (مدیریت چاپخانه)",
    email: "admin@example.com",
    role: "admin",
    phone: "09129998877",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
  },
];

// Initial Orders Mock
const initialOrders: Order[] = [
  {
    id: "ord-1",
    orderNumber: "N-۹۸۵۴",
    userId: "usr-client",
    userName: "علی رضایی",
    items: [
      {
        id: "item-1",
        productId: "business-card",
        productName: "کارت ویزیت خلاقانه",
        options: {
          size: "9x5",
          paper: "fancy",
          lamination: "uv-spot",
        },
        quantity: 500,
        unitPrice: 260000,
        totalPrice: 1300000,
        fileName: "business_draft_final.pdf",
      },
    ],
    totalAmount: 1300000,
    status: "preparing",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(), // 2 days ago
    shippingAddress: "تهران، میدان ونک، خیابان ملاصدرا، پلاک ۱۸، واحد ۲",
    paymentMethod: "درگاه مستقیم بانکی",
  },
  {
    id: "ord-2",
    orderNumber: "N-۹۷۲۰",
    userId: "usr-client",
    userName: "علی رضایی",
    items: [
      {
        id: "item-2",
        productId: "poster",
        productName: "پوستر عرید تبلیغاتی",
        options: {
          size: "50x70",
          paper: "glace-170",
          lamination: "matte",
        },
        quantity: 100,
        unitPrice: 245000,
        totalPrice: 2450000,
        fileName: "event_poster_v2.png",
      },
    ],
    totalAmount: 2450000,
    status: "shipped",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000 * 5).toISOString(), // 5 days ago
    shippingAddress: "تهران، خیابان ولیعصر، نرسیده به فاطمی، کوچه عبده، پلاک ۴",
    paymentMethod: "کارت به کارت",
    trackingNumber: "۴۵۹۸۶۲۱۹۸۳",
  },
];

// Initial Chat Sessions
const initialChatSessions: ChatSession[] = [
  {
    id: "chat-client-admin",
    userId: "usr-client",
    userName: "علی رضایی",
    userEmail: "client@example.com",
    unreadCount: 0,
    lastMessageAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    messages: [
      {
        id: "msg-1",
        senderId: "usr-client",
        senderName: "علی رضایی",
        text: "سلام وقت بخیر، کیفیت چاپ کتان فانتزی چظوره؟ برای کارت ویزیت شرکتی مناسبه؟",
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        isAdmin: false,
      },
      {
        id: "msg-2",
        senderId: "usr-admin",
        senderName: "پشتیبانی نقش و نگار",
        text: "درود بر شما علی عزیز. بله کتان بافت‌دار فانتزی فوق‌العاده شیک و باوقاره، اما چون یووی و سلفون نمیخوره رنگ‌های تیره روش ممکنه کدر بشن. برای طرح‌های با تم روشن و مینیمال بهترین گزینه‌ست.",
        createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        isAdmin: true,
      },
    ],
  },
];

// Initialize mock DB safely in memory or synchronize with LocalStorage
export const getMockUsers = (): User[] => getStored<User[]>("w2p_db_users", initialUsers);
export const saveMockUsers = (users: User[]) => setStored<User[]>("w2p_db_users", users);

export const getMockOrders = (): Order[] => getStored<Order[]>("w2p_db_orders", initialOrders);
export const saveMockOrders = (orders: Order[]) => setStored<Order[]>("w2p_db_orders", orders);

export const getMockChatSessions = (): ChatSession[] => getStored<ChatSession[]>("w2p_db_chats", initialChatSessions);
export const saveMockChatSessions = (chats: ChatSession[]) => setStored<ChatSession[]>("w2p_db_chats", chats);
