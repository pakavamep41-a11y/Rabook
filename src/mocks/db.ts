import { Category, Product, User, Order, ChatSession, CMSMenu, CMSSlider, CMSPage, BlogPost, FAQ } from "../types";

export const users: User[] = [
  { id: "1", name: "مدیر سیستم", email: "admin@print.ir", phone: "09120000000", role: "admin" },
  { id: "2", name: "علی حسینی", email: "ali@example.com", phone: "09121111111", role: "customer" },
  { id: "3", name: "مریم رضایی", email: "maryam@example.com", phone: "09122222222", role: "customer" },
];

export const categories: Category[] = [
  // Level 1
  { id: "commercial", title: "چاپ تجاری", slug: "commercial", parentId: null, level: 1, order: 1 },
  { id: "large-format", title: "لارج فرمت", slug: "large-format", parentId: null, level: 1, order: 2 },
  { id: "apparel", title: "پوشاک و هدایا", slug: "apparel", parentId: null, level: 1, order: 3 },

  // Level 2 - Commercial
  { id: "business-cards", title: "کارت ویزیت", slug: "business-cards", parentId: "commercial", level: 2, order: 1 },
  { id: "flyers", title: "تراکت", slug: "flyers", parentId: "commercial", level: 2, order: 2 },
  { id: "brochures", title: "بروشور", slug: "brochures", parentId: "commercial", level: 2, order: 3 },
  
  // Level 3 - Business Cards
  { id: "bc-laminate", title: "کارت ویزیت لمینت", slug: "laminate-cards", parentId: "business-cards", level: 3, order: 1 },
  { id: "bc-uv", title: "کارت ویزیت سلفون UV", slug: "uv-cards", parentId: "business-cards", level: 3, order: 2 },

  // Level 2 - Large Format
  { id: "banners", title: "بنر و فلکس", slug: "banners", parentId: "large-format", level: 2, order: 1 },
  { id: "stickers", title: "استیکر و مش", slug: "stickers", parentId: "large-format", level: 2, order: 2 },

  // Level 3 - Banners
  { id: "banner-glossy", title: "بنر براق", slug: "glossy-banners", parentId: "banners", level: 3, order: 1 },

  // Level 2 - Apparel
  { id: "tshirts", title: "تیشرت", slug: "tshirts", parentId: "apparel", level: 2, order: 1 },
];

export const products: Product[] = [
  {
    id: "prod-bc-lam-glossy",
    categoryId: "bc-laminate",
    slug: "laminate-glossy-card",
    title: "کارت ویزیت لمینت براق",
    excerpt: "کارت ویزیت با پوشش ضخیم و براق، ماندگاری بالا.",
    description: "کارت ویزیت لمینت براق یکی از مقاوم ترین انواع کارت ویزیت است...",
    coverImage: "https://placehold.co/600x400/eeeeee/333333?text=Laminate+Glossy",
    gallery: [],
    isActive: true,
    order: 1,
    options: [
      { id: "qty", type: "quantity", name: "quantity", label: "تیراژ", required: true, order: 1, behavior: "tiered", tiers: [1000, 2000, 5000] },
      { id: "corners", type: "select", name: "corners", label: "دور کارت", required: true, order: 2, choices: [
        { id: "round", label: "دور گرد", value: "round", priceImpact: 50000 },
        { id: "square", label: "دور تیز", value: "square" }
      ]},
      { id: "turnaround", type: "turnaround", name: "turnaround", label: "زمان تحویل", required: true, order: 3, choices: [
        { id: "normal", label: "۸ روز کاری", days: 8, priceImpact: 0 },
        { id: "express", label: "۳ روز کاری (فوری)", days: 3, priceImpact: 150000 }
      ]},
      { id: "file", type: "file", name: "designFile", label: "فایل طراحی", required: true, order: 4, accept: "image/*,.pdf", maxSizeMB: 20 }
    ],
    pricing: {
      type: "tier_table",
      tiers: [
        { quantity: 1000, unitPrice: 350 },
        { quantity: 2000, unitPrice: 320 },
        { quantity: 5000, unitPrice: 290 },
      ]
    }
  },
  {
    id: "prod-banner-13oz",
    categoryId: "banner-glossy",
    slug: "banner-13oz",
    title: "بنر ۱۳ اُنس ایرانی",
    excerpt: "مناسب برای بیلبورد و تبلیغات محیطی",
    description: "چاپ بنر با کیفیت بالا...",
    coverImage: "https://placehold.co/600x400/eeeeee/333333?text=Banner+13oz",
    gallery: [],
    isActive: true,
    order: 1,
    options: [
      { id: "dim", type: "dimensions", name: "size", label: "ابعاد (متر)", required: true, order: 1, minWidth: 1, maxWidth: 3.2, minHeight: 1, maxHeight: 50, unit: "m" },
      { id: "punch", type: "boolean", name: "punch", label: "پانچ کردن", required: false, order: 2 }
    ],
    pricing: {
      type: "area_based",
      basePricePerSquareMeter: 85000,
      minArea: 1
    }
  },
  {
    id: "prod-tshirt-cotton",
    categoryId: "tshirts",
    slug: "cotton-tshirt",
    title: "تیشرت ۱۰۰٪ پنبه",
    excerpt: "چاپ DTF روی تیشرت پنبه‌ای",
    description: "تیشرت پنبه ای...",
    coverImage: "https://placehold.co/600x400/eeeeee/333333?text=Cotton+Tshirt",
    gallery: [],
    isActive: true,
    order: 1,
    options: [
      { id: "qty_free", type: "quantity", name: "quantity", label: "تعداد", required: true, order: 1, behavior: "free", min: 1, max: 1000, step: 1 },
      { id: "color", type: "select", name: "color", label: "رنگ تیشرت", required: true, order: 2, choices: [
        { id: "white", label: "سفید", value: "white" },
        { id: "black", label: "مشکی", value: "black", priceImpact: 20000 }
      ]}
    ],
    pricing: {
      type: "formula",
      basePrice: 250000,
      formula: "basePrice * quantity"
    }
  }
];

