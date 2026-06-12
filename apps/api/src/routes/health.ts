import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db/client.js';

export const healthRoute = new Hono()
  .get('/livez', (c) => c.json({ status: 'ok' }))
  .get('/readyz', async (c) => {
    try {
      await db.execute(sql`SELECT 1`);
      return c.json({ status: 'ok' });
    } catch {
      return c.json({ status: 'unavailable' }, 503);
    }
  });
