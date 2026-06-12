import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../lib/store";
import { formatToman } from "../../lib/persian";
import { ShoppingCart, User as UserIcon, LogOut, Settings, Languages, Sparkles, Search, ChevronDown, Menu, X, Flower2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { CMSMenu, Category, Product } from "../../types";

export default function Header() {
  const { user, cart, usePersianDigits, togglePersianDigits, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Stats
  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const cartAmount = cart.reduce((acc, c) => acc + c.totalPrice, 0);

  // Queries
  const { data: headerMenu } = useQuery<CMSMenu>({
    queryKey: ["cmsMenu", "header"],
    queryFn: async () => {
      const res = await api.get("/cms/menus/header");
      return res.data;
    }
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["header_categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    }
  });

  const { data: searchResults } = useQuery<Product[]>({
    queryKey: ["searchProducts", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await api.get("/products", { params: { search: searchQuery, limit: 100 } });
      return res.data.data as Product[];
    },
    enabled: searchQuery.length > 1
  });

  const activeLinkStyle = "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1";
  const normLinkStyle = "text-slate-600 hover:text-emerald-600 transition-colors pb-1";

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-40 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left Side: Logo & Main Nav */}
        <div className="flex items-center gap-8 h-full">
          {/* Hamburger (Mobile) */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-600 text-white p-2 rounded-xl group-hover:bg-emerald-700 transition-colors">
              <Flower2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-extrabold text-xl tracking-tight text-slate-800">انتشارات رابوک</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">RABOK PUBLISHING</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm h-full pt-1">
            {headerMenu?.items.map(item => {
              if (item.url === "/products") {
                return (
                  <div key={item.id} className="group h-full flex items-center static">
                    <div className={`h-full flex items-center border-b-2 gap-1 transition-colors ${location.pathname.startsWith("/products") || location.pathname.startsWith("/catalog") ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent hover:text-emerald-600"}`}>
                      <Link to="/products" className="h-full flex items-center">{item.label}</Link>
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:-rotate-180 duration-300 pointer-events-none" />
                    </div>
                    
                    {/* Modern Mega Menu Dropdown */}
                    <div className="absolute top-[calc(100%-1px)] left-0 w-full invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                        <div className="bg-white rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden flex transform-gpu relative">
                           {/* Mega Menu bg blob */}
                           <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50"></div>
                           
                           {/* Categories Grid */}
                           <div className="flex-1 p-8 grid grid-cols-4 gap-8 relative z-10">
                              {categories?.filter(c => !c.parentId).slice(0, 4).map(parent => (
                                 <div key={parent.id} className="flex flex-col gap-4">
                                   <Link to={`/c/${parent.slug}`} className="text-sm font-black text-slate-800 hover:text-emerald-600 flex items-center gap-2 group/cat transition-colors">
                                      {parent.title}
                                      <span className="w-4 h-0.5 bg-slate-200 group-hover/cat:bg-emerald-500 group-hover/cat:w-6 transition-all duration-300"></span>
                                   </Link>
                                   <div className="flex flex-col gap-2 relative">
                                     {categories.filter(c => c.parentId === parent.id).slice(0, 5).map(child => (
                                       <Link key={child.id} to={`/c/${child.slug}`} className="text-sm font-medium text-slate-500 hover:text-emerald-600 py-1 transition-transform hover:-translate-x-1 duration-200 flex items-center gap-2">
                                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                         {child.title}
                                       </Link>
                                     ))}
                                   </div>
                                 </div>
                              ))}
                              {!categories && (
                                <div className="col-span-4 text-center py-12 text-sm text-slate-400">در حال بارگزاری...</div>
                              )}
                           </div>
                           
                           {/* Featured / Banner Section */}
                           <div className="w-[320px] bg-slate-50/80 backdrop-blur-sm p-8 flex flex-col justify-between border-r border-slate-100/50 shrink-0 relative z-10">
                              <div>
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full mb-4 tracking-wider">اختصاصی</span>
                                <h3 className="text-xl font-black text-slate-800 mb-2">طراحی و چاپ کارت ویزیت</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">با استفاده از ویرایشگر آنلاین ما، طرح خود را بسازید و سریعاً سفارش دهید.</p>
                                <Link to="/products" className="inline-flex items-center justify-center bg-slate-900 text-white hover:bg-emerald-600 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 w-full">مشاهده همه محصولات</Link>
                              </div>
                              <div className="w-full h-36 bg-emerald-100 rounded-2xl flex flex-col items-center justify-center text-emerald-800 font-bold overflow-hidden shadow-inner mt-4 relative group/banner">
                                 <img src="https://images.unsplash.com/photo-1588691515918-0952d7658cdd?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50 group-hover/banner:opacity-75 group-hover/banner:scale-105 transition-all duration-700" alt="Special feature" />
                                 <span className="relative z-10 text-white drop-shadow-md text-lg">بسته‌بندی جدید</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link 
                  key={item.id} 
                  to={item.url} 
                  className={`h-full flex items-center border-b-2 ${location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(item.url)) ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent hover:text-emerald-600"} transition-colors`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {user?.role === "admin" && (
              <Link to="/admin" className={`h-full flex items-center border-b-2 ${location.pathname.startsWith("/admin") ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent hover:text-emerald-600"} transition-colors`}>
                پنل مدیریت
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side: Account, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Cart */}
          <Link 
            to="/cart" 
            className="p-2.5 bg-slate-50 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 font-bold rounded-full flex items-center justify-center font-mono">
                  {usePersianDigits ? cartCount.toLocaleString("fa-IR") : cartCount}
                </span>
                <span className="hidden xl:inline text-xs font-semibold font-mono">
                  {formatToman(cartAmount)}
                </span>
              </>
            )}
          </Link>

          {/* Account */}
          {user ? (
            <div className="flex items-center gap-2 relative group">
              <Link 
                to="/account" 
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-700 text-sm border border-transparent group-hover:border-slate-100 group-hover:bg-white"
              >
                {user.avatar ? (
                  <img src={user.avatar} className="w-6 h-6 rounded-full bg-emerald-50 object-cover" referrerPolicy="no-referrer" alt={user.name} />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-500" />
                )}
                <span className="font-medium max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full end-0 mt-1 w-48 bg-white border border-slate-100 shadow-xl rounded-xl hidden group-hover:flex flex-col py-1 overflow-hidden z-50">
                <Link to="/account" className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors">داشبورد</Link>
                <Link to="/account/orders" className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors">سفارش‌ها</Link>
                {user.role === "admin" && (
                   <Link to="/admin" className="px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition-colors border-t border-slate-50">پنل مدیریت</Link>
                )}
                {user.role === "staff" && (
                   <Link to="/admin" className="px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors border-t border-slate-50">پنل پرسنل</Link>
                )}
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-start transition-colors w-full flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  خروج
                </button>
              </div>

            </div>
          ) : (
            <Link 
              to="/account" 
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold rounded-xl transition-all shadow-md focus:ring-2 focus:ring-slate-950"
            >
              <UserIcon className="w-4 h-4" />
              <span>ورود</span>
            </Link>
          )}

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col right-0 animate-in slide-in-from-right">
             <div className="p-4 flex items-center justify-between border-b border-slate-100">
               <span className="font-extrabold text-slate-800">منوی ناوبری</span>
               <button className="p-2 text-slate-500 bg-slate-50 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                 <X className="w-4 h-4" />
               </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 text-sm">
                {headerMenu?.items.map(item => (
                    <Link key={item.id} to={item.url} onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">{item.label}</Link>
                ))}
                {(!headerMenu || headerMenu.items.length === 0) && (
                  <>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">صفحه اصلی</Link>
                    <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">محصولات چاپی</Link>
                    <Link to="/about-us" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">درباره ما</Link>
                  </>
                )}
                <div className="h-px bg-slate-100 my-2" />
                <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 relative flex items-center gap-2">
                   حساب کاربری
                </Link>
             </div>
             <div className="p-4 border-t border-slate-100 flex items-center justify-between">
               <span className="text-xs text-slate-500 font-semibold">اعداد فارسی</span>
               <button 
                onClick={togglePersianDigits}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5"
               >
                 <Languages className="w-4 h-4 text-emerald-600" />
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Secondary Bar for Search */}
      <div className="hidden md:block bg-slate-50 border-t border-slate-100 py-3 transition-all duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="relative">
             <form className="relative flex items-center group" onSubmit={(e) => {
               e.preventDefault();
               if(searchQuery.trim()) {
                 navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                 setIsSearchActive(false);
               }
             }}>
               <input 
                 type="text" 
                 name="search"
                 placeholder="به دنبال چه محصولی هستید؟ (مثال: کارت ویزیت، تراکت، سربرگ...)"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onFocus={() => setIsSearchActive(true)}
                 onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                 className="w-full bg-white border border-slate-200 text-sm px-6 py-3.5 rounded-2xl pr-12 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans shadow-sm"
               />
               <Search className="w-5 h-5 text-slate-400 absolute right-4 transition-colors group-focus-within:text-emerald-500" />
               <button type="submit" className="hidden">جستجو</button>
               {searchQuery && (
                 <button type="button" onClick={() => { setSearchQuery(""); setIsSearchActive(false); }} className="absolute left-4 p-1 rounded-full hover:bg-slate-100 text-slate-400">
                   <X className="w-4 h-4" />
                 </button>
               )}
             </form>
             
             {isSearchActive && searchResults && searchResults.length > 0 && (
                <div className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-3 flex flex-col z-50">
                   {searchResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/product/${p.id}`}
                        onClick={() => setIsSearchActive(false)}
                        className="px-6 py-3 text-sm flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                      >
                         <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                           <img src={p.coverImage} className="w-full h-full object-cover" />
                         </div>
                         <span className="font-bold text-slate-700 truncate">{p.title}</span>
                      </Link>
                   ))}
                </div>
             )}
           </div>
        </div>
      </div>
    </header>

      {/* Mobile Bottom Nav (Quick Actions) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-slate-200/50 flex items-center justify-around pb-[max(env(safe-area-inset-bottom),16px)] pt-3 font-semibold shadow-[0_-4px_24px_rgba(0,0,0,0.04)] text-[10px]">
        <Link to="/" className={`flex flex-col items-center gap-1 p-2 ${location.pathname === '/' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}>
          <Sparkles className="w-5 h-5" />
          <span>خانه</span>
        </Link>
        <Link to="/products" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.startsWith('/products') || location.pathname.startsWith('/catalog') ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}>
          <Search className="w-5 h-5" />
          <span>محصولات</span>
        </Link>
        <Link to="/cart" className={`flex flex-col items-center gap-1 p-2 relative ${location.pathname.startsWith('/cart') ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}>
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && <span className="absolute top-1 end-1 bg-rose-500 text-white text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full leading-none shadow-sm">{usePersianDigits ? cartCount.toLocaleString("fa-IR") : cartCount}</span>}
          <span>سبد خرید</span>
        </Link>
        <Link to="/account" className={`flex flex-col items-center gap-1 p-2 ${location.pathname.startsWith('/account') ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}>
          <UserIcon className="w-5 h-5" />
          <span>حساب من</span>
        </Link>
      </div>
    </>
  );
}
