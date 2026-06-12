import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { healthRoute } from './routes/health.js';
import { counterEventsRoute } from './routes/counter-events.js';
import { Env } from './env.js';

export const app = new Hono()
  .route('/', healthRoute)                          // /livez, /readyz — 무인증
  .use('/api/*', bearerAuth({ token: Env.API_BEARER_TOKEN }))  // 자리표시자 경계
  .route('/api/counter-events', counterEventsRoute);
