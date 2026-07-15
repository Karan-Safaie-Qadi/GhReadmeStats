import { describe, it, expect } from 'vitest';
import { renderWakaTimeCard } from '../src/cards/wakatime.js';
import { getTheme } from '../src/themes.js';

const mockWakaTime = {
  totalSeconds: 86400,
  totalHours: '24.0',
  dailyAverage: '3.4',
  languages: [
    { name: 'JavaScript', percent: 45, totalSeconds: 38880, color: '#f1e05a', text: '10 hrs 48 mins' },
    { name: 'TypeScript', percent: 30, totalSeconds: 25920, color: '#3178c6', text: '7 hrs 12 mins' },
    { name: 'Python', percent: 15, totalSeconds: 12960, color: '#3572A5', text: '3 hrs 36 mins' },
    { name: 'HTML', percent: 7, totalSeconds: 6048, color: '#e34c26', text: '1 hr 40 mins' },
    { name: 'CSS', percent: 3, totalSeconds: 2592, color: '#563d7c', text: '0 hrs 43 mins' },
  ],
  editors: [
    { name: 'VS Code', percent: 80, text: '19 hrs 12 mins' },
    { name: 'Terminal', percent: 15, text: '3 hrs 36 mins' },
    { name: 'Neovim', percent: 5, text: '1 hr 12 mins' },
  ],
  range: 'last_7_days',
  username: 'testuser',
};

describe('renderWakaTimeCard', () => {
  const theme = getTheme('dark');

  it('returns SVG with correct dimensions', () => {
    const svg = renderWakaTimeCard(mockWakaTime, theme);
    expect(svg).toContain('width="400"');
    expect(svg).toContain('height="245"');
  });

  it('includes total hours and daily average', () => {
    const svg = renderWakaTimeCard(mockWakaTime, theme);
    expect(svg).toContain('24.0h coded');
    expect(svg).toContain('Daily avg: 3.4h');
  });

  it('lists all languages', () => {
    const svg = renderWakaTimeCard(mockWakaTime, theme);
    expect(svg).toContain('JavaScript');
    expect(svg).toContain('TypeScript');
    expect(svg).toContain('45.0%');
    expect(svg).toContain('30.0%');
  });

  it('lists editors', () => {
    const svg = renderWakaTimeCard(mockWakaTime, theme);
    expect(svg).toContain('VS Code');
    expect(svg).toContain('Terminal');
  });

  it('hides title when hide_title is set', () => {
    const svg = renderWakaTimeCard(mockWakaTime, theme, { hide_title: true });
    expect(svg).not.toContain('WakaTime Stats');
  });
});
