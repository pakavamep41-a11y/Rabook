import { useState } from "react";
import { CreditCard, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { formatToman, formatJalali } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

export default function WalletPage() {
  const { user, showAlert } = useStore();
  const [amount, setAmount] = useState("");
  const [isCharging, setIsCharging] = useState(false);

  // Mock data
  const balance = 2500000;
  const transactions = [
    { id: 1, type: "deposit", amount: 1500000, date: new Date(Date.now() - 86400000).toISOString(), desc: "شارژ اینترنتی", balanceAfter: 2500000 },
    { id: 2, type: "withdraw", amount: 500000, date: new Date(Date.now() - 186400000).toISOString(), desc: "پرداخت سفارش #1234", balanceAfter: 1000000 },
    { id: 3, type: "deposit", amount: 1500000, date: new Date(Date.now() - 586400000).toISOString(), desc: "شارژ اینترنتی", balanceAfter: 1500000 },
  ];

  const handleCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) < 10000) {
      return showAlert("مبلغ شارژ باید حداقل ۱۰,۰۰۰ تومان باشد.", "error");
    }
    setIsCharging(true);
    setTimeout(() => {
      setIsCharging(false);
      showAlert("انتقال به درگاه پرداخت...", "success");
      // Redirect or mock success...
      setAmount("");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
       <h2 className="text-xl font-black text-slate-800">کیف پول</h2>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Balance Card */}
         <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[200px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
           <div className="relative z-10 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-300">
               <WalletIcon className="w-5 h-5" />
               <span className="text-sm font-bold">موجودی فعلی</span>
             </div>
             <CreditCard className="w-6 h-6 text-slate-400" />
           </div>
           <div className="relative z-10">
             <div className="text-4xl font-black font-mono tracking-tight">{formatToman(balance)}</div>
             <div className="text-[10px] text-slate-400 mt-2 font-mono">{user?.name} | {user?.phone}</div>
           </div>
         </div>

         {/* Charge Form */}
         <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
           <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Plus className="w-4 h-4 text-emerald-600" />
             شارژ کیف پول (تومان)
           </h3>
           <form onSubmit={handleCharge} className="flex flex-col gap-4">
             <div className="flex gap-2">
               <input 
                 type="number" 
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 placeholder="مثلا 500,000"
                 className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
               />
             </div>
             <div className="flex gap-2 mb-2">
               <button type="button" onClick={() => setAmount("100000")} className="flex-1 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100">۱۰۰ هزار</button>
               <button type="button" onClick={() => setAmount("500000")} className="flex-1 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100">۵۰۰ هزار</button>
               <button type="button" onClick={() => setAmount("1000000")} className="flex-1 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-100">۱ میلیون</button>
             </div>
             <button disabled={isCharging} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md">
               {isCharging ? "درحال پردازش..." : "پرداخت و شارژ حساب"}
             </button>
           </form>
         </div>
       </div>

       {/* Transactions Table */}
       <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
         <div className="p-5 border-b border-slate-100 bg-slate-50">
           <h3 className="text-sm font-bold text-slate-800">تراکنش‌های اخیر</h3>
         </div>
         <div className="overflow-x-auto">
           <table className="w-full text-xs text-right">
             <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold">
               <tr>
                 <th className="p-4">تاریخ تراکنش</th>
                 <th className="p-4">شرح</th>
                 <th className="p-4">مبلغ (تومان)</th>
                 <th className="p-4 text-center">باقیمانده</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100 font-medium">
               {transactions.map(tx => (
                 <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                   <td className="p-4 font-mono text-slate-500">{formatJalali(tx.date)}</td>
                   <td className="p-4 text-slate-700 font-bold">{tx.desc}</td>
                   <td className="p-4">
                     <div className={`flex items-center gap-1 font-mono font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                       {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                       {formatToman(tx.amount).replace(' تومان', '')}
                     </div>
                   </td>
                   <td className="p-4 text-center font-mono font-black text-slate-800 text-sm">{formatToman(tx.balanceAfter)}</td>
                 </tr>
               ))}
               {transactions.length === 0 && (
                 <tr>
                   <td colSpan={4} className="p-8 text-center text-slate-400">هیچ تراکنشی یافت نشد.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>

    </div>
  );
}
