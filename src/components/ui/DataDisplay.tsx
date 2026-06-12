import { useState, ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { cn } from "../../lib/utils";
import { toPersianDigits } from "../../lib/persian";
import { Link } from "react-router-dom";

// Tabs
export function Tabs({ tabs, defaultTab }: { tabs: { id: string; label: string; content: ReactNode }[], defaultTab?: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="w-full">
      <div className="flex border-b border-surface-border gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-3 text-sm font-medium transition-colors border-b-2",
              activeTab === tab.id
                ? "border-primary-600 text-primary-600"
                : "border-transparent text-text-muted hover:text-text-base"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="py-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

// Accordion
export function Accordion({ items }: { items: { id: string; title: string; content: ReactNode }[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="w-full flex-col divide-y divide-surface-border border border-surface-border rounded-xl bg-surface-base">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="w-full">
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between p-4 text-sm font-medium text-text-base hover:bg-surface-hover transition-colors"
            >
              {item.title}
              <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && <div className="p-4 pt-0 text-sm text-text-muted animate-in slide-in-from-top-2 fade-in">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}

// Badge/StatusChip
export function Badge({ children, variant = "default", className }: { children: ReactNode; variant?: "default" | "success" | "warning" | "danger"; className?: string }) {
  const variants = {
    default: "bg-surface-muted text-text-muted",
    success: "bg-success-base/10 text-success-base",
    warning: "bg-warning-base/10 text-warning-base",
    danger: "bg-danger-base/10 text-danger-base",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: "pending" | "processing" | "completed" | "cancelled" }) {
  const config = {
    pending: { label: "در انتظار", variant: "warning" as const },
    processing: { label: "در حال پردازش", variant: "default" as const },
    completed: { label: "تکمیل شده", variant: "success" as const },
    cancelled: { label: "لغو شده", variant: "danger" as const },
  };
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

// Table
export function Table({
  columns,
  data,
  isLoading,
  emptyMessage = "موردی یافت نشد."
}: {
  columns: { key: string; title: string; render?: (val: any, row: any) => ReactNode }[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-surface-border bg-surface-base">
      <table className="w-full text-sm text-right">
        <thead className="bg-surface-muted border-b border-surface-border text-text-muted font-medium">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-surface-border rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-surface-hover transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-text-base">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Pagination
export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-surface-border text-text-muted hover:bg-surface-hover disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <span className="text-sm font-medium text-text-base px-4">
        صفحه {toPersianDigits(currentPage.toString())} از {toPersianDigits(totalPages.toString())}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-surface-border text-text-muted hover:bg-surface-hover disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}

// Breadcrumbs
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center text-sm text-text-muted mb-4 gap-2">
      <Link to="/" className="hover:text-primary-600 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronLeft className="w-4 h-4 text-surface-border" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-base font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export function PriceText({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("font-mono font-medium", className)}>
      {toPersianDigits(amount.toLocaleString("en-US"))} <span className="text-xs text-text-muted font-sans">تومان</span>
    </span>
  );
}
