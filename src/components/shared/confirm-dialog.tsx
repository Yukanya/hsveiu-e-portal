'use client';

import React, { useId, useRef } from 'react';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  details?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  details,
  confirmLabel = 'Xác nhận thực hiện',
  cancelLabel = 'Hủy bỏ',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  useFocusTrap(open, dialogRef, onCancel);

  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#02294E]/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg bg-white border border-slate-300 border-t-4 shadow-2xl overflow-hidden focus:outline-none ${
          isDanger ? 'border-t-[#C10230]' : 'border-t-[#133F68]'
        }`}
      >
        <div className="px-5 py-4 bg-[#F8FAFC] border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 shrink-0 flex items-center justify-center ${
                isDanger
                  ? 'bg-[#C10230]/10 text-[#C10230]'
                  : 'bg-[#133F68]/10 text-[#133F68]'
              }`}
              aria-hidden="true"
            >
              {isDanger ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3
                id={titleId}
                className="text-base font-bold text-[#133F68] font-eiu-display leading-snug"
              >
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Đóng hộp thoại xác nhận"
            className="w-11 h-11 -mt-2 -mr-2 inline-flex items-center justify-center text-slate-600 hover:text-[#C10230] hover:bg-slate-200/70 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 text-sm text-slate-700 leading-relaxed">
          <p id={descId}>{description}</p>
          {details && details.length > 0 && (
            <ul className="bg-[#F8FAFC] border border-slate-200 p-3 space-y-1.5 text-xs text-slate-700">
              {details.map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <span className="text-[#A68556] font-bold">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-5 py-4 bg-[#F8FAFC] border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`min-h-[44px] px-5 py-2 text-white text-xs font-bold uppercase tracking-wider cursor-pointer font-eiu-display ${
              isDanger
                ? 'bg-[#C10230] hover:bg-[#9E0024]'
                : 'bg-[#133F68] hover:bg-[#0054A6]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
