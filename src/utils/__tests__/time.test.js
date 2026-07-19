import { describe, it, expect } from 'vitest';
import { parseTimeToMinutes, formatTime12h, formatCountdown, getNextAarti } from '../time';

describe('parseTimeToMinutes', () => {
  it('parses a valid 24h time into minutes since midnight', () => {
    expect(parseTimeToMinutes('06:00')).toBe(360);
    expect(parseTimeToMinutes('19:30')).toBe(1170);
    expect(parseTimeToMinutes('00:00')).toBe(0);
  });

  it('returns null for invalid input', () => {
    expect(parseTimeToMinutes('25:00')).toBeNull();
    expect(parseTimeToMinutes('not-a-time')).toBeNull();
    expect(parseTimeToMinutes(undefined)).toBeNull();
  });
});

describe('formatTime12h', () => {
  it('formats morning, noon, and evening times correctly', () => {
    expect(formatTime12h('06:00')).toBe('6:00 AM');
    expect(formatTime12h('12:00')).toBe('12:00 PM');
    expect(formatTime12h('00:05')).toBe('12:05 AM');
    expect(formatTime12h('19:00')).toBe('7:00 PM');
  });
});

describe('formatCountdown', () => {
  it('formats minutes under an hour as "Xm"', () => {
    expect(formatCountdown(45)).toBe('45m');
  });

  it('formats an hour or more as "Xh Ym"', () => {
    expect(formatCountdown(135)).toBe('2h 15m');
  });

  it('never returns a negative duration', () => {
    expect(formatCountdown(-10)).toBe('0m');
  });
});

describe('getNextAarti', () => {
  const temples = [
    {
      id: 't1',
      name: 'Temple One',
      aarti: [
        { name: 'Morning Aarti', time: '06:00' },
        { name: 'Evening Aarti', time: '19:00' },
      ],
    },
    {
      id: 't2',
      name: 'Temple Two',
      aarti: [{ name: 'Midday Aarti', time: '12:00' }],
    },
  ];

  it('returns the closest upcoming aarti later today', () => {
    const now = new Date(2026, 0, 1, 10, 0); // 10:00 AM
    const next = getNextAarti(temples, now);
    expect(next.aartiName).toBe('Midday Aarti');
    expect(next.templeName).toBe('Temple Two');
    expect(next.minutesUntil).toBe(120);
    expect(next.isTomorrow).toBe(false);
  });

  it('wraps to tomorrow when every aarti for today has passed', () => {
    const now = new Date(2026, 0, 1, 23, 0); // 11:00 PM
    const next = getNextAarti(temples, now);
    expect(next.isTomorrow).toBe(true);
    expect(next.aartiName).toBe('Morning Aarti');
    expect(next.minutesUntil).toBe(7 * 60);
  });

  it('returns null when no temple has any aarti scheduled', () => {
    expect(getNextAarti([{ id: 't3', name: 'No Aarti Temple', aarti: [] }])).toBeNull();
  });
});
