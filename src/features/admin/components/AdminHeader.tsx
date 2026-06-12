import { Menu, Search, Bell, Home, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../../../lib/store";

export default function AdminHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { logout } = useStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0">
       <div className="flex items-center gap-4">
          <button 
             onClick={toggleSidebar}
             className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          >
             <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all w-64 lg:w-96">
             <Search className="w-4 h-4 text-slate-400" />
             <input 
                type="text" 
                placeholder="جستجو در پنل..." 
                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder:text-slate-400 font-medium"
             />
          </div>
       </div>

       <div className="flex items-center gap-2">
          <Link to="/" className="p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors tooltip" title="مشاهده سایت">
             <Home className="w-5 h-5" />
          </Link>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white" />
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button 
             onClick={() => {
                logout();
             }}
             className="flex items-center gap-2 p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-xs font-bold"
          >
             <LogOut className="w-4 h-4" />
             <span className="hidden sm:inline">خروج</span>
          </button>
       </div>
    </header>
  );
}
