import { fetchTopLanguages } from '../../src/api.js';
import { renderTopLangsCard } from '../../src/cards/top-langs.js';
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
  } catch (err) {
    console.error('Error:', err.message);
    const errorTheme = getTheme(themeName);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="80" viewBox="0 0 300 80" fill="none">
  <rect x="0.5" y="0.5" width="299" height="79" rx="4.5" fill="#${errorTheme.bg_color}" stroke="#${errorTheme.border_color}" stroke-opacity="1"/>
  <text x="150" y="45" fill="#${errorTheme.text_color}" font-size="14" text-anchor="middle" font-family="Segoe UI,Ubuntu,Sans-Serif">${err.message}</text>
</svg>`;
    return new Response(svg, {
      headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'no-cache' },
    });
  }
}
