import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { api } from "../lib/api";
import { Category, Product } from "../types";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ui/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<string>("newest");

  const { data: category, isLoading: isCatLoading } = useQuery<Category>({
    queryKey: ["category", slug],
    queryFn: async () => {
      const res = await api.get(`/categories`);
      const cats = res.data as Category[];
      const c = cats.find(c => c.slug === slug);
      if (!c) throw new Error("Category not found");
      return c;
    },
    enabled: !!slug
  });

  const { data: childCategories } = useQuery<Category[]>({
    queryKey: ["childCategories", category?.id],
    queryFn: async () => {
      const res = await api.get(`/categories`);
      return (res.data as Category[]).filter(c => c.parentId === category?.id);
    },
    enabled: !!category
  });

  const { data: products, isLoading: isProdLoading } = useQuery<Product[]>({
    queryKey: ["categoryProducts", category?.id, sortBy],
    queryFn: async () => {
      const res = await api.get("/products");
      let all = res.data.data as Product[];
      
      // Filter by this category OR its children
      if (category) {
        all = all.filter(p => p.categoryId === category.id);
        // Note: For a real backend, the API would naturally filter by category including subcategories.
        // For local mock, we just filter by the direct categoryId.
      }

      // Sort
      if (sortBy === "cheapest") {
        all = all.sort((a,b) => {
           let minA = a.pricing.type === "tier_table" ? a.pricing.tiers[0].unitPrice : (a.pricing as any).basePrice || 0;
           let minB = b.pricing.type === "tier_table" ? b.pricing.tiers[0].unitPrice : (b.pricing as any).basePrice || 0;
           return minA - minB;
        });
      }

      return all;
    },
    enabled: !!category
  });

  if (isCatLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-bold">درحال بارگزاری...</span>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
         <span className="text-4xl">🪴</span>
         <h2 className="text-xl font-bold text-slate-800">این دسته‌بندی پیدا نشد.</h2>
         <Link to="/" className="text-emerald-600 font-bold hover:underline">بازگشت به خانه</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
      <Helmet>
        <title>{category.title} | چاپخانه آنلاین</title>
        {category.description && <meta name="description" content={category.description} />}
      </Helmet>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
        <Link to="/" className="hover:text-emerald-600 transition-colors">خانه</Link>
        <ChevronLeft className="w-3 h-3" />
        <Link to="/catalog" className="hover:text-emerald-600 transition-colors">محصولات</Link>
        <ChevronLeft className="w-3 h-3" />
        <span className="text-slate-800">{category.title}</span>
      </div>

      {/* Category Header */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden flex items-center shadow-xl">
        <div className="relative z-10 flex flex-col gap-4 max-w-2xl">
           <h1 className="text-3xl md:text-5xl font-black text-white">{category.title}</h1>
           {category.description && (
             <p className="text-slate-300 text-sm leading-relaxed">{category.description}</p>
           )}
        </div>
        <div className="absolute top-0 end-0 opacity-10 h-full">
            {/* Background design element */}
            <div className="w-64 h-64 bg-emerald-500 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Child Categories Blocks */}
      {childCategories && childCategories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
           {childCategories.map(child => (
              <Link key={child.id} to={`/c/${child.slug}`} className="bg-white border border-slate-100 p-4 flex flex-col items-center gap-2 rounded-2xl hover:border-emerald-500 transition-colors shadow-sm text-center">
                 <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[10px] text-slate-400">عکس</div>
                 <span className="text-xs font-bold text-slate-700">{child.title}</span>
              </Link>
           ))}
        </div>
      )}

      {/* Products Grid Section */}
      <div className="flex flex-col gap-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-800">محصولات {category.title}</h2>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><SlidersHorizontal className="w-3 h-3" /> مرتب‌سازی:</span>
               <select 
                 className="text-xs border border-slate-200 bg-slate-50 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-slate-700"
                 value={sortBy}
                 onChange={e => setSortBy(e.target.value)}
               >
                 <option value="newest">جدیدترین</option>
                 <option value="popular">پرفروش‌ترین</option>
                 <option value="cheapest">ارزان‌ترین</option>
               </select>
            </div>
         </div>

         {isProdLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-50 rounded-2xl aspect-[3/4] border border-slate-100" />
              ))}
            </div>
         ) : !products || products.length === 0 ? (
            <div className="py-24 text-center bg-slate-50 border border-slate-100 rounded-2xl">
               <span className="text-xl">🖨️</span>
               <h3 className="mt-4 font-bold text-slate-700 text-sm">محصولی در این دسته‌بندی یافت نشد</h3>
            </div>
         ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                 {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                 ))}
              </div>
              <div className="flex justify-center mt-8">
                 <button className="px-6 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors">
                    مشاهده بیشتر (طراحی مفهومی)
                 </button>
              </div>
            </>
         )}
      </div>

      {/* SEO Description Block */}
      {category.description && (
        <div className="mt-12 bg-slate-50 p-8 rounded-3xl text-sm leading-loose text-slate-600 border border-slate-100">
          <h3 className="font-extrabold text-slate-800 mb-2">درباره {category.title}</h3>
          <p>{category.description} مجموعه چاپ آنلاین ما با کیفیت برتر و دستگاه‌های مدرن، این محصولات را در کوتاه‌ترین زمان به شکل فوری با امکان سفارش آنلاین به سراسر کشور ارسال می‌کند.</p>
        </div>
      )}
    </div>
  );
}
