import type { Actions, PageServerLoad } from './$types';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import {
    goalsTable,
    measurementRecordsTable,
    measurementsTable,
} from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ locals, params }) => {
    const goalId = Number(params.id);
    const measurementId = Number(params.measurementId);
    if (
        !Number.isInteger(goalId) ||
        goalId <= 0 ||
        !Number.isInteger(measurementId) ||
        measurementId <= 0
    ) {
        error(404, 'Measurement not found');
    }
    const userGoalIds = db
        .select({ id: goalsTable.id })
        .from(goalsTable)
        .where(eq(goalsTable.userId, locals.user!.id));
    const [measurement] = await db
        .select()
        .from(measurementsTable)
        .where(
            and(
                eq(measurementsTable.id, measurementId),
                inArray(measurementsTable.goalId, userGoalIds),
            ),
        );
    if (!measurement) {
        error(404, 'Measurement not found');
    }
    const records = await db
        .select()
        .from(measurementRecordsTable)
        .where(eq(measurementRecordsTable.measurementId, measurementId))
        .orderBy(desc(measurementRecordsTable.date));
    return { measurement, records };
};

export const actions: Actions = {
    deleteMeasurementRecord: async (event) => {
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
            .delete(measurementRecordsTable)
            .where(
                and(
                    eq(measurementRecordsTable.id, id),
                    inArray(
                        measurementRecordsTable.measurementId,
                        db
                            .select({ id: measurementsTable.id })
                            .from(measurementsTable)
                            .where(
                                inArray(measurementsTable.goalId, userGoalIds),
                            ),
                    ),
                ),
            );
        if (result.changes === 0) {
            return fail(404, { success: false, error: 'record not found' });
        }
        return { success: true };
    },
};
