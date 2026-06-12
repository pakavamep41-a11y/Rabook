import { useState } from "react";
import { CreditCard, History, Banknote, Search, CheckCircle2, XCircle, Filter, FileCode } from "lucide-react";
import { formatToman, formatJalali } from "../../../lib/persian";

const mockGateways = [
  { id: "TX-10029", amount: 450000, date: "2024-03-20T10:30:00Z", gateway: "زرین‌پال", status: "success", customer: "علی احمدی", orderId: "ORD-9821-44A" },
  { id: "TX-10030", amount: 125000, date: "2024-03-21T14:15:00Z", gateway: "سامان کیش", status: "failed", customer: "شرکت رویا", orderId: "ORD-9821-45B" },
];

const mockTransfers = [
  { id: "TR-101", amount: 8500000, date: "2024-03-22T09:00:00Z", bank: "بانک ملی", customer: "محمد تهرانی", status: "pending" },
];

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState<'gateways' | 'transfers' | 'refunds'>('gateways');

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col">
         <h1 className="text-2xl font-black text-slate-800">امور مالی و پرداخت‌ها</h1>
         <span className="text-xs text-slate-500 font-bold mt-1">تراکنش‌های درگاه، فیش‌های واریزی و استرداد وجه</span>
       </div>

       <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none rounded-t-3xl p-2 gap-2">
             {[
                { id: 'gateways', label: 'تراکنش‌های درگاه آنلاین', icon: CreditCard },
                { id: 'transfers', label: 'صف تایید فیش واریزی کارتی (کارت به کارت)', icon: Banknote },
                { id: 'refunds', label: 'درخواست‌های عودت وجه / استرداد', icon: History }
             ].map(tab => (
                <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`px-5 py-3 text-xs font-bold flex items-center gap-2 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white shadow-sm border border-slate-200 text-emerald-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                   <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
             ))}
          </div>

          <div className="p-4">
             {activeTab === 'gateways' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                   <div className="flex bg-slate-50 items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl w-full md:w-80 focus-within:border-emerald-500 focus-within:bg-white transition-all mx-2 mt-2">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input type="text" placeholder="شماره تراکنش درگاه یا کد سفارش..." className="bg-transparent border-none outline-none text-xs w-full font-bold text-slate-700" />
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right">
                         <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                            <tr>
                               <th className="p-4 font-bold">رسید تراکنش (کد مرجع)</th>
                               <th className="p-4 font-bold">تاریخ / ساعت</th>
                               <th className="p-4 font-bold">مشتری</th>
                               <th className="p-4 font-bold">مبلغ (تومان)</th>
                               <th className="p-4 font-bold">درگاه / سفارش</th>
                               <th className="p-4 font-bold text-center">وضعیت</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 font-medium">
                            {mockGateways.map(tx => (
                               <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="p-4 font-mono font-bold text-slate-600">{tx.id}</td>
                                  <td className="p-4 font-mono text-slate-500">{formatJalali(tx.date)}</td>
                                  <td className="p-4 text-slate-700 font-bold">{tx.customer}</td>
                                  <td className="p-4 font-mono font-bold text-slate-800">{formatToman(tx.amount)}</td>
                                  <td className="p-4">
                                     <div className="flex flex-col gap-1">
                                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 w-fit">{tx.gateway}</span>
                                        <span className="text-[10px] text-blue-600 font-mono font-bold">بابت {tx.orderId}</span>
                                     </div>
                                  </td>
                                  <td className="p-4 text-center">
                                     {tx.status === 'success' ? 
                                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-bold"><CheckCircle2 className="w-3 h-3"/> موفق</span> :
                                        <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-700 px-2 py-1 rounded-md font-bold"><XCircle className="w-3 h-3"/> ناموفق</span>
                                     }
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             )}

             {activeTab === 'transfers' && (
                <div className="flex flex-col gap-4 animate-fade-in p-2">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockTransfers.map(tr => (
                         <div key={tr.id} className="border border-slate-200 rounded-2xl bg-white shadow-sm flex flex-col group overflow-hidden">
                            <div className="aspect-[4/3] bg-slate-100 relative group cursor-pointer border-b border-slate-100">
                               <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                                  <FileCode className="w-8 h-8" />
                                  <span className="text-xs font-bold">مشاهده ضمیمه فیش</span>
                               </div>
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                               <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-800 text-sm">{formatToman(tr.amount)}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{formatJalali(tr.date, 'yyyy/MM/dd')}</span>
                               </div>
                               <div className="flex flex-col gap-1 text-xs">
                                  <span className="text-slate-600 font-bold">{tr.customer}</span>
                                  <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-1 rounded w-fit">به مقصد: {tr.bank}</span>
                               </div>
                               <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100">
                                  <button className="py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1">
                                     <CheckCircle2 className="w-3.5 h-3.5" /> تایید و شارژ
                                  </button>
                                  <button className="py-2 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1">
                                     <XCircle className="w-3.5 h-3.5" /> رد فیش جعلی
                                  </button>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === 'refunds' && (
                 <div className="flex items-center justify-center py-20 text-slate-400 flex-col gap-3">
                    <History className="w-12 h-12 opacity-50" />
                    <span className="text-xs font-bold">کد سفارش یا تراکنشی جهت استرداد وجه باز نیست.</span>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
}
