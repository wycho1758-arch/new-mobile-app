# User-understandable project-bootstrap report command output

Date: 2026-06-13T02:10:25Z
Branch: fix/project-bootstrap-git-github-readiness
HEAD: 00089060a39cceb2d95ba62a5a588ef9fd1a0ee5


## node scripts/validate-team-doc.mjs

```text
Validated current mobile-app-dev-team managed docs.

exit: 0
```

## bash evals/skills/project-bootstrap-agent-setup-smoke.sh

```text
project-bootstrap-agent-setup smoke passed

exit: 0
```

## node scripts/validate-repo-operations.mjs

```text
Validated repo operations policy ownership.

exit: 0
```

## git diff --check

```text

exit: 0
```

## pnpm run test:runtime

```text

> mobile-app-template@ test:runtime /Users/tw.kim/Documents/AGA/test/new-mobile-app
> pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run validate:work-units && pnpm run validate:work-unit-next && pnpm run validate:eas-evidence && pnpm run validate:project-environment && pnpm run validate:evidence-hygiene && pnpm run test:hooks


> mobile-app-template@ validate /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node -e "const fs=require('node:fs'); for (const p of ['.claude', '.claude-state']) fs.rmSync(p, { recursive: true, force: true })" && node scripts/validate-runtime-artifacts.mjs && node scripts/codex-headless-review.mjs --self-test

Validated 13 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.

> mobile-app-template@ validate:repo-operations /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-repo-operations.mjs

Validated repo operations policy ownership.

> mobile-app-template@ validate:team-doc /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-team-doc.mjs

Validated current mobile-app-dev-team managed docs.

> mobile-app-template@ validate:work-units /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-work-units.mjs --self-test && node scripts/validate-work-units.mjs

Validated work-unit status fixtures.
Validated work-unit status artifacts.

> mobile-app-template@ validate:work-unit-next /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/work-unit-next.mjs --self-test

Validated work-unit next-action resolver fixtures.

> mobile-app-template@ validate:eas-evidence /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/ingest-eas-evidence.mjs --self-test

Validated EAS evidence ingest fixtures.

> mobile-app-template@ validate:project-environment /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-project-environment.mjs --self-test && node scripts/validate-project-environment.mjs

Validated project environment fixtures.
Validated project environment drift checks.

> mobile-app-template@ validate:evidence-hygiene /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs

Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.

> mobile-app-template@ test:hooks /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/test-hooks.mjs

Passed 44 hook fixture tests.

exit: 0
```

## pnpm turbo run lint test

