import { escapeHtml } from '../utils.js';

const CARD_WIDTH = 400;
const CARD_HEIGHT = 245;
const PADDING = 25;
const TITLE_Y = 35;
const BODY_Y = 55;

function getStyles(theme) {
  return `
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: #${theme.title_color};
    }
    .stat {
      font: 400 13px "Segoe UI", Ubuntu, Sans-Serif;
      fill: #${theme.text_color};
    }
    .stat-bold {
      font-weight: 600;
    }`;
}

export function renderWakaTimeCard(wakatime, theme, options = {}) {
  const { hide_title = false } = options;
  const { languages, totalHours, dailyAverage, editors } = wakatime;

  const langRows = languages.map((lang, i) => `
    <g transform="translate(0, ${i * 22})">
      <text x="0" y="14" class="stat">${escapeHtml(lang.name)}</text>
      <text x="180" y="14" class="stat" text-anchor="end">${lang.percent.toFixed(1)}%</text>
    </g>`).join('');

  const editorRows = editors.map((e, i) => `
    <g transform="translate(200, ${i * 22})">
      <text x="0" y="14" class="stat">${escapeHtml(e.name)}</text>
      <text x="175" y="14" class="stat" text-anchor="end">${e.percent.toFixed(1)}%</text>
    </g>`).join('');

  const header = hide_title ? '' : `
  <g transform="translate(${PADDING}, ${TITLE_Y})">
    <text x="0" y="0" class="header">WakaTime Stats (last 7 days)</text>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" fill="none">
  <style>
    ${getStyles(theme)}
  </style>
  <rect x="0.5" y="0.5" rx="4.5" height="99%" width="${CARD_WIDTH - 1}" fill="#${theme.bg_color}" stroke="#${theme.border_color}" stroke-opacity="1"/>
  ${header}
  <g transform="translate(0, ${BODY_Y})">
    <g transform="translate(${PADDING}, 0)">
      <text x="0" y="12" class="stat stat-bold">Total: ${totalHours}h coded</text>
      <text x="200" y="12" class="stat">Daily avg: ${dailyAverage}h</text>
    </g>
    <line x1="${PADDING}" y1="25" x2="${CARD_WIDTH - PADDING}" y2="25" stroke="#${theme.border_color}" stroke-opacity="0.3"/>
    <text x="${PADDING}" y="45" class="stat stat-bold">Languages</text>
    <text x="${PADDING + 200}" y="45" class="stat stat-bold">Editors</text>
    <g transform="translate(${PADDING}, 55)">
      ${langRows}
    </g>
    <g transform="translate(0, 55)">
      ${editorRows}
    </g>
  </g>
</svg>`;
}
