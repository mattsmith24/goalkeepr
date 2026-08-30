export function toDateString(date: Date = new Date()): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

/*
fromDateString - Convert a date string like 2026-08-15 to a Date.
params:
  date: The date as a string YYYY-MM-DD
*/
export function fromDateString(date: string): Date {
    // When the time zone offset is absent, date-only forms are interpreted as a
    // UTC time and date-time forms are interpreted as a local time.
    // Add the time so that it will be parsed as localtime.
    const withTime = `${date}T00:00:00`;
    return new Date(withTime);
}

const MS_PER_DAY = 86_400_000;

export function currentStreak(
    dates: Set<string>,
    schedule: 'daily' | 'weekly' | 'monthly',
    count: number = 1,
    now: Date = new Date(),
    period: number = 1,
): number {
    const periodDays = { daily: 1, weekly: 7, monthly: 30 }[schedule];
    const windowDays = periodDays * period;
    const lookback = windowDays * 1.5;

    if (dates.size === 0) return 0;

    const sortedDesc = [...dates]
        .map(fromDateString)
        .sort((a, b) => b.getTime() - a.getTime());

    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysSinceLatest =
        (nowStart.getTime() - sortedDesc[0].getTime()) / MS_PER_DAY;
    if (daysSinceLatest > lookback) return 0;

    let streak = 0;
    let anchor = nowStart.getTime();
    let i = 0;
    while (i < sortedDesc.length) {
        const windowStart = anchor - lookback * MS_PER_DAY;
        let itemsInWindow = 0;
        let oldestInWindow = anchor;
        while (
            i < sortedDesc.length &&
            sortedDesc[i].getTime() > windowStart &&
            sortedDesc[i].getTime() <= anchor
        ) {
            itemsInWindow += 1;
            oldestInWindow = sortedDesc[i].getTime();
            i += 1;
        }
        if (itemsInWindow < count) break;
        streak += 1;
        anchor = oldestInWindow;
    }
    return streak;
}

/*
streakExpiringSoon - True when the latest record is past the nominal period
(windowDays) but still within the grace window (windowDays * 1.5). For
single-day (daily + period=1) habits, also true when the latest record is
exactly yesterday (records are date-only, so the 1-1.5-day grace zone is
unreachable otherwise).
Returns false when there's no streak or the streak has already expired.
*/
export function streakExpiringSoon(
    dates: Set<string>,
    schedule: 'daily' | 'weekly' | 'monthly',
    now: Date = new Date(),
    period: number = 1,
): boolean {
    if (dates.size === 0) return false;
    const periodDays = { daily: 1, weekly: 7, monthly: 30 }[schedule];
    const windowDays = periodDays * period;
    const lookback = windowDays * 1.5;
    const sortedDesc = [...dates]
        .map(fromDateString)
        .sort((a, b) => b.getTime() - a.getTime());
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysSinceLatest =
        (nowStart.getTime() - sortedDesc[0].getTime()) / MS_PER_DAY;
    if (schedule === 'daily' && period === 1 && daysSinceLatest === 1) {
        return true;
    }
    if (daysSinceLatest > lookback) return false;
    return daysSinceLatest > windowDays;
}
