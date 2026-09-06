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
} from 'lucide-react';
import Button from '@/components/ui/Button';

const NAV_LINKS = [
  { href: '#why', label: 'Why TeamSync' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#customers', label: 'Customers' },
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

  const selectedTier = seats <= 15 ? 'Starter' : seats <= 75 ? 'Pro' : 'Enterprise';
  const baseRate = selectedTier === 'Starter' ? 15 : selectedTier === 'Pro' ? 35 : 65;
  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1.0;
  const effectiveSeatPrice = Math.round(baseRate * discountMultiplier);
  const totalMonthlyList = seats * effectiveSeatPrice;

  const handleLaunch = () => onStartCall({ name, company, email, seats });

  return (
    <div className="min-h-screen bg-white text-[#1b1d1e] flex flex-col font-sans relative overflow-hidden">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[520px] bg-gradient-to-b from-[#eeeafe] via-[#e2f0ff] to-transparent blur-3xl opacity-90" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      {/* Floating Nav — transparent over hero, becomes a bordered white pill on scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`flex items-center justify-between gap-5 w-full max-w-5xl h-16 rounded-pill border px-3 pl-5 transition-all duration-350 ${
            isScrolled ? 'bg-white/90 backdrop-blur-xl border-border' : 'bg-transparent border-transparent'
          }`}
        >
          <div className="flex items-center gap-3 shrink-0">
            <div className="size-8 rounded-xl bg-violet flex items-center justify-center">
              <GitMerge className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-ink">TeamSync</span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-pill bg-violetbg text-[10px] font-semibold text-violet">v3.0</span>
          </div>

          {/* Nav links pill — reference: ink-8% pill, active/hover states inside */}
          <div className={`hidden md:flex items-center gap-1 rounded-pill py-[5px] px-1.5 transition-colors duration-350 ${isScrolled ? 'bg-soft' : 'bg-[rgba(27,29,30,0.08)]'}`}>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 px-[18px] text-sm font-medium rounded-pill text-secondary hover:text-ink hover:bg-white/70 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center">
            <Button variant="violet" size="sm" onClick={() => setShowConfigModal(true)} disabled={isConnecting}>
              Talk to Sales
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 relative z-10 flex flex-col items-center text-center">
        <div className="max-w-5xl mx-auto flex flex-col items-center">

          {/* Competitor pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(27,29,30,0.1)] shadow-sm text-xs text-[rgba(27,29,30,0.62)] mb-8">
            <span className="text-[rgba(27,29,30,0.42)]">Replacing</span>
            <span className="font-semibold text-[#1b1d1e] line-through decoration-[#f4889a]">Jira</span>
            <span className="text-[rgba(27,29,30,0.3)]">+</span>
            <span className="font-semibold text-[#1b1d1e] line-through decoration-[#f4889a]">Asana</span>
            <span className="text-[rgba(27,29,30,0.3)]">·</span>
            <span className="text-[#2f7a1d] font-semibold">4x faster sprint delivery</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl tracking-tight text-[#1b1d1e] leading-[1.05] max-w-4xl">
            Your engineering team
            <br />
            <span className="italic text-[#4928fd]">
              should write code,
            </span>
            <br />
            not update tickets.
          </h1>

          <p className="mt-7 text-base sm:text-lg text-[rgba(27,29,30,0.62)] max-w-2xl mx-auto leading-relaxed">
            TeamSync automatically syncs every sprint, PR, and deployment from GitHub — zero manual ticket updates.
            Engineering teams save <strong className="text-[#1b1d1e] font-semibold">4 hours per developer per week</strong> that Jira was wasting on admin.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="violet" size="lg" onClick={() => setShowConfigModal(true)} disabled={isConnecting}>
              <span className="inline-flex items-center gap-2">
                <Headphones className="size-4" />
                {isConnecting ? 'Connecting to Sales...' : 'Talk to Sales — Get a Quote'}
              </span>
            </Button>
            <Button variant="outline" size="lg" href="#why">
              See how it works
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[rgba(27,29,30,0.42)]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {['R','P','S','A','V'].map((l, i) => (
                  <div key={i} className="size-6 rounded-full bg-[#eeeafe] border border-white flex items-center justify-center text-[9px] font-bold text-[#4928fd]">{l}</div>
                ))}
              </div>
              <span>Trusted by <strong className="text-[#1b1d1e]">500+</strong> engineering orgs</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => <Star key={i} className="size-3 text-[#ffaf68] fill-[#ffaf68]" />)}
              <span><strong className="text-[#1b1d1e]">4.9/5</strong> on G2 (312 reviews)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#2f7a1d]" />
              <span>SOC-2 Type II · ISO 27001 · AWS Mumbai</span>
            </div>
          </div>
        </div>
      </section>

      {/* Why TeamSync vs Jira */}
      <section id="why" className="py-20 px-6 relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4928fd]">The Real Problem</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1b1d1e] tracking-tight mt-2">
            Why 500+ engineering orgs switched from Jira
          </h2>
          <p className="text-sm text-[rgba(27,29,30,0.62)] mt-2 max-w-xl mx-auto">
            Jira was built for a world before GitHub pull requests existed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jira */}
          <div className="rounded-2xl bg-[#fde7eb] border border-[#f4889a]/30 p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-9 rounded-xl bg-white border border-[#f4889a]/30 flex items-center justify-center">
                <span className="text-[#c74a62] font-bold text-sm">J</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1d1e]">With Jira</h3>
                <p className="text-xs text-[rgba(27,29,30,0.42)]">Manual, slow, painful</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "Developer commits code → manually updates ticket status",
                "Sprint reviews take 45min reconciling Jira with GitHub",
                "4 hrs/dev/week lost to admin — ₹8L/yr per 10-person team",
                "Ticket rot: 30% of issues stale or wrong within 2 weeks",
                "New engineer onboarding: 2 weeks just to understand workflows",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#1b1d1e]/80">
                  <div className="size-4 rounded-full bg-white border border-[#f4889a]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#c74a62] text-[9px]">✕</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* TeamSync */}
          <div className="rounded-2xl bg-[#e4f6df] border border-[#79d45e]/40 p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-9 rounded-xl bg-[#4928fd] flex items-center justify-center shadow-md shadow-[#4928fd]/20">
                <GitMerge className="size-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1b1d1e]">With TeamSync</h3>
                <p className="text-xs text-[rgba(27,29,30,0.42)]">Automatic, fast, zero admin</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                "PR merged → sprint board updates in real-time. Automatically.",
                "Sprint reviews are 8 minutes — everything already in sync",
                "Developers spend zero time on ticket updates, 100% on code",
                "Live GitHub bi-directional sync keeps every story accurate",
                "New engineer productive in 2 days — workflow auto-mapped",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#1b1d1e]/80">
                  <div className="size-4 rounded-full bg-white border border-[#79d45e]/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="size-2.5 text-[#2f7a1d]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI callout */}
        <div className="mt-6 p-5 rounded-2xl bg-[#eeeafe] border border-[#4928fd]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-white border border-[#4928fd]/20 flex items-center justify-center">
              <TrendingUp className="size-5 text-[#4928fd]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#1b1d1e]">Average ROI after switching to TeamSync Pro</p>
              <p className="text-xs text-[rgba(27,29,30,0.62)] mt-0.5">Based on 50-seat engineering org, 12 months</p>
            </div>
          </div>
          <div className="flex gap-6 text-center">
            {[
              { val: '₹48L', label: 'Dev time saved', color: 'text-[#4928fd]' },
              { val: '4.2x', label: 'Faster delivery', color: 'text-[#2f7a1d]' },
              { val: '89%', label: 'Less meetings', color: 'text-[#b3661d]' },
            ].map(m => (
              <div key={m.label}>
                <div className={`text-2xl font-extrabold ${m.color}`}>{m.val}</div>
                <div className="text-[10px] text-[rgba(27,29,30,0.42)]">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 relative z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4928fd]">Platform Features</span>
          <h2 className="font-serif text-3xl text-[#1b1d1e] tracking-tight mt-2">
            Built for how engineering teams actually work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm p-7 hover:border-[rgba(27,29,30,0.18)] hover:shadow-md transition-all">
            <div className="size-9 rounded-xl bg-[#eeeafe] border border-[#4928fd]/20 flex items-center justify-center">
              <GitMerge className="size-4 text-[#4928fd]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b1d1e] mt-4">Automated GitHub ↔ Sprint Sync</h3>
            <p className="text-xs text-[rgba(27,29,30,0.62)] mt-1 max-w-lg leading-relaxed">
              When a developer merges a PR, the linked sprint story moves to Done — automatically. No Zapier, no webhooks, no configuration.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-[rgba(27,29,30,0.03)] border border-[rgba(27,29,30,0.06)] font-mono text-[11px] space-y-2">
              <div className="flex items-center gap-2 text-[rgba(27,29,30,0.42)]"><span className="text-[#4928fd]">▶</span> PR #487 merged: &quot;feat: payment gateway v2&quot;</div>
              <div className="flex items-center gap-2 text-[#2f7a1d]"><span>✓</span> Story TS-234 → <span className="text-[#1b1d1e] font-semibold">Done</span> · Sprint velocity +1</div>
              <div className="flex items-center gap-2 text-[#1d6fb3]"><span>✓</span> Deployment tagged · Stakeholder Slack notified</div>
              <div className="flex items-center gap-2 text-[rgba(27,29,30,0.42)] text-[10px]"><Clock className="size-3" /> 0.3 seconds. Zero manual steps.</div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm p-7 hover:border-[rgba(27,29,30,0.18)] hover:shadow-md transition-all">
            <div className="size-9 rounded-xl bg-[#f1e6fb] border border-[#ba81ee]/30 flex items-center justify-center">
              <BarChart3 className="size-4 text-[#6b3fa8]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b1d1e] mt-4">Sprint Velocity Dashboard</h3>
            <p className="text-xs text-[rgba(27,29,30,0.62)] mt-1 leading-relaxed">
              Burn-down charts that update as PRs merge — not as engineers remember to click.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { label: 'Sprint Completion', val: 87, color: 'bg-[#4928fd]' },
                { label: 'PRs Merged', val: 23, max: 28, color: 'bg-[#79d45e]' },
                { label: 'Velocity (pts)', val: 72, max: 80, color: 'bg-[#ba81ee]' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] text-[rgba(27,29,30,0.42)] mb-1">
                    <span>{m.label}</span>
                    <span className="text-[#1b1d1e]/80">{m.val}{m.max ? `/${m.max}` : '%'}</span>
                  </div>
                  <div className="h-1.5 bg-[rgba(27,29,30,0.06)] rounded-full overflow-hidden">
                    <div className={`h-full ${m.color} rounded-full transition-all`} style={{ width: `${m.max ? (m.val / m.max) * 100 : m.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm p-7 hover:border-[rgba(27,29,30,0.18)] hover:shadow-md transition-all">
            <div className="size-9 rounded-xl bg-[#e4f6df] border border-[#79d45e]/40 flex items-center justify-center">
              <ShieldCheck className="size-4 text-[#2f7a1d]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b1d1e] mt-4">Enterprise Security</h3>
            <p className="text-xs text-[rgba(27,29,30,0.62)] mt-1 leading-relaxed">SOC-2 Type II. Okta SSO. AWS Mumbai (ap-south-1) — full Indian data residency.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['SOC-2 Type II', 'ISO 27001', 'Okta SSO', 'SCIM', 'AWS Mumbai', 'GDPR'].map(b => (
                <span key={b} className="px-2 py-1 rounded-lg bg-[#e4f6df] border border-[#79d45e]/30 text-[10px] font-semibold text-[#2f7a1d]">{b}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm p-7 hover:border-[rgba(27,29,30,0.18)] hover:shadow-md transition-all">
            <div className="size-9 rounded-xl bg-[#ffefda] border border-[#ffaf68]/40 flex items-center justify-center">
              <Users className="size-4 text-[#b3661d]" />
            </div>
            <h3 className="text-lg font-bold text-[#1b1d1e] mt-4">Jira Migration in 48 Hours</h3>
            <p className="text-xs text-[rgba(27,29,30,0.62)] mt-1 max-w-lg leading-relaxed">
              Our automated importer migrates your full issue history, labels, sprints, and epics. Your team picks up exactly where they left off.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { step: '1', label: 'Connect Jira', desc: 'OAuth in 30s', color: 'text-[#b3661d]' },
                { step: '2', label: 'Auto Import', desc: 'All history preserved', color: 'text-[#4928fd]' },
                { step: '3', label: 'Go Live', desc: 'Within 48 hours', color: 'text-[#2f7a1d]' },
              ].map(s => (
                <div key={s.step} className="p-3 rounded-xl bg-[rgba(27,29,30,0.03)] border border-[rgba(27,29,30,0.06)] text-center">
                  <div className={`text-lg font-extrabold ${s.color}`}>{s.step}</div>
                  <div className="text-xs font-semibold text-[#1b1d1e] mt-1">{s.label}</div>
                  <div className="text-[10px] text-[rgba(27,29,30,0.42)] mt-0.5">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-[rgba(27,29,30,0.08)] bg-[rgba(27,29,30,0.02)] relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4928fd]">Pricing</span>
            <h2 className="font-serif text-3xl text-[#1b1d1e] tracking-tight mt-2">Simple per-seat pricing. No surprises.</h2>
            <p className="text-sm text-[rgba(27,29,30,0.62)] mt-1">Negotiate your package with our AI sales agent, or talk to a human specialist.</p>

            <div className="mt-6 inline-flex items-center p-1 rounded-full bg-soft">
              {(['monthly', 'annual'] as const).map(cycle => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    billingCycle === cycle
                      ? 'bg-white text-ink font-semibold'
                      : 'text-[rgba(27,29,30,0.62)] hover:text-[#1b1d1e]'
                  }`}
                >
                  {cycle === 'annual' ? 'Annual' : 'Monthly'}
                  {cycle === 'annual' && <span className="text-[10px] px-1.5 rounded-full bg-[#e4f6df] text-[#2f7a1d] font-semibold">Save 20%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm p-6 flex flex-col hover:border-[rgba(27,29,30,0.18)] transition-all">
              <div className="flex-1">
                <span className="text-xs font-semibold text-[rgba(27,29,30,0.62)] uppercase tracking-wider">Starter</span>
                <p className="text-xs text-[rgba(27,29,30,0.42)] mt-1">Agile squads of 5–15 devs</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#1b1d1e]">${billingCycle === 'annual' ? '12' : '15'}</span>
                  <span className="text-xs text-[rgba(27,29,30,0.42)]">/seat/mo</span>
                </div>
                <div className="mt-6 space-y-2.5 text-xs text-[#1b1d1e]/80">
                  {['Unlimited tasks & boards', 'GitHub 1-way commit sync', 'Sprint velocity dashboard', 'Standard support (48h SLA)'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[rgba(27,29,30,0.42)] flex-shrink-0" />{f}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[rgba(27,29,30,0.42)] text-[11px]"><Lock className="size-3 flex-shrink-0" />Concession floor: 5%</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-8 w-full justify-center" onClick={() => { setSeats(10); setShowConfigModal(true); }}>
                Talk to Sales
              </Button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl bg-white border-2 border-[#4928fd] p-6 flex flex-col relative transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#4928fd] text-white text-[10px] font-bold tracking-wider">MOST POPULAR</div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-[#4928fd] uppercase tracking-wider">Pro</span>
                <p className="text-xs text-[rgba(27,29,30,0.42)] mt-1">Growing orgs of 15–75 devs</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#1b1d1e]">${billingCycle === 'annual' ? '28' : '35'}</span>
                  <span className="text-xs text-[rgba(27,29,30,0.42)]">/seat/mo</span>
                </div>
                <div className="mt-6 space-y-2.5 text-xs text-[#1b1d1e]/80">
                  {['Automated GitHub 2-way sync', 'Jira migration automated tool', 'Priority 24/7 Slack support', 'Advanced sprint analytics', 'Custom fields & workflows'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[#4928fd] flex-shrink-0" />{f}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[rgba(27,29,30,0.5)] text-[11px]"><Lock className="size-3 text-[#4928fd] flex-shrink-0" />Concession floor: 15%</div>
                </div>
              </div>
              <Button variant="violet" size="sm" className="mt-8 w-full justify-center" onClick={() => { setSeats(50); setShowConfigModal(true); }}>
                Negotiate with Emily
              </Button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm p-6 flex flex-col hover:border-[rgba(27,29,30,0.18)] transition-all">
              <div className="flex-1">
                <span className="text-xs font-semibold text-[rgba(27,29,30,0.62)] uppercase tracking-wider">Enterprise</span>
                <p className="text-xs text-[rgba(27,29,30,0.42)] mt-1">Full governance for 75+ devs</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#1b1d1e]">${billingCycle === 'annual' ? '52' : '65'}</span>
                  <span className="text-xs text-[rgba(27,29,30,0.42)]">/seat/mo</span>
                </div>
                <div className="mt-6 space-y-2.5 text-xs text-[#1b1d1e]/80">
                  {['Okta SSO & SCIM provisioning', 'SOC-2 Type II & HIPAA logs', 'Dedicated Technical Account Mgr', 'Custom data residency', '99.99% SLA guarantee'].map(f => (
                    <div key={f} className="flex items-center gap-2"><Check className="size-3.5 text-[rgba(27,29,30,0.42)] flex-shrink-0" />{f}</div>
                  ))}
                  <div className="flex items-center gap-2 text-[rgba(27,29,30,0.42)] text-[11px]"><Lock className="size-3 flex-shrink-0" />Concession floor: 25%</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-8 w-full justify-center" onClick={() => { setSeats(80); setShowConfigModal(true); }}>
                Talk to Sales
              </Button>
            </div>
          </div>

          {/* Judge note */}
          <div className="mt-8 p-4 rounded-xl bg-white border border-[rgba(27,29,30,0.1)] shadow-sm flex items-start gap-3">
            <div className="size-2 rounded-full bg-[#4928fd] animate-softpulse flex-shrink-0 mt-1" />
            <p className="text-[11px] text-[rgba(27,29,30,0.62)] leading-relaxed">
              <span className="text-[#4928fd] font-semibold">Demo note (EchoSphere Hackathon):</span>{' '}
              The &quot;Talk to Sales&quot; / &quot;Negotiate with Emily&quot; buttons connect to a live AI voice agent powered by{' '}
              <span className="text-[#1b1d1e]/70">Agora Conversational AI Engine + MCP tool calling</span>. Emily acts as TeamSync&apos;s enterprise sales rep — handling pricing, Jira objections, negotiation, and HubSpot CRM logging in real-time Hinglish.
            </p>
          </div>
        </div>
      </section>

      {/* Customers */}
      <section id="customers" className="py-16 px-6 relative z-10 border-t border-[rgba(27,29,30,0.08)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-[rgba(27,29,30,0.42)] uppercase tracking-wider mb-8 font-semibold">Trusted by engineering teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['Razorpay', 'Cred', 'Groww', 'Zepto', 'PhonePe', 'Meesho', 'BrowserStack', 'Postman'].map(co => (
              <span key={co} className="text-sm font-bold text-[rgba(27,29,30,0.32)] hover:text-[rgba(27,29,30,0.6)] transition-colors">{co}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 relative z-10 border-t border-[rgba(27,29,30,0.08)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1b1d1e] tracking-tight">
            Ready to eliminate Jira admin forever?
          </h2>
          <p className="mt-4 text-sm text-[rgba(27,29,30,0.62)]">
            Talk to Emily — our AI sales agent — and get a custom quote for your team in under 5 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button variant="violet" size="lg" onClick={() => setShowConfigModal(true)} disabled={isConnecting}>
              <span className="inline-flex items-center gap-2">
                <Headphones className="size-4" />
                Talk to Emily — Get Your Quote
              </span>
            </Button>
          </div>
          <p className="mt-4 text-xs text-[rgba(27,29,30,0.4)]">
            Live AI voice agent · Hinglish supported · HubSpot CRM sync on call end
          </p>
        </div>
      </section>

      {/* Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(27,29,30,0.45)] backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[rgba(27,29,30,0.1)] p-7 shadow-2xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(27,29,30,0.08)]">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-[#4928fd] flex items-center justify-center">
                  <Headphones className="size-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1b1d1e]">Talk to Emily — TeamSync Sales</h3>
                  <p className="text-[11px] text-[rgba(27,29,30,0.5)]">AI voice agent · Agora Convo AI · Hinglish</p>
                </div>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-[rgba(27,29,30,0.4)] hover:text-[#1b1d1e] p-1 text-sm">✕</button>
            </div>

            <p className="mt-4 text-xs text-[rgba(27,29,30,0.62)] leading-relaxed">
              You&apos;ll be connected to <strong className="text-[#1b1d1e]">Emily</strong>, TeamSync&apos;s AI Enterprise Sales Lead.
              He&apos;ll understand your team size, explain how TeamSync compares to Jira, quote your pricing, and negotiate terms — all in natural Hinglish.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#1b1d1e]/80 mb-1.5">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 size-4 text-[rgba(27,29,30,0.4)]" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[rgba(27,29,30,0.14)] text-xs text-[#1b1d1e] placeholder:text-[rgba(27,29,30,0.35)] focus:outline-none focus:border-[#4928fd]"
                    placeholder="e.g. Geeta" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1b1d1e]/80 mb-1.5">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-2.5 size-4 text-[rgba(27,29,30,0.4)]" />
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[rgba(27,29,30,0.14)] text-xs text-[#1b1d1e] placeholder:text-[rgba(27,29,30,0.35)] focus:outline-none focus:border-[#4928fd]"
                    placeholder="e.g. Razorpay" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1b1d1e]/80 mb-1.5">Work Email <span className="text-[rgba(27,29,30,0.4)]">(HubSpot sync)</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 size-4 text-[rgba(27,29,30,0.4)]" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[rgba(27,29,30,0.14)] text-xs text-[#1b1d1e] placeholder:text-[rgba(27,29,30,0.35)] focus:outline-none focus:border-[#4928fd]"
                    placeholder="e.g. rahul@razorpay.com" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[rgba(27,29,30,0.03)] border border-[rgba(27,29,30,0.08)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#1b1d1e]/80">Estimated Seats</span>
                  <span className="text-xs font-bold text-[#4928fd] px-2 py-0.5 rounded bg-[#eeeafe] border border-[#4928fd]/20">
                    {seats} seats · {selectedTier}
                  </span>
                </div>
                <input type="range" min="5" max="150" step="5" value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full h-1.5 bg-[rgba(27,29,30,0.1)] rounded-lg appearance-none cursor-pointer accent-[#4928fd]" />
                <div className="mt-3 flex items-center justify-between text-[11px] text-[#1b1d1e]/70">
                  <span>List: ${effectiveSeatPrice}/seat/mo</span>
                  <span className="text-[#1b1d1e] font-bold">${totalMonthlyList.toLocaleString()}/month</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[rgba(27,29,30,0.08)]">
              <Button variant="ghost" size="sm" arrow={false} onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button variant="violet" size="sm" onClick={handleLaunch} disabled={isConnecting}>
                <span className="inline-flex items-center gap-2">
                  <Headphones className="size-3.5" />
                  {isConnecting ? 'Connecting to Emily...' : 'Start Voice Call with Emily'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[rgba(27,29,30,0.08)] bg-[rgba(27,29,30,0.02)] text-center text-xs text-[rgba(27,29,30,0.4)]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-lg bg-[#4928fd] flex items-center justify-center">
              <GitMerge className="size-3 text-white" />
            </div>
            <span className="font-semibold text-[rgba(27,29,30,0.55)]">TeamSync</span>
            <span className="text-[rgba(27,29,30,0.25)]">·</span>
            <span>EchoSphere Hackathon · Knotic Track</span>
          </div>
          <div className="flex items-center gap-3 text-[rgba(27,29,30,0.35)]">
            <span>Agora Convo AI</span><span>·</span><span>Agora MCP</span><span>·</span><span>HubSpot v3</span><span>·</span><span>Google Calendar</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
