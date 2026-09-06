'use client';

import React, { useState, useEffect } from 'react';
import { useAgoraVoice } from '@/hooks/useAgoraVoice';
import { LandingPage } from '@/components/LandingPage';
import { AgentPlatformLanding } from '@/components/AgentPlatformLanding';
import { SalesCockpit } from '@/components/SalesCockpit';
import { PostCallDealMemoModal } from '@/components/PostCallDealMemo';

export default function HomePage() {
  const voiceHook = useAgoraVoice();
  const [currentView, setCurrentView] = useState<'platform' | 'demo'>('platform');

  // Check URL query on initial mount (e.g. ?view=demo)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'demo') {
        setCurrentView('demo');
      } else if (viewParam === 'platform') {
        setCurrentView('platform');
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#141413] selection:bg-[#D97757]/20 selection:text-[#141413]">
      {voiceHook.inCall || voiceHook.dealMemo ? (
        <SalesCockpit
          voiceHook={voiceHook}
          onReturnToLanding={() => {
            voiceHook.closeDealMemo();
            voiceHook.endCall();
            // Retain the customer demo view after call finishes
            setCurrentView('demo');
          }}
        />
      ) : currentView === 'demo' ? (
        <LandingPage
          onStartCall={(info) => voiceHook.startCall(info)}
          isConnecting={voiceHook.connecting}
          onBackToPlatform={() => setCurrentView('platform')}
        />
      ) : (
        <AgentPlatformLanding
          onLaunchDemo={() => setCurrentView('demo')}
          onStartDirectCall={() =>
            voiceHook.startCall({
              name: 'Tina',
              company: 'Razorpay',
              email: 'gargiesingh321@gmail.com',
              seats: 250,
            })
          }
        />
      )}

      {/* Render PostCallDealMemo modal whenever dealMemo is present */}
      {voiceHook.dealMemo && (
        <PostCallDealMemoModal
          memo={voiceHook.dealMemo}
          onClose={voiceHook.closeDealMemo}
        />
      )}
    </main>
  );
}
