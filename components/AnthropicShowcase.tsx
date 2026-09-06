'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  ArrowRight,
  LucideIcon
} from 'lucide-react';
import { Card, CardHeader, CardContent, CardToolbar } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-2';
import { StatisticCard10 } from '@/components/ui/demo';
import { MovingBorderButton } from '@/components/ui/moving-border-button';

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

const STAGE_STATS: Record<string, {
  title: string;
  amount: string;
  currency: string;
  trend: string;
  trendLabel: string;
  metric1Label: string;
  metric1Value: string;
  metric2Label: string;
  metric2Value: string;
}> = {
  qualification: {
    title: 'Seat Sizing Pipeline',
    amount: '$ 225,000',
    currency: 'ARR',
    trend: '+100%',
    trendLabel: 'full list ARR initialized',
    metric1Label: 'Target Sizing:',
    metric1Value: '250 Seats @ $75/mo',
    metric2Label: 'Enterprise Feature:',
    metric2Value: 'SCIM & SAML SSO',
  },
  compliance: {
    title: 'Compliance Assurance',
    amount: '100%',
    currency: 'VERIFIED',
    trend: 'SOC 2',
    trendLabel: 'zero model data retention',
    metric1Label: 'Security Protocol:',
    metric1Value: 'ZDR Architecture',
    metric2Label: 'Procurement Gate:',
    metric2Value: 'Custom HIPAA BAA',
  },
  margin: {
    title: 'Protected Deal Economics',
    amount: '$ 198,000',
    currency: 'ARR',
    trend: '-12.0%',
    trendLabel: 'discount with reciprocal lock',
    metric1Label: 'Hard Floor Defended:',
    metric1Value: '82.0% Margin',
    metric2Label: 'Reciprocal Trade-Off:',
    metric2Value: '24-Mo Term Locked',
  },
  closing: {
    title: 'Closed-Won Execution',
    amount: '$ 198,000',
    currency: 'ARR',
    trend: '420ms',
    trendLabel: 'autonomous close turnaround',
    metric1Label: 'HubSpot Deal Stage:',
    metric1Value: '#AG-9428 Closed-Won',
    metric2Label: 'Exec Architecture Slot:',
    metric2Value: 'Tuesday 10:00 AM',
  },
};

export const AnthropicShowcase: React.FC<{ onLaunchDemo: () => void }> = ({ onLaunchDemo }) => {
  const [activeStageId, setActiveStageId] = useState<string>('margin');
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[2];
  const activeStats = STAGE_STATS[activeStageId] || STAGE_STATS.margin;

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

        {/* Minimal Spatial Board */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] shadow-sm p-6 sm:p-10 space-y-8">
          {/* 4 Connected Stage Cards (Using clean 21st.dev Card layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
            {STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              const IconComp = stage.icon;

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`h-full transition-all duration-200 ${
                      isSelected
                        ? 'bg-white border-[#D97757] shadow-md ring-2 ring-[#D97757]/20 scale-[1.02]'
                        : 'bg-white/80 border-[#E8E6DC] hover:border-[#D97757]/40 hover:bg-white shadow-xs'
                    }`}
                  >
                    <CardHeader className="border-0 px-4 py-4 min-h-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#141413] text-white'
                              : 'bg-[#FAF0EC] text-[#D97757]'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-[#141413]">
                          {stage.title}
                        </span>
                      </div>
                      <CardToolbar>
                        <Badge
                          variant={isSelected ? 'primary' : 'outline'}
                          size="xs"
                          appearance={isSelected ? 'default' : 'light'}
                          className="font-mono text-[10px]"
                        >
                          {stage.step}
                        </Badge>
                      </CardToolbar>
                    </CardHeader>

                    <CardContent className="px-4 pb-4 pt-0 space-y-2.5">
                      <div className="text-xs text-[#5E5D59] font-medium leading-snug">
                        {stage.spec}
                      </div>

                      <div className="p-2 bg-muted/60 flex items-center justify-between rounded-lg">
                        <span className="text-[11px] text-muted-foreground font-mono">KPI:</span>
                        <span className={`text-[11px] font-mono font-semibold ${stage.metricColor}`}>
                          {stage.metric}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Active Stage Detailed Breakdown + 21st.dev StatisticCard10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] text-[#D97757] text-xs font-mono font-medium">
                <span>STAGE {activeStage.step} LIVE EXECUTION</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#141413]">
                {activeStage.title} · {activeStage.spec}
              </h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                {activeStage.log}
              </p>
              <div className="p-3 rounded-xl bg-white border border-[#E8E6DC] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8C8984]">Target KPI</span>
                <span className={`font-semibold ${activeStage.metricColor}`}>{activeStage.metric}</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <StatisticCard10
                title={activeStats.title}
                amount={activeStats.amount}
                currency={activeStats.currency}
                trend={activeStats.trend}
                trendLabel={activeStats.trendLabel}
                metric1Label={activeStats.metric1Label}
                metric1Value={activeStats.metric1Value}
                metric2Label={activeStats.metric2Label}
                metric2Value={activeStats.metric2Value}
                className="w-full shadow-xs"
              />
            </div>
          </div>

          {/* Minimal Live Event Status Strip */}
          <div className="p-4 rounded-xl bg-white border border-[#E8E6DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[#8C8984]">Stage {activeStage.step}:</span>
              <span className="text-[#141413] font-medium">{activeStage.log}</span>
            </div>

            <MovingBorderButton
              type="button"
              onClick={onLaunchDemo}
              className="h-auto shrink-0"
              faceClassName="px-4 py-2 text-xs font-semibold text-white gap-1.5"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </MovingBorderButton>
          </div>
        </div>
      </div>
    </section>
  );
};
