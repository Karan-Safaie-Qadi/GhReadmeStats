import { renderStatsCard } from '../../../src/cards/stats.js';
import { renderTopLangsCard } from '../../../src/cards/top-langs.js';
import { renderStreakCard } from '../../../src/cards/streak.js';
import { getTheme, applyCustomColors } from '../../../src/themes.js';
import { parseBoolean } from '../../../src/utils.js';

export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  const username = url.searchParams.get('username');
  const cardType = url.searchParams.get('type') || 'stats';
  const themeName = url.searchParams.get('theme') || 'default';

  if (!username) {
    return new Response(JSON.stringify({ error: 'Missing username' }), {
      status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const cached = await env.DB.prepare('SELECT * FROM stats_cache WHERE github_id = ?').bind(user.github_id).first();
  if (!cached) {
    return new Response(JSON.stringify({ error: 'No stats cached. Please refresh first.' }), {
      status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const stats = JSON.parse(cached.raw_json);
  const theme = applyCustomColors(getTheme(themeName), Object.fromEntries(url.searchParams));

  let svg;
  switch (cardType) {
    case 'stats':
      svg = renderStatsCard(stats, theme, {
        hide_rank: parseBoolean(url.searchParams.get('hide_rank')),
        show_icons: parseBoolean(url.searchParams.get('show_icons')),
        hide: url.searchParams.get('hide') ? url.searchParams.get('hide').split(',') : [],
        hide_border: parseBoolean(url.searchParams.get('hide_border')),
        include_all_commits: true,
      });
      break;
    case 'top-langs':
      svg = renderTopLangsCard(stats.top_langs || {}, theme, {});
      break;
    case 'streak':
      svg = renderStreakCard(stats.streak || {}, theme, {});
      break;
    default:
      return new Response(JSON.stringify({ error: 'Invalid card type' }), {
        status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
  }

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
