
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
