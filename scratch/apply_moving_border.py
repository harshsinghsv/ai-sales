with open('components/AgentPlatformLanding.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
old_import = "import { RainbowButton } from '@/components/ui/rainbow-button';"
new_import = """import { RainbowButton } from '@/components/ui/rainbow-button';
import { MovingBorderButton } from '@/components/ui/moving-border-button';"""

if "import { MovingBorderButton }" not in text:
    text = text.replace(old_import, new_import, 1)

# 1. Replace form submit button
old_submit = """            <button
              type="submit"
              className="px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap text-sm sm:text-base font-semibold bg-white hover:bg-gray-100 text-[#0A070D] shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-[#0A070D]" />
            </button>"""

new_submit = """            <MovingBorderButton
              type="submit"
              className="h-auto w-full sm:w-auto"
              faceClassName="py-3.5 sm:py-4 px-8 text-sm sm:text-base font-semibold text-white whitespace-nowrap"
            >
              <span>Launch Live Demo</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </MovingBorderButton>"""

assert old_submit in text, "old_submit not found"
text = text.replace(old_submit, new_submit, 1)

# 2. Replace quick action voice call button
old_hero_call = """            <RainbowButton
              type="button"
              onClick={onStartDirectCall}
              className="py-3.5 sm:py-4 px-7 sm:px-8 rounded-full text-xs sm:text-sm font-semibold shadow-[0_0_30px_rgba(217,119,87,0.35)] active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-[#FFA87D]" />
              <span>Start Voice Call with Emily</span>
              <span className="relative flex h-1.5 w-1.5 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </RainbowButton>"""

new_hero_call = """            <MovingBorderButton
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
            </MovingBorderButton>"""

assert old_hero_call in text, "old_hero_call not found"
text = text.replace(old_hero_call, new_hero_call, 1)

# 3. Replace bottom CTA banner button
old_bottom_call = """            <RainbowButton
              onClick={onStartDirectCall}
              className="w-full sm:w-auto py-3.5 sm:py-4 px-8 rounded-full shadow-[0_0_30px_rgba(217,119,87,0.35)]"
            >
              <PhoneCall className="w-4 h-4 text-[#FFA87D]" />
              <span>Start Voice Call with Emily</span>
            </RainbowButton>"""

new_bottom_call = """            <MovingBorderButton
              onClick={onStartDirectCall}
              className="w-full sm:w-auto h-auto"
              faceClassName="py-3.5 sm:py-4 px-8 text-sm font-semibold text-white"
            >
              <PhoneCall className="w-4 h-4 text-[#D97757]" />
              <span>Start Voice Call with Emily</span>
            </MovingBorderButton>"""

assert old_bottom_call in text, "old_bottom_call not found"
text = text.replace(old_bottom_call, new_bottom_call, 1)

with open('components/AgentPlatformLanding.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Applied MovingBorderButton to AgentPlatformLanding.tsx successfully!")
