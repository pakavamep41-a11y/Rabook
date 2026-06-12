import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../lib/store";
import { formatToman } from "../../../lib/persian";
import { Check, ChevronLeft, MapPin, Truck, CreditCard, UserCircle, UploadCloud, Store, Wallet } from "lucide-react";
import { api } from "../../../lib/api";
import { Helmet } from "react-helmet-async";

export default function CheckoutWizard() {
  const { cart, user, clearCart, showAlert } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(user ? 2 : 1);

  // Form states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"shipping" | "pickup">("shipping");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState<string>("post"); // post, tipax, courier
  const [paymentMethod, setPaymentMethod] = useState<"gateway" | "transfer" | "wallet" | "later">("gateway");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const subtotal = cart.reduce((acc, c) => acc + c.totalPrice, 0);
  const shippingCost = deliveryType === "pickup" ? 0 : (shippingMethod === "post" ? 45000 : 75000);
  const grandTotal = subtotal + shippingCost;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      showAlert("کد پیامک شد (برای تست: 1234)", "info");
    } else {
       // login mock
       useStore.getState().login({ id: "u2", name: "کاربر مهمان", email: "", phone, role: "customer" }, "mock-token");
       setStep(2);
    }
  };

  const handleCreateOrder = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map(c => ({
          productId: c.productId,
          productName: c.productName,
          options: c.options,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
          totalPrice: c.totalPrice,
          fileName: c.fileName,
          note: c.note
        })),
        totalAmount: grandTotal,
        shippingFee: shippingCost,
        shippingAddress: deliveryType === "pickup" ? "تحویل حضوری - چاپخانه مرکزی" : `${address} - کد پستی: ${postalCode}`,
        shippingMethod: deliveryType === "pickup" ? "pickup" : shippingMethod,
        paymentMethod: paymentMethod
      };

      const res = await api.post("/orders/create", payload);
      
      // Clear cart
      clearCart();
      
      // Simulate redirect to gateway if selected
      if (paymentMethod === "gateway") {
         showAlert("در حال انتقال به درگاه پرداخت...", "info");
         setTimeout(() => {
             navigate(`/checkout/success?order=${res.data.order.orderNumber}&status=paid`);
         }, 1500);
      } else {
         navigate(`/checkout/success?order=${res.data.order.orderNumber}&status=pending`);
      }

    } catch(e) {
       showAlert("خطا در ایجاد سفارش", "error");
       setIsSubmitting(false);
    }
  };

  // Steps Configuration
  const steps = [
    { id: 1, title: "هویت", icon: UserCircle },
    { id: 2, title: "آدرس", icon: MapPin },
    { id: 3, title: "ارسال", icon: Truck },
    { id: 4, title: "پرداخت", icon: CreditCard },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-10">
      <Helmet><title>تسویه حساب | چاپخانه</title></Helmet>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative">
         <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-slate-100 z-0 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-500" 
               style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
             />
         </div>
         {steps.map((s) => {
            const isActive = step === s.id;
            const isDone = step > s.id;
            const Icon = s.icon;
            return (
               <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all bg-white ${
                     isActive ? "border-emerald-500 text-emerald-600 shadow-md shadow-emerald-500/20" : 
                     isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 text-slate-400"
                  }`}>
                     {isDone ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-bold ${isActive || isDone ? "text-slate-800" : "text-slate-400"}`}>{s.title}</span>
               </div>
            );
         })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
         <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Step 1: Auth */}
            {step === 1 && (
               <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-fade-in">
                  <h2 className="text-xl font-black text-slate-800 mb-6">ورود یا ثبت‌نام سریع</h2>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4 max-w-md">
                     <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-bold text-slate-600">شماره موبایل</label>
                       <input 
                         type="tel" 
                         value={phone}
                         onChange={(e)=>setPhone(e.target.value)}
                         disabled={otpSent}
                         className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-left font-mono"
                         placeholder="09123456789"
                         required
                       />
                     </div>
                     {otpSent && (
                        <div className="flex flex-col gap-1.5 animate-fade-in">
                           <label className="text-xs font-bold text-slate-600">کد تایید پیامک شده</label>
                           <input 
                             type="text"
                             value={otp}
                             onChange={(e)=>setOtp(e.target.value)}
                             className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-center font-mono tracking-widest text-lg"
                             placeholder="----"
                             required
                           />
                        </div>
                     )}
                     <button type="submit" className="mt-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                        {otpSent ? "تایید و ادامه" : "ارسال کد یکبار مصرف"}
                     </button>
                  </form>
               </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
               <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-fade-in">
                  <h2 className="text-xl font-black text-slate-800 mb-6">آدرس تحویل یا ارسال</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <button 
                        onClick={() => setDeliveryType("shipping")}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryType === "shipping" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}
                     >
                        <Truck className="w-8 h-8" />
                        <span className="font-bold text-sm">ارسال به آدرس</span>
                     </button>
                     <button 
                        onClick={() => setDeliveryType("pickup")}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${deliveryType === "pickup" ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}
                     >
                        <Store className="w-8 h-8" />
                        <span className="font-bold text-sm">دریافت حضوری (رایگان)</span>
                     </button>
                  </div>

                  {deliveryType === "shipping" && (
                     <div className="flex flex-col gap-4 animate-fade-in">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold text-slate-600">آدرس دقیق پستی</label>
                           <textarea 
                             value={address}
                             onChange={(e) => setAddress(e.target.value)}
                             rows={3}
                             placeholder="استان، شهر، خیابان، کوچه، پلاک، واحد"
                             className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm leading-relaxed"
                           />
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold text-slate-600">کد پستی (۱۰ رقمی)</label>
                           <input 
                             type="text" 
                             value={postalCode}
                             onChange={(e) => setPostalCode(e.target.value)}
                             className="border border-slate-200 p-3 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                           />
                        </div>
                     </div>
                  )}

                  {deliveryType === "pickup" && (
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-fade-in text-center flex flex-col items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">چاپخانه مرکزی تهران</span>
                        <span className="text-xs text-slate-500 leading-relaxed max-w-sm">تهران، میدان انقلاب، خیابان کارگر جنوبی، کوچه چاپچی، پلاک ۱۴، طبقه همکف. پس از پیامک آماده‌سازی، به این آدرس مراجعه کنید.</span>
                     </div>
                  )}

                  <div className="mt-8 flex justify-end">
                     <button 
                        onClick={() => {
                           if(deliveryType === "shipping" && (!address || !postalCode)) {
                               showAlert("لطفا آدرس و کد پستی را تکمیل کنید", "error"); return;
                           }
                           setStep(3)
                        }}
                        className="bg-emerald-500 text-slate-900 py-3 px-8 rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors flex items-center gap-2"
                     >
                        مرحله بعد <ChevronLeft className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            )}

            {/* Step 3: Shipping */}
            {step === 3 && (
               <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-fade-in">
                  <h2 className="text-xl font-black text-slate-800 mb-6">نحوه ارسال مرسوله</h2>
                  
                  {deliveryType === "pickup" ? (
                     <div className="text-center text-sm text-slate-500 py-8 bg-slate-50 rounded-2xl border border-slate-100">
                        شما تحویل حضوری را انتخاب کرده‌اید. نیازی به انتخاب حامل نیست.
                     </div>
                  ) : (
                     <div className="flex flex-col gap-4">
                        {[
                           { id: "post", name: "پست پیشتاز", price: 45000, desc: "۲ الی ۴ روز کاری پس از تولید" },
                           { id: "tipax", name: "تیپاکس (پس کرایه)", price: 0, desc: "سریع - هزینه ارسال در محل دریافت می‌شود" },
                           { id: "courier", name: "پیک ویژه تهران", price: 75000, desc: "تحویل همان روز پس از تولید" },
                        ].map(method => (
                           <label key={method.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === method.id ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-slate-100 hover:border-slate-200 bg-white"}`}>
                              <div className="flex items-center gap-4">
                                 <input type="radio" name="shippingMethod" value={method.id} checked={shippingMethod === method.id} onChange={(e) => setShippingMethod(e.target.value)} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                                 <div className="flex flex-col">
                                    <span className="font-bold text-sm text-slate-800">{method.name}</span>
                                    <span className="text-xs text-slate-500">{method.desc}</span>
                                 </div>
                              </div>
                              <span className="font-bold text-slate-800 font-mono">
                                 {method.price === 0 ? "پس‌کرایه" : formatToman(method.price)}
                              </span>
                           </label>
                        ))}
                     </div>
                  )}

                  <div className="mt-8 flex justify-between">
                     <button onClick={() => setStep(2)} className="text-slate-500 font-bold text-sm px-4 hover:underline">مرحله قبل</button>
                     <button 
                        onClick={() => setStep(4)}
                        className="bg-emerald-500 text-slate-900 py-3 px-8 rounded-xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors flex items-center gap-2"
                     >
                        مرحله بعد <ChevronLeft className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
               <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-fade-in">
                  <h2 className="text-xl font-black text-slate-800 mb-6">نحوه پرداخت</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button 
                        onClick={() => setPaymentMethod("gateway")}
                        className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-start transition-all ${paymentMethod === "gateway" ? "border-emerald-500 bg-emerald-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
                     >
                        <CreditCard className={`w-6 h-6 mt-1 ${paymentMethod === "gateway" ? "text-emerald-600" : "text-slate-400"}`} />
                        <div className="flex flex-col gap-1">
                           <span className="font-bold text-sm text-slate-800">درگاه پرداخت آنلاین</span>
                           <span className="text-[11px] text-slate-500 leading-relaxed">پرداخت با تمامی کارت‌های عضو شتاب به صورت آنی. (زرین‌پال / سامان)</span>
                        </div>
                     </button>
                     
                     <button 
                        onClick={() => setPaymentMethod("transfer")}
                        className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-start transition-all ${paymentMethod === "transfer" ? "border-emerald-500 bg-emerald-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
                     >
                        <UploadCloud className={`w-6 h-6 mt-1 ${paymentMethod === "transfer" ? "text-emerald-600" : "text-slate-400"}`} />
                        <div className="flex flex-col gap-1">
                           <span className="font-bold text-sm text-slate-800">کارت به کارت (فیش بانکی)</span>
                           <span className="text-[11px] text-slate-500 leading-relaxed">واریز به حساب و بارگذاری رسید. تا تایید مالی حسابداری سفارش معلق میماند.</span>
                        </div>
                     </button>

                     <button 
                        onClick={() => setPaymentMethod("wallet")}
                        disabled={true} // For demo
                        className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-start transition-all opacity-60 ${paymentMethod === "wallet" ? "border-emerald-500 bg-emerald-50" : "border-slate-100 bg-white"}`}
                     >
                        <Wallet className="w-6 h-6 mt-1 text-slate-400" />
                        <div className="flex flex-col gap-1">
                           <span className="font-bold text-sm text-slate-800">کسر از کیف پول (موجودی: ۰)</span>
                           <span className="text-[11px] text-slate-500 leading-relaxed">موجودی کافی نیست. شارژ حساب جهت استفاده از کیف پول الزامیست.</span>
                        </div>
                     </button>

                     <button 
                        onClick={() => setPaymentMethod("later")}
                        className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-start transition-all ${paymentMethod === "later" ? "border-emerald-500 bg-emerald-50" : "border-slate-100 bg-white hover:border-slate-200"}`}
                     >
                        <Check className={`w-6 h-6 mt-1 ${paymentMethod === "later" ? "text-emerald-600" : "text-slate-400"}`} />
                        <div className="flex flex-col gap-1">
                           <span className="font-bold text-sm text-slate-800">بررسی توسط اپراتور و پرداخت بعدی</span>
                           <span className="text-[11px] text-slate-500 leading-relaxed">فایل‌ها ابتدا بررسی می‌شوند، در صورت تایید لینک پرداخت در چت سفارش ارسال می‌گردد.</span>
                        </div>
                     </button>
                  </div>

                  {paymentMethod === "transfer" && (
                     <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in flex flex-col gap-3 text-sm">
                        <div className="flex justify-between items-center text-slate-600">
                           <span>شماره کارت:</span>
                           <span className="font-mono font-bold tracking-widest text-slate-800 text-lg">6037-9911-2233-4455</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                           <span>شماره شبا:</span>
                           <span className="font-mono font-bold text-slate-800">IR010200000000000000000000</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                           <span>به نام:</span>
                           <span className="font-bold text-slate-800">شرکت چاپ و بسته‌بندی</span>
                        </div>
                        <div className="border-t border-slate-200 my-2" />
                        <label className="flex flex-col gap-2">
                           <span className="text-xs font-bold text-slate-800">بارگذاری تصویر فیش واریزی</span>
                           <input type="file" className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                        </label>
                     </div>
                  )}

                  <div className="mt-8 flex justify-between">
                     <button onClick={() => setStep(3)} className="text-slate-500 font-bold text-sm px-4 hover:underline">مرحله قبل</button>
                     <button 
                        onClick={handleCreateOrder}
                        disabled={isSubmitting}
                        className="bg-slate-900 text-white py-3 px-8 rounded-xl font-black hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg"
                     >
                        {isSubmitting ? "در حال ثبت سفارش..." : "تایید نهایی و تراکنش"}
                     </button>
                  </div>
               </div>
            )}

         </div>

         {/* Review Cart Summary - Col 4 */}
         <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-6 border border-slate-100 sticky top-24 shadow-sm">
             <h3 className="text-lg font-black text-slate-800 border-b border-slate-200 pb-4 mb-4">مرور اقلام سفارش</h3>
             
             <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                   <div key={item.id} className="flex justify-between items-start gap-4">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-slate-800 leading-snug">{item.productTitle}</span>
                         <span className="text-[10px] text-slate-500">تیراژ: {item.quantity}</span>
                      </div>
                      <span className="text-sm font-bold font-mono text-slate-600">{formatToman(item.totalPrice)}</span>
                   </div>
                ))}
             </div>

             <div className="border-t border-slate-200 mt-6 pt-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm text-slate-500">
                   <span>مجموع سبد خرید:</span>
                   <span className="font-mono">{formatToman(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500">
                   <span>هزینه بسته‌بندی و ارسال:</span>
                   <span className="font-mono">{shippingCost === 0 ? "رایگان" : formatToman(shippingCost)}</span>
                </div>
                
                <div className="flex justify-between items-end mt-2 pt-4 border-t border-slate-200">
                   <span className="font-bold text-slate-800">مبلغ قابل پرداخت:</span>
                   <span className="text-2xl font-black text-emerald-600 font-mono">{formatToman(grandTotal)}</span>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
}
