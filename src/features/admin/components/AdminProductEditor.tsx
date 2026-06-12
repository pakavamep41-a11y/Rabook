import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Save, Eye, Layers, Settings2, Calculator, LayoutTemplate, Plus, Trash2, ChevronDown, Check } from "lucide-react";
import { useStore } from "../../../lib/store";

export default function AdminProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useStore();
  const isNew = !id;

  const [activeTab, setActiveTab] = useState<'info' | 'options' | 'pricing' | 'templates'>('info');
  const [isSaving, setIsSaving] = useState(false);

  // Mock states for demonstration
  const [name, setName] = useState(isNew ? "" : "کارت ویزیت گلاسه");
  const [pricingType, setPricingType] = useState("tier_table");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showAlert("محصول با موفقیت ذخیره شد.", "success");
      navigate("/admin/products");
    }, 1000);
  };

  const tabs = [
    { id: 'info', label: 'اطلاعات عمومی', icon: Layers },
    { id: 'options', label: 'گزینه‌ها و ویژگی‌ها', icon: Settings2 },
    { id: 'pricing', label: 'موتور قیمت‌گذاری', icon: Calculator },
    { id: 'templates', label: 'قالب‌های طراحی', icon: LayoutTemplate },
  ] as const;

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-3">
             <Link to="/admin/products" className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
               <ArrowRight className="w-5 h-5" />
             </Link>
             <h1 className="text-xl font-black text-slate-800">
               {isNew ? 'تعریف محصول جدید' : `ویرایش ویرایش محصول`}
             </h1>
          </div>
          <div className="flex gap-2">
             <button type="button" className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-colors">
               <Eye className="w-4 h-4" /> <span className="hidden sm:inline">پیش‌نمایش زنده</span>
             </button>
             <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md">
               {isSaving ? "در حال ذخیره..." : <><Save className="w-4 h-4" /> ذخیره کالا</>}
             </button>
          </div>
       </div>

       {/* Tabs Navigation */}
       <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none custom-scrollbar">
         {tabs.map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${activeTab === tab.id ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
           >
             <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-400' : 'text-slate-400'}`} />
             {tab.label}
           </button>
         ))}
       </div>

       {/* Tab Content Areas */}
       <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm min-h-[500px]">
          {activeTab === 'info' && (
             <div className="flex flex-col gap-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                      <label className="text-xs font-bold text-slate-600 transition-colors">نام محصول</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all font-bold text-slate-800" placeholder="مثلا: کارت ویزیت گلاسه 300 گرم" />
                   </div>
                   <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                      <label className="text-xs font-bold text-slate-600 transition-colors">نامک (Slug)</label>
                      <input type="text" dir="ltr" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-left focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all" placeholder="business-card-glasse" />
                   </div>
                   <div className="flex flex-col gap-1.5 focus-within:text-emerald-700 md:col-span-2">
                      <label className="text-xs font-bold text-slate-600 transition-colors">دسته‌بندی‌ها</label>
                      <select className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all">
                         <option>انتخاب دسته‌بندی</option>
                         <option>کارت ویزیت / گلاسه مات</option>
                      </select>
                   </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 border-dashed bg-slate-50 flex items-center justify-center flex-col gap-3 min-h-[160px]">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm"><Plus className="w-6 h-6"/></div>
                   <div className="text-sm font-bold text-slate-600">آپلود تصاویر گالری محصول</div>
                   <span className="text-[10px] text-slate-400">کشیدن و رها کردن فایل‌ها (حداکثر ۵مگابایت، JPG/PNG)</span>
                </div>

                <div className="flex flex-col gap-1.5 focus-within:text-emerald-700">
                   <label className="text-xs font-bold text-slate-600 transition-colors">توضیحات غنی (Rich Text)</label>
                   <textarea rows={6} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all resize-y" placeholder="توضیحات کامل محصول..."></textarea>
                   <span className="text-[10px] text-slate-400">در اینجا می‌توانید از ادیتور WYSIWYG استفاده کنید. (در نسخه نهایی)</span>
                </div>
             </div>
          )}

          {activeTab === 'options' && (
             <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">سازنده ویژگی‌ها (Option Set Builder)</span>
                      <span className="text-[10px] text-slate-500 mt-1">متغیرهای چاپ را تعریف کنید (مثل سایز، روکش، خدمات پس از چاپ)</span>
                   </div>
                   <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all whitespace-nowrap">
                      <Plus className="w-4 h-4" /> افزودن ویژگی جدید
                   </button>
                </div>

                {/* Mock Option Row */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
                   <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-4">
                      <div className="cursor-grab text-slate-300 hover:text-slate-500"><GripVerticalIcon /></div>
                      <div className="flex flex-col gap-1 flex-1">
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-slate-800">وجه چاپ</span>
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">فیلد انتخابی (Select)</span>
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold border border-amber-200">الزامی</span>
                         </div>
                         <span className="text-[10px] text-slate-500">کد متغیر: print_sides</span>
                      </div>
                      <div className="flex gap-2 shrink-0">
                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Settings2 className="w-4 h-4" /></button>
                         <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white">
                      <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50/30 p-2.5 rounded-xl">
                         <span className="text-xs font-bold text-slate-700">یک رو</span>
                         <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-1 rounded border border-slate-100">+0 تومان / ضرایب: 1.0</span>
                      </div>
                      <div className="flex items-center justify-between border border-slate-200 p-2.5 rounded-xl">
                         <span className="text-xs font-bold text-slate-700">دو رو</span>
                         <span className="text-[10px] font-mono text-slate-500 bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded border border-emerald-100">+45,000 تومان / +</span>
                      </div>
                      <button className="flex items-center justify-center gap-2 border border-dashed border-slate-300 text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 p-2.5 rounded-xl transition-all text-xs font-bold">
                         <Plus className="w-3.5 h-3.5" /> انتخاب جدید
                      </button>
                   </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col opacity-70">
                   <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-4">
                      <div className="cursor-grab text-slate-300 hover:text-slate-500"><GripVerticalIcon /></div>
                      <div className="flex flex-col gap-1 flex-1">
                         <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-slate-800">تیراژ (سری)</span>
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold border border-blue-200">لیست کمیت (Quantity)</span>
                           <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold border border-amber-200">الزامی</span>
                         </div>
                         <span className="text-[10px] text-slate-500">ماتریس تیراژ پایه‌ای - متصل به جدول قیمت‌گذاری</span>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'pricing' && (
             <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6 p-5 border border-slate-200 rounded-2xl bg-slate-50/50">
                   <div className="flex flex-col gap-1.5 w-full md:w-64 shrink-0">
                      <label className="text-xs font-bold text-slate-800">موتور قیمت‌گذاری</label>
                      <div className="relative">
                         <select value={pricingType} onChange={(e) => setPricingType(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none pr-4 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm">
                            <option value="tier_table">جدول ماتریس تیراژ</option>
                            <option value="area_based">متر مربع / متراژ</option>
                            <option value="per_page">محاسبه صفحه‌ای (کتاب)</option>
                            <option value="formula">فرمول منعطف سفارشی</option>
                         </select>
                         <ChevronDown className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
                      </div>
                   </div>
                   <div className="flex flex-col gap-2 pt-1 md:border-r border-slate-200 md:pr-6 justify-center">
                     <span className="text-xs font-bold text-slate-700">راهنمای موتور فعلی:</span>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">این موتور برای کالاهایی با تیراژهای مشخص (مثل 1000، 2000 عدد) که ترکیب ویژگی‌های آن‌ها قیمت دقیق را تعیین می‌کند کاربرد دارد. می‌توانید مقادیر را مستقیما از اکسل (ردیف: تیراژ، ستون: ویژگی) کپی پیست کنید.</p>
                   </div>
                </div>

                {pricingType === 'tier_table' && (
                   <div className="border border-emerald-200 rounded-2xl overflow-hidden shadow-sm flex flex-col bg-white">
                      <div className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex items-center justify-between">
                         <h3 className="text-sm font-bold text-emerald-800">ماتریس قیمت‌گذاری (به تومان)</h3>
                         <button className="text-[10px] bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-100 transition-colors shadow-sm">چسباندن از کلپ‌بورد (Excel)</button>
                      </div>
                      <div className="overflow-x-auto">
                         <table className="w-full text-xs text-center border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                               <tr>
                                  <th className="p-3 border-l border-slate-200 bg-slate-100 w-24 sticky right-0 z-10">تیراژ \ وجه</th>
                                  <th className="p-3 border-l border-slate-200 min-w[120px]">یک رو</th>
                                  <th className="p-3 border-l border-slate-200 min-w[120px]">دو رو</th>
                                  <th className="p-3 border-l border-slate-200 min-w[120px]">عملیات</th>
                               </tr>
                            </thead>
                            <tbody className="font-mono">
                               {[1000, 2000, 5000].map(qty => (
                               <tr key={qty} className="border-b border-slate-100 hover:bg-slate-50 group">
                                  <td className="p-2 border-l border-slate-200 bg-slate-50 font-bold sticky right-0 z-10">{qty} سری</td>
                                  <td className="p-1 border-l border-slate-100 relative max-w-[120px]">
                                     <input type="text" defaultValue="150,000" className="w-full h-full p-2 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded bg-transparent" />
                                  </td>
                                  <td className="p-1 border-l border-slate-100 relative max-w-[120px]">
                                     <input type="text" defaultValue="210,000" className="w-full h-full p-2 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded bg-transparent" />
                                  </td>
                                  <td className="p-2 w-10">
                                     <button className="text-rose-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 mx-auto"/></button>
                                  </td>
                               </tr>
                               ))}
                               <tr>
                                  <td colSpan={4} className="p-2 bg-slate-50 text-center">
                                     <button className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1 mx-auto py-1">
                                        <Plus className="w-3 h-3" /> سطر تیراژ جدید
                                     </button>
                                  </td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                   </div>
                )}
             </div>
          )}

          {activeTab === 'templates' && (
             <div className="flex flex-col items-center justify-center py-20 gap-4 text-center animate-fade-in border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-full border border-slate-200 flex items-center justify-center shadow-sm text-slate-400">
                   <LayoutTemplate className="w-8 h-8" />
                </div>
                <div className="flex flex-col gap-2 max-w-sm">
                   <h3 className="text-sm font-bold text-slate-800">قالب‌های طراحی این محصول</h3>
                   <p className="text-[11px] text-slate-500 leading-relaxed font-medium">فایل قالب لایه باز (PSD، AI) را جهت دانلود در صفحه محصول و یا استفاده در بخش طراحی آنلاین آپلود کنید.</p>
                </div>
                <button className="mt-2 px-6 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-emerald-500/20 outline-none">
                   آپلود قالب جدید
                </button>
             </div>
          )}
       </div>
    </div>
  );
}

function GripVerticalIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>;
}
