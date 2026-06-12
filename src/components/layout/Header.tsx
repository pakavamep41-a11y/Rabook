import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../lib/store";
import { formatToman } from "../../lib/persian";
import { ShoppingCart, User as UserIcon, LogOut, Settings, Languages, Sparkles, Search, ChevronDown, Menu, X } from "lucide-react";
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
      const res = await api.get("/products");
      return (res.data.data as Product[]).filter(p => 
        p.title.includes(searchQuery) || p.description.includes(searchQuery)
      );
    },
    enabled: searchQuery.length > 1
  });

  const activeLinkStyle = "text-emerald-600 font-semibold border-b-2 border-emerald-600 pb-1";
  const normLinkStyle = "text-slate-600 hover:text-emerald-600 transition-colors pb-1";

  return (
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
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="font-extrabold text-xl tracking-tight text-slate-800">نقش و نگار</span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest">WEB2PRINT SYSTEM</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm h-full pt-1">
            {headerMenu?.items.map(item => (
              <Link 
                key={item.id} 
                to={item.url} 
                className={`h-full flex items-center border-b-2 ${location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(item.url)) ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent hover:text-emerald-600"} transition-colors`}
              >
                {item.label}
              </Link>
            ))}
            {(!headerMenu || headerMenu.items.length === 0) && (
              <>
                <Link to="/" className={`h-full flex items-center border-b-2 ${location.pathname === "/" ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent hover:text-emerald-600"} transition-colors`}>
                  صفحه اصلی
                </Link>
                <div className="relative group h-full flex items-center cursor-pointer">
                  <div className={`h-full flex items-center border-b-2 gap-1 transition-colors ${location.pathname.startsWith("/catalog") ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent group-hover:text-emerald-600"}`}>
                    <span>محصولات</span>
                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                  </div>
                  {/* Dynamic Mega Menu Dropdown */}
                  <div className="absolute top-full start-0 w-[600px] bg-white border border-slate-100 shadow-xl rounded-b-2xl p-6 hidden group-hover:grid grid-cols-3 gap-6">
                    {categories?.filter(c => !c.parentId).slice(0, 3).map(parent => (
                       <div key={parent.id} className="flex flex-col gap-2 relative">
                         <Link to="/catalog" className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
                           {parent.title}
                         </Link>
                         {categories.filter(c => c.parentId === parent.id).map(child => (
                           <Link key={child.id} to="/catalog" className="text-xs text-slate-500 hover:text-emerald-600 py-1 px-3">
                             {child.title}
                           </Link>
                         ))}
                       </div>
                    ))}
                    {!categories && (
                      <div className="col-span-3 text-center text-xs text-slate-400">در حال بارگزاری...</div>
                    )}
                    <div className="col-span-3 pt-4 mt-2 border-t border-slate-100 flex justify-center">
                      <Link to="/catalog" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">مشاهده همه محصولات چاپی</Link>
                    </div>
                  </div>
                </div>
              </>
            )}
            {user?.role === "admin" && (
              <Link to="/admin" className={`h-full flex items-center border-b-2 ${location.pathname.startsWith("/admin") ? "text-emerald-600 font-bold border-emerald-600" : "text-slate-600 border-transparent hover:text-emerald-600"} transition-colors`}>
                پنل مدیریت
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side: Search, Account, Cart */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Search */}
          <div className="relative hidden lg:block">
             <div className="relative flex items-center">
               <input 
                 type="text" 
                 placeholder="جستجوی محصول..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onFocus={() => setIsSearchActive(true)}
                 onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
                 className="w-64 bg-slate-50 border border-slate-200 text-xs px-4 py-2.5 rounded-xl pr-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
               />
               <Search className="w-4 h-4 text-slate-400 absolute right-3" />
             </div>
             {isSearchActive && searchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-2 flex flex-col">
                   {searchResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/product/${p.id}`}
                        className="px-4 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors"
                      >
                         <img src={p.coverImage} className="w-8 h-8 rounded object-cover" />
                         <span className="font-semibold text-slate-700 truncate">{p.title}</span>
                      </Link>
                   ))}
                </div>
             )}
          </div>

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
                <Link to="/account?tab=orders" className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors">سفارش‌ها</Link>
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
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">صفحه اصلی</Link>
                <Link to="/#catalog" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">محصولات چاپی</Link>
                <Link to="/about-us" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">درباره ما</Link>
                <Link to="/account" onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">حساب کاربری</Link>
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

      {/* Mobile Bottom Nav (Quick Actions) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 flex items-center justify-around py-2 text-[10px] pb-safe font-semibold">
        <Link to="/" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600 p-2">
          <Sparkles className="w-5 h-5" />
          <span>خانه</span>
        </Link>
        <a href="/#catalog" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600 p-2">
          <Search className="w-5 h-5" />
          <span>محصولات</span>
        </a>
        <Link to="/cart" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600 p-2 relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && <span className="absolute top-1 end-1 bg-red-500 text-white text-[8px] w-3 h-3 flex items-center justify-center rounded-full leading-none">{cartCount}</span>}
          <span>سبد خرید</span>
        </Link>
        <Link to="/account" className="flex flex-col items-center gap-1 text-slate-500 hover:text-emerald-600 p-2">
          <UserIcon className="w-5 h-5" />
          <span>حساب من</span>
        </Link>
      </div>
    </header>
  );
}
