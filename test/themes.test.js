import { describe, it, expect } from 'vitest';
import { getTheme, applyCustomColors, themes } from '../src/themes.js';

describe('getTheme', () => {
  it('returns dark theme by default', () => {
    const theme = getTheme();
    expect(theme.bg).toBe('#0d1117');
    expect(theme.card).toBe('#1c2128');
  });

  it('returns built-in themes', () => {
    expect(getTheme('light').bg).toBe('#ffffff');
    expect(getTheme('radical').title).toBe('#fe428e');
    expect(getTheme('tokyonight').accent).toBe('#7aa2f7');
  });

  it('falls back to dark for unknown themes', () => {
    const theme = getTheme('nonexistent');
    expect(theme).toEqual(themes.dark);
  });
});

describe('applyCustomColors', () => {
  it('overrides theme colors from params', () => {
    const theme = getTheme('dark');
    const params = { bg_c: '#ff0000', title_c: '#00ff00' };
    const custom = applyCustomColors(theme, params);
    expect(custom.bg).toBe('#ff0000');
    expect(custom.title).toBe('#00ff00');
    expect(custom.text).toBe('#8b949e');
  });
});
