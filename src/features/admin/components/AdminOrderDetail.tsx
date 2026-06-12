import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Printer, AlertCircle, Edit2, FileStack, CheckCircle2, XCircle, CreditCard, Clock, MessageSquare, History, FileText, Send, UploadCloud } from "lucide-react";
import { formatToman, formatJalali } from "../../../lib/persian";
import OrderChat from "../../chat/components/OrderChat";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'info' | 'financial' | 'internal_notes' | 'activity'>('info');

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       {/* Header */}
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-3">
             <Link to="/admin/orders" className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
               <ArrowRight className="w-5 h-5" />
             </Link>
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-800 font-mono">سفارش #{id || "ORD-9821-44A"}</h1>
                <span className="text-xs text-slate-500 font-bold mt-1">مشتری: علی احمدی - {formatJalali(new Date().toISOString())}</span>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-colors">
               <Printer className="w-4 h-4" /> <span className="hidden sm:inline">چاپ تیکت اختصاصی</span>
             </button>
             <button className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md">
                تغییر وضعیت دستی سفارش
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
             {/* Main Info */}
             <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                   <h2 className="font-black text-slate-800 flex items-center gap-2">
                      <FileStack className="w-5 h-5 text-emerald-600" /> اقلام سفارش
                   </h2>
                   <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Edit2 className="w-3.5 h-3.5" /> ویرایش آیتم‌ها
                   </button>
                </div>

                <div className="flex flex-col gap-4">
                   <div className="border border-slate-200 rounded-2xl overflow-hidden">
                      <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-2">
                         <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800">کارت ویزیت گلاسه 300 گرم (1000 سری)</span>
                         </div>
                         <span className="font-mono font-bold text-slate-800">{formatToman(450000)}</span>
                      </div>
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                         <div className="flex flex-col gap-2">
                            <span className="text-slate-500 font-bold mb-1">مشخصات چاپی:</span>
                            <div className="flex justify-between border-b border-slate-100 pb-1">
                               <span className="text-slate-500">وجه چاپ</span>
                               <span className="font-bold text-slate-800">دو رو</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-1">
                               <span className="text-slate-500">پوشش</span>
                               <span className="font-bold text-slate-800">سلفون مات</span>
                            </div>
                         </div>
                         <div className="flex flex-col gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <div className="flex items-center justify-between">
                               <span className="font-bold text-slate-700">فایل‌های ارسالی مشتری (طراحی)</span>
                            </div>
                            <div className="flex gap-2">
                               <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col gap-2 items-center text-center justify-center relative group cursor-pointer">
                                  <img src="https://placehold.co/100x60/f8fafc/94a3b8?text=Front" className="w-full h-16 object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity" />
                                  <span className="text-[10px] font-mono font-bold text-slate-600">Front.jpg</span>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg backdrop-blur-sm gap-2">
                                     <button className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600" title="تایید فایل"><CheckCircle2 className="w-4 h-4" /></button>
                                     <button className="p-1.5 bg-rose-500 text-white rounded hover:bg-rose-600" title="رد فایل"><XCircle className="w-4 h-4" /></button>
                                  </div>
                               </div>
                               <div className="flex-1 bg-white border border-slate-200 rounded-lg p-2 flex flex-col gap-2 items-center justify-center text-center">
                                  <UploadCloud className="w-8 h-8 text-slate-300" />
                                  <span className="text-[10px] font-bold text-slate-400">فایل پشت طرح ارسال نشده</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Tabbed Panel */}
             <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
                <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none">
                   {[
                      { id: 'info', label: 'اطلاعات مشتری', icon: User },
                      { id: 'financial', label: 'امور مالی و پرداخت', icon: CreditCard },
                      { id: 'internal_notes', label: 'یادداشت داخلی (محرمانه)', icon: FileText },
                      { id: 'activity', label: 'لاگ عملیات', icon: History }
                   ].map(tab => (
                      <button 
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id as any)}
                         className={`px-6 py-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'}`}
                      >
                         <tab.icon className="w-4 h-4" /> {tab.label}
                      </button>
                   ))}
                </div>
                <div className="p-6">
                   {activeTab === 'financial' && (
                      <div className="flex flex-col gap-6 animate-fade-in">
                         <div className="flex items-center justify-between p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                            <div className="flex items-center gap-3">
                               <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                               <div className="flex flex-col">
                                  <span className="font-bold">سفارش کاملا پرداخت شده است</span>
                                  <span className="text-[10px] opacity-80">پرداخت امن از طریق درگاه زرین‌پال - شماره تراکنش: 9812994411</span>
                               </div>
                            </div>
                            <span className="font-mono font-black text-lg">{formatToman(450000)}</span>
                         </div>
                         <div className="flex justify-end">
                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
                               <Plus className="w-4 h-4" /> ثبت پرداخت دستی (کارت به کارت / نقدی)
                            </button>
                         </div>
                      </div>
                   )}
                   {activeTab === 'internal_notes' && (
                      <div className="flex flex-col gap-4 animate-fade-in text-slate-800">
                         <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-amber-800">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-xs font-medium leading-relaxed">این یادداشت‌ها تنها برای پرسنل انتشارات قابل مشاهده هستند و مشتری هیچ دیدی به آن‌ها ندارد.</p>
                         </div>
                         <textarea rows={4} placeholder="نوشتن یادداشت جدید..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"></textarea>
                         <button className="self-end px-6 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-amber-600 transition-colors shadow-sm">
                            <Send className="w-4 h-4" /> ثبت یادداشت
                         </button>
                      </div>
                   )}
                </div>
             </div>
          </div>

          {/* Right Column: Chat integration */}
          <div className="lg:col-span-4 flex flex-col">
             <div className="sticky top-24 h-[600px] flex flex-col">
                <div className="bg-slate-900 text-white p-3 rounded-t-2xl flex items-center gap-2 font-bold text-xs border border-slate-800">
                   <MessageSquare className="w-4 h-4 text-emerald-400" />
                   چت پشتیبانی مستقیم سفارش
                </div>
                <div className="flex-1 bg-white border-x border-b border-slate-200 rounded-b-2xl overflow-hidden shadow-sm relative">
                   <OrderChat orderId={id!} role="admin" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function User({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function Plus({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> }
