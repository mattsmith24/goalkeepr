import { describe, expect, it } from 'vitest';
import { currentStreak, toDateString } from './dates';

const NOW = new Date(2026, 6, 15);
const today = toDateString(NOW);
const yesterday = toDateString(new Date(2026, 6, 14));
const twoDaysAgo = toDateString(new Date(2026, 6, 13));
const threeDaysAgo = toDateString(new Date(2026, 6, 12));
const fourDaysAgo = toDateString(new Date(2026, 6, 11));
const aWeekAgo = toDateString(new Date(2026, 6, 8));

describe('toDateString', () => {
    it('formats a date as YYYY-MM-DD with zero-padding', () => {
        expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
    });
});

describe('currentStreak', () => {
    it('returns 0 for an empty history', () => {
        expect(currentStreak(new Set(), NOW)).toBe(0);
    });

    it('returns 1 when only today is recorded', () => {
        expect(currentStreak(new Set([today]), NOW)).toBe(1);
    });

    it('returns 1 when only yesterday is recorded (grace day)', () => {
        expect(currentStreak(new Set([yesterday]), NOW)).toBe(1);
    });

    it('counts consecutive days ending today', () => {
        expect(currentStreak(new Set([today, yesterday, twoDaysAgo]), NOW)).toBe(3);
    });

    it('counts consecutive days ending yesterday', () => {
        expect(currentStreak(new Set([yesterday, twoDaysAgo, threeDaysAgo]), NOW)).toBe(3);
    });

    it('stops at a gap — counts only the contiguous run ending today', () => {
        expect(
            currentStreak(new Set([today, yesterday, threeDaysAgo, fourDaysAgo]), NOW),
        ).toBe(2);
    });

    it('starts fresh at today when yesterday is missing', () => {
        expect(currentStreak(new Set([today, twoDaysAgo]), NOW)).toBe(1);
    });

    it('returns 0 when only old entries exist', () => {
        expect(currentStreak(new Set([aWeekAgo, fourDaysAgo]), NOW)).toBe(0);
    });

    it('ignores duplicate entries', () => {
        expect(currentStreak(new Set([today, today, yesterday]), NOW)).toBe(2);
    });
});
