const fs = require('fs');

async function main() {
  const res = await fetch('https://21st.dev/community/components/vvisedev/gradient-bar-hero-section', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // Find self.__next_f or JSON payload
  const codeMatches = [...html.matchAll(/"code":"(.*?)(?<!\\)"/g)];
  if (codeMatches.length > 0) {
    for (const m of codeMatches) {
      try {
        const decoded = JSON.parse('"' + m[1] + '"');
        if (decoded.includes('Redefining') || decoded.includes('hero') || decoded.includes('export')) {
          console.log('FOUND CODE:\n', decoded.slice(0, 1500));
          fs.writeFileSync('scratch/gradient_hero_code.tsx', decoded);
          return;
        }
      } catch (e) {}
    }
  }

  // Look for any large react block in html
  console.log('Searching for any files/components in JSON...');
  const fMatches = [...html.matchAll(/"content":"(.*?)(?<!\\)"/g)];
  for (const m of fMatches) {
    try {
      const decoded = JSON.parse('"' + m[1] + '"');
      if (decoded.includes('Redefining') || decoded.includes('return')) {
        console.log('FOUND CONTENT:\n', decoded.slice(0, 1500));
        fs.writeFileSync('scratch/gradient_hero_code.tsx', decoded);
        return;
      }
    } catch (e) {}
  }
}

main().catch(console.error);
