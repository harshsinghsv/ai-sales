import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeamSync · Adaptive AI Sales & Negotiation Agent",
  description: "Real-time AI voice sales negotiation powered by Agora Conversational AI Engine, Sarvam AI, and live Deal Cockpit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-[#1b1d1e] selection:bg-[#4928fd] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
