import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../../lib/store";
import { formatToman } from "../../../lib/persian";
import { Trash2, ShoppingBag, ChevronRight, CheckCircle, Store, Pencil, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function CartPage() {
  const { cart, usePersianDigits, updateCartItemQuantity, updateCartItemNote, removeFromCart } = useStore();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cart.reduce((acc, c) => acc + c.totalPrice, 0);
  // calculate mock tax (just visual if not already in unitPrice. Let's assume unitPrice already has tax from pricing.ts. So this is just a stub for visuals, or maybe we show it separately. Actually pricing.ts adds tax.)
  const tax = subtotal * 0.09; // Just for display of breakdown, or wait, total price in pricing already includes tax.
  // We'll leave tax out of here and rely on total price, or we recalculate. 
  
  const grandTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.toLowerCase() === "takhfif") {
      setDiscountAmount(subtotal * 0.1); // 10%
    }
  };

  // 2. Empty Cart UI Screen
  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto flex flex-col items-center gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mt-12">
        <Helmet><title>سبد خرید | چاپخانه</title></Helmet>
        <div className="p-4 bg-slate-50 text-slate-400 rounded-full">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-800">سبد خرید شما خالی است</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            محصولات مورد نیاز خود را پیکربندی کرده و جهت استعلام زنده قیمت به سبد خرید انتقال دهید.
          </p>
        </div>
        <Link 
          to="/catalog" 
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5"
        >
          <span>بازگشت به کاتالوگ محصولات</span>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Helmet><title>سبد خرید | چاپخانه</title></Helmet>
      {/* Page Title */}
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-100 mt-4">
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
           <ShoppingBag className="w-8 h-8 text-emerald-600" /> سبد خرید شما
        </h1>
        <p className="text-sm text-slate-500">جهت نهایی کردن سفارش، سبد خود را بررسی و تایید کنید.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list - Col 8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {cart.map((item) => (
            <div 
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:border-slate-300 transition-all font-sans"
            >
               <div className="flex items-start gap-6">
                  {/* Thumbnail Mock */}
                  <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden relative">
                     {item.thumbnail ? (
                        <img src={item.thumbnail} alt="artwork" className="w-full h-full object-cover" />
                     ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                           <CheckCircle className="w-6 h-6 text-emerald-500" />
                           <span className="text-[8px] font-bold">فایل تایید شد</span>
                        </div>
                     )}
                  </div>
                  
                  <div className="flex flex-col gap-2 flex-1">
                     <div className="flex justify-between items-start gap-4">
                        <h3 className="font-black text-slate-800 text-lg">{item.productTitle}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-xl"><Trash2 className="w-5 h-5" /></button>
                     </div>
                     <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                        {Object.entries(item.optionsLabels || {}).map(([key, val]) => (
                           <div key={key} className="flex items-center gap-1 text-[11px]">
                              <span className="text-slate-400">{key}:</span>
                              <span className="font-bold text-slate-700">{val}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-y border-slate-100 mt-2">
                   {/* Note */}
                   <div className="flex-1 relative">
                       <Pencil className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                       <input 
                         type="text" 
                         value={item.note || ""}
                         onChange={(e) => updateCartItemNote(item.id, e.target.value)}
                         placeholder="توضیحات برای چاپخانه (اختیاری)"
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ps-9 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-400"
                       />
                   </div>

                   {/* Quantity */}
                   <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-slate-500">تیراژ:</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                         <button onClick={() => updateCartItemQuantity(item.id, item.quantity - 100)} className="w-8 h-8 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors">-</button>
                         <span className="w-12 text-center text-xs font-bold font-mono text-slate-800">{usePersianDigits ? item.quantity.toLocaleString('fa-IR') : item.quantity}</span>
                         <button onClick={() => updateCartItemQuantity(item.id, item.quantity + 100)} className="w-8 h-8 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors">+</button>
                      </div>
                   </div>
               </div>

               <div className="flex justify-between items-center text-sm font-black text-slate-900 mt-2">
                  <span className="text-xs text-slate-500 font-bold">قیمت نهایی ردیف:</span>
                  <div className="flex items-center gap-2">
                     <span className="font-mono text-lg">{formatToman(item.totalPrice)}</span>
                  </div>
               </div>
            </div>
          ))}

          <Link to="/catalog" className="w-full py-4 border-2 border-dashed border-slate-300 rounded-3xl text-slate-500 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700 font-bold transition-all flex items-center justify-center gap-2">
             <span>+ افزودن محصول چاپی دیگر به سبد</span>
          </Link>
        </div>

        {/* Totals Box - Col 4 */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col gap-6">
            <h3 className="font-black text-lg pb-4 border-b border-slate-800">خلاصه پیش‌فاکتور</h3>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2 relative">
               <input 
                  type="text" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="کد تخفیف دارید؟"
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
               />
               <button type="submit" className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-xs font-bold rounded-xl transition-colors whitespace-nowrap">اعمال کد</button>
            </form>

            <div className="flex flex-col gap-4 text-sm mt-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>مبلغ کل سفارش‌ها:</span>
                <span className="font-mono">{formatToman(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                 <div className="flex justify-between items-center text-emerald-400">
                   <span>تخفیف اعمال شده:</span>
                   <span className="font-mono">-{formatToman(discountAmount)}</span>
                 </div>
              )}
              <div className="flex justify-between items-center text-slate-400">
                <span>هزینه بسته‌بندی و ارسال:</span>
                <span className="font-mono text-amber-500 text-[11px]">در مرحله بعد محاسبه می‌شود</span>
              </div>
              
              <div className="border-t border-slate-800 my-2" />
              
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-300">مبلغ قابل پرداخت:</span>
                <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">{formatToman(grandTotal)}</span>
              </div>
            </div>

            <button 
               onClick={() => navigate("/checkout")}
               className="w-full mt-4 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
            >
               <span>ادامه و ثبت مشخصات ارسال</span>
               <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl">
             <Store className="w-8 h-8 text-blue-500 shrink-0" />
             <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-blue-900">امکان تحویل حضوری تعبیه شده است!</span>
                <span className="text-[10px] text-blue-700">در مرحله بعد می‌توانید درخواست تحویل از چاپخانه (تهران) بدهید تا هزینه ارسال رایگان شود.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
