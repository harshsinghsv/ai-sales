'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronDown,
  Lock,
  Headphones,
  Sliders,
  ExternalLink,
  Code2,
  Terminal,
  FileText,
  Users,
  Building2,
  Mail,
  User,
  Zap,
  Cpu,
  Database,
  Globe,
  Briefcase,
  ChevronRight,
  Search,
  CheckCircle2,
  Play,
  RotateCcw
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface LandingPageProps {
  onStartCall: (info: { name: string; company: string; email: string; seats: number }) => void;
  isConnecting: boolean;
}

// Exact Anthropic Spark Symbol SVG
const AnthropicSpark: React.FC<{ className?: string }> = ({ className = 'size-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" />
  </svg>
);

// Customer quote carousel data from live Claude Enterprise page
const CUSTOMER_QUOTES = [
  {
    company: 'Slack',
    industry: 'Software',
    size: 'Large',
    product: 'Claude Platform',
    quote: 'Slack’s close collaboration with Anthropic has helped our Engineering and Product teams accelerate prototyping and model testing.',
    metric: '97 min/week',
    metricLabel: 'saved by the average user through summarization and recap features',
  },
  {
    company: 'Allianz',
    industry: 'Insurance',
    size: 'Large',
    product: 'Claude Platform',
    quote: 'With this partnership, Allianz is taking a decisive step to address critical AI challenges in insurance. Anthropic’s focus on safety and transparency complements our strong dedication to customer excellence and stakeholder trust.',
    metric: '90% WoW',
    metricLabel: 'growth company-wide deployment, with rapid global adoption',
  },
  {
    company: 'Lyft',
    industry: 'Transportation',
    size: 'Large',
    product: 'Claude Platform',
    quote: 'Through using Claude, we’ve saved millions, which we have reinvested in upskilling our customer support agents. We’ve empowered our agents to focus on those more complex issues that really require human care.',
    metric: '87% reduction',
    metricLabel: 'in customer support time · 30% more accurate decisions',
  },
  {
    company: 'Moody’s',
    industry: 'Financial services',
    size: 'Large',
    product: 'Claude Platform',
    quote: 'As AI becomes the interface for decisions, trust becomes the standard. Moody’s decision-grade connected intelligence is key to unlocking AI for high‑stakes credit and compliance decision‑making.',
    metric: '1200% faster',
    metricLabel: 'credit memo prep time cut from 40 hours to 2 minutes with Claude-built agents',
  },
  {
    company: 'Novo Nordisk',
    industry: 'Life sciences',
    size: 'Large',
    product: 'Claude Code',
    quote: 'In a highly regulated industry, we can’t just throw our data and information into a large language model and hope for the best. Our conversations with Anthropic really guided in the ways we can securely use Claude.',
    metric: '1000x faster',
    metricLabel: 'clinical study documentation down from 10 weeks to 10 minutes',
  },
];

const ENTERPRISE_LOGOS = [
  'Slack',
  'Allianz',
  'Lyft',
  'Moody’s',
  'Canva',
  'GitLab',
  'Stripe',
  'Visa',
  'Bridgewater',
  'AIG',
  'Novo Nordisk',
  'Notion',
];

// 4 Secure Products tabs
const PRODUCT_TABS = [
  {
    id: 'code',
    label: 'Claude Code',
    badge: 'Developer Agent',
    title: 'Code faster across your enterprise stack',
    description:
      'Build, debug, and ship using natural language from your terminal, IDE, Slack, or the web. Claude Code works wherever your team does.',
    bullets: [
      'Multi-file refactoring and dependency audits across whole repos',
      'Understands your full architecture with 1M token context window',
      'Enforces enterprise security policies and linters locally before push',
    ],
    codeSnippet: `$ claude code
> Audit legacy auth in 47 services and generate auth-v2 PRs
Scanning 47 repos...
✓ 312 call sites identified
✓ Phase 1 codemod applied cleanly to 12 leaf services
✓ Created PR #419: "chore(auth): migrate to auth-v2" (34 files changed)`,
  },
  {
    id: 'cowork',
    label: 'Claude Cowork',
    badge: 'Delegation Agent',
    title: 'Delegate tasks to Claude with Cowork',
    description:
      'Connect your files and tools, then hand off research, documents, and repetitive work. Get polished deliverables back while you focus on the work that needs your judgment.',
    bullets: [
      'Background task execution with real-time status reporting',
      'Connects across Google Workspace, Microsoft 365, and Slack',
      'Generates executive-ready decks, memos, and spreadsheet models',
    ],
    codeSnippet: `Task: "Build Q3 Board Deck from 14 regional sales reports"
Status: Completed in background (4 mins)
• Ingested 14 CSV exports from Salesforce & NetSuite
• Flagged 3 regions with pipeline concentration risk
• Generated executive slide deck with interactive waterfall charts
✓ Delivered to Slack channel #exec-briefings`,
  },
  {
    id: 'chat',
    label: 'Claude Chat',
    badge: 'Thinking Partner',
    title: 'Chat: A thinking partner for everyday work',
    description:
      'Chat with Claude to develop ideas, draft content, tighten reports, work through hard problems, and more with industry-leading reasoning.',
    bullets: [
      'State-of-the-art reasoning powered by Claude 3.7 Sonnet & Opus',
      'Projects workspace with shared team knowledge and artifacts',
      'Zero model training on enterprise conversations by default',
    ],
    codeSnippet: `You: "Analyze our cloud cost forecast vs actuals for Q2."
Claude: "I've reviewed your cloud billing logs. Three anomalies stand out:
1. GPU cluster idle compute: $18,400 excess spend on un-cordoned nodes.
2. Cross-region data egress increased 34% due to replica replication in eu-central.
Recommendation: Applying spot instance policies saves an estimated $42k/month."`,
  },
  {
    id: 'security',
    label: 'Claude Security',
    badge: 'Vulnerability Defense',
    title: 'Find and fix vulnerabilities with Claude Security',
    description:
      'Claude helps security teams and developers by reviewing code for security issues, drafts patches, and explains the risk in language your whole team can act on.',
    bullets: [
      'Deep static and dynamic code vulnerability remediation',
      'Automated pull request security reviews with contextual fixes',
      'SOC 2 Type II, ISO 27001, and HIPAA-ready BAA compliance',
    ],
    codeSnippet: `Security Scan Results:
● Critical: JWT algorithm "none" bypass in app/auth/jwt_handler.py:28
  Patch generated: Replaced with explicit RS256 verification and kid check.
● High: SSRF vulnerability in webhook validator app/services/validator.py:36
  Patch generated: Added strict IP CIDR blocklist for RFC1918 addresses.
✓ 4 findings patched · 0 false positives`,
  },
];

// Department Workflow tabs
const FUNCTION_TABS = [
  {
    id: 'engineering',
    label: 'Engineering',
    prompt:
      'Audit our use of the deprecated legacy-auth library across the monorepo. Generate a migration plan to move all 47 services to auth-v2, prioritized by risk and ordered by dependencies.',
    resultTitle: 'Migration plan: legacy-auth → auth-v2',
    stats: 'Audited 47 services · 312 call sites · 8 distinct usage patterns',
    phases: [
      'Phase 1 — Low risk (weeks 1–2, 12 services): Internal admin tools with no external dependencies.',
      'Phase 2 — Leaf services (weeks 3–5, 18 services): Failures stay contained; single staged rollout per service.',
      'Phase 3 — Core services (weeks 6–9, 17 services): Auth-critical paths with feature flags and shadow traffic.',
    ],
    riskCallout: 'payments-api — blocker: Uses undocumented signWithRotation() not present in auth-v2.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    prompt:
      'Build a Q1 channel performance review. Pull spend and conversions from HubSpot and paid social metrics from our LinkedIn dashboards. Show ROAS by channel over the last six months and flag declining channels.',
    resultTitle: 'Q1 Multi-Channel Performance & ROAS Audit',
    stats: 'Ingested HubSpot Q1 export (24 KB) + LinkedIn Ads Q1 (8 KB)',
    phases: [
      'Organic Search: 4.8x ROAS (+18% YoY) — Highest efficiency driver across product tiers.',
      'LinkedIn Paid B2B: 2.9x ROAS — Cost-per-MQL spiked 28% in finance verticals.',
      'Partner Referrals: 3.4x ROAS — Consistent high-intent pipeline for Enterprise seats.',
    ],
    riskCallout: 'Declining Channel Flag: Paid social display ad efficiency down 32% over 60 days.',
  },
  {
    id: 'sales',
    label: 'Sales',
    prompt:
      'I have a renewal call with Acme Corp’s VP of Operations on Thursday. Pull the account picture from HubSpot, open work in Asana, and mentions in #acme-account on Slack. Produce a brief covering relationship status, risks, expansion signals, and talking points.',
    resultTitle: 'Executive Brief: Acme Corp Renewal & Expansion',
    stats: 'Connectors synced: HubSpot CRM · Slack #acme-account · Asana Tasks',
    phases: [
      'Relationship Status: Healthy (CSAT 4.9/5). 50 active seats with 94% weekly engagement.',
      'Expansion Signal: Engineering requested 25 additional Claude Code licenses for Q3.',
      'Open Risk: Security team asked about HIPAA BAA status for new clinical intelligence app.',
    ],
    riskCallout: 'Key Action: Highlight Claude Enterprise HIPAA BAA support and 1M context code migrations.',
  },
  {
    id: 'product',
    label: 'Product Management',
    prompt:
      'Score the candidate features for our Q3 roadmap. Pull usage data from Amplitude, recent feedback from #product-feedback in Slack, and engineering estimates from Linear. Score each feature on reach, impact, and effort.',
    resultTitle: 'Q3 Product Roadmap Prioritization Matrix',
    stats: 'Data sources: Amplitude Analytics · Slack #feedback · Linear backlog',
    phases: [
      '#1 Enterprise SSO & SCIM Self-Serve: Score 92/100 (High reach, critical revenue unblocker).',
      '#2 Real-Time Collaborative Canvas: Score 86/100 (Unlocks design & product cross-team workflows).',
      '#3 OpenTelemetry Export Pipeline: Score 79/100 (Required for Fortune 500 compliance).',
    ],
    riskCallout: 'Recommendation: Commit top 2 candidate features to Sprint 14-16.',
  },
  {
    id: 'hr',
    label: 'Human Resources',
    prompt:
      'Build a 30-60-90 day onboarding plan for our new Senior Product Designer starting Monday. Pull from the job description, design team Notion handbook, and recent Figma files shipped.',
    resultTitle: 'Onboarding Plan: Maya Chen, Senior Product Designer',
    stats: 'Sources: Job Description · Notion Handbook (/Design/System) · Figma Repos',
    phases: [
      'Days 1–30 (Land): Meet Priya Shah (Manager) & Jordan Lee (Lead). Ship one UI fix end-to-end.',
      'Days 31–60 (Contribute): Own cart abandonment redesign; first design review by day 60.',
      'Days 61–90 (Lead): Drive next quarter’s design system roadmap for checkout experiences.',
    ],
    riskCallout: 'Deliverable: Lead end-to-end design critique and establish design tokens.',
  },
  {
    id: 'secops',
    label: 'Security',
    prompt:
      'Scan our webhook service for security vulnerabilities. Review auth flows, input validation, and file handling across all endpoints.',
    resultTitle: 'Automated Security Assessment & Remediation',
    stats: 'Scanned 247 files across app/, services/, routes/ · Severity threshold ≥ high',
    phases: [
      'CRITICAL: Shell command injection via webhook payload in script_runner.py:21 — Remediation PR drafted.',
      'CRITICAL: JWT authentication bypass via "none" algorithm in jwt_handler.py:28 — Patched with RS256 enforce.',
      'HIGH: Server-side request forgery in destination URL validator.py:36 — Restricted to public IP ranges.',
    ],
    riskCallout: 'Audit Result: 4 high-severity vulnerabilities remediated; 0 unhandled risks.',
  },
];

// FAQs categorized
const FAQ_CATEGORIES = [
  {
    id: 'security',
    label: 'Security and compliance',
    faqs: [
      {
        q: 'Does Anthropic train on our data?',
        a: 'No. Your prompts, data, and results are never used to train our models by default. Your proprietary data remains completely private to your organization. You can review our full data practices at the Anthropic Trust Center.',
      },
      {
        q: 'What security and compliance controls does Claude Enterprise include?',
        a: 'Claude Enterprise includes comprehensive identity and access controls (Single Sign-On SAML/SSO, domain capture, SCIM provisioning, and granular RBAC), enterprise visibility (audit logs, Compliance API, Analytics API, OpenTelemetry), data retention controls, customer-managed encryption keys, and network-level IP allowlisting.',
      },
      {
        q: 'Do you support HIPAA? Can we get a BAA?',
        a: 'Yes. HIPAA-ready configurations and Business Associate Agreements (BAA) are available for Claude Enterprise. Once enabled, your organization can securely process Protected Health Information (PHI) in full accordance with HIPAA standards.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Products and capabilities',
    faqs: [
      {
        q: 'What is the Claude Enterprise plan?',
        a: 'Claude Enterprise is Anthropic’s flagship offering for organizations deploying frontier AI at scale. One seat gives every employee access to Claude Chat, Claude Code for developers, Claude Cowork, Claude Design, and deep integrations with Google Workspace, Microsoft 365, Slack, and Chrome—all managed under unified enterprise governance.',
      },
      {
        q: 'What’s included in the Enterprise plan?',
        a: 'The plan includes our largest 1,000,000-token context window, highest rate limits, Claude 3.7 Sonnet & 3.5 Opus access, Claude Code terminal and web workflows, pre-built connectors, custom Model Context Protocol (MCP) integrations, centralized billing, and dedicated technical account management.',
      },
      {
        q: 'What’s the difference between Chat, Claude Code, and Claude Cowork?',
        a: 'Chat is designed for research, content drafting, and analysis. Claude Code is tailored for software engineering directly in the terminal, IDE, or GitHub. Claude Cowork handles asynchronous delegated tasks that run in the background and deliver finished documents.',
      },
    ],
  },
  {
    id: 'getting-started',
    label: 'Getting started',
    faqs: [
      {
        q: 'Can we buy Claude through AWS Marketplace, Google Cloud, or Azure?',
        a: 'Yes. Claude Enterprise can be procured directly through Anthropic or through AWS Marketplace (drawing down from your existing AWS EDP commit). Claude Platform APIs are also natively accessible on Amazon Bedrock, Google Cloud Vertex AI, and Microsoft Azure.',
      },
      {
        q: 'Do you support invoice billing on Claude Enterprise?',
        a: 'Yes. All sales-assisted Claude Enterprise agreements support flexible invoicing with Net-30 terms, wire transfer, or credit card billing.',
      },
      {
        q: 'How can I speak with an enterprise account specialist?',
        a: 'You can speak directly with Emily, our real-time AI Sales & Negotiation Agent, right now on this page by clicking "Talk to Sales (Instant Voice AI)", or request a live consultation with an Anthropic enterprise specialist.',
      },
    ],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStartCall, isConnecting }) => {
  // Buyer pre-flight configuration state
  const [name, setName] = useState('Tina');
  const [company, setCompany] = useState('Razorpay');
  const [email, setEmail] = useState('gargiesingh321@gmail.com');
  const [seats, setSeats] = useState(50);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // UI Interactive state
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [activeProductTab, setActiveProductTab] = useState('code');
  const [activeFunctionTab, setActiveFunctionTab] = useState('engineering');
  const [activeFaqCategory, setActiveFaqCategory] = useState('security');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDirectStart = () => {
    onStartCall({ name, company, email, seats });
  };

  const currentQuote = CUSTOMER_QUOTES[activeQuoteIndex];
  const currentProduct = PRODUCT_TABS.find((t) => t.id === activeProductTab) || PRODUCT_TABS[0];
  const currentFunction = FUNCTION_TABS.find((f) => f.id === activeFunctionTab) || FUNCTION_TABS[0];
  const currentFaqs = FAQ_CATEGORIES.find((c) => c.id === activeFaqCategory)?.faqs || FAQ_CATEGORIES[0].faqs;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans selection:bg-[#D97757] selection:text-white flex flex-col antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR (Claude Enterprise Standard)
         ───────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E6DC]'
            : 'bg-[#FAF9F5] border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 text-[#141413] hover:opacity-85 transition-opacity">
              <span className="text-[#D97757] text-2xl font-bold leading-none">✻</span>
              <span className="font-serif-anthropic text-2xl font-semibold tracking-tight text-[#141413]">Claude</span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#5E5D59]">
              <div className="group relative flex items-center gap-1 cursor-pointer hover:text-[#141413] transition-colors py-2">
                <span>Products</span>
                <ChevronDown className="size-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </div>
              <div className="group relative flex items-center gap-1 cursor-pointer text-[#141413] font-semibold py-2">
                <span>Solutions</span>
                <span className="px-1.5 py-0.5 text-[10px] bg-[#FAF0EC] text-[#D97757] rounded-full border border-[#D97757]/30">
                  Enterprise
                </span>
              </div>
              <a href="#platform" className="hover:text-[#141413] transition-colors">
                Platform
              </a>
              <a href="#resources" className="hover:text-[#141413] transition-colors">
                Resources
              </a>
              <a href="#pricing" className="hover:text-[#141413] transition-colors">
                Pricing
              </a>
            </nav>
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            {/* Live Agent Status Badge */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-xs text-[#D97757] font-medium">
              <span className="size-2 rounded-full bg-[#D97757] animate-pulse" />
              <span>Emily • Sales Agent Live</span>
            </div>

            {/* Primary Action Button: Triggers Agora AI Sales Voice Demo */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-full bg-[#141413] text-[#FAF9F5] hover:bg-[#30302E] transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="size-3.5 text-[#D97757]" />
              <span>Contact sales</span>
            </button>

            <button
              onClick={handleDirectStart}
              disabled={isConnecting}
              className="hidden md:flex px-4 py-2 text-xs sm:text-sm font-medium rounded-full bg-[#D97757] text-white hover:bg-[#C96442] transition-all shadow-sm items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Talk to Sales</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-xs font-semibold text-[#D97757] mb-6">
              <span>✻</span>
              <span>Claude enterprise solutions</span>
            </div>

            {/* Main Headline in Anthropic Serif */}
            <h1 className="font-serif-anthropic text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#141413] leading-[1.08] mb-6">
              The frontier, on every desk
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#5E5D59] leading-relaxed mb-10 max-w-2xl">
              Put Claude to work across your organization. Help everyone think deeper, do more, and build securely with our largest 1M token context models.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowConfigModal(true)}
                disabled={isConnecting}
                className="px-6 py-3.5 rounded-full bg-[#141413] text-[#FAF9F5] font-medium text-sm sm:text-base hover:bg-[#30302E] transition-all shadow-md flex items-center gap-2.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="size-4 text-[#D97757]" />
                <span>Talk to Sales (Instant Voice AI)</span>
                <ArrowRight className="size-4" />
              </button>

              <a
                href="#platform"
                className="px-6 py-3.5 rounded-full bg-white text-[#141413] border border-[#E8E6DC] font-medium text-sm sm:text-base hover:bg-[#F5F4ED] transition-all flex items-center gap-2"
              >
                <span>Build on Claude Platform</span>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-[#5E5D59]">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-[#D97757]" />
                Zero training on your data
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-[#D97757]" />
                SOC 2 Type II & HIPAA ready
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-[#D97757]" />
                1M context window
              </span>
            </div>
          </div>

          {/* Interactive Workspace Preview Hero Graphic */}
          <div className="mt-16 rounded-2xl border border-[#E8E6DC] bg-white p-4 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E8E6DC] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="size-3 rounded-full bg-[#E8E6DC]" />
                <span className="size-3 rounded-full bg-[#E8E6DC]" />
                <span className="size-3 rounded-full bg-[#E8E6DC]" />
                <span className="ml-3 text-xs font-mono text-[#87867F]">enterprise.claude.ai / workspace / {company.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#FAF0EC] text-[11px] font-mono text-[#D97757] font-semibold">
                  Claude 3.7 Sonnet & 3.5 Opus
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left sidebar: connectors & projects */}
              <div className="lg:col-span-4 space-y-4 border-r border-[#E8E6DC] pr-0 lg:pr-6">
                <div>
                  <div className="text-[11px] font-semibold text-[#87867F] uppercase tracking-wider mb-2">Connected Enterprise Context</div>
                  <div className="space-y-1.5 text-xs">
                    {['Slack (#engineering, #deals)', 'Google Drive (Enterprise Specs)', 'GitHub (Production Monorepo)', 'Figma (Design Handbooks)', 'HubSpot CRM (Pipeline)'].map((tool, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F5] border border-[#E8E6DC]/70">
                        <span className="font-medium text-[#141413]">{tool}</span>
                        <span className="size-1.5 rounded-full bg-[#788C5D]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF0EC] border border-[#D97757]/20 text-xs text-[#141413]">
                  <div className="font-semibold text-[#D97757] mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" />
                    <span>Enterprise Security Policy</span>
                  </div>
                  <p className="text-[#5E5D59] leading-relaxed text-[11px]">
                    Customer data isolation active. Zero model training enforced by admin configuration.
                  </p>
                </div>
              </div>

              {/* Main workspace terminal / agent output */}
              <div className="lg:col-span-8 space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#141413] text-[#FAF9F5] space-y-2">
                  <div className="text-[#87867F]">$ claude-code migrate --monorepo 47-services --target auth-v2</div>
                  <div className="text-[#BCD1CA]">
                    Scanning codebase across 1,000,000-token context window...
                  </div>
                  <div className="text-[#E3DACC]">
                    ✓ 312 legacy authentication call sites discovered<br />
                    ✓ Generated 47 pull requests with backwards-compatible type signatures<br />
                    ✓ Enforced automated rollback protection and token rotation fixtures
                  </div>
                  <div className="pt-2 border-t border-[#30302E] flex items-center justify-between text-[11px] text-[#87867F]">
                    <span>Completed in 3.4 seconds</span>
                    <span className="text-[#D97757]">Enterprise Verified</span>
                  </div>
                </div>

                {/* Live Agent quick start banner */}
                <div className="p-4 rounded-xl border border-[#D97757]/30 bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-sm text-[#141413]">Want to negotiate seats for {company}?</div>
                    <div className="text-xs text-[#5E5D59]">Emily is on standby with real-time quote generation and concession authority.</div>
                  </div>
                  <button
                    onClick={handleDirectStart}
                    className="px-4 py-2 rounded-full bg-[#D97757] text-white text-xs font-semibold hover:bg-[#C96442] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Start Voice Demo</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. TRUSTED BY THE WORLD'S LEADING ORGANIZATIONS
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif-anthropic text-3xl sm:text-4xl text-[#141413] tracking-tight mb-3">
              Trusted by the world’s leading organizations
            </h2>
            <p className="text-[#5E5D59] text-sm sm:text-base">
              From fast-growing software companies to global financial enterprises, teams rely on Claude for mission-critical work.
            </p>
          </div>

          {/* Interactive Customer Quote Card */}
          <div className="max-w-4xl mx-auto rounded-2xl border border-[#E8E6DC] bg-[#FAF9F5] p-6 sm:p-10 shadow-sm mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold font-serif-anthropic tracking-tight text-[#141413]">
                  {currentQuote.company}
                </span>
                <span className="text-xs text-[#87867F]">/</span>
                <span className="text-xs text-[#5E5D59] font-medium">{currentQuote.industry}</span>
              </div>
              <div className="flex items-center gap-1">
                {CUSTOMER_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuoteIndex(idx)}
                    className={`size-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeQuoteIndex ? 'bg-[#D97757] w-6' : 'bg-[#E8E6DC] hover:bg-[#B0AEA5]'
                    }`}
                    aria-label={`Go to quote ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            <blockquote className="font-serif-anthropic text-xl sm:text-2xl text-[#141413] leading-relaxed mb-8">
              “{currentQuote.quote}”
            </blockquote>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-[#E8E6DC] gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-semibold text-[#D97757] tracking-tight">
                  {currentQuote.metric}
                </div>
                <div className="text-xs text-[#5E5D59] mt-0.5 max-w-md">{currentQuote.metricLabel}</div>
              </div>
              <div className="text-xs text-[#87867F] font-mono">Product: {currentQuote.product}</div>
            </div>
          </div>

          {/* Enterprise Logos Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {ENTERPRISE_LOGOS.map((brand, idx) => (
              <div
                key={idx}
                className="h-12 flex items-center justify-center font-serif-anthropic text-lg font-semibold text-[#5E5D59] hover:text-[#141413] transition-colors"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BUILT FOR ENTERPRISE (4 PILLARS)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="font-serif-anthropic text-3xl sm:text-5xl text-[#141413] tracking-tight mb-4">
              Built for enterprise
            </h2>
            <p className="text-base sm:text-lg text-[#5E5D59] leading-relaxed">
              Enterprise AI requires uncompromising security, auditability, and frontier performance. Claude delivers on all three.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="size-10 rounded-xl bg-[#FAF0EC] text-[#D97757] flex items-center justify-center mb-4">
                  <Cpu className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#141413] mb-2 font-serif-anthropic">Built on the best models</h3>
                <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                  Claude leads on reasoning, coding, and analysis benchmarks. The same frontier models power every surface, from business apps to developer tools.
                </p>
              </div>
              <div className="mt-6 text-xs font-mono text-[#D97757]">1M token context window</div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="size-10 rounded-xl bg-[#FAF0EC] text-[#D97757] flex items-center justify-center mb-4">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#141413] mb-2 font-serif-anthropic">No model training by default</h3>
                <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                  Your prompts, data, and results are not used to train our models by default. Review our complete enterprise privacy controls at the Trust Center.
                </p>
              </div>
              <div className="mt-6 text-xs font-mono text-[#D97757]">Complete customer privacy</div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="size-10 rounded-xl bg-[#FAF0EC] text-[#D97757] flex items-center justify-center mb-4">
                  <Sliders className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#141413] mb-2 font-serif-anthropic">Flexible by design</h3>
                <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                  Pick the products and platform that are right for your teams, whether collaborating with Claude at work or building your own custom products.
                </p>
              </div>
              <div className="mt-6 text-xs font-mono text-[#D97757]">Workforce & API options</div>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between">
              <div>
                <div className="size-10 rounded-xl bg-[#FAF0EC] text-[#D97757] flex items-center justify-center mb-4">
                  <Lock className="size-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#141413] mb-2 font-serif-anthropic">Made to pass security review</h3>
                <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                  The security, compliance, and admin controls your organization needs: SSO/SAML, SCIM, HIPAA-ready BAA, SOC 2, and OpenTelemetry monitoring.
                </p>
              </div>
              <div className="mt-6 text-xs font-mono text-[#D97757]">SOC 2 · HIPAA · ISO 27001</div>
            </div>
          </div>

          {/* Compliance Badges Grid */}
          <div className="mt-8 p-4 rounded-xl bg-white border border-[#E8E6DC] flex flex-wrap items-center justify-center gap-3 text-xs text-[#5E5D59]">
            {[
              'Single sign-on (SSO/SAML)',
              'SCIM provisioning',
              'SOC 2 & ISO 27001',
              'GDPR & CCPA compliant',
              'HIPAA-ready offering & BAA',
              'OpenTelemetry monitoring',
              'Audit logs & Compliance API',
              'Role-based access control (RBAC)',
            ].map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E6DC] font-medium">
                ✓ {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BRING CLAUDE TO YOUR ENTERPRISE TWO WAYS
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif-anthropic text-3xl sm:text-4xl text-[#141413] tracking-tight mb-3">
              Bring Claude to your enterprise two ways
            </h2>
            <p className="text-base text-[#5E5D59]">
              Deploy Claude to your workforce or build it into your custom applications and products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Option 1: Claude Enterprise */}
            <div className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#FAF0EC] text-xs font-semibold text-[#D97757] border border-[#D97757]/30">
                  For Employee Workforce
                </span>
                <h3 className="font-serif-anthropic text-2xl sm:text-3xl text-[#141413] font-semibold mt-4 mb-3">
                  Claude Enterprise
                </h3>
                <p className="text-sm text-[#5E5D59] leading-relaxed mb-6">
                  Give every employee secure access to Chat, Claude Cowork, Claude Code, and your company’s connectors. Get the admin controls, management, and visibility your IT and security teams require.
                </p>
                <div className="space-y-2 text-xs text-[#141413] mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#D97757]" />
                    <span>One seat gives access to Chat, Code, and Cowork</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#D97757]" />
                    <span>Pre-built connectors to Slack, Google Drive, Microsoft 365</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#D97757]" />
                    <span>Role-based access control, SSO, and SCIM provisioning</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(true)}
                className="w-full py-3 rounded-full bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Talk to Sales for Enterprise Plan</span>
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Option 2: Claude Platform */}
            <div id="platform" className="p-8 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-[#E8E6DC] text-xs font-semibold text-[#141413]">
                  For Developers & Engineering
                </span>
                <h3 className="font-serif-anthropic text-2xl sm:text-3xl text-[#141413] font-semibold mt-4 mb-3">
                  Claude Platform
                </h3>
                <p className="text-sm text-[#5E5D59] leading-relaxed mb-6">
                  Access the Claude API to power new experiences, ship production-grade autonomous agents, and integrate Claude into the custom workflows and software your organization builds.
                </p>
                <div className="space-y-2 text-xs text-[#141413] mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#141413]" />
                    <span>Direct access to Claude 3.7 Sonnet & 3.5 Opus via Messages API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#141413]" />
                    <span>Claude Managed Agents and Model Context Protocol (MCP)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#141413]" />
                    <span>Deployable directly or via AWS Bedrock, GCP Vertex AI, and Azure</span>
                  </div>
                </div>
              </div>
              <a
                href="#pricing"
                className="w-full py-3 rounded-full bg-white text-[#141413] border border-[#E8E6DC] text-sm font-medium hover:bg-[#F5F4ED] transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore Platform Documentation</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECURE PRODUCTS FOR EMPLOYEES (TABBED SHOWCASE)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <h2 className="font-serif-anthropic text-3xl sm:text-5xl text-[#141413] tracking-tight mb-3">
              Secure products for employees, everywhere your teams work
            </h2>
            <p className="text-base text-[#5E5D59]">
              Claude adapts to every job function with specialized surfaces designed for software engineers, knowledge workers, and executives.
            </p>
          </div>

          {/* Product Tabs Header */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#E8E6DC] pb-4 mb-8">
            {PRODUCT_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveProductTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeProductTab === tab.id
                    ? 'bg-[#141413] text-white shadow-sm'
                    : 'bg-white text-[#5E5D59] hover:text-[#141413] border border-[#E8E6DC]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E6DC] shadow-sm">
            <div className="lg:col-span-6 space-y-6">
              <span className="px-2.5 py-1 rounded-full bg-[#FAF0EC] text-xs font-semibold text-[#D97757] border border-[#D97757]/30">
                {currentProduct.badge}
              </span>
              <h3 className="font-serif-anthropic text-3xl sm:text-4xl text-[#141413] tracking-tight">
                {currentProduct.title}
              </h3>
              <p className="text-[#5E5D59] text-base leading-relaxed">{currentProduct.description}</p>
              <div className="space-y-3 pt-2">
                {currentProduct.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#141413]">
                    <CheckCircle2 className="size-4 text-[#D97757] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-xl bg-[#141413] text-[#FAF9F5] p-5 font-mono text-xs shadow-lg space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#30302E] text-[11px] text-[#87867F]">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="size-3.5 text-[#D97757]" />
                    <span>{currentProduct.label} Runtime</span>
                  </span>
                  <span>1M Token Context</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-[#E3DACC]">
                  {currentProduct.codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. REAL WORK, ACROSS EVERY FUNCTION
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <h2 className="font-serif-anthropic text-3xl sm:text-5xl text-[#141413] tracking-tight mb-3">
              Real work, across every function
            </h2>
            <p className="text-base text-[#5E5D59]">
              See how different departments put Claude’s connected intelligence to work on high-stakes workflows.
            </p>
          </div>

          {/* Department Function Tabs */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {FUNCTION_TABS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFunctionTab(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeFunctionTab === f.id
                    ? 'bg-[#FAF0EC] text-[#D97757] border border-[#D97757]'
                    : 'bg-[#FAF9F5] text-[#5E5D59] hover:text-[#141413] border border-[#E8E6DC]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Department Output Display */}
          <div className="rounded-2xl border border-[#E8E6DC] bg-[#FAF9F5] p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-[#87867F] uppercase tracking-wider mb-2">Prompt Execution</div>
              <div className="p-4 rounded-xl bg-white border border-[#E8E6DC] text-sm text-[#141413] italic font-serif-anthropic">
                “{currentFunction.prompt}”
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E8E6DC] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E6DC] gap-2">
                <div className="flex items-center gap-2 text-base font-semibold text-[#141413]">
                  <span className="text-[#D97757]">✻</span>
                  <span>{currentFunction.resultTitle}</span>
                </div>
                <div className="text-xs font-mono text-[#87867F]">{currentFunction.stats}</div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-[#141413]">
                {currentFunction.phases.map((phase, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-[#D97757] font-semibold">[{idx + 1}]</span>
                    <span>{phase}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-[#FAF0EC] border border-[#D97757]/30 text-xs font-medium text-[#D97757]">
                {currentFunction.riskCallout}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. GET THE ENTERPRISE PLAN (PRICING & INSTANT VOICE DEMO)
         ───────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/30 text-xs font-semibold text-[#D97757] mb-3">
              <span>✻</span>
              <span>Transparent Enterprise Pricing</span>
            </div>
            <h2 className="font-serif-anthropic text-4xl sm:text-5xl text-[#141413] tracking-tight mb-4">
              Get the Enterprise plan
            </h2>
            <p className="text-base text-[#5E5D59]">
              Deploy the complete Claude suite across your organization with enterprise security, SSO, SCIM, and dedicated support.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-2xl mx-auto rounded-3xl border-2 border-[#141413] bg-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#141413] text-white px-5 py-1.5 rounded-bl-2xl text-xs font-semibold uppercase tracking-wider">
              Anthropic Enterprise
            </div>

            <div className="mb-6">
              <h3 className="font-serif-anthropic text-3xl font-semibold text-[#141413] mb-2">Enterprise</h3>
              <p className="text-sm text-[#5E5D59]">
                Get started today. Includes Enterprise security and compliance, Chat, Claude Code, Cowork, connectors, SSO, SCIM, audit logs, and more.
              </p>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl sm:text-6xl font-serif-anthropic font-bold text-[#141413]">$20</span>
              <span className="text-sm text-[#5E5D59]">Per seat / month, billed annually</span>
            </div>
            <div className="text-xs text-[#87867F] mb-8">
              Usage is billed as you go at API rates, based on what your team uses. Annual commitment required. Minimum 20 seats.
            </div>

            <div className="space-y-3 py-6 border-y border-[#E8E6DC] mb-8 text-sm">
              {[
                'Access to Claude 3.7 Sonnet and Claude 3.5 Opus with 1M context',
                'Claude Code for developers in terminal, desktop, and web',
                'Claude Cowork background execution & Claude Design',
                'Connectors for Google Drive, Gmail, Slack, and Microsoft 365',
                'Enterprise identity: Single sign-on (SSO/SAML) & SCIM provisioning',
                'Audit logs, OpenTelemetry monitoring, and Compliance API',
                'HIPAA-ready offering with signed Business Associate Agreement (BAA)',
                'Zero model training on customer data guaranteed by agreement',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#141413]">
                  <Check className="size-4 text-[#D97757] shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                onClick={() => setShowConfigModal(true)}
                disabled={isConnecting}
                className="w-full py-4 rounded-full bg-[#D97757] text-white font-medium text-base hover:bg-[#C96442] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="size-4" />
                <span>Talk to Sales (Instant Voice AI with Emily)</span>
                <ArrowRight className="size-4" />
              </button>

              <button
                onClick={handleDirectStart}
                className="w-full py-3.5 rounded-full bg-[#FAF9F5] text-[#141413] border border-[#E8E6DC] font-medium text-sm hover:bg-[#F5F4ED] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Headphones className="size-4 text-[#5E5D59]" />
                <span>Connect with 50 Seats Default ({company})</span>
              </button>
            </div>

            <p className="mt-4 text-center text-[11px] text-[#87867F]">
              Usage limits apply. Prices shown don’t include applicable tax. Price and plans are subject to change at Anthropic’s discretion.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. BUILD ON CLAUDE PLATFORM
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif-anthropic text-3xl sm:text-5xl text-[#141413] tracking-tight mb-3">
              Build on the Claude Platform
            </h2>
            <p className="text-base text-[#5E5D59]">
              Give developers direct API access to build AI-enabled products, services, and autonomous multi-agent pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC]">
              <div className="size-10 rounded-xl bg-white text-[#141413] flex items-center justify-center mb-4 border border-[#E8E6DC]">
                <Zap className="size-5 text-[#D97757]" />
              </div>
              <h3 className="font-serif-anthropic text-xl font-semibold text-[#141413] mb-2">Primitives</h3>
              <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                Building blocks to integrate Claude, including the Messages API, function calling, tool use, and streaming with complete control over every layer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC]">
              <div className="size-10 rounded-xl bg-white text-[#141413] flex items-center justify-center mb-4 border border-[#E8E6DC]">
                <Cpu className="size-5 text-[#D97757]" />
              </div>
              <h3 className="font-serif-anthropic text-xl font-semibold text-[#141413] mb-2">Harnesses and infrastructure</h3>
              <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                Everything you need to ship production-grade agents, including Claude Managed Agents, prompt caching, and structured outputs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC]">
              <div className="size-10 rounded-xl bg-white text-[#141413] flex items-center justify-center mb-4 border border-[#E8E6DC]">
                <ShieldCheck className="size-5 text-[#D97757]" />
              </div>
              <h3 className="font-serif-anthropic text-xl font-semibold text-[#141413] mb-2">Operating system</h3>
              <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed">
                Controls to deploy and govern agents across your organization, including authorization, rate limits, and OpenTelemetry observability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FAQ ACCORDION
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif-anthropic text-3xl sm:text-5xl text-[#141413] tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-base text-[#5E5D59]">
              Everything you need to know about security, capabilities, and getting started with Claude Enterprise.
            </p>
          </div>

          {/* FAQ Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFaqCategory(cat.id);
                  setOpenFaqIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  activeFaqCategory === cat.id
                    ? 'bg-[#141413] text-white'
                    : 'bg-white text-[#5E5D59] hover:text-[#141413] border border-[#E8E6DC]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {currentFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-xl border border-[#E8E6DC] bg-white overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif-anthropic text-lg font-medium text-[#141413] hover:text-[#D97757] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`size-4 text-[#87867F] transition-transform ${isOpen ? 'rotate-180 text-[#D97757]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#5E5D59] leading-relaxed border-t border-[#E8E6DC]/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. ENTERPRISE RESOURCES
         ───────────────────────────────────────────────────────────── */}
      <section id="resources" className="py-20 bg-white border-t border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif-anthropic text-3xl sm:text-4xl text-[#141413] tracking-tight mb-3">
              Enterprise resources
            </h2>
            <p className="text-base text-[#5E5D59]">
              Guides, tutorials, and reports to help integrate AI thoughtfully into your enterprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Claude Enterprise Administrator Guide', type: 'Tutorial', time: '8 min read' },
              { title: 'Zero Trust AI Agents for Enterprise', type: 'Guide', time: '12 min read' },
              { title: 'The Enterprise AI Transformation Guide', type: 'Whitepaper', time: '18 min read' },
            ].map((res, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E8E6DC] hover:border-[#D97757]/40 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#87867F] mb-3">
                    <span className="font-semibold text-[#D97757]">{res.type}</span>
                    <span>{res.time}</span>
                  </div>
                  <h3 className="font-serif-anthropic text-xl font-semibold text-[#141413] group-hover:text-[#D97757] transition-colors">
                    {res.title}
                  </h3>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#141413]">
                  <span>Read publication</span>
                  <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. READY TO BRING CLAUDE TO YOUR ORGANIZATION?
         ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#FAF9F5] border-t border-[#E8E6DC]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif-anthropic text-4xl sm:text-6xl text-[#141413] tracking-tight mb-6">
            Ready to bring Claude to your organization?
          </h2>
          <p className="text-lg text-[#5E5D59] mb-10 max-w-2xl mx-auto">
            Talk with our adaptive sales agent Emily right now to evaluate pricing, explore concessions, and book an executive briefing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-8 py-4 rounded-full bg-[#141413] text-white font-medium text-base hover:bg-[#30302E] transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="size-4 text-[#D97757]" />
              <span>Talk to Sales (Instant Voice AI)</span>
              <ArrowRight className="size-4" />
            </button>
            <button
              onClick={handleDirectStart}
              className="px-8 py-4 rounded-full bg-white text-[#141413] border border-[#E8E6DC] font-medium text-base hover:bg-[#F5F4ED] transition-colors"
            >
              <span>Connect Immediately</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. GLOBAL ANTHROPIC FOOTER
         ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#FAF9F5] border-t border-[#E8E6DC] py-16 text-xs text-[#5E5D59]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 mb-12">
            <div>
              <div className="font-semibold text-[#141413] mb-3">Products</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#141413]">Claude</a></li>
                <li><a href="#" className="hover:text-[#141413]">Claude Code</a></li>
                <li><a href="#" className="hover:text-[#141413]">Claude Cowork</a></li>
                <li><a href="#" className="hover:text-[#141413]">Claude Design</a></li>
                <li><a href="#" className="hover:text-[#141413]">Claude Security</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#141413] mb-3">Models</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#141413]">Claude 3.7 Sonnet</a></li>
                <li><a href="#" className="hover:text-[#141413]">Claude 3.5 Opus</a></li>
                <li><a href="#" className="hover:text-[#141413]">Claude 3.5 Haiku</a></li>
                <li><a href="#" className="hover:text-[#141413]">Model Card</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#141413] mb-3">Solutions</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#141413]">Enterprise</a></li>
                <li><a href="#" className="hover:text-[#141413]">Startups</a></li>
                <li><a href="#" className="hover:text-[#141413]">AI Agents</a></li>
                <li><a href="#" className="hover:text-[#141413]">Financial Services</a></li>
                <li><a href="#" className="hover:text-[#141413]">Life Sciences</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#141413] mb-3">Platform</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#141413]">Messages API</a></li>
                <li><a href="#" className="hover:text-[#141413]">Developer Docs</a></li>
                <li><a href="#" className="hover:text-[#141413]">Pricing</a></li>
                <li><a href="#" className="hover:text-[#141413]">Console Login</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#141413] mb-3">Resources</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#141413]">Customer Stories</a></li>
                <li><a href="#" className="hover:text-[#141413]">Trust Center</a></li>
                <li><a href="#" className="hover:text-[#141413]">Research</a></li>
                <li><a href="#" className="hover:text-[#141413]">System Status</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#141413] mb-3">Company</div>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#141413]">Anthropic</a></li>
                <li><a href="#" className="hover:text-[#141413]">Careers</a></li>
                <li><a href="#" className="hover:text-[#141413]">Responsible Scaling</a></li>
                <li><a href="#" className="hover:text-[#141413]">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#E8E6DC] gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#D97757]">✻</span>
              <span>© {new Date().getFullYear()} Anthropic PBC. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-[#141413]">Terms of Service</a>
              <a href="#" className="hover:text-[#141413]">Privacy Policy</a>
              <a href="#" className="hover:text-[#141413]">Cookie Preferences</a>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          14. BUYER DETAILS & VOICE CALL MODAL
         ───────────────────────────────────────────────────────────── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E8E6DC] p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DC] mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[#D97757] text-xl font-bold">✻</span>
                <span className="font-serif-anthropic text-xl font-semibold text-[#141413]">
                  Talk to Sales · Emily AI
                </span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="size-8 rounded-full bg-[#FAF9F5] border border-[#E8E6DC] flex items-center justify-center text-[#5E5D59] hover:text-[#141413] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5E5D59] mb-6">
              Configure your organization’s profile before connecting with Emily. She will calculate personalized enterprise volume discounts and answer your compliance questions in real-time.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">Your Name</label>
                <div className="relative">
                  <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87867F]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E8E6DC] bg-[#FAF9F5] text-sm text-[#141413] focus:outline-none focus:border-[#D97757]"
                    placeholder="Tina"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">Company Name</label>
                <div className="relative">
                  <Building2 className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87867F]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E8E6DC] bg-[#FAF9F5] text-sm text-[#141413] focus:outline-none focus:border-[#D97757]"
                    placeholder="Razorpay"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">Work Email</label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87867F]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E8E6DC] bg-[#FAF9F5] text-sm text-[#141413] focus:outline-none focus:border-[#D97757]"
                    placeholder="gargiesingh321@gmail.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#141413]">Seat Count ({seats} seats)</label>
                  <span className="text-xs font-mono text-[#D97757] font-semibold">
                    ${seats * 20}/mo list
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full accent-[#D97757] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#87867F] mt-1 font-mono">
                  <span>20 seats (min)</span>
                  <span>100 seats</span>
                  <span>500+ seats</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowConfigModal(false);
                handleDirectStart();
              }}
              disabled={isConnecting}
              className="w-full py-3.5 rounded-full bg-[#D97757] text-white font-semibold text-sm hover:bg-[#C96442] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="size-4" />
              <span>{isConnecting ? 'Connecting to Emily...' : 'Start Voice Call with Emily'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
