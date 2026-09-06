import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // The browser needs the Agora App ID to join the RTC channel, and can only
    // read NEXT_PUBLIC_-prefixed variables. Existing setups only define
    // AGORA_APP_ID (for the Python backend), so bridge it here rather than
    // requiring the same value to be duplicated in .env.
    //
    // Only the App ID is exposed — it is public by design and already visible
    // in client code. The App Certificate stays server-side and is never
    // mapped into this block.
    NEXT_PUBLIC_AGORA_APP_ID:
      process.env.NEXT_PUBLIC_AGORA_APP_ID ?? process.env.AGORA_APP_ID ?? "",
  },
};

export default nextConfig;
