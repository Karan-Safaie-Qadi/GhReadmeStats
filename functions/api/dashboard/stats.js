import { fetchUserStats, fetchTopLanguages, fetchStreakStats } from '../../../src/api.js';

export async function onRequest(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const githubId = url.searchParams.get('user_id');
  const username = url.searchParams.get('username');

  if (!githubId && !username) {
    return new Response(JSON.stringify({ error: 'Missing user_id or username' }), {
      status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let user;
  if (githubId) {
    user = await env.DB.prepare('SELECT * FROM users WHERE github_id = ?').bind(parseInt(githubId)).first();
  } else {
    user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  }

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found. Please login first.' }), {
      status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const cached = await env.DB.prepare('SELECT * FROM stats_cache WHERE github_id = ?').bind(user.github_id).first();

  if (cached && url.searchParams.get('refresh') !== 'true') {
    const stats = JSON.parse(cached.raw_json);
    return new Response(JSON.stringify({ ...stats, cached: true, fetched_at: cached.fetched_at }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const stats = await fetchUserStats(user.username, user.access_token, {
      include_all_commits: true, count_private: true,
    });
    const langData = await fetchTopLanguages(user.username, user.access_token);
    const streakData = await fetchStreakStats(user.username, user.access_token);

    const statsJson = JSON.stringify({ ...stats, top_langs: langData, streak: streakData });

    await env.DB.prepare(`
      INSERT INTO stats_cache (github_id, raw_json, commits, prs, issues, stars, followers, contributed_to, repos, fetched_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(github_id) DO UPDATE SET
        raw_json = excluded.raw_json,
        commits = excluded.commits, prs = excluded.prs,
        issues = excluded.issues, stars = excluded.stars,
        followers = excluded.followers, contributed_to = excluded.contributed_to,
        repos = excluded.repos, fetched_at = excluded.fetched_at
    `).bind(
      user.github_id, statsJson, stats.totalCommits, stats.totalPRs,
      stats.totalIssues, stats.totalStars, stats.followers,
      stats.contributedTo, stats.totalRepos || 0
    ).run();

    return new Response(JSON.stringify({ ...stats, top_langs: langData, streak: streakData, cached: false }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
