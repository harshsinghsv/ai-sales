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
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';

interface LandingPageProps {
  onStartCall: (info: { name: string; company: string; email: string; seats: number }) => void;
  isConnecting: boolean;
}

/* ==========================================================================
   EXACT ANTHROPIC PRODUCTION SVGS & ICONS
   ========================================================================== */

// Building Skyscraper icon for "Built for enterprise" & "Claude Enterprise"
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

// Square & Triangle icon for "Bring Claude to your enterprise two ways"
const SquareTriangleIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="10" y="10" width="16" height="16" />
    <circle cx="18" cy="18" r="3" />
    <path d="M24 24L38 38H18L24 24Z" />
  </svg>
);

// Two Hands icon for "Secure products for employees, everywhere your teams work"
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

// Hand OK icon for "Real work, across every function"
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

// Hanger icon for "Get the Enterprise plan"
const HangerIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="24" cy="12" r="3" strokeDasharray="16 4" />
    <path d="M24 15V19L10 30H38L24 19Z" />
    <path d="M10 30H38" />
  </svg>
);

// Code Window icon for "Build on the Claude Platform"
const CodeWindowIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <rect x="8" y="10" width="32" height="28" rx="2" />
    <line x1="8" y1="16" x2="40" y2="16" />
    <path d="M18 24L14 28L18 32" />
    <path d="M30 24L34 28L30 32" />
    <line x1="26" y1="23" x2="22" y2="33" />
  </svg>
);

// Question Coin icon for FAQ
const QuestionCoinIcon: React.FC<{ className?: string }> = ({ className = 'size-12' }) => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <ellipse cx="24" cy="24" rx="14" ry="16" />
    <path d="M21 20C21 17.5 22.5 16 24 16C25.5 16 27 17.5 27 19C27 21 24 22.5 24 24.5V26" />
    <circle cx="24" cy="30" r="1.5" fill="currentColor" />
  </svg>
);

// Pillar Icons
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

// EXACT SVGS FROM CLAUDE.COM PRIMITIVES
const PrimitivesSvg: React.FC<{ className?: string }> = ({ className = 'size-5' }) => (
  <svg viewBox="0 0 18 18" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.1002 2.69995C8.84578 2.69995 9.4502 3.30437 9.4502 4.04995V8.54995H13.9502C14.6958 8.54995 15.3002 9.15437 15.3002 9.89995V13.95C15.3002 14.6955 14.6958 15.3 13.9502 15.3H4.0502C3.30461 15.3 2.7002 14.6955 2.7002 13.95V4.04995C2.7002 3.30437 3.30461 2.69995 4.0502 2.69995H8.1002ZM3.6002 13.95C3.6002 14.1985 3.80167 14.4 4.0502 14.4H8.5502V9.44995H3.6002V13.95ZM9.4502 14.4H13.9502C14.1987 14.4 14.4002 14.1985 14.4002 13.95V9.89995C14.4002 9.65142 14.1987 9.44995 13.9502 9.44995H9.4502V14.4ZM4.0502 3.59995C3.80167 3.59995 3.6002 3.80142 3.6002 4.04995V8.54995H8.5502V4.04995C8.5502 3.80142 8.34872 3.59995 8.1002 3.59995H4.0502Z"
      fill="currentColor"
    />
  </svg>
);

