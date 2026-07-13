import { pgTable, bigserial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const counterEvents = pgTable('counter_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  count: integer('count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const participantProfiles = pgTable('participant_profiles', {
  participantId: text('participant_id').primaryKey(),
  displayName: text('display_name').notNull(),
  duprId: text('dupr_id'),
  duprStatus: text('dupr_status').notNull(),
  supportChannel: text('support_channel').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tournamentApplications = pgTable('tournament_applications', {
  applicationId: text('application_id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  participantId: text('participant_id').notNull(),
  duprId: text('dupr_id').notNull(),
  status: text('status').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull(),
  supportChannel: text('support_channel').notNull(),
  paymentStatus: text('payment_status').notNull(),
  refundPolicy: text('refund_policy').notNull(),
});
