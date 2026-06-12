import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Box, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { formatToman } from "../../../lib/persian";
import { useStore } from "../../../lib/store";

const mockProducts = [
  { id: "1", name: "کارت ویزیت گلاسه 300 گرم دورگرد", category: "گلاسه مات", type: "tier_table", basePrice: 150000, active: true },
  { id: "2", name: "تراکت گلاسه 135 گرم A5", category: "تراکت", type: "tier_table", basePrice: 450000, active: true },
  { id: "3", name: "بنر 13 انس اکو سالونت", category: "بنر و لارج فرمت", type: "area_based", basePrice: 85000, active: false },
];

export default function AdminProductList() {
  const { showAlert } = useStore();
  const [products, setProducts] = useState(mockProducts);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selected.length === products.length) setSelected([]);
    else setSelected(products.map(p => p.id));
  };

  const handleBulkAction = (action: 'activate' | 'deactivate') => {
    if (selected.length === 0) return showAlert("ابتدا محصولات را انتخاب کنید.", "error");
    setProducts(products.map(p => selected.includes(p.id) ? { ...p, active: action === 'activate' } : p));
    setSelected([]);
    showAlert("عملیات گروهی با موفقیت انجام شد.", "success");
  };

  const getPricingTypeName = (type: string) => {
    switch(type) {
      case 'tier_table': return 'جدول تیراژ';
      case 'area_based': return 'متر مربع';
      case 'per_page': return 'صفحه‌ای (کتاب)';
      case 'formula': return 'فرمول سفارشی';
      default: return type;
    }
  };

  const filtered = products.filter(p => p.name.includes(search) || p.category.includes(search));

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative pb-24">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-800">محصولات چاپی</h1>
          <Link to="/admin/products/new" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors w-fit">
            <Plus className="w-4 h-4" />
            محصول جدید
          </Link>
       </div>

       <div className="bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 rounded-t-2xl">
             <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex bg-white items-center gap-2 px-3 py-2 border border-slate-200 rounded-xl w-full md:w-64 focus-within:border-emerald-500 transition-colors">
                   <Search className="w-4 h-4 text-slate-400 shrink-0" />
                   <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجوی محصول..." className="bg-transparent border-none outline-none text-xs w-full font-medium text-slate-700" />
                </div>
                <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                  <Filter className="w-4 h-4" />
                </button>
             </div>
             
             <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                {selected.length > 0 && (
                  <>
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-2">{selected.length} مورد انتخاب شده:</span>
                    <button onClick={() => handleBulkAction('activate')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-emerald-100 transition-colors">فعال کردن</button>
                    <button onClick={() => handleBulkAction('deactivate')} className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-rose-100 transition-colors">غیرفعال کردن</button>
                  </>
                )}
             </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto text-right">
             <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="p-4 w-10">
                         <input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={toggleSelectAll} className="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
                      </th>
                      <th className="p-4 font-bold">نام محصول</th>
                      <th className="p-4 font-bold">دسته‌بندی</th>
                      <th className="p-4 font-bold">نوع قیمت‌گذاری</th>
                      <th className="p-4 font-bold">قیمت پایه</th>
                      <th className="p-4 font-bold text-center">وضعیت</th>
                      <th className="p-4 font-bold text-center">عملیات</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                   {filtered.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                         <td className="p-4 text-center">
                            <input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleSelect(product.id)} className="w-4 h-4 accent-emerald-600 rounded cursor-pointer" />
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                                  <Box className="w-5 h-5" />
                               </div>
                               <span className="font-bold text-slate-800">{product.name}</span>
                            </div>
                         </td>
                         <td className="p-4 text-slate-600">{product.category}</td>
                         <td className="p-4 text-slate-600">
                            <span className="bg-slate-100 px-2 py-1 rounded-md text-[10px] whitespace-nowrap">{getPricingTypeName(product.type)}</span>
                         </td>
                         <td className="p-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                            {formatToman(product.basePrice)}
                         </td>
                         <td className="p-4 text-center">
                            {product.active ? 
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" /> : 
                              <XCircle className="w-5 h-5 text-rose-400 mx-auto" />
                            }
                         </td>
                         <td className="p-4">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Link to={`/admin/products/${product.id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                  <Edit2 className="w-4 h-4" />
                               </Link>
                            </div>
                         </td>
                      </tr>
                   ))}
                   {filtered.length === 0 && (
                      <tr>
                         <td colSpan={7} className="p-12 text-center text-slate-400 font-bold">هیچ محصولی یافت نشد.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
