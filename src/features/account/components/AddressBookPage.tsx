import { useState } from "react";
import { BookOpen, Plus, MapPin, Trash2, Edit2, CheckCircle } from "lucide-react";
import { useStore } from "../../../lib/store";

export default function AddressBookPage() {
  const { showAlert } = useStore();
  const [addresses, setAddresses] = useState([
    { id: 1, title: "خانه", address: "تهران، میدان ونک، خیابان گاندی، کوچه پنجم، پلاک ۵، واحد ۲", postalCode: "1983944331", receiver: "علیرضا احمدی", phone: "09123456789", isDefault: true },
    { id: 2, title: "دفتر شرکت", address: "تهران، بلوار میرداماد، مجتمع کامپیوتر پایتخت، طبقه سوم، واحد ۳۰۱", postalCode: "1969766543", receiver: "انتشارات رابوک", phone: "02188776655", isDefault: false },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    showAlert("آدرس حذف شد.", "success");
  };

  const setAsDefault = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    showAlert("آدرس پیش‌فرض تغییر کرد.", "success");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">دفترچه آدرس‌ها</h2>
          <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            آدرس جدید
          </button>
       </div>

       {isFormOpen && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-4">
             <h3 className="text-sm font-bold text-slate-800 mb-4">افزودن آدرس جدید</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">عنوان آدرس</label>
                  <input type="text" placeholder="مثلا: انبار نیاوران" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">نام تحویل گیرنده</label>
                  <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">شماره تماس (موبایل یا ثابت)</label>
                  <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono text-left" dir="ltr" />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">کد پستی ۱۰ رقمی</label>
                  <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-xs font-mono text-left" dir="ltr" />
               </div>
               <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 mb-1 block">آدرس دقیق</label>
                  <textarea rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-xs resize-none"></textarea>
               </div>
             </div>
             <div className="flex gap-3 justify-end mt-4">
               <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold">انصراف</button>
               <button onClick={() => { setIsFormOpen(false); showAlert("آدرس با موفقیت ذخیره شد.", "success"); }} className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">ذخیره آدرس</button>
             </div>
          </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {addresses.map(addr => (
           <div key={addr.id} className={`bg-white rounded-2xl border p-5 relative transition-all ${addr.isDefault ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
              {addr.isDefault && (
                 <div className="absolute top-4 left-4 flex flex-col items-center gap-1 text-emerald-600">
                    <CheckCircle className="w-5 h-5 bg-white rounded-full" />
                    <span className="text-[9px] font-bold">پیش‌فرض</span>
                 </div>
              )}
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-3 pr-1">
                 <MapPin className="w-4 h-4 text-emerald-600" />
                 {addr.title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium min-h-[40px] mb-4">
                 {addr.address}
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2 mb-4">
                 <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>تحویل گیرنده: <span className="text-slate-700">{addr.receiver}</span></span>
                    <span className="font-mono text-slate-700">{addr.phone}</span>
                 </div>
                 <div className="text-[10px] font-bold text-slate-500">
                    کد پستی: <span className="font-mono text-slate-700">{addr.postalCode}</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 {!addr.isDefault && (
                    <button onClick={() => setAsDefault(addr.id)} className="flex-1 py-2 text-[10px] font-bold bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-lg transition-colors">
                      انتخاب به عنوان پیش‌فرض
                    </button>
                 )}
                 <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                 <button onClick={() => handleDelete(addr.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
           </div>
         ))}
       </div>

    </div>
  );
}
