# Issues

## Fixed

- Railway API initially crashed because `@template/contracts` exported `./src/index.ts`, causing Node runtime to import TypeScript from `node_modules`.
- Added a contracts export test, contracts build config, and API Dockerfile build step for `@template/contracts`.
- RN Web E2E initially did not require a deployed backend API URL. Added a Playwright backend health check and changed config to pass through `EXPO_PUBLIC_API_URL`.
- Reviewer flagged untracked `.env` risk. Added `.env` and `.env.*` ignores while allowing `.env.example` and `.env.*.example`.

## Residual

- Playwright web server still logs `Unable to run simctl: Error: xcrun simctl help exited with non-zero code: 72`; RN Web E2E passed despite this Expo warning.
- RN Web E2E does not validate native modules, OS lifecycle, permissions, push, biometrics, camera, GPS, or hardware features.
- `@hono/zod-validator` reports a peer warning against zod v4 during build/deploy; tests and deployment passed.
