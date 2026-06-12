**Findings**

Critical: None.

High: None.

Medium: None.

Low: None.

**Review Notes**

`validate:team-doc` is wired into `test:runtime`: `package.json:17` runs `validate:team-doc`, and `package.json:22` maps it to `node scripts/validate-team-doc.mjs`.

The validator now checks the requested cleanup rules: current repo skills appear in the skill matrix (`scripts/validate-team-doc.mjs:159-172`), Sentry is rejected from structured docs (`scripts/validate-team-doc.mjs:184-188`), obsolete selector names are rejected (`scripts/validate-team-doc.mjs:189-190`), and obsolete generated skill slugs are rejected (`scripts/validate-team-doc.mjs:175-195`).

Current/default structured docs no longer present Sentry as active template scope in the checked areas: root layout is just Expo Router + `global.css` (`team-doc/10-structured/05-repo-template/mobile-runtime.md:20`), EAS/OTA docs omit Sentry upload (`team-doc/10-structured/05-repo-template/ci-and-eas.md:34-39`), and variables omit Sentry variables (`team-doc/10-structured/05-repo-template/variables.md:17-28`).

Generated repo skills match the documented current set: `team-doc/10-structured/03-skills/mvp-skill-matrix.md:17-28` and `team-doc/10-structured/06-codex-runtime/runtime-boundary.md:24-30` list the current `.agents/skills` set without obsolete generated slugs.

Mobile testIDs match across SoT, app code, tests, and E2E: `PROJECT_ENVIRONMENT.md:139-143`, `apps/mobile/src/app/index.tsx:10-13`, `apps/mobile/src/app/__tests__/home.test.tsx:19-28`, `apps/mobile/.maestro/home.yml:4-12`, and `apps/mobile/e2e-web/home.spec.ts:6-11`.

I did not rerun `pnpm run test:runtime` or `pnpm run test:local-harness` in this read-only review; I’m treating the supplied post-fix verification result as evidence. Residual risk is limited to environment/CI reproducibility outside this local file review.