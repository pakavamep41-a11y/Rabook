import { useState } from "react";
import { Folder, Plus, Edit2, Trash2, GripVertical, Settings } from "lucide-react";
import { useStore } from "../../../lib/store";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  visibility: boolean;
  order: number;
}

const mockCategories: Category[] = [
  { id: "1", name: "کارت ویزیت", slug: "business-cards", parentId: null, visibility: true, order: 1 },
  { id: "2", name: "گلاسه مات", slug: "matte-business-cards", parentId: "1", visibility: true, order: 1 },
  { id: "3", name: "کتان", slug: "linen-business-cards", parentId: "1", visibility: true, order: 2 },
  { id: "4", name: "تراکت", slug: "flyers", parentId: null, visibility: true, order: 2 },
];

export default function AdminCategoryPage() {
  const { showAlert } = useStore();
  const [categories, setCategories] = useState(mockCategories);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setIsDrawerOpen(true);
  };

  const handleAddCat = (parentId: string | null) => {
    const newCat = {
      id: Date.now().toString(),
      name: "دسته‌بندی جدید",
      slug: "new-category-" + Date.now(),
      parentId,
      visibility: true,
      order: categories.length + 1
    };
    setEditingCat(newCat);
    setIsDrawerOpen(true);
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      if (categories.find(c => c.id === editingCat.id)) {
        setCategories(categories.map(c => c.id === editingCat.id ? editingCat : c));
      } else {
        setCategories([...categories, editingCat]);
      }
    }
    setIsDrawerOpen(false);
    showAlert("دسته‌بندی با موفقیت ذخیره شد.", "success");
  };

  const CategoryNode = ({ cat, level }: { cat: Category, level: number }) => {
    const children = categories.filter(c => c.parentId === cat.id).sort((a,b) => a.order - b.order);
    
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow group">
          <div className="cursor-grab text-slate-300 hover:text-slate-500 hidden sm:block"><GripVertical className="w-5 h-5" /></div>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
            <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Folder className="w-4 h-4 text-emerald-500" />
              {cat.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden md:block">/{cat.slug}</span>
            {!cat.visibility && <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded font-bold">مخفی</span>}
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <button onClick={() => handleAddCat(cat.id)} className="p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 group-hover:opacity-100 md:opacity-0">
               <Plus className="w-4 h-4" /> <span className="hidden sm:inline">زیردسته</span>
             </button>
             <button onClick={() => handleEdit(cat)} className="p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
               <Edit2 className="w-4 h-4" />
             </button>
             <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
               <Trash2 className="w-4 h-4" />
             </button>
          </div>
        </div>
        
        {children.length > 0 && (
          <div className="pr-4 sm:pr-8 py-2 border-r-2 border-slate-100 flex flex-col gap-2 relative mr-4">
            {children.map(child => (
               <CategoryNode key={child.id} cat={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const rootCats = categories.filter(c => c.parentId === null).sort((a,b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-800">مدیریت دسته‌بندی‌ها</h1>
          <button onClick={() => handleAddCat(null)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors w-fit">
            <Plus className="w-4 h-4" />
            دسته‌بندی اصلی جدید
          </button>
       </div>

       <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col gap-3">
          {rootCats.map(cat => (
             <CategoryNode key={cat.id} cat={cat} level={0} />
          ))}
          {rootCats.length === 0 && (
            <div className="text-center p-8 text-slate-400 text-sm font-bold">هیچ دسته‌بندی تعریف نشده است.</div>
          )}
       </div>

       {/* Edit Drawer */}
       {isDrawerOpen && editingCat && (
          <div className="fixed inset-0 z-50 flex justify-end">
             <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
             <div className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-black text-slate-800"> ویرایش دسته‌بندی </h3>
                   <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-700"><Settings className="w-5 h-5"/></button>
                </div>
                
                <form onSubmit={saveCategory} className="p-5 flex-1 overflow-y-auto flex flex-col gap-5">
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">نام دسته‌بندی</label>
                      <input type="text" value={editingCat.name} onChange={e => setEditingCat({...editingCat, name: e.target.value})} className="p-3 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 outline-none" required />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">نامک (Slug)</label>
                      <input type="text" dir="ltr" value={editingCat.slug} onChange={e => setEditingCat({...editingCat, slug: e.target.value})} className="p-3 border border-slate-200 rounded-xl text-sm font-mono text-left focus:ring-1 focus:ring-emerald-500 outline-none" required />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">دسته‌بندی پدر</label>
                      <select value={editingCat.parentId || ""} onChange={e => setEditingCat({...editingCat, parentId: e.target.value || null})} className="p-3 border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-emerald-500 outline-none">
                         <option value="">(بدون پدر - دسته اصلی)</option>
                         {categories.filter(c => c.id !== editingCat.id).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                         ))}
                      </select>
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">تصویر بنر (URL)</label>
                      <input type="text" dir="ltr" className="p-3 border border-slate-200 rounded-xl text-sm font-mono text-left focus:ring-1 focus:ring-emerald-500 outline-none" />
                   </div>
                   <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-600">توضیحات سئو (Meta Description)</label>
                      <textarea rows={3} className="p-3 border border-slate-200 rounded-xl text-sm resize-none focus:ring-1 focus:ring-emerald-500 outline-none"></textarea>
                   </div>
                   <label className="flex items-center gap-2 cursor-pointer mt-2">
                       <input type="checkbox" checked={editingCat.visibility} onChange={e => setEditingCat({...editingCat, visibility: e.target.checked})} className="accent-emerald-600 w-4 h-4" />
                       <span className="text-sm font-bold text-slate-700">نمایش در سایت</span>
                   </label>
                </form>

                <div className="p-5 border-t border-slate-100 flex gap-3 bg-slate-50">
                   <button onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3 text-slate-600 font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50">انصراف</button>
                   <button onClick={saveCategory} className="flex-1 py-3 text-white font-bold bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md">ذخیره تغییرات</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
