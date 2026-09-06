import re

with open('components/AgentPlatformLanding.tsx', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8', errors='ignore')

# Fix the capability section header and structure cleanly
pattern = r'{\s*/\*\s*─*.*?5\.\s*CAPABILITIES.*?Capab.*?\*/\s*}'
text = re.sub(r'{\s*/\*\s*─*.*?5\.\s*CAPABILITIES.*?\*/\s*}', '', text, flags=re.DOTALL)

bad_part = """p-6 rounded-2xl bg-white border border-[#E8E6DC] shadow-xs flex flex-col justify-between hover:border-[#D97757]/40 transition-all">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EC] flex items-center justify-center text-[#D97757] mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold mb-1">
                  Bilingual Acoustic
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141413] mb-2">
                  Code-Switching
                </h3>
                <p className="text-xs text-[#5E5D59] leading-relaxed">
                  Native English and Hindi (Hinglish) code-switching for multinational enterprise buyers and procurement.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E8E6DC] flex items-center gap-1.5 text-[11px] font-mono text-[#8C8984]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span>Deepgram Nova-3 Multi</span>
              </div>
            </div>
          </div>"""

text = text.replace(bad_part, "")

# Ensure the section header for Capabilities is clean
cap_section = """      {/* 5. CAPABILITIES (Minimal 4-Pillar Architectural Moats) */}
      <section id="capabilities" className="py-20 bg-[#FAF9F5] border-y border-[#E8E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EC] border border-[#D97757]/20 text-[#D97757] text-xs font-mono font-medium mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>CORE ARCHITECTURAL MOATS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#141413] tracking-tight">
              Engineered to Protect Margin While Closing Faster
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5E5D59]">
              Four core engineering primitives that turn real-time voice into an autonomous negotiation engine.
            </p>
          </div>"""

# Replace any broken opening tag with clean cap_section
text = re.sub(r'{\s*/\*\s*─*.*?(?:<section id="capabilities"|<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">)', 
              cap_section + '\n\n          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">', 
              text, count=1, flags=re.DOTALL)

with open('components/AgentPlatformLanding.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned AgentPlatformLanding.tsx successfully')
