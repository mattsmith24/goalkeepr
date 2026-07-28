import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { and, eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { goalsTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
    return {
        goals: await db
            .select()
            .from(goalsTable)
            .where(eq(goalsTable.userId, locals.user!.id)),
    };
};

export const actions: Actions = {
    create: async (event) => {
        const data = await event.request.formData();
        const goal_description = data.get('goal-description')?.toString() ?? '';
        const goal: typeof goalsTable.$inferInsert = {
            description: goal_description,
            userId: event.locals.user!.id,
        };
        await db.insert(goalsTable).values(goal);
    },
    delete: async (event) => {
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
};
