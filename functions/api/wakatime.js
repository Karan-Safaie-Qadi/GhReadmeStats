import { fetchWakaTimeStats } from '../../src/wakatime.js';
import { renderWakaTimeCard } from '../../src/cards/wakatime.js';
import { getTheme, applyCustomColors } from '../../src/themes.js';

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const params = url.searchParams;

  const apiKey = env.WAKATIME_API_KEY;
  if (!apiKey) {
    return new Response('WAKATIME_API_KEY not configured', { status: 500 });
  }

  const themeName = params.get('theme') || 'dark';

  try {
    const theme = applyCustomColors(getTheme(themeName), Object.fromEntries(params));
    const range = params.get('range') || 'last_7_days';
    const data = await fetchWakaTimeStats(apiKey, range);
    const options = { hide_title: params.get('hide_title') === 'true' };
    const svg = renderWakaTimeCard(data, theme, options);
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('WakaTime error:', err.message);
    const errorTheme = getTheme(themeName);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="80" viewBox="0 0 400 80" fill="none">
  <rect x="0.5" y="0.5" width="399" height="79" rx="4.5" fill="#${errorTheme.bg_color}" stroke="#${errorTheme.border_color}" stroke-opacity="1"/>
  <text x="200" y="45" fill="#${errorTheme.text_color}" font-size="14" text-anchor="middle" font-family="Segoe UI,Ubuntu,Sans-Serif">${err.message}</text>
</svg>`;
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  }
}
