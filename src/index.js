import { fetchUserStats, fetchTopLanguages, fetchStreakStats } from './api.js';
import { renderStatsCard } from './cards/stats.js';
import { renderTopLangsCard } from './cards/top-langs.js';
import { renderStreakCard } from './cards/streak.js';
import { getTheme, applyCustomColors } from './themes.js';
import { parseBoolean } from './utils.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const params = url.searchParams;

    const token = env.GITHUB_TOKEN;
    if (!token) {
      return new Response('Server configuration error: GITHUB_TOKEN not set', { status: 500 });
    }

    const username = params.get('username');
    if (!username) {
      return new Response('Missing "username" query parameter. Usage: /api?username=yourname', { status: 400 });
    }

    const themeName = params.get('theme') || 'default';

    try {
      if (path === '/api' || path === '/api/stats') {
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
      }

      if (path === '/api/top-langs') {
        const theme = applyCustomColors(getTheme(themeName), Object.fromEntries(params));
        const langData = await fetchTopLanguages(username, token);
        const options = { hide_title: parseBoolean(params.get('hide_title')) };
        const svg = renderTopLangsCard(langData, theme, options);
        return new Response(svg, {
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=300, s-maxage=300',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      if (path === '/api/streak') {
        const theme = applyCustomColors(getTheme(themeName), Object.fromEntries(params));
        const streakData = await fetchStreakStats(username, token);
        const options = {
          hide_border: parseBoolean(params.get('hide_border')),
        };
        const svg = renderStreakCard(streakData, theme, options);
        return new Response(svg, {
          headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=300, s-maxage=300',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      return new Response('Not Found. Available endpoints: /api/stats, /api/top-langs, /api/streak', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });

    } catch (err) {
      console.error('Error:', err.message);
      const errorTheme = getTheme(themeName);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="450" height="80" viewBox="0 0 450 80" fill="none">
  <rect x="0.5" y="0.5" width="449" height="79" rx="4.5" fill="#${errorTheme.bg_color}" stroke="#${errorTheme.border_color}" stroke-opacity="1"/>
  <text x="225" y="45" fill="#${errorTheme.text_color}" font-size="14" text-anchor="middle" font-family="Segoe UI,Ubuntu,Sans-Serif">${err.message}</text>
</svg>`;
      return new Response(svg, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-cache' },
      });
    }
  },
};
