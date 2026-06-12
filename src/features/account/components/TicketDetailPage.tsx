import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Paperclip, Send, User } from "lucide-react";
import { formatJalali } from "../../../lib/persian";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [inputText, setInputText] = useState("");

  const ticketInfo = {
    id,
    subject: "مشکل در آپلود فایل کارت ویزیت",
    department: "پشتیبانی فنی",
    status: "open",
  };

  const [messages, setMessages] = useState([
    { id: 1, senderRole: "customer", senderName: "مشتری", content: "سلام، موقع آپلود فایل pdf خطای سرور میده. مشکل از کجاست؟", date: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, senderRole: "admin", senderName: "پشتیبانی فنی", content: "باسلام. حجم فایل شما چقدر است؟ حداکثر حجم مجاز ۵۰ مگابایت می‌باشد. همچنین از استاندارد بودن pdf اطمینان حاصل کنید.", date: new Date(Date.now() - 3000000).toISOString() },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      senderRole: "customer",
      senderName: "مشتری",
      content: inputText,
      date: new Date().toISOString()
    }]);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] animate-fade-in max-w-4xl mx-auto w-full">
       <div className="flex items-center gap-4 bg-white p-4 rounded-t-3xl border border-b-0 border-slate-200">
          <Link to="/account/tickets" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
             <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">#{ticketInfo.id}</span>
                <h2 className="text-sm font-black text-slate-800">{ticketInfo.subject}</h2>
             </div>
             <span className="text-[10px] font-bold text-emerald-600 mt-1">{ticketInfo.department}</span>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-slate-50 border-x border-slate-200">
          
          {messages.map(msg => {
             const isOwn = msg.senderRole === "customer";
             return (
               <div key={msg.id} className={`flex w-full ${isOwn ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${isOwn ? 'items-start' : 'items-end'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${!isOwn ? 'flex-row-reverse' : ''}`}>
                         <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                           <User className="w-3.5 h-3.5 text-slate-500" />
                         </div>
                         <span className="text-[10px] font-bold text-slate-500">{msg.senderName}</span>
                      </div>

                      <div className={`px-4 py-3 rounded-2xl shadow-sm border ${isOwn ? 'bg-emerald-600 text-white rounded-tr-sm border-emerald-700/50' : 'bg-white text-slate-700 rounded-tl-sm border-slate-100'}`}>
                         <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>

                      <div className={`flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                         <span className="font-mono">{formatJalali(msg.date).split(" ")[1]}</span>
                      </div>
                  </div>
               </div>
             );
          })}
       </div>

       <div className="bg-white border top border-slate-200 border-t-0 p-4 rounded-b-3xl shadow-sm z-10 relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-slate-200"></div>
          <form onSubmit={handleSend} className="flex gap-2 items-end pt-1">
             <button type="button" className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-slate-50 rounded-2xl transition-colors border border-slate-200">
                <Paperclip className="w-5 h-5" />
             </button>
             <div className="flex-1">
               <textarea 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={e => {
                   if(e.key === "Enter" && !e.shiftKey) {
                     e.preventDefault();
                     handleSend(e);
                   }
                 }}
                 placeholder="پاسخ خود را بنویسید..."
                 className="w-full resize-none h-12 max-h-32 p-3 text-sm font-medium border border-slate-200 bg-slate-50 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-400 leading-relaxed"
                 rows={1}
               />
             </div>
             <button 
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 rounded-2xl transition-colors shadow-md"
             >
               <Send className="w-5 h-5" />
             </button>
          </form>
       </div>
    </div>
  );
}
