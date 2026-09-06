'use client';

import React from 'react';
import { SessionState } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Users,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

interface DealCockpitPanelProps {
  session: SessionState;
}

export const DealCockpitPanel: React.FC<DealCockpitPanelProps> = ({ session }) => {
  const { customer, requirements, deal_state, objections_raised, escalated, outcome } = session;

  const marginRemaining = Math.max(0, Math.min(100, deal_state.margin_remaining_pct));

  const barColor =
    marginRemaining > 50
      ? '#22a06b'
      : marginRemaining > 20
      ? '#d97c1e'
      : '#d1293d';

  const hasConcession = deal_state.concessions_given.length > 0;
  const resolvedCount = objections_raised.filter((o) => o.resolved).length;
  const objectionProgress =
    objections_raised.length > 0 ? (resolvedCount / objections_raised.length) * 100 : 0;
  const extraConcessions = Math.max(0, deal_state.concessions_given.length - 1);
  const allConcessionsTitle = deal_state.concessions_given.join(' · ');
  const displayCompany = customer.company?.trim() || null;
  const displayName = customer.name?.trim() || null;

  return (
    <section
      aria-label="Live deal cockpit"
      className={cn(
        'rounded-2xl border p-5 sm:p-6 flex flex-col gap-5 shadow-[0_1px_3px_rgba(27,29,30,0.06)] transition-colors duration-300',
        escalated
          ? 'bg-[#fce9eb] border-[#d1293d]/25'
          : 'bg-white border-[rgba(27,29,30,0.1)]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              'size-2 rounded-full',
              escalated ? 'bg-[#d1293d]' : 'bg-[#22a06b] animate-softpulse'
            )}
          />
          <h2 className="text-sm font-bold text-[#1b1d1e] tracking-tight">Deal Cockpit</h2>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e4f6df] text-[#1e6b1a] border border-[#79d45e]/40">
            Live
          </span>
        </div>
        {escalated ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white text-[#a81f30] border border-[#d1293d]/25">
            <ShieldAlert className="size-3" aria-hidden />
            Escalated to specialist
          </span>
        ) : outcome ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#eeeafe] text-[#4928fd] border border-[#4928fd]/20 capitalize">
            {outcome.replace(/_/g, ' ')}
          </span>
        ) : null}
      </div>

      {/* Hero row: account + effective rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        <div className="min-w-0 rounded-xl bg-[rgba(27,29,30,0.025)] border border-[rgba(27,29,30,0.07)] p-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[rgba(27,29,30,0.5)]">
            Account
          </span>
          <div
            className="mt-1.5 text-lg font-bold text-[#1b1d1e] leading-tight tracking-tight truncate"
            title={displayCompany ?? undefined}
          >
            {displayCompany ?? <span className="text-[rgba(27,29,30,0.35)]">Awaiting details…</span>}
          </div>
          <div
            className="text-[13px] font-medium text-[rgba(27,29,30,0.62)] mt-0.5 truncate"
            title={displayName ?? undefined}
          >
            {displayName ?? <span className="text-[rgba(27,29,30,0.35)]">Unknown buyer</span>}
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1b1d1e]/85">
            <Users className="size-3.5 text-[#4928fd]" aria-hidden />
            <span className="tabular-nums">
              {requirements.seat_count != null ? requirements.seat_count : '—'} seats
            </span>
            <span aria-hidden className="text-[rgba(27,29,30,0.3)]">·</span>
            <span className="truncate">{deal_state.tier_name}</span>
          </div>
        </div>

        <div className="min-w-0 rounded-xl bg-[#eeeafe]/50 border border-[#4928fd]/15 p-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#4928fd]">
            Effective rate
          </span>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-[32px] leading-none font-bold text-[#1b1d1e] tracking-tight tabular-nums">
              ${deal_state.effective_price_per_seat.toFixed(2)}
            </span>
            <span className="text-xs text-[rgba(27,29,30,0.5)]">/seat/mo</span>
          </div>

          <div
            className="mt-3 h-1.5 w-full rounded-full bg-[rgba(27,29,30,0.08)] overflow-hidden"
            role="progressbar"
            aria-label="Margin buffer remaining"
            aria-valuenow={Math.round(marginRemaining)}
            aria-valuemin={0}
            aria-valuemax={100}
            title={`Discount floor: ${deal_state.margin_floor_pct}% max. ${marginRemaining.toFixed(0)}% of margin buffer remains.`}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${marginRemaining}%`, backgroundColor: barColor }}
            />
          </div>
          <div className="flex justify-between gap-2 text-[11px] mt-1.5">
            <span className="text-[rgba(27,29,30,0.6)] tabular-nums">{marginRemaining.toFixed(0)}% margin left</span>
            <span
              className={cn(
                'tabular-nums font-semibold',
                deal_state.current_offer_pct_off > 0
                  ? 'text-[#b3661d]'
                  : 'text-[rgba(27,29,30,0.5)]'
              )}
            >
              {deal_state.current_offer_pct_off > 0
                ? `−${deal_state.current_offer_pct_off}% granted`
                : 'List price'}
            </span>
          </div>
        </div>
      </div>

      {/* Compact status strip */}
      <div className="pt-4 border-t border-[rgba(27,29,30,0.07)] flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0 sm:divide-x sm:divide-[rgba(27,29,30,0.08)]">
        <div className="sm:pr-6 min-w-0">
          {hasConcession ? (
            <div className="flex items-center gap-2 text-xs min-w-0">
              <span className="text-[rgba(27,29,30,0.55)] shrink-0 font-medium">Concession</span>
              <span
                className="font-bold text-[#b3661d] truncate"
                title={allConcessionsTitle}
              >
                {deal_state.concessions_given[0]}
              </span>
              {extraConcessions > 0 && (
                <span
                  className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ffefda] text-[#b3661d]"
                  title={allConcessionsTitle}
                >
                  +{extraConcessions} more
                </span>
              )}
              {deal_state.trades_requested.length > 0 && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <span aria-hidden className="text-[rgba(27,29,30,0.3)]">→</span>
                  <span
                    className="font-bold text-[#1e6b1a] truncate"
                    title={deal_state.trades_requested.join(' · ')}
                  >
                    {deal_state.trades_requested[0]}
                  </span>
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-[rgba(27,29,30,0.5)]">
              List price defended · no concessions yet
            </span>
          )}
        </div>

        <div className="sm:pl-6 min-w-0 flex-1">
          {objections_raised.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {objections_raised.map((obj) => (
                  <span
                    key={obj.id}
                    title={obj.context || obj.label}
                    className={cn(
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
                      obj.resolved
                        ? 'bg-[#e4f6df] text-[#1e6b1a] border-[#79d45e]/40'
                        : 'bg-[#ffefda] text-[#b3661d] border-[#ffaf68]/40'
                    )}
                  >
                    {obj.resolved ? (
                      <CheckCircle2 className="size-3" aria-hidden />
                    ) : (
                      <Clock className="size-3" aria-hidden />
                    )}
                    {obj.label}
                  </span>
                ))}
                <span className="text-[11px] font-medium text-[rgba(27,29,30,0.55)] ml-1 tabular-nums">
                  {resolvedCount}/{objections_raised.length} resolved
                </span>
              </div>
              <div
                className="h-1 w-full max-w-56 rounded-full bg-[rgba(27,29,30,0.08)] overflow-hidden"
                role="progressbar"
                aria-label="Objections resolved"
                aria-valuenow={resolvedCount}
                aria-valuemin={0}
                aria-valuemax={objections_raised.length}
              >
                <div
                  className="h-full rounded-full bg-[#22a06b] transition-all duration-500"
                  style={{ width: `${objectionProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="text-xs text-[rgba(27,29,30,0.5)]">No objections raised yet</span>
          )}
        </div>
      </div>
    </section>
  );
};
