import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ShieldAlert, Download, Eye, DollarSign, Wallet, Users } from "lucide-react";
import { formatToman } from "../../../lib/persian";

const mockCustomers = [
  { id: "1", name: "علی احمدی", mobile: "09123456789", group: "همکار طلایی", ordersCount: 45, totalSpend: 25000000, wallet: 1500000 },
  { id: "2", name: "شرکت تبلیغاتی رویا", mobile: "09351112233", group: "نمایندگی شهرستان", ordersCount: 12, totalSpend: 12000000, wallet: 0 },
  { id: "3", name: "محمد تهرانی", mobile: "09198887766", group: "مشتری عادی", ordersCount: 3, totalSpend: 850000, wallet: -50000 },
];

export default function AdminCustomers() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-800">مشتریان و همکاران</h1>
            <span className="text-xs text-slate-500 font-bold mt-1">مدیریت کاربران، سطوح قیمتی و کیف پول</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> خروجی Excel
            </button>
            <Link to="/admin/customers/groups" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
              <Users className="w-4 h-4" /> گروه‌های کاربری
            </Link>
          </div>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 rounded-t-3xl">
             <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex bg-white items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl w-full md:w-64 focus-within:border-emerald-500 transition-colors">
                   <Search className="w-4 h-4 text-slate-400 shrink-0" />
                   <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجوی نام، موبایل..." className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-700" />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                  <Filter className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="overflow-x-auto text-right min-h-[400px]">
             <table className="w-full text-xs">
                <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="p-4 font-bold">نام مشتری (موبایل)</th>
                      <th className="p-4 font-bold">گروه کاربری</th>
                      <th className="p-4 font-bold">تعداد سفارش</th>
                      <th className="p-4 font-bold">مجموع خرید</th>
                      <th className="p-4 font-bold">موجودی کیف پول</th>
                      <th className="p-4 font-bold text-left">عملیات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium z-10 relative">
                   {mockCustomers.map(customer => (
                      <tr key={customer.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="p-4">
                            <div className="flex flex-col gap-1">
                               <span className="font-bold text-slate-800">{customer.name}</span>
                               <span className="text-[10px] text-slate-500 font-mono">{customer.mobile}</span>
                            </div>
                         </td>
                         <td className="p-4">
                            <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-1 rounded-md">{customer.group}</span>
                         </td>
                         <td className="p-4 font-mono font-bold text-slate-600">{customer.ordersCount}</td>
                         <td className="p-4 font-mono font-bold text-slate-800">{formatToman(customer.totalSpend)}</td>
                         <td className="p-4">
                            <span className={`font-mono font-bold whitespace-nowrap px-2 py-1 rounded-md text-[10px] ${customer.wallet > 0 ? 'bg-emerald-50 text-emerald-700' : customer.wallet < 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                               {formatToman(customer.wallet)}
                            </span>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center justify-end gap-1">
                               <Link to={`/admin/customers/${customer.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="مشاهده پروفایل">
                                  <Eye className="w-4 h-4" />
                               </Link>
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
