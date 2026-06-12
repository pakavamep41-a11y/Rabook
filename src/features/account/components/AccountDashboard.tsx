import { useState, useEffect, useRef, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useStore } from "../../../lib/store";
import { formatToman, formatJalali } from "../../../lib/persian";
import { Order, ChatMessage, OrderStatus } from "../../../types";
import { Package, MessageCircle, Send, User, ChevronRight, CheckCircle2, AlertCircle, FileText, Truck } from "lucide-react";

export function getStatusDetails(status: OrderStatus) {
  const map = {
    pending: { label: "در انتظار بررسی فنی", color: "bg-amber-50 text-amber-700 border-amber-200" },
    preparing: { label: "پیش‌پردازش و فرم‌بندی در فرم چاپی", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    printing: { label: "در حال چاپ صنعتی شیت", color: "bg-blue-50 text-blue-700 border-blue-200" },
    shipped: { label: "تحویل پست / ارسال شد", color: "bg-purple-50 text-purple-700 border-purple-200" },
    delivered: { label: "تحویل نهایی مشتری", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { label: "لغو شده / فایل نامتعارف", color: "bg-rose-50 text-rose-700 border-rose-200" },
  };
  return map[status] || { label: status, color: "bg-slate-50 text-slate-700 border-slate-200" };
}

export default function AccountDashboard() {
  const { user, usePersianDigits, showAlert } = useStore();
  const queryClient = useQueryClient();

  // Chat message state
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Client Orders List
  const { data: orders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["clientOrders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
    refetchInterval: 10000, // Poll orders every 10s back and forth
  });

  // 2. Fetch Chat Messages history
  const { data: chatMessages, isLoading: isChatLoading } = useQuery<ChatMessage[]>({
    queryKey: ["chatMessages"],
    queryFn: async () => {
      const res = await api.get("/chat/messages");
      return res.data;
    },
    refetchInterval: 3000, // Keep polling chat messages for live experience
  });

  // 3. Mutation for delivering chat message
  const chatMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await api.post("/chat/send", { text });
      return res.data;
    },
    onSuccess: (newMessage) => {
      setChatInput("");
      // Update cache instantly
      queryClient.setQueryData<ChatMessage[]>(["chatMessages"], (old) => {
        return [...(old || []), newMessage];
      });
      scrollToBottom();
    },
    onError: () => {
      showAlert("ارسال پیام ناقص ماند. شبکه خود را بررسی کنید.", "error");
    },
  });

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    chatMutation.mutate(chatInput);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (chatMessages && chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages]);

  return (
    <div className="flex flex-col gap-8">
      {/* Account summary banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full rounded-2xl" alt={user.name} referrerPolicy="no-referrer" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-extrabold text-slate-800 text-lg">{user?.name}</h2>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <span>{user?.email}</span>
              <span>•</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-sans font-semibold">
                {user?.role === "admin" ? "مدیر کل" : "مشتری وفادار"}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-end hidden sm:flex flex-col">
            <span className="text-[10px] text-slate-400">تعداد کل سفارش‌های شما</span>
            <span className="text-sm font-bold text-slate-700 font-mono">
              {orders ? (usePersianDigits ? orders.length.toLocaleString("fa-IR") : orders.length) : "..."} فقره
            </span>
          </div>
        </div>
      </div>

      {/* Main split: Orders (left) & Chat Support (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Orders list panel - Col 8 */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base">تاریخچه سفارشات چاپی</h3>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-mono font-bold">
              LIVE TRACKING SYSTEM Active
            </span>
          </div>

          {isOrdersLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-44 bg-white rounded-2xl border" />
              ))}
            </div>
          ) : !orders || orders.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col items-center gap-3">
              <Package className="w-10 h-10 text-slate-300" />
              <p className="text-xs text-slate-500 font-medium">شما هنوز هیچ سفارش چاپی در سیستم ثبت نکرده‌اید.</p>
              <a href="/#catalog" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all mt-2">
                اولین سفارش را همینجــا ثبت کنید
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {orders.map((ord) => {
                const spec = getStatusDetails(ord.status);
                return (
                  <div 
                    key={ord.id}
                    className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-slate-200 transition-all flex flex-col gap-4 relative overflow-hidden"
                  >
                    {/* Status accent side rail */}
                    <div className={`absolute top-0 bottom-0 start-0 w-1.5 ${
                      ord.status === "delivered" ? "bg-emerald-500" : ord.status === "cancelled" ? "bg-rose-500" : "bg-amber-500"
                    }`} />

                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-50 relative">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-xl font-mono">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatJalali(ord.createdAt)}
                        </span>
                      </div>

                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border ${spec.color}`}>
                        {spec.label}
                      </span>
                    </div>

                    {/* Order Items layout loop */}
                    <div className="flex flex-col gap-3">
                      {ord.items.map((it) => (
                        <div key={it.id} className="flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{it.productName} ({usePersianDigits ? it.quantity.toLocaleString("fa-IR") : it.quantity} عدد)</span>
                            </span>
                            
                            {/* Option selections labels if exist */}
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {Object.entries(it.options).map(([k, v]) => (
                                <span key={k} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200/50">
                                  {k}: {v}
                                </span>
                              ))}
                              {it.fileName && (
                                <span className="text-[9px] text-slate-400 font-mono flex items-center gap-0.5 italic">
                                  <FileText className="w-3 h-3" />
                                  <span>{it.fileName}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <span className="text-xs font-bold text-slate-700 font-mono whitespace-nowrap">
                            {formatToman(it.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer receipt details / Delivery details */}
                    <div className="pt-3 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between items-start justify-start gap-3 text-xs">
                      <div className="text-slate-500 flex flex-col gap-0.5">
                        <span className="text-[10px] text-slate-400">نشانی ارسال گیرنده:</span>
                        <p className="max-w-md line-clamp-1 text-[11px] leading-relaxed select-all">{ord.shippingAddress}</p>
                      </div>

                      <div className="text-end flex flex-col items-end shrink-0">
                        <span className="text-[10px] text-slate-400">جمع کل پرداختی</span>
                        <span className="text-sm font-black text-emerald-600 font-mono">{formatToman(ord.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Tracking status bar details */}
                    {ord.trackingNumber && (
                      <div className="bg-emerald-950/5 border border-emerald-900/10 p-3 rounded-2xl flex items-center gap-3 mt-1.5 text-emerald-800">
                        <Truck className="w-4 h-4 shrink-0 text-emerald-600" />
                        <div className="flex flex-wrap items-center justify-between w-full text-xs gap-2">
                          <span>سفارش شما تحویل مأمور پست گردید. کد رهگیری مرسوله:</span>
                          <strong className="font-mono text-xs select-all bg-white px-2.5 py-1 rounded-lg border border-emerald-200/50">{ord.trackingNumber}</strong>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Live support Chat panel - Col 4 */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[550px] sticky top-24">
          
          {/* Chat header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900 absolute top-0 right-0 animate-ping" />
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900 absolute top-0 right-0" />
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold leading-none">مکالمه مستقیم با پشتیبان</span>
                <span className="text-[9px] text-slate-400">پاسخگویی سریع طراحان و اپراتورهای کارخانه</span>
              </div>
            </div>
          </div>

          {/* Messages list scroller */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
            {isChatLoading ? (
              <p className="text-center text-[10px] text-slate-400 py-6">سیستم چت آماده‌باش...</p>
            ) : !chatMessages || chatMessages.length === 0 ? (
              <div className="text-center py-12 flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-slate-300" />
                <span className="text-[11px] text-slate-400 font-medium max-w-[180px]">
                  سوالی پیرامون برش کار، کیفیت شیت‌ها یا ابعاد دارید؟ کافیست در کادر زیر بنویسید!
                </span>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isSentByMe = msg.senderId === user?.id;
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col gap-1 max-w-[85%] ${isSentByMe ? "ms-auto items-end" : "me-auto items-start"}`}
                  >
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                      isSentByMe 
                        ? "bg-slate-900 text-white rounded-te-sm" 
                        : "bg-white text-slate-700 border border-slate-100 rounded-ts-sm"
                    }`}>
                      <p className="select-text whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[8px] text-slate-400 font-mono px-1">
                      {msg.senderName} • {formatJalali(msg.createdAt, "HH:mm")}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Form write input */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="پیام یا پرسش خود را بنویسید..."
              disabled={chatMutation.isPending}
              className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || chatMutation.isPending}
              className="p-2.5 bg-emerald-600 border border-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-xl transition-colors flex items-center justify-center"
              title="ارسال پیام"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
