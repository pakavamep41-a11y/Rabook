import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { socket } from "../../../lib/socket";
import { ChatMessage, Order, OrderStatus } from "../../../types";
import { formatToman, formatJalali } from "../../../lib/persian";
import { Send, Paperclip, CreditCard, Download, Check, CheckCheck, User, Info, FileStack, UploadCloud, Image as ImageIcon } from "lucide-react";
import { useStore } from "../../../lib/store";

interface OrderChatProps {
  orderId: string;
  role: "customer" | "admin" | "staff";
}

export default function OrderChat({ orderId, role }: OrderChatProps) {
  const { user } = useStore();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: historyData, isLoading } = useQuery({
    queryKey: ["chat", orderId],
    queryFn: async () => {
      const res = await api.get(`/chat/${orderId}`);
      return res.data; // { sessionId, messages: [] }
    },
    enabled: !!orderId
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    if (historyData) {
      setMessages(historyData.messages || []);
      setSessionId(historyData.sessionId);
    }
  }, [historyData]);

  useEffect(() => {
    socket.connect();
    socket.emit("join_room", { orderId });
    
    const handleNewMessage = (msg: ChatMessage) => {
      // If we see it's from current session, append it
      if (msg.sessionId === sessionId) {
         setMessages(prev => {
            // Avoid duplicate by id
            if (prev.find(m => m.id === msg.id)) return prev;
            return [...prev, msg];
         });
      }
    };

    socket.on("new_message", handleNewMessage);
    
    return () => {
      socket.off("new_message", handleNewMessage);
      socket.disconnect();
    };
  }, [orderId, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const tempId = "temp_" + Date.now();
    const newMsg: any = {
      id: tempId,
      sessionId: sessionId || `sess_${orderId}`,
      senderId: user?.id || "guest",
      senderName: user?.name || "کاربر",
      senderRole: role,
      type: "text",
      content: inputText,
      createdAt: new Date().toISOString(),
      seen: false
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText("");

    socket.emit("send_message", newMsg, (ackMsg: ChatMessage) => {
      setMessages(prev => prev.map(m => m.id === tempId ? ackMsg : m));
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400 font-bold animate-pulse">در حال اتصال به گفتگو...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 border-x border-slate-100 relative rounded-3xl overflow-hidden shadow-inner">
       
       {/* Header */}
       <div className="bg-white p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
             <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
             <span className="text-xs font-black text-slate-800">
               {role === "customer" ? "پشتیبانی و طراحان مجموعه" : "مشتری"}
             </span>
             <span className="text-[10px] font-bold text-emerald-600">پاسخگویی سریع</span>
          </div>
       </div>

       {/* Messages Canvas */}
       <div ref={containerRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <div className="text-center my-4">
            <span className="text-[10px] bg-white border border-slate-200 text-slate-400 px-3 py-1 rounded-full font-bold">شروع گفتگو - {orderId.substring(0,8)}</span>
          </div>
          
          {messages.map((msg, index) => {
             const isOwn = msg.senderRole === role;
             
             // Different layouts per discriminated type
             if (msg.type === "status_change") {
                return (
                  <div key={msg.id} className="text-center my-2">
                     <span className="inline-flex items-center gap-1.5 text-[10px] bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1.5 rounded-full font-bold">
                        <Info className="w-3.5 h-3.5" />
                        وضعیت سفارش به «{msg.newStatus}» تغییر یافت
                     </span>
                  </div>
                );
             }

             return (
               <div key={msg.id} className={`flex w-full ${isOwn ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex flex-col gap-1 max-w-[85%] md:max-w-[70%] ${isOwn ? 'items-start' : 'items-end'}`}>
                      
                      {/* Avatar & Name Row */}
                      <div className={`flex items-center gap-2 mb-1 ${!isOwn ? 'flex-row-reverse' : ''}`}>
                         {msg.senderAvatar ? (
                           <img src={msg.senderAvatar} className="w-6 h-6 rounded-full" />
                         ) : (
                           <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                             <User className="w-3.5 h-3.5 text-slate-500" />
                           </div>
                         )}
                         <span className="text-[10px] font-bold text-slate-500">{msg.senderName || (msg.senderRole === 'admin' ? 'پشتیبانی' : 'مشتری')}</span>
                      </div>

                      {/* Bubble Payload Container */}
                      <div className={`px-4 py-3 rounded-2xl shadow-sm border ${isOwn ? 'bg-emerald-600 text-white rounded-tr-sm border-emerald-700/50' : 'bg-white text-slate-700 rounded-tl-sm border-slate-100'}`}>
                         
                         {msg.type === "text" && (
                            <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                         )}

                         {msg.type === "file" && (
                            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl border border-current text-current">
                              <FileStack className="w-8 h-8 opacity-80" />
                              <div className="flex flex-col flex-1 min-w-[120px]">
                                <span className="text-xs font-bold truncate line-clamp-1">{msg.fileName}</span>
                                <span className="text-[10px] opacity-80 font-mono">{(msg.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                              </div>
                              <a href={msg.fileUrl} download className="p-2 hover:bg-black/10 rounded-lg transition-colors" title="دانلود">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                         )}

                         {msg.type === "order_update_proposal" && (
                            <div className="flex flex-col gap-3 min-w-[200px] text-slate-800">
                               <div className="bg-amber-100 text-amber-800 px-3 py-1.5 -mx-4 -mt-3 rounded-t-2xl font-bold text-[10px] border-b border-amber-200">
                                  پیشنهاد تغییر سفارش
                               </div>
                               <p className="text-xs font-bold my-1">{msg.proposalText}</p>
                               <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                  <table className="w-full text-[10px] text-right">
                                    <thead className="bg-slate-100 border-b border-slate-200">
                                      <tr><th className="p-2">گزینه</th><th className="p-2">قبلی</th><th className="p-2 text-emerald-600">جدید</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                      {msg.proposedChanges?.map((ch, i) => (
                                        <tr key={i}>
                                           <td className="p-2 text-slate-500">{ch.label}</td>
                                           <td className="p-2 text-rose-500 line-through decoration-rose-300">{ch.oldValue}</td>
                                           <td className="p-2 text-emerald-600 font-bold">{ch.newValue}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                               </div>
                               {msg.newTotal !== msg.oldTotal && (
                                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-200 font-mono text-[10px]">
                                     <span className="text-slate-500 line-through">{formatToman(msg.oldTotal)}</span>
                                     <span className="text-emerald-700 font-bold">{formatToman(msg.newTotal)}</span>
                                  </div>
                               )}
                               {msg.isAccepted === undefined && role === "customer" ? (
                                  <div className="flex gap-2 mt-2">
                                     <button className="flex-1 bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-emerald-700">تایید تغییرات</button>
                                     <button className="flex-1 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold py-2 rounded-lg hover:bg-rose-100">رد</button>
                                  </div>
                               ) : (
                                  <div className="mt-2 text-center text-[10px] font-bold text-slate-500 bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                                     {msg.isAccepted ? "تایید شده" : msg.isAccepted === false ? "رد شده" : "در انتظار تایید مشتری"}
                                  </div>
                               )}
                            </div>
                         )}

                         {msg.type === "payment_request" && (
                            <div className="flex flex-col gap-2 min-w-[180px] text-slate-800">
                               <div className="bg-sky-100 text-sky-800 px-3 py-1.5 -mx-4 -mt-3 rounded-t-2xl font-bold text-[10px] border-b border-sky-200 flex items-center justify-between">
                                  <span>درخواست وجه</span>
                                  <CreditCard className="w-3.5 h-3.5" />
                               </div>
                               <p className="text-xs font-bold leading-relaxed">{msg.reason}</p>
                               <div className="bg-slate-50 p-2 rounded-xl text-center font-mono font-black text-sm border border-slate-200 text-slate-900 mt-1">
                                  {formatToman(msg.amount)}
                               </div>
                               {!msg.isPaid && role === "customer" ? (
                                 <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl mt-2 transition-colors">
                                   پرداخت صورتحساب
                                 </button>
                               ) : (
                                 <div className="mt-2 text-center text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-100">
                                    {msg.isPaid ? "پرداخت شده" : "در انتظار پرداخت"}
                                 </div>
                               )}
                            </div>
                         )}

                         {msg.type === "invoice" && (
                            <div className="flex items-center gap-3 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 text-indigo-900 min-w-[200px]">
                              <FileStack className="w-8 h-8 opacity-80" />
                              <div className="flex flex-col flex-1">
                                <span className="text-xs font-bold">فاکتور سفارش</span>
                                <span className="text-[10px] opacity-80 font-mono">{formatToman(msg.amount)}</span>
                              </div>
                              <a href={msg.invoiceUrl} download className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors" title="دانلود فاکتور">
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                         )}

                         {msg.type === "file_request" && (
                            <div className="flex flex-col gap-2 min-w-[220px] text-slate-800">
                               <div className="bg-rose-100 text-rose-800 px-3 py-1.5 -mx-4 -mt-3 rounded-t-2xl font-bold text-[10px] border-b border-rose-200 flex items-center justify-between">
                                  <span>درخواست ارسال فایل</span>
                               </div>
                               <p className="text-xs font-bold leading-relaxed my-1">{msg.reason}</p>
                               {!msg.isFulfilled && role === "customer" ? (
                                  <div className="border border-dashed border-rose-300 bg-rose-50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-rose-100/50 transition-colors">
                                     <UploadCloud className="w-6 h-6 text-rose-500" />
                                     <span className="text-[10px] font-bold text-rose-700">انتخاب فایل و ارسال</span>
                                  </div>
                               ) : (
                                  <div className="mt-2 text-center text-[10px] font-bold text-slate-500 bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                                     {msg.isFulfilled ? "فایل ارسال شده است" : "در انتظار فایل"}
                                  </div>
                               )}
                            </div>
                         )}

                         {msg.type === "design_proof" && (
                            <div className="flex flex-col gap-3 min-w-[220px] text-slate-800">
                               <div className="bg-purple-100 text-purple-800 px-3 py-1.5 -mx-4 -mt-3 rounded-t-2xl font-bold text-[10px] border-b border-purple-200 flex items-center justify-between">
                                  <span>تاییدیه طراحی</span>
                                  <ImageIcon className="w-3.5 h-3.5" />
                               </div>
                               <div className="rounded-xl overflow-hidden border border-slate-200 group relative">
                                  <img src={msg.proofUrl} className="w-full h-32 object-cover transition-transform group-hover:scale-105" alt="Proof" />
                                  <a href={msg.proofUrl} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold backdrop-blur-sm">
                                    مشاهده اندازه کامل
                                  </a>
                               </div>
                               {msg.notes && <p className="text-[11px] font-medium leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">{msg.notes}</p>}
                               
                               {msg.isApproved === undefined && role === "customer" ? (
                                  <div className="flex gap-2">
                                     <button className="flex-1 bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-lg hover:bg-emerald-700">تایید طرح</button>
                                     <button className="flex-1 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold py-2 rounded-lg hover:bg-rose-100">نیاز به اصلاح</button>
                                  </div>
                               ) : (
                                  <div className="text-center text-[10px] font-bold text-slate-500 bg-slate-100 py-1.5 rounded-lg border border-slate-200">
                                     {msg.isApproved ? "طرح تایید شده" : msg.isApproved === false ? "طرح رد شده / درخواست اصلاح" : "در انتظار تایید مشتری"}
                                  </div>
                               )}
                            </div>
                         )}

                      </div>

                      {/* Meta Footer */}
                      <div className={`flex items-center gap-1 text-[9px] text-slate-400 mt-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                         <span className="font-mono">{formatJalali(msg.createdAt).split(" ")[1]}</span>
                         {isOwn && (
                           msg.seen ? <CheckCheck className="w-3 h-3 text-sky-500" /> : <Check className="w-3 h-3" />
                         )}
                      </div>
                  </div>
               </div>
             );
          })}
          <div ref={messagesEndRef} />
       </div>

       {/* Composer */}
       <div className="bg-white border-t border-slate-100 p-4">
          {role === 'admin' && (
            <div className="flex flex-wrap gap-2 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
               <button className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-emerald-50 hover:text-emerald-700 font-bold transition-colors shadow-sm flex items-center gap-1">
                 <CreditCard className="w-3 h-3" /> درخواست پرداخت
               </button>
               <button className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-sky-50 hover:text-sky-700 font-bold transition-colors shadow-sm flex items-center gap-1">
                 <FileStack className="w-3 h-3" /> پیش‌فاکتور
               </button>
               <button className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-rose-50 hover:text-rose-700 font-bold transition-colors shadow-sm flex items-center gap-1">
                 <UploadCloud className="w-3 h-3" /> درخواست فایل
               </button>
               <button className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-purple-50 hover:text-purple-700 font-bold transition-colors shadow-sm flex items-center gap-1">
                 <ImageIcon className="w-3 h-3" /> پیش‌نمایش طرح
               </button>
               <div className="w-px h-5 bg-slate-200 mx-1 self-center" />
               <label className="flex items-center gap-1.5 cursor-pointer select-none">
                 <input type="checkbox" className="accent-amber-500 w-3 h-3" />
                 <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded">یادداشت داخلی (مخفی)</span>
               </label>
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-2 items-end">
             <button type="button" className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 bg-slate-50 rounded-2xl transition-colors border border-slate-200 shrink-0">
                <Paperclip className="w-5 h-5" />
             </button>
             <div className="flex-1 relative">
               <textarea 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="پیام خود را بنویسید... (ارسال با Enter)"
                 className="w-full resize-none h-12 max-h-32 p-3 text-xs md:text-sm font-medium border border-slate-200 bg-slate-50 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white placeholder-slate-400 leading-relaxed"
                 rows={1}
               />
             </div>
             <button 
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-300 disabled:opacity-50 rounded-2xl transition-colors shadow-md flex items-center justify-center cursor-pointer"
             >
               <Send className="w-5 h-5" />
             </button>
          </form>
       </div>
    </div>
  );
}
