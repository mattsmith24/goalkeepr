import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { goalsTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
    return {
        goals: await db
            .select()
            .from(goalsTable)
            .where(eq(goalsTable.userId, locals.user!.id))
            .orderBy(
                isNull(goalsTable.doneDate),
                desc(goalsTable.doneDate),
                desc(goalsTable.id),
            ),
    };
};

export const actions: Actions = {
    create: async (event) => {
        const data = await event.request.formData();
        const goal_title = data.get('goal-title')?.toString() ?? '';
        const goal: typeof goalsTable.$inferInsert = {
            title: goal_title,
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
        const title = data.get('title')?.toString().trim() ?? '';
        if (!Number.isInteger(id) || id <= 0) {
            return { success: false, error: 'invalid id' };
        }
        if (!title) {
            return { success: false, error: 'title cannot be empty' };
        }
        const result = await db
            .update(goalsTable)
            .set({ title })
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
