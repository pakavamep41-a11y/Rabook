import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import { Product, PaginatedResponse } from "../../../types";
import { formatToman } from "../../../lib/persian";
import { useStore } from "../../../lib/store";
import { Shield, Truck, Sparkles, Clock, Paintbrush, FileCheck, ArrowUpRight } from "lucide-react";

export default function CatalogHome() {
  const { usePersianDigits } = useStore();

  const { data: productsPage, isLoading, error } = useQuery<PaginatedResponse<Product>>({
    queryKey: ["catalogProducts"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    },
  });
  
  const products = productsPage?.data || [];

  return (
    <div className="flex flex-col gap-16">
      
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
          <span className="text-xs font-semibold text-slate-400 font-mono">
            {products ? `${usePersianDigits ? toPersian(products.length) : products.length} CATS AVAILABLE` : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 h-96" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-center text-rose-800">
            خطایی در دریافت لیست قیمت کاتالوگ ایجاد شده است. لطفاً مروگر خود را رفرش نمایید.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod) => {
              const basePrice = prod.pricing.type === "tier_table" ? prod.pricing.tiers[0].unitPrice : (prod.pricing.type === "formula" ? prod.pricing.basePrice : (prod.pricing.type === "area_based" ? prod.pricing.basePricePerSquareMeter : 0));
              return (
              <div 
                key={prod.id} 
                className="bg-white rounded-3xl border border-slate-100 p-4 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
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
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 h-10">
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
                    className="flex items-center gap-1 bg-slate-900 border border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all"
                  >
                    <span>سفارش چاپ</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )})}
          </div>
        )}
      </section>
    </div>
  );
}

function toPersian(val: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(val).replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}
