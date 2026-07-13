import {
  participantApiErrorCodeSchema,
  type ParticipantApiErrorCode,
  participantApplicationErrorCodeSchema,
  type ParticipantProfile,
  type Tournament,
  type TournamentApplication,
} from '@template/contracts';

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

let profile: ParticipantProfile = createInitialProfile();

const applications = new Map<string, TournamentApplication>();

export function resetParticipantMvpState() {
  profile = createInitialProfile();
  applications.clear();
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

export function getParticipantProfile() {
  return profile;
}

export function updateParticipantDupr(duprId: string) {
  profile = {
    ...profile,
    duprId: normalizeDuprId(duprId),
    duprStatus: 'selfReportedPendingOperatorReview',
  };
  return profile;
}

export function createTournamentApplication(input: {
  tournamentId: string;
  participantId?: string;
  duprId?: string;
  submittedAt?: string;
}) {
  const tournament = getTournament(input.tournamentId);
  const participantId = input.participantId ?? profile.participantId;
  const duprId = normalizeDuprId(input.duprId ?? profile.duprId ?? '');

  if (tournament.requiresDupr && !duprId) {
    throw new ParticipantMvpError(REQUIRED_DUPR_ERROR, 400);
  }

  const applicationId = `application_${tournament.tournamentId}_${participantId}`;
  const application: TournamentApplication = {
    applicationId,
    tournamentId: tournament.tournamentId,
    participantId,
    duprId,
    status: 'submitted',
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    supportChannel: 'oneToOneInquiry',
    paymentStatus: 'notStartedSandbox',
    refundPolicy: 'participantSelfCancelDisabled',
  };

  applications.set(applicationId, application);
  return application;
}

export function getTournamentApplication(applicationId: string) {
  const application = applications.get(applicationId);
  if (!application) {
    throw new ParticipantMvpError(APPLICATION_NOT_FOUND_ERROR, 404);
  }
  return application;
}

export function requestParticipantSelfCancel(applicationId: string) {
  getTournamentApplication(applicationId);
  throw new ParticipantMvpError(SELF_CANCEL_DISABLED_ERROR, 400);
}

function normalizeDuprId(duprId: string) {
  return duprId.trim().toUpperCase();
}
