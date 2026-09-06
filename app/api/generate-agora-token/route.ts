import { NextRequest, NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { getServerAgoraCredentials } from '@/lib/agora';

const EXPIRATION_TIME_IN_SECONDS = 3600;

/**
 * Channel names double as the FastAPI conversation_id, so the `sales_` prefix
 * is preserved from the previous implementation — the deal cockpit, session
 * store, and post-call memo all key off this value.
 */
function generateChannelName(): string {
  const random = Math.random().toString(36).substring(2, 8);
  return `sales_${random}`;
}

export async function GET(request: NextRequest) {
  const { appId: APP_ID, appCertificate: APP_CERTIFICATE } =
    getServerAgoraCredentials();

  if (!APP_ID || !APP_CERTIFICATE) {
    return NextResponse.json(
      {
        error:
          'Agora credentials are not set. Add NEXT_PUBLIC_AGORA_APP_ID and NEXT_AGORA_APP_CERTIFICATE to .env.',
      },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const uidStr = searchParams.get('uid');
  const parsedUid = uidStr ? parseInt(uidStr, 10) : Number.NaN;
  const uid =
    Number.isNaN(parsedUid) || parsedUid <= 0
      ? Math.floor(Math.random() * 9_999_000) + 1000
      : parsedUid;
  const channelName = searchParams.get('channel') || generateChannelName();

  const expirationTime =
    Math.floor(Date.now() / 1000) + EXPIRATION_TIME_IN_SECONDS;

  try {
    // buildTokenWithRtm issues a combined RTC + RTM token. RTM is required:
    // transcripts, agent state, and metrics are all delivered over it.
    const token = RtcTokenBuilder.buildTokenWithRtm(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid.toString(),
      RtcRole.PUBLISHER,
      expirationTime,
      expirationTime,
    );

    return NextResponse.json({
      token,
      uid: uid.toString(),
      channel: channelName,
    });
  } catch (error) {
    console.error('Error generating Agora token:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate Agora token',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
