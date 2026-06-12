import React from "react";
import { useStore } from "../../lib/store";
import { AlertCircle, UserCheck } from "lucide-react";
import AnnouncementBar from "../layout/AnnouncementBar";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import FloatingSupport from "../layout/FloatingSupport";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { alert, hideAlert, impersonatedUser, stopImpersonation } = useStore();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-0">
      {impersonatedUser && (
        <div className="bg-amber-500 text-white p-3 text-xs font-bold flex items-center justify-center gap-3 sticky top-0 z-[60]">
          <UserCheck className="w-5 h-5" />
          <span>شما در حال حاضر با دسترسی کاربر <strong>{impersonatedUser.name}</strong> در سیستم هستید.</span>
          <button onClick={stopImpersonation} className="px-3 py-1 bg-amber-700 hover:bg-amber-800 rounded transition-colors ms-4">
            بازگشت به حساب خودم
          </button>
        </div>
      )}
      <AnnouncementBar />
      
      {/* Dynamic Alerts */}
      {alert && (
        <div 
          onClick={hideAlert}
          className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 z-[60] md:max-w-md p-4 rounded-xl shadow-xl flex items-center justify-between cursor-pointer border animate-bounce ${
            alert.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : alert.type === "error" 
              ? "bg-rose-50 border-rose-200 text-rose-800"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
          </div>
          <button className="text-xs opacity-60 hover:opacity-100 ps-3">بستن</button>
        </div>
      )}

      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {children}
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
