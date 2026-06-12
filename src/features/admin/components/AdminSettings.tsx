import { useState } from "react";
import { Settings, Palette, Truck, MessageSquare, Megaphone, Check } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'theme' | 'shipping' | 'integrations'>('general');

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col">
         <h1 className="text-2xl font-black text-slate-800">تنظیمات فروشگاه</h1>
         <span className="text-xs text-slate-500 font-bold mt-1">پیکربندی هویت برند، روش‌های ارسال و درگاه‌ها</span>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 flex flex-col pt-4">
             <div className="font-bold text-xs text-slate-400 px-6 pb-2">بخش‌های تنظیمات</div>
             {[
                { id: 'general', label: 'اطلاعات عمومی', icon: Settings },
                { id: 'theme', label: 'رنگ‌بندی و تم', icon: Palette },
                { id: 'shipping', label: 'روش‌های ارسال کالا', icon: Truck },
                { id: 'integrations', label: 'درگاه‌های پرداخت و پیامک', icon: MessageSquare },
             ].map(tab => (
                <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-6 py-4 text-xs font-bold flex items-center justify-start gap-3 transition-colors ${activeTab === tab.id ? 'bg-white text-emerald-700 border-l-4 border-emerald-500 shadow-sm' : 'text-slate-600 hover:bg-slate-100/50 border-l-4 border-transparent'}`}
                   style={{ borderRight: 'none', borderLeftWidth: activeTab === tab.id ? '4px' : '0' }}
                >
                   <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
             ))}
          </div>

          <div className="flex-1 p-6 md:p-8 bg-white">
             {activeTab === 'general' && (
                <div className="flex flex-col gap-8 animate-fade-in max-w-2xl">
                   <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <Settings className="w-5 h-5 text-slate-400" />
                      <h2 className="text-lg font-black text-slate-800">اطلاعات عمومی فروشگاه</h2>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                         <label className="text-xs font-bold text-slate-600 transition-colors">نام فروشگاه (Title)</label>
                         <input type="text" defaultValue="مجتمع چاپ سروسافت" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                         <label className="text-xs font-bold text-slate-600 transition-colors">شعار فروشگاه (Slogan)</label>
                         <input type="text" defaultValue="چاپ با کیفیت، در کمترین زمان" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                         <label className="text-xs font-bold text-slate-600 transition-colors">ارزش افزوده (%)</label>
                         <input type="number" defaultValue={10} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-mono font-bold text-slate-800" />
                         <span className="text-[10px] text-slate-400">مالیات ارزش افزوده که در فاکتور نهایی مبلغ به کل اضافه می‌شود. عدد 0 به معنی غیرفعال است.</span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 pt-4 border-t border-slate-100">
                         <div className="flex items-center gap-2 mb-2">
                             <Megaphone className="w-4 h-4 text-emerald-600"/>
                             <label className="text-xs font-bold text-slate-600">نوار اعلان بالای سایت (Announcement Bar)</label>
                         </div>
                         <label className="flex items-center gap-2 mb-2 cursor-pointer w-fit">
                            <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4" />
                            <span className="text-xs font-bold text-slate-700">نمایش نوار اعلان</span>
                         </label>
                         <input type="text" defaultValue="تخفیف ویژه بهاره روی تمامی کارت ویزیت‌های گلاسه!" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800" />
                      </div>
                   </div>

                   <button className="self-end px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition-colors w-fit flex items-center gap-2">
                      <Check className="w-4 h-4" /> ذخیره تنطیمات
                   </button>
                </div>
             )}

             {activeTab === 'theme' && (
                <div className="flex flex-col gap-8 animate-fade-in max-w-2xl">
                   <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                      <Palette className="w-5 h-5 text-slate-400" />
                      <h2 className="text-lg font-black text-slate-800">رنگ‌بندی برند</h2>
                   </div>
                   <p className="text-sm font-medium text-slate-500 leading-relaxed mt-2">
                      با تغییر رنگ پایه در اینجا، متغیرهای CSS سیستم (دکمه‌ها، لینک‌ها، حاشیه‌ها) تغییر خواهد کرد.
                   </p>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                       <div className="border-2 border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer bg-emerald-50/50">
                           <div className="w-12 h-12 rounded-full bg-emerald-600 shadow-sm border-2 border-white"></div>
                           <span className="text-xs font-bold text-emerald-800">سبز زمردی (فعلی)</span>
                       </div>
                       <div className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500 transition-colors group">
                           <div className="w-12 h-12 rounded-full bg-blue-600 shadow-sm border-2 border-white group-hover:scale-110 transition-transform"></div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-blue-700">آبی تکنولوژی</span>
                       </div>
                       <div className="border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-slate-900 transition-colors group">
                           <div className="w-12 h-12 rounded-full bg-slate-900 shadow-sm border-2 border-white group-hover:scale-110 transition-transform"></div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">مشکی مینیمال</span>
                       </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
