'use client';

import React from 'react';
import { CardNav, CardNavItem } from '@/components/reactbits/CardNav';

interface NavbarProps {
  onLaunchDemo: () => void;
  onStartDirectCall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLaunchDemo,
  onStartDirectCall,
}) => {
  const navItems: CardNavItem[] = [
    {
      label: 'Voice Engine',
      bgColor: '#1b1424',
      textColor: '#ffffff',
      links: [
        {
          label: 'Customer Demo (Claude)',
          href: '#demo-showcase',
          ariaLabel: 'View customer demo',
          onClick: onLaunchDemo,
        },
        {
          label: 'Direct Call with Emily',
          href: '#',
          ariaLabel: 'Start direct voice call with Emily',
          onClick: onStartDirectCall,
        },
        {
          label: 'Agora SD-RTN Architecture',
          href: '#pipeline',
          ariaLabel: 'Inspect Agora SD-RTN pipeline',
        },
      ],
    },
    {
      label: 'Margin Defense',
      bgColor: '#26171d',
      textColor: '#ffffff',
      links: [
        {
          label: 'Concession Simulator',
          href: '#simulator',
          ariaLabel: 'Open deal concession simulator',
        },
        {
          label: '18% Floor Guard Policy',
          href: '#capabilities',
          ariaLabel: 'Read margin defense policy',
        },
        {
          label: 'Live Deal Objections',
          href: '#capabilities',
          ariaLabel: 'View objection handling trees',
        },
      ],
    },
    {
      label: 'Enterprise Tri-Stack',
      bgColor: '#132124',
      textColor: '#ffffff',
      links: [
        {
          label: 'HubSpot Deal Sync',
          href: '#pipeline',
          ariaLabel: 'Inspect HubSpot deal creation',
        },
        {
          label: 'Google Calendar Booking',
          href: '#pipeline',
          ariaLabel: 'Inspect Google Calendar slot booking',
        },
        {
          label: 'Slack Webhook Escalation',
          href: '#pipeline',
          ariaLabel: 'Inspect Slack webhook notifications',
        },
      ],
    },
  ];

  return (
    <CardNav
      logoText="Agora"
      items={navItems}
      baseColor="#100d16"
      menuColor="#ffffff"
      buttonBgColor="#D97757"
      buttonTextColor="#ffffff"
      onCtaClick={onLaunchDemo}
      ctaText="Customer Demo"
    />
  );
};
