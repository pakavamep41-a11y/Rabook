import { Clock, CheckCircle, CreditCard, XCircle, Printer, PackageCheck, Truck, Package, XSquare } from "lucide-react";
import { OrderStatus } from "../../types/models";

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string; bg: string; icon: any }> = {
  registered: {
    label: "ثبت شده",
    color: "text-slate-600",
    bg: "bg-slate-100",
    icon: Clock
  },
  in_review: {
    label: "در حال بررسی",
    color: "text-blue-600",
    bg: "bg-blue-100",
    icon: CheckCircle
  },
  pending_payment: {
    label: "در انتظار پرداخت",
    color: "text-amber-600",
    bg: "bg-amber-100",
    icon: CreditCard
  },
  file_rejected: {
    label: "فایل رد شده",
    color: "text-rose-600",
    bg: "bg-rose-100",
    icon: XCircle
  },
  printing: {
    label: "در حال چاپ",
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-100",
    icon: Printer
  },
  ready: {
    label: "آماده تحویل",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    icon: PackageCheck
  },
  shipped: {
    label: "ارسال شده",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    icon: Truck
  },
  delivered: {
    label: "تحویل شده",
    color: "text-teal-600",
    bg: "bg-teal-100",
    icon: Package
  },
  cancelled: {
    label: "لغو شده",
    color: "text-slate-400",
    bg: "bg-slate-50",
    icon: XSquare
  }
};
