import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { healthRoute } from './routes/health.js';
import { counterEventsRoute } from './routes/counter-events.js';
import {
  participantProfileRoute,
  supportRoute,
  notificationsRoute,
  myPageRoute,
  tournamentApplicationsRoute,
  tournamentsRoute,
} from './routes/participant-mvp.js';
import { Env } from './env.js';

const apiBearerTokens = [Env.API_BEARER_TOKEN, Env.PARTICIPANT_PREVIEW_BEARER_TOKEN].filter(
  (token): token is string => Boolean(token),
);

export const app = new Hono()
  .route('/', healthRoute)                          // /livez, /readyz — 무인증
  .use('/api/*', bearerAuth({ token: apiBearerTokens }))  // server bearer + scoped participant preview bearer
  .route('/api/counter-events', counterEventsRoute)
  .route('/api/tournaments', tournamentsRoute)
  .route('/api/participant/profile', participantProfileRoute)
  .route('/api/participant/support', supportRoute)
  .route('/api/participant/notifications', notificationsRoute)
  .route('/api/participant/mypage', myPageRoute)
  .route('/api/tournament-applications', tournamentApplicationsRoute);
