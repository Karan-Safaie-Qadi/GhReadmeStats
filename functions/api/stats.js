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

  const themeName = params.get('theme') || 'default';

  try {
    const theme = applyCustomColors(getTheme(themeName), Object.fromEntries(params));
    const stats = await fetchUserStats(username, token, {
      include_all_commits: parseBoolean(params.get('include_all_commits')),
      count_private: parseBoolean(params.get('count_private')),
    });
    const options = {
      hide_rank: parseBoolean(params.get('hide_rank')),
      show_icons: parseBoolean(params.get('show_icons')),
      hide: params.get('hide') ? params.get('hide').split(',') : [],
      hide_border: parseBoolean(params.get('hide_border')),
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
    const errorTheme = getTheme(themeName);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="80" viewBox="0 0 450 80" fill="none">
  <rect x="0.5" y="0.5" width="449" height="79" rx="4.5" fill="#${errorTheme.bg_color}" stroke="#${errorTheme.border_color}" stroke-opacity="1"/>
  <text x="225" y="45" fill="#${errorTheme.text_color}" font-size="14" text-anchor="middle" font-family="Segoe UI,Ubuntu,Sans-Serif">${err.message}</text>
</svg>`;
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  }
}
