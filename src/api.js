const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const USER_QUERY = `
  query($login: String!, $after: String) {
    user(login: $login) {
      name
      login
      avatarUrl(size: 200)
      bio
      company
// TODO: user-friendly error messages for invalid themes
// TODO: GraphQL error extraction
// TODO: error handling for rate limiting
      location
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
      }
      repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          stargazerCount
          forkCount
          primaryLanguage { name }
          isPrivate
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 0) {
                  totalCount
                }
              }
            }
          }
        }
      }
      pullRequests(first: 1) { totalCount }
      issues(first: 1) { totalCount }
      repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) {
        totalCount
      }
      followers { totalCount }
      following { totalCount }
      createdAt
    }
  }
`;

const LANGS_QUERY = `
  query($login: String!, $after: String) {
    user(login: $login) {
      repositories(first: 100, after: $after, ownerAffiliations: OWNER, isFork: false) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          name
          languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

async function githubRequest(query, variables, token) {
  const resp = await fetch(GITHUB_GRAPHQL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'GhReadmeStats/1.0',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!resp.ok) {
    throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}. Check your token permissions.`);
  }

  const json = await resp.json();

  if (json.errors) {
    const msg = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL error: ${msg}`);
  }

  return json.data;
}

async function fetchAllRepos(username, token) {
  let repos = [];
  let after = null;
  let hasNext = true;

  while (hasNext) {
    const data = await githubRequest(USER_QUERY, { login: username, after }, token);
    const user = data.user;
    if (!user) throw new Error(`User "${username}" not found. Please check the username and try again.`);

    const page = user.repositories.nodes || [];
    repos = repos.concat(page);

    const pageInfo = user.repositories.pageInfo;
    hasNext = pageInfo?.hasNextPage && repos.length < 500;
    after = pageInfo?.endCursor || null;

    if (!hasNext || !after) break;
  }

  return repos;
}

export async function fetchUserStats(username, token, options = {}) {
  const { include_all_commits = false, count_private = false } = options;
  const firstPage = await githubRequest(USER_QUERY, { login: username, after: null }, token);
  const user = firstPage.user;
  if (!user) throw new Error(`User "${username}" not found`);

  let repos = user.repositories.nodes || [];

  if (user.repositories.pageInfo?.hasNextPage) {
    const remaining = await fetchAllRepos(username, token);
    repos = repos.concat(remaining.filter(r => !repos.some(ex => ex.name === r.name)));
  }

  const totalStars = repos.reduce((sum, r) => sum + r.stargazerCount, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forkCount, 0);

  const yearCommits = user.contributionsCollection.totalCommitContributions + user.contributionsCollection.restrictedContributionsCount;

  let allTimeCommits = yearCommits;
  if (include_all_commits) {
    const repoCommits = repos.reduce((sum, r) => {
      const count = r.defaultBranchRef?.target?.history?.totalCount || 0;
      return sum + count;
    }, 0);
    allTimeCommits = Math.max(yearCommits, repoCommits);
  }

  const totalRepos = count_private
    ? user.repositories.totalCount
    : repos.filter(r => !r.isPrivate).length;

  return {
    name: user.name || user.login,
    login: user.login,
    avatar: user.avatarUrl,
    bio: user.bio,
    company: user.company,
    location: user.location,
    totalStars,
    totalForks,
    totalCommits: allTimeCommits,
    totalPRs: user.pullRequests.totalCount,
    totalIssues: user.issues.totalCount,
    totalRepos,
    contributedTo: user.repositoriesContributedTo.totalCount,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    createdAt: user.createdAt,
  };
}

export async function fetchTopLanguages(username, token) {
  let repos = [];
  let after = null;
  let hasNext = true;
  let attempts = 0;

  while (hasNext && attempts < 5) {
    const data = await githubRequest(LANGS_QUERY, { login: username, after }, token);
    const user = data.user;
    if (!user) throw new Error(`User "${username}" not found`);

    const page = user.repositories.nodes || [];
    repos = repos.concat(page);

    const pageInfo = user.repositories.pageInfo;
    hasNext = pageInfo?.hasNextPage || false;
    after = pageInfo?.endCursor || null;
    attempts++;

    if (!after) break;
  }

  const langMap = new Map();

  for (const repo of repos) {
    const edges = repo.languages?.edges || [];
    for (const edge of edges) {
      const { name, color } = edge.node;
      const size = edge.size;
      if (langMap.has(name)) {
        langMap.get(name).size += size;
      } else {
        langMap.set(name, { name, color: color || '#858585', size });
      }
    }
  }

  const total = [...langMap.values()].reduce((sum, l) => sum + l.size, 0);
  const langs = [...langMap.values()]
    .sort((a, b) => b.size - a.size)
    .slice(0, 8)
    .map((l) => ({
      ...l,
      percent: total > 0 ? ((l.size / total) * 100) : 0,
    }));

  return { langs, total, username };
}

const STREAK_QUERY = `
  query($username: String!) {
    user(login: $username) {
      name
      login
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

function calculateStreaks(weeks) {
  const days = [];
  for (const week of weeks) {
    for (const day of week.contributionDays) {
      days.push({ date: day.date, count: day.contributionCount });
    }
  }

  days.sort((a, b) => a.date.localeCompare(b.date));

  const totalContributions = days.reduce((sum, d) => sum + d.count, 0);

  let currentStreak = 0;
  let currentStreakEnd = null;
  let currentStreakStart = null;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
      if (!currentStreakEnd) currentStreakEnd = days[i].date;
      currentStreakStart = days[i].date;
    } else {
      break;
    }
  }

  let longestStreak = 0;
  let longestStreakStart = null;
  let longestStreakEnd = null;
  let tempStreak = 0;
  let tempStart = null;
  for (let i = 0; i < days.length; i++) {
    if (days[i].count > 0) {
      if (tempStreak === 0) tempStart = days[i].date;
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
        longestStreakStart = tempStart;
        longestStreakEnd = days[i].date;
      }
    } else {
      tempStreak = 0;
      tempStart = null;
    }
  }

  const firstDay = days.length > 0 ? days[0].date : null;
  const lastDay = days.length > 0 ? days[days.length - 1].date : null;

  const formatRange = (start, end) => {
    if (!start || !end) return '';
    if (start === end) return formatDate(start);
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const isCurrentActive = (endDate) => {
    if (!endDate) return false;
    const d = new Date(endDate + 'T00:00:00Z');
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  };

  const totalRange = firstDay && lastDay
    ? `${formatDate(firstDay)} - ${isCurrentActive(lastDay) ? 'Present' : formatDate(lastDay)}`
    : '';

  const currentRange = currentStreak > 0 && currentStreakStart && currentStreakEnd
    ? formatRange(currentStreakStart, currentStreakEnd)
    : currentStreak === 0 ? '0 days' : '';

  const longestRange = longestStreak > 0 && longestStreakStart && longestStreakEnd
    ? formatRange(longestStreakStart, longestStreakEnd)
    : '';

  return {
    totalContributions,
    currentStreak,
    longestStreak,
    totalRange,
    currentRange,
    longestRange,
  };
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export async function fetchStreakStats(username, token) {
  const data = await githubRequest(STREAK_QUERY, { username }, token);
  const user = data.user;
  if (!user) throw new Error(`User "${username}" not found`);

  const calendar = user.contributionsCollection.contributionCalendar;
  return calculateStreaks(calendar.weeks);
}
