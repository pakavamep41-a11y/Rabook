import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Wallet, Package, Clock, CheckCircle2, ChevronLeft, CreditCard, Receipt, Volume2 } from "lucide-react";
import { useStore } from "../../../lib/store";
import { api } from "../../../lib/api";
import { formatToman, formatJalali } from "../../../lib/persian";
import { PaginatedResponse, Order } from "../../../types";
import { ORDER_STATUS_MAP } from "../../orders/status";

export default function AccountOverview() {
  const { user } = useStore();

  const { data: ordersPage, isLoading } = useQuery<PaginatedResponse<Order>>({
    queryKey: ["clientOrders_recent"],
    queryFn: async () => {
      const res = await api.get(`/orders?customerId=${user?.id}&limit=5`);
      return res.data;
    },
    enabled: !!user?.id
  });

  const orders = ordersPage?.data || [];
  
  // Mocks
  const walletBalance = 0;
  const stats = {
     active: 2,
     pendingPayment: 1,
     delivered: 12
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       {/* Greeting */}
       <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col gap-1">
             <h2 className="text-xl font-black text-slate-800">خوش آمدید، {user?.name} عزیز!</h2>
             <span className="text-xs text-slate-500">امروز دوازدهم خرداد ۱۴۰۳ است.</span>
          </div>
       </div>

       {/* Stats Cards */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col gap-3 shadow-sm hover:border-emerald-200 transition-all">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5" />
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-800 font-mono">{stats.active}</span>
                <span className="text-xs font-bold text-slate-500">سفارش‌های جاری</span>
             </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col gap-3 shadow-sm hover:border-emerald-200 transition-all">
             <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-800 font-mono">{stats.pendingPayment}</span>
                <span className="text-xs font-bold text-slate-500">در انتظار پرداخت</span>
             </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col gap-3 shadow-sm hover:border-emerald-200 transition-all">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-800 font-mono">{stats.delivered}</span>
                <span className="text-xs font-bold text-slate-500">تحویل شده (کل)</span>
             </div>
          </div>

          {/* Wallet */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl shadow-slate-900/10">
             <div className="flex items-center justify-between text-slate-300 mb-2">
                <div className="flex items-center gap-1.5 opacity-80">
                   <Wallet className="w-4 h-4" />
                   <span className="text-xs font-bold">موجودی کیف پول</span>
                </div>
             </div>
             <div className="flex flex-col gap-4">
                <span className="text-2xl font-black text-white font-mono">{formatToman(walletBalance)}</span>
                <Link to="/account/wallet" className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold py-2 rounded-xl transition-colors shrink-0 text-center block">
                   + افزایش موجودی
                </Link>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Orders */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                   <Receipt className="w-4.5 h-4.5 text-emerald-600" />
                   آخرین سفارش‌های چاپی
                </h3>
                <Link to="/account/orders" className="text-[10px] sm:text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                   مشاهده همه <ChevronLeft className="w-3 h-3" />
                </Link>
             </div>
             <div className="p-0 overflow-x-auto">
                {isLoading ? (
                   <div className="p-8 text-center text-xs text-slate-500">در حال بارگزاری...</div>
                ) : orders.length === 0 ? (
                   <div className="p-12 text-center flex flex-col items-center gap-2">
                      <Receipt className="w-8 h-8 text-slate-300" />
                      <span className="text-xs font-bold text-slate-500">سفارشی یافت نشد</span>
                   </div>
                ) : (
                   <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                         <tr>
                            <th className="py-4 px-6 font-bold whitespace-nowrap">شماره سفارش</th>
                            <th className="py-4 px-6 font-bold whitespace-nowrap">تاریخ ثبت</th>
                            <th className="py-4 px-6 font-bold whitespace-nowrap">وضعیت</th>
                            <th className="py-4 px-6 font-bold whitespace-nowrap text-left">مبلغ روال (تومان)</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {orders.map(o => {
                            const st = ORDER_STATUS_MAP[o.status] || ORDER_STATUS_MAP.registered;
                            const Icon = st.icon;
                            // Stub for read/unread message count
                            const unreadCounts = o.id === "1" ? 2 : 0;
                            return (
                               <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-4 px-6 font-mono font-bold text-slate-800 whitespace-nowrap">
                                     <Link to={`/account/orders/${o.id}`} className="hover:text-emerald-600 flex items-center gap-2">
                                        {o.orderNumber || o.id.substring(0,8)}
                                        {unreadCounts > 0 && <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center pt-0.5">{unreadCounts}</span>}
                                     </Link>
                                  </td>
                                  <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">{formatJalali(o.createdAt)}</td>
                                  <td className="py-4 px-6 whitespace-nowrap">
                                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${st.bg} ${st.color}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                        {st.label}
                                     </span>
                                  </td>
                                  <td className="py-4 px-6 font-mono font-bold text-slate-800 text-left whitespace-nowrap">{formatToman(o.total)}</td>
                               </tr>
                            );
                         })}
                      </tbody>
                   </table>
                )}
             </div>
          </div>

          <div className="flex flex-col gap-6">
             {/* Announcements */}
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-sm border border-indigo-200 text-white flex flex-col gap-4 relative overflow-hidden">
                <Volume2 className="absolute -left-4 -bottom-4 w-32 h-32 opacity-10" />
                <h3 className="font-extrabold text-sm flex items-center gap-2 relative z-10">
                   تازه ترین اخبار چاپخانه
                </h3>
                <div className="relative z-10 flex flex-col gap-3">
                   <div className="bg-white/10 p-3 rounded-2xl flex flex-col gap-1 backdrop-blur-sm border border-white/10">
                      <span className="text-[10px] font-bold text-indigo-100">۱۲ اردیبهشت</span>
                      <p className="text-xs font-medium leading-relaxed">اضافه شدن دستگاه چاپ لارج فرمت اکوسالونت ژاپنی. کیفیت بی‌نظیر برای بنر و فلکس.</p>
                   </div>
                   <div className="bg-white/10 p-3 rounded-2xl flex flex-col gap-1 backdrop-blur-sm border border-white/10">
                      <span className="text-[10px] font-bold text-indigo-100">۵ فروردین</span>
                      <p className="text-xs font-medium leading-relaxed">افزایش ۵ درصدی قیمت کاغذ گلاسه به‌دلیل نوسانات بازار و ارز.</p>
                   </div>
                </div>
             </div>
          </div>
       </div>

    </div>
  );
}
