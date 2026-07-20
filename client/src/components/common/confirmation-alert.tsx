"use client";

import { useRef, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ConfirmationDialogProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onConfirm: (setLoading: (loading: boolean) => void, closeRef: React.RefObject<HTMLButtonElement | null>) => void | Promise<void>;
  onClose?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  error?: string;
  variant?: "default" | "destructive";
  confirmLabel?: string;
  [key: string]: any;
}

export default function ConfirmationDialog({
  children,
  title,
  description,
  onConfirm,
  onClose = () => {},
  defaultOpen = false,
  error,
  variant = "default",
  confirmLabel,
  ...props
}: ConfirmationDialogProps) {
  const [loading, setLoading] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isDestructive = variant === "destructive";
  const confirmText = confirmLabel ?? (isDestructive ? "Delete" : "Confirm");

  const errorBanner = error ? (
    <div
      className={cn(
        "flex items-start gap-2 text-left text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg",
        isDestructive ? "mx-6 mb-0 mt-3 px-3 py-2" : "mx-4 mb-3 px-3 py-2"
      )}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
      <span className="leading-snug">{error}</span>
    </div>
  ) : null;

  const handleConfirm = () => {
    onConfirm(setLoading, closeBtnRef);
  };

  if (isDestructive) {
    return (
      <AlertDialog defaultOpen={defaultOpen} {...props}>
        {children}
        <AlertDialogContent className="max-w-md gap-0 overflow-hidden rounded-xl border border-border/70 p-0 text-center shadow-lg sm:max-w-md">
          <div className="border-b border-[var(--accent-1)]/15 bg-[var(--comp-1)]/60 px-6 py-5">
            <AlertDialogTitle className="text-xl font-semibold text-[var(--dark-1)]">
              {title || "Are you sure?"}
            </AlertDialogTitle>
            {description && (
              <AlertDialogDescription className="mt-2 text-sm text-[var(--dark-1)]/60 leading-normal">
                {description}
              </AlertDialogDescription>
            )}
          </div>
          {errorBanner}
          <div className="flex flex-col-reverse gap-2 px-6 py-5 sm:flex-row sm:justify-center">
            <AlertDialogCancel
              ref={closeBtnRef}
              onClick={onClose}
              className="mt-0 border-[var(--accent-1)]/30 text-[var(--dark-1)] hover:bg-[var(--comp-1)]"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={loading}
              className="font-semibold gap-1.5"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Deleting…" : confirmText}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog defaultOpen={defaultOpen} {...props}>
      {children}
      <AlertDialogContent className="w-[90vw] max-w-[450px] text-center border-0 px-0 overflow-auto gap-0">
        <AlertDialogTitle className="text-[24px] text-[var(--dark-1)] px-4 pt-4">
          {title || "Are you sure?"}
        </AlertDialogTitle>
        {description && (
          <AlertDialogDescription className="text-[var(--dark-1)]/50 mb-2 px-4 leading-normal">
            {description}
          </AlertDialogDescription>
        )}
        {errorBanner}
        <div className="px-4 pb-4 pt-1">
          <AlertDialogCancel
            ref={closeBtnRef}
            onClick={onClose}
            className="bg-[var(--accent-2)] text-white mr-2 py-[9px] px-4 rounded-[8px] hover:opacity-90"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="gap-1.5"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}