import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { goalsTable, habitsTable, milestonesTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        error(404, 'Goal not found');
    }
    const [goal] = await db.select().from(goalsTable).where(eq(goalsTable.id, id));
    if (!goal) {
        error(404, 'Goal not found');
    }
    const milestones = await db
        .select()
        .from(milestonesTable)
        .where(eq(milestonesTable.goalId, id));
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.goalId, id));
    return { goal, milestones, habits };
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
        await db.update(goalsTable).set({ description }).where(eq(goalsTable.id, id));
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
        await db.update(milestonesTable).set({ description }).where(eq(milestonesTable.id, id));
        return { success: true };
    },
    deleteMilestone: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        await db.delete(milestonesTable).where(eq(milestonesTable.id, id));
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
        await db.update(habitsTable).set({ description }).where(eq(habitsTable.id, id));
        return { success: true };
    },
    deleteHabit: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        await db.delete(habitsTable).where(eq(habitsTable.id, id));
        return { success: true };
    },
};
