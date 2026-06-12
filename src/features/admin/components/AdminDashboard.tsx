import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingBag, DollarSign, CreditCard, MessageSquare, Printer, Check, X,
  ArrowUpRight, ArrowDownRight, Clock
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell
} from "recharts";
import { formatToman } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

const revenueData = [
  { date: '1402/10/01', revenue: 12000000 },
  { date: '1402/10/02', revenue: 8500000 },
  { date: '1402/10/03', revenue: 15200000 },
  { date: '1402/10/04', revenue: 9800000 },
  { date: '1402/10/05', revenue: 21000000 },
  { date: '1402/10/06', revenue: 18500000 },
  { date: '1402/10/07', revenue: 24300000 },
];

const OrderFunnelData = [
  { name: 'در انتظار پرداخت', count: 45, fill: '#64748b' },
  { name: 'در حال بررسی', count: 28, fill: '#eab308' },
  { name: 'در حال تولید', count: 86, fill: '#a855f7' },
  { name: 'آماده ارسال', count: 12, fill: '#ec4899' },
  { name: 'ارسال شده', count: 154, fill: '#10b981' },
];

const pendingReceipts = [
  { id: 1, orderId: "10543", amount: 2500000, date: "1402/10/08 14:30", customer: "علی محمدی", bank: "ملت" },
  { id: 2, orderId: "10544", amount: 1850000, date: "1402/10/08 12:15", customer: "فروشگاه بهار", bank: "سامان" },
];

const latestOrders = [
  { id: "10545", customer: "شرکت آلفا", items: "کارت ویزیت + ۳ مورد دیگر", total: 4500000, status: "pending_payment", date: "10 دقیقه پیش" },
  { id: "10546", customer: "رضا کریمی", items: "تراکت A5", total: 1200000, status: "printing", date: "1 ساعت پیش" },
  { id: "10547", customer: "نشر نوین", items: "کاتالوگ ۲۰ صفحه‌ای", total: 18500000, status: "ready", date: "2 ساعت پیش" },
];

