import { useState } from "react";
import { User, Shield, CheckCircle, Smartphone } from "lucide-react";
import { useStore } from "../../../lib/store";

export default function ProfilePage() {
  const { user, showAlert } = useStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showAlert("اطلاعات کاربری با موفقیت ویرایش شد.", "success");
    }, 1000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
       setIsSaving(false);
       showAlert("گذرواژه با موفقیت تغییر کرد.", "success");
       setCurrentPassword("");
       setNewPassword("");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
       <h2 className="text-xl font-black text-slate-800">پروفایل کاربری</h2>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Profile Edit */}
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">مشخصات عمومی</h3>
           </div>
           <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-bold text-slate-500">نام و نام خانوادگی</label>
                 <input type="text" value={name} onChange={e => setName(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" required />
              </div>
              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-bold text-slate-500">نام شرکت / سازمان (اختیاری)</label>
                 <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
              </div>
              <div className="flex flex-col gap-1.5 relative">
                 <label className="text-xs font-bold text-slate-500">ایمیل آدرس</label>
                 <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:ring-1 focus:ring-emerald-500" dir="ltr" />
              </div>
              <div className="flex flex-col gap-1.5 relative">
                 <div className="flex justify-between">
                   <label className="text-xs font-bold text-slate-500">شماره موبایل</label>
                   <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 rounded flex items-center gap-1 font-bold"><CheckCircle className="w-3 h-3" /> تایید شده</span>
                 </div>
                 <div className="flex gap-2">
                   <input type="tel" value={phone} disabled className="flex-1 p-3 border border-slate-200 bg-slate-50 rounded-xl text-sm font-mono text-left cursor-not-allowed" dir="ltr" />
                   <button type="button" className="px-4 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold transition-colors">تغییر</button>
                 </div>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                 <button disabled={isSaving} className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                   {isSaving ? "درحال ذخیره..." : "ذخیره تغییرات"}
                 </button>
              </div>
           </form>
         </div>

         {/* Password Edit */}
         <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-fit">
           <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">امنیت حساب و رمز عبور</h3>
           </div>
           <form onSubmit={handleSavePassword} className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-bold text-slate-500">رمز عبور فعلی</label>
                 <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:ring-1 focus:ring-emerald-500" dir="ltr" />
              </div>
              <div className="flex flex-col gap-1.5">
                 <label className="text-xs font-bold text-slate-500">رمز عبور جدید</label>
                 <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="p-3 border border-slate-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:ring-1 focus:ring-emerald-500" dir="ltr" />
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100">
                 <button disabled={isSaving} className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-md">
                   تغییر گذرواژه
                 </button>
              </div>
           </form>
         </div>
       </div>

    </div>
  );
}
