import { useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={cn(
          "w-full max-w-lg overflow-hidden rounded-xl bg-surface-base shadow-xl sm:rounded-2xl flex flex-col max-h-[90vh]",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border p-4">
          <h3 className="text-lg font-bold text-text-base">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted hover:bg-surface-hover hover:text-text-base transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-surface-border p-4 flex justify-end gap-2 bg-surface-muted/50">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

export function Drawer({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div
        className={cn(
          "w-full max-w-md h-full bg-surface-base shadow-xl flex flex-col animate-in slide-in-from-right-full duration-300",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-surface-border p-4">
          <h3 className="text-lg font-bold text-text-base">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-text-muted hover:bg-surface-hover hover:text-text-base transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 p-2 whitespace-nowrap bg-black text-white text-xs rounded shadow-lg z-10">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
      </div>
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "آیا اطمینان دارید؟",
  description,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>انصراف</Button>
          <Button variant="danger" onClick={onConfirm}>تأیید و انجام</Button>
        </>
      }
    >
      <p className="text-sm text-text-muted">{description}</p>
    </Modal>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-surface-border", className)} />
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12 px-4 text-center rounded-xl border border-dashed border-surface-border bg-surface-muted/30">
      <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center text-text-muted mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-text-base mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
