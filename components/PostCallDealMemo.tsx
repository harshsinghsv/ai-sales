'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PostCallDealMemo } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  ArrowRight,
  BadgePercent,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Handshake,
  X,
} from 'lucide-react';

interface PostCallDealMemoProps {
  memo: PostCallDealMemo;
  onClose: () => void;
}

export const PostCallDealMemoModal: React.FC<PostCallDealMemoProps> = ({ memo, onClose }) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const summary = [
      `Deal Memo — ${memo.customer.company} (${memo.customer.name}, ${memo.customer.email})`,
      `Seats: ${memo.requirements_captured.seat_count} · Tier: ${memo.requirements_captured.tier_matched}`,
      `List ${memo.negotiation_summary.list_price_per_seat} → Negotiated ${memo.negotiation_summary.final_negotiated_price} (${memo.negotiation_summary.discount_granted_pct} off)`,
      `ACV $${memo.financials.annual_contract_value.toLocaleString()} · Monthly $${memo.financials.monthly_value.toLocaleString()}`,
      `Concessions: ${memo.negotiation_summary.concessions_given.join('; ') || '—'}`,
      `Trades: ${memo.negotiation_summary.trades_obtained.join('; ') || '—'}`,
      `Outcome: ${memo.outcome}${memo.escalated_to_human ? ' (escalated)' : ''}`,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const shortId =
    memo.conversation_id.length > 14
      ? `…${memo.conversation_id.slice(-8)}`
      : memo.conversation_id;
  const crmSandbox = memo.crm_record.is_sandbox !== false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(27,29,30,0.45)] backdrop-blur-md p-4 animate-toast-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Executive deal memo"
        className="relative w-full max-w-2xl bg-white border border-[rgba(27,29,30,0.1)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header — pinned */}
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[rgba(27,29,30,0.08)] shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-9 rounded-xl bg-[#eeeafe] border border-[#4928fd]/20 flex items-center justify-center shrink-0">
              <FileText className="size-4 text-[#4928fd]" aria-hidden />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-[#1b1d1e] tracking-tight">
                  Executive Deal Memo
                </h3>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize',
                    memo.escalated_to_human
                      ? 'bg-[#fce9eb] text-[#a81f30] border-[#d1293d]/25'
                      : 'bg-[#e4f6df] text-[#2f7a1d] border-[#79d45e]/30'
                  )}
                >
                  {memo.outcome.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-[rgba(27,29,30,0.5)] mt-0.5 tabular-nums truncate">
                {memo.customer.company} · Call {shortId}
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close deal memo"
            className="p-2 rounded-full text-[rgba(27,29,30,0.4)] hover:text-[#1b1d1e] hover:bg-[rgba(27,29,30,0.06)] transition-colors cursor-pointer shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body — scrolls */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto space-y-5 text-xs text-[#1b1d1e]/80 custom-scrollbar">
          {/* ACV hero */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#eeeafe] via-[#eeeafe]/60 to-[#e2f0ff]/50 border border-[#4928fd]/15">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#4928fd]">
                  Annual contract value
                </span>
                <div className="mt-1.5 text-[32px] leading-none font-bold text-[#1b1d1e] tracking-tight tabular-nums">
                  ${memo.financials.annual_contract_value.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px] text-[rgba(27,29,30,0.6)] tabular-nums">
                  <span className="font-semibold text-[#1b1d1e]">
                    ${memo.financials.monthly_value.toLocaleString()}/mo
                  </span>
                  <span aria-hidden>·</span>
                  <span>{memo.requirements_captured.seat_count} seats</span>
                  <span aria-hidden>·</span>
                  <span>{memo.requirements_captured.tier_matched}</span>
                </div>
              </div>
              <span
                className={cn(
                  'shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
                  memo.negotiation_summary.margin_preserved
                    ? 'bg-[#e4f6df] text-[#2f7a1d] border-[#79d45e]/30'
                    : 'bg-[#ffefda] text-[#b3661d] border-[#ffaf68]/30'
                )}
              >
                {memo.negotiation_summary.margin_preserved ? 'Margin held' : 'Below floor'}
              </span>
            </div>
          </div>

          {/* Account */}
          <section aria-label="Account">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[rgba(27,29,30,0.42)] flex items-center gap-1.5 mb-2">
              <Building2 className="size-3" aria-hidden /> Account
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.4fr] gap-3">
              {[
                { label: 'Company', value: memo.customer.company },
                { label: 'Lead', value: memo.customer.name },
                { label: 'Email', value: memo.customer.email },
              ].map((f) => (
                <div
                  key={f.label}
                  className="min-w-0 p-3 rounded-xl bg-[rgba(27,29,30,0.025)] border border-[rgba(27,29,30,0.07)]"
                >
                  <span className="text-[10px] text-[rgba(27,29,30,0.45)] font-medium block">
                    {f.label}
                  </span>
                  <span
                    className="text-[13px] font-semibold text-[#1b1d1e] block mt-0.5 truncate"
                    title={f.value}
                  >
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Price waterfall */}
          <section aria-label="Negotiation summary">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[rgba(27,29,30,0.42)] flex items-center gap-1.5">
                <BadgePercent className="size-3" aria-hidden /> Negotiation summary
              </h4>
              <span className="text-[10px] text-[#2f7a1d] font-semibold tabular-nums">
                Floor: {memo.negotiation_summary.margin_floor_pct} max
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[rgba(27,29,30,0.025)] border border-[rgba(27,29,30,0.07)]">
              <div className="flex items-center justify-between gap-2 text-center">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[rgba(27,29,30,0.45)] block">List</span>
                  <span className="text-sm text-[rgba(27,29,30,0.6)] line-through tabular-nums">
                    {memo.negotiation_summary.list_price_per_seat}
                  </span>
                </div>
                <ArrowRight className="size-3.5 text-[#4928fd] shrink-0" aria-hidden />
                <div className="flex-1 min-w-0 rounded-lg bg-[#e4f6df] border border-[#79d45e]/30 px-2 py-1.5">
                  <span className="text-[10px] text-[#2f7a1d] font-semibold block">Negotiated</span>
                  <span className="text-sm text-[#2f7a1d] font-bold tabular-nums">
                    {memo.negotiation_summary.final_negotiated_price}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[rgba(27,29,30,0.45)] block">Discount</span>
                  <span className="text-sm font-bold text-[#b3661d] tabular-nums">
                    {memo.negotiation_summary.discount_granted_pct}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[rgba(27,29,30,0.07)] space-y-1.5 text-[11px]">
                <div className="flex gap-1.5">
                  <Handshake className="size-3.5 text-[#b3661d] shrink-0 mt-px" aria-hidden />
                  <span className="text-[#1b1d1e]/80">
                    {memo.negotiation_summary.concessions_given.length > 0 ? (
                      memo.negotiation_summary.concessions_given.join(', ')
                    ) : (
                      <span className="text-[rgba(27,29,30,0.4)]">No concessions given</span>
                    )}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <CheckCircle2 className="size-3.5 text-[#2f7a1d] shrink-0 mt-px" aria-hidden />
                  <span className="text-[#1b1d1e]/80">
                    {memo.negotiation_summary.trades_obtained.length > 0 ? (
                      memo.negotiation_summary.trades_obtained.join(', ')
                    ) : (
                      <span className="text-[rgba(27,29,30,0.4)]">No trades requested</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Objections Audit */}
          <section aria-label="Objections audit">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.08em] text-[rgba(27,29,30,0.42)] mb-2">
              Objections audit
            </h4>
            {memo.objections_audit.length === 0 ? (
              <p className="text-[11px] text-[rgba(27,29,30,0.45)] py-1">
                No objections raised on this call.
              </p>
            ) : (
              <ul className="divide-y divide-[rgba(27,29,30,0.06)] rounded-xl border border-[rgba(27,29,30,0.07)] overflow-hidden">
                {memo.objections_audit.map((obj, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 px-3.5 py-2.5 text-[12px] bg-white"
                    title={obj.context || obj.label}
                  >
                    <span className="text-[#1b1d1e]/85 font-medium min-w-0 truncate">
                      {obj.label}
                    </span>
                    {obj.resolved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e4f6df] text-[#2f7a1d] shrink-0">
                        <CheckCircle2 className="size-3" aria-hidden /> Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffefda] text-[#b3661d] shrink-0">
                        <Clock className="size-3" aria-hidden /> Open
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* CRM Status */}
          <div
            className={cn(
              'flex items-center justify-between gap-3 p-3.5 rounded-xl border',
              crmSandbox
                ? 'bg-[#ffefda]/50 border-[#ffaf68]/30'
                : 'bg-[#e4f6df]/50 border-[#79d45e]/30'
            )}
          >
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1b1d1e] flex items-center gap-1.5">
                {crmSandbox ? (
                  <Clock className="size-3.5 text-[#b3661d]" aria-hidden />
                ) : (
                  <CheckCircle2 className="size-3.5 text-[#2f7a1d]" aria-hidden />
                )}
                {memo.crm_record.crm_system} · {crmSandbox ? 'Sandbox — not synced' : memo.crm_record.status}
              </span>
              <span className="text-[10px] text-[rgba(27,29,30,0.45)] block mt-0.5">
                {crmSandbox
                  ? 'Connect HubSpot to push this deal live'
                  : 'Deal & contact timeline logged'}
              </span>
            </div>
            {!crmSandbox && (
              <a
                href="https://app.hubspot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-white hover:bg-[rgba(27,29,30,0.05)] text-[#1b1d1e]/80 border border-[rgba(27,29,30,0.12)] transition-colors"
              >
                <span>Open in HubSpot</span>
                <ExternalLink className="size-3" aria-hidden />
              </a>
            )}
          </div>
        </div>

        {/* Footer — pinned */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3 border-t border-[rgba(27,29,30,0.08)] bg-[rgba(27,29,30,0.02)] shrink-0">
          <span className="text-[10px] text-[rgba(27,29,30,0.4)] tabular-nums truncate" title={memo.conversation_id}>
            {shortId}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[rgba(27,29,30,0.12)] hover:bg-[rgba(27,29,30,0.05)] text-[#1b1d1e]/80 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="size-3" aria-hidden /> : <Copy className="size-3" aria-hidden />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[rgba(27,29,30,0.12)] hover:bg-[rgba(27,29,30,0.05)] text-[#1b1d1e]/80 text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="size-3" aria-hidden /> Export
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#4928fd] text-white hover:bg-[#3b1ee6] text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
