export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get('redirect_uri') || `${url.origin}/api/auth/callback`;

  const clientId = env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('OAuth not configured', { status: 500 });
  }

  const state = crypto.randomUUID();
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=read:user,repo`;

  await env.DB.prepare('INSERT INTO oauth_sessions (state, redirect_uri) VALUES (?, ?)').bind(state, redirectUri).run();

  return Response.redirect(githubAuthUrl, 302);
}
