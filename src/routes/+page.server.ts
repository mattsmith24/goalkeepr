import type { Actions, PageServerLoad } from './$types';

import { db } from '$lib/server/db';
import { goals } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
    return {
        goals: await db.select().from(goals),
    };
};

export const actions: Actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const goal_description = data.get('goal-description')?.toString() ?? '';
        const goal: typeof goals.$inferInsert = {
            description: goal_description,
        };
        await db.insert(goals).values(goal);
    },
};
