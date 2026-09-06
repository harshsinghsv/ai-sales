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
        let icon = <span className="text-[#D97757] text-sm leading-none font-serif-anthropic">✻</span>;

        if (toast.service === 'hubspot') {
          icon = <Database className="size-3.5 text-[#D97757]" />;
        } else if (toast.service === 'calendar') {
          icon = <Calendar className="size-3.5 text-[#788C5D]" />;
        } else if (toast.service === 'slack') {
          icon = <MessageSquare className="size-3.5 text-[#5E5D59]" />;
        }

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl border border-[#E8E6DC] bg-[#FAF9F5]/95 backdrop-blur-md shadow-[0_12px_28px_rgba(20,20,19,0.12)] animate-toast-in text-[#141413]"
          >
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-medium text-[#141413] leading-tight">
                {toast.title}
              </h4>
              <p className="text-[11px] text-[#5E5D59] mt-0.5 leading-snug">
                {toast.detail}
              </p>
              {toast.url && (
                <a
                  href={toast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-[#D97757] hover:underline"
                >
                  Open in Calendar ↗
                </a>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#87867F] hover:text-[#141413] transition-colors shrink-0 cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
