import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Paperclip, Send } from "lucide-react";
import { useStore } from "../../../lib/store";

export default function NewTicketPage() {
  const { showAlert } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showAlert("تیکت شما با موفقیت ثبت شد.", "success");
      navigate("/account/tickets");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-2xl mx-auto w-full">
       <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <Link to="/account/tickets" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
             <ArrowRight className="w-5 h-5" />
          </Link>
          <h2 className="text-xl font-black text-slate-800">ثبت تیکت جدید</h2>
       </div>

       <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">دپارتمان</label>
                  <select className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" required>
                     <option value="">انتخاب کنید...</option>
                     <option value="tech">پشتیبانی فنی سایت</option>
                     <option value="sales">پیگیری سفارشات و فروش</option>
                     <option value="finance">مالی و حسابداری</option>
                     <option value="design">آتلیه طراحی</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">اولویت</label>
                  <select className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500" required>
                     <option value="normal">عادی</option>
                     <option value="high">بالا (فوری)</option>
                     <option value="critical">بحرانی</option>
                  </select>
               </div>
             </div>
             
             <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">موضوع تیکت</label>
                <input type="text" className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="خلاصه‌ای از مشکل یا درخواست..." required />
             </div>

             <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">متن پیام</label>
                <textarea rows={6} className="p-3 border border-slate-200 rounded-xl text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="توضیحات کامل را اینجا بنویسید..." required></textarea>
             </div>

             <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold cursor-pointer transition-colors w-fit">
                   <Paperclip className="w-4 h-4" />
                   <span>پیوست فایل</span>
                   <input type="file" className="hidden" />
                </label>
                <span className="text-[10px] text-slate-400 font-bold">حداکثر ۱۰ مگابایت (JPG, PNG, PDF)</span>
             </div>

             <div className="pt-6 border-t border-slate-100 mt-2 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2">
                   {isSubmitting ? "در حال ارسال..." : <> <Send className="w-4 h-4" /> ارسال تیکت </>}
                </button>
             </div>
          </form>
       </div>
    </div>
  );
}
