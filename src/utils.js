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

export function parseThemeColors(theme) {
  if (typeof theme === 'string') return theme;
  const colors = {};
  for (const [key, val] of Object.entries(theme)) {
    colors[key.replace(/_/g, '-')] = val;
  }
  return colors;
}
