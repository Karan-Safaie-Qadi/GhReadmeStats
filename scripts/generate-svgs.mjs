import { fetchUserStats, fetchTopLanguages, fetchStreakStats } from '../src/api.js';
import { renderStatsCard } from '../src/cards/stats.js';
import { renderTopLangsCard } from '../src/cards/top-langs.js';
import { renderStreakCard } from '../src/cards/streak.js';
import { renderWakaTimeCard } from '../src/cards/wakatime.js';
import { getTheme } from '../src/themes.js';
import fs from 'fs';
import path from 'path';

const username = process.env.USERNAME || process.env.GITHUB_REPOSITORY_OWNER;
const token = process.env.GITHUB_TOKEN;
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || username;
const repoName = process.env.GITHUB_REPOSITORY_NAME || 'GhReadmeStats';

if (!username) {
  console.error('USERNAME environment variable is required');
  process.exit(1);
}
if (!token) {
  console.error('GITHUB_TOKEN environment variable is required');
  process.exit(1);
}

const outDir = path.resolve(process.argv[2] || './svgs');
fs.mkdirSync(outDir, { recursive: true });

const themeList = [
  { name: 'dark', theme: getTheme('dark') },
  { name: 'default', theme: getTheme('default') },
  { name: 'radical', theme: getTheme('radical') },
  { name: 'tokyonight', theme: getTheme('tokyonight') },
  { name: 'dracula', theme: getTheme('dracula') },
  { name: 'nord', theme: getTheme('nord') },
  { name: 'merko', theme: getTheme('merko') },
  { name: 'synthwave', theme: getTheme('synthwave') },
  { name: 'gruvbox', theme: getTheme('gruvbox') },
  { name: 'github_dark', theme: getTheme('github_dark') },
];

async function generate() {
  console.log(`Fetching stats for ${username}...`);

  const stats = await fetchUserStats(username, token, {
    include_all_commits: true,
    count_private: process.env.COUNT_PRIVATE === 'true',
  });
  const langData = await fetchTopLanguages(username, token);
  const streakData = await fetchStreakStats(username, token);

  for (const { name, theme } of themeList) {
    const statsSvg = renderStatsCard(stats, theme, { include_all_commits: true });
    fs.writeFileSync(path.join(outDir, `stats-${name}.svg`), statsSvg);
    console.log(`  ✓ stats-${name}.svg`);

    const langsSvg = renderTopLangsCard(langData, theme);
    fs.writeFileSync(path.join(outDir, `top-langs-${name}.svg`), langsSvg);
    console.log(`  ✓ top-langs-${name}.svg`);

    const streakSvg = renderStreakCard(streakData, theme);
    fs.writeFileSync(path.join(outDir, `streak-${name}.svg`), streakSvg);
    console.log(`  ✓ streak-${name}.svg`);
  }

  fs.writeFileSync(path.join(outDir, 'index.html'), `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<title>GhReadmeStats SVGs</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 960px; margin: 0 auto; padding: 32px 20px; background: #0d1117; color: #c9d1d9; }
  h1 { color: #e6edf3; font-size: 2em; margin-bottom: 8px; }
  h2 { color: #e6edf3; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 1px solid #30363d; font-size: 1.4em; }
  p { margin: 8px 0; }
  img { border: 1px solid #30363d; border-radius: 6px; max-width: 100%; margin: 8px 0; display: block; }
  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  pre { background: #161b22; padding: 12px 16px; border-radius: 6px; overflow-x: auto; border: 1px solid #30363d; margin: 8px 0; }
  code { font-family: "SF Mono", Monaco, monospace; }
  .lang-select { text-align: center; margin: 24px 0; }
  .lang-select a { display: inline-block; margin: 0 8px; padding: 6px 16px; border: 1px solid #30363d; border-radius: 20px; font-weight: 600; }
  .lang-select a:hover { background: #1c2128; }
</style></head><body>
<h1>📊 GhReadmeStats</h1>
<p>Generated SVG cards for <strong>${username}</strong> — updated every 6 hours via GitHub Actions</p>

<div class="lang-select">
  <a href="#stats">Stats Cards</a>
  <a href="#streak">Streak Cards</a>
  <a href="#langs">Top Languages</a>
  <a href="#usage">Usage</a>
</div>

<h2 id="stats">Stats Cards</h2>
${themeList.map(t => `<img src="stats-${t.name}.svg" alt="Stats - ${t.name}">`).join('\n')}

<h2 id="streak">Streak Cards</h2>
${themeList.map(t => `<img src="streak-${t.name}.svg" alt="Streak - ${t.name}">`).join('\n')}

<h2 id="langs">Top Languages</h2>
${themeList.map(t => `<img src="top-langs-${t.name}.svg" alt="Top Langs - ${t.name}">`).join('\n')}

<h2 id="usage">Markdown Usage</h2>
<p>Add to your GitHub profile README:</p>
<pre><code>![${username}'s GitHub Stats](https://${repoOwner}.github.io/${repoName}/svgs/stats-dark.svg)</code></pre>
<pre><code>![${username}'s Top Languages](https://${repoOwner}.github.io/${repoName}/svgs/top-langs-dark.svg)</code></pre>
<pre><code>![${username}'s Streak Stats](https://${repoOwner}.github.io/${repoName}/svgs/streak-dark.svg)</code></pre>

<h3>Other Themes</h3>
<pre><code>![Stats - Radical](https://${repoOwner}.github.io/${repoName}/svgs/stats-radical.svg)
![Stats - Tokyo Night](https://${repoOwner}.github.io/${repoName}/svgs/stats-tokyonight.svg)
![Stats - Dracula](https://${repoOwner}.github.io/${repoName}/svgs/stats-dracula.svg)
![Stats - Nord](https://${repoOwner}.github.io/${repoName}/svgs/stats-nord.svg)

![Streak - Dark](https://${repoOwner}.github.io/${repoName}/svgs/streak-dark.svg)
![Streak - Radical](https://${repoOwner}.github.io/${repoName}/svgs/streak-radical.svg)
![Streak - Tokyo Night](https://${repoOwner}.github.io/${repoName}/svgs/streak-tokyonight.svg)</code></pre>
</body></html>`);

  console.log(`\nDone! Generated ${themeList.length * 3 + 1} files in ${outDir}`);
}

generate().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
