import { useState, Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, MessageSquare, Box, Layers, 
  Tag, Users as UsersRoom, CreditCard, PercentSquare, FileText, Menu as MenuIcon, 
  Image as ImageIcon, BookOpen, Printer, PieChart, UsersRound as UserRole, Settings, User, UserCheck
} from "lucide-react";
import { useStore } from "../../../lib/store";
import { usePermission, Can } from "../../../lib/permissions";
import AdminHeader from "./AdminHeader";

const SIDEBAR_NAV = [
  { path: "/admin", label: "داشبورد", icon: LayoutDashboard, perm: "dashboard.view" },
  { path: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag, perm: "orders.view" },
  { path: "/admin/chats", label: "گفتگوها", icon: MessageSquare, perm: "chats.view" },
  { path: "/admin/products", label: "محصولات", icon: Box, perm: "products.view" },
  { path: "/admin/categories", label: "دسته‌بندی‌ها", icon: Layers, perm: "products.view" },
  { path: "/admin/pricing", label: "قیمت‌گذاری", icon: Tag, perm: "products.edit" },
  { path: "/admin/customers", label: "مشتریان", icon: UsersRoom, perm: "customers.view" },
  { path: "/admin/payments", label: "پرداخت‌ها", icon: CreditCard, perm: "payments.view" },
  { path: "/admin/discounts", label: "تخفیف‌ها", icon: PercentSquare, perm: "payments.edit" },
  { path: "/admin/pages", label: "صفحات و محتوا", icon: FileText, perm: "content.view" },
  { path: "/admin/menus", label: "منوها", icon: MenuIcon, perm: "content.view" },
  { path: "/admin/sliders", label: "اسلایدرها", icon: ImageIcon, perm: "content.view" },
  { path: "/admin/blog", label: "وبلاگ", icon: BookOpen, perm: "content.view" },
  { path: "/admin/production", label: "تولید", icon: Printer, perm: "orders.edit" },
  { path: "/admin/reports", label: "گزارش‌ها", icon: PieChart, perm: "reports.view" },
  { path: "/admin/staff", label: "کارکنان", icon: UserRole, perm: "staff.view" },
  { path: "/admin/settings", label: "تنظیمات", icon: Settings, perm: "settings.edit" },
];

export default function AdminLayout() {
  const { user, impersonatedUser, stopImpersonation } = useStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" dir="rtl">
      {impersonatedUser && (
        <div className="bg-amber-500 text-white p-3 text-xs font-bold flex items-center justify-center gap-3 z-[60]">
          <UserCheck className="w-5 h-5" />
          <span>شما در حساب مشتری <strong>{impersonatedUser.name}</strong> هستید.</span>
          <button onClick={stopImpersonation} className="px-3 py-1 bg-amber-700 hover:bg-amber-800 rounded transition-colors ms-4">
            بازگشت
          </button>
        </div>
      )}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 bg-slate-900 text-slate-300 w-64 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} flex flex-col`}>
         <div className="h-16 flex items-center justify-center border-b border-slate-800 shrink-0">
            <span className="text-white font-black text-lg">پنل مدیریت کارخانه</span>
         </div>
         <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
            {SIDEBAR_NAV.map(nav => (
               <Can key={nav.path} perm={nav.perm as any}>
                  <Link 
                     to={nav.path} 
                     className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        location.pathname === nav.path || (nav.path !== "/admin" && location.pathname.startsWith(nav.path))
                           ? 'bg-emerald-600 text-white shadow-md' 
                           : 'hover:bg-slate-800 hover:text-white'
                     }`}
                  >
                     <nav.icon className={`w-4 h-4 ${location.pathname === nav.path ? 'text-white' : 'text-slate-400'}`} />
                     {nav.label}
                  </Link>
               </Can>
            ))}
         </div>
         <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 text-sm">
               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white uppercase">
                  {user.name.substring(0,2)}
               </div>
               <div className="flex flex-col">
                  <span className="text-white font-bold">{user.name}</span>
                  <span className="text-[10px] text-emerald-500 font-mono">{user.role}</span>
               </div>
            </div>
         </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:mr-64 mr-0" : "mr-0"}`}>
         <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
         
         <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
            <Suspense fallback={<div className="flex items-center justify-center p-12"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>}>
               <Outlet />
            </Suspense>
         </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
         <div 
           className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
           onClick={() => setSidebarOpen(false)}
         />
      )}
      </div>
    </div>
  );
}
