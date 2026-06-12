import { useState } from "react";
import { UserCog, Plus, Shield, Check, X, ShieldAlert } from "lucide-react";

export default function AdminStaff() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-800">پرسنل و سطوح دسترسی</h1>
            <span className="text-xs text-slate-500 font-bold mt-1">مدیریت تیم‌ها (اپراتور، طراح گرافیک، حسابدار، مدیر)</span>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm w-fit">
            <Plus className="w-4 h-4" /> دعوت پرسنل جدید
          </button>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none rounded-t-3xl p-2 gap-2">
             {[
                { id: 'users', label: 'لیست پرسنل سیستم', icon: UserCog },
                { id: 'roles', label: 'مدیریت نقش‌ها و دسترسی‌ها (Matrix)', icon: ShieldAlert },
             ].map(tab => (
                <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-5 py-3 text-xs font-bold flex items-center gap-2 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-sm border border-slate-200 text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                   <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
             ))}
          </div>

          <div className="p-4">
             {activeTab === 'users' && (
                <div className="overflow-x-auto mt-2">
                   <table className="w-full text-xs text-right">
                      <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                         <tr>
                            <th className="p-4 font-bold">نام و نام خانوادگی</th>
                            <th className="p-4 font-bold">نقش سازمانی</th>
                            <th className="p-4 font-bold">وضعیت</th>
                            <th className="p-4 font-bold">آخرین ورود</th>
                            <th className="p-4 font-bold">عملیات</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                         <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                               <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-800">امیر رضوانی</span>
                                  <span className="text-[10px] text-slate-500 font-mono">09121112233</span>
                               </div>
                            </td>
                            <td className="p-4">
                               <span className="bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold">مدیر ارشد (Super Admin)</span>
                            </td>
                            <td className="p-4"><span className="text-emerald-600 font-bold">فعال</span></td>
                            <td className="p-4 font-mono text-slate-500">2 دقیقه پیش</td>
                            <td className="p-4"></td>
                         </tr>
                         <tr className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                               <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-800">سارا محمدی</span>
                                  <span className="text-[10px] text-slate-500 font-mono">09124445566</span>
                               </div>
                            </td>
                            <td className="p-4">
                               <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-1 rounded text-[10px] font-bold">طراح گرافیک / تایید فایل</span>
                            </td>
                            <td className="p-4"><span className="text-emerald-600 font-bold">فعال</span></td>
                            <td className="p-4 font-mono text-slate-500">دیروز 14:30</td>
                            <td className="p-4"><button className="text-blue-600 font-bold text-[10px]">ویرایش دسترسی</button></td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             )}

             {activeTab === 'roles' && (
                <div className="flex flex-col gap-6 p-2 animate-fade-in">
                   <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4">
                      <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col gap-1">
                         <span className="text-sm font-bold text-amber-800">ماتریس دسترسی نقش‌ها</span>
                         <span className="text-xs text-amber-700/80 leading-relaxed max-w-2xl">در این جدول مشخص کنید هر نقش کاربری به کدام بخش‌های پورتال ادمین دسترسی خواندن (مشاهده) و نوشتن (ویرایش/حذف) دارد.</span>
                      </div>
                   </div>

                   <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50 p-4 border-b border-slate-200 grid grid-cols-4 gap-4 text-xs font-bold text-slate-600 text-center items-center">
                         <div className="text-right">عنوان ماژول / نقش</div>
                         <div>مدیر کل</div>
                         <div>طراح گرافیک</div>
                         <div>اپراتور چاپخانه</div>
                      </div>
                      <div className="divide-y divide-slate-100 text-xs font-medium bg-white">
                         {[
                            { name: 'مشاهده محصولات و کاتالوگ' },
                            { name: 'ویرایش محصولات و قیمت‌گذاری' },
                            { name: 'مشاهده سفارشات' },
                            { name: 'تغییر وضعیت سفارش و تیکت‌ها' },
                            { name: 'تایید / رد فایل‌های طراحی' },
                            { name: 'امور مالی و استرداد ها' },
                         ].map(module => (
                            <div key={module.name} className="p-4 grid grid-cols-4 gap-4 items-center text-center">
                               <div className="text-right text-slate-800 font-bold">{module.name}</div>
                               <div><Check className="w-4 h-4 text-emerald-500 mx-auto" /></div>
                               <div>
                                  {module.name.includes('مالی') || module.name.includes('ویرایش محصولات') ? 
                                    <X className="w-4 h-4 text-slate-300 mx-auto" /> : 
                                    <Check className="w-4 h-4 text-emerald-500 mx-auto" />}
                               </div>
                               <div>
                                  {module.name.includes('مالی') || module.name.includes('فایل') ? 
                                    <X className="w-4 h-4 text-slate-300 mx-auto" /> : 
                                    <Check className="w-4 h-4 text-emerald-500 mx-auto" />}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
}
