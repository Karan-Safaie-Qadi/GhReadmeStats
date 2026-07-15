import { describe, it, expect } from 'vitest';
import { renderStatsCard } from '../src/cards/stats.js';
import { renderTopLangsCard } from '../src/cards/top-langs.js';
import { getTheme } from '../src/themes.js';

const mockStats = {
  name: 'Test User',
  login: 'testuser',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  bio: 'A test user',
  company: null,
  location: 'Earth',
  totalStars: 1234,
  totalForks: 56,
  totalCommits: 7890,
  totalPRs: 123,
  totalIssues: 45,
  totalRepos: 67,
  contributedTo: 89,
  followers: 100,
  following: 50,
  createdAt: '2020-01-01T00:00:00Z',
};

const mockLangs = {
  langs: [
    { name: 'JavaScript', color: '#f1e05a', size: 10240, percent: 40 },
    { name: 'TypeScript', color: '#3178c6', size: 7680, percent: 30 },
    { name: 'Python', color: '#3572A5', size: 5120, percent: 20 },
    { name: 'Rust', color: '#dea584', size: 2560, percent: 10 },
  ],
  total: 25600,
  username: 'testuser',
};

describe('renderStatsCard', () => {
  const theme = getTheme('dark');

  it('returns SVG with correct width and height', () => {
    const svg = renderStatsCard(mockStats, theme);
    expect(svg).toContain('width="450"');
    expect(svg).toContain('height="195"');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it('includes the username in the title', () => {
    const svg = renderStatsCard(mockStats, theme);
    expect(svg).toContain("Test User's GitHub Stats");
  });

  it('renders rank circle by default', () => {
    const svg = renderStatsCard(mockStats, theme);
    expect(svg).toContain('data-testid="rank-circle"');
  });

  it('hides rank when hide_rank is true', () => {
    const svg = renderStatsCard(mockStats, theme, { hide_rank: true });
    expect(svg).not.toContain('data-testid="rank-circle"');
  });

  it('respects hide options', () => {
    const svg = renderStatsCard(mockStats, theme, { hide: ['stars', 'issues'] });
    expect(svg).not.toContain('data-testid="stars"');
    expect(svg).not.toContain('data-testid="issues"');
    expect(svg).toContain('data-testid="prs"');
    expect(svg).toContain('data-testid="contribs"');
  });

  it('renders with data-testid attributes', () => {
    const svg = renderStatsCard(mockStats, theme);
    expect(svg).toContain('data-testid="card-bg"');
    expect(svg).toContain('data-testid="card-title"');
    expect(svg).toContain('data-testid="main-card-body"');
    expect(svg).toContain('data-testid="header"');
  });

  it('renders with correct label format', () => {
    const svg = renderStatsCard(mockStats, theme, { include_all_commits: true });
    expect(svg).toContain('Total Stars Earned:');
    expect(svg).toContain('Total Commits:');
    expect(svg).toContain('Total PRs:');
    expect(svg).toContain('Total Issues:');
  });

  it('shows year label when include_all_commits is false', () => {
    const svg = renderStatsCard(mockStats, theme, { include_all_commits: false });
    expect(svg).toContain('Commits (last year):');
    expect(svg).toContain('data-testid="commits_year"');
  });
});

describe('renderTopLangsCard', () => {
  const theme = getTheme('dark');

  it('returns SVG with language bars', () => {
    const svg = renderTopLangsCard(mockLangs, theme);
    expect(svg).toContain('Most Used Languages');
    expect(svg).toContain('JavaScript');
    expect(svg).toContain('TypeScript');
    expect(svg).toContain('40.00%');
    expect(svg).toContain('30.00%');
  });

  it('shows no data message for empty langs', () => {
    const svg = renderTopLangsCard({ langs: [], total: 0, username: 'test' }, theme);
    expect(svg).toContain('No language data available');
  });

  it('hides title when hide_title is set', () => {
    const svg = renderTopLangsCard(mockLangs, theme, { hide_title: true });
    expect(svg).not.toContain('Most Used Languages');
  });

  it('has card header with correct title', () => {
    const svg = renderTopLangsCard(mockLangs, theme);
    expect(svg).toContain('data-testid="header"');
    expect(svg).toContain('data-testid="card-bg"');
    expect(svg).toContain('data-testid="main-card-body"');
  });
});
