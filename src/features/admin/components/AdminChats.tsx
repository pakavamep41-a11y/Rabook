import { useState } from "react";
import { MessageSquare, Filter, Search, CheckCircle2, User, Clock, BellRing, Settings2 } from "lucide-react";
import { formatJalali } from "../../../lib/persian";
import OrderChat from "../../chat/components/OrderChat";

const mockChats = [
  { id: "ORD-9821-44A", customer: "علی احمدی", status: "unanswered", lastMsg: "سلام، فایل اصلاح شده رو فرستادم.", time: "10:30", new: true },
  { id: "ORD-9821-45B", customer: "شرکت رویا", status: "assigned", lastMsg: "منتظر تایید طرح", time: "دیروز", new: false },
  { id: "ORD-9821-46C", customer: "محمد تهرانی", status: "closed", lastMsg: "تشکر، تحویل گرفتم.", time: "دوشنبه", new: false },
];

export default function AdminChats() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'assigned'>('unanswered');

  const filtered = mockChats.filter(c => {
    if (filter === 'unanswered') return c.status === 'unanswered';
    if (filter === 'assigned') return c.status === 'assigned';
    return true;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24 h-full">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-800">پشتیبانی و تیکت‌ها</h1>
            <span className="text-xs text-slate-500 font-bold mt-1">مدیریت ارتباط با مشتریان و فایل‌های طراحی</span>
          </div>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col lg:flex-row h-[700px] overflow-hidden">
          {/* Chat List (Sidebar) */}
          <div className="w-full lg:w-80 flex flex-col border-b lg:border-b-0 lg:border-l border-slate-200 bg-slate-50">
             <div className="p-4 flex flex-col gap-4 border-b border-slate-200 bg-white">
                <div className="flex bg-slate-50 items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl focus-within:border-emerald-500 focus-within:bg-white transition-all shadow-sm">
                   <Search className="w-4 h-4 text-slate-400 shrink-0" />
                   <input type="text" placeholder="جستجوی نام، شماره سفارش..." className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-700" />
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                   <button onClick={() => setFilter('unanswered')} className={`flex-1 text-[10px] py-1.5 font-bold rounded-lg transition-all ${filter === 'unanswered' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}>پاسخ نداده</button>
                   <button onClick={() => setFilter('assigned')} className={`flex-1 text-[10px] py-1.5 font-bold rounded-lg transition-all ${filter === 'assigned' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>ارتباط من</button>
                   <button onClick={() => setFilter('all')} className={`flex-1 text-[10px] py-1.5 font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>همه</button>
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto">
                {filtered.map(chat => (
                   <div 
                      key={chat.id} 
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-4 border-b border-slate-100 cursor-pointer transition-all ${selectedChat === chat.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'hover:bg-slate-100/50 bg-white'} relative`}
                   >
                      <div className="flex items-start gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-400" />
                         </div>
                         <div className="flex flex-col flex-1 gap-1 min-w-0">
                            <div className="flex justify-between items-center">
                               <span className="text-xs font-bold text-slate-800 truncate">{chat.customer}</span>
                               <span className="text-[10px] text-slate-400 font-mono shrink-0">{chat.time}</span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded w-fit">سفارش {chat.id}</span>
                            <span className={`text-[11px] truncate mt-1 ${chat.new ? 'text-slate-800 font-bold' : 'text-slate-500'}`}>{chat.lastMsg}</span>
                         </div>
                      </div>
                      {chat.new && <div className="absolute top-4 left-4 w-2 h-2 bg-emerald-500 rounded-full" />}
                   </div>
                ))}
                {filtered.length === 0 && (
                   <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                      <CheckCircle2 className="w-8 h-8 opacity-50" />
                      <span className="text-xs font-bold">صندوق ورودی خالی است</span>
                   </div>
                )}
             </div>
          </div>

          {/* Chat Canvas */}
          <div className="flex-1 flex flex-col bg-slate-50">
             {!selectedChat ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8 text-slate-400">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
                      <MessageSquare className="w-8 h-8" />
                   </div>
                   <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-bold text-slate-600">پشتیبانی زنده</h3>
                      <p className="text-[11px] max-w-sm leading-relaxed">برای مشاهده سابقه گفتگو، بررسی فایل‌های ارسالی یا ارسال پیش‌فاکتور، یک گفتگو را از لیست انتخاب کنید.</p>
                   </div>
                </div>
             ) : (
                <OrderChat orderId={selectedChat} role="admin" />
             )}
          </div>
       </div>
    </div>
  );
}
