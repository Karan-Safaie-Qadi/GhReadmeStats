import { kFormatter, escapeHtml } from '../utils.js';

const CARD_WIDTH = 450;
const CARD_HEIGHT = 195;
const HEADER_HEIGHT = 50;
const PADDING = 25;
const LINE_HEIGHT = 30;

export function renderStatsCard(stats, theme, options = {}) {
  const {
    hide_rank = false,
    show_icons = true,
    hide = [],
    count_private = false,
    include_all_commits = true,
  } = options;

  const hideSet = new Set(hide);
  const rows = [];

  const commitLabel = include_all_commits ? 'Total Commits' : 'Commits (last year)';
  const commitCount = include_all_commits ? stats.totalCommits : stats.totalCommits;

  if (!hideSet.has('stars')) rows.push({ icon: 'star', label: 'Total Stars', value: kFormatter(stats.totalStars), color: theme.star });
  if (!hideSet.has('commits')) rows.push({ icon: 'commit', label: commitLabel, value: kFormatter(commitCount), color: theme.icon });
  if (!hideSet.has('prs')) rows.push({ icon: 'pr', label: 'Total PRs', value: kFormatter(stats.totalPRs), color: theme.icon });
  if (!hideSet.has('issues')) rows.push({ icon: 'issue', label: 'Total Issues', value: kFormatter(stats.totalIssues), color: theme.icon });
  if (!hideSet.has('repos')) rows.push({ icon: 'repo', label: 'Repositories', value: kFormatter(stats.totalRepos), color: theme.icon });
  if (!hideSet.has('contribs')) rows.push({ icon: 'contrib', label: 'Contributed to', value: kFormatter(stats.contributedTo), color: theme.icon });

  const iconSvg = (type) => {
    switch (type) {
      case 'star':
        return '<path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" fill="' + theme.star + '"/>';
      case 'commit':
        return '<path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm6.5-4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" fill="' + theme.icon + '"/>';
      case 'pr':
        return '<path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zM2.5 3.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM3.75 11.5a.75.75 0 100 1.5.75.75 0 000-1.5z" fill="' + theme.icon + '"/>';
      case 'issue':
        return '<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm0-5a1 1 0 00-2 0v2a1 1 0 102 0V6z" fill="' + theme.icon + '"/>';
      case 'repo':
        return '<path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" fill="' + theme.icon + '"/>';
      case 'contrib':
        return '<path d="M2.5 1.75a.75.75 0 011.5 0v5.5c0 .69.56 1.25 1.25 1.25h2.5a.75.75 0 010 1.5h-2.5a2.75 2.75 0 01-2.75-2.75v-5.5z" fill="' + theme.icon + '"/><path d="M6.25 4.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5z" fill="' + theme.icon + '"/>';
      default:
        return '';
    }
  };

  const iconSize = 16;
  const statsRows = rows.map((row, i) => {
    const y = HEADER_HEIGHT + 10 + i * LINE_HEIGHT;
    const iconHtml = show_icons
      ? '<svg width="' + iconSize + '" height="' + iconSize + '" viewBox="0 0 16 16" style="vertical-align:middle;margin-right:8px;">' + iconSvg(row.icon) + '</svg>'
      : '';
    return '<text x="' + PADDING + '" y="' + y + '" fill="' + theme.text + '" font-size="14" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" dominant-baseline="middle">' + iconHtml + escapeHtml(row.label) + '</text><text x="' + (CARD_WIDTH - PADDING) + '" y="' + y + '" fill="' + row.color + '" font-size="14" font-weight="600" text-anchor="end" font-family="Segoe UI,Helvetica,Arial,sans-serif" dominant-baseline="middle">' + escapeHtml(row.value) + '</text>';
  });

  const rankSection = hide_rank ? '' : renderRank(stats, theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}">
  <rect x="0.5" y="0.5" width="${CARD_WIDTH - 1}" height="${CARD_HEIGHT - 1}" rx="6" fill="${theme.card}" stroke="${theme.card_border}" stroke-width="1"/>
  <text x="${PADDING}" y="28" fill="${theme.title}" font-size="18" font-weight="600" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">${escapeHtml(stats.name)}'s Stats</text>
  <line x1="${PADDING}" y1="45" x2="${CARD_WIDTH - PADDING}" y2="45" stroke="${theme.card_border}" stroke-width="1"/>
  ${statsRows.join('\n  ')}
  ${rankSection}
</svg>`;
}

function renderRank(stats, theme) {
  const rank = calculateRank(stats);
  return `<text x="${CARD_WIDTH - PADDING}" y="32" fill="${theme.text}" font-size="12" text-anchor="end" font-family="Segoe UI,Helvetica,Arial,sans-serif">Rank: <tspan fill="${theme.accent}" font-weight="700">${rank}</tspan></text>`;
}

function calculateRank(stats) {
  const score = stats.totalStars * 5 + stats.totalCommits * 0.5 + stats.totalPRs * 2 + stats.totalIssues * 1 + stats.followers * 3 + stats.contributedTo * 1;
  if (score >= 100000) return 'S+';
  if (score >= 50000) return 'S';
  if (score >= 20000) return 'A+';
  if (score >= 10000) return 'A';
  if (score >= 5000) return 'B+';
  if (score >= 2000) return 'B';
  if (score >= 1000) return 'C+';
  if (score >= 500) return 'C';
  return 'D';
}
