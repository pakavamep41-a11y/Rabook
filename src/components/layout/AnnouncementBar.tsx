import React, { useState } from "react";
import { X, Bell } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-emerald-600 text-white px-4 py-2 flex items-center justify-center relative shadow-sm z-50">
      <div className="flex items-center gap-2 text-[11px] font-bold">
        <Bell className="w-3.5 h-3.5" />
        <span>ارسال رایگان برای سفارش‌های بالای ۱ میلیون تومان | تخفیف ویژه همکاران</span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute left-4 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
