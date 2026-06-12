import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Phone, Zap, X, Send, HelpCircle, User, ChevronDown, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  { q: "هزینه ارسال چقدر است؟", a: "هزینه ارسال برای سفارشات بالای یک میلیون تومان رایگان است و برای سایر سفارشات با توجه به شهر مقصد محاسبه می‌گردد." },
  { q: "زمان تحویل سفارشات چقدر است؟", a: "سفارشات فوری در تهران کمتر از ۲۴ ساعت و سفارشات عادی بین ۳ تا ۵ روز کاری تحویل می‌شوند." },
  { q: "آیا امکان لغو سفارش وجود دارد؟", a: "خیر، با توجه به اختصاصی بودن روند چاپ، پس از تایید نهایی و پرداخت، امکان لغو سفارش وجود ندارد." }
];

export default function FloatingSupport() {
  const [isDialOpen, setIsDialOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "lead">("chat");
  const [messages, setMessages] = useState<{role: "user" | "bot", text: string}[]>([
    { role: "bot", text: "سلام! چطور می‌توانم راهنماییتان کنم؟ سوالات متداول را در بالا بررسی کنید یا پیام خود را بنویسید." }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Lead Form
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, activeTab]);

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: inputMsg }]);
    setInputMsg("");
    // Simulate bot reply
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: "پیام شما دریافت شد. یکی از کارشناسان ما به زودی پاسخگو خواهد بود." }]);
    }, 1000);
  };

  const handleFaqClick = (faq: {q: string, a: string}) => {
    setMessages(prev => [
      ...prev, 
      { role: "user", text: faq.q },
      { role: "bot", text: faq.a }
    ]);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(leadName && leadPhone) {
      setLeadSubmitted(true);
    }
  };

  const openChat = () => {
    setIsChatOpen(true);
    setIsDialOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-20 end-4 md:bottom-6 md:end-6 z-[100] flex flex-col items-end gap-4">
        {/* Speed Dial Menu */}
        <AnimatePresence>
          {isDialOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col gap-3 mb-2 items-end"
            >
              <Link 
                to="/quick-order" 
                className="flex items-center gap-3 bg-emerald-600 text-white rounded-full p-1.5 shadow-lg hover:bg-emerald-700 transition-colors w-max ms-auto"
                onClick={() => setIsDialOpen(false)}
              >
                <span className="text-sm font-bold ps-4 whitespace-nowrap">سفارش سریع</span>
                <div className="bg-white/20 p-2.5 rounded-full flex-shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
              </Link>
              
              <a 
                href="tel:02112345678" 
                className="flex items-center gap-3 bg-blue-600 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-700 transition-colors w-max ms-auto"
                onClick={() => setIsDialOpen(false)}
              >
                <span className="text-sm font-bold ps-4 whitespace-nowrap">تماس با ما</span>
                <div className="bg-white/20 p-2 rounded-full flex-shrink-0 mt-0.5 mb-0.5 mx-0.5">
                  <Phone className="w-5 h-5" />
                </div>
              </a>

              <button 
                onClick={openChat}
                className="flex items-center gap-3 bg-purple-600 text-white rounded-full p-1.5 shadow-lg hover:bg-purple-700 transition-colors w-max ms-auto"
              >
                <span className="text-sm font-bold ps-4 whitespace-nowrap">پشتیبانی و استعلام</span>
                <div className="bg-white/20 p-2 rounded-full flex-shrink-0 mt-0.5 mb-0.5 mx-0.5">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <AnimatePresence mode="wait">
          {!isChatOpen && (
            <motion.button
              key="dial-btn"
              onClick={() => setIsDialOpen(!isDialOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-colors z-10 ms-auto ${isDialOpen ? "bg-slate-800" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              <AnimatePresence mode="wait">
                {isDialOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-6 h-6 sm:w-7 sm:h-7" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Interface Overlay */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-20 end-4 md:bottom-6 md:end-6 z-[110] w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-[36rem] max-h-[75vh] md:max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex flex-col gap-3 relative overflow-hidden">
               <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay pointer-events-none" />
               <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-xl">
                       <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                       <h3 className="font-bold">پشتیبانی آنلاین</h3>
                       <p className="text-[10px] text-slate-300">پاسخگویی سریع</p>
                    </div>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                   <X className="w-5 h-5" />
                 </button>
               </div>
               
               {/* Context Tabs */}
               <div className="grid grid-cols-2 gap-1 bg-white/10 p-1 rounded-xl relative z-10">
                 <button 
                   onClick={() => setActiveTab('chat')}
                   className={`text-xs font-bold py-2 rounded-lg transition-colors ${activeTab === 'chat' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                 >
                   گفتگو زنده
                 </button>
                 <button 
                   onClick={() => setActiveTab('lead')}
                   className={`text-xs font-bold py-2 rounded-lg transition-colors ${activeTab === 'lead' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
                 >
                   استعلام قیمت
                 </button>
               </div>
            </div>

            {/* Chat Tab Body */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {/* FAQs Section */}
                  <div className="flex flex-col gap-2 mb-2">
                     <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" /> سوالات متداول:</p>
                     <div className="flex flex-wrap gap-2">
                       {faqs.map((faq, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleFaqClick(faq)}
                            className="bg-white border hover:border-emerald-300 border-slate-200 text-slate-700 text-[11px] font-medium px-3 py-1.5 rounded-full text-right shadow-sm transition-colors max-w-full truncate"
                            title={faq.q}
                          >
                            {faq.q}
                          </button>
                       ))}
                     </div>
                  </div>
                  
                  {/* Messages */}
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-sm'}`}>
                          {msg.text}
                       </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-3 bg-white border-t border-slate-100 flex items-end gap-2">
                   <textarea
                     value={inputMsg}
                     onChange={(e) => setInputMsg(e.target.value)}
                     onKeyDown={(e) => { if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                     placeholder="پیام خود را بنویسید..."
                     className="flex-1 max-h-32 min-h-12 resize-none bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-0 outline-none"
                   />
                   <button 
                     onClick={handleSend}
                     className="w-12 h-12 bg-emerald-600 flex items-center justify-center text-white rounded-2xl shadow-sm hover:bg-emerald-700 transition-colors mb-0.5 flex-shrink-0"
                   >
                     <Send className="w-5 h-5 rtl:-scale-x-100" />
                   </button>
                </div>
              </div>
            )}

            {/* Lead Tab Body */}
            {activeTab === 'lead' && (
               <div className="flex-1 overflow-y-auto p-6 bg-slate-50 flex flex-col relative">
                 {leadSubmitted ? (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-4">
                     <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                       <CheckCircle className="w-10 h-10" />
                     </div>
                     <h4 className="text-lg font-bold text-slate-800">درخواست ثبت شد!</h4>
                     <p className="text-sm text-slate-500 max-w-[250px] leading-relaxed">اطلاعات شما با موفقیت ثبت شد. کارشناسان ما به زودی برای مشاوره و استعلام قیمت با شما تماس خواهند گرفت.</p>
                     <button onClick={() => {setLeadSubmitted(false); setActiveTab('chat');}} className="mt-4 text-emerald-600 text-sm font-bold hover:underline">بازگشت به گفتگو</button>
                   </motion.div>
                 ) : (
                   <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleLeadSubmit} className="flex flex-col gap-5 h-full">
                     <div className="text-center mb-2">
                       <h4 className="text-base font-bold text-slate-800 mb-1">درخواست مشاوره و قیمت</h4>
                       <p className="text-xs text-slate-500 leading-relaxed">لطفا اطلاعات تماس خود را وارد کنید تا کارشناسان ما در سریع‌ترین زمان ممکن با شما تماس بگیرند.</p>
                     </div>
                     
                     <div className="flex flex-col gap-3">
                       <div className="flex flex-col gap-1.5">
                         <label className="text-xs font-bold text-slate-600 ms-1">نام و نام خانوادگی</label>
                         <input 
                           required 
                           type="text" 
                           value={leadName}
                           onChange={e => setLeadName(e.target.value)}
                           className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
                           placeholder="مثال: علی محمدی"
                         />
                       </div>
                       
                       <div className="flex flex-col gap-1.5">
                         <label className="text-xs font-bold text-slate-600 ms-1">شماره تماس (پاسخگو)</label>
                         <input 
                           required 
                           type="tel" 
                           value={leadPhone}
                           onChange={e => setLeadPhone(e.target.value)}
                           className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm text-right"
                           dir="ltr"
                           placeholder="09123456789"
                         />
                       </div>
                     </div>

                     <div className="mt-auto pt-4">
                       <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-[0_5px_15px_rgba(16,185,129,0.3)] hover:bg-emerald-700 transition-colors">
                         ثبت درخواست و تماس
                       </button>
                     </div>
                   </motion.form>
                 )}
               </div>
            )}
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
