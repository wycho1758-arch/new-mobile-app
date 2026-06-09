**Findings**

1. **High**: The `.env` read guard is incomplete. [.codex/hooks/mobile-pretool-policy.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/hooks/mobile-pretool-policy.mjs:25) blocks only `cat|less|more|head|tail|sed` paths containing `/.env`, so `cat .env`, `sed ... .env.production`, `rg -n . apps/mobile/.env.production`, and `grep -n . .env.production` are approved. The current fixture only covers `cat apps/mobile/.env.production` at [pretool-deny-env-read.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/evals/hooks/fixtures/pretool-deny-env-read.json:4). Add root `.env` and `rg`/`grep` negative cases.

2. **Medium**: The production EAS guard misses common `eas-cli` wrappers. [.codex/hooks/mobile-pretool-policy.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.codex/hooks/mobile-pretool-policy.mjs:23) matches `eas build|submit|update ... production`, but `npx eas-cli build --profile production` and `pnpm dlx eas-cli build --profile production` are approved. This weakens the intended production side-effect guard.

3. **Medium**: The Maestro selector migration dropped the behavior assertion. [home.yml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile/.maestro/home.yml:10) only checks that `counter-value` is visible after tapping, so the E2E flow passes even if the counter never increments. Jest still checks `Count: 1` at [home.test.tsx](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile/src/app/__tests__/home.test.tsx:22); the Maestro flow should retain an equivalent value assertion while using stable IDs.

4. **Low**: [docs/SETUP.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/docs/SETUP.md:229) claims “Metro smoke” found no NativeWind issue, but current evidence explicitly says lint/Jest/offline `expo install --check` do not prove Metro/native/dev-client runtime at [stage-6-review.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/.evidence/codex-runtime-stability/stage-6-review.md:3). Downgrade that row to config-present/offline-verified unless a real Metro/native smoke is recorded.

No findings on active Sentry removal, Expo SDK 56/dev-client package/config alignment, NativeWind v5 export casing, pinned `mobile-mcp`, or `EXPO_PUBLIC_*` public-client-config handling.

Verification run: `pnpm run test:hooks` passed 27 fixture tests, `pnpm run validate` passed, and `git diff --check` passed. Mobile Jest could not execute in this read-only session because Watchman/Jest haste-map writes to temp paths were denied.

Confluence decision: no additional Confluence update is required beyond `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`; the issues are repo implementation/test/doc-evidence fixes, not new SoT content.