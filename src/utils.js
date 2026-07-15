export function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function kFormatter(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

export function parseBoolean(val) {
  if (val === 'true' || val === '1' || val === true) return true;
  return false;
}

export function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

const FONT_WEIGHT = '600';
const FONT_FAMILY = '"Segoe UI", Ubuntu, "Helvetica Neue", Sans-Serif';
const FONT_SIZE = '14px';

const charWidths = {
  a: 7.5, b: 7.5, c: 6.5, d: 7.5, e: 7, f: 4.5, g: 7.5, h: 7.5,
  i: 3.5, j: 3.5, k: 6.5, l: 3.5, m: 11, n: 7.5, o: 7.5, p: 7.5,
  q: 7.5, r: 4.5, s: 6, t: 4.5, u: 7.5, v: 6.5, w: 9.5, x: 6.5,
  y: 6.5, z: 6, A: 8.5, B: 7.5, C: 8, D: 8.5, E: 7, F: 6.5,
  G: 8.5, H: 8.5, I: 4.5, J: 5, K: 7.5, L: 6.5, M: 10, N: 8.5,
  O: 8.5, P: 7, Q: 8.5, R: 7.5, S: 7, T: 7, U: 8.5, V: 8,
  W: 11.5, X: 7.5, Y: 7.5, Z: 7, 0: 7.5, 1: 5, 2: 7, 3: 7,
  4: 7.5, 5: 7, 6: 7.5, 7: 6.5, 8: 7.5, 9: 7.5, '.': 3, ':': 3,
  ',': 3, ' ': 4, '(': 4, ')': 4, "'": 3, '!': 3.5, '?': 7,
  '/': 4.5, '-': 4.5, '_': 5, '+': 7, '=': 7, '<': 6.5, '>': 6.5,
  '%': 8,
};

export function measureText(text) {
  let total = 0;
  for (const ch of String(text)) {
    total += charWidths[ch] || 7;
  }
  return total;
}
