export interface Goal {
    id: number;
    description: string;
}

export interface Milestone {
    id: number;
    goalId: number;
    description: string;
    dueDate: string | null;
    doneDate: string | null;
    note: string | null;
}

export interface Habit {
    id: number;
    goalId: number;
    description: string;
    streak: number;
}

export interface Measurement {
    id: number;
    goalId: number;
    description: string;
}

export interface HabitRecord {
    id: number;
    habitId: number;
    date: string;
    note: string | null;
}

export interface MeasurementRecord {
    id: number;
    measurementId: number;
    date: string;
    value: number;
    note: string | null;
}
