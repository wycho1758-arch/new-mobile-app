import { z } from 'zod';

export const COUNTER_INCREMENT = 1;

export const counterEventSchema = z.object({
  count: z.number().int().nonnegative(),
});
export type CounterEvent = z.infer<typeof counterEventSchema>;

export const counterEventRequestSchema = counterEventSchema;

export const counterEventRecordSchema = counterEventSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
});
export type CounterEventRecord = z.infer<typeof counterEventRecordSchema>;

export const supportChannelSchema = z.literal('oneToOneInquiry');

export const participantProfileSchema = z.object({
  participantId: z.string().min(1),
  displayName: z.string().min(1),
  duprId: z.string().min(1).optional(),
  duprStatus: z.enum(['missing', 'selfReportedPendingOperatorReview']),
  supportChannel: supportChannelSchema,
});
export type ParticipantProfile = z.infer<typeof participantProfileSchema>;

export const updateParticipantProfileRequestSchema = z.object({
  duprId: z.string().trim().min(1),
});
export type UpdateParticipantProfileRequest = z.infer<typeof updateParticipantProfileRequestSchema>;

export const tournamentSchema = z.object({
  tournamentId: z.string().min(1),
  title: z.string().min(1),
  division: z.string().min(1),
  location: z.string().min(1),
  startsAt: z.string(),
  applicationStatus: z.literal('available'),
  requiresDupr: z.literal(true),
  paymentMode: z.literal('operatorManagedOffline'),
  cancellationPolicy: z.literal('operatorSupportOnly'),
});
export type Tournament = z.infer<typeof tournamentSchema>;

export const tournamentDivisionSchema = z.object({
  divisionId: z.string().min(1),
  tournamentId: z.string().min(1),
  name: z.string().min(1),
  skillLevel: z.string().min(1).optional(),
  teamType: z.string().min(1),
  entryFeeKrw: z.number().int().nonnegative(),
  capacityTeams: z.number().int().positive().optional(),
});
export type TournamentDivision = z.infer<typeof tournamentDivisionSchema>;

export const tournamentDetailSchema = tournamentSchema.extend({
  divisions: z.array(tournamentDivisionSchema),
});
export type TournamentDetail = z.infer<typeof tournamentDetailSchema>;

export const tournamentListResponseSchema = z.object({
  tournaments: z.array(tournamentSchema),
});
export type TournamentListResponse = z.infer<typeof tournamentListResponseSchema>;

export const tournamentApplicationStatusSchema = z.enum(['submitted']);

export const participantApiErrorCodeSchema = z.enum([
  'DUPR_PROFILE_REQUIRED',
  'PARTICIPANT_SELF_CANCEL_DISABLED',
  'TOURNAMENT_NOT_FOUND',
  'APPLICATION_NOT_FOUND',
]);
export type ParticipantApiErrorCode = z.infer<typeof participantApiErrorCodeSchema>;

export const participantApplicationErrorCodeSchema = participantApiErrorCodeSchema;
export type ParticipantApplicationErrorCode = ParticipantApiErrorCode;

export const participantApiHttpErrorCodeSchema = z.string().regex(/^PARTICIPANT_API_HTTP_\d{3}$/);
export type ParticipantApiHttpErrorCode = z.infer<typeof participantApiHttpErrorCodeSchema>;

export const participantApiErrorResponseSchema = z.object({
  error: participantApiErrorCodeSchema,
});
export type ParticipantApiErrorResponse = z.infer<typeof participantApiErrorResponseSchema>;

export const tournamentApplicationSchema = z.object({
  applicationId: z.string().min(1),
  tournamentId: z.string().min(1),
  participantId: z.string().min(1),
  duprId: z.string().min(1),
  status: tournamentApplicationStatusSchema,
  submittedAt: z.string(),
  supportChannel: supportChannelSchema,
  paymentStatus: z.literal('notStartedSandbox'),
  refundPolicy: z.literal('participantSelfCancelDisabled'),
});
export type TournamentApplication = z.infer<typeof tournamentApplicationSchema>;

export const createTournamentApplicationRequestSchema = z.object({
  tournamentId: z.string().min(1),
  participantId: z.string().min(1).optional(),
  duprId: z.string().trim().min(1).optional(),
});
export type CreateTournamentApplicationRequest = z.infer<typeof createTournamentApplicationRequestSchema>;


export const supportInquirySchema = z.object({
  inquiryId: z.string().min(1),
  participantId: z.string().min(1).optional(),
  applicationId: z.string().min(1).optional(),
  channel: supportChannelSchema,
  category: z.string().min(1),
  subject: z.string().min(1),
  status: z.enum(['open', 'operatorReview', 'closed']),
  createdAt: z.string(),
});
export type SupportInquiry = z.infer<typeof supportInquirySchema>;

export const supportCenterResponseSchema = z.object({
  policyCopy: z.string().min(1),
  contactEmail: z.string().email(),
  operatingHours: z.string().min(1),
  inquiries: z.array(supportInquirySchema),
});
export type SupportCenterResponse = z.infer<typeof supportCenterResponseSchema>;

export const createSupportInquiryRequestSchema = z.object({
  category: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  applicationId: z.string().trim().min(1).optional(),
});
export type CreateSupportInquiryRequest = z.infer<typeof createSupportInquiryRequestSchema>;

export const participantNotificationSchema = z.object({
  notificationId: z.string().min(1),
  participantId: z.string().min(1),
  type: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  relatedApplicationId: z.string().min(1).optional(),
  readAt: z.string().optional(),
  createdAt: z.string(),
});
export type ParticipantNotification = z.infer<typeof participantNotificationSchema>;

export const notificationListResponseSchema = z.object({
  notifications: z.array(participantNotificationSchema),
});
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;

export const paymentRecordSchema = z.object({
  paymentRecordId: z.string().min(1),
  applicationId: z.string().min(1),
  participantId: z.string().min(1),
  amountKrw: z.number().int().nonnegative(),
  paymentMode: z.literal('operatorManagedOffline'),
  status: z.enum(['notStartedSandbox', 'operatorReview', 'confirmedOffline']),
  operatorNote: z.string().min(1).optional(),
  recordedAt: z.string(),
});
export type PaymentRecord = z.infer<typeof paymentRecordSchema>;

export const myPageResponseSchema = z.object({
  profile: participantProfileSchema,
  applications: z.array(tournamentApplicationSchema),
  paymentRecords: z.array(paymentRecordSchema),
});
export type MyPageResponse = z.infer<typeof myPageResponseSchema>;
