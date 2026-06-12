import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Search, Download, Plus, Settings2, MoreVertical, Edit2, Printer, CheckCircle2, Clock, Truck, Eye } from "lucide-react";
import { formatToman, formatJalali } from "../../../lib/persian";
import { Order, OrderStatus } from "../../../types";

// Mock Data
const mockOrders = [
  { id: "ORD-9821-44A", customer: "علی احمدی", date: "2024-03-20T10:30:00Z", total: 450000, status: "pending_files", type: "کارت ویزیت گلاسه", express: true, payment: "paid" },
  { id: "ORD-9821-45B", customer: "شرکت رویا", date: "2024-03-21T14:15:00Z", total: 1250000, status: "printing", type: "تراکت A5", express: false, payment: "pending" },
  { id: "ORD-9821-46C", customer: "محمد تهرانی", date: "2024-03-22T09:00:00Z", total: 85000, status: "ready", type: "بنر 13 انس", express: false, payment: "paid" },
];

export default function AdminPanel() {
  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-800">سفارشات چاپی</h1>
            <span className="text-xs text-slate-500 font-bold mt-1">مدیریت، پیگیری و تغییر وضعیت سفارشات</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> <span className="hidden sm:inline">خروجی CSV</span>
            </button>
            <Link to="/admin/orders/new" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> سفارش جدید دستی
            </Link>
          </div>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col">
          {/* Advanced Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
             <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                   <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl whitespace-nowrap">همه سفارشات</button>
                   <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl whitespace-nowrap">نیاز به تایید طرح</button>
                   <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl whitespace-nowrap">فوری امروز</button>
                   <button className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 rounded-xl transition-all"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto">
                   <div className="flex bg-slate-50 items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl w-full lg:w-64 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجوی شماره، مشتری..." className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-700" />
                   </div>
                   <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors shrink-0">
                     <Filter className="w-4 h-4" />
                   </button>
                   <button className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors shrink-0">
                     <Settings2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-right min-h-[400px]">
             <table className="w-full text-xs">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="p-4 w-10"><input type="checkbox" className="w-4 h-4 accent-emerald-600 rounded" /></th>
                      <th className="p-4 font-bold">شماره سفارش</th>
                      <th className="p-4 font-bold">مشتری</th>
                      <th className="p-4 font-bold min-w-[150px]">محصول اصلی</th>
                      <th className="p-4 font-bold">مبلغ (تومان)</th>
                      <th className="p-4 font-bold">وضعیت مالی</th>
                      <th className="p-4 font-bold">وضعیت تولید</th>
                      <th className="p-4 font-bold text-left">عملیات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium z-10 relative">
                   {mockOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="p-4"><input type="checkbox" className="w-4 h-4 accent-emerald-600 rounded" /></td>
                         <td className="p-4">
                            <div className="flex flex-col gap-1">
                               <span className="font-mono font-bold text-slate-800">{order.id}</span>
                               <span className="text-[10px] text-slate-400 font-mono">{formatJalali(order.date)}</span>
                            </div>
                         </td>
                         <td className="p-4 text-slate-700 font-bold">{order.customer}</td>
                         <td className="p-4">
                            <div className="flex items-center gap-2">
                               <span className="text-slate-800 font-bold truncate max-w-[150px]">{order.type}</span>
                               {order.express && <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">فوری</span>}
                            </div>
                         </td>
                         <td className="p-4 font-mono font-bold text-slate-800">{formatToman(order.total)}</td>
                         <td className="p-4">
                            {order.payment === 'paid' ? 
                              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md font-bold"><CheckCircle2 className="w-3 h-3"/> پرداخت شده</span> :
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md font-bold"><Clock className="w-3 h-3"/> نسیه / قسطی</span>
                            }
                         </td>
                         <td className="p-4">
                             <select className="bg-white border border-slate-200 rounded-lg text-[10px] font-bold p-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                <option value={order.status}>
                                   {order.status === 'pending_files' ? 'در انتظار فایل' : order.status === 'printing' ? 'در حال چاپ' : 'آماده ارسال'}
                                </option>
                             </select>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                               <button title="چاپ تیکت کار" className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                  <Printer className="w-4 h-4" />
                               </button>
                               <Link to={`/admin/orders/${order.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                               </Link>
                               <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
