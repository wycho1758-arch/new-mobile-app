import { pgTable, bigserial, integer, timestamp } from 'drizzle-orm/pg-core';

export const counterEvents = pgTable('counter_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  count: integer('count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
