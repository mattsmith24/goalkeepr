import { json } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';

import { db } from '$lib/server/db';
import {
    goalsTable,
    habitRecordsTable,
    habitsTable,
    measurementsTable,
    milestonesTable,
    measurementRecordsTable,
} from '$lib/server/db/schema';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
    const goals = await db
        .select()
        .from(goalsTable)
        .where(eq(goalsTable.userId, locals.user!.id));

    const goalIds = goals.map((goal) => goal.id);

    const milestones = await db
        .select()
        .from(milestonesTable)
        .where(inArray(milestonesTable.goalId, goalIds));

    const habits = await db
        .select()
        .from(habitsTable)
        .where(inArray(habitsTable.goalId, goalIds));

    const measurements = await db
        .select()
        .from(measurementsTable)
        .where(inArray(measurementsTable.goalId, goalIds));

    const habitRecords = await db
        .select()
        .from(habitRecordsTable)
        .where(
            inArray(
                habitRecordsTable.habitId,
                habits.map((habit) => habit.id),
            ),
        );

    const measurementRecords = await db
        .select()
        .from(measurementRecordsTable)
        .where(
            inArray(
                measurementRecordsTable.measurementId,
                measurements.map((measurement) => measurement.id),
            ),
        );

    const habitsData = habits.map((habit) => ({
        ...habit,
        records: habitRecords
            .filter((habitRecord) => habitRecord.habitId === habit.id)
            .map(
                ({ id: _id, habitId: _habitId, ...habitRecord }) => habitRecord,
            ),
    }));

    const measurementsData = measurements.map((measurement) => ({
        ...measurement,
        records: measurementRecords
            .filter(
                (measurementRecord) =>
                    measurementRecord.measurementId === measurement.id,
            )
            .map(
                ({
                    id: _id,
                    measurementId: _measurementId,
                    ...measurementRecord
                }) => measurementRecord,
            ),
    }));

    const goalsData = goals.map((goal) => {
        const { id, userId: _userId, ...rest } = goal;
        return {
            ...rest,
            milestones: milestones
                .filter((milestone) => milestone.goalId === id)
                .map(({ id: _id, goalId: _goalId, ...milestone }) => milestone),
            habits: habitsData
                .filter((habit) => habit.goalId === id)
                .map(({ id: _id, goalId: _goalId, ...habit }) => habit),
            measurements: measurementsData
                .filter((measurement) => measurement.goalId === id)
                .map(
                    ({ id: _id, goalId: _goalId, ...measurement }) =>
                        measurement,
                ),
        };
    });

    return json(goalsData, {
        headers: {
            'content-disposition': 'attachment; filename="export.json"',
        },
    });
};
