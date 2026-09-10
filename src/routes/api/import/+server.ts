import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import {
    goalsTable,
    habitRecordsTable,
    habitsTable,
    measurementsTable,
    measurementRecordsTable,
    milestonesTable,
} from '$lib/server/db/schema';

import type { RequestHandler } from './$types';

type MilestoneImport = {
    description: string;
    dueDate: string | null;
    doneDate: string | null;
    note: string | null;
};

type HabitRecordImport = {
    date: string;
    note: string | null;
};

type MeasurementRecordImport = {
    date: string;
    value: number;
    note: string | null;
};

type HabitImport = {
    description: string;
    schedule: 'daily' | 'weekly' | 'monthly';
    count: number;
    period: number;
    records: HabitRecordImport[];
};

type MeasurementImport = {
    description: string;
    records: MeasurementRecordImport[];
};

type GoalImport = {
    title: string;
    description: string | null;
    milestones: MilestoneImport[];
    habits: HabitImport[];
    measurements: MeasurementImport[];
};

function isString(v: unknown): v is string {
    return typeof v === 'string';
}

function isStringOrNull(v: unknown): v is string | null {
    return v === null || typeof v === 'string';
}

function isFiniteNumber(v: unknown): v is number {
    return typeof v === 'number' && Number.isFinite(v);
}

function validateMilestone(v: unknown): v is MilestoneImport {
    if (typeof v !== 'object' || v === null) return false;
    const m = v as Record<string, unknown>;
    return (
        isString(m.description) &&
        isStringOrNull(m.dueDate) &&
        isStringOrNull(m.doneDate) &&
        isStringOrNull(m.note)
    );
}

function validateHabitRecord(v: unknown): v is HabitRecordImport {
    if (typeof v !== 'object' || v === null) return false;
    const r = v as Record<string, unknown>;
    return isString(r.date) && isStringOrNull(r.note);
}

function validateMeasurementRecord(v: unknown): v is MeasurementRecordImport {
    if (typeof v !== 'object' || v === null) return false;
    const r = v as Record<string, unknown>;
    return (
        isString(r.date) && isFiniteNumber(r.value) && isStringOrNull(r.note)
    );
}

function validateHabit(v: unknown): v is HabitImport {
    if (typeof v !== 'object' || v === null) return false;
    const h = v as Record<string, unknown>;
    const hasPeriod =
        h.period === undefined ||
        (Number.isInteger(h.period) && (h.period as number) >= 1);
    return (
        isString(h.description) &&
        (h.schedule === 'daily' ||
            h.schedule === 'weekly' ||
            h.schedule === 'monthly') &&
        Number.isInteger(h.count) &&
        (h.count as number) >= 1 &&
        hasPeriod &&
        Array.isArray(h.records) &&
        h.records.every(validateHabitRecord)
    );
}

function validateMeasurement(v: unknown): v is MeasurementImport {
    if (typeof v !== 'object' || v === null) return false;
    const m = v as Record<string, unknown>;
    return (
        isString(m.description) &&
        Array.isArray(m.records) &&
        m.records.every(validateMeasurementRecord)
    );
}

function validateGoal(v: unknown): v is GoalImport {
    if (typeof v !== 'object' || v === null) return false;
    const g = v as Record<string, unknown>;
    return (
        isString(g.title) &&
        (g.description === undefined || isStringOrNull(g.description)) &&
        Array.isArray(g.milestones) &&
        g.milestones.every(validateMilestone) &&
        Array.isArray(g.habits) &&
        g.habits.every(validateHabit) &&
        Array.isArray(g.measurements) &&
        g.measurements.every(validateMeasurement)
    );
}

function validate(data: unknown): data is GoalImport[] {
    return Array.isArray(data) && data.every(validateGoal);
}

export const POST: RequestHandler = async ({ request, locals }) => {
    const userId = locals.user!.id;

    let raw: unknown;
    try {
        raw = await request.json();
    } catch {
        return json({ error: 'invalid JSON' }, { status: 400 });
    }

    if (!validate(raw)) {
        return json({ error: 'invalid import shape' }, { status: 400 });
    }

    await db.transaction((tx) => {
        tx.delete(goalsTable).where(eq(goalsTable.userId, userId)).run();

        for (const goal of raw) {
            const [insertedGoal] = tx
                .insert(goalsTable)
                .values({
                    title: goal.title,
                    description: goal.description,
                    userId,
                })
                .returning({ id: goalsTable.id })
                .all();

            if (goal.milestones.length) {
                tx.insert(milestonesTable)
                    .values(
                        goal.milestones.map((m) => ({
                            goalId: insertedGoal.id,
                            description: m.description,
                            dueDate: m.dueDate,
                            doneDate: m.doneDate,
                            note: m.note,
                        })),
                    )
                    .run();
            }

            for (const habit of goal.habits) {
                const [insertedHabit] = tx
                    .insert(habitsTable)
                    .values({
                        goalId: insertedGoal.id,
                        description: habit.description,
                        schedule: habit.schedule,
                        count: habit.count,
                        period: habit.period,
                    })
                    .returning({ id: habitsTable.id })
                    .all();

                if (habit.records.length) {
                    tx.insert(habitRecordsTable)
                        .values(
                            habit.records.map((r) => ({
                                habitId: insertedHabit.id,
                                date: r.date,
                                note: r.note,
                            })),
                        )
                        .run();
                }
            }

            for (const measurement of goal.measurements) {
                const [insertedMeasurement] = tx
                    .insert(measurementsTable)
                    .values({
                        goalId: insertedGoal.id,
                        description: measurement.description,
                    })
                    .returning({ id: measurementsTable.id })
                    .all();

                if (measurement.records.length) {
                    tx.insert(measurementRecordsTable)
                        .values(
                            measurement.records.map((r) => ({
                                measurementId: insertedMeasurement.id,
                                date: r.date,
                                value: r.value,
                                note: r.note,
                            })),
                        )
                        .run();
                }
            }
        }
    });

    return json({ success: true });
};
