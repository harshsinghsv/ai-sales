import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "EchoSphere - Adaptive AI Sales and Negotiation Agent | Agora Hackathon 2026",
  description:
    "Real-time non-scripted Voice AI Sales Agent built on Agora SD-RTN, a live conversation state engine, and multi-tier negotiation heuristics.",
  keywords: "Agora, Voice AI, Conversational AI, Sales Agent, SDR, Negotiation, SD-RTN, Deepgram, ElevenLabs, EchoSphere"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='%23099DFD'/><circle cx='50' cy='50' r='25' fill='%2300F0FF'/><circle cx='50' cy='50' r='10' fill='%23ffffff'/></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
