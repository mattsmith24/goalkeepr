import { describe, expect, it } from 'vitest';
import {
    currentStreak,
    fromDateString,
    streakExpiringSoon,
    toDateString,
} from './dates';

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

    describe('period multiplier', () => {
        it('returns 1 for weekly count 1 period 2 when only today is recorded', () => {
            expect(currentStreak(new Set([today]), 'weekly', 1, NOW, 2)).toBe(
                1,
            );
        });

        it('returns 1 for weekly count 1 period 2 with a 10-day-old entry (within 21-day window)', () => {
            const tenDaysAgo = toDateString(new Date(2026, 6, 5));
            expect(
                currentStreak(new Set([tenDaysAgo]), 'weekly', 1, NOW, 2),
            ).toBe(1);
        });

        it('returns 0 for weekly count 1 period 2 when only an old entry exists', () => {
            const twentyFiveDaysAgo = toDateString(new Date(2026, 5, 20));
            expect(
                currentStreak(
                    new Set([twentyFiveDaysAgo]),
                    'weekly',
                    1,
                    NOW,
                    2,
                ),
            ).toBe(0);
        });

        it('counts two periods for weekly count 1 period 2 with entries roughly every 2 weeks', () => {
            const elevenDaysAgo = toDateString(new Date(2026, 6, 4));
            const twentyTwoDaysAgo = toDateString(new Date(2026, 5, 23));
            expect(
                currentStreak(
                    new Set([today, elevenDaysAgo, twentyTwoDaysAgo]),
                    'weekly',
                    1,
                    NOW,
                    2,
                ),
            ).toBe(2);
        });

        it('returns 1 for monthly count 4 period 2 with 4 entries within a 2-month window', () => {
            const tenDaysAgo = toDateString(new Date(2026, 6, 5));
            const aMonthAgoDate = toDateString(new Date(2026, 5, 20));
            const twoMonthsAgoDate = toDateString(new Date(2026, 4, 25));
            expect(
                currentStreak(
                    new Set([
                        today,
                        tenDaysAgo,
                        aMonthAgoDate,
                        twoMonthsAgoDate,
                    ]),
                    'monthly',
                    4,
                    NOW,
                    2,
                ),
            ).toBe(1);
        });

        it('breaks for monthly count 4 period 2 when entries fall outside the 90-day window', () => {
            const fourMonthsAgoDate = toDateString(new Date(2026, 2, 10));
            const fiveMonthsAgoDate = toDateString(new Date(2026, 1, 10));
            const sixMonthsAgoDate = toDateString(new Date(2026, 0, 10));
            expect(
                currentStreak(
                    new Set([
                        today,
                        fourMonthsAgoDate,
                        fiveMonthsAgoDate,
                        sixMonthsAgoDate,
                    ]),
                    'monthly',
                    4,
                    NOW,
                    2,
                ),
            ).toBe(0);
        });

        it('counts a daily period 3 entry within the 4.5-day window', () => {
            const twoDaysAgo = toDateString(new Date(2026, 6, 13));
            expect(
                currentStreak(new Set([twoDaysAgo]), 'daily', 1, NOW, 3),
            ).toBe(1);
        });

        it('returns 0 for daily period 3 when the entry is past the 4.5-day lookback', () => {
            const fiveDaysAgo = toDateString(new Date(2026, 6, 10));
            expect(
                currentStreak(new Set([fiveDaysAgo]), 'daily', 1, NOW, 3),
            ).toBe(0);
        });

        it('counts two periods for daily period 3 with entries roughly every 3 days', () => {
            const threeDaysAgo = toDateString(new Date(2026, 6, 12));
            const sixDaysAgo = toDateString(new Date(2026, 6, 9));
            expect(
                currentStreak(
                    new Set([today, threeDaysAgo, sixDaysAgo]),
                    'daily',
                    1,
                    NOW,
                    3,
                ),
            ).toBe(2);
        });
    });
});

describe('streakExpiringSoon', () => {
    it('returns false for an empty history', () => {
        expect(streakExpiringSoon(new Set(), 'daily', NOW)).toBe(false);
    });

    it('returns false when the latest entry is today (daily)', () => {
        expect(streakExpiringSoon(new Set([today]), 'daily', NOW)).toBe(false);
    });

    it('returns true when the daily habit was done yesterday but not today', () => {
        expect(streakExpiringSoon(new Set([yesterday]), 'daily', NOW)).toBe(
            true,
        );
    });

    it('returns false when the daily habit has both today and yesterday recorded', () => {
        expect(
            streakExpiringSoon(new Set([today, yesterday]), 'daily', NOW),
        ).toBe(false);
    });

    it('returns false when the daily streak has already expired', () => {
        expect(streakExpiringSoon(new Set([threeDaysAgo]), 'daily', NOW)).toBe(
            false,
        );
    });

    it('returns true for a weekly habit when the latest entry is past 7 days but within 10.5', () => {
        const nineDaysAgo = toDateString(new Date(2026, 6, 6));
        expect(streakExpiringSoon(new Set([nineDaysAgo]), 'weekly', NOW)).toBe(
            true,
        );
    });

    it('returns false for a weekly habit when the latest entry is within 7 days', () => {
        expect(streakExpiringSoon(new Set([fourDaysAgo]), 'weekly', NOW)).toBe(
            false,
        );
    });

    it('returns false for a weekly habit when the streak has already expired', () => {
        expect(
            streakExpiringSoon(new Set([threeWeeksAgo]), 'weekly', NOW),
        ).toBe(false);
    });

    it('returns true for a monthly habit when the latest entry is past 30 days but within 45', () => {
        const thirtyFiveDaysAgo = toDateString(new Date(2026, 5, 10));
        expect(
            streakExpiringSoon(new Set([thirtyFiveDaysAgo]), 'monthly', NOW),
        ).toBe(true);
    });

    it('returns false for a monthly habit when the latest entry is within 30 days', () => {
        expect(streakExpiringSoon(new Set([aMonthAgo]), 'monthly', NOW)).toBe(
            false,
        );
    });

    it('scales the grace window by the period multiplier', () => {
        const fifteenDaysAgo = toDateString(new Date(2026, 5, 30));
        expect(
            streakExpiringSoon(new Set([fifteenDaysAgo]), 'weekly', NOW, 2),
        ).toBe(true);
    });

    it('returns false when the weekly period 2 streak has already expired', () => {
        expect(streakExpiringSoon(new Set([aMonthAgo]), 'weekly', NOW, 2)).toBe(
            false,
        );
    });

    it('returns false for daily period 3 when the entry is within the 3-day window', () => {
        const twoDaysAgo = toDateString(new Date(2026, 6, 13));
        expect(
            streakExpiringSoon(new Set([twoDaysAgo]), 'daily', NOW, 3),
        ).toBe(false);
    });

    it('returns true for daily period 3 when the entry is past 3 days but within 4.5', () => {
        const fourDaysAgo = toDateString(new Date(2026, 6, 11));
        expect(
            streakExpiringSoon(new Set([fourDaysAgo]), 'daily', NOW, 3),
        ).toBe(true);
    });

    it('returns false for daily period 3 when the entry has expired past 4.5 days', () => {
        const fiveDaysAgo = toDateString(new Date(2026, 6, 10));
        expect(
            streakExpiringSoon(new Set([fiveDaysAgo]), 'daily', NOW, 3),
        ).toBe(false);
    });
});