const HarnessesSvg: React.FC<{ className?: string }> = ({ className = 'size-5' }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 2.5C5.93171 2.5 6.71235 3.13768 6.93457 4H13.75C15.5449 4 17 5.45507 17 7.25C17 9.04493 15.5449 10.5 13.75 10.5H12.707L10.3535 12.8535C10.1583 13.0488 9.84175 13.0488 9.64648 12.8535L7.29297 10.5H6.25C5.00736 10.5 4 11.5074 4 12.75C4 13.9926 5.00736 15 6.25 15H13.0654C13.2877 14.1377 14.0683 13.5 15 13.5C16.1046 13.5 17 14.3954 17 15.5C17 16.6046 16.1046 17.5 15 17.5C14.0683 17.5 13.2877 16.8623 13.0654 16H6.25C4.45507 16 3 14.5449 3 12.75C3 10.9551 4.45507 9.5 6.25 9.5H7.29297L9.64648 7.14648L9.72461 7.08203C9.91869 6.95387 10.1827 6.97562 10.3535 7.14648L12.707 9.5H13.75C14.9926 9.5 16 8.49264 16 7.25C16 6.00736 14.9926 5 13.75 5H6.93457C6.71235 5.86232 5.93171 6.5 5 6.5C3.89543 6.5 3 5.60457 3 4.5C3 3.39543 3.89543 2.5 5 2.5ZM15 14.5C14.4477 14.5 14 14.9477 14 15.5C14 16.0523 14.4477 16.5 15 16.5C15.5523 16.5 16 16.0523 16 15.5C16 14.9477 15.5523 14.5 15 14.5ZM8.20703 10L10 11.793L11.793 10L10 8.20703L8.20703 10ZM5 3.5C4.44772 3.5 4 3.94772 4 4.5C4 5.05228 4.44772 5.5 5 5.5C5.55228 5.5 6 5.05228 6 4.5C6 3.94772 5.55228 3.5 5 3.5Z"
      fill="currentColor"
    />
  </svg>
);

const OperatingSystemSvg: React.FC<{ className?: string }> = ({ className = 'size-5' }) => (
  <svg viewBox="0 0 18 18" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.84922 11.7C6.09775 11.7 6.29922 11.9014 6.29922 12.15V13.05H14.8492L14.9397 13.0587C15.1449 13.1006 15.2992 13.2824 15.2992 13.5C15.2992 13.7175 15.1449 13.8993 14.9397 13.9412L14.8492 13.95H6.29922V14.85C6.29922 15.0985 6.09775 15.3 5.84922 15.3C5.60069 15.3 5.39922 15.0985 5.39922 14.85V12.15C5.39922 11.9014 5.60069 11.7 5.84922 11.7ZM4.13975 13.0587C4.34492 13.1006 4.49922 13.2824 4.49922 13.5C4.49922 13.7175 4.34492 13.8993 4.13975 13.9412L4.04922 13.95H3.14922C2.90069 13.95 2.69922 13.7485 2.69922 13.5C2.69922 13.2514 2.90069 13.05 3.14922 13.05H4.04922L4.13975 13.0587ZM12.1492 7.19995C12.3977 7.19995 12.5992 7.40142 12.5992 7.64995V8.54995H14.8492C15.0977 8.54995 15.2992 8.75142 15.2992 8.99995C15.2992 9.24848 15.0977 9.44995 14.8492 9.44995H12.5992V10.35C12.5992 10.5985 12.3977 10.8 12.1492 10.8C11.9007 10.8 11.6992 10.5985 11.6992 10.35V7.64995C11.6992 7.40142 11.9007 7.19995 12.1492 7.19995ZM10.3492 8.54995C10.5977 8.54995 10.7992 8.75142 10.7992 8.99995C10.7992 9.24848 10.5977 9.44995 10.3492 9.44995H3.14922C2.90069 9.44995 2.69922 9.24848 2.69922 8.99995C2.69922 8.75142 2.90069 8.54995 3.14922 8.54995H10.3492ZM7.64922 2.69995C7.89775 2.69995 8.09922 2.90142 8.09922 3.14995V4.04995H14.8492C15.0977 4.04995 15.2992 4.25142 15.2992 4.49995C15.2992 4.74848 15.0977 4.94995 14.8492 4.94995H8.09922V5.84995C8.09922 6.09848 7.89775 6.29995 7.64922 6.29995C7.40069 6.29995 7.19922 6.09848 7.19922 5.84995V3.14995C7.19922 2.90142 7.40069 2.69995 7.64922 2.69995ZM5.84922 4.04995C6.09775 4.04995 6.29922 4.25142 6.29922 4.49995C6.29922 4.74848 6.09775 4.94995 5.84922 4.94995H3.14922C2.90069 4.94995 2.69922 4.74848 2.69922 4.49995C2.69922 4.25142 2.90069 4.04995 3.14922 4.04995H5.84922Z"
      fill="currentColor"
    />
  </svg>
);

