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
      ? '#788C5D'
      : marginRemaining > 20
      ? '#D97757'
      : '#A34A2E';

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
        'rounded-2xl border p-5 sm:p-6 flex flex-col gap-5 shadow-sm transition-colors duration-300',
        escalated
          ? 'bg-[#FAF0EC] border-[#D97757]/30'
          : 'bg-white border-[#E8E6DC]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E8E6DC]">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              'size-2 rounded-full',
              escalated ? 'bg-[#D97757]' : 'bg-[#788C5D] animate-pulse'
            )}
          />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#141413]">
            Deal Cockpit
          </h2>
          <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md bg-[#FAF9F5] text-[#5E5D59] border border-[#E8E6DC]">
            Live Telemetry
          </span>
        </div>
        {escalated ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-white text-[#D97757] border border-[#D97757]/30">
            <ShieldAlert className="size-3" aria-hidden />
            Escalated to specialist
          </span>
        ) : outcome ? (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FAF9F5] text-[#5E5D59] border border-[#E8E6DC] capitalize">
            {outcome.replace(/_/g, ' ')}
          </span>
        ) : null}
      </div>

      {/* Hero row: account + effective rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="min-w-0 rounded-xl bg-[#FAF9F5] border border-[#E8E6DC] p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#87867F]">
            Account
          </span>
          <div
            className="mt-1.5 text-base sm:text-lg font-serif-anthropic font-medium text-[#141413] leading-snug tracking-tight truncate"
            title={displayCompany ?? undefined}
          >
            {displayCompany ?? <span className="text-[#87867F] font-sans font-normal text-sm">Awaiting details…</span>}
          </div>
          <div
            className="text-xs font-normal text-[#5E5D59] mt-0.5 truncate"
            title={displayName ?? undefined}
          >
            {displayName ?? <span className="text-[#87867F]">Unknown buyer</span>}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#141413]">
            <Users className="size-3 text-[#D97757]" aria-hidden />
            <span className="tabular-nums">
              {requirements.seat_count != null ? requirements.seat_count : '—'} seats
            </span>
            <span aria-hidden className="text-[#D5D3CA]">·</span>
            <span className="truncate text-[#5E5D59]">{deal_state.tier_name}</span>
          </div>
        </div>

        <div className="min-w-0 rounded-xl bg-[#FAF0EC]/60 border border-[#D97757]/20 p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#D97757]">
            Effective rate
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl leading-none font-normal text-[#141413] tracking-tight tabular-nums font-serif-anthropic">
              ${deal_state.effective_price_per_seat.toFixed(2)}
            </span>
            <span className="text-xs text-[#5E5D59]">/seat/mo</span>
          </div>

          <div
            className="mt-3.5 h-1.5 w-full rounded-full bg-[#E8E6DC] overflow-hidden"
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
          <div className="flex justify-between gap-2 text-[11px] mt-2">
            <span className="text-[#5E5D59] tabular-nums">{marginRemaining.toFixed(0)}% margin left</span>
            <span
              className={cn(
                'tabular-nums font-medium',
                deal_state.current_offer_pct_off > 0
                  ? 'text-[#D97757]'
                  : 'text-[#87867F]'
              )}
            >
              {deal_state.current_offer_pct_off > 0
                ? `−${deal_state.current_offer_pct_off}% granted`
                : 'List price defended'}
            </span>
          </div>
        </div>
      </div>

      {/* Compact status strip */}
      <div className="pt-3.5 border-t border-[#E8E6DC] flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0 sm:divide-x sm:divide-[#E8E6DC]">
        <div className="sm:pr-6 min-w-0">
          {hasConcession ? (
            <div className="flex items-center gap-2 text-xs min-w-0">
              <span className="text-[#5E5D59] shrink-0 font-medium">Concession</span>
              <span
                className="font-medium text-[#D97757] truncate"
                title={allConcessionsTitle}
              >
                {deal_state.concessions_given[0]}
              </span>
              {extraConcessions > 0 && (
                <span
                  className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#FAF0EC] text-[#D97757] border border-[#D97757]/20"
                  title={allConcessionsTitle}
                >
                  +{extraConcessions} more
                </span>
              )}
              {deal_state.trades_requested.length > 0 && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <span aria-hidden className="text-[#87867F]">→</span>
                  <span
                    className="font-medium text-[#788C5D] truncate"
                    title={deal_state.trades_requested.join(' · ')}
                  >
                    {deal_state.trades_requested[0]}
                  </span>
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-[#87867F]">
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
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border',
                      obj.resolved
                        ? 'bg-[#FAF9F5] text-[#788C5D] border-[#788C5D]/30'
                        : 'bg-[#FAF0EC] text-[#D97757] border-[#D97757]/30'
                    )}
                  >
                    {obj.resolved ? (
                      <CheckCircle2 className="size-3 text-[#788C5D]" aria-hidden />
                    ) : (
                      <Clock className="size-3 text-[#D97757]" aria-hidden />
                    )}
                    {obj.label}
                  </span>
                ))}
                <span className="text-[11px] font-medium text-[#87867F] ml-1 tabular-nums">
                  {resolvedCount}/{objections_raised.length} resolved
                </span>
              </div>
              <div
                className="h-1 w-full max-w-56 rounded-full bg-[#E8E6DC] overflow-hidden"
                role="progressbar"
                aria-label="Objections resolved"
                aria-valuenow={resolvedCount}
                aria-valuemin={0}
                aria-valuemax={objections_raised.length}
              >
                <div
                  className="h-full rounded-full bg-[#788C5D] transition-all duration-500"
                  style={{ width: `${objectionProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <span className="text-xs text-[#87867F]">No objections raised yet</span>
          )}
        </div>
      </div>
    </section>
  );
};
