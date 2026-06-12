import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { Order, OrderStatus } from "../../../types";
import { ORDER_STATUS_MAP } from "../../orders/status";
import { formatToman, formatJalali } from "../../../lib/persian";
import { useStore } from "../../../lib/store";
import { ArrowRight, Receipt, FileText, UploadCloud, RotateCcw, XCircle, FileWarning, Clock, Package, Image as ImageIcon, MapPin, Truck, ChevronLeft, CreditCard, CheckCircle } from "lucide-react";
import OrderChat from "../../chat/components/OrderChat";

const TIMELINE_STEPS: OrderStatus[] = [
  "registered",
  "in_review",
  "pending_payment",
  "printing",
  "ready",
  "shipped",
  "delivered"
];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, addToCart, showAlert } = useStore();
  
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div className="p-8 text-center text-slate-500 font-bold">سفارش یافت نشد.</div>;
  }

  const statusObj = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.registered;
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status) >= 0 ? TIMELINE_STEPS.indexOf(order.status) : (order.status === "file_rejected" ? 1 : -1);

  const handleReorder = () => {
    order.items.forEach(item => {
      addToCart({
        productId: item.productId,
        productTitle: item.productTitle,
        quantity: item.quantity,
        files: item.files || [],
        specs: item.specs || {},
        unitPrice: item.unitPrice,
      });
    });
    showAlert("اقلام سفارش به سبد خرید افزوده شد.", "success");
  };

  const handleCancelOrder = async () => {
     try {
       // Mock API call to cancel
       // await api.post(`/orders/${id}/cancel`);
       showAlert("سفارش شما با موفقیت لغو شد.", "success");
       setShowCancelConfirm(false);
       // Refresh query realistically
       order.status = "cancelled"; // Optimistic update
     } catch(e: any) {
       showAlert("خطا در لغو سفارش", "error");
     }
  };

  const canCancel = order.status === "registered" || order.status === "in_review";

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       {/* Header */}
       <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <Link to="/account/orders" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors">
             <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xl font-black text-slate-800">
                   <span className="font-sans">سفارش</span>
                   <span className="font-mono tracking-wider">{order.orderNumber || order.id.substring(0,8)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-slate-400">
                   <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {formatJalali(order.createdAt)}
                   </div>
                   <span>•</span>
                   <div className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {order.items.length} محصول
                   </div>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-current ${statusObj.bg} ${statusObj.color}`}>
                   <statusObj.icon className="w-4 h-4" />
                   {statusObj.label}
                </span>
                <span className="font-mono text-xl font-black text-slate-800">{formatToman(order.total)}</span>
             </div>
          </div>
       </div>

       {/* Main content grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
             
             {/* Timeline */}
             {order.status !== "cancelled" && (
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-x-auto">
               <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <Clock className="w-5 h-5 text-emerald-600" />
                 وضعیت سفارش
               </h3>
               <div className="relative min-w-[600px] flex justify-between items-center px-4">
                 <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 rounded-full z-0" />
                 <div className="absolute top-4 right-6 h-1 bg-emerald-500 rounded-full z-0 transition-all duration-500 ease-in-out" 
                      style={{ width: `${(Math.max(0, currentStepIndex) / (TIMELINE_STEPS.length - 1)) * 100}%`, left: 'auto' }} />
                 
                 {TIMELINE_STEPS.map((step, idx) => {
                   const sObj = ORDER_STATUS_MAP[step];
                   const Icon = sObj.icon;
                   const isPast = idx < currentStepIndex;
                   const isCurrent = idx === currentStepIndex;
                   const isRejected = order.status === "file_rejected" && step === "in_review";
                   
                   let circleClass = "bg-white border-4 border-slate-200 text-slate-300";
                   if (isPast) circleClass = "bg-emerald-500 border-4 border-emerald-100 text-white shadow-md";
                   if (isCurrent) circleClass = `bg-white border-4 animate-pulse ${sObj.bg} ${sObj.color} border-current`;
                   if (isRejected) circleClass = "bg-white border-4 animate-pulse bg-rose-100 text-rose-600 border-rose-600";

                   return (
                     <div key={step} className="relative z-10 flex flex-col items-center gap-2 w-20">
                       <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${circleClass}`}>
                         {isPast ? <CheckCircle className="w-4 h-4" /> : isRejected ? <XCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                       </div>
                       <span className={`text-[10px] font-bold text-center ${isCurrent || isPast || isRejected ? 'text-slate-800' : 'text-slate-400'}`}>
                         {sObj.label}
                       </span>
                     </div>
                   );
                 })}
               </div>
             </div>
             )}

             {/* Action Bar */}
             <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center gap-3">
               <button onClick={handleReorder} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 rounded-xl transition-all text-xs font-bold shadow-sm">
                 <RotateCcw className="w-4 h-4" />
                 سفارش مجدد اقلام
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-600 hover:bg-emerald-50 rounded-xl transition-all text-xs font-bold shadow-sm">
                 <FileText className="w-4 h-4" />
                 دانلود فاکتور (PDF)
               </button>
               {canCancel && (
                 <button onClick={() => setShowCancelConfirm(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs font-bold shadow-sm mr-auto">
                   <XCircle className="w-4 h-4" />
                   لغو سفارش
                 </button>
               )}
               {order.status === "file_rejected" && (
                 <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition-all text-xs font-bold shadow-sm mr-auto">
                   <UploadCloud className="w-4 h-4" />
                   آپلود فایل اصلاح‌شده
                 </button>
               )}
             </div>

             {/* Rejection Note */}
             {order.status === "file_rejected" && (
               <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex items-start gap-4">
                 <div className="bg-rose-100 p-2 border border-rose-200 rounded-xl text-rose-600">
                   <FileWarning className="w-6 h-6" />
                 </div>
                 <div className="flex flex-col gap-1">
                   <h4 className="text-sm font-bold text-rose-800">فایل شما دارای مشکل جهت چاپ است.</h4>
                   <p className="text-xs font-medium text-rose-600/80 leading-relaxed">
                     لطفا با پشتیبانی در ارتباط باشید یا از طریق دکمه آپلود فایل، نسخه اصلاح شده را بارگذاری نمایید. سیستم پس از دریافت فایل جدید، مجددا وضعیت را به «در حال بررسی» تغییر می‌دهد.
                   </p>
                 </div>
               </div>
             )}

             {/* Line Items */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
               <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                 <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   <Package className="w-5 h-5 text-emerald-600" />
                   اقلام سفارش
                 </h3>
               </div>
               <div className="flex flex-col divide-y divide-slate-50">
                 {order.items.map((item, idx) => (
                   <div key={item.id} className="p-5 flex flex-col md:flex-row gap-5 hover:bg-slate-50/50 transition-colors">
                     {/* Thumbnail */}
                     <div className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden group">
                       {item.files?.length > 0 ? (
                         <>
                           <img src={item.files[0]} className="w-full h-full object-cover" alt={item.productTitle} />
                           <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-1">
                             <a href={item.files[0]} download className="text-[10px] bg-white text-slate-900 px-2 py-1 rounded-lg font-bold">دانلود فایل</a>
                           </div>
                         </>
                       ) : (
                         <div className="flex flex-col items-center gap-1 text-slate-400">
                           <ImageIcon className="w-6 h-6" />
                           <span className="text-[9px] font-bold">بدون فایل</span>
                         </div>
                       )}
                     </div>
                     {/* Info */}
                     <div className="flex-1 flex flex-col justify-between">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-sm font-extrabold text-slate-800">{item.productTitle}</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.specs || {}).map(([key, val]) => {
                               return (
                                 <div key={key} className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-[10px] font-bold text-slate-600">
                                   <span className="text-slate-400 ml-1">{key}:</span>
                                   <span>{String(val)}</span>
                                 </div>
                               )
                            })}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 md:mt-0">
                           <span className="text-xs font-bold text-slate-500">{item.quantity} عدد</span>
                           <span className="text-base font-black font-mono text-slate-900">{formatToman(item.totalPrice)}</span>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

          </div>
          
          <div className="flex flex-col gap-6">
             {/* Price Breakdown */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                   <Receipt className="w-5 h-5 text-emerald-600" />
                   جزئیات صورتحساب
                </h3>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                   <span>جمع مبلغ کالاها</span>
                   <span className="font-mono text-slate-700">{formatToman(order.subtotal)}</span>
                </div>
                {order.shippingFee > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                     <span>هزینه ارسال</span>
                     <span className="font-mono text-slate-700">{formatToman(order.shippingFee)}</span>
                  </div>
                )}
                {/* Mock discount / tax for display if needed */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-extrabold text-slate-800">
                   <span>مبلغ کل</span>
                   <span className="font-mono text-emerald-600 text-lg">{formatToman(order.total)}</span>
                </div>
             </div>

             {/* Payments Table Mock */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                   <CreditCard className="w-5 h-5 text-emerald-600" />
                   سوابق پرداخت
                </h3>
                <div className="flex flex-col gap-3">
                   <div className="border border-emerald-100 bg-emerald-50 rounded-2xl p-3 flex flex-col gap-2 relative">
                      <div className="flex justify-between items-center text-xs font-bold">
                         <span className="text-emerald-800">پرداخت اینترنتی</span>
                         <span className="text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">موفق</span>
                      </div>
                      <div className="flex justify-between items-end text-emerald-900">
                         <span className="text-[10px] font-mono text-emerald-600">{formatJalali(order.createdAt)}</span>
                         <span className="font-mono font-black">{formatToman(order.total)}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Shipping Info */}
             <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-2">
                   <Truck className="w-5 h-5 text-emerald-600" />
                   اطلاعات ارسال
                </h3>
                <div className="flex items-start gap-3">
                   <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                   <p className="text-xs font-bold text-slate-600 leading-relaxed">
                      {order.shippingAddress || "آدرسی ثبت نشده است."}
                   </p>
                </div>
                {order.trackingNumber && (
                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col gap-1 mt-2">
                      <span className="text-[10px] font-bold text-slate-500">کد رهگیری پستی / پیک</span>
                      <span className="text-sm font-mono font-black text-slate-800 tracking-wider">
                        {order.trackingNumber}
                      </span>
                   </div>
                )}
             </div>

             {/* Chat Session */}
             <div className="h-[500px]">
               <OrderChat orderId={id!} role="customer" />
             </div>
          </div>
       </div>

       {showCancelConfirm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col">
             <div className="w-16 h-16 mx-auto bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mb-6">
                <XCircle className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-black text-slate-800 text-center mb-2">لغو سفارش</h3>
             <p className="text-xs text-slate-500 text-center font-bold mb-8 leading-relaxed">
                آیا از لغو این سفارش اطمینان دارید؟ در صورت لغو، مبلغ پرداختی به کیف پول شما مسترد خواهد شد.
             </p>
             <div className="flex gap-3">
               <button onClick={() => setShowCancelConfirm(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold text-xs transition-colors">
                  انصراف
               </button>
               <button onClick={handleCancelOrder} className="flex-1 py-3 bg-rose-600 text-white hover:bg-rose-700 rounded-xl font-bold text-xs shadow-md transition-all">
                  بله، لغو شود
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
}
