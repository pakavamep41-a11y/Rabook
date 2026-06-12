import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Plus, Clock, CheckCircle } from "lucide-react";
import { formatJalali } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([
    { id: 101, subject: "مشکل در آپلود فایل کارت ویزیت", department: "پشتیبانی فنی", status: "open", lastUpdate: new Date().toISOString() },
    { id: 102, subject: "پیگیری سفارش شماره 5432", department: "پیگیری سفارشات", status: "answered", lastUpdate: new Date(Date.now() - 3600000).toISOString() },
    { id: 103, subject: "درخواست صدور فاکتور رسمی", department: "مالی و حسابداری", status: "closed", lastUpdate: new Date(Date.now() - 86400000 * 2).toISOString() },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <span className="bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 rounded text-[10px] font-bold">باز (در انتظار پاسخ)</span>;
      case "answered": return <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-[10px] font-bold">پاسخ داده شده</span>;
      case "closed": return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded text-[10px] font-bold">بسته شده</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            پشتیبانی و تیکت‌ها
          </h2>
          <Link to="/account/tickets/new" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            تیکت جدید
          </Link>
       </div>

       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-2">
         {tickets.map(ticket => (
           <Link key={ticket.id} to={`/account/tickets/${ticket.id}`} className="p-5 border-b border-slate-100 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">#{ticket.id}</span>
                    <h3 className="text-sm font-bold text-slate-800">{ticket.subject}</h3>
                 </div>
                 <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                    <span className="flex items-center gap-1"><UserIcon className="w-3.5 h-3.5" /> {ticket.department}</span>
                    <span className="flex items-center gap-1 font-mono"><Clock className="w-3.5 h-3.5" /> {formatJalali(ticket.lastUpdate)}</span>
                 </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                 {getStatusBadge(ticket.status)}
              </div>
           </Link>
         ))}
         {tickets.length === 0 && (
           <div className="p-12 text-center text-sm font-bold text-slate-400">هیچ تیکتی وجود ندارد.</div>
         )}
       </div>

    </div>
  );
}

// Just a quick local icon mock avoiding missing imports
function UserIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
