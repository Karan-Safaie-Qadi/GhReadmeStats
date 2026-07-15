import { describe, it, expect } from 'vitest';
import { getTheme, applyCustomColors, themes } from '../src/themes.js';

describe('getTheme', () => {
  it('returns default theme by default', () => {
    const theme = getTheme();
    expect(theme.title_color).toBe('2f80ed');
    expect(theme.bg_color).toBe('fffefe');
  });

  it('returns built-in themes', () => {
    expect(getTheme('dark').bg_color).toBe('151515');
    expect(getTheme('radical').title_color).toBe('fe428e');
    expect(getTheme('tokyonight').icon_color).toBe('bf91f3');
  });

  it('falls back to default for unknown themes', () => {
    const theme = getTheme('nonexistent');
    expect(theme).toEqual(themes.default);
  });

  it('has all required color keys', () => {
    for (const [name, t] of Object.entries(themes)) {
      expect(t.title_color).toBeDefined(`${name}: title_color`);
      expect(t.icon_color).toBeDefined(`${name}: icon_color`);
      expect(t.text_color).toBeDefined(`${name}: text_color`);
      expect(t.bg_color).toBeDefined(`${name}: bg_color`);
      expect(t.border_color).toBeDefined(`${name}: border_color`);
      expect(t.ring_color).toBeDefined(`${name}: ring_color`);
    }
  });
});

describe('applyCustomColors', () => {
  it('overrides theme colors from params', () => {
    const theme = getTheme('dark');
    const params = { title_color: 'ff0000', bg_color: '00ff00' };
    const custom = applyCustomColors(theme, params);
    expect(custom.title_color).toBe('ff0000');
    expect(custom.bg_color).toBe('00ff00');
    expect(custom.text_color).toBe('9f9f9f');
  });
});
