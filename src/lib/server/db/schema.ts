import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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
});

export const milestonesTable = sqliteTable('milestones', {
    id: integer().primaryKey({ autoIncrement: true }),
    goalId: integer()
        .notNull()
        .references(() => goalsTable.id, { onDelete: 'cascade' }),
    description: text().notNull(),
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
