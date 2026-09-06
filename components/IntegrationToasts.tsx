'use client';

import React from 'react';
import { IntegrationToast } from '@/lib/types';
import { Calendar, Database, MessageSquare, Sparkles, X } from 'lucide-react';

interface IntegrationToastsProps {
  toasts: IntegrationToast[];
  onDismiss: (id: string) => void;
}

export const IntegrationToasts: React.FC<IntegrationToastsProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2.5 sm:max-w-sm w-auto sm:w-full pointer-events-none" role="status" aria-live="polite">
      {toasts.map((toast) => {
        let icon = <Sparkles className="size-3.5 text-[#4928fd]" />;

        if (toast.service === 'hubspot') {
          icon = <Database className="size-3.5 text-[#b3661d]" />;
        } else if (toast.service === 'calendar') {
          icon = <Calendar className="size-3.5 text-[#2f7a1d]" />;
        } else if (toast.service === 'slack') {
          icon = <MessageSquare className="size-3.5 text-[#6b3fa8]" />;
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 p-3 rounded-xl border border-[rgba(27,29,30,0.1)] bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(27,29,30,0.12)] animate-toast-in"
          >
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-[#1b1d1e] leading-tight">
                {toast.title}
              </h4>
              <p className="text-[11px] text-[rgba(27,29,30,0.55)] mt-0.5 leading-snug">
                {toast.detail}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[rgba(27,29,30,0.4)] hover:text-[#1b1d1e] transition-colors shrink-0"
            >
              <X className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