/* ==========================================================================
   CUSTOMER STORIES DATA (with exact Claude production assets)
   ========================================================================== */

const CUSTOMER_STORIES = [
  {
    company: 'Slack',
    logoUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a0d20d86e2e21026f727e59_89841d2905da18d6e333fb3720070ec2_Group.svg',
    posterUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a15ee129364c8e55411daa2_enterprise-hero-slack.webp',
    industry: 'Software',
    size: 'Large',
    product: 'Claude Platform',
    location: 'North America',
    quote:
      'Slack’s close collaboration with Anthropic has helped our Engineering and Product teams accelerate prototyping and model testing.',
    statNumber: '97',
    statLabel: 'minutes per week saved by the average user through summarization and recap features',
  },
  {
    company: 'Lyft',
    logoUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a0d23e997ef8c84873e4a85_lyft-logo.svg',
    posterUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a15f7a04498773d51289cc4_frame-8.webp',
    industry: 'Transportation',
    size: 'Large',
    product: 'Claude Platform',
    location: 'North America',
    quote:
      'Through using Claude, we’ve saved millions, which we have reinvested in upskilling our customer support agents. We’ve empowered our agents to focus on those more complex issues that really require human care.',
    statNumber: '87%',
    statLabel: 'reduction in customer support processing time with 30% more accurate decisions',
  },
  {
    company: 'Notion',
    logoUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a10983f2f16955d1e463573_logo_notion-dark.svg',
    posterUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a20844b09195003a0053c2c_notion_sizzle_reel_thumb.webp',
    industry: 'Productivity',
    size: 'Large',
    product: 'Claude Platform',
    location: 'North America',
    quote:
      'Anthropic and Claude have fundamentally accelerated how millions of knowledge workers organize, draft, and collaborate with connected intelligence.',
    statNumber: '3x',
    statLabel: 'increase in user workflow speed across Notion AI workspace queries',
  },
  {
    company: 'Allianz',
    logoUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a16012ced85b2c17b03ad8a_allianz-logo.svg',
    posterUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a15ee129364c8e55411daa2_enterprise-hero-slack.webp',
    industry: 'Insurance',
    size: 'Large',
    product: 'Claude Platform',
    location: 'Europe',
    quote:
      'With this partnership, Allianz is taking a decisive step to address critical AI challenges in insurance. Anthropic’s focus on safety and transparency complements our strong dedication to customer excellence and stakeholder trust.',
    statNumber: '90%',
    statLabel: 'growth company-wide deployment with rapid global workforce adoption',
  },
];

/* ==========================================================================
   PRODUCT TABS CONTENT (with exact video posters)
   ========================================================================== */

const SECURE_PRODUCTS = {
  code: {
    label: 'Claude Code',
    poster: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/69fcfdb277363bbe323dfd39_maxresdefault.jpg',
    title: 'Code faster across your enterprise stack',
    desc: 'Build, debug, and ship using natural language from your terminal, IDE, Slack, or the web. Claude Code works wherever your team does.',
  },
  cowork: {
    label: 'Claude Cowork',
    poster: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/69fd0ca45e705644001aa5c1_maxresdefault-1.jpg',
    title: 'Delegate tasks to Claude with Cowork',
    desc: 'Connect your files and tools, then hand off research, documents, and repetitive work. Get polished deliverables back while you focus on the work that needs your judgment.',
  },
  chat: {
    label: 'Claude Chat',
    poster: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/69fd0c0c347227f56f59139f_maxresdefault.jpg',
    title: 'Chat: A thinking partner for everyday work',
    desc: 'Chat with Claude to develop ideas, draft content, tighten reports, work through hard problems, and more with industry-leading reasoning.',
  },
};

