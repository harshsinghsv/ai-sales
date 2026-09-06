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
        'rounded-2xl border p-5 sm:p-6 flex flex-col gap-4 shadow-sm transition-colors duration-300',
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
          <h2 className="font-serif-anthropic text-base font-normal text-[#141413]">
            Deal Cockpit
          </h2>
          <span className="text-[11px] text-[#5E5D59] font-normal hidden sm:inline">
            · Live commercial telemetry
          </span>
        </div>
        {escalated ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-[#D97757] border border-[#D97757]/30">
            <ShieldAlert className="size-3" aria-hidden />
            Escalated to human lead
          </span>
        ) : outcome ? (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FAF9F5] text-[#5E5D59] border border-[#E8E6DC] capitalize">
            {outcome.replace(/_/g, ' ')}
          </span>
        ) : null}
      </div>

      {/* Hero row: account + effective rate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="min-w-0 rounded-xl bg-[#FAF9F5] border border-[#E8E6DC] p-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#87867F]">
              Account Profile
            </span>
            <div
              className="mt-1 text-base sm:text-lg font-serif-anthropic font-medium text-[#141413] tracking-tight truncate"
              title={displayCompany ?? undefined}
            >
              {displayCompany || 'Razorpay Technologies'}
            </div>
            <div
              className="text-xs text-[#5E5D59] mt-0.5 truncate"
              title={displayName ?? undefined}
            >
              {displayName || 'Tina'} {customer.email ? `· ${customer.email}` : '· Enterprise Lead'}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#E8E6DC]/60 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#141413]">
              <Users className="size-3 text-[#D97757]" aria-hidden />
              <span className="tabular-nums">{requirements.seat_count ?? 50} Enterprise Seats</span>
            </span>
            <span className="text-[11px] text-[#5E5D59] font-mono">
              Opus 5 SLA
            </span>
          </div>
        </div>

        <div className="min-w-0 rounded-xl bg-[#FAF0EC]/50 border border-[#D97757]/20 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#D97757]">
                Effective Seat Rate
              </span>
              <span className="text-[10px] font-mono text-[#87867F]">
                List $35/mo
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl leading-none font-normal text-[#141413] tracking-tight tabular-nums font-serif-anthropic">
                ${deal_state.effective_price_per_seat.toFixed(2)}
              </span>
              <span className="text-xs text-[#5E5D59]">/seat/mo</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#D97757]/15">
            <div
              className="h-1.5 w-full rounded-full bg-[#E8E6DC] overflow-hidden"
              role="progressbar"
              aria-label="Margin buffer remaining"
              aria-valuenow={Math.round(marginRemaining)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${marginRemaining}%`, backgroundColor: barColor }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] mt-1.5">
              <span className="text-[#5E5D59] tabular-nums">{marginRemaining.toFixed(0)}% concession headroom</span>
              <span
                className={cn(
                  'tabular-nums font-medium',
                  deal_state.current_offer_pct_off > 0
                    ? 'text-[#D97757]'
                    : 'text-[#788C5D]'
                )}
              >
                {deal_state.current_offer_pct_off > 0
                  ? `−${deal_state.current_offer_pct_off}% concession`
                  : '100% margin defended'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Compact status strip */}
      <div className="pt-3 border-t border-[#E8E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#87867F]">Terms:</span>
          {hasConcession ? (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF0EC] text-[#D97757] border border-[#D97757]/20 truncate">
              {deal_state.concessions_given.join(' · ')}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF9F5] text-[#5E5D59] border border-[#E8E6DC]">
              List price defended · Standard Net 30
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#87867F]">Objections:</span>
          {objections_raised.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {objections_raised.map((obj) => (
                <span
                  key={obj.id}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border',
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
            </div>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FAF9F5] text-[#5E5D59] border border-[#E8E6DC]">
              0 open objections
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
