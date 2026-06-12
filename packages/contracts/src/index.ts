import { z } from 'zod';

export const COUNTER_INCREMENT = 1;

export const counterEventSchema = z.object({
  count: z.number().int().nonnegative(),
});
export type CounterEvent = z.infer<typeof counterEventSchema>;

export const counterEventRequestSchema = counterEventSchema;

export const counterEventRecordSchema = counterEventSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
});
export type CounterEventRecord = z.infer<typeof counterEventRecordSchema>;
