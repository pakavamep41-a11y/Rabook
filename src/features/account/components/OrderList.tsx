import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Filter, CalendarDays, Receipt } from "lucide-react";
import { useStore } from "../../../lib/store";
import { api } from "../../../lib/api";
import { formatToman, formatJalali } from "../../../lib/persian";
import { PaginatedResponse, Order, OrderStatus } from "../../../types";
import { ORDER_STATUS_MAP } from "../../orders/status";

export default function OrderList() {
  const { user } = useStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchCode, setSearchCode] = useState("");

  const { data: ordersPage, isLoading } = useQuery<PaginatedResponse<Order>>({
    queryKey: ["clientOrders", statusFilter],
    queryFn: async () => {
      let url = `/orders?customerId=${user?.id}`;
      // In real scenario backend does filtering.
      const res = await api.get(url);
      return res.data;
    },
    enabled: !!user?.id
  });

  // Client side sorting and filtering for now
  let orders = ordersPage?.data || [];
  if (statusFilter !== "all") {
     orders = orders.filter(o => o.status === statusFilter);
  }
  if (searchCode.trim()) {
     orders = orders.filter(o => o.id.includes(searchCode) || (o.orderNumber && o.orderNumber.includes(searchCode)));
  }

  const statuses: { value: OrderStatus | "all", label: string }[] = [
    { value: "all", label: "همه سفارش‌ها" },
    ...Object.entries(ORDER_STATUS_MAP).map(([k, v]) => ({ value: k as OrderStatus, label: v.label }))
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
             <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5" />
             </div>
             <div className="flex flex-col">
                <h2 className="text-xl font-black text-slate-800">سفارش‌های چاپی من</h2>
                <span className="text-xs font-bold text-slate-500">مشاهده و پیگیری لحظه‌ای</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input 
                   type="text" 
                   value={searchCode}
                   onChange={e => setSearchCode(e.target.value)}
                   placeholder="کد پیگیری..."
                   className="pl-3 pr-9 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none w-40"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors text-xs font-bold">
                <CalendarDays className="w-4 h-4" />
                <span>فیلتر تاریخ</span>
             </button>
          </div>
       </div>

       {/* Status chips */}
       <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
          {statuses.map(st => (
             <button 
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${statusFilter === st.value ? "bg-slate-800 text-white border-slate-800 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
             >
                {st.label}
             </button>
          ))}
       </div>

       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
          {isLoading ? (
             <div className="p-12 text-center text-xs text-slate-500 font-bold">در حال استخراج لیست...</div>
          ) : orders.length === 0 ? (
             <div className="p-20 text-center flex flex-col items-center gap-3">
                <Filter className="w-10 h-10 text-slate-300" />
                <span className="text-sm font-bold text-slate-500">هیچ رکوردی با این مشخصات یافت نشد</span>
             </div>
          ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                   <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                      <tr>
                         <th className="py-4 px-6 font-bold whitespace-nowrap hidden sm:table-cell">کد پیگیری</th>
                         <th className="py-4 px-6 font-bold whitespace-nowrap">تاریخ ثبت</th>
                         <th className="py-4 px-6 font-bold whitespace-nowrap">اقلام چاپی</th>
                         <th className="py-4 px-6 font-bold whitespace-nowrap text-left hidden sm:table-cell">جمع کل</th>
                         <th className="py-4 px-6 font-bold whitespace-nowrap">وضعیت</th>
                         <th className="py-4 px-6 font-bold whitespace-nowrap text-left">عملیات</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {orders.map(o => {
                         const st = ORDER_STATUS_MAP[o.status] || ORDER_STATUS_MAP.registered;
                         const Icon = st.icon;
                         
                         const unreadChats = 2; // Stub
                         
                         const itemsText = o.items.map(i => `${i.productTitle}(${i.quantity})`).join(" + ");

                         return (
                            <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                               <td className="py-4 px-6 font-mono font-bold text-slate-800 whitespace-nowrap hidden sm:table-cell">
                                 {o.orderNumber || o.id.substring(0,8)}
                               </td>
                               <td className="py-4 px-6 font-mono text-slate-500 whitespace-nowrap">{formatJalali(o.createdAt)}</td>
                               <td className="py-4 px-6 text-slate-600 max-w-[200px] truncate" title={itemsText}>{itemsText}</td>
                               <td className="py-4 px-6 font-mono font-bold text-slate-800 text-left whitespace-nowrap hidden sm:table-cell">{formatToman(o.total)}</td>
                               <td className="py-4 px-6 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${st.bg} ${st.color}`}>
                                        <Icon className="w-3.5 h-3.5" />
                                        {st.label}
                                     </span>
                                     {unreadChats > 0 && (
                                        <span className="bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border border-rose-200">
                                           پیام جدید
                                           <span className="w-3 h-3 bg-rose-500 rounded-full text-white flex items-center justify-center font-mono">{unreadChats}</span>
                                        </span>
                                     )}
                                  </div>
                               </td>
                               <td className="py-4 px-6 text-left whitespace-nowrap">
                                  <Link to={`/account/orders/${o.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 rounded-xl font-bold transition-all text-[11px]">
                                     مشاهده جزئیات
                                  </Link>
                               </td>
                            </tr>
                         );
                      })}
                   </tbody>
                </table>
             </div>
          )}
       </div>
    </div>
  );
}
