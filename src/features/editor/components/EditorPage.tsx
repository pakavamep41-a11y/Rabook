import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import * as fabric from "fabric";
import { ArrowRight, Type, Image as ImageIcon, CheckCircle, Smartphone, Undo, Redo, Save, Download, Square, Circle, Minus, Layers, Trash2, Eye, EyeOff, Lock, Unlock, Copy } from "lucide-react";
import { useStore } from "../../../lib/store";

// Dummy Product Specs
const PRODUCT_SPEC = {
  width: 800,
  height: 500,
  bleed: 20,
  safeMargin: 20,
};

// Fonts
const FONTS = [
  "Vazirmatn", "IRANSansWeb", "Lalezar", "Dana"
];

export default function EditorPage() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const designId = searchParams.get("designId");
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<"front" | "back">("front");
  
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHistoryAction, setIsHistoryAction] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!designId); // show if it's a new design
  
  const [objects, setObjects] = useState<fabric.Object[]>([]);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  // Setup Canvas
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !canvasRef.current || !containerRef.current) return;
    
    // Init fabric
    const c = new fabric.Canvas(canvasRef.current, {
      width: PRODUCT_SPEC.width,
      height: PRODUCT_SPEC.height,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
      selection: true,
    });
    
    let isDisposed = false;
    
    // Load existing design if passing designId
    const tempDesign = useStore.getState().tempDesign;
    if (designId && tempDesign && tempDesign.id === designId) {
       c.loadFromJSON(tempDesign.json).then(() => {
         if (!isDisposed) {
           c.requestRenderAll();
           setCanvas(c);
         }
       });
    } else {
       setCanvas(c);
    }

    return () => {
      isDisposed = true;
      c.dispose();
    };
  }, [isMobile, designId]);

  // Events & State sync
  useEffect(() => {
    if (!canvas) return;

    const updateState = () => {
      setObjects([...canvas.getObjects()].reverse());
      // For Fabric v7, getActiveObject remains same mostly
      setActiveObject(canvas.getActiveObject() || null);
    };

    const saveHistory = () => {
      if (isHistoryAction) return;
      const json = canvas.toJSON();
      setHistory(prev => {
        const newHist = prev.slice(0, historyIndex + 1);
        newHist.push(json);
        return newHist;
      });
      setHistoryIndex(prev => prev + 1);
      updateState();
    };

    canvas.on('object:added', updateState);
    canvas.on('object:removed', updateState);
    canvas.on('object:modified', updateState);
    canvas.on('selection:created', updateState);
    canvas.on('selection:updated', updateState);
    canvas.on('selection:cleared', updateState);
    
    // Initial history
    saveHistory();

    // Hook changes to history
    canvas.on('object:modified', saveHistory);
    canvas.on('object:added', (e: any) => {
      // Avoid firing on initial add or undo/redo
      if (!isHistoryAction && e.target && e.target.type !== 'path') saveHistory();
    });
    canvas.on('object:removed', (e: any) => {
      if (!isHistoryAction) saveHistory();
    });

    return () => {
      canvas.off('object:added');
      canvas.off('object:removed');
      canvas.off('object:modified');
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
    };
  }, [canvas, historyIndex, isHistoryAction]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvas) return;
      
      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObs = canvas.getActiveObjects();
        if (activeObs.length > 0) {
          activeObs.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
      
      // Undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      // Redo
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, historyIndex, history]);

  const handleUndo = useCallback(() => {
    if (!canvas || historyIndex <= 0) return;
    setIsHistoryAction(true);
    const newIdx = historyIndex - 1;
    // For V7 fabric canvas loadFromJSON is async usually or returns promise
    canvas.loadFromJSON(history[newIdx]).then(() => {
      canvas.requestRenderAll();
      setHistoryIndex(newIdx);
      setIsHistoryAction(false);
    });
  }, [canvas, history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (!canvas || historyIndex >= history.length - 1) return;
    setIsHistoryAction(true);
    const newIdx = historyIndex + 1;
    canvas.loadFromJSON(history[newIdx]).then(() => {
      canvas.requestRenderAll();
      setHistoryIndex(newIdx);
      setIsHistoryAction(false);
    });
  }, [canvas, history, historyIndex]);

  // Object addition helpers
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('متن جدید', {
      left: 100,
      top: 100,
      fontFamily: 'Vazirmatn',
      fill: '#000000',
      fontSize: 32,
      direction: 'rtl',
      textAlign: 'right'
    } as any);
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  };

  const addRect = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#3b82f6',
      rx: 8,
      ry: 8
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 50,
      fill: '#f43f5e',
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
  };

  const handleLayerReorder = (obj: fabric.Object, direction: 'up' | 'down') => {
    if (!canvas) return;
    if (direction === 'up') canvas.bringObjectForward(obj);
    else canvas.sendObjectBackwards(obj);
    canvas.requestRenderAll();
    setObjects([...canvas.getObjects()].reverse());
  };

  const handleLayerDelete = (obj: fabric.Object) => {
    if (!canvas) return;
    canvas.remove(obj);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const handleSelectObj = (obj: fabric.Object) => {
    if (!canvas) return;
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  const handleSaveAndOrder = () => {
    if (!canvas || !productId) return;
    
    // Clear selection before saving to avoid handles in export
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    setTimeout(() => {
      // Export as PNG image
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // High res export
      });
      
      const json = JSON.stringify(canvas.toJSON());
      
      const tempId = `design_${Date.now()}`;
      
      // Save temp design
      useStore.getState().setTempDesign({
        id: tempId,
        image: dataUrl,
        json: json
      });
      
      useStore.getState().showAlert("طرح شما ذخیره شد", "success");
      
      // Navigate to product detail with design attachment query
      navigate(`/product/${productId}?designId=${tempId}`);
    }, 100);
  };
  
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <Smartphone className="w-16 h-16 text-emerald-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">ویرایشگر طراحی</h1>
        <p className="text-slate-400 mb-6 max-w-sm">
          امکان طراحی و ویرایش روی موبایل به صورت کامل محدود است. برای استفاده از تمامی امکانات و طراحی دقیق، لطفا از طریق <strong>دسکتاپ</strong> (لپ‌تاپ یا کامپیوتر) وارد شوید.
        </p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-emerald-600 rounded-lg hover:bg-emerald-500 font-medium transition-colors">
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden" dir="rtl">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">طراحی کارت ویزیت {productId}</h1>
            <span className="text-xs text-slate-500">ذخیره خودکار روشن است</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <Save className="w-4 h-4" />
            ذخیره طرح
          </button>
          <button onClick={handleSaveAndOrder} className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm">
            <CheckCircle className="w-4 h-4" />
            سفارش این طرح
          </button>
        </div>
      </header>
      
      {/* Main Work Area */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* Sidebar Toolbar */}
        <aside className="w-20 bg-white border-l border-slate-200 flex flex-col items-center py-4 gap-4 shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <button onClick={addText} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-slate-500 bg-slate-50 hover:bg-slate-100 hover:text-emerald-600 transition-all">
            <Type className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">متن</span>
          </button>
          <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-all">
            <ImageIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">تصویر</span>
          </button>
          <button onClick={addRect} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-all">
            <Square className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">مربع</span>
          </button>
          <button onClick={addCircle} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-all">
            <Circle className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">دایره</span>
          </button>
        </aside>
        
        {/* Canvas Area */}
        <main className="flex-1 relative flex flex-col items-center justify-center bg-slate-200/50 overflow-hidden">
          {/* Controls */}
          <div className="absolute top-4 left-4 flex bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden z-10">
            <button 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 transition-colors border-l border-slate-200"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 transition-colors"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>
          
          <div className="absolute top-4 right-4 flex bg-white rounded-lg shadow-sm border border-slate-200 p-1 z-10">
            <button 
              className={`px-4 py-1 text-sm font-bold rounded-md transition-colors ${activeTab === 'front' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              onClick={() => setActiveTab('front')}
            >روی کارت</button>
            <button 
              className={`px-4 py-1 text-sm font-bold rounded-md transition-colors ${activeTab === 'back' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              onClick={() => setActiveTab('back')}
            >پشت کارت</button>
          </div>
          
          <div className="shadow-2xl bg-white relative" style={{ width: PRODUCT_SPEC.width, height: PRODUCT_SPEC.height }}>
             <canvas ref={canvasRef} />
             {/* Print Guides - CSS for safe area/bleed mockup */}
             <div 
               className="absolute border border-blue-500/50 border-dashed pointer-events-none z-50 flex items-center justify-center text-[10px] text-blue-500/50 font-bold"
               style={{ 
                 top: PRODUCT_SPEC.bleed, 
                 left: PRODUCT_SPEC.bleed, 
                 right: PRODUCT_SPEC.bleed, 
                 bottom: PRODUCT_SPEC.bleed 
               }}
             >
               حاشیه برش ({PRODUCT_SPEC.bleed}mm)
             </div>
             <div 
               className="absolute border border-red-500/50 pointer-events-none z-50 flex items-center justify-center text-[10px] text-red-500/50 font-bold"
               style={{ 
                 top: PRODUCT_SPEC.bleed + PRODUCT_SPEC.safeMargin, 
                 left: PRODUCT_SPEC.bleed + PRODUCT_SPEC.safeMargin, 
                 right: PRODUCT_SPEC.bleed + PRODUCT_SPEC.safeMargin, 
                 bottom: PRODUCT_SPEC.bleed + PRODUCT_SPEC.safeMargin 
               }}
             >
               حاشیه امن
             </div>
          </div>
          
        </main>
        
        {/* Right Panel: Properties & Layers */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-[0_0_24px_rgba(0,0,0,0.02)]">
          {activeObject ? (
            <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
                تنظیمات {activeObject.type === 'i-text' ? 'متن' : 'شکل'}
                <button onClick={() => { canvas?.discardActiveObject(); canvas?.requestRenderAll(); }} className="text-xs text-slate-400 hover:text-slate-600">بستن</button>
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">عرض (px)</label>
                  <input type="number" 
                    value={Math.round(activeObject.width! * (activeObject.scaleX || 1))} 
                    readOnly 
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm outline-none" 
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">ارتفاع (px)</label>
                  <input type="number" 
                    value={Math.round(activeObject.height! * (activeObject.scaleY || 1))} 
                    readOnly 
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm outline-none" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-slate-500 mb-1 block">رنگ پر کردن</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={activeObject.fill as string || "#000000"} 
                    onChange={(e) => {
                      activeObject.set('fill', e.target.value);
                      canvas?.requestRenderAll();
                      canvas?.fire('object:modified', { target: activeObject });
                    }}
                    className="w-full h-8 rounded cursor-pointer border border-slate-200"
                  />
                </div>
              </div>

              {activeObject.type === 'i-text' && (
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">فونت</label>
                  <select 
                    value={(activeObject as fabric.IText).fontFamily}
                    onChange={(e) => {
                      (activeObject as fabric.IText).set('fontFamily', e.target.value);
                      canvas?.requestRenderAll();
                      canvas?.fire('object:modified', { target: activeObject });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-sm outline-none"
                  >
                    {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-slate-800 text-sm">لایه ها</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {objects.map((obj, i) => (
                  <div 
                    key={i}
                    onClick={() => handleSelectObj(obj)}
                    className={`p-2 border rounded-lg flex items-center justify-between text-sm cursor-pointer transition-colors ${activeObject === obj ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                       {obj.type === 'i-text' ? <Type className="w-3 h-3" /> : obj.type === 'rect' ? <Square className="w-3 h-3" /> : obj.type === 'circle' ? <Circle className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                       <span className="truncate max-w-[100px]">
                         {obj.type === 'i-text' ? (obj as fabric.IText).text : obj.type}
                       </span>
                    </div>
                    <div className="flex items-center gap-1">
                       <button onClick={(e) => { e.stopPropagation(); handleLayerDelete(obj); }} className="p-1 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
                {objects.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400">چیزی در صفحه نیست</div>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[85vh] overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800">انتخاب قالب برای {productId}</h2>
                <button onClick={() => setShowTemplates(false)} className="text-sm font-bold text-slate-500 hover:text-slate-800">بستن و ساخت بوم خالی</button>
             </div>
             <div className="p-6 overflow-y-auto grid grid-cols-3 gap-6 bg-slate-50">
                {[1, 2, 3, 4, 5, 6].map(t => (
                  <button 
                    key={t}
                    onClick={() => {
                        // Dummy: load a blank template for this demo
                        setShowTemplates(false);
                    }}
                    className="aspect-[1.6] bg-white border-2 border-transparent hover:border-emerald-500 shadow-sm rounded-xl overflow-hidden group transition-all"
                  >
                     <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-500">
                        قالب آماده شماره {t}
                     </div>
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
