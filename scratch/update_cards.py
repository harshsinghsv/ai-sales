with open('components/AgentPlatformLanding.tsx', 'r', encoding='utf-8') as f:
    landing = f.read()

# Add imports for Card and Badge
old_import = "import { RainbowButton } from '@/components/ui/rainbow-button';"
new_import = """import { RainbowButton } from '@/components/ui/rainbow-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-2';"""

assert old_import in landing, "old_import not found in landing"
landing = landing.replace(old_import, new_import, 1)

# Target the 4 Moats in capabilities section:
old_capabilities = """          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#D97757] font-semibold mb-1">
                  &lt;500ms Turnaround
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Sub-500ms Voice RTC
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Agora SD-RTN edge routing, Deepgram Nova-3 Multi, and MiniMax 2.8 Turbo in a unified cloud pipeline.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Agora SD-RTN Edge</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold mb-1">
                  Margin Defense
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  18% Floor Guard
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Strict algorithmic boundary that prevents excessive discounting and requires multi-year reciprocal terms.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Policy Enforced</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Workflow className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold mb-1">
                  Autonomous Stack
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Tri-Channel Sync
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Autonomous tool execution across HubSpot CRM deals, Google Calendar appointments, and Slack rooms.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>HubSpot · GCal · Slack</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold mb-1">
                  Bilingual Acoustic
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Code-Switching
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Native English and Hindi (Hinglish) code-switching for multinational enterprise buyers and procurement.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Deepgram Nova-3 Multi</span>
              </div>
            </div>
          </div>"""

new_capabilities = """          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      Sub-500ms Voice RTC
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#D97757] font-semibold">
                      Turn Latency
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Agora SD-RTN edge routing, Deepgram Nova-3 Multi, and MiniMax 2.8 Turbo in a unified cloud pipeline.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Routing</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Agora SD-RTN
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      18% Floor Guard
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-semibold">
                      Margin Defense
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Strict algorithmic boundary that prevents excessive discounting and requires multi-year reciprocal terms.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Enforcement</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Policy Guardrail
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      Tri-Channel Sync
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                      Autonomous Stack
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Autonomous tool execution across HubSpot CRM deals, Google Calendar appointments, and Slack rooms.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Integrations</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    HubSpot · GCal
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="bg-white border border-[#E8E6DC] shadow-xs hover:border-[#D97757]/40 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="border-0 px-5 pt-5 pb-3 min-h-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-[#141413]">
                      Code-Switching
                    </CardTitle>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold">
                      Bilingual Acoustic
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-0 space-y-3.5">
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Native English and Hindi (Hinglish) code-switching for multinational enterprise buyers and procurement.
                </p>
                <div className="p-2.5 bg-muted/60 flex items-center justify-between rounded-lg text-xs font-mono">
                  <span className="text-[#8C8984]">Model</span>
                  <span className="font-semibold text-[#141413] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    Nova-3 Multi
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>"""

assert old_capabilities in landing, "old_capabilities not found in landing"
landing = landing.replace(old_capabilities, new_capabilities, 1)

with open('components/AgentPlatformLanding.tsx', 'w', encoding='utf-8') as f:
    f.write(landing)

print("AgentPlatformLanding updated successfully with Card components!")
