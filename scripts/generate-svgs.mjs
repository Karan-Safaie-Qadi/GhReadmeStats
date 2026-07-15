import { fetchUserStats, fetchTopLanguages } from '../src/api.js';
import { renderStatsCard } from '../src/cards/stats.js';
import { renderTopLangsCard } from '../src/cards/top-langs.js';
import { getTheme } from '../src/themes.js';
import fs from 'fs';
import path from 'path';

const username = process.env.USERNAME || 'Karan-Safaie-Qadi';
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

const outDir = path.resolve(process.argv[2] || './svgs');
fs.mkdirSync(outDir, { recursive: true });

async function generate() {
  console.log(`Fetching stats for ${username}...`);

  const stats = await fetchUserStats(username, token);
  const langData = await fetchTopLanguages(username, token);

  const themes = [
    { name: 'dark', theme: getTheme('dark') },
    { name: 'default', theme: getTheme('default') },
    { name: 'radical', theme: getTheme('radical') },
    { name: 'tokyonight', theme: getTheme('tokyonight') },
  ];

  for (const { name, theme } of themes) {
    const statsSvg = renderStatsCard(stats, theme);
    fs.writeFileSync(path.join(outDir, `stats-${name}.svg`), statsSvg);
    console.log(`  ✓ stats-${name}.svg`);

    const langsSvg = renderTopLangsCard(langData, theme);
    fs.writeFileSync(path.join(outDir, `top-langs-${name}.svg`), langsSvg);
    console.log(`  ✓ top-langs-${name}.svg`);
  }

  fs.writeFileSync(path.join(outDir, 'index.html'), `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>GhReadmeStats SVGs</title>
<style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:0 20px;background:#0d1117;color:#c9d1d9}
pre{background:#1c2128;padding:12px;border-radius:6px;overflow-x:auto}
h2{color:#e6edf3;margin-top:32px}
img{border:1px solid #30363d;border-radius:6px;margin:8px 0;max-width:100%}
a{color:#58a6ff}</style></head><body>
<h1>GhReadmeStats</h1>
<p>Generated SVGs for <strong>${username}</strong></p>
<h2>Stats Cards</h2>
${themes.map(t => `<img src="stats-${t.name}.svg" alt="Stats ${t.name}">`).join('\n')}
<h2>Top Languages</h2>
${themes.map(t => `<img src="top-langs-${t.name}.svg" alt="Top Langs ${t.name}">`).join('\n')}
<h2>Markdown Usage</h2>
<pre><code>![Stats](https://${process.env.GITHUB_REPOSITORY_OWNER || 'username'}.github.io/${process.env.GITHUB_REPOSITORY_NAME || 'GhReadmeStats'}/svgs/stats-dark.svg)</code></pre>
</body></html>`);

  console.log(`\nDone! Generated in ${outDir}`);
}

generate().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
