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
