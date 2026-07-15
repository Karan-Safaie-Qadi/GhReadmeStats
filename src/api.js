const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

const USER_QUERY = `
  query($login: String!) {
    user(login: $login) {
      name
      login
      avatarUrl(size: 200)
      bio
      company
      location
      contributionsCollection {
        totalCommitContributions
        restrictedContributionsCount
      }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        totalCount
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
  query($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
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
    throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}`);
  }

  const json = await resp.json();

  if (json.errors) {
    const msg = json.errors.map((e) => e.message).join('; ');
    throw new Error(`GraphQL error: ${msg}`);
  }

  return json.data;
}

export async function fetchUserStats(username, token, options = {}) {
  const { include_all_commits = false, count_private = false } = options;
  const data = await githubRequest(USER_QUERY, { login: username }, token);
  const user = data.user;
  if (!user) throw new Error(`User "${username}" not found`);

  const repos = user.repositories.nodes || [];
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
  const data = await githubRequest(LANGS_QUERY, { login: username }, token);
  const user = data.user;
  if (!user) throw new Error(`User "${username}" not found`);

  const langMap = new Map();
  const repos = user.repositories.nodes || [];

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
