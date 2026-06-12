import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Settings2, Trash2, Edit2, Users } from "lucide-react";

const mockGroups = [
  { id: "1", name: "مشتری عادی", multiplier: 1.0, count: 1250, default: true },
  { id: "2", name: "همکار برنزی", multiplier: 0.95, count: 320, default: false },
  { id: "3", name: "همکار نقره‌ای", multiplier: 0.90, count: 180, default: false },
  { id: "4", name: "همکار طلایی", multiplier: 0.85, count: 45, default: false },
  { id: "5", name: "نمایندگی شهرستان", multiplier: 0.75, count: 12, default: false },
];

export default function AdminCustomerGroups() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-3">
             <Link to="/admin/customers" className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
               <ArrowRight className="w-5 h-5" />
             </Link>
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-800">گروه‌های کاربری (سطوح قیمت)</h1>
                <span className="text-xs text-slate-500 font-bold mt-1">تعریف ضریب تخفیف خودکار برای گروه‌های مختلف مشتریان</span>
             </div>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md w-fit">
            <Plus className="w-4 h-4" /> تعریف گروه جدید
          </button>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto text-right min-h-[400px]">
             <table className="w-full text-xs">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="p-4 font-bold">نام گروه کاربری</th>
                      <th className="p-4 font-bold">ضریب قیمتی (Multiplier)</th>
                      <th className="p-4 font-bold">تعداد کاربران در گروه</th>
                      <th className="p-4 font-bold">وضعیت پیش‌فرض</th>
                      <th className="p-4 font-bold text-left">عملیات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                   {mockGroups.map(group => (
                      <tr key={group.id} className="hover:bg-slate-50 transition-colors group/row">
                         <td className="p-4 font-bold text-slate-800">{group.name}</td>
                         <td className="p-4 font-mono font-bold text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200/50">{group.multiplier}x</span>
                         </td>
                         <td className="p-4 text-slate-600 flex items-center gap-2 mt-1">
                            <Users className="w-3 h-3 text-slate-400" /> {group.count} نفر
                         </td>
                         <td className="p-4">
                            {group.default ? 
                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-bold">پیش‌فرض ثبت‌نام</span> : 
                              <span className="text-slate-400 text-[10px]">-</span>
                            }
                         </td>
                         <td className="p-4">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                               <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="ویرایش ضریب">
                                  <Edit2 className="w-4 h-4" />
                               </button>
                               {!group.default && (
                                 <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="حذف گروه">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Bulk SMS/Message Section for Groups */}
       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col p-6 animate-fade-in gap-4 mt-4">
           <div className="flex items-center justify-between border-b border-slate-100 pb-4">
               <h2 className="font-black text-slate-800 flex items-center gap-2">ارسال پیامک گروهی (Bulk SMS)</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                 <label className="text-xs font-bold text-slate-600 transition-colors">گیرندگان (گروه هدف)</label>
                 <select className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all">
                    <option value="all">همه کاربران سایت</option>
                    {mockGroups.map(g => <option key={g.id} value={g.id}>فقط {g.name}</option>)}
                 </select>
              </div>
           </div>
           <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
              <label className="text-xs font-bold text-slate-600 transition-colors">متن پیامک (بدون پترن)</label>
              <textarea rows={4} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all resize-none" placeholder="کاربران گرامی سایت، چاپ و ارسال در ایام تعطیلات..."></textarea>
              <span className="text-[10px] text-slate-400">توجه: ارسال پیامک انبوه ممکن است زمان‌بر بوده و نیاز به اعتبار کافی در پنل پیامک داشته باشد.</span>
           </div>
           <button className="w-fit self-end px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-colors mt-2">مرحله بعد: محاسبه هزینه و ارسال</button>
       </div>
    </div>
  );
}
