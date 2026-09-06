with open('components/AgentPlatformLanding.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove domainInput state if present
text = text.replace("  const [domainInput, setDomainInput] = React.useState('anthropic.com');\n", "")

# 2. Replace form + quick actions + badges strip with only TWO buttons
old_hero_content = """          {/* 21st.dev Interactive Launcher Form (Matching @waleedkibhen/gradient-bar-hero-section) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLaunchDemo();
            }}
            className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-6 px-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Enter enterprise domain (e.g. razorpay.com)..."
                className="w-full px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/5 border border-white/20 focus:border-white outline-none text-white text-sm sm:text-base shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 font-mono placeholder-white/40"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>

            <MovingBorderButton
              type="submit"
              className="h-auto w-full sm:w-auto"
              faceClassName="py-3.5 sm:py-4 px-8 text-sm sm:text-base font-semibold text-white whitespace-nowrap"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </MovingBorderButton>
          </form>

          {/* Symmetrical Quick Action Buttons with 21st.dev Rainbow Button */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <MovingBorderButton
              type="button"
              onClick={onStartDirectCall}
              className="h-auto"
              faceClassName="py-3.5 sm:py-4 px-7 sm:px-8 text-xs sm:text-sm font-semibold text-white"
            >
              <PhoneCall className="w-4 h-4 text-[#D97757]" />
              <span>Start Voice Call with Emily</span>
              <span className="relative flex h-1.5 w-1.5 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </MovingBorderButton>

            <a
              href="#demo-showcase"
              className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium text-white/85 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer no-underline"
            >
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>Inspect Deal Architecture ↓</span>
            </a>
          </div>

          {/* 21st.dev Trust & Tech Stack Badges Strip */}
          <div className="pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-white/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Agora SD-RTN (418ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97757]" />
              <span>Deepgram Nova-3 STT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>MiniMax 2.8 Turbo Voice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>HubSpot · GCal · Slack</span>
            </div>
          </div>"""

new_hero_content = """          {/* Symmetrical Action Buttons: Launch Live Demo (Moving Border) & Contact Us (Transparent) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <MovingBorderButton
              type="button"
              onClick={onLaunchDemo}
              className="h-auto w-full sm:w-auto"
              faceClassName="py-3.5 sm:py-4 px-8 text-sm sm:text-base font-semibold text-white whitespace-nowrap gap-2"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </MovingBorderButton>

            <button
              type="button"
              onClick={onStartDirectCall}
              className="w-full sm:w-auto h-12 sm:h-[52px] px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-semibold text-white/90 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Contact Us</span>
            </button>
          </div>"""

assert old_hero_content in text, "old_hero_content not found"
text = text.replace(old_hero_content, new_hero_content, 1)

# 3. Remove Section 3: Marquee Ticker moving panel
old_marquee_section = """      {/* ─────────────────────────────────────────────────────────────
          3. MARQUEE TICKER (Live Platform Signals)
         ───────────────────────────────────────────────────────────── */}
      <div className="py-3.5 bg-[#120F17] border-b border-white/10 overflow-hidden">
        <Marquee pauseOnHover repeat={4} className="[--gap:2rem]">
          {TICKER_ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono shadow-2xs text-white"
            >
              <span className="text-white/50">{item.label}:</span>
              <span className={`font-semibold ${item.color}`}>{item.val}</span>
            </div>
          ))}
        </Marquee>
      </div>"""

assert old_marquee_section in text, "old_marquee_section not found"
text = text.replace(old_marquee_section, "", 1)

# 4. Remove TICKER_ITEMS array
import re
text = re.sub(r'const TICKER_ITEMS = \[[\s\S]*?\];\n\n', '', text)

with open('components/AgentPlatformLanding.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Hero section and moving panel cleaned up successfully!")
