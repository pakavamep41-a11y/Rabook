import React from "react";
import { Link } from "react-router-dom";
import { formatToman } from "../../lib/persian";
import { Zap } from "lucide-react";
import { Product } from "../../types";

export default function ProductCard({ product }: { product: Product }) {
  // Compute minimum price
  let minPrice = 0;
  if (product.pricing.type === "tier_table" && product.pricing.tiers?.length > 0) {
    minPrice = product.pricing.tiers[0].unitPrice;
  } else if (product.pricing.type === "area_based" || product.pricing.type === "formula") {
    // Assuming basePrice exists for mock
    minPrice = (product.pricing as any).basePrice || (product.pricing as any).basePricePerSquareMeter || 50000;
  }

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:-translate-y-1 transition-all hover:shadow-lg hover:shadow-slate-200/50 relative overflow-hidden">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50">
        <img src={product.coverImage || "https://placehold.co/400x400/png"} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Express printing badge mock */}
        {product.id.charCodeAt(0) % 2 !== 0 && (
          <div className="absolute top-2 start-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3" />
            <span>فوری</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 flex-1 px-1">
        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-relaxed">{product.title}</h3>
        <p className="text-[10px] text-slate-500 line-clamp-1">{product.description}</p>
        
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
           <span className="text-[10px] text-slate-400">از قیمت</span>
           <span className="font-extrabold text-emerald-600 font-mono text-sm">{formatToman(minPrice)}</span>
        </div>
      </div>
    </Link>
  );
}
