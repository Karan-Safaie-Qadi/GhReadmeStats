import { fetchUserStats } from '../../src/api.js';
import { renderStatsCard } from '../../src/cards/stats.js';
import { getTheme, applyCustomColors } from '../../src/themes.js';
import { parseBoolean } from '../../src/utils.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams;

  const token = env.GITHUB_TOKEN;
  if (!token) {
    return new Response('Server configuration error: GITHUB_TOKEN not set', { status: 500 });
  }

  const username = params.get('username');
  if (!username) {
    return new Response('Missing "username" query parameter', { status: 400 });
  }

  const themeName = params.get('theme') || 'dark';
  const theme = applyCustomColors(getTheme(themeName), Object.fromEntries(params));

  try {
    const stats = await fetchUserStats(username, token);
    const options = {
      hide_rank: parseBoolean(params.get('hide_rank')),
      show_icons: params.get('show_icons') !== 'false',
      hide: params.get('hide') ? params.get('hide').split(',') : [],
      count_private: parseBoolean(params.get('count_private')),
      include_all_commits: parseBoolean(params.get('include_all_commits')),
    };
    const svg = renderStatsCard(stats, theme, options);
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('Error:', err.message);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="80" viewBox="0 0 450 80">
  <rect x="0.5" y="0.5" width="449" height="79" rx="6" fill="${theme.card}" stroke="${theme.card_border}" stroke-width="1"/>
  <text x="225" y="45" fill="${theme.title}" font-size="14" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">${err.message}</text>
</svg>`;
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  }
}
