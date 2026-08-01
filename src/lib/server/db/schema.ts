import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { user } from './auth.schema';

export const task = sqliteTable('task', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    priority: integer('priority').notNull().default(1),
});

export * from './auth.schema';

export const goalsTable = sqliteTable('goals', {
    id: integer().primaryKey({ autoIncrement: true }),
    description: text().notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
});

export const milestonesTable = sqliteTable('milestones', {
    id: integer().primaryKey({ autoIncrement: true }),
    goalId: integer()
        .notNull()
        .references(() => goalsTable.id, { onDelete: 'cascade' }),
    description: text().notNull(),
    dueDate: text('due_date'),
    doneDate: text('done_date'),
    note: text(),
});

export const habitsTable = sqliteTable('habits', {
    id: integer().primaryKey({ autoIncrement: true }),
    goalId: integer()
        .notNull()
        .references(() => goalsTable.id, { onDelete: 'cascade' }),
    description: text().notNull(),
});

export const measurementsTable = sqliteTable('measurements', {
    id: integer().primaryKey({ autoIncrement: true }),
    goalId: integer()
        .notNull()
        .references(() => goalsTable.id, { onDelete: 'cascade' }),
    description: text().notNull(),
});