/* ==========================================================================
   FUNCTION TABS CONTENT
   ========================================================================== */

const FUNCTION_TABS = [
  {
    id: 'engineering',
    label: 'Engineering',
    icon: '</>',
    type: 'terminal',
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
    type: 'image',
    imgUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a0f1123bba161898ef529be_q1-channel-performance-review.png',
    title: 'Q1 channel performance review',
  },
  {
    id: 'sales',
    label: 'Sales',
    type: 'image',
    imgUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a185be57365d964abe67dea_slack-message.webp',
    title: 'Slack account intelligence brief',
  },
  {
    id: 'product',
    label: 'Product Management',
    type: 'image',
    imgUrl: 'https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a0f12455d61e69f34181f82_q3-prioritization.png',
    title: 'Q3 Product Roadmap Prioritization Matrix',
  },
  {
    id: 'hr',
    label: 'Human Resources',
    type: 'terminal',
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
   FAQ SECTIONS
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
  const activeProductData = SECURE_PRODUCTS[productTab];
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
          2. HERO SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="pt-16 sm:pt-24 pb-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="text-sm sm:text-base text-[#5E5D59] mb-4">
            Claude enterprise solutions
          </div>

          {/* Headline */}
          <h1 className="font-serif-anthropic text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#141413] leading-[1.05] mb-6">
            The frontier, on every desk
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#383734] leading-relaxed mb-8 max-w-2xl font-normal">
            Put Claude to work across your organization. Help everyone think deeper, do more, and build securely.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerEmily}
              disabled={isConnecting}
              className="px-5 py-3 rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors cursor-pointer active:scale-[0.99]"
            >
              Get Enterprise plan
            </button>

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
          3. CUSTOMER PROOF CAROUSEL (Real video background + white card elements)
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

        {/* Carousel Container with Peeking Sides */}
        <div className="relative">
          <div className="w-full rounded-3xl overflow-hidden relative shadow-md min-h-[460px] sm:min-h-[520px] flex flex-col justify-between p-8 sm:p-14 text-white bg-[#181410]">
            {/* Real Customer Photographic / Video Background */}
            <img
              src={currentStory.posterUrl}
              alt={currentStory.company}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
            {/* Gradient Scrim Overlay for Perfect Typography Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 z-10" />

            {/* Top Row: Company Brand Logo */}
            <div className="relative z-20 flex items-center justify-between">
              <img
                src={currentStory.logoUrl}
                alt={currentStory.company}
                className="h-8 brightness-0 invert max-w-[140px] object-contain"
              />
            </div>

            {/* Middle: Serif Quote in crisp white typography */}
            <div className="relative z-20 my-8 max-w-3xl">
              <blockquote className="font-serif-anthropic text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-[1.25]">
                “{currentStory.quote}”
              </blockquote>
            </div>

            {/* Bottom Row: Metric, Metadata, and Video Play Pill */}
            <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-6 border-t border-white/20">
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
                  <svg className="size-5 ml-0.5" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M5 4L15 10L5 16V4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Exact Logo Wall below Customer Proof */}
        <div className="mt-16 pt-8 border-t border-[#E8E6DC] flex flex-wrap items-center justify-between gap-8 opacity-80">
          <img
            src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68c47a3df6f37b772965a5c4_uber.svg"
            alt="Uber"
            className="h-6 object-contain"
          />
          <img
            src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5adf8d23ff734739d3a80_Stripe_light.svg"
            alt="Stripe"
            className="h-7 object-contain"
          />
          <img
            src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a186e574d077d020536326e_thomson_reuters_logo_white.svg"
            alt="Thomson Reuters"
            className="h-7 object-contain brightness-0"
          />
          <img
            src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a18b4fac9a204dd3aef4556_spotify-logo-black.svg"
            alt="Spotify"
            className="h-7 object-contain"
          />
          <img
            src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5ae674813a930db5dcaf7_Visa_light.svg"
            alt="Visa"
            className="h-5 object-contain"
          />
          <img
            src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/695fcaf6e759325a5107816e_banner-health-dark.svg"
            alt="Banner Health"
            className="h-6 object-contain"
          />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BUILT FOR ENTERPRISE
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center text-[#141413] mb-4">
            <BuildingTowerIcon className="size-12" />
          </div>
          <h2 className="font-serif-anthropic text-4xl sm:text-5xl font-normal tracking-tight text-[#141413]">
            Built for enterprise
          </h2>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8E6DC] mb-16">
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
            <div className="rounded-2xl border border-[#E8E6DC] bg-[#FAF9F5] p-5">
              <div className="text-[11px] text-[#87867F] font-medium mb-3">
                Results with Claude Code
              </div>
              <img
                src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a18b4fac9a204dd3aef4556_spotify-logo-black.svg"
                alt="Spotify"
                className="h-5 object-contain mb-3"
              />
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
          6. SECURE PRODUCTS FOR EMPLOYEES (With Real Maxresdefault Posters)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
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

        {/* Real Product Tab Media Frame with Play Button */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-[#E8E6DC] aspect-[16/9] max-h-[560px] bg-[#E8E1D5] mb-8 group">
          <img
            src={activeProductData.poster}
            alt={activeProductData.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
            <button
              onClick={handleTriggerEmily}
              className="size-16 sm:size-20 rounded-2xl bg-white/95 text-[#141413] shadow-xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              title="Play demo video"
            >
              <svg className="size-6 sm:size-7 ml-0.5" viewBox="0 0 20 20" fill="none">
                <path
                  d="M6 4L16 10L6 16V4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
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
          7. REAL WORK, ACROSS EVERY FUNCTION
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
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

        {/* Function Artifact / Terminal Display */}
        <div className="rounded-3xl bg-[#D2D4DE] p-6 sm:p-12 border border-[#C5C8D4] flex justify-center">
          {activeFunctionData.type === 'terminal' ? (
            <div className="w-full max-w-3xl rounded-2xl bg-[#141413] text-white shadow-2xl overflow-hidden font-mono text-xs sm:text-sm">
              <div className="px-4 py-3 bg-[#1F1E1D] border-b border-[#30302E] flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#FF5F56] opacity-80" />
                <span className="size-3 rounded-full bg-[#FFBD2E] opacity-80" />
                <span className="size-3 rounded-full bg-[#27C93F] opacity-80" />
                <span className="ml-2 text-[11px] text-[#87867F] font-sans">
                  {activeFunctionData.terminalHeader}
                </span>
              </div>
              <div className="p-6 sm:p-8 space-y-2 text-[#FAF9F5] leading-relaxed">
                {activeFunctionData.terminalLines?.map((line, idx) => (
                  <div
                    key={idx}
                    className={line.startsWith('*') ? 'text-[#D97757] font-semibold' : ''}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl w-full rounded-2xl overflow-hidden shadow-xl border border-[#E8E6DC] bg-white">
              <img
                src={activeFunctionData.imgUrl}
                alt={activeFunctionData.title}
                className="w-full h-auto object-contain"
              />
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. GET THE ENTERPRISE PLAN (Pricing Section)
         ───────────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12"
      >
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
                <button
                  onClick={handleTriggerEmily}
                  className="w-full py-3 rounded-lg bg-[#141413] text-white text-sm font-medium hover:bg-[#30302E] transition-colors cursor-pointer"
                >
                  Get the Enterprise plan
                </button>
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
          9. BUILD ON THE CLAUDE PLATFORM (Exact SVGs, Canva logo & Modernization image)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-[#E8E6DC] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
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

        {/* 3 Primitives Rows with Exact Canva & Code Modernization Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Canva Card */}
          <div className="lg:col-span-3 rounded-2xl border border-[#E8E6DC] bg-white p-6 shadow-sm">
            <div className="text-xs text-[#87867F] font-medium mb-4">Customer story</div>
            <img
              src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5a94baddb6685c1e5410d_Canva_dark.svg"
              alt="Canva"
              className="h-9 mb-4 object-contain"
            />
            <p className="text-xs sm:text-sm text-[#5E5D59] mb-6 leading-relaxed">
              Canva empowers employees across teams with Claude.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTriggerEmily}
                className="size-7 rounded-full border border-[#D5D3CA] flex items-center justify-center text-xs text-[#141413] hover:bg-[#FAF9F5]"
              >
                ←
              </button>
              <span className="size-1.5 rounded-full bg-[#141413]" />
              <span className="size-1.5 rounded-full bg-[#D5D3CA]" />
              <button
                onClick={handleTriggerEmily}
                className="size-7 rounded-full border border-[#D5D3CA] flex items-center justify-center text-xs text-[#141413] hover:bg-[#FAF9F5]"
              >
                →
              </button>
            </div>
          </div>

          {/* Center 3 Rows with Exact Anthropic SVGs */}
          <div className="lg:col-span-6 divide-y divide-[#E8E6DC]">
            <div className="py-6 space-y-3">
              <div className="flex items-center gap-2.5 font-serif-anthropic text-xl font-semibold text-[#141413]">
                <PrimitivesSvg className="size-5 text-[#141413]" />
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
              <div className="flex items-center gap-2.5 font-serif-anthropic text-xl font-semibold text-[#141413]">
                <HarnessesSvg className="size-5 text-[#141413]" />
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
              <div className="flex items-center gap-2.5 font-serif-anthropic text-xl font-semibold text-[#141413]">
                <OperatingSystemSvg className="size-5 text-[#141413]" />
                <span>Operating system</span>
              </div>
              <p className="text-sm text-[#5E5D59] leading-relaxed">
                Controls to deploy and manage agents across your organization, including authorization, governance, and observability.
              </p>
            </div>
          </div>

          {/* Right Code Modernization Card with Real Production Artwork */}
          <div className="lg:col-span-3 rounded-2xl border border-[#E8E6DC] bg-white p-6 shadow-sm">
            <div className="text-xs text-[#87867F] font-medium mb-3">Code modernization</div>
            <div className="w-full rounded-xl overflow-hidden mb-4 bg-[#C97050]">
              <img
                src="https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/6a0c98577898479170a984c0_image%201471.webp"
                alt="Code modernization"
                className="w-full h-auto object-cover"
              />
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

        {/* Accordion */}
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
          <h2 className="font-serif-anthropic text-4xl sm:text-6xl font-normal tracking-tight leading-tight mb-8 max-w-3xl mx-auto">
            Ready to bring Claude to your organization?
          </h2>

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
            <img
              src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a186e574d077d020536326e_thomson_reuters_logo_white.svg"
              alt="Thomson Reuters"
              className="h-6 object-contain"
            />
            <img
              src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6a18b4f8664ebf9777fd1955_spotify-logo-white.svg"
              alt="Spotify"
              className="h-7 object-contain"
            />
            <img
              src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68d5faa6352b26bf7542cb9b_logo_rakuten-light.svg"
              alt="Rakuten"
              className="h-6 object-contain brightness-0 invert"
            />
            <img
              src="https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/68b5a797eb5aba2db4ba3e05_AIG_light.svg"
              alt="AIG"
              className="h-6 object-contain"
            />
          </div>

          {/* Global Footer Links Grid */}
          <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12 text-left text-xs">
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
          12. BUYER CONFIGURATION MODAL (For Emily Voice AI)
         ───────────────────────────────────────────────────────────── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141413]/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-[#FAF9F5] border border-[#E8E6DC] p-6 sm:p-8 shadow-2xl relative text-[#141413]">
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
