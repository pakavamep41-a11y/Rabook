import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../../lib/store";
import { formatToman } from "../../../lib/persian";
import { api } from "../../../lib/api";
import { Trash2, ShoppingBag, MapPin, CreditCard, ChevronRight, CheckCircle, Smartphone } from "lucide-react";

export default function CartPage() {
  const { cart, user, usePersianDigits, updateCartItemQuantity, removeFromCart, clearCart, showAlert } = useStore();
  const navigate = useNavigate();

  // State for order form
  const [recipientName, setRecipientName] = useState(user?.name || "");
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || "");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gateway"); // gateway or manual
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<{ id: string; orderNumber: string } | null>(null);

  const cartAmount = cart.reduce((acc, c) => acc + c.totalPrice, 0);
  const shippingCost = cartAmount > 1000000 ? 0 : 45000; // Free shipping over 1,000,000 toman
  const grandTotal = cartAmount + shippingCost;

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!shippingAddress.trim()) {
      showAlert("لطفاً آدرس دقیق ارسال را وارد نمایید.", "error");
      return;
    }
    if (!recipientPhone.trim()) {
      showAlert("لطفاً تلفن همراه گیرنده را وارد نمایید.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsPayload = cart.map((c) => ({
        productId: c.productId,
        productName: c.productName,
        options: c.options,
        quantity: c.quantity,
        unitPrice: c.unitPrice,
        totalPrice: c.totalPrice,
        fileName: c.fileName,
      }));

      const res = await api.post("/orders/create", {
        items: itemsPayload,
        totalAmount: grandTotal,
        shippingAddress: `گیرنده: ${recipientName} - تلفن: ${recipientPhone} - آدرس: ${shippingAddress}`,
        paymentMethod: paymentMethod === "gateway" ? "درگاه مستقیم بانکی" : "کارت به کارت به حساب شرکت",
      });

      setCreatedOrder({
        id: res.data.order.id,
        orderNumber: res.data.order.orderNumber,
      });
      clearCart();
      showAlert("سفارش شما ثبت شد! آماده چاپ در اسرع وقت.", "success");
    } catch {
      showAlert("خطایی در اتصال یا بررسی سبد خرید رخ داده است.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Order Successfully Completed Screen
  if (createdOrder) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center flex flex-col items-center gap-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-xl animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">با تشکر! سفارش شما دریافت شد.</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
          سفارش شما با کد پیگیری <strong className="text-slate-900 font-mono text-base font-extrabold">{createdOrder.orderNumber}</strong> ثبت شد. متخصصان چاپ ما هم‌اکنون در حال بررسی ساختار فنی فایل چاپی و ابعاد آن هستند.
        </p>

        <div className="border border-slate-100 bg-slate-50 p-4 rounded-2xl w-full text-start flex flex-col gap-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">شماره سفارش:</span>
            <span className="font-bold text-slate-800 font-mono">{createdOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">مجموع پرداختی:</span>
            <span className="font-bold text-slate-800">{formatToman(grandTotal)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">بازه زمانی تحویل تقریبی:</span>
            <span className="font-bold text-emerald-700">۴ الی ۵ روز کاری</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <Link 
            to="/account" 
            className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
          >
            مشاهده سفارش چاپی من
          </Link>
          <Link 
            to="/" 
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  // 2. Empty Cart UI Screen
  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto flex flex-col items-center gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-slate-800">سبد خرید شما در حال حاضر خالی است</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            محصولات مورد نیاز خود را پیکربندی کرده و جهت استعلام زنده قیمت به سبد خرید انتقال دهید.
          </p>
        </div>
        <Link 
          to="/" 
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5"
        >
          <span>بازگشت به کاتالوگ محصولات</span>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-800">سبد خرید شما</h1>
        <p className="text-xs text-slate-400">لیست محصولات سفارشی به همراه فاکتور دقیق قیمت</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart items list - Col 7 */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {cart.map((item) => (
            <div 
              key={item.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 transition-all"
            >
              <div className="flex items-start gap-4 min-w-0 flex-1">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">{item.productName}</h3>
                  
                  {/* Option Badges list */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(item.optionsLabels).map(([label, val]) => (
                      <span key={label} className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded-md">
                        {label}: <strong className="text-slate-700 font-semibold">{val}</strong>
                      </span>
                    ))}
                  </div>

                  {/* Uploaded File Banner */}
                  <span className="text-[10px] text-emerald-600 font-medium font-mono mt-1.5 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">برون‌ده چاپی: {item.fileName}</span>
                  </span>
                </div>
              </div>

              {/* Action Controls for item */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                {/* Quantity Editor */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 p-1 rounded-xl">
                  <button 
                    onClick={() => updateCartItemQuantity(item.id, item.quantity - (item.productId === "banner" ? 1 : 100))}
                    className="w-8 h-8 font-bold text-slate-600 hover:bg-white rounded-lg transition-colors flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold font-mono px-2 text-slate-800">
                    {usePersianDigits ? item.quantity.toLocaleString("fa-IR") : item.quantity}
                  </span>
                  <button 
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + (item.productId === "banner" ? 1 : 100))}
                    className="w-8 h-8 font-bold text-slate-600 hover:bg-white rounded-lg transition-colors flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Sub Total */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{formatToman(item.totalPrice)}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatToman(item.unitPrice)} / عدد
                  </span>
                </div>

                {/* Delete Trigger */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  title="حذف از سبد خرید"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick catalog return offer */}
          <Link to="/" className="text-xs text-emerald-600 font-bold hover:underline py-1 flex items-center gap-1 justify-center sm:justify-start">
            <span>← پیکربندی و افزودن محصول چاپی دیگر</span>
          </Link>
        </div>

        {/* Checkout Shipping form panel - Col 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Summary calculations */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-slate-800 text-sm pb-3 border-b border-slate-100">پیش‌فاکتور نهایی</h3>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>جمع کل اقلام چاپی:</span>
                <span className="font-semibold font-mono">{formatToman(cartAmount)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>هزینه بسته‌بندی و ارسال پستی:</span>
                <span className="font-semibold font-mono text-emerald-600">
                  {shippingCost === 0 ? "رایگان (کمکی شرکت)" : formatToman(shippingCost)}
                </span>
              </div>
              <div className="border-t border-slate-100 my-2" />
              <div className="flex justify-between font-extrabold text-slate-800 text-sm">
                <span>کل مبلغ قابل پرداخت:</span>
                <span className="text-lg text-emerald-600 font-mono">{formatToman(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Checkout address and payment specifications form */}
          {user ? (
            <form onSubmit={handleCheckout} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
              <h3 className="font-extrabold text-slate-800 text-sm pb-1">اطلاعات ارسال و درگاه پرداختی</h3>

              {/* Recipient info row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500">نام تحویل‌گیرنده</label>
                  <input 
                    type="text" 
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                    className="p-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500">تلفن همراه تحویل‌گیرنده</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                    <input 
                      type="tel" 
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      required
                      className="p-2.5 ps-9 border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">آدرس دقیق ارسال مرسوله</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                  <textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="استان، شهر، میدان، خیابان، پلاک، طبقه و واحد"
                    required
                    rows={3}
                    className="p-2.5 ps-9 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-none w-full leading-relaxed"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-500">روش پرداخت نقدی</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod("gateway")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                      paymentMethod === "gateway" 
                        ? "border-emerald-600 bg-emerald-50/20 text-emerald-800" 
                        : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>پرداخت آنلاین مستقیم</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod("manual")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                      paymentMethod === "manual" 
                        ? "border-emerald-600 bg-emerald-50/20 text-emerald-800" 
                        : "border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>کارت به کارت / فیش</span>
                  </button>
                </div>
              </div>

              {/* Submit Checkout Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 border border-slate-900 hover:bg-emerald-600 hover:border-emerald-600 font-bold text-sm text-white rounded-2xl shadow-md transition-all mt-3"
              >
                {isSubmitting ? "در حال ثبت سفارش چاپی..." : `تکمیل نهایی و پرداخت ${formatToman(grandTotal)}`}
              </button>
            </form>
          ) : (
            <div className="bg-amber-50/50 border border-amber-100/60 p-6 rounded-3xl shadow-sm text-center flex flex-col items-center gap-4">
              <span className="text-xs text-amber-800 font-medium leading-relaxed max-w-xs">
                جهت ثبت نهایی آدرس، آپلود و تخصیص طرح پیوست به فاکتور خود، ابتدا باید وارد پرتال شوید.
              </span>
              <Link 
                to="/account" 
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                ورود یا ایجاد حساب کاربری
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
