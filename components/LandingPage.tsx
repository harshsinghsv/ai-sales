'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Headphones,
  ShieldCheck,
  GitMerge,
  BarChart3,
  Clock,
  Users,
  Star,
  TrendingUp,
  Lock,
  Building2,
  Mail,
  User,
  Sparkles,
  Code2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '#why', label: 'Why Claude Enterprise' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#security', label: 'Security' },
];

interface LandingPageProps {
  onStartCall: (info: { name: string; company: string; email: string; seats: number }) => void;
  isConnecting: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartCall, isConnecting }) => {
  const [name, setName] = useState('Tina');
  const [company, setCompany] = useState('Razorpay');
  const [email, setEmail] = useState('gargiesingh321@gmail.com');
  const [seats, setSeats] = useState(50);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedTier = seats <= 20 ? 'Claude Pro & Team' : seats <= 75 ? 'Claude Enterprise Team' : 'Claude Enterprise';
  const baseRate = seats <= 20 ? 20 : seats <= 75 ? 45 : 80;
  const annualRate = seats <= 20 ? 15 : seats <= 75 ? 35 : 65;
  const effectiveSeatPrice = billingCycle === 'annual' ? annualRate : baseRate;
  const totalMonthlyList = seats * effectiveSeatPrice;

  const handleLaunch = () => onStartCall({ name, company, email, seats });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col font-sans relative overflow-hidden selection:bg-[#D97757] selection:text-white">

      {/* Ambient Warm Anthropic Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute top-[-140px] left-1/2 -translate-x-1/2 w-[1050px] h-[550px] bg-gradient-to-b from-[#F5D0C5]/45 via-[#FDEEE9]/30 to-transparent blur-3xl opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
      </div>

      {/* Floating Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`flex items-center justify-between gap-5 w-full max-w-5xl h-16 rounded-full border px-3 pl-5 transition-all duration-350 ${
            isScrolled ? 'bg-white/90 backdrop-blur-xl border-[rgba(20,20,19,0.1)] shadow-sm' : 'bg-transparent border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="size-8 rounded-xl bg-[#D97757] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="size-4 text-white fill-current" aria-hidden="true">
                <path d="M12 2L14.2 8.3L20.5 6L16.5 11.2L22 14.5L15.8 15.8L17.5 22L12 18L6.5 22L8.2 15.8L2 14.5L7.5 11.2L3.5 6L9.8 8.3L12 2Z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-[#141413]">Claude Enterprise</span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-[10px] font-semibold text-[#D97757]">Anthropic</span>
          </div>

          {/* Nav links */}
          <div className={`hidden md:flex items-center gap-1 rounded-full py-[5px] px-1.5 transition-colors duration-350 ${isScrolled ? 'bg-[rgba(20,20,19,0.04)]' : 'bg-[rgba(20,20,19,0.06)]'}`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-1.5 px-4 text-xs font-medium rounded-full text-[rgba(20,20,19,0.65)] hover:text-[#141413] hover:bg-white/80 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="claude"
              size="sm"
              onClick={() => setShowConfigModal(true)}
              disabled={isConnecting}
            >
              <span className="inline-flex items-center gap-2">
                <Headphones className="size-3.5" />
                {isConnecting ? 'Connecting…' : 'Talk to Solutions Lead'}
              </span>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-36 sm:pt-44 pb-20 px-6 relative z-10 max-w-5xl mx-auto text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-xs text-[#D97757] font-semibold shadow-xs">
            <Sparkles className="size-3.5" />
            <span>1M Extended Context</span>
            <span className="text-[rgba(20,20,19,0.25)]">·</span>
            <span>Zero Data Retention</span>
            <span className="text-[rgba(20,20,19,0.25)]">·</span>
            <span className="text-[#141413] font-semibold">Frontier Reasoning on Claude Opus 5</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl tracking-tight text-[#141413] leading-[1.06] max-w-4xl mx-auto">
            The frontier AI workspace for
            <br />
            <span className="italic text-[#D97757]">
              enterprise engineering
            </span>
            <br />
            and mission-critical teams.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[rgba(20,20,19,0.68)] max-w-2xl mx-auto leading-relaxed">
            Claude Enterprise delivers an industry-leading <strong className="text-[#141413] font-semibold">1,000,000-token context window</strong> powered by the flagship Claude Opus 5 model, native GitHub repository integration, zero model training on your data, and collaborative Projects with interactive Artifacts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="claude" size="lg" onClick={() => setShowConfigModal(true)} disabled={isConnecting}>
              <span className="inline-flex items-center gap-2">
                <Headphones className="size-4" />
                {isConnecting ? 'Connecting to Emily…' : 'Consult with Emily (AI Solutions Lead)'}
              </span>
            </Button>
            <Button variant="outline" size="lg" href="#why">
              Compare with ChatGPT Enterprise
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[rgba(20,20,19,0.48)]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {['J','P','A','G','B'].map((l, i) => (
                  <div key={i} className="size-6 rounded-full bg-[#FAF0EC] border border-white flex items-center justify-center text-[9px] font-bold text-[#D97757]">{l}</div>
                ))}
              </div>
              <span>Trusted by leaders at <strong className="text-[#141413]">Jane Street, Pfizer, Asana & GitLab</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="size-3 text-[#D97757] fill-[#D97757]" />)}
              <span><strong className="text-[#141413]">#1 Frontier Coding</strong> (SWE-bench Verified)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#2f7a1d]" />
              <span>SOC-2 Type II · HIPAA BAA · ISO 27001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Claude Enterprise vs Generic AI */}
      <section id="why" className="py-20 px-6 relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D97757]">Architectural Advantage</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight mt-2">
            Why leading tech enterprises switch to Claude Enterprise
          </h2>
          <p className="text-sm text-[rgba(20,20,19,0.62)] mt-2 max-w-xl mx-auto">
            Traditional AI chatbots cut off your context and risk training on your intellectual property.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ChatGPT Enterprise / Generic AI */}
          <div className="rounded-2xl bg-[#FDF2F0] border border-[#f4889a]/30 p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-9 rounded-xl bg-white border border-[#f4889a]/30 flex items-center justify-center">
                <span className="text-[#c74a62] font-bold text-sm">GPT</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141413]">Generic AI & ChatGPT Enterprise</h3>
                <p className="text-xs text-[rgba(20,20,19,0.42)]">Context ceilings & fragmented codebases</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "128k context ceiling forces manual copy-pasting of small snippets",
                "Lacks deep multi-repo GitHub understanding across architectural boundaries",
                "Hallucinates APIs when unable to see full dependency graphs",
                "Fragmented user workspaces without collaborative codebase memory",
                "Prompts and outputs require constant re-prompting and manual stitching",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#141413]/80">
                  <div className="size-4 rounded-full bg-white border border-[#f4889a]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#c74a62] text-[9px]">✕</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Claude Enterprise */}
          <div className="rounded-2xl bg-[#FAF0EC] border border-[#D97757]/30 p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-9 rounded-xl bg-[#D97757] flex items-center justify-center shadow-md shadow-[#D97757]/20">
                <svg viewBox="0 0 24 24" className="size-4 text-white fill-current" aria-hidden="true">
                  <path d="M12 2L14.2 8.3L20.5 6L16.5 11.2L22 14.5L15.8 15.8L17.5 22L12 18L6.5 22L8.2 15.8L2 14.5L7.5 11.2L3.5 6L9.8 8.3L12 2Z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#141413]">With Claude Enterprise</h3>
                <p className="text-xs text-[rgba(20,20,19,0.5)]">1M context, Claude Opus 5, native GitHub, zero training</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "1,000,000-token context window — ingest hundreds of files or entire codebases in one turn",
                "Native GitHub integration syncs private repos for architecture reviews & PR automation",
                "Contractual guarantee: zero customer data retention for model training",
                "Interactive Artifacts with real-time code rendering, diagrams, and live execution",
                "Claude Opus 5 delivers unmatched frontier reasoning, thinking capabilities, and SWE-bench coding accuracy",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#141413]/85">
                  <div className="size-4 rounded-full bg-white border border-[#D97757]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="size-2.5 text-[#D97757]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI Callout */}
        <div className="mt-6 p-5 rounded-2xl bg-white border border-[rgba(20,20,19,0.08)] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-[#FAF0EC] border border-[#D97757]/20 flex items-center justify-center">
              <TrendingUp className="size-5 text-[#D97757]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#141413]">Verified Enterprise Engineering ROI</p>
              <p className="text-xs text-[rgba(20,20,19,0.6)] mt-0.5">Based on a 100-developer enterprise deployment over 12 months</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            {[
              { val: '3.8 hrs', label: 'Saved per dev / week', color: 'text-[#D97757]' },
              { val: '4.1x', label: 'Faster codebase onboarding', color: 'text-[#2f7a1d]' },
              { val: '0%', label: 'Customer data trained', color: 'text-[#141413]' },
            ].map(m => (
              <div key={m.label}>
                <div className={`text-2xl font-extrabold ${m.color}`}>{m.val}</div>
                <div className="text-[10px] text-[rgba(20,20,19,0.45)]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="capabilities" className="py-20 px-6 relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#D97757]">Capabilities</span>
          <h2 className="font-serif text-3xl text-[#141413] tracking-tight mt-2">
            Engineered for high-trust enterprise workloads
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-2xl bg-white border border-[rgba(20,20,19,0.08)] shadow-sm p-7 hover:border-[rgba(20,20,19,0.16)] transition-all">
            <div className="size-9 rounded-xl bg-[#FAF0EC] border border-[#D97757]/20 flex items-center justify-center">
              <GitMerge className="size-4 text-[#D97757]" />
            </div>
            <h3 className="text-lg font-bold text-[#141413] mt-4">Native GitHub & GitLab Multi-Repo Integration</h3>
            <p className="text-xs text-[rgba(20,20,19,0.62)] mt-1 max-w-lg leading-relaxed">
              Connect your private repositories directly to Claude. Conduct comprehensive architectural audits, automated pull request reviews, and security vulnerability scans.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,19,0.06)] font-mono text-[11px] space-y-2">
              <div className="flex items-center gap-2 text-[rgba(20,20,19,0.45)]"><span className="text-[#D97757]">▶</span> Ingesting repository: &quot;org/core-settlement-engine&quot; (840 files, 720k tokens)</div>
              <div className="flex items-center gap-2 text-[#2f7a1d]"><span>✓</span> Cross-repo call graph verified · Zero hallucinated imports</div>
              <div className="flex items-center gap-2 text-[#b3661d]"><span>✓</span> Automated PR draft generated with full test coverage</div>
              <div className="flex items-center gap-2 text-[rgba(20,20,19,0.4)] text-[10px]"><Clock className="size-3" /> 2.1 seconds elapsed. SOC-2 audit log recorded.</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[rgba(20,20,19,0.08)] shadow-sm p-7 hover:border-[rgba(20,20,19,0.16)] transition-all">
            <div className="size-9 rounded-xl bg-[#FAF0EC] border border-[#D97757]/20 flex items-center justify-center">
              <Layers className="size-4 text-[#D97757]" />
            </div>
            <h3 className="text-lg font-bold text-[#141413] mt-4">Projects & Interactive Artifacts</h3>
            <p className="text-xs text-[rgba(20,20,19,0.62)] mt-1 leading-relaxed">
              Shared team workspaces with custom prompt instructions, shared document libraries, and dynamic code execution.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { label: '1M Context Window Utilization', val: 1000, max: 1000, color: 'bg-[#D97757]' },
                { label: 'SWE-bench Benchmark Score (Opus 5)', val: 88, max: 100, color: 'bg-[#2f7a1d]' },
                { label: 'Model Uptime SLA', val: 99.99, color: 'bg-[#b3661d]' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] text-[rgba(20,20,19,0.45)] mb-1">
                    <span>{m.label}</span>
                    <span className="text-[#141413]/80 font-mono">{m.val}{m.max ? `${m.val === 1000 ? 'K' : '%'}` : '%'}</span>
                  </div>
                  <div className="h-1.5 bg-[rgba(20,20,19,0.06)] rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.max ? (m.val / m.max) * 100 : m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="security" className="rounded-2xl bg-white border border-[rgba(20,20,19,0.08)] shadow-sm p-7 hover:border-[rgba(20,20,19,0.16)] transition-all">
            <div className="size-9 rounded-xl bg-[#e4f6df] border border-[#79d45e]/40 flex items-center justify-center">
              <ShieldCheck className="size-4 text-[#2f7a1d]" />
            </div>
            <h3 className="text-lg font-bold text-[#141413] mt-4">Zero-Data Retention & Privacy</h3>
            <p className="text-xs text-[rgba(20,20,19,0.62)] mt-1 leading-relaxed">Anthropic guarantees zero model training on customer inputs or proprietary codebases.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['SOC-2 Type II', 'ISO 27001', 'HIPAA BAA', 'Okta SSO', 'SCIM Sync', 'Audit Logging'].map(b => (
                <span key={b} className="px-2 py-1 rounded-lg bg-[#e4f6df] border border-[#79d45e]/30 text-[10px] font-semibold text-[#2f7a1d]">{b}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl bg-white border border-[rgba(20,20,19,0.08)] shadow-sm p-7 hover:border-[rgba(20,20,19,0.16)] transition-all">
            <div className="size-9 rounded-xl bg-[#ffefda] border border-[#ffaf68]/40 flex items-center justify-center">
              <Users className="size-4 text-[#b3661d]" />
            </div>
            <h3 className="text-lg font-bold text-[#141413] mt-4">Enterprise White-Glove Onboarding & Migration</h3>
            <p className="text-xs text-[rgba(20,20,19,0.62)] mt-1 max-w-lg leading-relaxed">
              Dedicated Anthropic Solutions Architects assist your engineering leadership with custom prompt architectures, GitHub directory mapping, and SSO rollout.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { step: '1', label: 'Directory Sync', desc: 'Okta / Azure AD SCIM', color: 'text-[#b3661d]' },
                { step: '2', label: 'GitHub Ingest', desc: 'Full codebase indexing', color: 'text-[#D97757]' },
                { step: '3', label: 'Team Rollout', desc: 'Assisted prompt training', color: 'text-[#2f7a1d]' },
              ].map(s => (
                <div key={s.step} className="p-3 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,19,0.06)] text-center">
                  <div className={`text-lg font-extrabold ${s.color}`}>{s.step}</div>
                  <div className="text-xs font-semibold text-[#141413] mt-1">{s.label}</div>
                  <div className="text-[10px] text-[rgba(20,20,19,0.45)] mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-[rgba(20,20,19,0.08)] bg-white relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D97757]">Pricing Tiers</span>
            <h2 className="font-serif text-3xl text-[#141413] tracking-tight mt-2">Transparent enterprise volume pricing</h2>
            <p className="text-sm text-[rgba(20,20,19,0.62)] mt-1">Consult and negotiate tailored agreement terms with Emily, our AI Solutions Lead.</p>

            <div className="mt-6 inline-flex items-center p-1 rounded-full bg-[rgba(20,20,19,0.05)]">
              {(['monthly', 'annual'] as const).map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === cycle
                      ? 'bg-white text-[#141413] font-semibold shadow-xs'
                      : 'text-[rgba(20,20,19,0.6)] hover:text-[#141413]'
                  }`}
                >
                  {cycle === 'annual' ? 'Annual Commitment' : 'Monthly Flexible'}
                  {cycle === 'annual' && <span className="text-[10px] px-1.5 rounded-full bg-[#FAF0EC] text-[#D97757] font-semibold">Save ~20%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-2xl bg-[#FAF9F5] border border-[rgba(20,20,19,0.1)] shadow-xs p-6 flex flex-col hover:border-[rgba(20,20,19,0.2)] transition-all">
              <div className="flex-1">
                <span className="text-xs font-semibold text-[rgba(20,20,19,0.6)] uppercase tracking-wider">Claude Pro & Team</span>
                <p className="text-xs text-[rgba(20,20,19,0.45)] mt-1">Agile squads of 5–20 members</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#141413]">${billingCycle === 'annual' ? '15' : '20'}</span>
                  <span className="text-xs text-[rgba(20,20,19,0.45)]">/seat/mo</span>
                </div>
                <div className="mt-6 space-y-2.5 text-xs text-[#141413]/80">
                  {['Claude Sonnet 5 access', 'Standard context window & Artifacts', 'Shared team project workspaces', 'Standard email support'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[rgba(20,20,19,0.45)] flex-shrink-0" />{f}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[rgba(20,20,19,0.45)] text-[11px]"><Lock className="size-3 flex-shrink-0" />Concession floor: 5%</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-8 w-full justify-center" onClick={() => { setSeats(15); setShowConfigModal(true); }}>
                Talk to Sales
              </Button>
            </div>

            {/* Pro / Enterprise Team */}
            <div className="rounded-2xl bg-white border-2 border-[#D97757] p-6 flex flex-col relative shadow-md transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#D97757] text-white text-[10px] font-bold tracking-wider">MOST POPULAR</div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-[#D97757] uppercase tracking-wider">Claude Enterprise Team</span>
                <p className="text-xs text-[rgba(20,20,19,0.45)] mt-1">Growing organizations of 15–100 seats</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#141413]">${billingCycle === 'annual' ? '35' : '45'}</span>
                  <span className="text-xs text-[rgba(20,20,19,0.45)]">/seat/mo</span>
                </div>
                <div className="mt-6 space-y-2.5 text-xs text-[#141413]/85">
                  {['Claude Opus 5 access (standard quota)', '500K+ token context window', 'Native GitHub repo sync & PR review', 'Enterprise Projects & custom instructions', 'Priority latency & 99.9% SLA'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[#D97757] flex-shrink-0" />{f}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[rgba(20,20,19,0.55)] text-[11px]"><Lock className="size-3 text-[#D97757] flex-shrink-0" />Concession floor: 15%</div>
                </div>
              </div>
              <Button variant="claude" size="sm" className="mt-8 w-full justify-center" onClick={() => { setSeats(50); setShowConfigModal(true); }}>
                Negotiate with Emily
              </Button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl bg-[#FAF9F5] border border-[rgba(20,20,19,0.1)] shadow-xs p-6 flex flex-col hover:border-[rgba(20,20,19,0.2)] transition-all">
              <div className="flex-1">
                <span className="text-xs font-semibold text-[rgba(20,20,19,0.6)] uppercase tracking-wider">Claude Enterprise</span>
                <p className="text-xs text-[rgba(20,20,19,0.45)] mt-1">Strategic deployments for 50+ seats</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#141413]">${billingCycle === 'annual' ? '65' : '80'}</span>
                  <span className="text-xs text-[rgba(20,20,19,0.45)]">/seat/mo</span>
                </div>
                <div className="mt-6 space-y-2.5 text-xs text-[#141413]/80">
                  {['Flagship Claude Opus 5 with native deep reasoning', 'Expanded 1,000,000-token (1M) context window', 'Zero customer data model training guarantee', 'Enterprise SSO (Okta/Azure AD) & SCIM', 'SOC-2 Type II, HIPAA BAA & audit logging', 'Dedicated Anthropic Solutions Architect'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[rgba(20,20,19,0.45)] flex-shrink-0" />{f}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[rgba(20,20,19,0.45)] text-[11px]"><Lock className="size-3 flex-shrink-0" />Concession floor: 25%</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-8 w-full justify-center" onClick={() => { setSeats(100); setShowConfigModal(true); }}>
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Hackathon Demo Note */}
          <div className="mt-8 p-4 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,19,0.08)] shadow-xs flex items-start gap-3">
            <div className="size-2 rounded-full bg-[#D97757] animate-softpulse flex-shrink-0 mt-1" />
            <p className="text-[11px] text-[rgba(20,20,19,0.62)] leading-relaxed">
              <span className="text-[#D97757] font-semibold">Demo Note (EchoSphere Hackathon):</span>{' '}
              The &quot;Talk to Sales&quot; and &quot;Negotiate with Emily&quot; buttons connect you to a live AI voice agent powered by{' '}
              <span className="text-[#141413] font-medium">Agora Conversational AI Engine + MCP tool calling</span>. Emily acts as Anthropic&apos;s AI Enterprise Solutions Lead — presenting Claude Opus 5, qualifying team size, addressing ChatGPT objections, negotiating volume terms with a strict margin floor, and syncing qualified leads to HubSpot CRM in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Customers Section */}
      <section className="py-16 px-6 relative z-10 border-t border-[rgba(20,20,19,0.08)] bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[rgba(20,20,19,0.45)] uppercase tracking-wider mb-8 font-semibold">Empowering frontier engineering organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['Jane Street', 'Pfizer', 'Bridgewater', 'GitLab', 'Asana', 'Razorpay', 'BrowserStack', 'Postman'].map(co => (
              <span key={co} className="text-sm font-bold text-[rgba(20,20,19,0.35)] hover:text-[rgba(20,20,19,0.7)] transition-colors">{co}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 relative z-10 border-t border-[rgba(20,20,19,0.08)] bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#141413] tracking-tight">
            Ready to deploy 1M context intelligence across your org?
          </h2>
          <p className="mt-4 text-sm text-[rgba(20,20,19,0.62)]">
            Consult with Emily — our AI Solutions Lead — and build a tailored volume quote for your organization in under 5 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button variant="claude" size="lg" onClick={() => setShowConfigModal(true)} disabled={isConnecting}>
              <span className="inline-flex items-center gap-2">
                <Headphones className="size-4" />
                Talk to Emily — Build Your Quote
              </span>
            </Button>
          </div>
          <p className="mt-4 text-xs text-[rgba(20,20,19,0.4)]">
            Real-time Agora RTC voice · Bilingual English & Hindi · Instant HubSpot CRM & Calendar sync
          </p>
        </div>
      </section>

      {/* Consultation Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(20,20,19,0.5)] backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[rgba(20,20,19,0.1)] p-7 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(20,20,19,0.08)]">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-[#D97757] flex items-center justify-center shadow-sm">
                  <Headphones className="size-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#141413]">Consult with Emily — Claude Enterprise</h3>
                  <p className="text-[11px] text-[rgba(20,20,19,0.5)]">AI Solutions Lead · Agora Convo AI · Bilingual</p>
                </div>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-[rgba(20,20,19,0.4)] hover:text-[#141413] p-1 text-sm cursor-pointer">✕</button>
            </div>

            <p className="mt-4 text-xs text-[rgba(20,20,19,0.65)] leading-relaxed">
              You&apos;ll be connected to <strong className="text-[#141413]">Emily</strong>, Anthropic&apos;s AI Enterprise Solutions Lead.
              She&apos;ll evaluate your team size, address context and security questions, calculate tier pricing, and negotiate volume agreements with real-time MCP tool calling.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#141413]/80 mb-1.5">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 size-4 text-[rgba(20,20,19,0.4)]" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[rgba(20,20,19,0.14)] text-xs text-[#141413] placeholder:text-[rgba(20,20,19,0.35)] focus:outline-none focus:border-[#D97757]"
                    placeholder="e.g. Geeta" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#141413]/80 mb-1.5">Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 size-4 text-[rgba(20,20,19,0.4)]" />
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[rgba(20,20,19,0.14)] text-xs text-[#141413] placeholder:text-[rgba(20,20,19,0.35)] focus:outline-none focus:border-[#D97757]"
                    placeholder="e.g. Razorpay" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#141413]/80 mb-1.5">Work Email <span className="text-[rgba(20,20,19,0.4)]">(HubSpot CRM Sync)</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-[rgba(20,20,19,0.4)]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[rgba(20,20,19,0.14)] text-xs text-[#141413] placeholder:text-[rgba(20,20,19,0.35)] focus:outline-none focus:border-[#D97757]"
                    placeholder="e.g. rahul@razorpay.com" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[rgba(20,20,19,0.08)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#141413]/80">Estimated Seats</span>
                  <span className="text-xs font-bold text-[#D97757] px-2 py-0.5 rounded bg-[#FAF0EC] border border-[#D97757]/30">
                    {seats} seats · {selectedTier}
                  </span>
                </div>
                <input type="range" min="5" max="150" step="5" value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full h-1.5 bg-[rgba(20,20,19,0.1)] rounded-lg appearance-none cursor-pointer accent-[#D97757]" />
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#141413]/70">
                  <span>List: ${effectiveSeatPrice}/seat/mo</span>
                  <span className="text-[#141413] font-bold">${totalMonthlyList.toLocaleString()}/month</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[rgba(20,20,19,0.08)]">
              <Button variant="ghost" size="sm" arrow={false} onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button variant="claude" size="sm" onClick={handleLaunch} disabled={isConnecting}>
                <span className="inline-flex items-center gap-2">
                  <Headphones className="size-3.5" />
                  {isConnecting ? 'Connecting to Emily…' : 'Start Voice Consultation'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[rgba(20,20,19,0.08)] bg-[#FAF9F5] text-center text-xs text-[rgba(20,20,19,0.45)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-lg bg-[#D97757] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="size-3 text-white fill-current" aria-hidden="true">
                <path d="M12 2L14.2 8.3L20.5 6L16.5 11.2L22 14.5L15.8 15.8L17.5 22L12 18L6.5 22L8.2 15.8L2 14.5L7.5 11.2L3.5 6L9.8 8.3L12 2Z" />
              </svg>
            </div>
            <span className="font-semibold text-[rgba(20,20,19,0.65)]">Claude Enterprise</span>
            <span className="text-[rgba(20,20,19,0.25)]">·</span>
            <span>EchoSphere Hackathon</span>
          </div>
          <div className="flex items-center gap-3 text-[rgba(20,20,19,0.4)]">
            <span>Agora Convo AI</span><span>·</span><span>Agora MCP</span><span>·</span><span>HubSpot v3</span><span>·</span><span>Google Calendar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
