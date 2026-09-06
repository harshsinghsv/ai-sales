'use client';

import React, { useMemo } from 'react';
import { Activity, Zap, Wrench, Split, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type {
  PipelineMetric,
  ToolCallEvent,
  InterruptionEvent,
} from '@/lib/types';

interface AgoraPipelinePanelProps {
  metrics: PipelineMetric[];
  toolCalls: ToolCallEvent[];
  interruptions: InterruptionEvent[];
  inCall: boolean;
}

/** Pipeline stages in the order audio actually flows through them. */
const STAGES: Array<{ key: string; label: string; match: string[] }> = [
  { key: 'asr', label: 'ASR', match: ['asr', 'stt'] },
  { key: 'llm', label: 'LLM', match: ['llm'] },
  { key: 'tts', label: 'TTS', match: ['tts'] },
];

/**
 * Latency budget for the colour scale. Agora advertises sub-500ms round trips
 * for the Conversational AI pipeline, so that is the line we grade against.
 */
const GOOD_MS = 350;
const OK_MS = 700;

function latencyTone(ms: number): string {
  if (ms <= GOOD_MS) return 'text-[#2f7a1d]';
  if (ms <= OK_MS) return 'text-[#b3661d]';
  return 'text-[#a81f30]';
}

function barTone(ms: number): string {
  if (ms <= GOOD_MS) return 'bg-[#79d45e]';
  if (ms <= OK_MS) return 'bg-[#ffaf68]';
  return 'bg-[#d1293d]';
}

function formatArgs(args: Record<string, unknown>): string {
  const entries = Object.entries(args).filter(
    ([key]) => key !== 'conversation_id',
  );
  if (!entries.length) return '';
  return entries
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? '…' : String(v)}`)
    .join(' · ');
}

/**
 * Live view of the Agora Conversational AI pipeline: per-stage latency taken
 * from the engine's own AGENT_METRICS events, every tool call Agora made
 * against our MCP server, and each barge-in the engine detected.
 *
 * All three arrive over RTM / the cockpit WebSocket — nothing here is
 * simulated or measured client-side.
 */
export const AgoraPipelinePanel: React.FC<AgoraPipelinePanelProps> = ({
  metrics,
  toolCalls,
  interruptions,
  inCall,
}) => {
  // Latest sample per stage, plus the round-trip total.
  const stageLatency = useMemo(() => {
    const latest: Record<string, number> = {};
    for (const stage of STAGES) {
      const hit = metrics.find((m) =>
        stage.match.some(
          (needle) =>
            m.module.toLowerCase().includes(needle) ||
            m.name.toLowerCase().includes(needle),
        ),
      );
      if (hit) latest[stage.key] = Math.round(hit.valueMs);
    }
    return latest;
  }, [metrics]);

  const totalMs = useMemo(
    () => Object.values(stageLatency).reduce((sum, v) => sum + v, 0),
    [stageLatency],
  );

  const maxStageMs = Math.max(1, ...Object.values(stageLatency));
  const mcpCallCount = toolCalls.filter((t) => t.source === 'mcp').length;

  return (
    <section
      aria-label="Agora Conversational AI pipeline telemetry"
      className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-[0_1px_3px_rgba(27,29,30,0.06)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-[rgba(27,29,30,0.08)]">
        <div className="flex items-center gap-2 min-w-0">
          <Activity
            className="size-3.5 text-[#4928fd] shrink-0"
            aria-hidden
          />
          <h2 className="text-xs font-semibold text-[#1b1d1e] truncate">
            Agora Conversational AI · Live Pipeline
          </h2>
        </div>
        <span
          className={cn(
            'text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0',
            totalMs > 0
              ? 'bg-[#eeeafe] border-[#4928fd]/20 text-[#4928fd]'
              : 'bg-[rgba(27,29,30,0.04)] border-[rgba(27,29,30,0.1)] text-[rgba(27,29,30,0.5)]',
          )}
        >
          {totalMs > 0 ? `${totalMs}ms round trip` : 'Awaiting first turn'}
        </span>
      </div>

      {/* Stage latency bars */}
      <div className="px-4 sm:px-5 py-4 grid grid-cols-3 gap-3 border-b border-[rgba(27,29,30,0.08)]">
        {STAGES.map((stage) => {
          const ms = stageLatency[stage.key];
          return (
            <div key={stage.key} className="min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(27,29,30,0.5)]">
                  {stage.label}
                </span>
                <span
                  className={cn(
                    'text-xs font-semibold tabular-nums',
                    ms === undefined
                      ? 'text-[rgba(27,29,30,0.3)]'
                      : latencyTone(ms),
                  )}
                >
                  {ms === undefined ? '—' : `${ms}ms`}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-[rgba(27,29,30,0.06)] overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    ms === undefined ? 'bg-transparent' : barTone(ms),
                  )}
                  style={{
                    width:
                      ms === undefined
                        ? '0%'
                        : `${Math.max(6, (ms / maxStageMs) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Counters */}
      <div className="px-4 sm:px-5 py-3 flex items-center gap-4 flex-wrap border-b border-[rgba(27,29,30,0.08)]">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[rgba(27,29,30,0.65)]">
          <Cloud className="size-3 text-[#4928fd]" aria-hidden />
          <span className="font-semibold text-[#1b1d1e] tabular-nums">
            {mcpCallCount}
          </span>
          MCP tool {mcpCallCount === 1 ? 'call' : 'calls'} by Agora
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[rgba(27,29,30,0.65)]">
          <Split className="size-3 text-[#ffaf68]" aria-hidden />
          <span className="font-semibold text-[#1b1d1e] tabular-nums">
            {interruptions.length}
          </span>
          barge-{interruptions.length === 1 ? 'in' : 'ins'} handled
        </span>
      </div>

      {/* Tool call feed */}
      <div className="px-4 sm:px-5 py-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Wrench className="size-3 text-[rgba(27,29,30,0.4)]" aria-hidden />
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(27,29,30,0.5)]">
            Agent actions
          </span>
        </div>

        {toolCalls.length === 0 ? (
          <p className="text-[11px] text-[rgba(27,29,30,0.45)] py-2">
            {inCall
              ? 'No tools called yet — ask about pricing or request a discount.'
              : 'Start a call to watch Agora invoke the deal engine over MCP.'}
          </p>
        ) : (
          <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {toolCalls.map((call) => (
              <li
                key={call.id}
                className="rounded-lg border border-[rgba(27,29,30,0.08)] bg-[rgba(27,29,30,0.02)] px-2.5 py-2"
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Zap
                    className="size-3 text-[#4928fd] shrink-0"
                    aria-hidden
                  />
                  <code className="text-[11px] font-semibold text-[#1b1d1e]">
                    {call.tool}
                  </code>
                  <span
                    className={cn(
                      'text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full border',
                      call.source === 'mcp'
                        ? 'bg-[#eeeafe] border-[#4928fd]/20 text-[#4928fd]'
                        : 'bg-[rgba(27,29,30,0.05)] border-[rgba(27,29,30,0.1)] text-[rgba(27,29,30,0.55)]',
                    )}
                  >
                    {call.source === 'mcp' ? 'via Agora MCP' : 'middleware'}
                  </span>
                  {call.durationMs !== null && (
                    <span className="text-[10px] tabular-nums text-[rgba(27,29,30,0.45)] ml-auto">
                      {call.durationMs}ms
                    </span>
                  )}
                </div>

                {formatArgs(call.args) && (
                  <p className="mt-1 text-[10px] text-[rgba(27,29,30,0.5)] truncate">
                    {formatArgs(call.args)}
                  </p>
                )}
                {call.resultSummary && (
                  <p className="mt-0.5 text-[11px] text-[rgba(27,29,30,0.7)] line-clamp-2">
                    {call.resultSummary}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