```text
• turbo 2.9.16

   • Packages in scope: @template/api, @template/contracts, mobile
   • Running lint, test in 3 packages
   • Remote caching disabled

@template/contracts:build: cache hit, replaying logs 39c76de19776dff5
@template/contracts:lint: cache hit, replaying logs c709df8c9146b080
@template/contracts:test: cache hit, replaying logs 673f4b46b4c7f15c
mobile:lint: cache hit, replaying logs b6c88b62df0414e5
@template/contracts:lint:
@template/contracts:test:
@template/contracts:test: > @template/contracts@ test /Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts
@template/contracts:test: > node --test __tests__/*.test.mjs
@template/contracts:test:
@template/contracts:test: ✔ runtime export points at built JavaScript, not TypeScript source (1.270417ms)
@template/contracts:test: ℹ tests 1
@template/contracts:test: ℹ suites 0
@template/contracts:test: ℹ pass 1
@template/contracts:test: ℹ fail 0
@template/contracts:test: ℹ cancelled 0
@template/contracts:test: ℹ skipped 0
@template/contracts:test: ℹ todo 0
@template/contracts:test: ℹ duration_ms 218.771583
@template/contracts:lint: > @template/contracts@ lint /Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts
@template/contracts:lint: > tsc --noEmit --project tsconfig.json
@template/contracts:lint:
@template/contracts:build:
@template/contracts:build: > @template/contracts@ build /Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts
@template/contracts:build: > tsc --project tsconfig.json
@template/contracts:build:
mobile:lint:
mobile:lint: > mobile@ lint /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile
mobile:lint: > tsc --noEmit
mobile:lint:
@template/api:lint: cache hit, replaying logs 176bec3247a14878
@template/api:lint:
@template/api:lint: > @template/api@ lint /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api
@template/api:lint: > tsc --noEmit
@template/api:lint:
@template/api:test: cache hit, replaying logs b6e964b36f82b6fd
mobile:test: cache hit, replaying logs e20890e0af133252
@template/api:test:
@template/api:test: > @template/api@ test /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api
@template/api:test: > vitest run
@template/api:test:
@template/api:test:
@template/api:test:  RUN  v2.1.9 /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api
@template/api:test:
@template/api:test:  ✓ src/routes/__tests__/counter-events.test.ts (2 tests) 6ms
@template/api:test:
@template/api:test:  Test Files  1 passed (1)
@template/api:test:       Tests  2 passed (2)
@template/api:test:    Start at  03:45:51
@template/api:test:    Duration  505ms (transform 57ms, setup 0ms, collect 260ms, tests 6ms, environment 0ms, prepare 62ms)
@template/api:test:
mobile:test:
mobile:test: > mobile@ test /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile
mobile:test: > jest
mobile:test:
mobile:test: PASS __tests__/app-config.test.ts
mobile:test: PASS src/app/__tests__/home.test.tsx
mobile:test:
mobile:test: Test Suites: 2 passed, 2 total
mobile:test: Tests:       5 passed, 5 total
mobile:test: Snapshots:   0 total
mobile:test: Time:        0.748 s, estimated 2 s
mobile:test: Ran all test suites.

 Tasks:    7 successful, 7 total
Cached:    7 cached, 7 total
  Time:    39ms >>> FULL TURBO


exit: 0
```

## pnpm run test:local-harness

