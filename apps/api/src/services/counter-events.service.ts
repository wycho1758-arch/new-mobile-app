import type { CounterEvent, CounterEventRecord } from '@template/contracts';
import { db } from '../db/client.js';
import { counterEvents } from '../db/schema.js';

export async function createCounterEvent(
  input: CounterEvent,
): Promise<CounterEventRecord> {
  const [row] = await db.insert(counterEvents).values(input).returning();
  return {
    id: row.id,
    count: row.count,
    createdAt: row.createdAt.toISOString(),
  };
}
