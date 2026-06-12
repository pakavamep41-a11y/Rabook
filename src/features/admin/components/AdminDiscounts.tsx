import { useState } from "react";
import { Percent, Plus, Settings2, Trash2, Edit2, Calendar } from "lucide-react";

export default function AdminDiscounts() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex flex-col">
             <h1 className="text-2xl font-black text-slate-800">کدهای تخفیف (کوپن‌ها)</h1>
             <span className="text-xs text-slate-500 font-bold mt-1">مدیریت پروموشن‌ها و تخفیفات مقطعی</span>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md w-fit">
            <Plus className="w-4 h-4" /> ایجاد کوپن جدید
          </button>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          <div className="overflow-x-auto text-right min-h-[400px]">
             <table className="w-full text-xs">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="p-4 font-bold">کد تخفیف</th>
                      <th className="p-4 font-bold">مقدار تخفیف</th>
                      <th className="p-4 font-bold hidden md:table-cell">تعداد استفاده شده</th>
                      <th className="p-4 font-bold">وضعیت / انقضا</th>
                      <th className="p-4 font-bold text-left">عملیات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                   <tr className="hover:bg-slate-50 transition-colors group/row">
                      <td className="p-4">
                         <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">NOROOZ1404</span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">15% (تا سقف 100,000 تومان)</td>
                      <td className="p-4 font-mono font-bold text-slate-500 hidden md:table-cell">12 / 100</td>
                      <td className="p-4">
                         <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold">فعال</span>
                      </td>
                      <td className="p-4">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </td>
                   </tr>
                   <tr className="hover:bg-slate-50 transition-colors group/row">
                      <td className="p-4">
                         <span className="font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">FREE-SHIP-22</span>
                      </td>
                      <td className="p-4 font-bold text-slate-800">ارسال رایگان (بالای 1 میلیون)</td>
                      <td className="p-4 font-mono font-bold text-slate-500 hidden md:table-cell">45 / ∞</td>
                      <td className="p-4">
                         <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-1 rounded font-bold">منقضی شده</span>
                      </td>
                      <td className="p-4">
                         <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                         </div>
                      </td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
