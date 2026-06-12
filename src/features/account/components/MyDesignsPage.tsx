import { useState } from "react";
import { Image as ImageIcon, Trash2, Edit2, ShoppingBag } from "lucide-react";
import { formatJalali } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

export default function MyDesignsPage() {
  const { showAlert } = useStore();
  const [designs, setDesigns] = useState([
    { id: 1, title: "طرح ویزیت جدید شرکت", productTitle: "کارت ویزیت گلاسه روکش مات", date: new Date(Date.now() - 86400000 * 2).toISOString(), thumb: "https://placehold.co/400x250/png" },
    { id: 2, title: "تراکت فروشگاه بهاره", productTitle: "تراکت گلاسه A5 یک رو", date: new Date(Date.now() - 86400000 * 15).toISOString(), thumb: "https://placehold.co/400x570/png" },
  ]);

  const handleDelete = (id: number) => {
    setDesigns(designs.filter(d => d.id !== id));
    showAlert("طرح حذف شد.", "success");
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-800">طرح‌های ذخیره شده</h2>
       </div>

       {designs.length === 0 ? (
         <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
               <ImageIcon className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-500">طرحی برای نمایش وجود ندارد.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {designs.map(design => (
             <div key={design.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden group">
                  <img src={design.thumb} alt={design.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-2 backdrop-blur-sm">
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1 gap-2">
                   <h3 className="text-sm font-bold text-slate-800">{design.title}</h3>
                   <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block w-fit font-bold">{design.productTitle}</span>
                   <div className="flex mt-auto pt-4 items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{formatJalali(design.date).split(' ')[0]}</span>
                      <div className="flex gap-1">
                         <button className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-sans font-bold">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            سفارش
                         </button>
                         <button onClick={() => handleDelete(design.id)} className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-slate-400">
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ))}
         </div>
       )}
    </div>
  );
}
