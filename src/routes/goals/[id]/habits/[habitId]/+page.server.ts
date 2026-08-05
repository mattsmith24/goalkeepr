import type { Actions, PageServerLoad } from './$types';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
    goalsTable,
    habitRecordsTable,
    habitsTable,
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
    const goalId = Number(params.id);
    const habitId = Number(params.habitId);
    if (
        !Number.isInteger(goalId) ||
        goalId <= 0 ||
        !Number.isInteger(habitId) ||
        habitId <= 0
    ) {
        error(404, 'Habit not found');
    }
    const userGoalIds = db
        .select({ id: goalsTable.id })
        .from(goalsTable)
        .where(eq(goalsTable.userId, locals.user!.id));
    const [habit] = await db
        .select()
        .from(habitsTable)
        .where(
            and(
                eq(habitsTable.id, habitId),
                inArray(habitsTable.goalId, userGoalIds),
            ),
        );
    if (!habit) {
        error(404, 'Habit not found');
    }
    const records = await db
        .select()
        .from(habitRecordsTable)
        .where(eq(habitRecordsTable.habitId, habitId))
        .orderBy(desc(habitRecordsTable.date));
    return { habit, records };
};

export const actions: Actions = {
    updateHabitRecord: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        const date = data.get('date')?.toString().trim() ?? '';
        const noteRaw = data.get('note')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return { success: false, error: 'invalid date' };
        }
        const note = noteRaw === '' ? null : noteRaw;
        const userGoalIds = db
            .select({ id: goalsTable.id })
            .from(goalsTable)
            .where(eq(goalsTable.userId, event.locals.user!.id));
        const result = await db
            .update(habitRecordsTable)
            .set({ date, note })
            .where(
                and(
                    eq(habitRecordsTable.id, id),
                    inArray(
                        habitRecordsTable.habitId,
                        db
                            .select({ id: habitsTable.id })
                            .from(habitsTable)
                            .where(inArray(habitsTable.goalId, userGoalIds)),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'record not found' });
        }
        return { success: true };
    },
    deleteHabitRecord: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        const userGoalIds = db
            .select({ id: goalsTable.id })
            .from(goalsTable)
            .where(eq(goalsTable.userId, event.locals.user!.id));
        const result = await db
            .delete(habitRecordsTable)
            .where(
                and(
                    eq(habitRecordsTable.id, id),
                    inArray(
                        habitRecordsTable.habitId,
                        db
                            .select({ id: habitsTable.id })
                            .from(habitsTable)
                            .where(inArray(habitsTable.goalId, userGoalIds)),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'record not found' });
        }
        return { success: true };
    },
};
