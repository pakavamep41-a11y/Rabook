import { useState, useEffect, useRef, DragEvent, ChangeEvent, useMemo } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { api } from "../../../lib/api";
import { useStore } from "../../../lib/store";
import { formatToman } from "../../../lib/persian";
import { Product, ProductOption, FAQ } from "../../../types";
import { calculatePrice, SelectionState } from "../pricing";
import { ArrowLeft, Clock, ShieldCheck, Tag, UploadCloud, FileText, ShoppingBag, Trash2, HelpCircle, FileImage, Info, PenTool } from "lucide-react";
import DOMPurify from "dompurify";

export default function ProductDetail({ productId }: { productId?: string }) {
  const params = useParams<{ id: string }>();
  const productSlug = productId || params.id;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const designIdParams = searchParams.get("designId");
  
  const { usePersianDigits, addToCart, tempDesign } = useStore();
  
  const [selections, setSelections] = useState<SelectionState>({
     options: {},
     quantity: 100
  });

  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string; isVirtual?: boolean; url?: string } | null>(null);
  
  // Checking for design attachment
  useEffect(() => {
    if (designIdParams && tempDesign && tempDesign.id === designIdParams) {
      setUploadedFile({
        name: `design_${tempDesign.id}.png`,
        size: "طراحی شده در سیستم",
        type: "image/png",
        isVirtual: true,
        url: tempDesign.image
      });
    }
  }, [designIdParams, tempDesign]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<"desc" | "guide" | "faq">("desc");

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["catalogProduct", productSlug],
    queryFn: async () => {
      const res = await api.get(`/products/${productSlug}`);
      return res.data;
    },
    enabled: !!productSlug,
  });

  const { data: faqs } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await api.get("/cms/faqs");
      return res.data;
    }
  });

  // Initialize selected options when product loads
  useEffect(() => {
    if (product) {
      const defaults: { [key: string]: string | number | boolean } = {};
      let q = 100;
      
      product.options.forEach((opt) => {
        if (opt.type === "select" && "choices" in opt && opt.choices && opt.choices.length > 0) {
          defaults[opt.id] = opt.choices[0].value;
        } else if (opt.type === "dimensions") {
           defaults[opt.id] = "100x100";
        } else if (opt.type === "boolean") {
           defaults[opt.id] = false;
        } else if (opt.type === "turnaround" && "choices" in opt && opt.choices && opt.choices.length > 0) {
           defaults[opt.id] = opt.choices[0].id;
        } else if (opt.type === "quantity") {
           // handled via quantity
           if ("tiers" in opt && opt.tiers && opt.tiers.length > 0) q = opt.tiers[0];
           else if ("min" in opt && opt.min) q = opt.min;
        } else if (opt.type === "pages") {
           defaults[opt.id] = ("min" in opt) ? opt.min : 1;
        } else if (opt.type === "numeric") {
           defaults[opt.id] = ("min" in opt) ? opt.min : 1;
        }
      });

      if (product.pricing.type === "area_based" || product.pricing.type === "per_page") {
         q = 1;
      }
      
      setSelections({ options: defaults, quantity: q });
    }
  }, [product]);

  // Handle option changes
  const handleOptionChange = (optionId: string, val: string | number | boolean) => {
    setSelections((prev) => ({
      ...prev,
      options: { ...prev.options, [optionId]: val }
    }));
  };

  // Safe pricing compute directly in component body to make it snappy
  const priceDetails = useMemo(() => {
     if (!product || Object.keys(selections.options).length === 0) return null;
     return calculatePrice(product, selections);
  }, [product, selections]);

  // Drag & drop file actions
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setUploadedFile({
      name: file.name,
      size: `${sizeInMb} MB`,
      type: file.type || "unknown",
    });
    
    // Auto-detect pages mock
    if (file.type === "application/pdf") {
       const pagesOption = product?.options.find(o => o.type === "pages");
       if (pagesOption) {
          const randPages = Math.floor(Math.random() * 20) + 2;
          handleOptionChange(pagesOption.id, randPages);
       }
    }
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddToCart = () => {
    if (!priceDetails || !product) return;

    const optionsLabels: Record<string, string> = {};
    Object.entries(selections.options).forEach(([optId, val]) => {
      const option = product.options.find((o) => o.id === optId);
      if (option && option.type === "select" && "choices" in option) {
        const valueObj = option.choices?.find((v) => v.value === String(val));
        if (valueObj) optionsLabels[option.name] = valueObj.label;
      } else if (option && option.type === "turnaround" && "choices" in option) {
         const valueObj = option.choices?.find((v) => v.id === String(val));
        if (valueObj) optionsLabels[option.name] = valueObj.label;
      } else if (option) {
         optionsLabels[option.name] = typeof val === "boolean" ? (val ? "بله" : "خیر") : String(val);
      }
    });

    addToCart({
      productId: product.id,
      productTitle: product.title,
      productName: product.title,
      options: selections.options,
      specs: selections.options,
      optionsLabels: optionsLabels,
      quantity: selections.quantity,
      unitPrice: priceDetails.unitPrice,
      files: uploadedFile?.name ? [uploadedFile.name] : [],
      fileName: uploadedFile?.name || "طراحی را بعدا ارسال میکنم",
    });

    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-bold">درحال بارگزاری محصول...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500 mb-4">محصول پیدا نشد.</p>
        <Link to="/" className="text-emerald-600 font-bold hover:underline">بازگشت به کاتالوگ</Link>
      </div>
    );
  }

  const renderConfiguratorItem = (opt: ProductOption) => {
     switch(opt.type) {
        case "select":
           return (
              <div key={opt.id} className="flex flex-col gap-2.5">
                 <label className="text-xs font-extrabold text-slate-600 block">{opt.name}</label>
                 <div className="grid grid-cols-2 gap-3">
                   {opt.choices?.map((v) => {
                     const isSelected = selections.options[opt.id] === v.value;
                     return (
                       <button 
                         key={v.value}
                         onClick={() => handleOptionChange(opt.id, v.value)}
                         className={`p-3.5 rounded-xl border text-start transition-all flex flex-col gap-1 items-start ${
                           isSelected 
                             ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600 text-slate-800" 
                             : "border-slate-200 hover:border-slate-300 text-slate-600"
                         }`}
                       >
                         <span className="text-xs font-bold">{v.label}</span>
                         {v.priceImpact !== undefined && v.priceImpact !== 0 && (
                           <span className="text-[10px] text-slate-400 font-mono">
                             {v.priceImpact > 0 ? "+" : ""}{formatToman(Math.abs(v.priceImpact))}
                           </span>
                         )}
                       </button>
                     );
                   })}
                 </div>
              </div>
           );
         case "dimensions":
            const dimVal = String(selections.options[opt.id] || "100x100");
            const dimParts = dimVal.toLowerCase().split('x');
            const w = parseFloat(dimParts[0]) || 0;
            const h = parseFloat(dimParts[1]) || 0;
            const area = ((w * h) / 10000).toFixed(2);
            return (
               <div key={opt.id} className="flex flex-col gap-2.5">
                 <label className="text-xs font-extrabold text-slate-600 block">{opt.name}</label>
                 <div className="flex gap-2 items-center">
                   <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs flex-1">
                      <span className="text-slate-400 px-2 font-mono mt-0.5">طول:</span>
                      <input type="number" value={w} onChange={(e)=> handleOptionChange(opt.id, `${e.target.value}x${h}`)} className="bg-transparent w-full focus:outline-none font-bold text-center font-mono text-slate-700" />
                   </div>
                   <span className="text-slate-300">×</span>
                   <div className="flex bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs flex-1">
                      <span className="text-slate-400 px-2 font-mono mt-0.5">عرض:</span>
                      <input type="number" value={h} onChange={(e)=> handleOptionChange(opt.id, `${w}x${e.target.value}`)} className="bg-transparent w-full focus:outline-none font-bold text-center font-mono text-slate-700" />
                   </div>
                 </div>
                 <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>واحد: سانتی‌متر</span>
                    <span className="text-emerald-600 font-bold font-mono text-xs">مساحت: {area} م.م</span>
                 </div>
              </div>
            );
         case "boolean":
            return (
               <div key={opt.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex flex-col gap-1">
                     <span className="text-xs font-extrabold text-slate-700">{opt.name}</span>
                     {(opt as any).priceImpact && (
                        <span className="text-[10px] text-slate-500 font-mono">+{formatToman((opt as any).priceImpact)} تومان</span>
                     )}
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={!!selections.options[opt.id]} onChange={(e) => handleOptionChange(opt.id, e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:end-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
               </div>
            );
         case "turnaround":
            return (
               <div key={opt.id} className="flex flex-col gap-2.5">
                 <label className="text-xs font-extrabold text-slate-600 block">{opt.name}</label>
                 <div className="grid grid-cols-2 gap-3">
                   {opt.choices?.map((v) => {
                     const isSelected = selections.options[opt.id] === v.id;
                     return (
                       <button 
                         key={v.id}
                         onClick={() => handleOptionChange(opt.id, v.id)}
                         className={`p-3.5 rounded-xl border text-start transition-all flex flex-col gap-1 items-start relative overflow-hidden ${
                           isSelected 
                             ? "border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-600 text-slate-800" 
                             : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                         }`}
                       >
                         {v.priceImpact && v.priceImpact > 0 ? (
                            <div className="absolute top-0 start-0 w-1 h-full bg-rose-500" />
                         ) : (
                            <div className="absolute top-0 start-0 w-1 h-full bg-emerald-500" />
                         )}
                         <span className="text-xs font-bold flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" /> {v.label}
                         </span>
                         <span className="text-[10px] text-slate-500 mt-1">زمان تخمینی: {v.days} روز کاری</span>
                       </button>
                     );
                   })}
                 </div>
              </div>
            );
         case "pages":
            return (
               <div key={opt.id} className="flex flex-col gap-2.5 p-4 border border-slate-200 bg-slate-50 rounded-xl">
                 <div className="flex items-center justify-between">
                     <label className="text-xs font-extrabold text-slate-600 flex items-center gap-1.5"><FileText className="w-4 h-4"/> {opt.name}</label>
                     <span className="text-emerald-600 text-xs font-black font-mono">{selections.options[opt.id]} صفحه</span>
                 </div>
                 <input 
                    type="range" 
                    min={opt.min} 
                    max={opt.max} 
                    step={1}
                    value={Number(selections.options[opt.id]) || opt.min} 
                    onChange={(e) => handleOptionChange(opt.id, Number(e.target.value))} 
                    className="w-full accent-emerald-600 mt-2" 
                 />
                 <p className="text-[10px] text-slate-400">نکته: در صورت آپلود فایل PDF این عدد به طور اتوماتیک شناسایی می‌شود.</p>
              </div>
            );
         default: return null;
     }
  };

  const formattedQtyVal = usePersianDigits ? selections.quantity.toLocaleString("fa-IR") : selections.quantity;

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 lg:px-8">
      <Helmet>
        <title>{product.title} | سفارش چاپ آنلاین</title>
        <meta name="description" content={product.excerpt} />
        <meta property="og:title" content={`${product.title} | چاپخانه`} />
        <meta property="og:description" content={product.excerpt} />
        {product.coverImage && <meta property="og:image" content={product.coverImage} />}
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.title,
            "image": product.coverImage ? [product.coverImage] : [],
            "description": product.excerpt,
            "sku": product.id,
            "offers": {
              "@type": "AggregateOffer",
              "url": window.location.href,
              "priceCurrency": "IRR",
              "lowPrice": priceDetails ? priceDetails.baseUnitPrice * 10 : 0,
              "highPrice": priceDetails ? priceDetails.totalPrice * 10 : 0,
              "offerCount": "1",
              "availability": "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      {/* Return & Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-4 border-b border-slate-100">
        <Link to="/catalog" className="hover:text-emerald-600 transition-colors flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> محصولات
        </Link>
        <span className="font-mono text-[10px] uppercase opacity-50">Web2Print Order Engine</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
         
         {/* Right Column: Information, Gallery and Tabs */}
         <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Gallery Header */}
            <div className="flex flex-col lg:flex-row gap-6 bg-slate-900 rounded-3xl p-6 sm:p-8 text-white">
               <div className="w-full lg:w-48 xl:w-64 shrink-0 aspect-[3/4] md:aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 shadow-xl border border-slate-700">
                  <img src={product.coverImage || "https://placehold.co/400x400/png"} alt={product.title} className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col gap-4 py-2">
                  <h1 className="text-3xl font-black">{product.title}</h1>
                  <p className="text-slate-300 text-sm leading-relaxed">{product.excerpt}</p>
                  
                  <div className="mt-auto grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> ضمانت کیفیت</span>
                        <span className="text-xs font-bold">چاپ رنگ‌های کالیبره شده</span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> تحویل فوری</span>
                        <span className="text-xs font-bold">امکان ارسال اکسپرس</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Info Tabs */}
            <div className="flex flex-col gap-6">
               <div className="flex items-center gap-2 border-b border-slate-100 px-2 overflow-x-auto scrollbar-hide">
                  <button onClick={() => setActiveTab("desc")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'desc' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>معرفی و توضیحات</button>
                  <button onClick={() => setActiveTab("guide")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'guide' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>راهنمای طراحی فایل چاپ</button>
                  <button onClick={() => setActiveTab("faq")} className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'faq' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>سوالات متداول مشتریان</button>
               </div>

               <div className="prose prose-emerald prose-sm text-slate-600 max-w-none leading-loose pb-12">
                  {activeTab === 'desc' && (
                     <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description || "توضیحاتی برای این محصول درج نشده است.") }} />
                  )}
                  {activeTab === 'guide' && (
                     <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-2xl flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-orange-600 font-bold">
                           <FileImage className="w-5 h-5" /> قالب استاندارد (Bleed & Safe Zone)
                        </div>
                        <ul className="list-disc ps-6 space-y-2 text-slate-700">
                           <li>حتما مُد رنگی فایل آپلودی خود را روی <strong>CMYK</strong> قرار دهید.</li>
                           <li>رزولوشن تصاویر نباید کمتر از <strong>300 dpi</strong> باشد.</li>
                           <li>از هر طرف حاشیه اطمینان برش را حداقل <strong>۵ میلی‌متر</strong> در نظر بگیرید و نوشته یا لوگویی در آن قرار ندهید.</li>
                           <li>تمامی فونت‌ها در فایل کورل یا ایلاستریتور تبدیل به منحنی (Curve) شده باشند.</li>
                           <li>فایل ارسالی را تنها با فرمت‌های <code>PDF</code> استاندارد چاپ یا <code>JPG</code> ذخیره کنید.</li>
                        </ul>
                     </div>
                  )}
                  {activeTab === 'faq' && (
                     <div className="flex flex-col gap-4">
                        {faqs?.slice(0, 4).map((f) => (
                           <div key={f.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-2">
                              <h4 className="font-bold text-slate-800 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-emerald-600" /> {f.question}</h4>
                              <p className="text-slate-600 text-xs">{f.answer}</p>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Left Column: Configurator (Sticky) */}
         <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col items-stretch divide-y divide-slate-100">
               
               <div className="p-6 bg-slate-50/50">
                  <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                     <Sliders className="w-5 h-5 text-emerald-600" /> پیکربند سفارش
                  </h2>
               </div>

               {/* File Upload / Design Option */}
               <div className="p-6 flex flex-col gap-4">
                  <span className="text-xs font-bold text-slate-700 block">فایل و طرح چاپی <span className="text-rose-500">*</span></span>
                  
                  {uploadedFile ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 bg-white text-emerald-600 shadow-sm rounded-xl">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0 gap-1">
                          <span className="text-xs font-bold text-emerald-900 truncate" dir="ltr">{uploadedFile.name}</span>
                          <span className="text-[10px] text-emerald-700/70 font-mono">{uploadedFile.size} {uploadedFile.isVirtual && "• طراحی شده"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ms-3">
                         {uploadedFile.isVirtual && (
                            <Link to={`/editor/${product.id}?designId=${designIdParams}`} className="p-2 text-blue-700 bg-white hover:bg-blue-50 border border-blue-100 rounded-xl transition-all shadow-sm">
                               <PenTool className="w-4 h-4" />
                            </Link>
                         )}
                         <button 
                           onClick={() => { setUploadedFile(null); handleOptionChange('pages', 1); }}
                           className="p-2 text-emerald-700 bg-white hover:bg-rose-50 hover:text-rose-600 border border-emerald-100 rounded-xl transition-all shadow-sm"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                       <button onClick={onUploadClick} className="flex flex-col items-center justify-center gap-2 p-4 text-emerald-700 bg-emerald-50 border border-emerald-200 border-dashed rounded-2xl hover:bg-emerald-100 transition-colors">
                          <UploadCloud className="w-6 h-6" />
                          <span className="text-xs font-bold">آپلود طرح آماده</span>
                          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} accept=".pdf,.jpg,.zip" className="hidden" />
                       </button>
                       <Link to={`/editor/${product.id}`} className="flex flex-col items-center justify-center gap-2 p-4 text-blue-700 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-colors text-center">
                          <PenTool className="w-6 h-6 text-blue-500" />
                          <span className="text-xs font-bold">طراحی آنلاین<br/>(وب ادیتور)</span>
                       </Link>
                    </div>
                  )}
               </div>

               {/* Options Array */}
               <div className="p-6 flex flex-col gap-6">
                  {product.options.map(opt => renderConfiguratorItem(opt))}
                  
                  {/* Quantity Option */}
                  {product.options.findIndex(o => o.type === "quantity") > -1 && (
                     <div className="flex flex-col gap-2.5">
                       <div className="flex items-center justify-between">
                         <label className="text-xs font-extrabold text-slate-600">تعداد محصول (تیراژ)</label>
                         <span className="text-xs font-bold text-emerald-600 font-mono">{formattedQtyVal}</span>
                       </div>
                       
                       <div className="grid grid-cols-4 gap-2">
                         {/* Simple tier mock */}
                         {[100, 200, 500, 1000].map((qtyVal) => {
                           const isQtySelected = selections.quantity === qtyVal;
                           return (
                             <button 
                               key={qtyVal}
                               onClick={() => setSelections(s => ({...s, quantity: qtyVal}))}
                               className={`py-2 text-xs font-bold rounded-xl border font-mono ${
                                 isQtySelected 
                                   ? "border-slate-800 bg-slate-800 text-white shadow-md shadow-slate-400/20" 
                                   : "border-slate-200 hover:border-slate-300 bg-white text-slate-600"
                               }`}
                             >
                               {usePersianDigits ? qtyVal.toLocaleString("fa-IR") : qtyVal}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                  )}
               </div>

               {/* Live Price Footer */}
               <div className="p-6 bg-slate-900 flex flex-col gap-6 rounded-b-3xl text-white">
                  
                  {/* Summary Skeleton / Details */}
                  {priceDetails ? (
                     <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-xs text-slate-400">
                           <span>قیمت واحد پایه:</span>
                           <span className="font-mono text-slate-300">{formatToman(priceDetails.baseUnitPrice)}</span>
                        </div>
                        {priceDetails.addonsTotal > 0 && (
                           <div className="flex justify-between text-[10px] text-emerald-400">
                              <span>افزونه‌ها و امکانات جانبی:</span>
                              <span className="font-mono">+{formatToman(priceDetails.addonsTotal)} / هرعدد</span>
                           </div>
                        )}
                        {priceDetails.expressSurcharge > 0 && (
                           <div className="flex justify-between text-[10px] text-rose-400">
                              <span>سرویس چاپ فوری:</span>
                              <span className="font-mono">+{formatToman(priceDetails.expressSurcharge)} / هرعدد</span>
                           </div>
                        )}
                        <div className="border-t border-slate-700 my-1"/>
                        <div className="flex justify-between items-end">
                           <span className="text-sm font-bold text-slate-300">مبلغ نهایی سفارش:</span>
                           <div className="flex flex-col items-end">
                              {priceDetails.discountPercent > 0 && (
                                 <span className="line-through text-[10px] text-rose-500 font-mono mb-1">{formatToman(priceDetails.rawTotal + priceDetails.taxAmount)}</span>
                              )}
                              <span className="text-2xl font-black text-emerald-500 font-mono tracking-tight drop-shadow-md">
                                 {formatToman(priceDetails.totalPrice)}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 mt-1 flex items-center gap-1">شامل {formatToman(priceDetails.taxAmount)} مالیات</span>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="h-24 animate-pulse bg-slate-800 rounded-xl" />
                  )}

                  <button 
                     onClick={handleAddToCart}
                     disabled={!priceDetails}
                     className="w-full py-4 text-sm font-black text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 disabled:bg-slate-700 disabled:text-slate-500"
                  >
                     <ShoppingBag className="w-5 h-5" /> افزودن به سبد خرید
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// Lucide icon missing fix
const Sliders = ({ className }: { className?: string; }) => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="21" y2="14"/><line x1="4" x2="20" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="8" x2="16" y1="14" y2="14"/><line x1="8" x2="16" y1="8" y2="8"/></svg>
);
