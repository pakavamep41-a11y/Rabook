import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";
import { Category, Product } from "../types";
import { formatToman } from "../lib/persian";
import { Calendar, Printer } from "lucide-react";

export default function PriceListPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    }
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data;
    }
  });

  if (isLoading) {
     return <div className="p-12 text-center text-sm font-bold text-slate-500">در حال دریافت لیست قیمت...</div>;
  }

  const rootCategories = categories?.filter(c => !c.parentId) || [];
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full print:bg-white print:p-0">
      <Helmet>
        <title>لیست قیمت خدمات چاپ | چاپخانه آنلاین</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl print:hidden">
         <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black">لیست جامع قیمت خدمات چاپ</h1>
            <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
               <Calendar className="w-3.5 h-3.5" />
               <span>آخرین بروزرسانی: ۱۴۰۳/۰۴/۱۵</span>
            </div>
         </div>
         <button onClick={handlePrint} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 max-w-max hover:bg-slate-100 transition-colors">
            <Printer className="w-4 h-4" />
            <span>چاپ لیست</span>
         </button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:flex justify-between items-center border-b-2 border-black pb-4 mb-4">
         <h1 className="text-xl font-black">انتشارات رابوک - لیست قیمت</h1>
         <div className="text-xs font-mono font-bold">بروزرسانی: ۱۴۰۳/۰۴/۱۵</div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide print:hidden">
         <button 
           onClick={() => setActiveTab("all")}
           className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
         >
           همه دسته‌ها
         </button>
         {rootCategories.map(cat => (
           <button 
             key={cat.id}
             onClick={() => setActiveTab(cat.id)}
             className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTab === cat.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
           >
             {cat.title}
           </button>
         ))}
      </div>

      {/* Tables By Category */}
      <div className="flex flex-col gap-12 print:gap-8">
        {(activeTab === "all" ? rootCategories : rootCategories.filter(c => c.id === activeTab)).map(parentCat => {
           
           // Collect all subcategories and their products
           const subtreeIds = [parentCat.id, ...(categories?.filter(c => c.parentId === parentCat.id).map(c => c.id) || [])];
           const catProducts = products?.filter(p => subtreeIds.includes(p.categoryId)) || [];

           if (catProducts.length === 0) return null;

           return (
             <div key={parentCat.id} className="flex flex-col gap-4 print:break-inside-avoid">
               <h2 className="text-xl font-extrabold text-slate-800 border-b border-slate-200 pb-2 print:border-black print:text-black">{parentCat.title}</h2>
               <div className="overflow-x-auto rounded-2xl border border-slate-100 print:border-none print:shadow-none shadow-sm">
                 <table className="w-full text-start text-sm">
                   <thead className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-slate-100 print:bg-transparent print:text-black print:border-black">
                     <tr>
                       <th className="py-3 px-4 text-start">عنوان محصول چاپی</th>
                       <th className="py-3 px-4 text-start">تیراژ (تعداد)</th>
                       <th className="py-3 px-4 text-start">نوع قیمت‌گذاری</th>
                       <th className="py-3 px-4 text-end">قیمت پایه (تومان)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 print:divide-slate-200">
                     {catProducts.map(product => {
                       
                       // Determine pricing string logic
                       let pricingStr = "تعرفه متغیر";
                       let unitPriceStr = "---";
                       let volumeStr = "100+";

                       if (product.pricing.type === "tier_table") {
                          pricingStr = "جدول تیراژ";
                          const tier = product.pricing.tiers?.[0];
                          if (tier) {
                             volumeStr = String(tier.quantity);
                             unitPriceStr = formatToman(tier.unitPrice) + " (هر عدد)";
                          }
                       } else if (product.pricing.type === "area_based") {
                          pricingStr = "مترمربع";
                          volumeStr = "متغیر";
                          unitPriceStr = formatToman((product.pricing as any).basePricePerSquareMeter || 50000) + " (مترمربع)";
                       } else {
                          pricingStr = "فرمول ثابت";
                          volumeStr = "1";
                          unitPriceStr = formatToman((product.pricing as any).basePrice || 100000);
                       }

                       return (
                         <tr key={product.id} className="hover:bg-slate-50/50 transition-colors print:hover:bg-transparent text-xs text-slate-700">
                           <td className="py-3 px-4 font-bold max-w-[200px] truncate print:max-w-none">{product.title}</td>
                           <td className="py-3 px-4 font-mono">{volumeStr}</td>
                           <td className="py-3 px-4 text-slate-500">{pricingStr}</td>
                           <td className="py-3 px-4 text-end font-mono font-bold text-emerald-600 print:text-black">{unitPriceStr}</td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
}
