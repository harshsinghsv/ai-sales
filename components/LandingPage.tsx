'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  User,
  Building2,
  Mail,
  Check,
  Play,
  ArrowLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';

interface LandingPageProps {
  onStartCall: (info: { name: string; company: string; email: string; seats: number }) => void;
  isConnecting: boolean;
}

/* ==========================================================================
   MINIMALIST LINE-ART ICONS (Matching claude.com/solutions/enterprise exact SVGs)
   ========================================================================== */

const BuildingTowerIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M14 42V10L34 6V42" />
    <path d="M14 10L34 6" />
    <path d="M20 16H28" />
    <path d="M20 22H28" />
    <path d="M20 28H28" />
    <path d="M20 34H28" />
    <path d="M10 42H38" />
  </svg>
);

const SquareTriangleIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="10" y="10" width="16" height="16" />
    <circle cx="18" cy="18" r="3" />
    <path d="M24 24L38 38H18L24 24Z" />
  </svg>
);

const TwoHandsIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M14 12V24C14 26 15 28 17 28L24 28" />
    <path d="M18 12V24" />
    <path d="M22 14V24" />
    <path d="M34 36V24C34 22 33 20 31 20L24 20" />
    <path d="M30 36V24" />
    <path d="M26 34V24" />
  </svg>
);

const HandOkIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="28" cy="22" r="5" />
    <path d="M24 25L18 30C16 32 14 30 15 28L21 21" />
    <path d="M28 17V8" />
    <path d="M31 18V10" />
    <path d="M34 20V13" />
    <path d="M22 30V40H32" />
  </svg>
);

const HangerIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="24" cy="12" r="3" strokeDasharray="16 4" />
    <path d="M24 15V19L10 30H38L24 19Z" />
    <path d="M10 30H38" />
  </svg>
);

const CodeWindowIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="8" y="10" width="32" height="28" rx="2" />
    <line x1="8" y1="16" x2="40" y2="16" />
    <path d="M18 24L14 28L18 32" />
    <path d="M30 24L34 28L30 32" />
    <line x1="26" y1="23" x2="22" y2="33" />
  </svg>
);

const QuestionCoinIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <ellipse cx="24" cy="24" rx="14" ry="16" />
    <path d="M21 20C21 17.5 22.5 16 24 16C25.5 16 27 17.5 27 19C27 21 24 22.5 24 24.5V26" />
    <circle cx="24" cy="30" r="1.5" fill="currentColor" />
  </svg>
);

