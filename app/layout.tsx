import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claude Enterprise · Anthropic | Enterprise Sales & Solutions Lead",
  description: "Explore Claude Enterprise with Aarav, Anthropic's AI Enterprise Solutions Lead. Real-time voice consultation for Claude Opus 5, 1M context window, GitHub integration, and enterprise volume pricing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#FAF9F5] text-[#141413] selection:bg-[#D97757] selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
