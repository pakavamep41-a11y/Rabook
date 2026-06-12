import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { formatToman } from "../../../lib/persian";
import { Calendar, Download, TrendingUp, TrendingDown } from "lucide-react";

const monthlyData = [
  { name: 'فروردین', sales: 40000000 },
  { name: 'اردیبهشت', sales: 30000000 },
  { name: 'خرداد', sales: 20000000 },
  { name: 'تیر', sales: 27800000 },
  { name: 'مرداد', sales: 18900000 },
  { name: 'شهریور', sales: 23900000 },
  { name: 'مهر', sales: 34900000 },
];

export default function AdminReports() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-800">گزارشات و آمار فروش</h1>
            <span className="text-xs text-slate-500 font-bold mt-1">بررسی عملکرد انتشارات</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Calendar className="w-4 h-4" /> این ماه
            </button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> استخراج گزارش (PDF)
            </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 min-h-[350px]">
             <div className="flex items-center justify-between">
                <div className="col flex flex-col gap-1">
                   <span className="text-xs font-bold text-slate-500">مجموع فروش این دوره</span>
                   <span className="text-2xl font-black text-slate-800 font-mono">{formatToman(194500000)}</span>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <TrendingUp className="w-6 h-6" />
                </div>
             </div>
             <div className="flex-1 w-full" style={{ minHeight: "200px" }}>
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={monthlyData}>
                   <defs>
                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                   <Tooltip 
                      formatter={(val: number) => formatToman(val)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                   />
                   <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">تفکیک فروش بر اساس بسترهای چاپی</span>
             </div>
             {/* Mock visual bars */}
             <div className="flex flex-col gap-4 mt-2">
                {[
                  { name: 'چاپ افست (شیت اختصاصی)', per: 55, val: 105000000, color: 'bg-indigo-500' },
                  { name: 'چاپ دیجیتال (لیزری)', per: 30, val: 56000000, color: 'bg-emerald-500' },
                  { name: 'لارج فرمت (بنر و فلکس)', per: 15, val: 28000000, color: 'bg-amber-500' },
                ].map(b => (
                   <div key={b.name} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                         <span className="text-slate-700">{b.name}</span>
                         <span className="text-slate-500 font-mono">{formatToman(b.val)}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                         <div className={`${b.color} h-2.5 rounded-full`} style={{ width: `${b.per}%` }}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
}
