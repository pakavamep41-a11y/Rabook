import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "../../../lib/api";
import { Product, PaginatedResponse, Category } from "../../../types";
import { formatToman } from "../../../lib/persian";
import { useStore } from "../../../lib/store";
import { Shield, Truck, Sparkles, Clock, Paintbrush, FileCheck, ArrowUpRight, Filter, ChevronDown, Check, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function CatalogHome() {
  const { usePersianDigits } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const catFilter = searchParams.get("cat");
  
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    }
  });

  const { data: productsPage, isLoading, error } = useQuery<PaginatedResponse<Product>>({
    queryKey: ["catalogProducts", catFilter],
    queryFn: async () => {
      const params: any = { limit: 200 }; // Get enough to sort client side
      if (catFilter) params.categoryId = catFilter;
      const res = await api.get("/products", { params });
      return res.data;
    },
  });
  
  const products = productsPage?.data || [];

  const getBasePrice = (p: Product) => p.pricing.type === "tier_table" ? p.pricing.tiers[0].unitPrice : (p.pricing.type === "formula" ? p.pricing.basePrice : (p.pricing.type === "area_based" ? p.pricing.basePricePerSquareMeter : 0));
  
  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    sorted.sort((a, b) => {
      if (sortBy === "newest") {
        return a.order - b.order; // Use order property instead
      }
      
      if (sortBy === "price_asc") {
        return getBasePrice(a) - getBasePrice(b);
      }
      if (sortBy === "price_desc") {
        return getBasePrice(b) - getBasePrice(a);
      }
      return 0;
    });
    return sorted;
  }, [products, sortBy]);

  const finalProducts = useMemo(() => {
    let filtered = [...sortedProducts];
    const minP = parseInt(minPrice.replace(/\D/g, "") || "0");
    const maxP = parseInt(maxPrice.replace(/\D/g, "") || "0");
    
    if (minP > 0) {
      filtered = filtered.filter(p => getBasePrice(p) >= minP);
    }
    if (maxP > 0) {
      filtered = filtered.filter(p => getBasePrice(p) <= maxP);
    }
    return filtered;
  }, [sortedProducts, minPrice, maxPrice]);

  const toggleCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCategoryClick = (slug: string) => {
    if (catFilter === slug) {
       searchParams.delete("cat");
    } else {
       searchParams.set("cat", slug);
    }
    setSearchParams(searchParams);
    setIsMobileFilterOpen(false);
  };

  const getFilteredCategoryName = useMemo(() => {
    if (!catFilter || !categoriesData) return null;
    const findCat = (cats: Category[]): Category | null => {
      for (const c of cats) {
        if (c.slug === catFilter || c.id === catFilter) return c;
        if (c.children) {
          const found = findCat(c.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findCat(categoriesData)?.title;
  }, [catFilter, categoriesData]);

  return (
    <div className="flex flex-col gap-16">
      <Helmet>
        <title>کاتالوگ محصولات چاپی | چاپخانه آنلاین</title>
        <meta name="description" content="محصولات چاپی نظیر کارت ویزیت، تراکت، بروشور و ... را با بالاترین کیفیت انتخاب و چاپ کنید." />
        <meta property="og:title" content="کاتالوگ محصولات چاپی | چاپخانه آنلاین" />
        <meta property="og:description" content="با استفاده از ادیتور آنلاین و ماشین‌آلات پیشرفته، سفارش خود را فوری دریافت کنید." />
        {products && products.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${window.location.origin}/product/${product.slug || product.id}`,
                "name": product.title
              }))
            })}
          </script>
        )}
      </Helmet>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_40%)]" />
        <div className="relative z-10 max-w-2xl flex flex-col gap-6">
          <div className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>پیشرو در سیستم چاپ آنلاین وب‌توپرینت فلات ایران</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            سفارش آنلاین چاپ با محاسبه آنی قیمت
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            کارت ویزیت، پوستر، بروشور و بنرهای عریض خود را آنلاین طراحی و سفارشی‌سازی کنید. با آپلود مستقیم طرح گرافیکی، قیمت نهایی را در کمتر از ۱ ثانیه مشاهده و ثبت سفارش نمایید.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <a 
              href="#catalog"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-900/10 hover:translate-y-[-2px] text-sm"
            >
              دیدن لیست محصولات چاپی
            </a>
            <Link 
              to="/account"
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl font-bold border border-slate-700 transition-all text-sm"
            >
              پیگیری سفارش قبلی
            </Link>
          </div>
        </div>

        {/* Abstract design elements */}
        <div className="absolute bottom-[-50px] left-[5%] w-72 h-72 rounded-full border border-white/5 pointer-events-none hidden lg:block" />
        <div className="absolute bottom-[-100px] left-[15%] w-96 h-96 rounded-full border border-emerald-500/5 pointer-events-none hidden lg:block" />
      </section>

      {/* Trust & Advantages Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-slate-800">پیش‌فاکتور سریع و آنی</h3>
            <p className="text-xs text-slate-500 leading-relaxed">با تغییر هر گزینه (همچون تیراژ، روکش، کاغذ) قیمت تغییر خواهد کرد.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Paintbrush className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-slate-800">آپلود آسان فایل</h3>
            <p className="text-xs text-slate-500 leading-relaxed">فرمت‌های PDF, ZIP, RAW و تصویر را به راحتی آپلود و بررسی کنید.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-slate-800">تضمین کیفیت چاپ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">استفاده از ماشین‌آلات صنعتی مدرن با خروجی رنگی ۱۰۰٪ کالیبره.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-start gap-4 shadow-sm">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-slate-800">ارسال به سراسر کشور</h3>
            <p className="text-xs text-slate-500 leading-relaxed">ارسال سریع پست و تیپاکس به تمام شهرستان‌ها در بسته‌بندی عالی.</p>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="bg-slate-100/50 rounded-2xl p-8">
        <div className="max-w-3xl mx-auto text-center mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-slate-800">راهنمای سفارش چاپ در ۳ گام ساده</h2>
          <p className="text-xs text-slate-500">برای خروجی بهتر تصاویر خود را در فرمت CMYK ۳۰۰dpi خروجی بگیرید</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm relative text-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center font-mono">
              {usePersianDigits ? "۱" : "1"}
            </div>
            <h4 className="font-bold text-slate-800 mb-2 mt-2">انتخاب و پیکربندی محصول</h4>
            <p className="text-xs text-slate-500 leading-relaxed">نوع کاغذ، ابعاد کار، سلفون یا گلاسه بودن، خط برش و تعداد را در صفحه اختصاصی محصول مشخص کنید.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm relative text-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center font-mono">
              {usePersianDigits ? "۲" : "2"}
            </div>
            <h4 className="font-bold text-slate-800 mb-2 mt-2">آپلود طرح گرافیکی و فایل</h4>
            <p className="text-xs text-slate-500 leading-relaxed">طرح لایه‌باز فتوشاپ، ایلاستریتور، یا طرح باکیفیت JPG/PDF کارت خود را در کادر آپلود قرار دهید.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm relative text-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center font-mono">
              {usePersianDigits ? "۳" : "3"}
            </div>
            <h4 className="font-bold text-slate-800 mb-2 mt-2">پرداخت و دریافت درب منزل</h4>
            <p className="text-xs text-slate-500 leading-relaxed">روش پرداخت و اطلاعات فرستنده را به همراه آدرس پستی ثبت کرده و سفارش را تحویل بگیرید.</p>
          </div>
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section id="catalog" className="scroll-mt-24">
        <div className="border-b border-slate-200/70 pb-5 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-black text-slate-800">کاتالوگ محصولات قابل سفارش</h2>
            <p className="text-xs text-slate-500">جهت استعلام قیمت اختصاصی روی دکمه هر محصول کلیک کنید</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsMobileFilterOpen(true)}
               className="lg:hidden flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 transition-colors"
             >
               <Filter className="w-4 h-4" />
               <span>فیلترها</span>
             </button>
             
             <div className="relative group">
                <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 transition-colors">
                  <ArrowUpDown className="w-4 h-4 text-emerald-600" />
                  <span>
                    {sortBy === "newest" ? "جدیدترین‌ها" : sortBy === "price_asc" ? "ارزان‌ترین" : "گران‌ترین"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </button>
                <div className="absolute top-11 end-0 bg-white border border-slate-100 rounded-xl shadow-xl w-48 py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                   <button onClick={() => setSortBy("newest")} className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 ${sortBy === "newest" ? "text-emerald-700 font-bold bg-emerald-50/50" : "text-slate-600"}`}>جدیدترین‌ها</button>
                   <button onClick={() => setSortBy("price_asc")} className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 ${sortBy === "price_asc" ? "text-emerald-700 font-bold bg-emerald-50/50" : "text-slate-600"}`}>ارزان‌ترین به گران‌ترین</button>
                   <button onClick={() => setSortBy("price_desc")} className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 ${sortBy === "price_desc" ? "text-emerald-700 font-bold bg-emerald-50/50" : "text-slate-600"}`}>گران‌ترین به ارزان‌ترین</button>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Desktop Sidebar Filters */}
          <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col gap-6 sticky top-24">
             <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-slate-800 mb-4 pb-4 border-b border-slate-50">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  فیلتر دسته‌بندی
                </div>
                
                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pl-2">
                   <button 
                     onClick={() => handleCategoryClick("all")}
                     className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm ${!catFilter || catFilter === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}
                   >
                      <span>همه محصولات</span>
                      {(!catFilter || catFilter === 'all') && <Check className="w-4 h-4" />}
                   </button>
                   
                   {categoriesData?.map(cat => {
                      const hasChildren = cat.children && cat.children.length > 0;
                      const isExpanded = expandedCategories.has(cat.id);
                      return (
                      <div key={cat.id} className="flex flex-col gap-1">
                         <div className={`flex items-center justify-between rounded-xl transition-all ${catFilter === cat.slug ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}>
                           <button 
                             onClick={() => handleCategoryClick(cat.slug)}
                             className="px-3 py-2.5 text-sm flex-1 text-right"
                           >
                              {cat.title}
                           </button>
                           {hasChildren && (
                             <button
                               onClick={(e) => toggleCategory(cat.id, e)}
                               className="p-2 mr-2 text-slate-400 hover:text-slate-700"
                             >
                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                             </button>
                           )}
                           {!hasChildren && catFilter === cat.slug && <Check className="w-4 h-4 ml-3" />}
                         </div>
                         {hasChildren && isExpanded && (
                            <div className="flex flex-col gap-1 pr-4 border-r border-slate-100 mr-4">
                               {cat.children!.map(child => (
                                 <button 
                                   key={child.id}
                                   onClick={() => handleCategoryClick(child.slug)}
                                   className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm ${catFilter === child.slug ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-medium'}`}
                                 >
                                    <span>{child.title}</span>
                                    {catFilter === child.slug && <Check className="w-3.5 h-3.5" />}
                                 </button>
                               ))}
                            </div>
                         )}
                      </div>
                   )})}
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-slate-800 mb-4 pb-4 border-b border-slate-50">
                  <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                  محدوده قیمت
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">از قیمت (تومان)</label>
                    <input 
                      type="text" 
                      placeholder="مثال: 10,000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">تا قیمت (تومان)</label>
                    <input 
                      type="text" 
                      placeholder="مثال: 500,000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  {(minPrice || maxPrice) && (
                    <button 
                      onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 w-fit"
                    >
                       حذف فیلتر قیمت
                    </button>
                  )}
                </div>
             </div>
          </aside>

          {/* Main Content Grid */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl border border-slate-100 h-[26rem]" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-center text-rose-800">
                خطایی در دریافت لیست قیمت کاتالوگ ایجاد شده است. لطفاً مروگر خود را رفرش نمایید.
              </div>
            ) : finalProducts.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Filter className="w-8 h-8 text-slate-300" />
                 </div>
                 <h3 className="text-slate-800 font-bold text-lg">محصولی یافت نشد</h3>
                 <p className="text-slate-500 text-sm">هیچ محصولی با فیلترهای انتخاب شده مطابقت ندارد.</p>
                 <button onClick={() => {searchParams.delete("cat"); setSearchParams(searchParams);}} className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">نمایش همه محصولات</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {finalProducts.map((prod) => {
                  const basePrice = prod.pricing.type === "tier_table" ? prod.pricing.tiers[0].unitPrice : (prod.pricing.type === "formula" ? prod.pricing.basePrice : (prod.pricing.type === "area_based" ? prod.pricing.basePricePerSquareMeter : 0));
                  return (
                  <div 
                    key={prod.id} 
                    className="bg-white rounded-3xl border border-slate-100 p-4 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 isolate">
                      <img 
                        src={prod.coverImage} 
                        referrerPolicy="no-referrer" 
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm shadow px-2.5 py-1 text-[11px] font-bold text-emerald-700 rounded-lg">
                        شروع از {formatToman(basePrice)}
                      </div>
                    </div>

                    {/* Info and action */}
                    <div className="flex flex-col gap-1.5 flex-1">
                      <h3 className="font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors text-base">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {prod.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between gap-2 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400">قیمت پایه</span>
                        <span className="text-xs font-bold text-slate-700">{formatToman(basePrice)}</span>
                      </div>
                      <Link 
                        to={`/product/${prod.id}`}
                        className="flex items-center gap-1 bg-slate-900 border border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap"
                      >
                        <span>سفارش چاپ</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )})}
              </div>
            )}
            
            {/* Active filters display on mobile */}
            {catFilter && catFilter !== "all" && (
                <div className="lg:hidden mt-6 bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <span className="text-sm font-bold text-emerald-800">دسته‌بندی:</span>
                     <span className="text-sm text-emerald-700">{getFilteredCategoryName || catFilter}</span>
                   </div>
                   <button onClick={() => {searchParams.delete("cat"); setSearchParams(searchParams);}} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase flex items-center gap-1 transition-colors bg-white px-2 py-1 rounded-lg border border-emerald-200">
                     <X className="w-3.5 h-3.5" />
                     حذف فیلتر
                   </button>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl z-[210] flex flex-col lg:hidden border-l border-slate-100"
            >
               <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                 <div className="flex items-center gap-2 text-slate-800 font-black">
                   <Filter className="w-5 h-5 text-emerald-600" />
                   <span>فیلتر محصولات</span>
                 </div>
                 <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                 
                 {/* Categories */}
                 <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                       دسته‌بندی
                    </h3>
                    <div className="flex flex-col gap-2 relative">
                        <button 
                          onClick={() => handleCategoryClick("all")}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-sm ${!catFilter || catFilter === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'bg-slate-50 border border-transparent text-slate-600 font-medium'}`}
                        >
                           <span>همه محصولات</span>
                           {(!catFilter || catFilter === 'all') && <Check className="w-4 h-4" />}
                        </button>
                        
                        {categoriesData?.map(cat => {
                          const hasChildren = cat.children && cat.children.length > 0;
                          const isExpanded = expandedCategories.has(cat.id);
                          return (
                          <div key={cat.id} className="flex flex-col gap-1">
                              <div className={`flex items-center justify-between rounded-xl transition-all ${catFilter === cat.slug ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'bg-slate-50/50 border border-transparent hover:bg-slate-100 text-slate-700 font-medium'}`}>
                                <button 
                                  onClick={() => handleCategoryClick(cat.slug)}
                                  className="px-3 py-2.5 text-sm flex-1 text-right"
                                >
                                  {cat.title}
                                </button>
                                {hasChildren && (
                                  <button
                                    onClick={(e) => toggleCategory(cat.id, e)}
                                    className="p-2 mr-2 text-slate-400 hover:text-slate-700"
                                  >
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                                {!hasChildren && catFilter === cat.slug && <Check className="w-4 h-4 ml-3" />}
                              </div>
                              {hasChildren && isExpanded && (
                                <div className="flex flex-col gap-1 pr-6 border-r-2 border-slate-100/60 mr-4 py-1">
                                    {cat.children!.map(child => (
                                      <button 
                                        key={child.id}
                                        onClick={() => handleCategoryClick(child.slug)}
                                        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all text-sm ${catFilter === child.slug ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'hover:bg-slate-50 text-slate-500 font-medium'}`}
                                      >
                                        <span>{child.title}</span>
                                        {catFilter === child.slug && <Check className="w-3.5 h-3.5" />}
                                      </button>
                                    ))}
                                </div>
                              )}
                          </div>
                        )})}
                    </div>
                 </div>

                 <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                       محدوده قیمت
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">از قیمت (تومان)</label>
                        <input 
                          type="text" 
                          placeholder="مثال: 10,000"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1.5 block">تا قیمت (تومان)</label>
                        <input 
                          type="text" 
                          placeholder="مثال: 500,000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 text-sm px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      {(minPrice || maxPrice) && (
                        <button 
                          onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                          className="text-xs font-bold text-rose-500 hover:text-rose-600 w-fit"
                        >
                           حذف فیلتر قیمت
                        </button>
                      )}
                    </div>
                 </div>
               </div>
               
               <div className="p-4 border-t border-slate-100 bg-white">
                 <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-[0_5px_15px_rgba(15,23,42,0.1)]">
                   مشاهده محصولات
                 </button>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function toPersian(val: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(val).replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}