const LightbulbIcon: React.FC<{ className?: string }> = ({ className = 'size-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M9 18H15" />
    <path d="M10 21H14" />
    <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17H16V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" />
  </svg>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className = 'size-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2L4 5V11.5C4 16.5 7.5 21 12 22C16.5 21 20 16.5 20 11.5V5L12 2Z" />
    <path d="M9 12L11 14L15 10" />
  </svg>
);

const SplitRectIcon: React.FC<{ className?: string }> = ({ className = 'size-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="3" y="4" width="8" height="16" rx="1" />
    <rect x="13" y="4" width="8" height="16" rx="1" />
  </svg>
);

const DocumentMagnifierIcon: React.FC<{ className?: string }> = ({ className = 'size-8' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M6 4H20L26 10V28H6V4Z" />
    <path d="M20 4V10H26" />
    <line x1="10" y1="12" x2="16" y2="12" />
    <line x1="10" y1="16" x2="18" y2="16" />
    <circle cx="21" cy="21" r="4" />
    <line x1="24" y1="24" x2="28" y2="28" />
  </svg>
);

const StorefrontIcon: React.FC<{ className?: string }> = ({ className = 'size-9' }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M4 12V26H28V12" />
    <path d="M4 12L7 6H25L28 12H4Z" />
    <path d="M12 26V18H20V26" />
    <path d="M7 12V14C7 15.1 7.9 16 9 16C10.1 16 11 15.1 11 14V12" />
    <path d="M11 12V14C11 15.1 11.9 16 13 16C14.1 16 15 15.1 15 14V12" />
    <path d="M15 12V14C15 15.1 15.9 16 17 16C18.1 16 19 15.1 19 14V12" />
    <path d="M19 12V14C19 15.1 19.9 16 21 16C22.1 16 23 15.1 23 14V12" />
    <path d="M23 12V14C23 15.1 23.9 16 25 16C26.1 16 27 15.1 27 14V12" />
  </svg>
);

/* ==========================================================================
   CUSTOMER STORIES DATA
   ========================================================================== */

const CUSTOMER_STORIES = [
  {
    company: 'Slack',
    logo: 'slack',
    industry: 'Software',
    size: 'Large',
    product: 'Claude Platform',
    location: 'North America',
    quote:
      'Slack’s close collaboration with Anthropic has helped our Engineering and Product teams accelerate prototyping and model testing.',
    statNumber: '97',
    statLabel: 'minutes per week saved by the average user through summarization and recap features',
    bgTone: 'gauge',
  },
  {
    company: 'Allianz',
    logo: 'allianz',
    industry: 'Insurance',
    size: 'Large',
    product: 'Claude Platform',
    location: 'Europe',
    quote:
      'With this partnership, Allianz is taking a decisive step to address critical AI challenges in insurance. Anthropic’s focus on safety and transparency complements our strong dedication to customer excellence and stakeholder trust.',
    statNumber: '90%',
    statLabel: 'growth company-wide deployment with rapid global workforce adoption',
    bgTone: 'neutral',
  },
  {
    company: 'Lyft',
    logo: 'lyft',
    industry: 'Transportation',
    size: 'Large',
    product: 'Claude Platform',
    location: 'North America',
    quote:
      'Through using Claude, we’ve saved millions, which we have reinvested in upskilling our customer support agents. We’ve empowered our agents to focus on those more complex issues that really require human care.',
    statNumber: '87%',
    statLabel: 'reduction in customer support processing time with 30% more accurate decisions',
    bgTone: 'neutral',
  },
  {
    company: 'Moody’s',
    logo: 'moodys',
    industry: 'Financial services',
    size: 'Large',
    product: 'Claude Platform',
    location: 'North America',
    quote:
      'As AI becomes the interface for decisions, trust becomes the standard. Moody’s decision-grade connected intelligence is key to unlocking AI for high-stakes credit and compliance decision-making.',
    statNumber: '1200%',
    statLabel: 'faster credit memo preparation cut from 40 hours to 2 minutes with Claude-built agents',
    bgTone: 'neutral',
  },
  {
    company: 'Novo Nordisk',
    logo: 'novonordisk',
    industry: 'Life sciences',
    size: 'Large',
    product: 'Claude Code',
    location: 'Europe',
    quote:
      'In a highly regulated industry, we can’t just throw our data and information into a large language model and hope for the best. Our conversations with Anthropic really guided in the ways we can securely use Claude.',
    statNumber: '1000x',
    statLabel: 'faster clinical study documentation down from 10 weeks to 10 minutes',
    bgTone: 'neutral',
  },
];

/* ==========================================================================
   FUNCTION TABS CONTENT (Terminal previews)
   ========================================================================== */

const FUNCTION_TABS = [
  {
    id: 'engineering',
    label: 'Engineering',
    icon: '</>',
    terminalHeader: '* Migration plan: legacy-auth → auth-v2',
    terminalLines: [
      'Audited 47 services, 312 call sites, 8 distinct usage patterns.',
      '',
      'Recommended order',
      '  Phase 1 — Low risk (weeks 1–2, 12 services)',
      '    Internal admin tools with no external dependencies. Safe to',
      '    validate the auth-v2 codemod and surface unknown patterns.',
      '  Phase 2 — Leaf services (weeks 3–5, 18 services)',
      '    No downstream consumers in the dependency graph. Failures stay',
      '    contained; single staged rollout per service.',
      '  Phase 3 — Core services (weeks 6–9, 17 services)',
      '    Auth-critical paths with feature flags and shadow traffic.',
      '',
      'payments-api — blocker: Uses undocumented signWithRotation() not present in auth-v2.',
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: '📣',
    terminalHeader: '* Q1 Multi-Channel Performance & ROAS Audit',
    terminalLines: [
      'Ingested HubSpot Q1 export + LinkedIn Ads Q1 data.',
      '',
      'Channel Breakdown',
      '  Organic Search: 4.8x ROAS (+18% YoY)',
      '    Highest efficiency driver across product tiers.',
      '  LinkedIn Paid B2B: 2.9x ROAS',
      '    Cost-per-MQL spiked 28% in finance verticals.',
      '  Partner Referrals: 3.4x ROAS',
      '    Consistent high-intent pipeline for Enterprise seats.',
      '',
      'Declining Channel Flag: Paid social display ad efficiency down 32% over 60 days.',
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: '💼',
    terminalHeader: '* Executive Brief: Acme Corp Renewal & Expansion',
    terminalLines: [
      'Connectors synced: HubSpot CRM · Slack #acme-account · Asana Tasks',
      '',
      'Account Signals',
      '  Relationship Status: Healthy (CSAT 4.9/5). 50 active seats with 94% weekly engagement.',
      '  Expansion Signal: Engineering requested 25 additional Claude Code licenses for Q3.',
      '  Open Risk: Security team asked about HIPAA BAA status for new clinical intelligence app.',
      '',
      'Key Action: Highlight Claude Enterprise HIPAA BAA support and 1M context code migrations.',
    ],
  },
  {
    id: 'product',
    label: 'Product Management',
    icon: '📊',
    terminalHeader: '* Q3 Product Roadmap Prioritization Matrix',
    terminalLines: [
      'Data sources: Amplitude Analytics · Slack #feedback · Linear backlog',
      '',
      'Ranked Candidates',
      '  #1 Enterprise SSO & SCIM Self-Serve: Score 92/100 (High reach, revenue unblocker).',
      '  #2 Real-Time Collaborative Canvas: Score 86/100 (Unlocks design & product cross-team workflows).',
      '  #3 OpenTelemetry Export Pipeline: Score 79/100 (Required for Fortune 500 compliance).',
      '',
      'Recommendation: Commit top 2 candidate features to Sprint 14-16.',
    ],
  },
  {
    id: 'hr',
    label: 'Human Resources',
    icon: '👥',
    terminalHeader: '* Onboarding Plan: Maya Chen, Senior Product Designer',
    terminalLines: [
      'Sources: Job Description · Notion Handbook (/Design/System) · Figma Repos',
      '',
      'Milestones',
      '  Days 1–30 (Land): Meet manager and tech lead. Ship one UI fix end-to-end.',
      '  Days 31–60 (Contribute): Own cart abandonment redesign; first design review by day 60.',
      '  Days 61–90 (Lead): Drive next quarter’s design system roadmap for checkout experiences.',
      '',
      'Deliverable: Lead end-to-end design critique and establish design tokens.',
    ],
  },
];

/* ==========================================================================
   FAQ DATA
   ========================================================================== */

const FAQ_SECTIONS = [
  {
    id: 'security',
    label: 'Security and compliance',
    faqs: [
      {
        q: 'Does Anthropic train on our data?',
        a: 'No. Your prompts, data, and results are not used to train our models by default. Your proprietary data remains completely private to your organization. You can review our full data practices at the Anthropic Trust Center.',
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
        a: 'You can speak directly with Emily, our real-time AI Sales & Negotiation Agent, right now on this page by clicking "Contact sales" or "Chat with buying specialist".',
      },
    ],
  },
];

/* ==========================================================================
   LANDING PAGE COMPONENT
   ========================================================================== */

export const LandingPage: React.FC<LandingPageProps> = ({ onStartCall, isConnecting }) => {
  // Buyer configuration state for Emily voice AI
  const [name, setName] = useState('Tina');
  const [company, setCompany] = useState('Razorpay');
  const [email, setEmail] = useState('gargiesingh321@gmail.com');
  const [seats, setSeats] = useState(50);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Carousel & interactive section states
  const [storyIndex, setStoryIndex] = useState(0);
  const [productTab, setProductTab] = useState<'code' | 'cowork' | 'chat'>('code');
  const [activeFunction, setActiveFunction] = useState('engineering');
  const [faqCategory, setFaqCategory] = useState('security');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentStory = CUSTOMER_STORIES[storyIndex];
  const activeFunctionData =
    FUNCTION_TABS.find((f) => f.id === activeFunction) || FUNCTION_TABS[0];
  const currentFaqList =
    FAQ_SECTIONS.find((s) => s.id === faqCategory)?.faqs || FAQ_SECTIONS[0].faqs;

  const handleNextStory = () => {
    setStoryIndex((prev) => (prev + 1) % CUSTOMER_STORIES.length);
  };

  const handlePrevStory = () => {
    setStoryIndex((prev) => (prev - 1 + CUSTOMER_STORIES.length) % CUSTOMER_STORIES.length);
  };

  const handleTriggerEmily = () => {
    setShowConfigModal(true);
  };

  const handleConfirmCall = () => {
    setShowConfigModal(false);
    onStartCall({ name, company, email, seats });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans selection:bg-[#D97757] selection:text-white antialiased">
      {/* ─────────────────────────────────────────────────────────────
          1. TOP NAVIGATION BAR (Exact Claude Enterprise Header)
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full bg-[#FAF9F5] border-b border-[#E8E6DC]">
        {/* Tier 1: Main Header */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Left Brand: Claude Asterisk + Claude Text */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <span className="text-[#D97757] text-2xl font-bold leading-none select-none">✻</span>
              <span className="font-serif-anthropic text-2xl font-semibold tracking-tight text-[#141413]">
                Claude
              </span>
            </a>
          </div>

          {/* Right Navigation & Action Items */}
          <div className="flex items-center gap-6 text-sm text-[#141413]">
            <nav className="hidden lg:flex items-center gap-6 font-normal">
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#5E5D59] transition-colors">
                <span>Meet Claude</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#5E5D59] transition-colors">
                <span>Platform</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#5E5D59] transition-colors font-medium">
                <span>Solutions</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#5E5D59] transition-colors">
                <span>Pricing</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-[#5E5D59] transition-colors">
                <span>Resources</span>
                <ChevronDown className="size-3.5 opacity-60" />
              </div>
              <a href="#" className="hover:text-[#5E5D59] transition-colors">
                Login
              </a>
            </nav>

            <div className="flex items-center gap-2.5">
              {/* Contact Sales Pill Button -> Triggers Emily */}
              <button
                onClick={handleTriggerEmily}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#D5D3CA] bg-[#FAF9F5] text-[#141413] hover:bg-[#EBE8DF] transition-colors cursor-pointer"
              >
                Contact sales
              </button>

              {/* Try Claude Solid Button */}
              <button
                onClick={handleTriggerEmily}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#141413] text-white hover:bg-[#30302E] transition-colors cursor-pointer"
              >
                Try Claude
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Subnav Breadcrumb */}
        <div className="border-t border-[#E8E6DC] bg-[#FAF9F5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 h-10 flex items-center justify-between text-xs text-[#5E5D59]">
            <div className="flex items-center gap-2">
              <span className="hover:text-[#141413] cursor-pointer">Solution</span>
              <span className="opacity-40">/</span>
              <span className="text-[#141413] font-medium">Enterprise</span>
            </div>
            <div className="flex items-center gap-1 cursor-pointer hover:text-[#141413] transition-colors">
              <span>Explore here</span>
              <ChevronDown className="size-3 opacity-60" />
            </div>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION (Left-Aligned, Exact Claude Typography & Buttons)
         ───────────────────────────────────────────────────────────── */}
      <section className="pt-16 sm:pt-24 pb-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl">
          {/* Eyebrow: Plain text, no background box */}
          <div className="text-sm sm:text-base text-[#5E5D59] mb-4">
            Claude enterprise solutions
          </div>

          {/* Heading: Huge bold Anthropic Serif */}
          <h1 className="font-serif-anthropic text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#141413] leading-[1.05] mb-6">
            The frontier, on every desk
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#383734] leading-relaxed mb-8 max-w-2xl font-normal">
            Put Claude to work across your organization. Help everyone think deeper, do more, and build securely.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Get Enterprise plan (solid black button) -> Opens Emily Buyer Modal */}
            <button
              onClick={handleTriggerEmily}
              disabled={isConnecting}
              className="px-5 py-3 rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors cursor-pointer active:scale-[0.99]"
            >
              Get Enterprise plan
            </button>

            {/* Build on Claude Platform (warm oat/beige button) */}
            <a
              href="#platform"
              className="px-5 py-3 rounded-lg bg-[#E3DACC] text-[#141413] text-sm font-medium hover:bg-[#D5CABB] transition-colors inline-block"
            >
              Build on Claude Platform
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. CUSTOMER PROOF CAROUSEL (Slack gauge card + nav arrows)
         ───────────────────────────────────────────────────────────── */}
      <section className="pt-4 pb-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 overflow-hidden">
        {/* Section Header with Carousel Navigation Arrows */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif-anthropic text-2xl sm:text-3xl font-medium text-[#141413] tracking-tight">
            Trusted by the world’s leading organizations
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStory}
              className="size-9 sm:size-10 rounded-full border border-[#D5D3CA] hover:bg-[#EBE8DF] flex items-center justify-center text-[#141413] transition-colors cursor-pointer"
              aria-label="Previous story"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={handleNextStory}
              className="size-9 sm:size-10 rounded-full border border-[#D5D3CA] hover:bg-[#EBE8DF] flex items-center justify-center text-[#141413] transition-colors cursor-pointer"
              aria-label="Next story"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative flex items-stretch gap-6">
          {/* Main Card (Photographic Gauge Aesthetic) */}
          <div className="w-full rounded-3xl overflow-hidden relative shadow-md min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-8 sm:p-12 text-white bg-[#221C16]">
            {/* Background Photographic Gradient Effect resembling the analog gauge meter */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 60% 70%, rgba(217,119,87,0.3) 0%, rgba(30,25,20,0.85) 65%, #181410 100%)',
              }}
            />
            {/* Dial Arc SVG Illustration in background */}
            <svg
              className="absolute right-0 bottom-0 w-3/4 h-3/4 opacity-15 pointer-events-none"
              viewBox="0 0 400 300"
              fill="none"
              stroke="#FFF"
              strokeWidth="2"
            >
              <path d="M 50 280 A 180 180 0 0 1 350 280" strokeDasharray="6 8" strokeWidth="6" />
              <line x1="200" y1="280" x2="260" y2="120" strokeWidth="4" stroke="#D97757" />
              <circle cx="200" cy="280" r="14" fill="#D97757" />
            </svg>

            {/* Top Row: Company Brand Logo */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentStory.company === 'Slack' ? (
                  <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
                    <span className="text-3xl leading-none">#</span>
                    <span>slack</span>
                  </div>
                ) : (
                  <span className="font-serif-anthropic text-2xl font-bold tracking-tight text-white">
                    {currentStory.company}
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Serif Quote in crisp white typography */}
            <div className="relative z-10 my-8 max-w-3xl">
              <blockquote className="font-serif-anthropic text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-[1.25]">
                “{currentStory.quote}”
              </blockquote>
            </div>

            {/* Bottom Row: Metric, Metadata, and Video Play Pill */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/15">
              {/* Metric */}
              <div className="max-w-xs">
                <div className="text-4xl sm:text-5xl font-sans font-light text-white tracking-tight leading-none mb-2">
                  {currentStory.statNumber}
                </div>
                <div className="text-xs text-white/80 leading-relaxed">
                  {currentStory.statLabel}
                </div>
              </div>

              {/* Metadata Table */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-white/75">
                <div>
                  <span className="text-white/50">Industry:</span> {currentStory.industry}
                </div>
                <div>
                  <span className="text-white/50">Company size:</span> {currentStory.size}
                </div>
                <div>
                  <span className="text-white/50">Product:</span> {currentStory.product}
                </div>
                <div>
                  <span className="text-white/50">Location:</span> {currentStory.location}
                </div>
              </div>

              {/* Play Button Pill */}
              <div>
                <button
                  onClick={handleTriggerEmily}
                  className="size-14 rounded-2xl bg-white text-[#141413] hover:bg-[#FAF9F5] flex items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer"
                  title="Play customer story video"
                >
                  <Play className="size-5 fill-current ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Wall below Customer Proof */}
        <div className="mt-16 pt-8 border-t border-[#E8E6DC] flex flex-wrap items-center justify-between gap-8 opacity-80">
          <div className="font-bold text-2xl tracking-tight text-[#141413]">Uber</div>
          <div className="font-bold text-2xl tracking-tight text-[#635BFF]">stripe</div>
          <div className="flex items-center gap-2 font-semibold text-lg text-[#141413]">
            <span className="size-5 rounded-full border-2 border-orange-500 border-dashed animate-spin-slow" />
            <span>Thomson Reuters</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-xl text-[#141413]">
            <span className="text-2xl leading-none">●</span>
            <span>Spotify</span>
          </div>
          <div className="font-serif-anthropic font-bold text-2xl tracking-widest text-[#1A1F71]">
            VISA
          </div>
          <div className="font-serif-anthropic font-medium text-lg text-[#141413]">
            Banner Health
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BUILT FOR ENTERPRISE (Divider, Skyscraper icon, 3 Columns, Review Card)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <BuildingTowerIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413]">
            Built for enterprise
          </h2>
        </div>

        {/* 3 Top Columns with subtle vertical dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E6DC] mb-16">
          {/* Column 1 */}
          <div className="pb-8 md:pb-0 md:pr-10">
            <div className="text-[#141413] mb-6">
              <LightbulbIcon className="size-7" />
            </div>
            <h3 className="font-serif-anthropic text-xl sm:text-2xl font-semibold text-[#141413] mb-3">
              Built on the best models
            </h3>
            <p className="text-sm sm:text-base text-[#5E5D59] leading-relaxed">
              Claude leads on reasoning, coding, and analysis benchmarks. The same frontier models power every surface, from business apps to developer tools.
            </p>
          </div>

          {/* Column 2 */}
          <div className="py-8 md:py-0 md:px-10">
            <div className="text-[#141413] mb-6">
              <ShieldCheckIcon className="size-7" />
            </div>
            <h3 className="font-serif-anthropic text-xl sm:text-2xl font-semibold text-[#141413] mb-3">
              No model training by default
            </h3>
            <p className="text-sm sm:text-base text-[#5E5D59] leading-relaxed">
              Your prompts, data, and results are not used to train our models by default. Review our data practices at the Trust Center.
            </p>
          </div>

          {/* Column 3 */}
          <div className="pt-8 md:pt-0 md:pl-10">
            <div className="text-[#141413] mb-6">
              <SplitRectIcon className="size-7" />
            </div>
            <h3 className="font-serif-anthropic text-xl sm:text-2xl font-semibold text-[#141413] mb-3">
              Flexible by design
            </h3>
            <p className="text-sm sm:text-base text-[#5E5D59] leading-relaxed">
              Pick the products and platform that are right for your teams, whether you’re collaborating with Claude at work or building your own products and offerings.
            </p>
          </div>
        </div>

        {/* Bottom Card: "Made to pass security review" */}
        <div className="rounded-3xl bg-[#F0EDE5] p-8 sm:p-12 border border-[#E8E6DC]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Side (approx 4.5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-[#141413]">
                <DocumentMagnifierIcon className="size-8" />
              </div>
              <h3 className="font-serif-anthropic text-2xl sm:text-3xl font-semibold text-[#141413] tracking-tight leading-tight">
                Made to pass security review
              </h3>
              <p className="text-sm sm:text-base text-[#5E5D59] leading-relaxed max-w-sm">
                The security, compliance, and admin controls your organization needs.
              </p>
              <div>
                <button
                  onClick={handleTriggerEmily}
                  className="px-4 py-2 rounded-lg bg-white border border-[#D5D3CA] text-xs sm:text-sm font-medium text-[#141413] hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                >
                  Learn more
                </button>
              </div>
              <div className="pt-6 text-[11px] text-[#87867F]">
                *Data retention controls and OTEL monitoring are currently available on Claude Enterprise only.
              </div>
            </div>

            {/* Right Side (approx 7.5 cols): 2-Column Checklist */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs sm:text-sm text-[#141413]">
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Single sign-on (SSO/SAML) and domain capture</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>SOC 2, ISO 27001, GDPR, and CCPA compliance</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Usage analytics and reporting</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>SCIM provisioning</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Spend controls</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Data retention controls*</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Compliance API</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>HIPAA-ready offering</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Audit logs and OpenTelemetry monitoring*</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="size-4 text-[#141413] shrink-0 mt-0.5" />
                <span>Role-based access control (RBAC)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BRING CLAUDE TO YOUR ENTERPRISE TWO WAYS
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <SquareTriangleIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413] mb-3">
            Bring Claude to your enterprise two ways
          </h2>
          <p className="text-base sm:text-lg text-[#5E5D59]">
            Deploy Claude to your workforce or build it into your products.
          </p>
        </div>

        {/* Row 1: Claude Enterprise */}
        <div className="py-10 border-t border-[#E8E6DC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3 flex items-center gap-3">
            <span className="text-[#141413]">
              <BuildingTowerIcon className="size-7" />
            </span>
            <h3 className="font-serif-anthropic text-2xl font-semibold text-[#141413]">
              Claude Enterprise
            </h3>
          </div>
          <div className="lg:col-span-6 space-y-4">
            <p className="text-sm sm:text-base text-[#5E5D59] leading-relaxed">
              Give every employee secure access to Chat, Claude Cowork, Claude Code, and your company’s connectors. Get the admin controls, management, and visibility your IT and security teams need.
            </p>
            <button
              onClick={handleTriggerEmily}
              className="px-4 py-2 rounded-lg border border-[#D5D3CA] text-xs sm:text-sm font-medium text-[#141413] hover:bg-[#EBE8DF] transition-colors cursor-pointer"
            >
              See plans
            </button>
          </div>
          <div className="lg:col-span-3">
            {/* Spotify 90% Stat Card */}
            <div className="rounded-2xl border border-[#E8E6DC] bg-[#FAF9F5] p-5">
              <div className="text-[11px] text-[#87867F] font-medium mb-3">
                Results with Claude Code
              </div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-[#141413] mb-3">
                <span className="text-base leading-none">●</span>
                <span>Spotify</span>
              </div>
              <div className="text-4xl font-serif-anthropic font-bold text-[#141413] leading-none mb-1">
                90%
              </div>
              <div className="text-xs text-[#5E5D59]">
                less time spent on complex code migrations
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Claude Platform */}
        <div
          id="platform"
          className="py-10 border-t border-b border-[#E8E6DC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-3 flex items-center gap-3">
            <span className="text-[#141413]">
              <CodeWindowIcon className="size-7" />
            </span>
            <h3 className="font-serif-anthropic text-2xl font-semibold text-[#141413]">
              Claude Platform
            </h3>
          </div>
          <div className="lg:col-span-6 space-y-4">
            <p className="text-sm sm:text-base text-[#5E5D59] leading-relaxed">
              Access the Claude API to power new experiences, ship production-grade agents, and integrate Claude into the workflows and applications you’re building.
            </p>
            <button
              onClick={handleTriggerEmily}
              className="px-4 py-2 rounded-lg border border-[#D5D3CA] text-xs sm:text-sm font-medium text-[#141413] hover:bg-[#EBE8DF] transition-colors cursor-pointer"
            >
              Explore the platform
            </button>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#E8E6DC] bg-[#FAF9F5] p-5">
              <div className="text-[11px] text-[#87867F] font-medium mb-2">
                Frontier API Performance
              </div>
              <div className="text-sm font-semibold text-[#141413] mb-1">
                Claude 3.7 Sonnet & 3.5 Opus
              </div>
              <div className="text-xs text-[#5E5D59]">
                Highest coding and agentic reasoning benchmarks available worldwide.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SECURE PRODUCTS FOR EMPLOYEES
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <TwoHandsIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413] leading-tight max-w-2xl mx-auto">
            Secure products for employees, everywhere your teams work
          </h2>
        </div>

        {/* Tab Pills */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 rounded-full bg-[#EBE8DF] gap-1">
            <button
              onClick={() => setProductTab('code')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                productTab === 'code'
                  ? 'bg-white text-[#141413] shadow-sm'
                  : 'text-[#5E5D59] hover:text-[#141413]'
              }`}
            >
              &lt;/&gt; Claude Code
            </button>
            <button
              onClick={() => setProductTab('cowork')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                productTab === 'cowork'
                  ? 'bg-white text-[#141413] shadow-sm'
                  : 'text-[#5E5D59] hover:text-[#141413]'
              }`}
            >
              Claude Cowork
            </button>
            <button
              onClick={() => setProductTab('chat')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                productTab === 'chat'
                  ? 'bg-white text-[#141413] shadow-sm'
                  : 'text-[#5E5D59] hover:text-[#141413]'
              }`}
            >
              Claude Chat
            </button>
            <span className="px-3 py-1.5 text-xs text-[#87867F] select-none">···</span>
          </div>
        </div>

        {/* Video / Photo Preview Container */}
        <div className="rounded-3xl overflow-hidden relative shadow-sm border border-[#E8E6DC] min-h-[420px] sm:min-h-[480px] bg-[#E8E1D5] flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
          {/* Developer pair programming visual representation */}
          <div className="text-center relative z-20 space-y-4 max-w-lg px-4">
            <button
              onClick={handleTriggerEmily}
              className="size-16 rounded-2xl bg-white/90 backdrop-blur-sm text-[#141413] hover:bg-white flex items-center justify-center mx-auto transition-transform hover:scale-105 shadow-lg cursor-pointer"
            >
              <Play className="size-6 fill-current ml-0.5" />
            </button>
            <div className="text-white text-lg font-serif-anthropic font-medium drop-shadow-sm">
              {productTab === 'code' && 'Watch: Building and testing code directly in the terminal'}
              {productTab === 'cowork' && 'Watch: Delegating complex documents and research tasks'}
              {productTab === 'chat' && 'Watch: Everyday reasoning and synthesis with Claude 3.7'}
            </div>
          </div>
        </div>

        {/* Tailor Claude to your business card */}
        <div className="rounded-3xl bg-[#F0EDE5] p-6 sm:p-10 border border-[#E8E6DC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="text-[#141413] mt-1 shrink-0">
              <BuildingTowerIcon className="size-8" />
            </span>
            <div>
              <h3 className="font-serif-anthropic text-xl sm:text-2xl font-semibold text-[#141413] mb-1">
                Tailor Claude to your business
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed max-w-2xl">
                Connect to Gmail, Google Drive, Slack and more to give Claude context from across your stack. Use Claude directly inside Microsoft 365 or with Google Chrome.
              </p>
            </div>
          </div>
          <button
            onClick={handleTriggerEmily}
            className="px-5 py-2.5 rounded-lg bg-[#141413] text-white text-xs sm:text-sm font-medium hover:bg-[#30302E] transition-colors shrink-0 cursor-pointer"
          >
            Learn more
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. REAL WORK, ACROSS EVERY FUNCTION (Department tabs & terminal)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <HandOkIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413]">
            Real work, across every function
          </h2>
        </div>

        {/* Function Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2">
          <div className="inline-flex items-center p-1 rounded-full bg-[#EBE8DF] gap-1">
            {FUNCTION_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFunction(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  activeFunction === tab.id
                    ? 'bg-white text-[#141413] shadow-sm'
                    : 'text-[#5E5D59] hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="px-3 py-1.5 text-xs text-[#87867F] select-none">···</span>
          </div>
        </div>

        {/* Terminal Display Card */}
        <div className="rounded-3xl bg-[#D2D4DE] p-6 sm:p-12 border border-[#C5C8D4] flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl bg-[#141413] text-white shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
            {/* macOS window dots bar */}
            <div className="px-4 py-3 bg-[#1F1E1D] border-b border-[#30302E] flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#FF5F56] opacity-80" />
              <span className="size-3 rounded-full bg-[#FFBD2E] opacity-80" />
              <span className="size-3 rounded-full bg-[#27C93F] opacity-80" />
              <span className="ml-2 text-[11px] text-[#87867F] font-sans">
                {activeFunctionData.terminalHeader}
              </span>
            </div>

            {/* Terminal text output */}
            <div className="p-6 sm:p-8 space-y-2 text-[#FAF9F5] leading-relaxed">
              {activeFunctionData.terminalLines.map((line, idx) => (
                <div key={idx} className={line.startsWith('*') ? 'text-[#D97757] font-semibold' : ''}>
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. GET THE ENTERPRISE PLAN (Pricing Section)
         ───────────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12"
      >
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <HangerIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413] mb-4">
            Get the Enterprise plan
          </h2>
          <div>
            <button
              onClick={handleTriggerEmily}
              className="px-4 py-2 rounded-lg border border-[#D5D3CA] text-xs sm:text-sm font-medium text-[#141413] hover:bg-[#EBE8DF] transition-colors cursor-pointer"
            >
              Explore features
            </button>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-[#E8E6DC] p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="text-[#141413]">
                <StorefrontIcon className="size-9" />
              </div>
              <h3 className="font-serif-anthropic text-3xl font-semibold text-[#141413]">
                Enterprise
              </h3>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Get started today. Includes Enterprise security and compliance, chat, Claude Code, Cowork, connectors, SSO, SCIM, audit logs, and more.
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-4 md:border-l md:border-[#E8E6DC] md:pl-8">
              <div>
                <div className="text-4xl sm:text-5xl font-serif-anthropic font-bold text-[#141413]">
                  $20
                </div>
                <div className="text-xs text-[#5E5D59] mt-1 font-medium">
                  Per seat / month, billed annually.
                </div>
                <div className="text-xs text-[#87867F] mt-1 leading-normal">
                  Usage is billed as you go at API rates, based on what your team uses. Annual commitment required. Minimum 20 seats.
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {/* Button 1: Get the Enterprise plan (solid black) -> Triggers Emily */}
                <button
                  onClick={handleTriggerEmily}
                  className="w-full py-3 rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors cursor-pointer"
                >
                  Get the Enterprise plan
                </button>

                {/* Button 2: Chat with buying specialist (oat/beige) -> Triggers Emily */}
                <button
                  onClick={handleTriggerEmily}
                  className="w-full py-3 rounded-lg bg-[#E3DACC] text-[#141413] text-sm font-medium hover:bg-[#D5CABB] transition-colors cursor-pointer"
                >
                  Chat with buying specialist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. BUILD ON THE CLAUDE PLATFORM
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <CodeWindowIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413] mb-3">
            Build on the Claude Platform
          </h2>
          <p className="text-base sm:text-lg text-[#5E5D59] mb-4">
            Give developers access to the API to build AI-enabled products, services, and agents.
          </p>
          <div>
            <button
              onClick={handleTriggerEmily}
              className="px-4 py-2 rounded-lg border border-[#D5D3CA] text-xs sm:text-sm font-medium text-[#141413] hover:bg-[#EBE8DF] transition-colors cursor-pointer"
            >
              View documentation
            </button>
          </div>
        </div>

        {/* 3 Primitives Rows with Canva & Code Modernization Side Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Canva Card */}
          <div className="lg:col-span-3 rounded-2xl border border-[#E8E6DC] bg-white p-6">
            <div className="text-xs text-[#87867F] font-medium mb-4">Customer story</div>
            <div className="font-serif-anthropic font-bold text-3xl text-[#00C4CC] mb-3">
              Canva
            </div>
            <p className="text-xs sm:text-sm text-[#5E5D59] mb-6">
              Canva empowers employees across teams with Claude.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerEmily}
                className="size-7 rounded-full border border-[#D5D3CA] flex items-center justify-center text-xs"
              >
                ←
              </button>
              <span className="size-1.5 rounded-full bg-[#141413]" />
              <span className="size-1.5 rounded-full bg-[#D5D3CA]" />
              <button
                onClick={handleTriggerEmily}
                className="size-7 rounded-full border border-[#D5D3CA] flex items-center justify-center text-xs"
              >
                →
              </button>
            </div>
          </div>

          {/* Center 3 Rows */}
          <div className="lg:col-span-6 divide-y divide-[#E8E6DC]">
            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2 font-serif-anthropic text-xl font-semibold text-[#141413]">
                <SplitRectIcon className="size-5" />
                <span>Primitives</span>
              </div>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Building blocks to integrate Claude, including the Messages API and tools, with full control over every layer.
              </p>
              <button
                onClick={handleTriggerEmily}
                className="px-3 py-1.5 rounded-lg border border-[#D5D3CA] text-xs font-medium text-[#141413] hover:bg-[#EBE8DF]"
              >
                Learn more
              </button>
            </div>

            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2 font-serif-anthropic text-xl font-semibold text-[#141413]">
                <span>♾️</span>
                <span>Harnesses and infrastructure</span>
              </div>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Everything you need to ship production-grade agents, including Claude Managed Agents.
              </p>
              <button
                onClick={handleTriggerEmily}
                className="px-3 py-1.5 rounded-lg border border-[#D5D3CA] text-xs font-medium text-[#141413] hover:bg-[#EBE8DF]"
              >
                Learn more
              </button>
            </div>

            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2 font-serif-anthropic text-xl font-semibold text-[#141413]">
                <span>⚙️</span>
                <span>Operating system</span>
              </div>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Controls to deploy and manage agents across your organization, including authorization, governance, and observability.
              </p>
            </div>
          </div>

          {/* Right Code Modernization Card */}
          <div className="lg:col-span-3 rounded-2xl border border-[#E8E6DC] bg-white p-6">
            <div className="text-xs text-[#87867F] font-medium mb-3">Code modernization</div>
            <div className="h-28 rounded-xl bg-[#D97757] flex items-center justify-center text-white mb-4">
              <span className="text-3xl">⏱️</span>
            </div>
            <p className="text-xs sm:text-sm text-[#5E5D59] leading-relaxed mb-4">
              Modernize legacy code without starting over. Claude Code handles large-scale refactoring while keeping your existing business logic intact.
            </p>
            <button
              onClick={handleTriggerEmily}
              className="px-3 py-1.5 rounded-lg border border-[#D5D3CA] text-xs font-medium text-[#141413] hover:bg-[#EBE8DF]"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Two Comparison Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-[#F0EDE5] p-8 border border-[#E8E6DC] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[#141413]">
                <Check className="size-4" />
                <span>Pay-as-you-go pricing</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#141413]">
                <Check className="size-4" />
                <span>Self-serve deployment on workbench</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#141413]">
                <Check className="size-4" />
                <span>Prompting guides and developer docs</span>
              </div>
            </div>
            <button
              onClick={handleTriggerEmily}
              className="w-full py-3 rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors cursor-pointer"
            >
              Start building
            </button>
          </div>

          <div className="rounded-3xl bg-[#F0EDE5] p-8 border border-[#E8E6DC] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-[#141413]">
                <Check className="size-4" />
                <span>Billing via monthly invoices</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#141413]">
                <Check className="size-4" />
                <span>Prompting support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#141413]">
                <Check className="size-4" />
                <span>Deployment support</span>
              </div>
            </div>
            <button
              onClick={handleTriggerEmily}
              className="w-full py-3 rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors cursor-pointer"
            >
              Contact sales
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FAQ SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Centered Line Icon & Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <QuestionCoinIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413]">
            FAQ
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1 rounded-full bg-[#EBE8DF] gap-1">
            {FAQ_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setFaqCategory(sec.id);
                  setOpenFaqIndex(0);
                }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  faqCategory === sec.id
                    ? 'bg-white text-[#141413] shadow-sm'
                    : 'text-[#5E5D59] hover:text-[#141413]'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Title & Accordion Items */}
        <div className="max-w-3xl mx-auto">
          <h3 className="font-serif-anthropic text-2xl font-semibold text-[#141413] mb-6">
            {FAQ_SECTIONS.find((s) => s.id === faqCategory)?.label}
          </h3>

          <div className="divide-y divide-[#E8E6DC] border-t border-b border-[#E8E6DC]">
            {currentFaqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-serif-anthropic text-lg sm:text-xl text-[#141413] hover:text-[#5E5D59] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#87867F] ml-4 shrink-0">
                      {isOpen ? <Minus className="size-5" /> : <Plus className="size-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-sm text-[#5E5D59] leading-relaxed font-sans pr-8">
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
          11. DARK FOOTER CTA & FOOTER
         ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#141413] text-white pt-24 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
          {/* Main Dark CTA Heading */}
          <h2 className="font-serif-anthropic text-4xl sm:text-6xl font-normal tracking-tight leading-tight mb-8 max-w-3xl mx-auto">
            Ready to bring Claude to your organization?
          </h2>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-20">
            <button
              onClick={handleTriggerEmily}
              className="px-6 py-3 rounded-lg bg-white text-[#141413] text-sm font-medium hover:bg-[#FAF9F5] transition-colors cursor-pointer"
            >
              Get Enterprise plan
            </button>
            <a
              href="#platform"
              className="px-6 py-3 rounded-lg bg-[#262624] text-white text-sm font-medium hover:bg-[#30302E] transition-colors inline-block"
            >
              Build on Claude Platform
            </a>
          </div>

          {/* White Brand Logos Row */}
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 pb-20 border-b border-[#30302E] opacity-70">
            <div className="flex items-center gap-2 font-semibold text-lg text-white">
              <span className="size-5 rounded-full border-2 border-white/70 border-dashed" />
              <span>Thomson Reuters</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-xl text-white">
              <span className="text-2xl leading-none">●</span>
              <span>Spotify</span>
            </div>
            <div className="font-bold text-xl text-white tracking-wider">Rakuten</div>
            <div className="border border-white/80 px-2 py-0.5 text-sm font-serif-anthropic tracking-widest">
              AIG
            </div>
          </div>

          {/* Global Footer Links Grid */}
          <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12 text-left text-xs">
            {/* Left Brand + Help Input */}
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-[#D97757] text-2xl font-bold leading-none select-none">✻</span>
                <span className="font-serif-anthropic text-2xl font-semibold tracking-tight text-white">
                  Claude
                </span>
              </div>
              <div className="relative max-w-sm">
                <input
                  type="text"
                  placeholder="How can I help you today?"
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#262624] text-xs text-white border border-[#30302E] focus:outline-none focus:border-[#D97757]"
                />
                <button
                  onClick={handleTriggerEmily}
                  className="size-7 rounded-lg bg-[#D97757] text-white flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  ↑
                </button>
              </div>
            </div>

            {/* Link Columns */}
            <div className="md:col-span-2 space-y-3">
              <div className="text-white/40 font-medium">Products</div>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Claude</a></li>
                <li><a href="#" className="hover:text-white">Claude Code</a></li>
                <li><a href="#" className="hover:text-white">Claude Code for Enterprise</a></li>
                <li><a href="#" className="hover:text-white">Claude Cowork</a></li>
                <li><a href="#" className="hover:text-white">@Claude</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="text-white/40 font-medium">Solutions</div>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">AI agents</a></li>
                <li><a href="#" className="hover:text-white">Code modernization</a></li>
                <li><a href="#" className="hover:text-white">Coding</a></li>
                <li><a href="#" className="hover:text-white">Commerce</a></li>
                <li><a href="#" className="hover:text-white">Customer support</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="text-white/40 font-medium">Resources</div>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Claude partner network</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
                <li><a href="#" className="hover:text-white">Connectors</a></li>
                <li><a href="#" className="hover:text-white">Courses</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <div className="text-white/40 font-medium">Programs</div>
              <ul className="space-y-2 text-white/80">
                <li><a href="#" className="hover:text-white">Startups</a></li>
                <li><a href="#" className="hover:text-white">Scientists</a></li>
                <li className="pt-4 text-white/40 font-medium">Help and security</li>
                <li><a href="#" className="hover:text-white">Availability</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Terms */}
          <div className="pt-8 border-t border-[#30302E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 text-left">
            <div>© {new Date().getFullYear()} Anthropic PBC. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Cookie Preferences</a>
              <span>English (US)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. BUYER CONFIGURATION MODAL (For Agora AI Sales Agent Emily)
         ───────────────────────────────────────────────────────────── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#FAF9F5] border border-[#E8E6DC] p-6 sm:p-8 shadow-2xl relative text-[#141413]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E6DC] mb-6">
              <div className="flex items-center gap-2">
                <span className="text-[#D97757] text-xl font-bold">✻</span>
                <span className="font-serif-anthropic text-xl font-semibold text-[#141413]">
                  Contact Enterprise Sales · Emily AI
                </span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="size-8 rounded-full bg-white border border-[#E8E6DC] flex items-center justify-center text-[#5E5D59] hover:text-[#141413] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#5E5D59] mb-6 leading-relaxed">
              Connect directly with Emily, our real-time AI enterprise specialist. She will evaluate your seat tier, calculate custom volume concessions, and walk through compliance prerequisites.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <User className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87867F]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E8E6DC] bg-white text-sm text-[#141413] focus:outline-none focus:border-[#D97757]"
                    placeholder="Tina"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87867F]" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E8E6DC] bg-white text-sm text-[#141413] focus:outline-none focus:border-[#D97757]"
                    placeholder="Razorpay"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#141413] mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#87867F]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#E8E6DC] bg-white text-sm text-[#141413] focus:outline-none focus:border-[#D97757]"
                    placeholder="gargiesingh321@gmail.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#141413]">
                    Seat Count ({seats} seats)
                  </label>
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
                  className="w-full accent-[#141413] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#87867F] mt-1 font-mono">
                  <span>20 seats (min)</span>
                  <span>100 seats</span>
                  <span>500+ seats</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmCall}
              disabled={isConnecting}
              className="w-full py-3.5 rounded-xl bg-[#141413] text-white font-medium text-sm hover:bg-[#30302E] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="size-4 text-[#D97757]" />
              <span>{isConnecting ? 'Connecting with Emily...' : 'Start Voice Call with Emily'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
