'use client';

import React from 'react';
import { useAgoraVoice } from '@/hooks/useAgoraVoice';
import { LandingPage } from '@/components/LandingPage';
import { SalesCockpit } from '@/components/SalesCockpit';
import { PostCallDealMemoModal } from '@/components/PostCallDealMemo';

export default function HomePage() {
  const voiceHook = useAgoraVoice();

  return (
    <main className="min-h-screen bg-white text-[#1b1d1e] selection:bg-[#4928fd] selection:text-white">
      {voiceHook.inCall || voiceHook.dealMemo ? (
        <SalesCockpit
          voiceHook={voiceHook}
          onReturnToLanding={() => {
            voiceHook.closeDealMemo();
            voiceHook.endCall();
          }}
        />
      ) : (
        <LandingPage
          onStartCall={(info) => voiceHook.startCall(info)}
          isConnecting={voiceHook.connecting}
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
