import type { Actions, PageServerLoad } from './$types';

import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { goalsTable } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
        error(404, 'Goal not found');
    }
    const [goal] = await db.select().from(goalsTable).where(eq(goalsTable.id, id));
    if (!goal) {
        error(404, 'Goal not found');
    }
    return { goal };
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
};
