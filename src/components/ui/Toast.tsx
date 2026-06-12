import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "../../lib/utils";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

// Component for Toast
const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success-base" />,
    error: <AlertCircle className="w-5 h-5 text-danger-base" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning-base" />,
    info: <Info className="w-5 h-5 text-primary-500" />
  };

  return (
    <div className={cn(
      "flex items-center gap-3 w-full p-4 rounded-xl shadow-lg border border-surface-border bg-surface-base animate-in slide-in-from-top-4 fade-in duration-300"
    )}>
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-text-base">{toast.message}</p>
      <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-hover text-text-muted transition">
         <X className="w-4 h-4" />
      </button>
    </div>
  );
}
