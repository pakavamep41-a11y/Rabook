import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Wallet, Image as ImageIcon, MessageSquare, BookOpen, User, Bell, LogOut } from "lucide-react";
import { useStore } from "../../../lib/store";
import { Helmet } from "react-helmet-async";

export default function AccountLayout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menu = [
    { label: "داشبورد", path: "/account", icon: LayoutDashboard, exact: true },
    { label: "سفارش‌های من", path: "/account/orders", icon: ShoppingBag, badge: 2 },
    { label: "کیف پول", path: "/account/wallet", icon: Wallet },
    { label: "طرح‌های من", path: "/account/designs", icon: ImageIcon },
    { label: "تیکت‌ها", path: "/account/tickets", icon: MessageSquare },
    { label: "دفترچه آدرس", path: "/account/addresses", icon: BookOpen },
    { label: "پروفایل", path: "/account/profile", icon: User },
    { label: "اعلان‌ها", path: "/account/notifications", icon: Bell, badge: 5 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <Helmet><title>ناحیه کاربری | چاپخانه</title></Helmet>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* Right Sidebar Menu Desktop / Top Tabs Mobile */}
        <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
          {/* User badge */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user.name} />
              ) : (
                <User className="w-6 h-6" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
               <span className="font-black text-slate-800 text-sm truncate">{user?.name}</span>
               <span className="text-[10px] text-slate-500 font-mono truncate">{user?.phone || user?.email}</span>
            </div>
          </div>

          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible hide-scrollbar p-2 lg:p-4 gap-1 lg:gap-2 border-b lg:border-b-0 border-slate-100">
             {menu.map(item => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  end={item.exact}
                  className={({ isActive }) => `
                     flex items-center gap-3 px-4 py-3 rounded-2xl whitespace-nowrap transition-all font-bold text-xs
                     ${isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center shrink-0 font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
             ))}
             
             <div className="hidden lg:block border-t border-slate-100 my-2" />

             <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all font-bold text-xs"
             >
                <LogOut className="w-4.5 h-4.5 shrink-0" />
                <span>خروج از حساب</span>
             </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex-1">
           <Outlet />
        </div>
      </div>
    </div>
  );
}
