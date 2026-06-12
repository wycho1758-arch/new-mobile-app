import { z } from 'zod';

const schema = z.object({
  DATABASE_URL: z.url(),
  API_PORT: z.coerce.number().int().default(3000),
  API_BEARER_TOKEN: z.string().min(1),
});

export const Env = schema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  API_PORT: process.env.API_PORT,
  API_BEARER_TOKEN: process.env.API_BEARER_TOKEN,
});
