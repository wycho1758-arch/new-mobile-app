import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  createTournamentApplicationRequestSchema,
  participantApiErrorCodeSchema,
  participantApiErrorResponseSchema,
  updateParticipantProfileRequestSchema,
} from '@template/contracts';
import {
  createTournamentApplication,
  getParticipantProfile,
  getTournament,
  getTournamentApplication,
  listTournaments,
  ParticipantMvpError,
  requestParticipantSelfCancel,
  updateParticipantDupr,
} from '../services/participant-mvp.service.js';

function mapParticipantMvpError(error: unknown) {
  if (error instanceof ParticipantMvpError) {
    return { body: participantApiErrorResponseSchema.parse({ error: error.message }), status: error.status };
  }
  throw error;
}

export const tournamentsRoute = new Hono()
  .get('/', (c) => c.json({ tournaments: listTournaments() }))
  .get('/:tournamentId', (c) => {
    try {
      return c.json(getTournament(c.req.param('tournamentId')));
    } catch (error) {
      const mapped = mapParticipantMvpError(error);
      return c.json(mapped.body, mapped.status);
    }
  });

export const participantProfileRoute = new Hono()
  .get('/', (c) => c.json(getParticipantProfile()))
  .patch('/', zValidator('json', updateParticipantProfileRequestSchema), (c) =>
    c.json(updateParticipantDupr(c.req.valid('json').duprId)),
  );

export const tournamentApplicationsRoute = new Hono()
  .post('/', zValidator('json', createTournamentApplicationRequestSchema), (c) => {
    try {
      return c.json(createTournamentApplication(c.req.valid('json')), 201);
    } catch (error) {
      const mapped = mapParticipantMvpError(error);
      return c.json(mapped.body, mapped.status);
    }
  })
  .get('/:applicationId', (c) => {
    try {
      return c.json(getTournamentApplication(c.req.param('applicationId')));
    } catch (error) {
      const mapped = mapParticipantMvpError(error);
      return c.json(mapped.body, mapped.status);
    }
  })
  .delete('/:applicationId', (c) => {
    try {
      requestParticipantSelfCancel(c.req.param('applicationId'));
      return c.json(participantApiErrorResponseSchema.parse({
        error: participantApiErrorCodeSchema.enum.PARTICIPANT_SELF_CANCEL_DISABLED,
      }), 400);
    } catch (error) {
      const mapped = mapParticipantMvpError(error);
      return c.json(mapped.body, mapped.status);
    }
  });
