import { describe, expect, it } from 'vitest';
import { currentStreak, fromDateString, toDateString } from './dates';

const NOW = new Date(2026, 6, 15);
const today = toDateString(NOW);
const yesterday = toDateString(new Date(2026, 6, 14));
const twoDaysAgo = toDateString(new Date(2026, 6, 13));
const threeDaysAgo = toDateString(new Date(2026, 6, 12));
const fourDaysAgo = toDateString(new Date(2026, 6, 11));
const aWeekAgo = toDateString(new Date(2026, 6, 8));
const twoWeeksAgo = toDateString(new Date(2026, 6, 1));
const threeWeeksAgo = toDateString(new Date(2026, 5, 24));
const aMonthAgo = toDateString(new Date(2026, 5, 15));
const twoMonthsAgo = toDateString(new Date(2026, 4, 15));

const sameWeekDays = [
    toDateString(new Date(2026, 6, 13)),
    toDateString(new Date(2026, 6, 14)),
    toDateString(new Date(2026, 6, 15)),
    toDateString(new Date(2026, 6, 11)),
];

describe('toDateString', () => {
    it('formats a date as YYYY-MM-DD with zero-padding', () => {
        expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
    });
});

describe('fromDateString', () => {
    it('converts a date from YYYY-MM-DD to a Date', () => {
        expect(fromDateString('2026-08-15').toDateString() == '2026-08-15');
    });
});

describe('currentStreak', () => {
    describe('daily', () => {
        it('returns 0 for an empty history', () => {
            expect(currentStreak(new Set(), 'daily', 1, NOW)).toBe(0);
        });

        it('returns 1 when only today is recorded', () => {
            expect(currentStreak(new Set([today]), 'daily', 1, NOW)).toBe(1);
        });

        it('returns 1 when only yesterday is recorded (grace day)', () => {
            expect(currentStreak(new Set([yesterday]), 'daily', 1, NOW)).toBe(
                1,
            );
        });

        it('returns 1 when today and yesterday are both in the current 1.5-day period', () => {
            expect(
                currentStreak(new Set([today, yesterday]), 'daily', 1, NOW),
            ).toBe(1);
        });

        it('counts two periods when entries fall into consecutive 1.5-day windows', () => {
            expect(
                currentStreak(
                    new Set([today, yesterday, twoDaysAgo]),
                    'daily',
                    1,
                    NOW,
                ),
            ).toBe(2);
        });

        it('counts three periods for four consecutive days', () => {
            expect(
                currentStreak(
                    new Set([
                        today,
                        yesterday,
                        twoDaysAgo,
                        threeDaysAgo,
                        fourDaysAgo,
                    ]),
                    'daily',
                    1,
                    NOW,
                ),
            ).toBe(4);
        });

        it('returns 0 when only old entries exist', () => {
            expect(
                currentStreak(
                    new Set([aWeekAgo, fourDaysAgo]),
                    'daily',
                    1,
                    NOW,
                ),
            ).toBe(0);
        });

        it('ignores duplicate entries', () => {
            expect(
                currentStreak(
                    new Set([today, today, yesterday]),
                    'daily',
                    1,
                    NOW,
                ),
            ).toBe(1);
        });
    });

    describe('weekly', () => {
        it('returns 0 for an empty history', () => {
            expect(currentStreak(new Set(), 'weekly', 1, NOW)).toBe(0);
        });

        it('returns 1 when only today is recorded', () => {
            expect(currentStreak(new Set([today]), 'weekly', 1, NOW)).toBe(1);
        });

        it('returns 1 when four days in the same week are all recorded', () => {
            expect(currentStreak(new Set(sameWeekDays), 'weekly', 1, NOW)).toBe(
                1,
            );
        });

        it('returns 1 when only a week ago is recorded', () => {
            expect(currentStreak(new Set([aWeekAgo]), 'weekly', 1, NOW)).toBe(
                1,
            );
        });

        it('counts two periods when entries fall into consecutive 10.5-day windows', () => {
            expect(
                currentStreak(
                    new Set([aWeekAgo, twoWeeksAgo]),
                    'weekly',
                    1,
                    NOW,
                ),
            ).toBe(2);
        });

        it('breaks when two entries are more than 10.5 days apart', () => {
            expect(
                currentStreak(
                    new Set([aWeekAgo, threeWeeksAgo]),
                    'weekly',
                    1,
                    NOW,
                ),
            ).toBe(1);
        });

        it('returns 0 when the most recent entry is older than the lookback', () => {
            expect(
                currentStreak(
                    new Set([threeWeeksAgo, twoMonthsAgo]),
                    'weekly',
                    1,
                    NOW,
                ),
            ).toBe(0);
        });
    });

    describe('monthly', () => {
        it('returns 0 for an empty history', () => {
            expect(currentStreak(new Set(), 'monthly', 1, NOW)).toBe(0);
        });

        it('returns 1 when only today is recorded', () => {
            expect(currentStreak(new Set([today]), 'monthly', 1, NOW)).toBe(1);
        });

        it('returns 1 when only a month ago is recorded', () => {
            expect(currentStreak(new Set([aMonthAgo]), 'monthly', 1, NOW)).toBe(
                1,
            );
        });

        it('returns 1 when entries fall within the same 45-day window', () => {
            expect(
                currentStreak(new Set([today, aMonthAgo]), 'monthly', 1, NOW),
            ).toBe(1);
        });

        it('returns 0 when the most recent entry is older than the lookback', () => {
            expect(
                currentStreak(new Set([twoMonthsAgo]), 'monthly', 1, NOW),
            ).toBe(0);
        });
    });

    describe('count threshold', () => {
        it('returns 0 when a daily count of 2 has only one entry in the window', () => {
            expect(currentStreak(new Set([today]), 'daily', 2, NOW)).toBe(0);
        });

        it('returns 1 for daily count of 2 with two entries in the same window', () => {
            expect(
                currentStreak(new Set([today, yesterday]), 'daily', 2, NOW),
            ).toBe(1);
        });

        it('breaks the streak when the next window has fewer than count entries', () => {
            expect(
                currentStreak(
                    new Set([today, yesterday, twoDaysAgo]),
                    'daily',
                    2,
                    NOW,
                ),
            ).toBe(1);
        });

        it('counts two periods for weekly count of 2 when entries fall into consecutive windows', () => {
            const sixDaysAgo = toDateString(new Date(2026, 6, 9));
            const thirteenDaysAgo = toDateString(new Date(2026, 6, 2));
            const fourteenDaysAgo = toDateString(new Date(2026, 6, 1));
            expect(
                currentStreak(
                    new Set([
                        today,
                        sixDaysAgo,
                        thirteenDaysAgo,
                        fourteenDaysAgo,
                    ]),
                    'weekly',
                    2,
                    NOW,
                ),
            ).toBe(2);
        });

        it('returns 1 for weekly count of 4 when four entries fall in the same week', () => {
            expect(currentStreak(new Set(sameWeekDays), 'weekly', 4, NOW)).toBe(
                1,
            );
        });

        it('returns 0 for weekly count of 4 when only one entry exists', () => {
            expect(currentStreak(new Set([today]), 'weekly', 4, NOW)).toBe(0);
        });

        it('breaks for weekly count of 2 when the prior window has only one entry', () => {
            expect(
                currentStreak(
                    new Set([today, aWeekAgo, twoWeeksAgo]),
                    'weekly',
                    2,
                    NOW,
                ),
            ).toBe(1);
        });
    });
});
