import { escapeHtml } from '../utils.js';

const CARD_WIDTH = 350;
const CARD_HEIGHT = 240;
const PADDING = 25;
const BAR_HEIGHT = 20;
const BAR_GAP = 8;

export function renderTopLangsCard(langData, theme, options = {}) {
  const { hide_title = false } = options;
  const { langs } = langData;

  if (!langs || langs.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="120" viewBox="0 0 ${CARD_WIDTH} 120">
      <rect x="0.5" y="0.5" width="${CARD_WIDTH - 1}" height="119" rx="6" fill="${theme.card}" stroke="${theme.card_border}" stroke-width="1"/>
      <text x="${CARD_WIDTH / 2}" y="65" fill="${theme.text}" font-size="14" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">No language data available</text>
    </svg>`;
  }

  const topLangs = langs.slice(0, 5);
  const barWidth = CARD_WIDTH - PADDING * 2 - 90;
  const contentHeight = topLangs.length * (BAR_HEIGHT + BAR_GAP) + 40;
  const height = Math.max(CARD_HEIGHT, contentHeight + 30);

  const header = hide_title ? '' : `<text x="${PADDING}" y="28" fill="${theme.title}" font-size="16" font-weight="600" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">Top Languages</text>`;

  const bars = topLangs.map((lang, i) => {
    const y = (hide_title ? 20 : 50) + i * (BAR_HEIGHT + BAR_GAP);
    const barLen = (lang.percent / 100) * barWidth;

    return `
    <text x="${PADDING}" y="${y + BAR_HEIGHT - 4}" fill="${theme.text}" font-size="13" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif">${escapeHtml(lang.name)}</text>
    <rect x="${PADDING + 85}" y="${y}" width="${barWidth}" height="${BAR_HEIGHT}" rx="4" fill="${theme.card_border}"/>
    <rect x="${PADDING + 85}" y="${y}" width="${Math.max(barLen, 4)}" height="${BAR_HEIGHT}" rx="4" fill="${lang.color}"/>
    <text x="${CARD_WIDTH - PADDING}" y="${y + BAR_HEIGHT - 4}" fill="${theme.text}" font-size="12" text-anchor="end" font-family="Segoe UI,Helvetica,Arial,sans-serif">${lang.percent.toFixed(1)}%</text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}">
  <rect x="0.5" y="0.5" width="${CARD_WIDTH - 1}" height="${height - 1}" rx="6" fill="${theme.card}" stroke="${theme.card_border}" stroke-width="1"/>
  ${header}
  ${bars.join('\n  ')}
</svg>`;
}
