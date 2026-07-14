import { desc, eq } from 'drizzle-orm';
import {
  createSupportInquiryRequestSchema,
  myPageResponseSchema,
  notificationListResponseSchema,
  participantGamesResponseSchema,
  participantApiErrorCodeSchema,
  type ParticipantApiErrorCode,
  participantApplicationErrorCodeSchema,
  participantProfileSchema,
  paymentRecordSchema,
  type PaymentRecord,
  type ParticipantProfile,
  supportCenterResponseSchema,
  supportInquirySchema,
  type Tournament,
  tournamentDetailSchema,
  tournamentDivisionSchema,
  tournamentApplicationSchema,
  tournamentSchema,
  type TournamentApplication,
} from '@template/contracts';
import { db } from '../db/client.js';
import { notifications, participantProfiles, paymentRecords, supportInquiries, tournamentApplications, tournamentDivisions, tournaments } from '../db/schema.js';

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

const sandboxTournaments: Tournament[] = [
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
const memorySupportInquiries = new Map<string, ReturnType<typeof supportInquirySchema.parse>>();

const useMemoryStore = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

export async function resetParticipantMvpState() {
  memoryProfile = createInitialProfile();
  memoryApplications.clear();
  memorySupportInquiries.clear();

  if (useMemoryStore) return;

  await db.delete(tournamentApplications);
  await db.delete(participantProfiles);
}

export async function listTournaments() {
  if (useMemoryStore) return sandboxTournaments;

  const rows = await db.select().from(tournaments);
  if (rows.length > 0) return rows.map(parseTournamentRow);

  await seedSandboxTournaments();
  const seededRows = await db.select().from(tournaments);
  return seededRows.map(parseTournamentRow);
}

export async function getTournament(tournamentId: string) {
  const catalog = await listTournaments();
  const tournament = catalog.find((item) => item.tournamentId === tournamentId);
  if (!tournament) {
    throw new ParticipantMvpError(TOURNAMENT_NOT_FOUND_ERROR, 404);
  }
  const divisions = await listTournamentDivisions(tournament.tournamentId);
  return tournamentDetailSchema.parse({ ...tournament, divisions });
}

export async function listTournamentDivisions(tournamentId: string) {
  if (useMemoryStore) return sandboxDivisions.filter((division) => division.tournamentId === tournamentId);

  await seedSandboxTournaments();
  const rows = await db.select().from(tournamentDivisions).where(eq(tournamentDivisions.tournamentId, tournamentId));
  return rows.map(parseDivisionRow);
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
  divisionId?: string;
  submittedAt?: string;
}) {
  const tournament = await getTournament(input.tournamentId);
  const currentProfile = await getParticipantProfile();
  const participantId = input.participantId ?? currentProfile.participantId;
  const duprId = normalizeDuprId(input.duprId ?? currentProfile.duprId ?? '');
  const divisionId = await resolveApplicationDivisionId(tournament.tournamentId, input.divisionId);

  if (tournament.requiresDupr && !duprId) {
    throw new ParticipantMvpError(REQUIRED_DUPR_ERROR, 400);
  }

  const application: TournamentApplication = {
    applicationId: `application_${tournament.tournamentId}_${participantId}`,
    tournamentId: tournament.tournamentId,
    participantId,
    duprId,
    divisionId,
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
      divisionId: application.divisionId,
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
        divisionId: application.divisionId,
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

export async function getSupportCenter() {
  const profile = await getParticipantProfile();
  const inquiries = await listSupportInquiries(profile.participantId);
  return supportCenterResponseSchema.parse({
    policyCopy: '참가자 직접 취소 불가 · 1:1 문의로 접수됩니다. Participant self-cancel/refund is not available in MVP. DUPR 정보는 어디서 확인하나요? DUPR 앱 또는 공식 프로필에서 확인해 주세요.',
    contactEmail: 'support@happickle.kr',
    operatingHours: '평일 10:00 ~ 18:00 (주말·공휴일 휴무)',
    inquiries,
  });
}

export async function listSupportInquiries(participantId = SANDBOX_PARTICIPANT_ID) {
  if (useMemoryStore) {
    if (memorySupportInquiries.size === 0) seedMemorySupportInquiries();
    return [...memorySupportInquiries.values()].filter((inquiry) => inquiry.participantId === participantId);
  }
  await seedSandboxSupportInquiries();
  const rows = await db.select().from(supportInquiries).where(eq(supportInquiries.participantId, participantId)).orderBy(desc(supportInquiries.createdAt));
  return rows.map(parseSupportInquiryRow);
}

export async function createSupportInquiry(input: unknown) {
  const parsed = createSupportInquiryRequestSchema.parse(input);
  const profile = await getParticipantProfile();
  const now = new Date();
  const inquiry = supportInquirySchema.parse({
    inquiryId: `inquiry_${now.getTime()}`,
    participantId: profile.participantId,
    applicationId: parsed.applicationId,
    channel: 'oneToOneInquiry',
    category: parsed.category,
    subject: parsed.subject,
    status: 'open',
    createdAt: now.toISOString(),
  });
  if (useMemoryStore) {
    memorySupportInquiries.set(inquiry.inquiryId, inquiry);
    return inquiry;
  }
  const [stored] = await db.insert(supportInquiries).values({
    inquiryId: inquiry.inquiryId,
    participantId: inquiry.participantId,
    applicationId: inquiry.applicationId,
    channel: inquiry.channel,
    category: inquiry.category,
    subject: inquiry.subject,
    status: inquiry.status,
    createdAt: now,
    updatedAt: now,
  }).returning();
  return parseSupportInquiryRow(stored);
}

export async function listNotifications() {
  const profile = await getParticipantProfile();
  if (useMemoryStore) return notificationListResponseSchema.parse({ notifications: sandboxNotifications(profile.participantId) });
  await seedSandboxNotifications(profile.participantId);
  const rows = await db.select().from(notifications).where(eq(notifications.participantId, profile.participantId)).orderBy(desc(notifications.createdAt));
  return notificationListResponseSchema.parse({ notifications: rows.map(parseNotificationRow) });
}

export async function getMyPage() {
  const profile = await getParticipantProfile();
  if (useMemoryStore) {
    return myPageResponseSchema.parse({ profile, applications: [...memoryApplications.values()], paymentRecords: sandboxPaymentRecords(profile.participantId, [...memoryApplications.values()]) });
  }
  await seedSandboxPaymentRecords(profile.participantId);
  const [applicationRows, paymentRows] = await Promise.all([
    db.select().from(tournamentApplications).where(eq(tournamentApplications.participantId, profile.participantId)),
    db.select().from(paymentRecords).where(eq(paymentRecords.participantId, profile.participantId)).orderBy(desc(paymentRecords.recordedAt)),
  ]);
  return myPageResponseSchema.parse({ profile, applications: applicationRows.map(parseApplicationRow), paymentRecords: paymentRows.map(parsePaymentRecordRow) });
}


export async function listParticipantGames() {
  const profile = await getParticipantProfile();

  if (useMemoryStore) {
    const applications = [...memoryApplications.values()];
    const payments = sandboxPaymentRecords(profile.participantId, applications);
    return participantGamesResponseSchema.parse({
      games: applications.map((application) => buildParticipantGame({
        application,
        tournament: sandboxTournaments.find((item) => item.tournamentId === application.tournamentId) ?? sandboxTournaments[0],
        divisionName: sandboxDivisions.find((division) => division.divisionId === application.divisionId)?.name,
        payment: payments.find((payment) => payment.applicationId === application.applicationId),
        dataSource: 'memoryFallback',
      })),
    });
  }

  await seedSandboxTournaments();
  await seedSandboxPaymentRecords(profile.participantId);

  const [applicationRows, tournamentRows, divisionRows, paymentRows] = await Promise.all([
    db.select().from(tournamentApplications).where(eq(tournamentApplications.participantId, profile.participantId)),
    db.select().from(tournaments),
    db.select().from(tournamentDivisions),
    db.select().from(paymentRecords).where(eq(paymentRecords.participantId, profile.participantId)),
  ]);

  const parsedTournaments = tournamentRows.map(parseTournamentRow);
  const parsedDivisions = divisionRows.map(parseDivisionRow);
  const parsedPayments = paymentRows.map(parsePaymentRecordRow);

  return participantGamesResponseSchema.parse({
    games: applicationRows.map(parseApplicationRow).map((application) => buildParticipantGame({
      application,
      tournament: parsedTournaments.find((item) => item.tournamentId === application.tournamentId),
      divisionName: parsedDivisions.find((division) => division.divisionId === application.divisionId)?.name,
      payment: parsedPayments.find((payment) => payment.applicationId === application.applicationId),
      dataSource: 'db',
    })),
  });
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


function buildParticipantGame(input: {
  application: TournamentApplication;
  tournament?: Tournament;
  divisionName?: string;
  payment?: PaymentRecord;
  dataSource: 'db' | 'memoryFallback';
}) {
  const tournament = input.tournament ?? sandboxTournaments[0];
  return {
    gameId: `game_${input.application.applicationId}`,
    applicationId: input.application.applicationId,
    tournamentId: input.application.tournamentId,
    tournamentTitle: tournament.title,
    divisionName: input.divisionName,
    location: tournament.location,
    startsAt: tournament.startsAt,
    applicationStatus: input.application.status,
    paymentStatus: input.payment?.status ?? input.application.paymentStatus,
    paymentAmountKrw: input.payment?.amountKrw,
    supportChannel: input.application.supportChannel,
    dataSource: input.dataSource,
  };
}

function normalizeDuprId(duprId: string) {
  return duprId.trim().toUpperCase();
}

async function resolveApplicationDivisionId(tournamentId: string, requestedDivisionId?: string) {
  if (requestedDivisionId) return requestedDivisionId;
  const [defaultDivision] = await listTournamentDivisions(tournamentId);
  return defaultDivision?.divisionId;
}

async function seedSandboxTournaments() {
  await db.insert(tournaments).values(
    sandboxTournaments.map((tournament) => ({
      tournamentId: tournament.tournamentId,
      title: tournament.title,
      division: tournament.division,
      location: tournament.location,
      startsAt: new Date(tournament.startsAt),
      applicationStatus: tournament.applicationStatus,
      requiresDupr: tournament.requiresDupr,
      paymentMode: tournament.paymentMode,
      cancellationPolicy: tournament.cancellationPolicy,
    })),
  ).onConflictDoNothing();
  await db.insert(tournamentDivisions).values(sandboxDivisions.map((division) => ({
    divisionId: division.divisionId,
    tournamentId: division.tournamentId,
    name: division.name,
    skillLevel: division.skillLevel,
    teamType: division.teamType,
    entryFeeKrw: division.entryFeeKrw,
    capacityTeams: division.capacityTeams,
  }))).onConflictDoNothing();
}

const sandboxDivisions = [
  { divisionId: 'division_sandbox_mixed_35', tournamentId: 'tournament_sandbox_001', name: '혼합복식', skillLevel: 'DUPR 3.5+', teamType: 'doubles', entryFeeKrw: 60000, capacityTeams: 32 },
  { divisionId: 'division_sandbox_mens_open', tournamentId: 'tournament_sandbox_001', name: '남자복식', skillLevel: 'DUPR 3.5~4.5', teamType: 'doubles', entryFeeKrw: 60000, capacityTeams: 64 },
].map((division) => tournamentDivisionSchema.parse(division));

function seedMemorySupportInquiries() {
  const now = '2026-07-13T09:00:00.000Z';
  memorySupportInquiries.set('inquiry_sandbox_refund', supportInquirySchema.parse({ inquiryId: 'inquiry_sandbox_refund', participantId: SANDBOX_PARTICIPANT_ID, channel: 'oneToOneInquiry', category: 'refund', subject: '환불/취소는 1:1 문의로 접수', status: 'operatorReview', createdAt: now }));
}

async function seedSandboxSupportInquiries() {
  await getParticipantProfile();
  await db.insert(supportInquiries).values({ inquiryId: 'inquiry_sandbox_refund', participantId: SANDBOX_PARTICIPANT_ID, channel: 'oneToOneInquiry', category: 'refund', subject: '환불/취소는 1:1 문의로 접수', status: 'operatorReview', createdAt: new Date('2026-07-13T09:00:00.000Z'), updatedAt: new Date('2026-07-13T09:00:00.000Z') }).onConflictDoNothing();
}

function sandboxNotifications(participantId: string) {
  return [
    { notificationId: 'notification_sandbox_deadline', participantId, type: 'tournamentDeadline', title: '대회 마감 임박!', body: '오늘까지 신청하세요', createdAt: '2026-07-13T09:00:00.000Z' },
    { notificationId: 'notification_sandbox_support', participantId, type: 'support', title: '1:1 문의 접수 안내', body: '취소/환불은 운영자 확인 후 안내됩니다.', createdAt: '2026-07-13T08:30:00.000Z' },
  ];
}

async function seedSandboxNotifications(participantId: string) {
  await db.insert(notifications).values(sandboxNotifications(participantId).map((item) => ({ ...item, createdAt: new Date(item.createdAt) }))).onConflictDoNothing();
}

function sandboxPaymentRecords(participantId: string, applications: TournamentApplication[]) {
  return applications.map((application) => paymentRecordSchema.parse({ paymentRecordId: `payment_${application.applicationId}`, applicationId: application.applicationId, participantId, amountKrw: 60000, paymentMode: 'operatorManagedOffline', status: 'notStartedSandbox', operatorNote: '운영자 오프라인 입금 확인 대기', recordedAt: application.submittedAt }));
}

async function seedSandboxPaymentRecords(participantId: string) {
  const applicationRows = await db.select().from(tournamentApplications).where(eq(tournamentApplications.participantId, participantId));
  if (applicationRows.length === 0) return;
  await db.insert(paymentRecords).values(applicationRows.map((application) => ({ paymentRecordId: `payment_${application.applicationId}`, applicationId: application.applicationId, participantId, amountKrw: 60000, paymentMode: 'operatorManagedOffline', status: 'notStartedSandbox', operatorNote: '운영자 오프라인 입금 확인 대기', recordedAt: application.submittedAt, updatedAt: new Date() }))).onConflictDoNothing();
}

function parseTournamentRow(row: typeof tournaments.$inferSelect) {
  return tournamentSchema.parse({
    tournamentId: row.tournamentId,
    title: row.title,
    division: row.division,
    location: row.location,
    startsAt: row.startsAt.toISOString(),
    applicationStatus: row.applicationStatus,
    requiresDupr: row.requiresDupr,
    paymentMode: row.paymentMode,
    cancellationPolicy: row.cancellationPolicy,
  });
}

function parseDivisionRow(row: typeof tournamentDivisions.$inferSelect) {
  return tournamentDivisionSchema.parse({
    divisionId: row.divisionId,
    tournamentId: row.tournamentId,
    name: row.name,
    skillLevel: row.skillLevel ?? undefined,
    teamType: row.teamType,
    entryFeeKrw: row.entryFeeKrw,
    capacityTeams: row.capacityTeams ?? undefined,
  });
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
    divisionId: row.divisionId ?? undefined,
    status: row.status,
    submittedAt: row.submittedAt.toISOString(),
    supportChannel: row.supportChannel,
    paymentStatus: row.paymentStatus,
    refundPolicy: row.refundPolicy,
  });
}

function parseSupportInquiryRow(row: typeof supportInquiries.$inferSelect) {
  return supportInquirySchema.parse({
    inquiryId: row.inquiryId,
    participantId: row.participantId ?? undefined,
    applicationId: row.applicationId ?? undefined,
    channel: row.channel,
    category: row.category,
    subject: row.subject,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  });
}

function parseNotificationRow(row: typeof notifications.$inferSelect) {
  return {
    notificationId: row.notificationId,
    participantId: row.participantId,
    type: row.type,
    title: row.title,
    body: row.body,
    relatedApplicationId: row.relatedApplicationId ?? undefined,
    readAt: row.readAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

function parsePaymentRecordRow(row: typeof paymentRecords.$inferSelect) {
  return paymentRecordSchema.parse({
    paymentRecordId: row.paymentRecordId,
    applicationId: row.applicationId,
    participantId: row.participantId,
    amountKrw: row.amountKrw,
    paymentMode: row.paymentMode,
    status: row.status,
    operatorNote: row.operatorNote ?? undefined,
    recordedAt: row.recordedAt.toISOString(),
  });
}
