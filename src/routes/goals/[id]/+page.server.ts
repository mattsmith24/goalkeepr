import type { Actions, PageServerLoad } from './$types';

import { and, eq, inArray } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
    goalsTable,
    habitRecordsTable,
    habitsTable,
    measurementRecordsTable,
    measurementsTable,
    milestonesTable,
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        error(404, 'Goal not found');
    }
    const [goal] = await db
        .select()
        .from(goalsTable)
        .where(
            and(eq(goalsTable.id, id), eq(goalsTable.userId, locals.user!.id)),
        );
    if (!goal) {
        error(404, 'Goal not found');
    }
    const milestones = await db
        .select()
        .from(milestonesTable)
        .where(eq(milestonesTable.goalId, id));
    const habits = await db
        .select()
        .from(habitsTable)
        .where(eq(habitsTable.goalId, id));
    const measurements = await db
        .select()
        .from(measurementsTable)
        .where(eq(measurementsTable.goalId, id));
    return { goal, milestones, habits, measurements };
};

export const actions: Actions = {
    update: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        const description = data.get('description')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const result = await db
            .update(goalsTable)
            .set({ description })
            .where(
                and(
                    eq(goalsTable.id, id),
                    eq(goalsTable.userId, event.locals.user!.id),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'goal not found' });
        }
        return { success: true };
    },
    createMilestone: async (event) => {
        const goalId = Number(event.params.id);
        const data = await event.request.formData();
        const description =
            data.get('milestone-description')?.toString().trim() ?? '';
        if (!Number.isInteger(goalId) || goalId <= 0) {
            return { success: false, error: 'invalid goal id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const [goal] = await db
            .select()
            .from(goalsTable)
            .where(
                and(
                    eq(goalsTable.id, goalId),
                    eq(goalsTable.userId, event.locals.user!.id),
                ),
            );
        if (!goal) {
            return fail(404, { success: false, error: 'goal not found' });
        }
        await db.insert(milestonesTable).values({ goalId, description });
        return { success: true };
    },
    updateMilestone: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        const description = data.get('description')?.toString().trim() ?? '';
        const dueDateRaw = data.get('dueDate')?.toString().trim() ?? '';
        const doneDateRaw = data.get('doneDate')?.toString().trim() ?? '';
        const noteRaw = data.get('note')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const dueDate = dueDateRaw === '' ? null : dueDateRaw;
        if (dueDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
            return { success: false, error: 'invalid due date' };
        }
        const doneDate = doneDateRaw === '' ? null : doneDateRaw;
        if (doneDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(doneDate)) {
            return { success: false, error: 'invalid done date' };
        }
        const note = noteRaw === '' ? null : noteRaw;
        const result = await db
            .update(milestonesTable)
            .set({ description, dueDate, doneDate, note })
            .where(
                and(
                    eq(milestonesTable.id, id),
                    inArray(
                        milestonesTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'milestone not found' });
        }
        return { success: true };
    },
    deleteMilestone: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        const result = await db
            .delete(milestonesTable)
            .where(
                and(
                    eq(milestonesTable.id, id),
                    inArray(
                        milestonesTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'milestone not found' });
        }
        return { success: true };
    },
    createHabit: async (event) => {
        const goalId = Number(event.params.id);
        const data = await event.request.formData();
        const description =
            data.get('habit-description')?.toString().trim() ?? '';
        if (!Number.isInteger(goalId) || goalId <= 0) {
            return { success: false, error: 'invalid goal id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const [goal] = await db
            .select()
            .from(goalsTable)
            .where(
                and(
                    eq(goalsTable.id, goalId),
                    eq(goalsTable.userId, event.locals.user!.id),
                ),
            );
        if (!goal) {
            return fail(404, { success: false, error: 'goal not found' });
        }
        await db.insert(habitsTable).values({ goalId, description });
        return { success: true };
    },
    updateHabit: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        const description = data.get('description')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const result = await db
            .update(habitsTable)
            .set({ description })
            .where(
                and(
                    eq(habitsTable.id, id),
                    inArray(
                        habitsTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'habit not found' });
        }
        return { success: true };
    },
    deleteHabit: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        const result = await db
            .delete(habitsTable)
            .where(
                and(
                    eq(habitsTable.id, id),
                    inArray(
                        habitsTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'habit not found' });
        }
        return { success: true };
    },
    markHabitDone: async (event) => {
        const data = await event.request.formData();
        const habitId = Number(data.get('id'));
        const date = data.get('date')?.toString().trim() ?? '';
        const noteRaw = data.get('note')?.toString().trim() ?? '';
        if (!Number.isInteger(habitId) || habitId <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return { success: false, error: 'invalid date' };
        }
        const note = noteRaw === '' ? null : noteRaw;
        const [habit] = await db
            .select()
            .from(habitsTable)
            .where(
                and(
                    eq(habitsTable.id, habitId),
                    inArray(
                        habitsTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (!habit) {
            return fail(404, { success: false, error: 'habit not found' });
        }
        await db.insert(habitRecordsTable).values({ habitId, date, note });
        return { success: true };
    },
    createMeasurement: async (event) => {
        const goalId = Number(event.params.id);
        const data = await event.request.formData();
        const description =
            data.get('measurement-description')?.toString().trim() ?? '';
        if (!Number.isInteger(goalId) || goalId <= 0) {
            return { success: false, error: 'invalid goal id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const [goal] = await db
            .select()
            .from(goalsTable)
            .where(
                and(
                    eq(goalsTable.id, goalId),
                    eq(goalsTable.userId, event.locals.user!.id),
                ),
            );
        if (!goal) {
            return fail(404, { success: false, error: 'goal not found' });
        }
        await db.insert(measurementsTable).values({ goalId, description });
        return { success: true };
    },
    updateMeasurement: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        const description = data.get('description')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const result = await db
            .update(measurementsTable)
            .set({ description })
            .where(
                and(
                    eq(measurementsTable.id, id),
                    inArray(
                        measurementsTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, {
                success: false,
                error: 'measurement not found',
            });
        }
        return { success: true };
    },
    deleteMeasurement: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        const result = await db
            .delete(measurementsTable)
            .where(
                and(
                    eq(measurementsTable.id, id),
                    inArray(
                        measurementsTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, {
                success: false,
                error: 'measurement not found',
            });
        }
        return { success: true };
    },
    deleteGoal: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        const result = await db
            .delete(goalsTable)
            .where(
                and(
                    eq(goalsTable.id, id),
                    eq(goalsTable.userId, event.locals.user!.id),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'goal not found' });
        }
        return { success: true };
    },
    recordMeasurement: async (event) => {
        const data = await event.request.formData();
        const measurementId = Number(data.get('id'));
        const date = data.get('date')?.toString().trim() ?? '';
        const valueRaw = data.get('value')?.toString().trim() ?? '';
        const noteRaw = data.get('note')?.toString().trim() ?? '';
        if (!Number.isInteger(measurementId) || measurementId <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return { success: false, error: 'invalid date' };
        }
        if (valueRaw === '' || Number.isNaN(Number(valueRaw))) {
            return { success: false, error: 'invalid value' };
        }
        const value = Number(valueRaw);
        const note = noteRaw === '' ? null : noteRaw;
        const [measurement] = await db
            .select()
            .from(measurementsTable)
            .where(
                and(
                    eq(measurementsTable.id, measurementId),
                    inArray(
                        measurementsTable.goalId,
                        db
                            .select({ id: goalsTable.id })
                            .from(goalsTable)
                            .where(
                                eq(goalsTable.userId, event.locals.user!.id),
                            ),
                    ),
                ),
            );
        if (!measurement) {
            return fail(404, {
                success: false,
                error: 'measurement not found',
            });
        }
        await db
            .insert(measurementRecordsTable)
            .values({ measurementId, date, value, note });
        return { success: true };
    },
};
