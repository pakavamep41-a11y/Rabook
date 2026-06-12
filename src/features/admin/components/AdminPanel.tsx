import { useState, FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useStore } from "../../../lib/store";
import { formatToman, formatJalali } from "../../../lib/persian";
import { Order, ChatSession, OrderStatus, ChatMessage } from "../../../types";
import { getStatusDetails } from "../../account/components/AccountDashboard";
import { ClipboardList, MessageSquare, Send, CheckCircle2, User, Eye, Edit2, AlertCircle, FileSpreadsheet, PlusCircle } from "lucide-react";

export default function AdminPanel() {
  const { user, usePersianDigits, showAlert } = useStore();
  const queryClient = useQueryClient();

  // Active sub tab: "orders" | "chats"
  const [activeSubTab, setActiveSubTab] = useState<"orders" | "chats">("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Selected detail focus states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedChatSession, setSelectedChatSession] = useState<ChatSession | null>(null);

  // Status updating state
  const [editingStatus, setEditingStatus] = useState<OrderStatus | "">("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");

  // Chat message support draft back
  const [adminReplyDraft, setAdminReplyDraft] = useState("");

  // Guard access
  if (user?.role !== "admin") {
    return (
      <div className="py-24 max-w-md mx-auto text-center flex flex-col items-center gap-4 bg-rose-50 border border-rose-100 p-8 rounded-2xl text-rose-800">
        <AlertCircle className="w-12 h-12 text-rose-600" />
        <h2 className="text-lg font-bold">دسترسی محدود شده است</h2>
        <p className="text-xs leading-relaxed text-rose-700">
          شما مجوز دسترسی به بخش مدیریت کارخانه را ندارید. لطفاً برای تست با نام کاربری مدیریت تستی وارد حساب شوید.
        </p>
      </div>
    );
  }

  // 1. Fetch Admin Orders (All client orders)
  const { data: allOrders, isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    },
    refetchInterval: 5000, // Poll order updates
  });

  // 2. Fetch Support Chat Session Logs list
  const { data: chatSessions, isLoading: isSessionsLoading } = useQuery<ChatSession[]>({
    queryKey: ["adminChatSessions"],
    queryFn: async () => {
      const res = await api.get("/admin/chat/sessions");
      return res.data;
    },
    refetchInterval: 3000, // Poll chats live
  });

  // 3. Mutators
  // Edit Order Status PATCH
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      return res.data;
    },
    onSuccess: (data) => {
      showAlert(data.message || "وضعیت شیت چاپی بروز شد.", "success");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      // update localized focus
      if (selectedOrder) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: data.order.status } : null));
      }
      setEditingStatus("");
    },
    onError: () => showAlert("خطایی رخ داد.", "error"),
  });

  // Update Order Tracking PATCH
  const updateTrackingMutation = useMutation({
    mutationFn: async ({ orderId, trackingNum }: { orderId: string; trackingNum: string }) => {
      const res = await api.patch(`/orders/${orderId}/tracking`, { trackingNumber: trackingNum });
      return res.data;
    },
    onSuccess: (data) => {
      showAlert(data.message || "کد رهگیری پست درج شد.", "success");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      if (selectedOrder) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: "shipped", trackingNumber: data.order.trackingNumber } : null));
      }
      setTrackingNumber("");
    },
    onError: () => showAlert("خطا در درج کد رهگیری.", "error"),
  });

  // Admin Reply POST
  const sendReplyMutation = useMutation({
    mutationFn: async ({ sessionId, text }: { sessionId: string; text: string }) => {
      const res = await api.post("/admin/chat/reply", { sessionId, text });
      return res.data;
    },
    onSuccess: (newMsg) => {
      setAdminReplyDraft("");
      // Append message locally immediately to ensure instant snappiness
      if (selectedChatSession) {
        const updatedMsgs = [...selectedChatSession.messages, newMsg];
        setSelectedChatSession({
          ...selectedChatSession,
          messages: updatedMsgs,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["adminChatSessions"] });
    },
    onError: () => showAlert("ارسال پیام ناقص ماند.", "error"),
  });

  const handleUpdateStatus = (statusVal: OrderStatus) => {
    if (!selectedOrder) return;
    updateStatusMutation.mutate({ orderId: selectedOrder.id, status: statusVal });
  };

  const handleUpdateTracking = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !trackingNumber.trim()) return;
    updateTrackingMutation.mutate({ orderId: selectedOrder.id, trackingNum: trackingNumber });
  };

  const handleAdminReply = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedChatSession || !adminReplyDraft.trim()) return;
    sendReplyMutation.mutate({ sessionId: selectedChatSession.id, text: adminReplyDraft });
  };

  // Filter orders by active selections
  const filteredOrders = allOrders?.filter((ord) => {
    if (statusFilter === "all") return true;
    return ord.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header Operator Section */}
      <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white">پورتال کاربری مدیریت نقش و نگار</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">کارخانه فعال</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              صفحه کنترل و نظارت مربی چاپخانه؛ ویرایش وضعیت دستگاه چاپ، تعیین کدهای مرسوله پست کشور و فرستادن بازخوردهای پشتیبانی.
            </p>
          </div>
        </div>

        {/* System mode selection */}
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setActiveSubTab("orders");
              setSelectedChatSession(null);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
              activeSubTab === "orders" 
                ? "bg-white text-slate-900" 
                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            مدیریت سفارشات فنی
          </button>
          <button 
            onClick={() => {
              setActiveSubTab("chats");
              setSelectedOrder(null);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-colors ${
              activeSubTab === "chats" 
                ? "bg-white text-slate-900" 
                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            تیکت‌های چت آنلاین ({chatSessions?.filter(c => c.unreadCount > 0).length || 0})
          </button>
        </div>
      </div>

      {/* Primary Tab Panel Layout */}
      {activeSubTab === "orders" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Orders list - Col 7 */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Filter buttons toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-500">فیلتر وضعیت:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { val: "all", label: "همه" },
                  { val: "pending", label: "در انتظار بررسی" },
                  { val: "preparing", label: "پیش‌پردازش" },
                  { val: "printing", label: "دستگاه چاپ" },
                  { val: "shipped", label: "ارسال شده" },
                  { val: "delivered", label: "تحویل مشتری" },
                ].map((item) => (
                  <button 
                    key={item.val}
                    onClick={() => setStatusFilter(item.val)}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all ${
                      statusFilter === item.val 
                        ? "bg-slate-900 text-white" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inbound Orders Scroller container */}
            <div className="flex flex-col gap-4">
              {isOrdersLoading ? (
                <p className="text-xs text-slate-400">در حال بروز رسانی شیت‌های کارخانه...</p>
              ) : !filteredOrders || filteredOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-12 text-center bg-white border border-dashed rounded-3xl">سفارشی با این وضعیت پیدا نشد.</p>
              ) : (
                filteredOrders.map((ord) => {
                  const details = getStatusDetails(ord.status);
                  const isFocused = selectedOrder?.id === ord.id;
                  return (
                    <div 
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col gap-4 bg-white shadow-sm hover:translate-y-[-2px] ${
                        isFocused ? "border-emerald-600 ring-1 ring-emerald-600" : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-800 bg-slate-50 border px-2.5 py-1 rounded-xl font-mono">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{formatJalali(ord.createdAt)}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${details.color}`}>
                          {details.label}
                        </span>
                      </div>

                      {/* Summary details */}
                      <div className="flex justify-between items-center text-xs">
                        <div className="text-start flex flex-col gap-0.5 max-w-[70%]">
                          <span className="font-semibold text-slate-500">کاربر: {ord.userName}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{ord.items.map(i => i.productName).join(" + ")}</span>
                        </div>
                        <span className="font-extrabold text-slate-800 font-mono text-xs">{formatToman(ord.totalAmount)}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Focal details Inspector - Col 5 */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6 min-h-[450px]">
              
              {!selectedOrder ? (
                <div className="text-center py-24 flex flex-col items-center gap-3">
                  <Eye className="w-12 h-12 text-slate-300" />
                  <span className="text-xs text-slate-400 font-semibold">جهت نظارت، بررسی فاکتور، تغییر وضعیت و فیش مرسوله پست یک سفارش را از لیست کلیک کنید.</span>
                </div>
              ) : (
                <>
                  {/* Inspector Header */}
                  <div className="pb-4 border-b border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800">بررسی جزییات سفارش {selectedOrder.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatJalali(selectedOrder.createdAt)}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">مشتری: <strong>{selectedOrder.userName}</strong></span>
                  </div>

                  {/* Option Items */}
                  <div className="flex flex-col gap-3.5">
                    <span className="text-[11px] font-bold text-slate-500 block">اقلام و فایل‌های پیوست سفارش:</span>
                    {selectedOrder.items.map((it) => (
                      <div key={it.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5 text-xs">
                        <strong className="text-slate-800">{it.productName} ({usePersianDigits ? it.quantity.toLocaleString("fa-IR") : it.quantity} عدد)</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(it.options).map(([k, v]) => (
                            <span key={k} className="bg-white border border-slate-200/50 text-[9px] text-slate-500 px-1.5 py-0.5 rounded">
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                        {it.fileName && (
                          <span className="text-[9px] text-emerald-700 font-mono flex items-center gap-1 mt-1 font-semibold border-t border-slate-200/40 pt-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>فایل CMYK ارسالی: {it.fileName}</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Forms to alter Status */}
                  <div className="border-t border-slate-100 pt-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-slate-600">بروزرسانی وضعیت خط تولید و کارگاه</label>
                      <select 
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateStatus(e.target.value as OrderStatus)}
                        className="p-3 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      >
                        <option value="pending">در انتظار بررسی شیت</option>
                        <option value="preparing">پیش‌پردازش و فرم‌بندی</option>
                        <option value="printing">در حال چاپ در ماشین چاپی</option>
                        <option value="shipped">تحویل مأمور ارسال / پست</option>
                        <option value="delivered">تحویل نهایی مشتری</option>
                        <option value="cancelled">لغو سفارش / رد طرح گرافیکی</option>
                      </select>
                    </div>

                    {/* Tracking insertion - specifically for shipped order status */}
                    <form onSubmit={handleUpdateTracking} className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-bold text-slate-600 block">ثبت مرسوله پستی (پست / باربری)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="کد رهگیری پستی ۲۴ رقمی را وارد کنید..."
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-600"
                        />
                        <button 
                          type="submit"
                          disabled={!trackingNumber.trim()}
                          className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 disabled:bg-slate-200 text-white hover:text-white disabled:text-slate-400 font-bold text-xs rounded-xl transition-all font-sans whitespace-nowrap"
                        >
                          ثبت کد مرسوله
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      ) : (
        // Chat Support Management Panel layout
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chats session selector - Col 5 */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="text-xs font-extrabold text-slate-700 block px-1.5">همه گفتگوهای فعال مشتریان:</span>
            
            {isSessionsLoading ? (
              <p className="text-xs text-slate-400.">بروزرسانی گفتگوها...</p>
            ) : !chatSessions || chatSessions.length === 0 ? (
              <p className="text-xs text-slate-500 py-12 text-center bg-white border rounded-3xl">هیچ مکالمه فعالی یافت نشد.</p>
            ) : (
              chatSessions.map((session) => {
                const isSelected = selectedChatSession?.id === session.id;
                return (
                  <div 
                    key={session.id}
                    onClick={() => setSelectedChatSession(session)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer flex justify-between items-center bg-white shadow-sm ${
                      isSelected ? "border-emerald-600 ring-1 ring-emerald-600" : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold font-sans">
                        {session.userName.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-800">{session.userName}</span>
                        <span className="text-[10px] text-slate-400 block max-w-[150px] truncate">
                          {session.messages[session.messages.length - 1]?.text || "بدون پیام جدید"}
                        </span>
                      </div>
                    </div>

                    {session.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] w-5 h-5 font-bold rounded-full flex items-center justify-center font-mono">
                        {usePersianDigits ? session.unreadCount.toLocaleString("fa-IR") : session.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Chats messages box - Col 7 */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col h-[500px]">
              
              {!selectedChatSession ? (
                <div className="text-center py-24 flex flex-col items-center gap-3 justify-center h-full">
                  <MessageSquare className="w-12 h-12 text-slate-300" />
                  <span className="text-xs text-slate-400 font-semibold max-w-xs">از منو راست، یک گفتگوی زنده مشتری را انتخاب کرده و پاسخ وی را بفرستید.</span>
                </div>
              ) : (
                <>
                  {/* Chat Box Header */}
                  <div className="bg-slate-900 text-white p-4 flex items-center gap-3 border-b border-slate-800">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                      {selectedChatSession.userName.charAt(0)}
                    </div>
                    <div className="flex flex-col text-start">
                      <span className="text-xs font-extrabold leading-tight">{selectedChatSession.userName}</span>
                      <span className="text-[10px] text-slate-400">{selectedChatSession.userEmail}</span>
                    </div>
                  </div>

                  {/* Messages Scroller */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50/50">
                    {selectedChatSession.messages.map((msg) => {
                      const isOperator = msg.isAdmin;
                      return (
                        <div 
                          key={msg.id}
                          className={`flex flex-col gap-1 max-w-[85%] ${isOperator ? "ms-auto items-end" : "me-auto items-start"}`}
                        >
                          <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                            isOperator 
                              ? "bg-slate-900 text-white rounded-te-sm" 
                              : "bg-white text-slate-800 border border-slate-100 rounded-ts-sm"
                          }`}>
                            <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                          </div>
                          <span className="text-[8px] text-slate-400 font-mono px-1">
                            {msg.senderName} • {formatJalali(msg.createdAt, "HH:mm")}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Drawer Footer */}
                  <form onSubmit={handleAdminReply} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="پاسخ ادمین در اینجا نوشته شود..."
                      value={adminReplyDraft}
                      onChange={(e) => setAdminReplyDraft(e.target.value)}
                      className="flex-1 p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!adminReplyDraft.trim()}
                      className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                    >
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
