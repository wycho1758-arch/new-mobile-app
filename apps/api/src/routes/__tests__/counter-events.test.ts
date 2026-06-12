import { describe, expect, it, vi } from 'vitest';
import { counterEventRecordSchema } from '@template/contracts';
import { app } from '../../app.js';

vi.mock('../../services/counter-events.service.js', () => ({
  createCounterEvent: vi.fn().mockResolvedValue({
    id: 1,
    count: 5,
    createdAt: new Date().toISOString(),
  }),
}));

describe('POST /api/counter-events', () => {
  it('rejects an invalid payload with 400', async () => {
    const res = await app.request('/api/counter-events', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer test' },
      body: JSON.stringify({ count: -1 }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 201 with a valid record on success', async () => {
    const res = await app.request('/api/counter-events', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer test' },
      body: JSON.stringify({ count: 5 }),
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(() => counterEventRecordSchema.parse(body)).not.toThrow();
  });
});
