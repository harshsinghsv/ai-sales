'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock,
  Calendar,
  Sparkles,
  LucideIcon
} from 'lucide-react';

interface StageNode {
  step: string;
  id: string;
  title: string;
  spec: string;
  metric: string;
  metricColor: string;
  icon: LucideIcon;
  log: string;
}

const STAGES: StageNode[] = [
  {
    step: '01',
    id: 'qualification',
    title: 'Seat Sizing',
    spec: '250 Engineering Seats',
    metric: '$225K List ARR',
    metricColor: 'text-[#141413]',
    icon: Building2,
    log: 'HubSpot: Contact enriched · Account sized for Claude Enterprise with SCIM SSO.',
  },
  {
    step: '02',
    id: 'compliance',
    title: 'Compliance Gate',
    spec: 'Zero Data Retention',
    metric: 'SOC 2 & HIPAA',
    metricColor: 'text-blue-700',
    icon: ShieldCheck,
    log: 'Procurement: Zero model training guaranteed · Custom HIPAA BAA auto-dispatched.',
  },
  {
    step: '03',
    id: 'margin',
    title: 'Margin Defense',
    spec: '18.0% Floor Protected',
    metric: '-12% for 24-Mo Term',
    metricColor: 'text-[#D97757]',
    icon: Sliders,
    log: 'Deal Engine: 25% discount request countered with 12% in reciprocity for 24-month term.',
  },
  {
    step: '04',
    id: 'closing',
    title: 'Autonomous Close',
    spec: 'HubSpot Stage Won',
    metric: '420ms Sync',
    metricColor: 'text-emerald-700',
    icon: CheckCircle2,
    log: 'Executive Slot: GCal invite sent for Tuesday 10 AM · Slack #deals notified.',
  },
];

export const AnthropicShowcase: React.FC<{ onLaunchDemo: () => void }> = ({ onLaunchDemo }) => {
  const [activeStageId, setActiveStageId] = useState<string>('margin');
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[2];

  return (
    <section id="demo-showcase" className="py-20 bg-white border-b border-[#E8E6DC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Minimal Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/20 text-[#D97757] text-xs font-mono font-medium mb-3">
            <span className="text-sm leading-none">✻</span>
            <span>ENTERPRISE CASE STUDY</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
            How Anthropic Deploys Emily for Claude Enterprise
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5E5D59]">
            The 4-stage autonomous pipeline: seat qualification, compliance verification, margin floor defense, and CRM close.
          </p>
        </div>

        {/* Minimal Spatial Board (Matching IntegrationBeams container structure) */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] shadow-sm p-6 sm:p-10 space-y-8">
          {/* 4 Connected Nodes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative">
            {STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              const IconComp = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-4 sm:p-5 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-between gap-3 relative ${
                    isSelected
                      ? 'bg-white border-[#D97757] shadow-md ring-1 ring-[#D97757]/30 scale-[1.02]'
                      : 'bg-white/80 border-[#E8E6DC] hover:border-[#D97757]/40 hover:bg-white'
                  }`}
                >
                  {/* Step Number & Icon */}
                  <div className="w-full flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#8C8984]">
                      {stage.step}
                    </span>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-[#D97757] animate-pulse' : 'bg-transparent'
                      }`}
                    />
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#141413] text-white shadow-md'
                        : 'bg-[#FAF0EC] text-[#D97757]'
                    }`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-[#141413] mb-0.5">
                      {stage.title}
                    </div>
                    <div className="text-[11px] text-[#5E5D59] font-medium leading-snug">
                      {stage.spec}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E6DC] w-full">
                    <span className={`text-[10px] font-mono font-semibold ${stage.metricColor}`}>
                      {stage.metric}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Minimal Live Event Status Strip */}
          <div className="p-4 rounded-xl bg-white border border-[#E8E6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[#8C8984]">Stage {activeStage.step}:</span>
              <span className="text-[#141413] font-medium">{activeStage.log}</span>
            </div>

            <button
              type="button"
              onClick={onLaunchDemo}
              className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#141413] hover:bg-[#252321] transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
