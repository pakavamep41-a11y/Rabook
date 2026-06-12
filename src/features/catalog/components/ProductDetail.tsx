import { useState, useEffect, useRef, DragEvent, ChangeEvent } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api";
import { useStore } from "../../../lib/store";
import { formatToman } from "../../../lib/persian";
import { Product } from "../../../types";
import { ArrowLeft, Clock, ShieldCheck, Tag, UploadCloud, FileText, ShoppingBag, Trash2 } from "lucide-react";

interface CalculatePriceResponse {
  unitPrice: number;
  totalPrice: number;
  discountPercent: number;
  basePrice: number;
}

export default function ProductDetail() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usePersianDigits, addToCart } = useStore();
  
  const [selectedOptions, setSelectedOptions] = useState<{ [optionId: string]: string }>({});
  const [quantity, setQuantity] = useState<number>(100);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch products catalog data
  const { data: products } = useQuery<Product[]>({
    queryKey: ["catalogProducts"],
    queryFn: async () => {
      const res = await api.get("/catalog/products");
      return res.data;
    },
  });

  const product = products?.find((p) => p.id === productId);

  // Initialize selected options when product loads
  useEffect(() => {
    if (product) {
      const defaults: { [key: string]: string } = {};
      product.options.forEach((opt) => {
        if (opt.values.length > 0) {
          defaults[opt.id] = opt.values[0].value;
        }
      });
      setSelectedOptions(defaults);
      
      // Default sensible quantity by product
      if (product.id === "banner") {
        setQuantity(1);
      } else {
        setQuantity(100);
      }
    }
  }, [product]);

  // 2. Fetch live price calculations whenever options or quantity updates
  const { data: priceDetails, isLoading: isPriceCalculating } = useQuery<CalculatePriceResponse>({
    queryKey: ["calculatePrice", productId, selectedOptions, quantity],
    queryFn: async () => {
      const res = await api.post("/catalog/calculate-price", {
        productId,
        options: selectedOptions,
        quantity,
      });
      return res.data;
    },
    enabled: !!product && Object.keys(selectedOptions).length > 0,
  });

  if (!product) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500 mb-4">در حال بارگذاری اطلاعات محصول چاپی...</p>
        <Link to="/" className="text-emerald-600 font-bold hover:underline">بازگشت به کاتالوگ</Link>
      </div>
    );
  }

  // Handle option changes
  const handleOptionChange = (optionId: string, val: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: val,
    }));
  };

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
      const file = e.dataTransfer.files[0];
      handleFile(file);
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
  };

  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddToCart = () => {
    if (!priceDetails) return;

    // Compile human-readable label dictionary of configuration choices
    const optionsLabels: { [key: string]: string } = {};
    Object.entries(selectedOptions).forEach(([optId, val]) => {
      const option = product.options.find((o) => o.id === optId);
      if (option) {
        const valueObj = option.values.find((v) => v.value === val);
        if (valueObj) {
          optionsLabels[option.label] = valueObj.label;
        }
      }
    });

    addToCart({
      productId: product.id,
      productName: product.name,
      options: selectedOptions,
      optionsLabels,
      quantity,
      unitPrice: priceDetails.unitPrice,
      fileName: uploadedFile?.name || "بدون طرح (طراحی توسط چاپخانه)",
    });

    navigate("/cart");
  };

  const formattedQtyVal = usePersianDigits ? quantity.toLocaleString("fa-IR") : quantity;

  return (
    <div className="flex flex-col gap-8">
      {/* Return to home */}
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>بازگشت به خانه و کاتالوگ</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">WEB2PRINT / PRODUCT DETAIL</span>
      </div>

      {/* Main product card bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Gallery & Live Specs Block - Col 5 */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-6">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
              <img 
                src={product.imageUrl} 
                referrerPolicy="no-referrer" 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 start-4 bg-slate-900/90 backdrop-blur text-white px-3 py-1 text-xs rounded-xl font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>برآورد لحظه‌ای هوشمند</span>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-extrabold text-slate-800">{product.name}</h1>
              <p className="text-xs text-slate-500 leading-relaxed">{product.description}</p>
            </div>

            {/* Quality assurances */}
            <div className="border-t border-slate-50 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>چاپ مجهز به کالیبراسیون تخصصی رنگ Heidelberg</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>حداکثر زمان تحویل: ۵ روز کاری رسمی</span>
              </div>
            </div>
          </div>
          
          {/* File Upload Box Required for web2print */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-extrabold text-slate-800 text-sm">آپلود سند / طرح چاپی آماده</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                در صورتی که فایل ندارید، نیازی به آپلود نیست؛ اپراتور جهت هماهنگی طراحی تماس خواهد گرفت.
              </p>
            </div>

            {uploadedFile ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate select-all">{uploadedFile.name}</span>
                    <span className="text-[10px] text-slate-400">{uploadedFile.size} - Format: {uploadedFile.type}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors ms-3"
                  title="حذف طرح ارسالی"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div 
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                  dragActive ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onUploadClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.png,.jpg,.jpeg,.zip,.rar" 
                  className="hidden" 
                />
                <UploadCloud className="w-8 h-8 text-slate-400" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-700">کلیک کنید یا فایل خود را به اینجا بکشید</span>
                  <span className="text-[10px] text-slate-400">PDF, ZIP, JPG (CMYK, 300dpi) تا سقف ۲۵ مگابایت</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configurations & Options Panel - Col 7 */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-8">
            <h2 className="text-lg font-extrabold text-slate-800 pb-4 border-b border-slate-100">
              سفارشی‌سازی و مشخصات فنی سفارش
            </h2>

            {/* Dynamic Options Loops */}
            <div className="flex flex-col gap-6">
              {product.options.map((opt) => (
                <div key={opt.id} className="flex flex-col gap-2.5">
                  <label className="text-xs font-extrabold text-slate-600 block">{opt.name}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {opt.values.map((v) => {
                      const isSelected = selectedOptions[opt.id] === v.value;
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
                          {v.priceFactor !== 0 && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {v.priceFactor > 0 
                                ? `+ ${formatToman(v.priceFactor, usePersianDigits)}` 
                                : `- ${formatToman(Math.abs(v.priceFactor), usePersianDigits)}`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Volume Selection Option */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-600">تیراژ و تعداد محصولات چاپی</label>
                  <span className="text-xs font-bold text-emerald-600 font-mono">{formattedQtyVal} عدد</span>
                </div>
                
                {product.id === "banner" ? (
                  // Banners are custom count
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-24 h-10 text-center border border-slate-200 rounded-xl font-bold font-mono text-xs focus:ring-1 focus:ring-emerald-600"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  // Cards, brochure, poster have standardized sets
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 200, 500, 1000].map((qtyVal) => {
                      const isQtySelected = quantity === qtyVal;
                      return (
                        <button 
                          key={qtyVal}
                          onClick={() => setQuantity(qtyVal)}
                          className={`py-2 text-xs font-bold rounded-xl border font-mono ${
                            isQtySelected 
                              ? "border-slate-900 bg-slate-900 text-white" 
                              : "border-slate-100 hover:border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {usePersianDigits ? qtyVal.toLocaleString("fa-IR") : qtyVal}
                        </button>
                      );
                    })}
                  </div>
                )}
                {quantity >= 500 && (
                  <p className="text-[10px] text-emerald-600 font-semibold">تخفیف همکاری و تیراژ بالا (۱۵٪) روی صورتحساب نهایی شما اعمال گردید.</p>
                )}
              </div>
            </div>

            {/* Price Preview Block */}
            <div className="mt-4 pt-6 border-t border-slate-100 bg-slate-50 -mx-6 sm:-mx-8 px-6 sm:px-8 pb-2 rounded-b-3xl flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>بهای پایه واحد انتخابی:</span>
                  <span className="font-semibold font-mono">
                    {priceDetails ? formatToman(priceDetails.unitPrice) : "..."}
                  </span>
                </div>
                {priceDetails && priceDetails.discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-600 font-bold">
                    <span>درصد تخفیف تیراژ:</span>
                    <span className="font-mono">
                      {usePersianDigits ? `${toPersianDigits(priceDetails.discountPercent)}٪` : `${priceDetails.discountPercent}%`}
                    </span>
                  </div>
                )}
                <div className="border-t border-slate-200/60 my-2" />
                <div className="flex items-end justify-between">
                  <span className="font-extrabold text-slate-800 text-sm">مبلغ کل پیش‌فاکتور:</span>
                  <div className="flex flex-col items-end">
                    {isPriceCalculating ? (
                      <span className="text-xs text-slate-400">محاسبه قیمت...</span>
                    ) : (
                      <>
                        <span className="text-xl font-black text-emerald-600 transition-all font-mono">
                          {priceDetails ? formatToman(priceDetails.totalPrice) : "..."}
                        </span>
                        <span className="text-[10px] text-slate-400">شامل مالیات و حق برش</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleAddToCart}
                disabled={isPriceCalculating || !priceDetails}
                className="w-full mt-2 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:shadow-emerald-900/10 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>افزودن این پیکربندی به سبد خرید</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function toPersianDigits(val: string | number): string {
  const str = String(val);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}