export default function AdminDashboard() {
  const { showAlert } = useStore();
  const [receipts, setReceipts] = useState(pendingReceipts);

  const handleApproveReceipt = (id: number) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
    showAlert("فیش پرداختی تایید شد و سفارش در جریان افتاد.", "success");
  };

  const handleRejectReceipt = (id: number) => {
    setReceipts(prev => prev.filter(r => r.id !== id));
    showAlert("فیش پرداختی رد شد.", "error");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_payment": return <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold">در انتظار پرداخت</span>;
      case "printing": return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold">در حال چاپ</span>;
      case "ready": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold">آماده ارسال</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-800">داشبورد مدیریت</h1>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-slate-900 border border-slate-800 text-white text-xs font-bold rounded-xl transition-colors">
               دانلود گزارش PDF
             </button>
          </div>
       </div>

       {/* KPIs */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col gap-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
             <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-bold text-slate-500">فروش و سفارشات امروز</span>
                 <span className="text-xl font-black text-slate-800">{formatToman(45000000)}</span>
               </div>
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                 <ShoppingBag className="w-5 h-5" />
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold">
               <span className="text-emerald-600 flex items-center bg-emerald-50 px-1 rounded"><ArrowUpRight className="w-3 h-3" /> 12%</span>
               <span className="text-slate-400">نسبت به دیروز (۱۴ سفارش)</span>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col gap-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
             <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-bold text-slate-500">در انتظار تایید پرداخت</span>
                 <span className="text-xl font-black text-slate-800">۸ مورد</span>
               </div>
               <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                 <CreditCard className="w-5 h-5" />
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold">
               <span className="text-slate-500">مجموع تراکنش‌ها: {formatToman(12400000)}</span>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col gap-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-purple-500" />
             <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-bold text-slate-500">سفارشات در حال تولید</span>
                 <span className="text-xl font-black text-slate-800">۸۶ فرم</span>
               </div>
               <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                 <Printer className="w-5 h-5" />
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold">
               <span className="text-purple-600 flex items-center bg-purple-50 px-1 rounded"><ArrowUpRight className="w-3 h-3" /> 5%</span>
               <span className="text-slate-400">در مقایسه با هفته قبل</span>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col gap-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
             <div className="flex justify-between items-start">
               <div className="flex flex-col gap-1">
                 <span className="text-[11px] font-bold text-slate-500">تیکت و چت بی‌پاسخ</span>
                 <span className="text-xl font-black text-slate-800">۱۲ مورد</span>
               </div>
               <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                 <MessageSquare className="w-5 h-5" />
               </div>
             </div>
             <div className="flex items-center gap-1.5 text-[10px] font-bold">
               <span className="text-rose-600 font-mono">میانگین زمان پاسخ: 45 دقیقه</span>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2">
             <h3 className="text-sm font-bold text-slate-800 mb-6">درآمد ۷ روز گذشته (تومان)</h3>
             <div className="h-64 w-full" dir="ltr">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorRevanue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b', fontFamily: 'inherit'}} axisLine={false} tickLine={false} />
                   <YAxis tick={{fontSize: 10, fill: '#64748b', fontFamily: 'inherit'}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                   <Tooltip 
                     formatter={(value: number) => [formatToman(value), "درآمد"]}
                     labelStyle={{fontFamily: 'inherit', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px'}}
                     contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', fontSize: '12px'}}
                   />
                   <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevanue)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Orders Funnel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-6">وضعیت سفارشات جاری</h3>
             <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart layout="vertical" data={OrderFunnelData} margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#475569', fontFamily: 'inherit'}} width={80} />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        formatter={(value: number) => [value, "تعداد سفارش"]}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'inherit', fontSize: '12px'}}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={30}>
                        {
                          OrderFunnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))
                        }
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Pending Receipts */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   <Clock className="w-4 h-4 text-amber-500" />
                   فیش‌های در انتظار تایید
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">مشاهده همه</span>
             </div>
             <div className="flex flex-col gap-3">
                {receipts.map(rec => (
                   <div key={rec.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1.5 flex-1">
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-700">سفارش #{rec.orderId}</span>
                            <span className="text-[10px] text-slate-500">- {rec.customer}</span>
                         </div>
                         <div className="flex gap-4 text-[10px] font-bold text-slate-500">
                            <span className="font-mono text-slate-800">{formatToman(rec.amount)}</span>
                            <span>بانک {rec.bank}</span>
                            <span className="font-mono">{rec.date}</span>
                         </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                         <button onClick={() => handleApproveReceipt(rec.id)} className="p-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg transition-colors" title="تایید">
                            <Check className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleRejectReceipt(rec.id)} className="p-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-lg transition-colors" title="رد">
                            <X className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
                {receipts.length === 0 && (
                   <div className="text-center p-8 text-xs font-bold text-slate-400">تمام فیش‌ها بررسی شده‌اند.</div>
                )}
             </div>
          </div>

          {/* Latest Orders */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   <ShoppingBag className="w-4 h-4 text-emerald-600" />
                   آخرین سفارشات ثبت شده
                </h3>
                <span className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 cursor-pointer">مشاهده همه</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                   <thead>
                      <tr className="border-b border-slate-100 text-slate-500">
                         <th className="pb-3 font-bold pr-2">شماره</th>
                         <th className="pb-3 font-bold">مشتری</th>
                         <th className="pb-3 font-bold">مبلغ (تومان)</th>
                         <th className="pb-3 font-bold text-center">وضعیت</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {latestOrders.map(ord => (
                         <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 pr-2 whitespace-nowrap">
                               <Link to={`/admin/orders/${ord.id}`} className="font-mono font-bold text-blue-600 hover:underline">#{ord.id}</Link>
                               <div className="text-[9px] text-slate-400 font-mono mt-0.5">{ord.date}</div>
                            </td>
                            <td className="py-3">
                               <div className="font-bold text-slate-700">{ord.customer}</div>
                               <div className="text-[10px] text-slate-500 mt-0.5 max-w-[150px] truncate">{ord.items}</div>
                            </td>
                            <td className="py-3 font-mono font-bold text-slate-800">{formatToman(ord.total).replace(' تومان','')}</td>
                            <td className="py-3 text-center">{getStatusBadge(ord.status)}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );
}
