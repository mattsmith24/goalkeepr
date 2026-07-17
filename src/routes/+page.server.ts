import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { goalsTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
    return {
        goals: await db.select().from(goalsTable),
    };
};

export const actions: Actions = {
    create: async (event) => {
        const data = await event.request.formData();
        const goal_description = data.get('goal-description')?.toString() ?? '';
        const goal: typeof goalsTable.$inferInsert = {
            description: goal_description,
        };
        await db.insert(goalsTable).values(goal);
    },
    delete: async (event) => {
        const data = await event.request.formData();
        const id = Number(data.get('id'));
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        await db.delete(goalsTable).where(eq(goalsTable.id, id));
        return { success: true };
    },
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
};
