import { serve } from '@hono/node-server';
import { app } from './app.js';
import { Env } from './env.js';
import { runMigrations } from './db/migrate.js';

await runMigrations();

const server = serve({ fetch: app.fetch, port: Env.API_PORT });

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
