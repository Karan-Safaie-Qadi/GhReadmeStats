import { describe, it, expect } from 'vitest';
import { kFormatter, escapeHtml, parseBoolean, clamp, measureText } from '../src/utils.js';

describe('kFormatter', () => {
  it('formats numbers < 1000', () => {
    expect(kFormatter(0)).toBe('0');
    expect(kFormatter(500)).toBe('500');
    expect(kFormatter(999)).toBe('999');
  });

  it('formats thousands with K suffix', () => {
    expect(kFormatter(1000)).toBe('1.0K');
    expect(kFormatter(1500)).toBe('1.5K');
    expect(kFormatter(10000)).toBe('10.0K');
  });

  it('formats millions with M suffix', () => {
    expect(kFormatter(1000000)).toBe('1.0M');
    expect(kFormatter(2500000)).toBe('2.5M');
  });
});

describe('escapeHtml', () => {
  it('escapes special HTML characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('returns empty string for falsy input', () => {
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(undefined)).toBe('');
    expect(escapeHtml('')).toBe('');
  });
});

describe('parseBoolean', () => {
  it('parses true values', () => {
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('1')).toBe(true);
    expect(parseBoolean(true)).toBe(true);
  });

  it('parses false values', () => {
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('0')).toBe(false);
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean('')).toBe(false);
  });
});

describe('clamp', () => {
  it('clamps values to range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('measureText', () => {
  it('returns approximate text width', () => {
    expect(measureText('Total Stars Earned:')).toBeGreaterThan(0);
    expect(measureText('')).toBe(0);
  });
});
