import { eq } from 'drizzle-orm';
import {
  participantApiErrorCodeSchema,
  type ParticipantApiErrorCode,
  participantApplicationErrorCodeSchema,
  participantProfileSchema,
  type ParticipantProfile,
  type Tournament,
  tournamentApplicationSchema,
  type TournamentApplication,
} from '@template/contracts';
import { db } from '../db/client.js';
import { participantProfiles, tournamentApplications } from '../db/schema.js';

const SANDBOX_PARTICIPANT_ID = 'participant_sandbox_001';
const REQUIRED_DUPR_ERROR = participantApplicationErrorCodeSchema.enum.DUPR_PROFILE_REQUIRED;
const SELF_CANCEL_DISABLED_ERROR = participantApplicationErrorCodeSchema.enum.PARTICIPANT_SELF_CANCEL_DISABLED;
const TOURNAMENT_NOT_FOUND_ERROR = participantApiErrorCodeSchema.enum.TOURNAMENT_NOT_FOUND;
const APPLICATION_NOT_FOUND_ERROR = participantApiErrorCodeSchema.enum.APPLICATION_NOT_FOUND;

export class ParticipantMvpError extends Error {
  constructor(
    message: ParticipantApiErrorCode,
    public readonly status: 400 | 404,
  ) {
    super(message);
  }
}

const tournaments: Tournament[] = [
  {
    tournamentId: 'tournament_sandbox_001',
    title: 'PickleHub Sandbox Open',
    division: 'Mixed Doubles 3.5+',
    location: 'Dev/Sandbox Court',
    startsAt: '2026-08-09T09:00:00.000+09:00',
    applicationStatus: 'available',
    requiresDupr: true,
    paymentMode: 'operatorManagedOffline',
    cancellationPolicy: 'operatorSupportOnly',
  },
];

function createInitialProfile(): ParticipantProfile {
  return {
    participantId: SANDBOX_PARTICIPANT_ID,
    displayName: 'Sandbox Player',
    duprStatus: 'missing',
    supportChannel: 'oneToOneInquiry',
  };
}

let memoryProfile: ParticipantProfile = createInitialProfile();
const memoryApplications = new Map<string, TournamentApplication>();

const useMemoryStore = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

export async function resetParticipantMvpState() {
  memoryProfile = createInitialProfile();
  memoryApplications.clear();

  if (useMemoryStore) return;

  await db.delete(tournamentApplications);
  await db.delete(participantProfiles);
}

export function listTournaments() {
  return tournaments;
}

export function getTournament(tournamentId: string) {
  const tournament = tournaments.find((item) => item.tournamentId === tournamentId);
  if (!tournament) {
    throw new ParticipantMvpError(TOURNAMENT_NOT_FOUND_ERROR, 404);
  }
  return tournament;
}

export async function getParticipantProfile() {
  if (useMemoryStore) return memoryProfile;

  const [existingProfile] = await db
    .select()
    .from(participantProfiles)
    .where(eq(participantProfiles.participantId, SANDBOX_PARTICIPANT_ID))
    .limit(1);

  if (existingProfile) return parseProfileRow(existingProfile);

  const initialProfile = createInitialProfile();
  await db.insert(participantProfiles).values({
    participantId: initialProfile.participantId,
    displayName: initialProfile.displayName,
    duprId: initialProfile.duprId,
    duprStatus: initialProfile.duprStatus,
    supportChannel: initialProfile.supportChannel,
  });
  return initialProfile;
}

export async function updateParticipantDupr(duprId: string) {
  const currentProfile = await getParticipantProfile();
  const nextProfile: ParticipantProfile = {
    ...currentProfile,
    duprId: normalizeDuprId(duprId),
    duprStatus: 'selfReportedPendingOperatorReview',
  };

  if (useMemoryStore) {
    memoryProfile = nextProfile;
    return memoryProfile;
  }

  const [storedProfile] = await db
    .insert(participantProfiles)
    .values({
      participantId: nextProfile.participantId,
      displayName: nextProfile.displayName,
      duprId: nextProfile.duprId,
      duprStatus: nextProfile.duprStatus,
      supportChannel: nextProfile.supportChannel,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: participantProfiles.participantId,
      set: {
        displayName: nextProfile.displayName,
        duprId: nextProfile.duprId,
        duprStatus: nextProfile.duprStatus,
        supportChannel: nextProfile.supportChannel,
        updatedAt: new Date(),
      },
    })
    .returning();

  return parseProfileRow(storedProfile);
}

