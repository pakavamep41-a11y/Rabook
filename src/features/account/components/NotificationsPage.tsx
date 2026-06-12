import { useState } from "react";
import { Bell, CheckCheck, Settings2 } from "lucide-react";
import { formatJalali } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

export default function NotificationsPage() {
  const { showAlert } = useStore();
  const [notifications, setNotifications] = useState([
    { id: 1, title: "سفارش شما در حال چاپ است", body: "سفارش شماره 10321 وارد مرحله چاپ شد و به زودی آماده ارسال می‌شود.", date: new Date().toISOString(), read: false, type: "order" },
    { id: 2, title: "فایل شما رد شد", body: "لطفاً حاشیه برش ۵ میلی‌متر را در طرح خود رعایت کرده و مجدداً آپلود کنید.", date: new Date(Date.now() - 86400000).toISOString(), read: true, type: "alert" },
    { id: 3, title: "پیشنهاد ویژه یلدا", body: "تا پایان آذرماه می‌توانید از تخفیف ۲۰ درصدی برای تمامی محصولات استفاده کنید.", date: new Date(Date.now() - 3 * 86400000).toISOString(), read: true, type: "promo" },
  ]);

  const [showSettings, setShowSettings] = useState(false);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showAlert("همه اعلان‌ها خوانده شدند.", "success");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">اعلان‌ها</h2>
          <div className="flex gap-2">
            <button onClick={markAllRead} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5">
               <CheckCheck className="w-4 h-4" />
               <span className="hidden sm:inline">خواندن همه</span>
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5">
               <Settings2 className="w-4 h-4" />
               <span className="hidden sm:inline">تنظیمات</span>
            </button>
          </div>
       </div>

       {showSettings && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-2 animate-fade-in">
             <h3 className="text-sm font-bold text-slate-800 mb-4">تنظیمات دریافت پیامک و ایمیل</h3>
             <div className="flex flex-col gap-4 max-w-lg">
                {[
                  { id: 'status', label: 'تغییر وضعیت سفارشات', sms: true, email: false },
                  { id: 'ticket', label: 'پاسخ به تیکت‌های پشتیبانی', sms: true, email: true },
                  { id: 'promo', label: 'اطلاع از تخفیف‌ها و پیشنهادات', sms: false, email: true },
                ].map((pref) => (
                   <div key={pref.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50">
                      <span className="text-xs font-bold text-slate-700">{pref.label}</span>
                      <div className="flex gap-4">
                         <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-500">
                           <input type="checkbox" defaultChecked={pref.sms} className="accent-emerald-600" /> پیامک
                         </label>
                         <label className="flex items-center gap-2 cursor-pointer text-[10px] font-bold text-slate-500">
                           <input type="checkbox" defaultChecked={pref.email} className="accent-emerald-600" /> ایمیل
                         </label>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       )}

       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col divide-y divide-slate-100">
         {notifications.map(n => (
           <div key={n.id} className={`p-5 flex gap-4 transition-colors ${!n.read ? 'bg-emerald-50/30' : 'bg-white hover:bg-slate-50/50'}`}>
              <div className={`mt-1 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!n.read ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                 <Bell className="w-5 h-5" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                 <div className="flex justify-between items-start gap-4">
                    <h4 className={`text-sm ${!n.read ? 'font-black text-emerald-900' : 'font-bold text-slate-700'}`}>{n.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap pt-1 flex items-center gap-1">
                       {!n.read && <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse mr-1"></span>}
                       {formatJalali(n.date)}
                    </span>
                 </div>
                 <p className={`text-xs leading-relaxed ${!n.read ? 'text-emerald-800' : 'text-slate-500 font-medium'}`}>{n.body}</p>
                 {!n.read && (
                    <button onClick={() => setNotifications(notifications.map(x => x.id === n.id ? {...x, read:true} : x))} className="text-[10px] font-bold text-emerald-600 self-end mt-2 hover:underline">علامت به عنوان خوانده شده</button>
                 )}
              </div>
           </div>
         ))}
         {notifications.length === 0 && (
           <div className="p-12 text-center text-sm font-bold text-slate-400">اعلان جدیدی ندارید.</div>
         )}
       </div>

    </div>
  );
}
