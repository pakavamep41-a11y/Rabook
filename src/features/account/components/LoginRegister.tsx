import { useState, FormEvent } from "react";
import { useStore } from "../../../lib/store";
import { api } from "../../../lib/api";
import { CircleUser, Key, Smile, Sparkles, Mail, UserPlus } from "lucide-react";

export default function LoginRegister() {
  const { login, showAlert } = useStore();
  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showAlert("لطفاً هم ایمیل و هم رمز عبور را وارد نمایید.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      showAlert(res.data.message || "خوش آمدید!", "success");
    } catch (err: any) {
      showAlert(err.message || "ارتباط با مشکل مواجه شد.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showAlert("تکمیل تمامی فیلدهای ثبت‌نام اجباری است.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/register", { name, email, phone });
      login(res.data.user, res.data.token);
      showAlert(res.data.message || "حساب شما ایجاد شد و ورود موفقیت‌آمیز بود.", "success");
    } catch (err: any) {
      showAlert(err.message || "ثبت‌نام شکست خورد.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper quick loggers
  const handleQuickLogin = async (userType: "client" | "admin") => {
    setIsSubmitting(true);
    try {
      const targetEmail = userType === "admin" ? "admin@example.com" : "client@example.com";
      const res = await api.post("/auth/login", { email: targetEmail, password: "password123" });
      login(res.data.user, res.data.token);
      showAlert(`ورود موفقیت‌آمیز به عنوان ${res.data.user.name}`, "success");
    } catch (err: any) {
      showAlert(err.message || "خطا در ورود سریع.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      
      {/* Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        
        {/* Banner header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-transparent opacity-60" />
          <div className="relative z-10 flex flex-col gap-1.5 text-center">
            <h2 className="text-lg font-black tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="text-emerald-400 w-5 h-5" />
              <span>پرتال کاربران چاپخانه نقش و نگار</span>
            </h2>
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
              SECURE WEB2PRINT AUTH PANEL
            </p>
          </div>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button 
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 text-center ${
              isLoginTab 
                ? "border-emerald-600 text-emerald-600 bg-white" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            ورود به حساب کاربری
          </button>
          <button 
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-4 text-xs font-bold transition-all border-b-2 text-center ${
              !isLoginTab 
                ? "border-emerald-600 text-emerald-600 bg-white" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            عضویت در پرتال چاپخانه
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6">
          {isLoginTab ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">ایمیل آدرس</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    required
                    className="p-3 ps-9 border border-slate-200 rounded-xl text-xs font-mono w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">رمز عبور</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز ورود شما"
                    required
                    className="p-3 ps-9 border border-slate-200 rounded-xl text-xs w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "در حال اتصال به پایگاه..." : "ورود به سامانه"}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">نام و نام خانوادگی</label>
                <div className="relative">
                  <Smile className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="جهت درج روی فاکتور چاپی"
                    required
                    className="p-3 ps-9 border border-slate-200 rounded-xl text-xs w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">آدرس ایمیل</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    required
                    className="p-3 ps-9 border border-slate-200 rounded-xl text-xs font-mono w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">تلفن همراه</label>
                <div className="relative">
                  <UserPlus className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    required
                    className="p-3 ps-9 border border-slate-200 rounded-xl text-xs font-mono w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-extrabold rounded-xl shadow-md transition-all"
              >
                <span>{isSubmitting ? "ثبت اطلاعات..." : "ایجاد حساب کاربری"}</span>
              </button>
            </form>
          )}

          {/* Quick Mock Login Helpers - Highly requested for testing sandbox */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
            <span className="text-[10px] text-slate-400 font-bold block text-center">
              کاربر گرامی، جهت بررسی سناریوهای کاربری و مدیریتی از دکمه‌های تستی زیر استفاده نمایید:
            </span>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => handleQuickLogin("client")}
                className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100/50 text-emerald-800 font-bold rounded-xl transition-all text-[11px] flex items-center justify-center gap-1"
              >
                <CircleUser className="w-3.5 h-3.5" />
                <span>ورود تستی مشتری</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="flex-1 py-2.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-100/50 text-purple-800 font-bold rounded-xl transition-all text-[11px] flex items-center justify-center gap-1"
              >
                <CircleUser className="w-3.5 h-3.5" />
                <span>ورود تستی ادمین</span>
              </button>
            </div>
            <div className="text-[9px] text-slate-400 text-center font-mono">
              admin@example.com (سیستم ادمین) | client@example.com (کاربر عادی)
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
