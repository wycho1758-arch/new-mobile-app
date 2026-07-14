import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';
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

const allowedCorsOrigins = [
  'https://picklehub-mobile-dev-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:8081',
  'http://localhost:19006',
];

export const app = new Hono()
  .route('/', healthRoute)                          // /livez, /readyz — 무인증
  .use(
    '/api/*',
    cors({
      origin: (origin) => (allowedCorsOrigins.includes(origin) ? origin : undefined),
      allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowHeaders: ['authorization', 'content-type'],
      maxAge: 600,
    }),
  )
  .use('/api/*', bearerAuth({ token: apiBearerTokens }))  // server bearer + scoped participant preview bearer
  .route('/api/counter-events', counterEventsRoute)
  .route('/api/tournaments', tournamentsRoute)
  .route('/api/participant/profile', participantProfileRoute)
  .route('/api/participant/support', supportRoute)
  .route('/api/participant/notifications', notificationsRoute)
  .route('/api/participant/mypage', myPageRoute)
  .route('/api/tournament-applications', tournamentApplicationsRoute);
