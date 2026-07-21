export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return new Response('Missing code or state', { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  const session = await env.DB.prepare('SELECT * FROM oauth_sessions WHERE state = ?').bind(state).first();
  if (!session) {
    return new Response('Invalid state', { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  await env.DB.prepare('DELETE FROM oauth_sessions WHERE state = ?').bind(state).run();

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
      state,
    }),
  });
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response('Failed to get access token', { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  const userRes = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${accessToken}`, 'User-Agent': 'GhReadmeStats' },
  });
  const userData = await userRes.json();

  await env.DB.prepare(`
    INSERT INTO users (github_id, username, avatar_url, name, access_token)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(github_id) DO UPDATE SET
      username = excluded.username,
      avatar_url = excluded.avatar_url,
      name = excluded.name,
      access_token = excluded.access_token,
      updated_at = datetime('now')
  `).bind(userData.id, userData.login, userData.avatar_url, userData.name, accessToken).run();

  const dashboardUrl = `${url.origin}/dashboard?user_id=${userData.id}&username=${userData.login}`;
  return Response.redirect(dashboardUrl, 302);
}
