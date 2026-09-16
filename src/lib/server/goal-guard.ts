import { and, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
    goalsTable,
    habitRecordsTable,
    habitsTable,
    measurementRecordsTable,
    measurementsTable,
    milestonesTable,
} from '$lib/server/db/schema';

const READ_ONLY_ERROR = 'goal is completed and read-only';

function readOnlyFail() {
    return fail(409, { success: false, error: READ_ONLY_ERROR });
}

export async function assertGoalEditable(
    goalId: number,
    userId: string,
): Promise<ReturnType<typeof fail> | null> {
    const [row] = await db
        .select({ doneDate: goalsTable.doneDate })
        .from(goalsTable)
        .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, userId)));
    if (!row) return fail(404, { success: false, error: 'goal not found' });
    if (row.doneDate !== null) return readOnlyFail();
    return null;
}

export async function assertMilestoneEditable(
    milestoneId: number,
    userId: string,
): Promise<ReturnType<typeof fail> | null> {
    const [row] = await db
        .select({ doneDate: goalsTable.doneDate })
        .from(milestonesTable)
        .innerJoin(goalsTable, eq(goalsTable.id, milestonesTable.goalId))
        .where(
            and(
                eq(milestonesTable.id, milestoneId),
                eq(goalsTable.userId, userId),
            ),
        );
    if (!row)
        return fail(404, { success: false, error: 'milestone not found' });
    if (row.doneDate !== null) return readOnlyFail();
    return null;
}

export async function assertHabitEditable(
    habitId: number,
    userId: string,
): Promise<ReturnType<typeof fail> | null> {
    const [row] = await db
        .select({ doneDate: goalsTable.doneDate })
        .from(habitsTable)
        .innerJoin(goalsTable, eq(goalsTable.id, habitsTable.goalId))
        .where(and(eq(habitsTable.id, habitId), eq(goalsTable.userId, userId)));
    if (!row) return fail(404, { success: false, error: 'habit not found' });
    if (row.doneDate !== null) return readOnlyFail();
    return null;
}

export async function assertMeasurementEditable(
    measurementId: number,
    userId: string,
): Promise<ReturnType<typeof fail> | null> {
    const [row] = await db
        .select({ doneDate: goalsTable.doneDate })
        .from(measurementsTable)
        .innerJoin(goalsTable, eq(goalsTable.id, measurementsTable.goalId))
        .where(
            and(
                eq(measurementsTable.id, measurementId),
                eq(goalsTable.userId, userId),
            ),
        );
    if (!row)
        return fail(404, { success: false, error: 'measurement not found' });
    if (row.doneDate !== null) return readOnlyFail();
    return null;
}

export async function assertHabitRecordEditable(
    habitRecordId: number,
    userId: string,
): Promise<ReturnType<typeof fail> | null> {
    const [row] = await db
        .select({ doneDate: goalsTable.doneDate })
        .from(habitRecordsTable)
        .innerJoin(habitsTable, eq(habitsTable.id, habitRecordsTable.habitId))
        .innerJoin(goalsTable, eq(goalsTable.id, habitsTable.goalId))
        .where(
            and(
                eq(habitRecordsTable.id, habitRecordId),
                eq(goalsTable.userId, userId),
            ),
        );
    if (!row) return fail(404, { success: false, error: 'record not found' });
    if (row.doneDate !== null) return readOnlyFail();
    return null;
}

export async function assertMeasurementRecordEditable(
    measurementRecordId: number,
    userId: string,
): Promise<ReturnType<typeof fail> | null> {
    const [row] = await db
        .select({ doneDate: goalsTable.doneDate })
        .from(measurementRecordsTable)
        .innerJoin(
            measurementsTable,
            eq(measurementsTable.id, measurementRecordsTable.measurementId),
        )
        .innerJoin(goalsTable, eq(goalsTable.id, measurementsTable.goalId))
        .where(
            and(
                eq(measurementRecordsTable.id, measurementRecordId),
                eq(goalsTable.userId, userId),
            ),
        );
    if (!row) return fail(404, { success: false, error: 'record not found' });
    if (row.doneDate !== null) return readOnlyFail();
    return null;
}
