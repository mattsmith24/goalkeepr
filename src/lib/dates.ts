export function toDateString(date: Date = new Date()): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export function currentStreak(dates: Set<string>, now: Date = new Date()): number {
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
