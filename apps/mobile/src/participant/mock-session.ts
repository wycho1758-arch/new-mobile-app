export type SessionActor = {
  actorId: string;
  role: 'participant' | 'organizer' | 'operator' | 'apiConsumer';
  participantId?: string;
  organizerId?: string;
  scopes: string[];
  sessionId: string;
  issuedAt: string;
};

export type ParticipantProfile = {
  participantId: string;
  displayName: string;
  duprId?: string;
  supportChannel: 'oneToOneInquiry';
};

export type MockTournament = {
  tournamentId: string;
  title: string;
  division: string;
  location: string;
  applicationStatus: 'available';
  requiresDupr: true;
  paymentMode: 'operatorManagedOffline';
  cancellationPolicy: 'operatorSupportOnly';
};

export type MockTournamentApplication = {
  applicationId: string;
  tournamentId: string;
  participantId: string;
  duprId: string;
  status: 'submitted';
  submittedAt: string;
  supportChannel: 'oneToOneInquiry';
  paymentStatus: 'notStartedSandbox';
  refundPolicy: 'participantSelfCancelDisabled';
};

export type ParticipantShellState = {
  sessionActor: SessionActor;
  profile: ParticipantProfile;
  featuredTournament: MockTournament;
};

export const REQUIRED_DUPR_ERROR = 'DUPR_PROFILE_REQUIRED';

export const sandboxFeaturedTournament: MockTournament = {
  tournamentId: 'tournament_sandbox_001',
  title: 'PickleHub Sandbox Open',
  division: 'Mixed Doubles 3.5+',
  location: 'Dev/Sandbox Court',
  applicationStatus: 'available',
  requiresDupr: true,
  paymentMode: 'operatorManagedOffline',
  cancellationPolicy: 'operatorSupportOnly',
};

export const sandboxParticipantSession: ParticipantShellState = {
  sessionActor: {
    actorId: 'actor_sandbox_social_001',
    role: 'participant',
    participantId: 'participant_sandbox_001',
    scopes: ['participant:profile:read', 'participant:profile:update', 'participant:application:create'],
    sessionId: 'session_sandbox_social_001',
    issuedAt: '2026-07-08T00:00:00.000Z',
  },
  profile: {
    participantId: 'participant_sandbox_001',
    displayName: 'Sandbox Player',
    supportChannel: 'oneToOneInquiry',
  },
  featuredTournament: sandboxFeaturedTournament,
};

export function normalizeDuprId(duprId: string) {
  return duprId.trim().toUpperCase();
}

export function hasRequiredDupr(profile: Pick<ParticipantProfile, 'duprId'>) {
  return Boolean(profile.duprId?.trim());
}

export function saveSandboxDupr(profile: ParticipantProfile, duprId: string): ParticipantProfile {
  return {
    ...profile,
    duprId: normalizeDuprId(duprId),
  };
}

export function submitSandboxTournamentApplication(input: {
  profile: ParticipantProfile;
  tournament: MockTournament;
  submittedAt?: string;
}): MockTournamentApplication {
  if (!hasRequiredDupr(input.profile)) {
    throw new Error(REQUIRED_DUPR_ERROR);
  }

  return {
    applicationId: `application_${input.tournament.tournamentId}_${input.profile.participantId}`,
    tournamentId: input.tournament.tournamentId,
    participantId: input.profile.participantId,
    duprId: normalizeDuprId(input.profile.duprId ?? ''),
    status: 'submitted',
    submittedAt: input.submittedAt ?? '2026-07-08T00:00:00.000Z',
    supportChannel: 'oneToOneInquiry',
    paymentStatus: 'notStartedSandbox',
    refundPolicy: 'participantSelfCancelDisabled',
  };
}