```text

> mobile-app-template@ test:local-harness /Users/tw.kim/Documents/AGA/test/new-mobile-app
> pnpm run test:local-harness:preflight && pnpm run test:runtime && pnpm turbo run lint test && node scripts/test-local-harness.mjs --self-test --stage all && node scripts/test-local-harness.mjs --stage all


> mobile-app-template@ test:local-harness:preflight /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/clean-tree-guard.mjs --self-test && node scripts/codex-preflight.mjs --self-test && node scripts/codex-preflight.mjs

clean-tree-guard self-test passed
codex-preflight self-test passed
codex-preflight accepted /opt/homebrew/bin/codex (codex-cli 0.137.0)

> mobile-app-template@ test:runtime /Users/tw.kim/Documents/AGA/test/new-mobile-app
> pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run validate:work-units && pnpm run validate:work-unit-next && pnpm run validate:eas-evidence && pnpm run validate:project-environment && pnpm run validate:evidence-hygiene && pnpm run test:hooks


> mobile-app-template@ validate /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node -e "const fs=require('node:fs'); for (const p of ['.claude', '.claude-state']) fs.rmSync(p, { recursive: true, force: true })" && node scripts/validate-runtime-artifacts.mjs && node scripts/codex-headless-review.mjs --self-test

Validated 13 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.

> mobile-app-template@ validate:repo-operations /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-repo-operations.mjs

Validated repo operations policy ownership.

> mobile-app-template@ validate:team-doc /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-team-doc.mjs

Validated current mobile-app-dev-team managed docs.

> mobile-app-template@ validate:work-units /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-work-units.mjs --self-test && node scripts/validate-work-units.mjs

Validated work-unit status fixtures.
Validated work-unit status artifacts.

> mobile-app-template@ validate:work-unit-next /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/work-unit-next.mjs --self-test

Validated work-unit next-action resolver fixtures.

> mobile-app-template@ validate:eas-evidence /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/ingest-eas-evidence.mjs --self-test

Validated EAS evidence ingest fixtures.

> mobile-app-template@ validate:project-environment /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-project-environment.mjs --self-test && node scripts/validate-project-environment.mjs

Validated project environment fixtures.
Validated project environment drift checks.

> mobile-app-template@ validate:evidence-hygiene /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs

Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.

> mobile-app-template@ test:hooks /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/test-hooks.mjs

Passed 44 hook fixture tests.
• turbo 2.9.16

   • Packages in scope: @template/api, @template/contracts, mobile
   • Running lint, test in 3 packages
   • Remote caching disabled

@template/contracts:lint: cache hit, replaying logs c709df8c9146b080
@template/api:lint: cache hit, replaying logs 176bec3247a14878
mobile:lint: cache hit, replaying logs b6c88b62df0414e5
@template/contracts:test: cache hit, replaying logs 673f4b46b4c7f15c
@template/contracts:build: cache hit, replaying logs 39c76de19776dff5
@template/api:lint:
@template/api:lint: > @template/api@ lint /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api
@template/api:lint: > tsc --noEmit
@template/api:lint:
@template/contracts:lint:
@template/contracts:lint: > @template/contracts@ lint /Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts
@template/contracts:lint: > tsc --noEmit --project tsconfig.json
mobile:lint:
mobile:lint: > mobile@ lint /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile
mobile:lint: > tsc --noEmit
mobile:lint:
@template/contracts:lint:
@template/contracts:test:
@template/contracts:test: > @template/contracts@ test /Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts
@template/contracts:test: > node --test __tests__/*.test.mjs
@template/contracts:test:
@template/contracts:test: ✔ runtime export points at built JavaScript, not TypeScript source (1.270417ms)
@template/contracts:test: ℹ tests 1
@template/contracts:test: ℹ suites 0
@template/contracts:test: ℹ pass 1
@template/contracts:test: ℹ fail 0
@template/contracts:test: ℹ cancelled 0
@template/contracts:test: ℹ skipped 0
@template/contracts:test: ℹ todo 0
@template/contracts:test: ℹ duration_ms 218.771583
@template/contracts:build:
@template/contracts:build: > @template/contracts@ build /Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts
@template/contracts:build: > tsc --project tsconfig.json
@template/contracts:build:
@template/api:test: cache hit, replaying logs b6e964b36f82b6fd
mobile:test: cache hit, replaying logs e20890e0af133252
@template/api:test:
@template/api:test: > @template/api@ test /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api
@template/api:test: > vitest run
@template/api:test:
@template/api:test:
@template/api:test:  RUN  v2.1.9 /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api
@template/api:test:
@template/api:test:  ✓ src/routes/__tests__/counter-events.test.ts (2 tests) 6ms
@template/api:test:
@template/api:test:  Test Files  1 passed (1)
@template/api:test:       Tests  2 passed (2)
@template/api:test:    Start at  03:45:51
@template/api:test:    Duration  505ms (transform 57ms, setup 0ms, collect 260ms, tests 6ms, environment 0ms, prepare 62ms)
@template/api:test:
mobile:test:
mobile:test: > mobile@ test /Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile
mobile:test: > jest
mobile:test:
mobile:test: PASS __tests__/app-config.test.ts
mobile:test: PASS src/app/__tests__/home.test.tsx
mobile:test:
mobile:test: Test Suites: 2 passed, 2 total
mobile:test: Tests:       5 passed, 5 total
mobile:test: Snapshots:   0 total
mobile:test: Time:        0.748 s, estimated 2 s
mobile:test: Ran all test suites.

 Tasks:    7 successful, 7 total
Cached:    7 cached, 7 total
  Time:    38ms >>> FULL TURBO

self-test all passed
local harness all passed

exit: 0
```

## pnpm run validate:evidence-hygiene

```text

> mobile-app-template@ validate:evidence-hygiene /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs

Validated evidence hygiene fixtures.
Validated evidence hygiene artifacts.

exit: 0
```
