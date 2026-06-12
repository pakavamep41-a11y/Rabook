import React from "react";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Search, Printer, Palette, ShieldCheck, Clock } from "lucide-react";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col gap-16 max-w-7xl mx-auto w-full pb-20">
      <Helmet>
        <title>درباره ما | انتشارات رابوک</title>
        <meta name="description" content="آشنایی با انتشارات رابوک و اطلاعات تماس. ما در تلاشیم تا بهترین خدمات چاپ را با بالاترین کیفیت ارائه دهیم." />
        <meta property="og:title" content="درباره ما | انتشارات رابوک" />
        <meta property="og:description" content="آشنایی با انتشارات رابوک و اطلاعات تماس. تخصصی ترین مرکز چاپ و نشر." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative rounded-[2.5rem] bg-slate-900 border border-slate-800 p-8 sm:p-16 lg:p-24 overflow-hidden mt-8 shadow-2xl flex flex-col md:flex-row items-center gap-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-l from-emerald-900/40 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-40 -end-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex-1 flex flex-col gap-6 relative z-10">
           <span className="inline-flex px-4 py-2 bg-emerald-500/20 text-emerald-300 font-bold text-sm rounded-full w-max border border-emerald-500/30">داستان ما</span>
           <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight">
             هنر چاپ، <br/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">در خدمت کیفیت.</span>
           </h1>
           <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-medium mt-4 max-w-2xl">
              ما در انتشارات رابوک سال‌هاست با تکیه بر تکنولوژی روز و ماشین‌آلات پیشرفته، همراه خلاقیت و ایده‌های شما هستیم تا بهترین نتایج چاپی را برای کسب و کار شما به ارمغان بیاوریم.
           </p>
        </div>
        <div className="flex-1 relative z-10 w-full h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <img src="https://images.unsplash.com/photo-1621844005929-2ceafc078b54?auto=format&fit=crop&q=80&w=1200" alt="چاپخانه" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Features/Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { icon: Printer, title: "چاپ افست و دیجیتال", desc: "استفاده از ماشین‌آلات صنعتی مدرن برای انواع نیازهای چاپی شما.", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: Palette, title: "طراحی خلاقانه", desc: "تیم طراحی حرفه‌ای برای اجرای ایده‌های خلاقانه و برندینگ شما.", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: Clock, title: "تحویل سریع و فوری", desc: "زمان‌بندی دقیق و تحویل سفارشات در سریع‌ترین زمان ممکن.", color: "text-amber-600", bg: "bg-amber-50" },
          { icon: ShieldCheck, title: "تضمین کیفیت", desc: "کنترل کیفیت دقیق در تمام مراحل طراحی، فرم‌بندی و چاپ.", color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((feat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className={`w-14 h-14 rounded-2xl ${feat.bg} ${feat.color} flex items-center justify-center`}>
                <feat.icon className="w-7 h-7" />
             </div>
             <h3 className="text-xl font-bold text-slate-800">{feat.title}</h3>
             <p className="text-sm text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats */}
      <section className="bg-emerald-50 rounded-3xl border border-emerald-100 p-12 text-center flex flex-col gap-10">
        <h2 className="text-3xl font-black text-slate-800">انتشارات رابوک در اعداد</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: "مشتری رضایتمند", value: "+۵,۰۰۰" },
             { label: "سفارش موفق", value: "+۲۰,۰۰۰" },
             { label: "سال سابقه", value: "۱۵" },
             { label: "متخصص چاپ", value: "۳۵" },
           ].map((stat, idx) => (
             <div key={idx} className="flex flex-col gap-2">
                <span className="text-4xl lg:text-5xl font-black text-emerald-600 font-mono tracking-tighter">{stat.value}</span>
                <span className="text-sm font-bold text-slate-600">{stat.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl flex flex-col md:flex-row">
        <div className="flex-1 p-8 md:p-16 flex flex-col gap-8 bg-slate-50">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">تماس با ما</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">ما همیشه آماده پاسخگویی به سوالات، نظرات و راهنمایی شما هستیم. از طریق راه‌های ارتباطی زیر با ما در تماس باشید.</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors shadow-sm">
                 <Phone className="w-5 h-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold mb-1">شماره تماس</span>
                  <a href="tel:02112345678" className="text-lg font-bold text-slate-800 font-mono hover:text-emerald-600 transition-colors">۰۲۱ - ۱۲۳۴ ۵۶۷۸</a>
               </div>
            </div>
            
            <div className="flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors shadow-sm">
                 <Mail className="w-5 h-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold mb-1">پست الکترونیک</span>
                  <a href="mailto:inforabok@gmail.com" className="text-lg font-bold text-slate-800 font-mono hover:text-emerald-600 transition-colors">inforabok@gmail.com</a>
               </div>
            </div>
            
            <div className="flex items-center gap-4 group">
               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-colors shadow-sm">
                 <MapPin className="w-5 h-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold mb-1">آدرس</span>
                  <address className="text-sm font-bold text-slate-800 leading-relaxed not-italic">تهران، دفتر انتشارات رابوک</address>
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-[400px] bg-slate-200 relative">
          {/* Map placeholder */}
          <div className="absolute inset-0">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d103706.77259074744!2d51.35374465403212!3d35.69614777472061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491ff3dcd9%3A0xf0b3697c567024bc!2sTehran%2C%20Tehran%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80"
             ></iframe>
          </div>
          <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
