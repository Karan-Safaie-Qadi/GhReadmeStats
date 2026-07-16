import { escapeHtml, kFormatter } from '../utils.js';

const CARD_WIDTH = 450;
const CARD_HEIGHT = 195;
const PADDING_LEFT = 25;
const PADDING_RIGHT = 25;
const TITLE_Y = 35;
const BODY_Y = 55;
const LINE_HEIGHT = 25;
const LABEL_MARGIN = 199.01;
const ICON_SIZE = 16;

function getAnimations() {
  return `
    @keyframes scaleInAnimation {
      from { transform: translate(-5px, 5px) scale(0); }
      to { transform: translate(-5px, 5px) scale(1); }
    }
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes rankAnimation {
      from { stroke-dashoffset: 251.32741228718345; }
      to { stroke-dashoffset: 204.64774444508348; }
    }`;
}

function getStyles(theme) {
  return `
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${theme.title_color};
      animation: fadeInAnimation 0.8s ease-in-out forwards;
    }
    @supports(-moz-appearance: auto) {
      .header { font-size: 15.5px; }
    }
    .stat {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
      fill: #${theme.text_color};
    }
    @supports(-moz-appearance: auto) {
      .stat { font-size: 12px; }
    }
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .rank-text {
      font: 800 24px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${theme.text_color};
      animation: scaleInAnimation 0.3s ease-in-out forwards;
    }
    .rank-circle-rim {
      stroke: #${theme.ring_color};
      fill: none;
      stroke-width: 6;
      opacity: 0.2;
    }
    .rank-circle {
      stroke: #${theme.ring_color};
      stroke-dasharray: 250;
      fill: none;
      stroke-width: 6;
      stroke-linecap: round;
      opacity: 0.8;
      transform-origin: -10px 8px;
      transform: rotate(-90deg);
      animation: rankAnimation 1s forwards ease-in-out;
    }
    .icon {
      fill: #${theme.icon_color};
    }`;
}

const RANK_LEVELS = [
  { min: 0, label: 'D', color: 'red' },
  { min: 500, label: 'C', color: 'orange' },
  { min: 1000, label: 'C+', color: 'yellow' },
  { min: 2000, label: 'B', color: 'yellowgreen' },
  { min: 5000, label: 'B+', color: 'green' },
  { min: 10000, label: 'A', color: 'green' },
  { min: 20000, label: 'A+', color: 'teal' },
  { min: 50000, label: 'S', color: 'blueviolet' },
  { min: 100000, label: 'S+', color: 'gold' },
];

function calculateRank(stats) {
  const score = stats.totalStars * 5 + stats.totalCommits * 0.5 + stats.totalPRs * 2 + stats.totalIssues * 1 + stats.followers * 3 + stats.contributedTo * 1;
  for (let i = RANK_LEVELS.length - 1; i >= 0; i--) {
    if (score >= RANK_LEVELS[i].min) return RANK_LEVELS[i].label;
  }
  return 'D';
}

function getRankCircle(rank) {
  return `
    <g data-testid="rank-circle" transform="translate(365, 47.5)">
      <circle class="rank-circle-rim" cx="-10" cy="8" r="40" />
      <circle class="rank-circle" cx="-10" cy="8" r="40" />
      <g class="rank-text">
        <text x="-5" y="3" alignment-baseline="central" dominant-baseline="central" text-anchor="middle" data-testid="level-rank-icon">${rank}</text>
      </g>
    </g>`;
}

const LABEL_MAP = {
  stars: 'Total Stars Earned:',
  commits: 'Total Contributions:',
  commits_year: 'Commits (last year):',
  prs: 'Total PRs:',
  issues: 'Total Issues:',
  repos: 'Repositories:',
  contribs: 'Contributed to (last year):',
};

