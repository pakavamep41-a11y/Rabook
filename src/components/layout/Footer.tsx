import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, Instagram, Send } from "lucide-react";
import { useStore } from "../../lib/store";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { CMSMenu } from "../../types";

export default function Footer() {
  const { usePersianDigits } = useStore();

  const { data: footerMenu } = useQuery<CMSMenu>({
    queryKey: ["cmsMenu", "footer"],
    queryFn: async () => {
      const res = await api.get("/cms/menus/footer");
      return res.data;
    }
  });

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 text-white p-2 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg">نقش و نگار</span>
            </div>
            <p className="leading-relaxed text-xs text-slate-400">
              سامانه سفارش آنلاین چاپی متصل به دستگاه‌های چاپ مجهز و مدرن. ما خدمات طراحی و برآورد قیمت هوشمند را ارائه میدهیم.
            </p>
            <div className="flex items-center gap-3 mt-2 text-slate-400">
               <a href="#" className="hover:text-emerald-500 transition-colors"><Instagram className="w-5 h-5"/></a>
               <a href="#" className="hover:text-emerald-500 transition-colors"><Send className="w-5 h-5"/></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">دسترسی سریع</h4>
            <ul className="flex flex-col gap-2 text-xs">
              {footerMenu?.items.map(item => (
                <li key={item.id}>
                  {item.url.startsWith("/") ? (
                    <Link to={item.url} className="hover:text-emerald-500 transition-colors">{item.label}</Link>
                  ) : (
                    <a href={item.url} className="hover:text-emerald-500 transition-colors">{item.label}</a>
                  )}
                </li>
              ))}
              {(!footerMenu || footerMenu.items.length === 0) && (
                <>
                  <li><Link to="/" className="hover:text-emerald-500 transition-colors">صفحه اصلی</Link></li>
                  <li><Link to="/#catalog" className="hover:text-emerald-500 transition-colors">محصولات چاپی</Link></li>
                  <li><Link to="/account" className="hover:text-emerald-500 transition-colors">پیگیری سفارشات</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">اطلاعات تماس</h4>
            <ul className="flex flex-col gap-2 text-xs leading-relaxed text-slate-400">
              <li>تهران، خیابان جمهوری، مجتمع چاپ نقش و نگار</li>
              <li className="font-mono">۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li className="font-mono text-[10px]">info@naghsh-negar.ir</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">پشتیبانی ۲۴ ساعته</h4>
            <p className="text-xs leading-relaxed text-slate-400 mb-2">
              سوالی دارید؟ از طریق بخش چت آنلاین حساب کاربری مستقیماً به اپراتور متصل شوید.
            </p>
            <Link to="/account" className="text-[11px] font-mono text-emerald-400 bg-emerald-950/20 py-1.5 px-3 rounded border border-emerald-900/40 inline-flex items-center gap-1 hover:bg-emerald-950/40 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>پشتیبانی چت آنلاین در حساب من</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {usePersianDigits ? "۱۴۰۵" : "2026"} تمامی حقوق مادی و معنوی متعلق به چاپخانه نقش و نگار می‌باشد.</p>
          <div className="flex gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
             <div className="w-12 h-16 bg-white/10 rounded flex items-center justify-center text-[10px] text-white">نماد ۱</div>
             <div className="w-12 h-16 bg-white/10 rounded flex items-center justify-center text-[10px] text-white">نماد ۲</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
