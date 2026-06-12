import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../lib/store";
import { formatToman } from "../../lib/persian";
import { ShoppingCart, User as UserIcon, LogOut, Settings, Languages, AlertCircle, Sparkles, MessageSquare } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, cart, usePersianDigits, togglePersianDigits, logout, alert, hideAlert } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const cartAmount = cart.reduce((acc, c) => acc + c.totalPrice, 0);

  const activeLinkStyle = "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1";
  const normLinkStyle = "text-slate-600 hover:text-emerald-600 transition-colors pb-1";

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Dynamic Alerts */}
      {alert && (
        <div 
          onClick={hideAlert}
          className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50 md:max-w-md p-4 rounded-xl shadow-xl flex items-center justify-between cursor-pointer border animate-bounce ${
            alert.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : alert.type === "error" 
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
          </div>
          <button className="text-xs opacity-60 hover:opacity-100 ps-3">بستن</button>
        </div>
      )}

      {/* Primary Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-40 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:bg-emerald-700 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-800">نقش و نگار</span>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest">WEB2PRINT SYSTEM</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/" className={location.pathname === "/" ? activeLinkStyle : normLinkStyle}>
                صفحه اصلی
              </Link>
              <Link to="/#catalog" className={normLinkStyle}>
                کاتالوگ محصولات
              </Link>
              <Link to="/account" className={location.pathname.startsWith("/account") ? activeLinkStyle : normLinkStyle}>
                حساب کاربری
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className={location.pathname.startsWith("/admin") ? activeLinkStyle : normLinkStyle}>
                  پنل مدیریت
                </Link>
              )}
            </nav>
          </div>

          {/* Quick Access Actions */}
          <div className="flex items-center gap-4">
            
            {/* Digit Converter Toggle */}
            <button 
              onClick={togglePersianDigits}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-xs flex items-center gap-1.5 font-mono"
              title="تغییر نمایش اعداد بین فارسی و انگلیسی"
            >
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>{usePersianDigits ? "اعداد فارسی" : "English Digits"}</span>
            </button>

            {/* Shopping Cart Indicator */}
            <Link 
              to="/cart" 
              className="p-2.5 bg-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 font-bold rounded-full flex items-center justify-center">
                    {usePersianDigits ? cartCount.toLocaleString("fa-IR") : cartCount}
                  </span>
                  <span className="hidden lg:inline text-xs font-semibold">
                    {formatToman(cartAmount)}
                  </span>
                </>
              )}
            </Link>

            {/* User Account / Navigation Controls */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/account" 
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-700 text-sm"
                >
                  {user.avatar ? (
                    <img src={user.avatar} className="w-6 h-6 rounded-full bg-emerald-50" referrerPolicy="no-referrer" alt={user.name} />
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                </Link>

                {user.role === "admin" && (
                  <Link 
                    to="/admin" 
                    className="p-2.5 text-slate-500 hover:text-emerald-600 rounded-xl hover:bg-slate-50 transition-colors"
                    title="پنل مدیریت چاپخانه"
                  >
                    <Settings className="w-5 h-5" />
                  </Link>
                )}

                <button 
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  title="خروج از حساب"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link 
                to="/account" 
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all shadow-md focus:ring-2 focus:ring-slate-950"
              >
                <UserIcon className="w-4 h-4" />
                <span>ورود / ثبت‌نام</span>
              </Link>
            )}

          </div>
        </div>

        {/* Mobile Navigation Rail */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-100 bg-white py-2 text-xs">
          <Link to="/" className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600">
            <span className="font-semibold text-[10px]">خانه</span>
          </Link>
          <a href="/#catalog" className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600">
            <span className="font-semibold text-[10px]">محصولات</span>
          </a>
          <Link to="/cart" className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600">
            <span className="font-semibold text-[10px]">سبد خرید</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-600">
            <span className="font-semibold text-[10px]">پنل من</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Elegant Persian Footer */}
      <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white p-2 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-white text-lg">نقش و نگار</span>
              </div>
              <p className="leading-relaxed text-xs text-slate-400">
                سامانه سفارش آنلاین چاپی متصل به دستگاه‌های چاپ مجهز و مدرن. 
                ما خدمات طراحی، برآورد قیمت هوشمند بر اساس نوع کاغذ، روکش و ابعاد، و ارسال امن درب منزل را برای هموطنان گرامی دورودراین سرزمین ارائه میدهیم.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">دسترسی سریع</h4>
              <ul className="flex flex-col gap-2 text-xs">
                <li><Link to="/" className="hover:text-emerald-500 transition-colors">صفحه اصلی</Link></li>
                <li><a href="/#catalog" className="hover:text-emerald-500 transition-colors">محصولات چاپی</a></li>
                <li><Link to="/account" className="hover:text-emerald-500 transition-colors">پیگیری سفارشات</Link></li>
                <li><Link to="/cart" className="hover:text-emerald-500 transition-colors">سبد خرید</Link></li>
                <li><Link to="/dev/ui" className="hover:text-emerald-500 transition-colors">ابزار توسعه: UI Kit</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">پشتیبانی ۲۴ ساعته</h4>
              <p className="text-xs leading-relaxed text-slate-400 mb-2">
                سوالی دارید؟ از طریق بخش چت آنلاین حساب کاربری مستقیماً به اپراتور متصل شوید.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 py-1.5 px-3 rounded border border-emerald-900/40 inline-flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>پشتیبانی چت آنلاین در حساب من</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {usePersianDigits ? "۱۴۰۵" : "2026"} تمامی حقوق مادی و معنوی متعلق به چاپخانه نقش و نگار می‌باشد.</p>
            <p className="font-mono text-slate-500">SYSTEM BUILD VERSION 2.1.0-RTL</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
