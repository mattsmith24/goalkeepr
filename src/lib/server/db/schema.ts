import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

//export * from './auth.schema';

export const goals = sqliteTable('goals', {
	id: integer().primaryKey({ autoIncrement: true}),
	description: text().notNull()
});
