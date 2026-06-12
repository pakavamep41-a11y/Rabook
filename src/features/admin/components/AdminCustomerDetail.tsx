import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, UserCheck, Wallet, History, MapPin, Ticket, ShieldAlert } from "lucide-react";
import { formatToman } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const { showAlert } = useStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wallet' | 'tickets'>('profile');

  const handleImpersonate = () => {
     showAlert("در حال ورود به حساب مشتری...", "success");
     // Logic to switch user session visually
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-3">
             <Link to="/admin/customers" className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
               <ArrowRight className="w-5 h-5" />
             </Link>
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-800">پروفایل مشتری: علی احمدی</h1>
                <span className="text-xs text-slate-500 font-bold mt-1 font-mono">09123456789 - گروه: همکار طلایی</span>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={handleImpersonate} className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-amber-100 transition-colors shadow-sm">
               <UserCheck className="w-4 h-4" /> ورود به جای مشتری
             </button>
          </div>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none">
             {[
                { id: 'profile', label: 'پروفایل و آدرس‌ها', icon: MapPin },
                { id: 'orders', label: 'تاریخچه سفارشات', icon: History },
                { id: 'wallet', label: 'تراکنش‌های کیف پول', icon: Wallet },
                { id: 'tickets', label: 'تیکت‌های پشتیبانی', icon: Ticket }
             ].map(tab => (
                <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
                >
                   <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
             ))}
          </div>

          <div className="p-6">
             {activeTab === 'profile' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                         <label className="text-xs font-bold text-slate-600 transition-colors">نام و نام خانوادگی</label>
                         <input type="text" defaultValue="علی احمدی" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                         <label className="text-xs font-bold text-slate-600 transition-colors">گروه کاربری (سطح قیمت)</label>
                         <select className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all">
                            <option>مشتری عادی</option>
                            <option selected>همکار طلایی (-15%)</option>
                            <option>نمایندگی شهرستان (-25%)</option>
                         </select>
                      </div>
                   </div>
                   
                   <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-slate-800">آدرس‌های ثبت شده</h3>
                      <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-600 hidden sm:block">
                         تهران، میدان انقلاب، خیابان کارگر جنوبی، کوچه رشتچی، پلاک 12 واحد 4
                      </div>
                   </div>

                   <button className="self-end px-6 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">ذخیره تغییرات پروفایل</button>
                </div>
             )}

             {activeTab === 'wallet' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                   <div className="flex justify-between items-center p-6 bg-slate-800 text-white rounded-2xl shadow-sm">
                      <div className="flex flex-col gap-1">
                         <span className="text-slate-400 text-xs font-bold">موجودی فعلی کیف پول</span>
                         <span className="text-2xl font-black font-mono">{formatToman(1500000)}</span>
                      </div>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors">
                        افزایش / کسر موجودی دستی
                      </button>
                   </div>
                   <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <table className="w-full text-xs text-right">
                         <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                               <th className="p-4 font-bold">تاریخ</th>
                               <th className="p-4 font-bold">مبلغ (تومان)</th>
                               <th className="p-4 font-bold">نوع</th>
                               <th className="p-4 font-bold">بابت / توضیحات</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 font-medium">
                            <tr className="hover:bg-slate-50">
                               <td className="p-4 font-mono text-slate-500">1403/02/15 - 10:30</td>
                               <td className="p-4 font-mono font-bold text-emerald-600">+ 2,000,000</td>
                               <td className="p-4"><span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">واریز حواله</span></td>
                               <td className="p-4 text-slate-600">تایید فیش واریزی توسط مدیریت (فیش #5821)</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                               <td className="p-4 font-mono text-slate-500">1403/02/10 - 15:45</td>
                               <td className="p-4 font-mono font-bold text-rose-600">- 500,000</td>
                               <td className="p-4"><span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded font-bold">کسر بابت سفارش</span></td>
                               <td className="p-4 text-slate-600">پرداخت فاکتور فروش #ORD-9821-44A</td>
                            </tr>
                            <tr className="hover:bg-slate-50">
                               <td className="p-4 font-mono text-slate-500">1402/11/20 - 09:15</td>
                               <td className="p-4 font-mono font-bold text-emerald-600">+ 1,000,000</td>
                               <td className="p-4"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">شارژ آنلاین</span></td>
                               <td className="p-4 text-slate-600">درگاه پرداخت زرین پال - موفق</td>
                            </tr>
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {activeTab === 'orders' && (
                 <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <History className="w-12 h-12 opacity-50" />
                    <span className="text-xs font-bold">تاریخچه سفارشات (مشابه جدول سفارشات اصلی ولی فیلتر شده)</span>
                 </div>
             )}
             
             {activeTab === 'tickets' && (
                 <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <Ticket className="w-12 h-12 opacity-50" />
                    <span className="text-xs font-bold">لیست تیکت‌های پشتیبانی قبلی این کاربر</span>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
}
