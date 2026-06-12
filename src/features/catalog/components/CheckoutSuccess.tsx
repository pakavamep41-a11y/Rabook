import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order") || "نامشخص";
  const status = searchParams.get("status") || "pending"; // 'paid' or 'pending'

  return (
    <div className="max-w-xl mx-auto py-16 text-center flex flex-col items-center gap-6 bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-xl mt-12 mb-20 animate-fade-in">
        <Helmet><title>وضعیت سفارش | چاپخانه</title></Helmet>

        {status === "paid" ? (
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
             <CheckCircle className="w-12 h-12" />
          </div>
        ) : (
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
             <Clock className="w-12 h-12" />
          </div>
        )}

        {status === "paid" ? (
           <>
              <h2 className="text-2xl font-black text-slate-800">پرداخت موفق و ثبت سفارش!</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                 سفارش شما با رسید <strong className="text-slate-900 font-mono text-base font-extrabold">{orderNumber}</strong> ثبت شد. متخصصان چاپ ما پرداخت شما را تایید کرده و سفارش مستقیما وارد فاز لیتوگرافی و چاپ گردید.
              </p>
           </>
        ) : (
           <>
              <h2 className="text-2xl font-black text-slate-800">سفارش ثبت شد، در انتظار بررسی!</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                 سفارش شما با کد پیگیری <strong className="text-slate-900 font-mono text-base font-extrabold">{orderNumber}</strong> با موفقیت در سیستم ثبت شد. فایل‌های شما پس از بررسی فنی در صورت صحت، جهت پرداخت نهایی تایید می‌شوند.
              </p>
           </>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
          <Link 
            to={`/account?order=${orderNumber}`}
            className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md"
          >
            مشاهده جزییات و چت سفارش
          </Link>
          <Link 
            to="/" 
            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
    </div>
  );
}
