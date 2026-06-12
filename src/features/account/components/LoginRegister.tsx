import { useState, FormEvent, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../../lib/store";
import { api } from "../../../lib/api";
import { Key, Smartphone, Sparkles, User, CircleUser, Flower2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function LoginRegister() {
  const { login, showAlert } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = new URLSearchParams(location.search).get("returnTo") || "/account";

  const [tab, setTab] = useState<"otp" | "password">("otp");
  
  // OTP States
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const otpRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Password States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let int: any;
    if (step === "otp" && timer > 0) {
      int = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(int);
  }, [step, timer]);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return showAlert("شماره موبایل نامعتبر است.", "error");

    setIsSubmitting(true);
    try {
      await api.post("/auth/otp/send", { phone });
      setStep("otp");
      setTimer(120);
      showAlert("کد ۵ رقمی برای شما ارسال شد.", "success");
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (err: any) {
      showAlert(err.message || "خطا در ارسال کد.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 5) return showAlert("لطفا کد ۵ رقمی را کامل وارد کنید.", "error");

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/otp/verify", { phone, code });
      login(res.data.user, res.data.token);
      showAlert("با موفقیت وارد شدید.", "success");
      navigate(returnTo);
    } catch (err: any) {
      showAlert(err.message || "کد وارد شده صحیح نیست.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 4) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleLoginPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return showAlert("تکمیل فیلدها الزامی است.", "error");

    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      showAlert("خوش آمدید!", "success");
      navigate(returnTo);
    } catch (err: any) {
      showAlert(err.message || "ایمیل یا رمز عبور اشتباه است.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (userType: "client" | "admin" | "staff") => {
    setIsSubmitting(true);
    try {
      const targetEmail = userType === "admin" ? "admin@print.ir" : userType === "staff" ? "staff@print.ir" : "ali@example.com";
      const res = await api.post("/auth/login", { email: targetEmail, password: "password" });
      login(res.data.user, res.data.token);
      showAlert(`ورود موفقیت‌آمیز به عنوان ${res.data.user.name}`, "success");
      navigate(returnTo);
    } catch (err: any) {
      showAlert(err.message || "خطا در ورود سریع.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Helmet><title>ورود / ثبت‌نام | چاپخانه</title></Helmet>
      
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-fade-in">
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-transparent to-transparent opacity-60" />
          <div className="relative z-10 flex flex-col gap-1.5 text-center items-center">
            <h2 className="text-lg font-black tracking-tight flex items-center justify-center gap-2">
              <Flower2 className="text-emerald-400 w-5 h-5" />
              <span>پرتال انتشارات رابوک</span>
            </h2>
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
              ورود به حساب کاربری
            </p>
          </div>
        </div>

        {step === "phone" && (
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button 
              onClick={() => setTab("otp")}
              className={`flex-1 py-4 text-xs font-bold font-mono transition-all border-b-2 text-center ${tab === "otp" ? "border-emerald-600 text-emerald-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              کد یکبار مصرف
            </button>
            <button 
              onClick={() => setTab("password")}
              className={`flex-1 py-4 text-xs font-bold font-mono transition-all border-b-2 text-center ${tab === "password" ? "border-emerald-600 text-emerald-600 bg-white" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              رمز عبور (ایمیل)
            </button>
          </div>
        )}

        <div className="p-6">
          {tab === "otp" ? (
            step === "phone" ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500">شماره موبایل</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      required
                      className="p-3 ps-10 border border-slate-200 rounded-xl text-xs font-mono w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none placeholder-slate-300 text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {isSubmitting ? "در حال پردازش..." : "دریافت کد تایید"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 animate-fade-in">
                <div className="text-center flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-700">کد تایید به شماره <b className="font-mono" dir="ltr">{phone}</b> ارسال شد.</span>
                  <button type="button" onClick={() => setStep("phone")} className="text-[10px] text-emerald-600 hover:underline">ویرایش شماره</button>
                </div>
                
                <div className="flex justify-center gap-2" dir="ltr">
                  {otp.map((digit, i) => (
                    <input 
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      autoComplete="one-time-code"
                      className="w-12 h-14 text-center font-mono font-black text-xl border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="submit"
                    disabled={isSubmitting || otp.some(d => !d)}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                  >
                    {isSubmitting ? "در حال تایید..." : "ورود به حساب"}
                  </button>
                  <div className="text-center">
                    {timer > 0 ? (
                       <span className="text-[11px] font-mono text-slate-400">امکان ارسال مجدد کد: ۰۰:{timer.toString().padStart(2, '0')}</span>
                    ) : (
                       <button type="button" onClick={handleSendOtp} className="text-[11px] font-bold text-emerald-600 hover:underline">ارسال مجدد کد</button>
                    )}
                  </div>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleLoginPassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500">ایمیل آدرس</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute start-3 top-3.5" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ali@example.com"
                    required
                    className="p-3 ps-10 border border-slate-200 rounded-xl text-xs font-mono w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                    className="p-3 ps-10 border border-slate-200 rounded-xl text-xs w-full focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                {isSubmitting ? "در حال اتصال..." : "ورود به سامانه"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
             <div className="flex gap-2">
               <button 
                 type="button"
                 onClick={() => handleQuickLogin("client")}
                 className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 font-bold rounded-xl transition-all text-[10px] flex items-center justify-center gap-1"
               >
                 <CircleUser className="w-3.5 h-3.5" /><span>مشتری</span>
               </button>
               <button 
                 type="button"
                 onClick={() => handleQuickLogin("staff")}
                 className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-800 font-bold rounded-xl transition-all text-[10px] flex items-center justify-center gap-1"
               >
                 <CircleUser className="w-3.5 h-3.5" /><span>پرسنل</span>
               </button>
               <button 
                 type="button"
                 onClick={() => handleQuickLogin("admin")}
                 className="flex-1 py-2.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-200 text-purple-800 font-bold rounded-xl transition-all text-[10px] flex items-center justify-center gap-1"
               >
                 <CircleUser className="w-3.5 h-3.5" /><span>ادمین</span>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
