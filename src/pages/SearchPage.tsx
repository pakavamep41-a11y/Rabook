import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";
import { Category, Product } from "../types";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "all";

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    }
  });

  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data.data;
    }
  });

  // Client-side search and filtering
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    let list = allProducts;
    
    if (q) {
      list = list.filter(p => p.title.includes(q) || p.description.includes(q));
    }
    
    if (categoryFilter !== "all" && categories) {
       // get category and its children
       const catIds = [categoryFilter];
       const children = categories.filter(c => c.parentId === categoryFilter).map(c => c.id);
       catIds.push(...children);
       list = list.filter(p => catIds.includes(p.categoryId));
    }
    
    return list;
  }, [allProducts, q, categoryFilter, categories]);

  const updateFilter = (catId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === "all") {
       newParams.delete("category");
    } else {
       newParams.set("category", catId);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <Helmet>
        <title>جستجوی «{q}» | چاپخانه</title>
      </Helmet>

      {/* Header Search Field */}
      <div className="flex flex-col gap-6 bg-slate-900 rounded-3xl p-8 items-center text-center">
         <h1 className="text-2xl font-black text-white">جستجوی خدمات چاپ</h1>
         <div className="w-full max-w-xl relative">
            <input 
              type="text" 
              defaultValue={q}
              placeholder="کارت ویزیت، تراکت، بنر..."
              onKeyDown={(e) => {
                 if (e.key === "Enter") {
                    setSearchParams({ q: e.currentTarget.value });
                 }
              }}
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
            />
            <Search className="w-5 h-5 text-slate-400 absolute start-4 top-1/2 -translate-y-1/2" />
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Sidebar filters */}
         <div className="w-full lg:w-64 flex flex-col gap-6 shrink-0">
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col gap-4">
               <div className="flex items-center gap-2 font-black text-slate-800 border-b border-slate-200 pb-3">
                  <SlidersHorizontal className="w-4 h-4" /> فیلتر دسته‌بندی
               </div>
               <div className="flex flex-col gap-2">
                  <button 
                     onClick={() => updateFilter("all")}
                     className={`text-start text-sm py-1.5 px-3 rounded-lg transition-colors font-bold ${categoryFilter === "all" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-200"}`}
                  >
                     همه محصولات
                  </button>
                  {categories?.filter(c => !c.parentId).map(c => (
                     <button 
                        key={c.id}
                        onClick={() => updateFilter(c.id)}
                        className={`text-start text-sm py-1.5 px-3 rounded-lg transition-colors font-bold ${categoryFilter === c.id ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-200"}`}
                     >
                        {c.title}
                     </button>
                  ))}
               </div>
            </div>
         </div>
         
         {/* Results */}
         <div className="flex-1 flex flex-col gap-6">
            <div className="text-sm font-bold text-slate-500">
               {isLoading ? "در حال جستجو..." : `پیدا شدن ${filteredProducts.length} نتیجه برای «${q}»`}
            </div>

            {isLoading ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {[...Array(8)].map((_, i) => (
                   <div key={i} className="animate-pulse bg-slate-50 border border-slate-100 rounded-2xl aspect-[3/4]" />
                 ))}
               </div>
            ) : filteredProducts.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24 bg-slate-50 border border-slate-100 rounded-3xl gap-4">
                  <span className="text-4xl opacity-50">🔍</span>
                  <h3 className="font-bold text-slate-700">نتیجه‌ای یافت نشد</h3>
                  <p className="text-xs text-slate-500">عبارت دیگری را جستجو کنید.</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                     <ProductCard key={product.id} product={product} />
                  ))}
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