function getStatItems(stats, hide, showIcons, includeAllCommits) {
  const hideSet = new Set(hide);
  const rows = [];

  if (!hideSet.has('stars')) rows.push({ key: 'stars', value: kFormatter(stats.totalStars) });
  if (!hideSet.has('commits')) {
    const key = includeAllCommits ? 'commits' : 'commits_year';
    rows.push({ key, value: kFormatter(stats.totalCommits) });
  }
  if (!hideSet.has('prs')) rows.push({ key: 'prs', value: kFormatter(stats.totalPRs) });
  if (!hideSet.has('issues')) rows.push({ key: 'issues', value: kFormatter(stats.totalIssues) });
  if (!hideSet.has('contribs')) rows.push({ key: 'contribs', value: kFormatter(stats.contributedTo) });

  return rows.map((row, i) => {
    const delay = 450 + i * 150;
    const y = i * LINE_HEIGHT;
    const valueX = (showIcons ? 140 : 120) + 79.01;
    const labelOffset = showIcons ? `x="25"` : '';

    const iconSvg = showIcons
      ? `<svg data-testid="icon" class="icon" viewBox="0 0 16 16" width="16" height="16">${getIconSvg(row.key)}</svg>`
      : '';

    return `<g transform="translate(0, ${y})">
    <g class="stagger" style="animation-delay: ${delay}ms" transform="translate(25, 0)">
      ${iconSvg}
      <text class="stat bold" ${labelOffset} y="12.5">${escapeHtml(LABEL_MAP[row.key])}</text>
      <text class="stat bold" x="${valueX}" y="12.5" data-testid="${row.key}">${escapeHtml(row.value)}</text>
    </g>
  </g>`;
  }).join('\n');
}

function getIconSvg(key) {
  switch (key) {
    case 'stars':
      return `<path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" fill="currentColor"/>`;
    case 'commits':
      return `<path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm6.5-4.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" fill="currentColor"/>`;
    case 'prs':
      return `<path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zM2.5 3.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM3.75 11.5a.75.75 0 100 1.5.75.75 0 000-1.5z" fill="currentColor"/>`;
    case 'issues':
      return `<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm0-5a1 1 0 00-2 0v2a1 1 0 102 0V6z" fill="currentColor"/>`;
    case 'repos':
      return `<path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 010-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" fill="currentColor"/>`;
    case 'contribs':
      return `<path d="M2.5 1.75a.75.75 0 011.5 0v5.5c0 .69.56 1.25 1.25 1.25h2.5a.75.75 0 010 1.5h-2.5a2.75 2.75 0 01-2.75-2.75v-5.5z" fill="currentColor"/><path d="M6.25 4.75a.75.75 0 011.5 0v2.5a.75.75 0 01-1.5 0v-2.5z" fill="currentColor"/>`;
    default:
      return '';
  }
}

// renderStatsCard - stats helper function
export function renderStatsCard(stats, theme, options = {}) {
  const {
    hide_rank = false,
    show_icons = false,
    hide = [],
    hide_border = false,
    include_all_commits = false,
  } = options;

  const rank = calculateRank(stats);
  const title = `${escapeHtml(stats.name)}'s GitHub Stats`;
  const desc = `Total Stars Earned: ${stats.totalStars}, Total Commits: ${stats.totalCommits}, Total PRs: ${stats.totalPRs}, Total Issues: ${stats.totalIssues}, Contributed to (last year): ${stats.contributedTo}`;

  const borderAttr = hide_border ? '' : ` stroke="#${theme.border_color}" stroke-opacity="1"`;

  return `<svg
  width="${CARD_WIDTH}"
  height="${CARD_HEIGHT}"
  viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-labelledby="descId"
>
  <title id="titleId">${title}, Rank: ${rank}</title>
  <desc id="descId">${desc}</desc>
  <style>
    ${getStyles(theme)}
    ${getAnimations()}
  </style>

  <rect
    data-testid="card-bg"
    x="0.5"
    y="0.5"
    rx="4.5"
    height="99%"
    width="${CARD_WIDTH - 1}"
    fill="#${theme.bg_color}"
    ${borderAttr}
  />

  <g
    data-testid="card-title"
    transform="translate(${PADDING_LEFT}, ${TITLE_Y})"
  >
    <g transform="translate(0, 0)">
      <text x="0" y="0" class="header" data-testid="header">${title}</text>
    </g>
  </g>

  <g
    data-testid="main-card-body"
    transform="translate(0, ${BODY_Y})"
  >
    ${hide_rank ? '' : getRankCircle(rank)}
    <svg x="0" y="0">
      ${getStatItems(stats, hide, show_icons, include_all_commits)}
    </svg>
  </g>
</svg>`;
}
