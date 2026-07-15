const CARD_WIDTH = 495;
const CARD_HEIGHT = 195;
const COL_WIDTH = 165;

// getStyles - streak helper function
function getStyles(theme) {
  return `
    @keyframes currstreak {
      0% { font-size: 3px; opacity: 0.2; }
      80% { font-size: 34px; opacity: 1; }
      100% { font-size: 28px; opacity: 1; }
    }
    @keyframes fadein {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .big-number {
      font-family: "Segoe UI", Ubuntu, sans-serif;
      font-weight: 700;
      font-size: 28px;
      fill: #${theme.title_color};
    }
    .label {
      font-family: "Segoe UI", Ubuntu, sans-serif;
      font-weight: 400;
      font-size: 14px;
      fill: #${theme.title_color};
    }
    .range-text {
      font-family: "Segoe UI", Ubuntu, sans-serif;
      font-weight: 400;
      font-size: 12px;
      fill: #${theme.text_color};
    }
    .current-streak-num {
      font-family: "Segoe UI", Ubuntu, sans-serif;
      font-weight: 700;
      font-size: 28px;
      fill: #${theme.icon_color};
    }`;
}

function kFormatter(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

function isToday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const now = new Date();
  return d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate();
}

export function renderStreakCard(data, theme, options = {}) {
  const { hide_border = false } = options;
  const { totalContributions, currentStreak, longestStreak, totalRange, currentRange, longestRange } = data;

  const borderAttr = hide_border ? '' : ` stroke="#${theme.border_color}"`;

  return `<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'
    style='isolation: isolate' viewBox='0 0 ${CARD_WIDTH} ${CARD_HEIGHT}' width='${CARD_WIDTH}px' height='${CARD_HEIGHT}px' direction='ltr'>
    <style>${getStyles(theme)}</style>
    <defs>
      <clipPath id='outer_rectangle'>
        <rect width='${CARD_WIDTH}' height='${CARD_HEIGHT}' rx='4.5'/>
      </clipPath>
      <mask id='mask_out_ring_behind_fire'>
        <rect width='${CARD_WIDTH}' height='${CARD_HEIGHT}' fill='white'/>
        <ellipse id='mask-ellipse' cx='${CARD_WIDTH / 2}' cy='32' rx='13' ry='18' fill='black'/>
      </mask>
    </defs>
    <g clip-path='url(#outer_rectangle)'>
      <g style='isolation: isolate'>
        <rect fill='#${theme.bg_color}' rx='4.5' x='0.5' y='0.5' width='${CARD_WIDTH - 1}' height='${CARD_HEIGHT - 1}'${borderAttr}/>
      </g>
      <g style='isolation: isolate'>
        <line x1='${COL_WIDTH}' y1='28' x2='${COL_WIDTH}' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='#${theme.border_color}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
        <line x1='${COL_WIDTH * 2}' y1='28' x2='${COL_WIDTH * 2}' y2='170' vector-effect='non-scaling-stroke' stroke-width='1' stroke='#${theme.border_color}' stroke-linejoin='miter' stroke-linecap='square' stroke-miterlimit='3'/>
      </g>
      <g style='isolation: isolate'>
        <g transform='translate(${COL_WIDTH / 2}, 48)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='big-number' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
            ${kFormatter(totalContributions)}
          </text>
        </g>
        <g transform='translate(${COL_WIDTH / 2}, 84)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='label' style='opacity: 0; animation: fadein 0.5s linear forwards 0.7s'>
            Total Contributions
          </text>
        </g>
        <g transform='translate(${COL_WIDTH / 2}, 114)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='range-text' style='opacity: 0; animation: fadein 0.5s linear forwards 0.8s'>
            ${totalRange}
          </text>
        </g>
      </g>
      <g style='isolation: isolate'>
        <g mask='url(#mask_out_ring_behind_fire)'>
          <circle cx='${CARD_WIDTH / 2}' cy='71' r='40' fill='none' stroke='#${theme.title_color}' stroke-width='5' style='opacity: 0; animation: fadein 0.5s linear forwards 0.4s'></circle>
        </g>
        <g transform='translate(${CARD_WIDTH / 2}, 19.5)' stroke-opacity='0' style='opacity: 0; animation: fadein 0.5s linear forwards 0.6s'>
          <path d='M -12 -0.5 L 15 -0.5 L 15 23.5 L -12 23.5 L -12 -0.5 Z' fill='none'/>
          <path d='M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z' fill='#${theme.title_color}' stroke-opacity='0'/>
        </g>
        <g transform='translate(${CARD_WIDTH / 2}, 48)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='current-streak-num' style='animation: currstreak 0.6s linear forwards'>
            ${currentStreak}
          </text>
        </g>
        <g transform='translate(${CARD_WIDTH / 2}, 108)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='label' style='opacity: 0; animation: fadein 0.5s linear forwards 0.9s'>
            Current Streak
          </text>
        </g>
        <g transform='translate(${CARD_WIDTH / 2}, 145)'>
          <text x='0' y='21' stroke-width='0' text-anchor='middle' class='range-text' style='opacity: 0; animation: fadein 0.5s linear forwards 0.9s'>
            ${currentRange}
          </text>
        </g>
      </g>
      <g style='isolation: isolate'>
        <g transform='translate(${COL_WIDTH * 2.5}, 48)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='big-number' style='opacity: 0; animation: fadein 0.5s linear forwards 1.2s'>
            ${longestStreak}
          </text>
        </g>
        <g transform='translate(${COL_WIDTH * 2.5}, 84)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='label' style='opacity: 0; animation: fadein 0.5s linear forwards 1.3s'>
            Longest Streak
          </text>
        </g>
        <g transform='translate(${COL_WIDTH * 2.5}, 114)'>
          <text x='0' y='32' stroke-width='0' text-anchor='middle' class='range-text' style='opacity: 0; animation: fadein 0.5s linear forwards 1.4s'>
            ${longestRange}
          </text>
        </g>
      </g>
    </g>
  </svg>`;
}
