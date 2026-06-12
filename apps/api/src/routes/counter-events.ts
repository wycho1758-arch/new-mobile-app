import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { counterEventRequestSchema } from '@template/contracts';
import { createCounterEvent } from '../services/counter-events.service.js';

export const counterEventsRoute = new Hono().post(
  '/',
  zValidator('json', counterEventRequestSchema),
  async (c) => {
    const record = await createCounterEvent(c.req.valid('json'));
    return c.json(record, 201);
  },
);