export async function createTournamentApplication(input: {
  tournamentId: string;
  participantId?: string;
  duprId?: string;
  submittedAt?: string;
}) {
  const tournament = getTournament(input.tournamentId);
  const currentProfile = await getParticipantProfile();
  const participantId = input.participantId ?? currentProfile.participantId;
  const duprId = normalizeDuprId(input.duprId ?? currentProfile.duprId ?? '');

  if (tournament.requiresDupr && !duprId) {
    throw new ParticipantMvpError(REQUIRED_DUPR_ERROR, 400);
  }

  const application: TournamentApplication = {
    applicationId: `application_${tournament.tournamentId}_${participantId}`,
    tournamentId: tournament.tournamentId,
    participantId,
    duprId,
    status: 'submitted',
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    supportChannel: 'oneToOneInquiry',
    paymentStatus: 'notStartedSandbox',
    refundPolicy: 'participantSelfCancelDisabled',
  };

  if (useMemoryStore) {
    memoryApplications.set(application.applicationId, application);
    return application;
  }

  const [storedApplication] = await db
    .insert(tournamentApplications)
    .values({
      applicationId: application.applicationId,
      tournamentId: application.tournamentId,
      participantId: application.participantId,
      duprId: application.duprId,
      status: application.status,
      submittedAt: new Date(application.submittedAt),
      supportChannel: application.supportChannel,
      paymentStatus: application.paymentStatus,
      refundPolicy: application.refundPolicy,
    })
    .onConflictDoUpdate({
      target: tournamentApplications.applicationId,
      set: {
        duprId: application.duprId,
        status: application.status,
        submittedAt: new Date(application.submittedAt),
        supportChannel: application.supportChannel,
        paymentStatus: application.paymentStatus,
        refundPolicy: application.refundPolicy,
      },
    })
    .returning();

  return parseApplicationRow(storedApplication);
}

export async function getTournamentApplication(applicationId: string) {
  if (useMemoryStore) {
    const application = memoryApplications.get(applicationId);
    if (!application) throw new ParticipantMvpError(APPLICATION_NOT_FOUND_ERROR, 404);
    return application;
  }

  const [application] = await db
    .select()
    .from(tournamentApplications)
    .where(eq(tournamentApplications.applicationId, applicationId))
    .limit(1);
  if (!application) throw new ParticipantMvpError(APPLICATION_NOT_FOUND_ERROR, 404);
  return parseApplicationRow(application);
}

export async function requestParticipantSelfCancel(applicationId: string) {
  await getTournamentApplication(applicationId);
  throw new ParticipantMvpError(SELF_CANCEL_DISABLED_ERROR, 400);
}

function normalizeDuprId(duprId: string) {
  return duprId.trim().toUpperCase();
}

function parseProfileRow(row: typeof participantProfiles.$inferSelect) {
  return participantProfileSchema.parse({
    participantId: row.participantId,
    displayName: row.displayName,
    duprId: row.duprId ?? undefined,
    duprStatus: row.duprStatus,
    supportChannel: row.supportChannel,
  });
}

function parseApplicationRow(row: typeof tournamentApplications.$inferSelect) {
  return tournamentApplicationSchema.parse({
    applicationId: row.applicationId,
    tournamentId: row.tournamentId,
    participantId: row.participantId,
    duprId: row.duprId,
    status: row.status,
    submittedAt: row.submittedAt.toISOString(),
    supportChannel: row.supportChannel,
    paymentStatus: row.paymentStatus,
    refundPolicy: row.refundPolicy,
  });
}
