import { beforeEach, describe, expect, it } from 'vitest';
import {
  participantApiErrorResponseSchema,
  participantProfileSchema,
  tournamentApplicationSchema,
  tournamentListResponseSchema,
  tournamentSchema,
} from '@template/contracts';
import { app } from '../../app.js';
import { resetParticipantMvpState } from '../../services/participant-mvp.service.js';

const authHeaders = { authorization: 'Bearer test' };

async function requestJson(path: string, init?: RequestInit) {
  const res = await app.request(path, {
    ...init,
    headers: { ...authHeaders, 'content-type': 'application/json', ...init?.headers },
  });
  return { res, body: await res.json() };
}

describe('participant MVP dev-preview endpoints', () => {
  beforeEach(() => {
    resetParticipantMvpState();
  });

  it('lists and returns the sandbox tournament API shape', async () => {
    const list = await requestJson('/api/tournaments');
    expect(list.res.status).toBe(200);
    const parsedList = tournamentListResponseSchema.parse(list.body);
    expect(parsedList.tournaments[0]?.tournamentId).toBe('tournament_sandbox_001');

    const detail = await requestJson('/api/tournaments/tournament_sandbox_001');
    expect(detail.res.status).toBe(200);
    expect(() => tournamentSchema.parse(detail.body)).not.toThrow();
  });

  it('exposes participant profile and updates self-reported DUPR state', async () => {
    const initial = await requestJson('/api/participant/profile');
    expect(initial.res.status).toBe(200);
    expect(participantProfileSchema.parse(initial.body).duprStatus).toBe('missing');

    const updated = await requestJson('/api/participant/profile', {
      method: 'PATCH',
      body: JSON.stringify({ duprId: ' dupr-777 ' }),
    });
    expect(updated.res.status).toBe(200);
    expect(participantProfileSchema.parse(updated.body)).toMatchObject({
      duprId: 'DUPR-777',
      duprStatus: 'selfReportedPendingOperatorReview',
    });
  });

  it('requires a DUPR profile before creating a tournament application', async () => {
    const blocked = await requestJson('/api/tournament-applications', {
      method: 'POST',
      body: JSON.stringify({ tournamentId: 'tournament_sandbox_001' }),
    });

    expect(blocked.res.status).toBe(400);
    expect(participantApiErrorResponseSchema.parse(blocked.body)).toMatchObject({ error: 'DUPR_PROFILE_REQUIRED' });
  });

  it('returns contract-owned not-found participant API errors', async () => {
    const missingTournament = await requestJson('/api/tournaments/missing-tournament');
    expect(missingTournament.res.status).toBe(404);
    expect(participantApiErrorResponseSchema.parse(missingTournament.body)).toMatchObject({
      error: 'TOURNAMENT_NOT_FOUND',
    });

    const missingApplication = await requestJson('/api/tournament-applications/missing-application');
    expect(missingApplication.res.status).toBe(404);
    expect(participantApiErrorResponseSchema.parse(missingApplication.body)).toMatchObject({
      error: 'APPLICATION_NOT_FOUND',
    });
  });

  it('creates and reads a submitted tournament application', async () => {
    await requestJson('/api/participant/profile', {
      method: 'PATCH',
      body: JSON.stringify({ duprId: 'DUPR-12345' }),
    });

    const created = await requestJson('/api/tournament-applications', {
      method: 'POST',
      body: JSON.stringify({ tournamentId: 'tournament_sandbox_001' }),
    });
    expect(created.res.status).toBe(201);
    const application = tournamentApplicationSchema.parse(created.body);
    expect(application).toMatchObject({
      applicationId: 'application_tournament_sandbox_001_participant_sandbox_001',
      status: 'submitted',
      duprId: 'DUPR-12345',
      paymentStatus: 'notStartedSandbox',
    });

    const fetched = await requestJson(`/api/tournament-applications/${application.applicationId}`);
    expect(fetched.res.status).toBe(200);
    expect(tournamentApplicationSchema.parse(fetched.body)).toMatchObject({
      applicationId: application.applicationId,
    });
  });

  it('blocks participant self-cancel requests and preserves the application record', async () => {
    await requestJson('/api/participant/profile', {
      method: 'PATCH',
      body: JSON.stringify({ duprId: 'DUPR-12345' }),
    });

    const created = await requestJson('/api/tournament-applications', {
      method: 'POST',
      body: JSON.stringify({ tournamentId: 'tournament_sandbox_001' }),
    });
    const application = tournamentApplicationSchema.parse(created.body);

    const blocked = await requestJson(`/api/tournament-applications/${application.applicationId}`, {
      method: 'DELETE',
    });
    expect(blocked.res.status).toBe(400);
    expect(participantApiErrorResponseSchema.parse(blocked.body)).toMatchObject({
      error: 'PARTICIPANT_SELF_CANCEL_DISABLED',
    });

    const fetched = await requestJson(`/api/tournament-applications/${application.applicationId}`);
    expect(fetched.res.status).toBe(200);
    expect(tournamentApplicationSchema.parse(fetched.body)).toMatchObject({
      applicationId: application.applicationId,
      refundPolicy: 'participantSelfCancelDisabled',
      supportChannel: 'oneToOneInquiry',
    });
  });
});
