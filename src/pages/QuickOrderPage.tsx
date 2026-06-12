import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Zap, ChevronLeft, Package, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Category, Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import ProductDetail from '../features/catalog/components/ProductDetail';

export default function QuickOrderPage() {
  const [selectedPaths, setSelectedPaths] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: categories, isLoading: isCatLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    }
  });

  const currentParentId = selectedPaths.length > 0 ? selectedPaths[selectedPaths.length - 1].id : null;
  
  const currentLevelCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(c => c.parentId === currentParentId);
  }, [categories, currentParentId]);

  const { data: productsData, isLoading: isProdLoading } = useQuery({
    queryKey: ["products", currentParentId],
    queryFn: async () => {
      if (!currentParentId) return [];
      const res = await api.get("/products", { params: { categoryId: currentParentId, limit: 50 } });
      return res.data.data as Product[];
    },
    enabled: !!currentParentId
  });

  const handleCategoryClick = (cat: Category) => {
    setSelectedPaths(prev => [...prev, cat]);
    setSelectedProduct(null); // Reset product if traversing
  };

  const handleBreadcrumbClick = (index: number) => {
    setSelectedPaths(prev => prev.slice(0, index + 1));
    setSelectedProduct(null);
  };

  const handleReset = () => {
    setSelectedPaths([]);
    setSelectedProduct(null);
  };

  const showCategories = currentLevelCategories.length > 0 && !selectedProduct;
  const showProducts = productsData && productsData.length > 0 && !selectedProduct;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-20 mt-8 px-4 sm:px-6">
      <Helmet>
        <title>سفارش سریع | چاپخانه آنلاین</title>
      </Helmet>
      
      {/* Header section */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/40 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-40 -start-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
               <Zap className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-3xl sm:text-4xl font-black">سفارش سریع</h1>
          </div>
          <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
             با ۳ کلیک سفارش چاپی خود را ثبت کنید. ابتدا دسته‌بندی را مشخص کرده و سپس مشخصات را انتخاب نمایید.
          </p>
        </div>
      </div>

      {/* Breadcrumbs Navigation */}
      {selectedPaths.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
           <button onClick={handleReset} className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              محصولات
           </button>
           {selectedPaths.map((cat, idx) => (
             <React.Fragment key={cat.id}>
               <ChevronLeft className="w-4 h-4 text-slate-300 rtl:-scale-x-100" />
               <button 
                 onClick={() => handleBreadcrumbClick(idx)}
                 className={`text-sm font-bold transition-colors ${idx === selectedPaths.length - 1 ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
               >
                 {cat.title}
               </button>
             </React.Fragment>
           ))}
           {selectedProduct && (
             <React.Fragment>
               <ChevronLeft className="w-4 h-4 text-slate-300 rtl:-scale-x-100" />
               <span className="text-sm font-bold text-emerald-600">{selectedProduct.title}</span>
             </React.Fragment>
           )}
        </div>
      )}

      {/* Selection Flow */}
      <AnimatePresence mode="wait">
        
        {/* Step 1 & 2: Categories */}
        {showCategories && (
          <motion.div 
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black">۱</span>
              {selectedPaths.length === 0 ? "دسته‌بندی ویژگی مدنظر خود را انتخاب کنید:" : "زیردسته‌بندی را انتخاب کنید:"}
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentLevelCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-1 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all group"
                >
                  <div className="w-16 h-16 bg-slate-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center transition-colors">
                    {cat.coverImage ? (
                      <img src={cat.coverImage} alt={cat.title} className="w-10 h-10 object-contain drop-shadow-sm" />
                    ) : (
                      <Package className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    )}
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-emerald-700 text-sm text-center">{cat.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Products */}
        {showProducts && (
          <motion.div 
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6 mt-4"
          >
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-black">۲</span>
              محصول مورد نظر را انتخاب کنید:
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productsData.map(prod => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xl rounded-2xl overflow-hidden flex flex-col transition-all group text-right"
                >
                  <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden">
                    {prod.coverImage ? (
                       <img src={prod.coverImage} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <Package className="w-12 h-12 text-slate-300" />
                       </div>
                    )}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors" />
                  </div>
                  <div className="p-4 flex flex-col gap-2 relative">
                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{prod.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{prod.excerpt}</p>
                    <div className="mt-2 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center opacity-0 group-hover:opacity-100 absolute bottom-4 end-4 transition-opacity shadow-sm">
                      <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Step 4: Product Configuration Engine */}
      {selectedProduct && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 relative"
        >
          <div className="flex items-center gap-3 mb-6 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
             <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
             </div>
             <div>
                <h2 className="text-base font-black text-emerald-900">تنظیمات سفارش شما</h2>
                <p className="text-xs text-emerald-700/80 font-medium">مشخصات چاپی و فایل خود را در این بخش تکمیل کنید.</p>
             </div>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
             {/* We embed ProductDetail here. We pass productId since we added support for it. */}
             <ProductDetail productId={selectedProduct.id} />
          </div>
        </motion.div>
      )}
      
      {/* Loading States */}
      {(isCatLoading || isProdLoading) && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
