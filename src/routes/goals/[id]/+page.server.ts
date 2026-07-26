import type { Actions, PageServerLoad } from './$types';

import { and, eq, inArray } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { goalsTable, habitsTable, measurementsTable, milestonesTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        error(404, 'Goal not found');
    }
    const [goal] = await db
        .select()
        .from(goalsTable)
        .where(and(eq(goalsTable.id, id), eq(goalsTable.userId, locals.user!.id)));
    if (!goal) {
        error(404, 'Goal not found');
    }
    const milestones = await db
        .select()
        .from(milestonesTable)
        .where(eq(milestonesTable.goalId, id));
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.goalId, id));
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
        await db
            .update(goalsTable)
            .set({ description })
            .where(and(eq(goalsTable.id, id), eq(goalsTable.userId, event.locals.user!.id)));
        return { success: true };
    },
    createMilestone: async (event) => {
        const goalId = Number(event.params.id);
        const data = await event.request.formData();
        const description = data.get('milestone-description')?.toString().trim() ?? '';
        if (!Number.isInteger(goalId) || goalId <= 0) {
            return { success: false, error: 'invalid goal id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const [goal] = await db
            .select()
            .from(goalsTable)
            .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, event.locals.user!.id)));
        if (!goal) {
            return { success: false, error: 'goal not found' };
        }
        await db.insert(milestonesTable).values({ goalId, description });
        return { success: true };
    },
    updateMilestone: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        const description = data.get('description')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        await db
            .update(milestonesTable)
            .set({ description })
            .where(and(
                eq(milestonesTable.id, id),
                inArray(
                    milestonesTable.goalId,
                    db
                        .select({ id: goalsTable.id })
                        .from(goalsTable)
                        .where(eq(goalsTable.userId, event.locals.user!.id))
                )
            ));
        return { success: true };
    },
    deleteMilestone: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        await db
            .delete(milestonesTable)
            .where(and(
                eq(milestonesTable.id, id),
                inArray(
                    milestonesTable.goalId,
                    db
                        .select({ id: goalsTable.id })
                        .from(goalsTable)
                        .where(eq(goalsTable.userId, event.locals.user!.id))
                )
            ));
        return { success: true };
    },
    createHabit: async (event) => {
        const goalId = Number(event.params.id);
        const data = await event.request.formData();
        const description = data.get('habit-description')?.toString().trim() ?? '';
        if (!Number.isInteger(goalId) || goalId <= 0) {
            return { success: false, error: 'invalid goal id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const [goal] = await db
            .select()
            .from(goalsTable)
            .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, event.locals.user!.id)));
        if (!goal) {
            return { success: false, error: 'goal not found' };
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
        await db
            .update(habitsTable)
            .set({ description })
            .where(and(
                eq(habitsTable.id, id),
                inArray(
                    habitsTable.goalId,
                    db
                        .select({ id: goalsTable.id })
                        .from(goalsTable)
                        .where(eq(goalsTable.userId, event.locals.user!.id))
                )
            ));
        return { success: true };
    },
    deleteHabit: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        await db
            .delete(habitsTable)
            .where(and(
                eq(habitsTable.id, id),
                inArray(
                    habitsTable.goalId,
                    db
                        .select({ id: goalsTable.id })
                        .from(goalsTable)
                        .where(eq(goalsTable.userId, event.locals.user!.id))
                )
            ));
        return { success: true };
    },
    createMeasurement: async (event) => {
        const goalId = Number(event.params.id);
        const data = await event.request.formData();
        const description = data.get('measurement-description')?.toString().trim() ?? '';
        if (!Number.isInteger(goalId) || goalId <= 0) {
            return { success: false, error: 'invalid goal id' };
        }
        if (!description) {
            return { success: false, error: 'description cannot be empty' };
        }
        const [goal] = await db
            .select()
            .from(goalsTable)
            .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, event.locals.user!.id)));
        if (!goal) {
            return { success: false, error: 'goal not found' };
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
        await db
            .update(measurementsTable)
            .set({ description })
            .where(and(
                eq(measurementsTable.id, id),
                inArray(
                    measurementsTable.goalId,
                    db
                        .select({ id: goalsTable.id })
                        .from(goalsTable)
                        .where(eq(goalsTable.userId, event.locals.user!.id))
                )
            ));
        return { success: true };
    },
    deleteMeasurement: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        await db
            .delete(measurementsTable)
            .where(and(
                eq(measurementsTable.id, id),
                inArray(
                    measurementsTable.goalId,
                    db
                        .select({ id: goalsTable.id })
                        .from(goalsTable)
                        .where(eq(goalsTable.userId, event.locals.user!.id))
                )
            ));
        return { success: true };
    },
};
