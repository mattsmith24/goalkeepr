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

export function currentStreak(
    dates: Set<string>,
    now: Date = new Date(),
): number {
    const day = new Date(now);
    if (!dates.has(toDateString(day))) {
        day.setDate(day.getDate() - 1);
    }
    let streak = 0;
    while (dates.has(toDateString(day))) {
        streak += 1;
        day.setDate(day.getDate() - 1);
    }
    return streak;
}