export const orders: Order[] = [
  {
    id: "ORD-1001",
    customerId: "2",
    status: "delivered",
    items: [
      { id: "item1", productId: "prod-bc-lam-glossy", productTitle: "کارت ویزیت لمینت براق", quantity: 1000, specs: { corners: "round" }, files: ["abc.pdf"], unitPrice: 350, totalPrice: 350000 + 50000 }
    ],
    subtotal: 400000,
    shippingFee: 45000,
    total: 445000,
    createdAt: "2024-05-10T10:00:00Z",
    updatedAt: "2024-05-18T12:00:00Z"
  },
  {
    id: "ORD-1002",
    customerId: "2",
    status: "in_review",
    items: [
      { id: "item2", productId: "prod-banner-13oz", productTitle: "بنر ۱۳ اُنس ایرانی", quantity: 1, specs: { size: { width: 2, height: 3 }, punch: true }, files: [], unitPrice: 510000, totalPrice: 510000 }
    ],
    subtotal: 510000,
    shippingFee: 0,
    total: 510000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const chatSessions: ChatSession[] = [
  {
    id: "chat-ORD-1002",
    orderId: "ORD-1002",
    customerId: "2",
    adminId: "1",
    messages: [
      { id: "m1", sessionId: "chat-ORD-1002", senderId: "2", senderRole: "customer", type: "text", content: "سلام، من فایلم رو گم کردم، میشه بعدا بفرستم؟", createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: "m2", sessionId: "chat-ORD-1002", senderId: "1", senderRole: "admin", type: "file_request", reason: "لطفا فایل بنر را با کیفیت حداقل 72dpi ارسال کنید.", isFulfilled: false, createdAt: new Date(Date.now() - 3500000).toISOString() }
    ],
    lastUpdatedAt: new Date(Date.now() - 3500000).toISOString()
  }
];

export const cmsPages: CMSPage[] = [
  { 
    id: "home", 
    slug: "home", 
    title: "صفحه اصلی", 
    seo: { title: "چاپخانه آنلاین | سریع و با کیفیت", description: "بهترین خدمات چاپ آنلاین" },
    blocks: [
      {
        id: "b1",
        type: "hero_slider",
        props: {
          slides: [
            { imageUrl: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&w=1200&q=80", title: "چاپ افست با کیفیت", linkUrl: "/catalog" },
            { imageUrl: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80", title: "عصر جدید چاپ دیجیتال", linkUrl: "/catalog" }
          ]
        },
        order: 1
      },
      {
        id: "b2",
        type: "category_grid",
        props: {
          title: "دسته‌بندی‌های محبوب"
        },
        order: 2
      },
      {
        id: "b3",
        type: "product_carousel",
        props: {
          title: "محصولات پرفروش",
          categoryId: "business-cards"
        },
        order: 3
      },
      {
        id: "b4",
        type: "banner_row",
        props: {
          banners: [
            { imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80", title: "تخفیف ویژه سربرگ", linkUrl: "/catalog/letterheads" },
            { imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=600&q=80", title: "ارسال رایگان" }
          ]
        },
        order: 4
      },
      {
        id: "b5",
        type: "feature_list",
        props: {
          features: [
            { icon: "Shield", title: "تضمین کیفیت", description: "استفاده از بهترین متریال و ماشین‌آلات" },
            { icon: "Clock", title: "تحویل فوری", description: "ارسال به موقع سفارشات" },
            { icon: "CheckCircle", title: "قیمت رقابتی", description: "بهترین قیمت در بازار چاپ" }
          ]
        },
        order: 5
      }
    ]
  },
  { 
    id: "about", 
    slug: "about-us", 
    title: "درباره ما", 
    seo: { title: "درباره ما | چاپخانه", description: "توضیحات درباره چاپخانه" },
    blocks: [
      { id: "ab1", type: "rich_text", props: { html: "<h2>درباره چاپخانه ما</h2><p>توضیحات مربوط به چاپخانه در این قسمت قرار می‌گیرد.</p>" }, order: 1 }
    ]
  },
  { 
    id: "guidelines", 
    slug: "design-guidelines", 
    title: "راهنمای طراحی", 
    seo: { title: "راهنمای طراحی | چاپخانه" },
    blocks: [
      { id: "gd1", type: "rich_text", props: { html: "<h2>راهنمای طراحی فایل چاپ</h2><p>چگونه فایل چاپ را آماده کنیم؟ رعایت حاشیه برش و استفاده از مد رنگی CMYK الزامی است.</p>" }, order: 1 }
    ]
  }
];

export const cmsMenus: CMSMenu[] = [
  {
    id: "header", location: "header", items: [
      { id: "h1", label: "صفحه اصلی", url: "/", order: 1 },
      { id: "h2", label: "محصولات", url: "/products", order: 2 },
      { id: "h3", label: "راهنمای طراحی", url: "/page/design-guidelines", order: 3 },
    ]
  }
];

export const sliders: CMSSlider[] = [
  {
    id: "home-slider", title: "اسلایدر اصلی", slides: [
      { id: "s1", title: "چاپ ویژه نوروز", imageUrl: "https://placehold.co/1200x400?text=Banner+1", order: 1 },
      { id: "s2", title: "تخفیف کارت ویزیت", imageUrl: "https://placehold.co/1200x400?text=Banner+2", order: 2 }
    ]
  }
];

export const faqs: FAQ[] = [
  { id: "f1", question: "زمان تحویل چقدر است؟", answer: "بسته به نوع محصول بین ۱ تا ۵ روز.", order: 1 }
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "اهمیت طراحی لوگو در برندینگ کسب‌وکارهای مدرن",
    slug: "logo-design-importance",
    excerpt: "در دنیای پر رقابت امروز، داشتن یک لوگوی حرفه‌ای و جذاب می‌تواند تفاوت بزرگی در میزان فروش شما ایجاد کند.",
    contentHtml: "<p>در دنیای پر رقابت امروز، داشتن یک لوگوی حرفه‌ای و جذاب می‌تواند تفاوت بزرگی در میزان فروش شما ایجاد کند.</p><h2>چرا لوگو مهم است؟</h2><p>لوگو اولین چیزی است که مشتری از شما می‌بیند.</p>",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    author: "تیم تحریریه",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ["لوگو", "طراحی", "برندینگ"]
  },
  {
    id: "b2",
    title: "راهنمای انتخاب کاغذ مناسب برای کارت ویزیت و کاتالوگ",
    slug: "paper-selection-guide",
    excerpt: "انتخاب کاغذ یکی از مهم‌ترین تصمیمات در پروسه چاپ است. در این مقاله به بررسی انواع کاغذهای گلاسه و تحریر می‌پردازیم.",
    contentHtml: "<p>انتخاب کاغذ یکی از مهم‌ترین تصمیمات در پروسه چاپ است. در این مقاله به بررسی انواع کاغذهای گلاسه و تحریر می‌پردازیم.</p>",
    coverImage: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80",
    author: "متخصص چاپ",
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    tags: ["کاغذ", "کارت ویزیت", "آموزش چاپ"]
  },
  {
    id: "b3",
    title: "تفاوت چاپ دیجیتال و افست چیست؟ کدام بهتر است؟",
    slug: "digital-vs-offset-printing",
    excerpt: "اگر قصد چاپ تیراژ بالا دارید، افست بهترین انتخاب است اما برای سفارشات فوری، دیجیتال حرف اول را می‌زند.",
    contentHtml: "<p>اگر قصد چاپ تیراژ بالا دارید، افست بهترین انتخاب است اما برای سفارشات فوری، دیجیتال حرف اول را می‌زند.</p>",
    author: "مدیر فنی",
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    tags: ["افست", "دیجیتال", "مقایسه"]
  }
];
