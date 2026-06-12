import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus, Search, ShoppingBag, Plus } from "lucide-react";
import { useStore } from "../../../lib/store";

export default function AdminOrderCreate() {
  const navigate = useNavigate();
  const { showAlert } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [search, setSearch] = useState("");

  const handleNext = () => {
    setStep(2);
  };

  const handleCreate = () => {
    showAlert("سفارش با موفقیت ثبت شد", "success");
    navigate("/admin/orders/ORD-NEW-123");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-3">
             <Link to="/admin/orders" className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
               <ArrowRight className="w-5 h-5" />
             </Link>
             <h1 className="text-xl font-black text-slate-800">
               ثبت سفارش جدید (توسط اپراتور)
             </h1>
          </div>
          {step === 2 && (
             <button onClick={handleCreate} className="px-6 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md">
               <ShoppingBag className="w-4 h-4" /> ذخیره ماشین حساب و ثبت نهایی
             </button>
          )}
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-8 min-h-[500px]">
          {/* Steps Indicator */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
             <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-emerald-100' : 'bg-slate-100'}`}>1</div>
                <span className="text-xs font-bold">انتخاب مشتری</span>
             </div>
             <div className="flex-1 h-px bg-slate-100" />
             <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-emerald-100' : 'bg-slate-100'}`}>2</div>
                <span className="text-xs font-bold">پیکربندی محصول</span>
             </div>
          </div>

          {step === 1 && (
             <div className="flex flex-col gap-6 max-w-xl mx-auto w-full pt-8 animate-fade-in">
                <div className="flex flex-col gap-2">
                   <label className="text-sm font-bold text-slate-800">جستجوی مشتری</label>
                   <div className="relative">
                      <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="شماره موبایل، نام یا کد اشتراک (مثال: 0912...)" 
                        className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                      />
                   </div>
                </div>

                {search && (
                   <div className="bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                      <div className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between items-center" onClick={handleNext}>
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-800">علی احمدی (چاپ و تبلیغات رویا)</span>
                            <span className="text-[10px] text-slate-500 font-mono mt-1">09123456789 - کد 8891</span>
                         </div>
                         <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl">انتخاب</button>
                      </div>
                   </div>
                )}

                <div className="relative flex items-center py-4">
                   <div className="flex-1 h-px bg-slate-100"></div>
                   <span className="px-4 text-[10px] font-bold text-slate-400">یا</span>
                   <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <div className="border border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors group">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-110 transition-transform">
                      <UserPlus className="w-6 h-6" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">ثبت مشتری جدید</span>
                      <span className="text-[11px] text-slate-500">اگر مشتری پیش از این خرید نداشته، حساب او را ایجاد کنید</span>
                   </div>
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="flex flex-col justify-center items-center py-20 gap-4 text-center animate-fade-in border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm text-emerald-500">
                   <Plus className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-2 max-w-sm">
                   <h3 className="text-sm font-bold text-slate-800">افزودن محصول به سفارش</h3>
                   <p className="text-[11px] text-slate-500 leading-relaxed font-medium">موتور قیمت‌گذاری و انتخاب ترکیب ویژگی‌ها در اینجا نمایش داده می‌شود. (متصل به کامپوننت ProductConfigurator فروشگاه)</p>
                </div>
             </div>
          )}
       </div>
    </div>
  );
}
