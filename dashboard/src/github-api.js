const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

async function graphql(query, variables, token) {
  const resp = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'GhReadmeStats/1.0',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!resp.ok) throw new Error(`GitHub API: ${resp.status} ${resp.statusText}`);
  const json = await resp.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join('; '));
  return json.data;
}

async function rest(path, token) {
  const resp = await fetch(GITHUB_API + path, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'GhReadmeStats/1.0' },
  });
  if (!resp.ok) throw new Error(`GitHub API: ${resp.status} ${resp.statusText}`);
  return resp.json();
}

const USER_QUERY = `
  query($login: String!, $after: String) {
    user(login: $login) {
      name login avatarUrl bio company location
      contributionsCollection {
        totalCommitContributions restrictedContributionsCount
        contributionCalendar { totalContributions }
      }
      repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
        totalCount pageInfo { hasNextPage endCursor }
        nodes { name stargazerCount forkCount isPrivate }
      }
      pullRequests(first: 1) { totalCount }
      issues(first: 1) { totalCount }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) { totalCount }
      followers { totalCount } following { totalCount }
      createdAt
    }
  }`;

const LANGS_QUERY = `
  query($login: String!, $after: String) {
    user(login: $login) {
      repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
        pageInfo { hasNextPage endCursor }
        nodes { name languages(first: 10, orderBy: {field: SIZE, direction: DESC}) { edges { size node { name color } } } }
      }
    }
  }`;

export async function fetchUserStats(username, token) {
  const data = await graphql(USER_QUERY, { login: username, after: null }, token);
  const user = data.user;
  if (!user) throw new Error(`User "${username}" not found`);

  let repos = [...(user.repositories.nodes || [])];
  let after = user.repositories.pageInfo?.endCursor;
  while (after && repos.length < 500) {
    const next = await graphql(USER_QUERY, { login: username, after }, token);
    const page = next.user.repositories.nodes || [];
    repos = repos.concat(page);
    after = next.user.repositories.pageInfo?.endCursor;
  }

  const totalStars = repos.reduce((s, r) => s + r.stargazerCount, 0);
  const yearCommits = user.contributionsCollection.totalCommitContributions +
    (user.contributionsCollection.restrictedContributionsCount || 0);
  const totalContribs = user.contributionsCollection.contributionCalendar?.totalContributions || yearCommits;

  return {
    name: user.name || user.login,
    login: user.login,
    avatar: user.avatarUrl,
    bio: user.bio,
    company: user.company,
    location: user.location,
    totalStars,
    totalForks: repos.reduce((s, r) => s + r.forkCount, 0),
    totalCommits: totalContribs,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    totalRepos: repos.filter(r => !r.isPrivate).length,
    contributedTo: user.repositoriesContributedTo.totalCount,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    createdAt: user.createdAt,
  };
}

export async function fetchTopLanguages(username, token) {
  let repos = [];
  let after = null;
  for (let i = 0; i < 5; i++) {
    const data = await graphql(LANGS_QUERY, { login: username, after }, token);
    const page = data.user.repositories.nodes || [];
    repos = repos.concat(page);
    after = data.user.repositories.pageInfo?.endCursor;
    if (!after) break;
  }

  const langMap = new Map();
  for (const repo of repos) {
    for (const edge of (repo.languages?.edges || [])) {
      const { name, color } = edge.node;
      const size = edge.size;
      if (langMap.has(name)) langMap.get(name).size += size;
      else langMap.set(name, { name, color: color || '#858585', size });
    }
  }

  const total = [...langMap.values()].reduce((s, l) => s + l.size, 0);
  return {
    langs: [...langMap.values()]
      .sort((a, b) => b.size - a.size).slice(0, 8)
      .map(l => ({ ...l, percent: total > 0 ? (l.size / total) * 100 : 0 })),
    total, username,
  };
}

export async function fetchStreakStats(username, token) {
  const data = await graphql(`
    query($username: String!) {
      user(login: $username) {
        name contributionsCollection {
          contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } }
        }
      }
    }`, { username }, token);

  const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
  const days = weeks.flatMap(w => w.contributionDays)
    .sort((a, b) => a.date.localeCompare(b.date));

  let maxStreak = 0, curStreak = 0, totalActive = 0;
  let streakStart = null, maxStart = null, maxEnd = null;
  for (let i = 0; i < days.length; i++) {
    if (days[i].contributionCount > 0) {
      totalActive++;
      if (curStreak === 0) streakStart = days[i].date;
      curStreak++;
      if (curStreak > maxStreak) {
        maxStreak = curStreak;
        maxStart = streakStart;
        maxEnd = days[i].date;
      }
    } else {
      curStreak = 0;
    }
  }

  const today = days[days.length - 1];
  const currentStreak = today?.contributionCount > 0 ? curStreak : 0;

  const rangeStart = days[0]?.date;
  const rangeEnd = days[days.length - 1]?.date;

  return {
    name: data.user.name || username,
    totalContributions: data.user.contributionsCollection.totalContributions || totalActive,
    maxStreak, maxStart, maxEnd,
    currentStreak,
    totalActive,
    rangeStart, rangeEnd,
  };
}

export async function validateToken(token) {
  const user = await rest('/user', token);
  return { valid: true, login: user.login, avatar: user.avatar_url, name: user.name };
}
