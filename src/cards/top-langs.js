import { escapeHtml, measureText } from '../utils.js';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 285;
const PADDING_LEFT = 25;
const TITLE_Y = 35;
const BODY_Y = 55;
const LANG_ITEM_HEIGHT = 40;
const BAR_WIDTH = 205;
const BAR_HEIGHT = 8;

function getAnimations() {
  return `
    @keyframes slideInAnimation {
      from { width: 0; }
      to { width: calc(100%-100px); }
    }
    @keyframes growWidthAnimation {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
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
    .lang-name {
      font: 400 11px "Segoe UI", Ubuntu, Sans-Serif;
      fill: #${theme.text_color};
    }
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    .lang-progress {
      animation: growWidthAnimation 0.6s ease-in-out forwards;
    }`;
}

// renderTopLangsCard - top-langs helper function
export function renderTopLangsCard(langData, theme, options = {}) {
  const { hide_title = false } = options;
  const { langs } = langData;

  if (!langs || langs.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="120" viewBox="0 0 ${CARD_WIDTH} 120" fill="none">
      <rect x="0.5" y="0.5" rx="4.5" height="99%" width="${CARD_WIDTH - 1}" fill="#${theme.bg_color}" stroke="#${theme.border_color}" stroke-opacity="1"/>
      <text x="${CARD_WIDTH / 2}" y="65" fill="#${theme.text_color}" font-size="14" text-anchor="middle" font-family="Segoe UI,Ubuntu,Sans-Serif">No language data available</text>
    </svg>`;
  }

  const topLangs = langs.slice(0, 5);
  const totalHeight = BODY_Y + topLangs.length * LANG_ITEM_HEIGHT + 20;
  const height = Math.max(CARD_HEIGHT, totalHeight);

  const header = hide_title ? '' : `
  <g data-testid="card-title" transform="translate(${PADDING_LEFT}, ${TITLE_Y})">
    <g transform="translate(0, 0)">
      <text x="0" y="0" class="header" data-testid="header">Most Used Languages</text>
    </g>
  </g>`;
  const titleEl = hide_title ? '<title id="titleId"></title>' : '<title id="titleId">Most Used Languages</title>';
  const descEl = hide_title ? '<desc id="descId"></desc>' : `<desc id="descId">${topLangs.map(l => `${l.name}: ${l.percent.toFixed(1)}%`).join(', ')}</desc>`;

  const items = topLangs.map((lang, i) => {
    const delay = 450 + i * 150;
    const y = i * LANG_ITEM_HEIGHT;
    const percent = lang.percent.toFixed(2);

    return `
    <g transform="translate(0, ${y})">
      <g class="stagger" style="animation-delay: ${delay}ms">
        <text data-testid="lang-name" x="2" y="15" class="lang-name">${escapeHtml(lang.name)}</text>
        <text x="215" y="34" class="lang-name">${percent}%</text>
        <svg width="${BAR_WIDTH}" x="0" y="25">
          <rect rx="5" ry="5" x="0" y="0" width="${BAR_WIDTH}" height="${BAR_HEIGHT}" fill="#ddd"></rect>
          <svg data-testid="lang-progress" width="${percent}%">
            <rect
              height="${BAR_HEIGHT}"
              fill="${lang.color}"
              rx="5" ry="5" x="0" y="0"
              class="lang-progress"
              style="animation-delay: ${delay + 300}ms;"
            />
          </svg>
        </svg>
      </g>
    </g>`;
  }).join('');

  return `<svg
  width="${CARD_WIDTH}"
  height="${height}"
  viewBox="0 0 ${CARD_WIDTH} ${height}"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  role="img"
  aria-labelledby="descId"
>
  ${titleEl}
  ${descEl}
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
    stroke="#${theme.border_color}"
    stroke-opacity="1"
  />

  ${header}

  <g
    data-testid="main-card-body"
    transform="translate(0, ${BODY_Y})"
  >
    <svg data-testid="lang-items" x="${PADDING_LEFT}">
      ${items}
    </svg>
  </g>
</svg>`;
}
