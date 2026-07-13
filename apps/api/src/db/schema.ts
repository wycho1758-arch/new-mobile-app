import { pgTable, bigserial, boolean, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const counterEvents = pgTable('counter_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  count: integer('count').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tournaments = pgTable('tournaments', {
  tournamentId: text('tournament_id').primaryKey(),
  title: text('title').notNull(),
  division: text('division').notNull(),
  location: text('location').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  applicationStatus: text('application_status').notNull(),
  requiresDupr: boolean('requires_dupr').notNull().default(true),
  paymentMode: text('payment_mode').notNull(),
  cancellationPolicy: text('cancellation_policy').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tournamentDivisions = pgTable('tournament_divisions', {
  divisionId: text('division_id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  name: text('name').notNull(),
  skillLevel: text('skill_level'),
  teamType: text('team_type').notNull(),
  entryFeeKrw: integer('entry_fee_krw').notNull(),
  capacityTeams: integer('capacity_teams'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
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
  divisionId: text('division_id'),
  participantId: text('participant_id').notNull(),
  partnerInvitationId: text('partner_invitation_id'),
  duprId: text('dupr_id').notNull(),
  status: text('status').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull(),
  supportChannel: text('support_channel').notNull(),
  paymentStatus: text('payment_status').notNull(),
  refundPolicy: text('refund_policy').notNull(),
});

export const partnerInvitations = pgTable('partner_invitations', {
  invitationId: text('invitation_id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  divisionId: text('division_id'),
  applicationId: text('application_id'),
  inviterParticipantId: text('inviter_participant_id').notNull(),
  inviteeContact: text('invitee_contact').notNull(),
  status: text('status').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const supportInquiries = pgTable('support_inquiries', {
  inquiryId: text('inquiry_id').primaryKey(),
  participantId: text('participant_id'),
  applicationId: text('application_id'),
  channel: text('channel').notNull(),
  category: text('category').notNull(),
  subject: text('subject').notNull(),
  status: text('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const paymentRecords = pgTable('payment_records', {
  paymentRecordId: text('payment_record_id').primaryKey(),
  applicationId: text('application_id').notNull(),
  participantId: text('participant_id').notNull(),
  amountKrw: integer('amount_krw').notNull(),
  paymentMode: text('payment_mode').notNull(),
  status: text('status').notNull(),
  operatorNote: text('operator_note'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable('notifications', {
  notificationId: text('notification_id').primaryKey(),
  participantId: text('participant_id').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  relatedApplicationId: text('related_application_id'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
