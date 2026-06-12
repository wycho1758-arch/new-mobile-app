**Findings**

No correctness findings for the requested placement scope.

`evals/` is appropriately top-level for runtime fixtures and harness data. The repo SoT names `evals/{skills,agents,hooks,local-harness}/` as runtime eval/evidence paths, and the root harness scripts target those paths directly. See [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:19), [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:181), [scripts/validate-runtime-artifacts.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/validate-runtime-artifacts.mjs:76), and [scripts/test-local-harness.mjs](/Users/tw.kim/Documents/AGA/test/new-mobile-app/scripts/test-local-harness.mjs:6).

`infra/clawpod/` is also correctly top-level, not a pnpm workspace package. AGENTS defines it as infra examples, while pnpm only includes `apps/*` and `packages/*`. See [AGENTS.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/AGENTS.md:29) and [pnpm-workspace.yaml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/pnpm-workspace.yaml:1).

Root `scripts/` placement is correct because root package scripts invoke those files directly for runtime gates and local harness checks. See [package.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/package.json:17) and [PROJECT_ENVIRONMENT.md](/Users/tw.kim/Documents/AGA/test/new-mobile-app/PROJECT_ENVIRONMENT.md:174).

The root/apps `node_modules` layout is consistent with this pnpm monorepo: root `package.json` pins pnpm, workspace globs are only apps/packages, app manifests depend on `@template/contracts`, and app-local `node_modules/@template/contracts` links to `packages/contracts`. See [package.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/package.json:5), [pnpm-workspace.yaml](/Users/tw.kim/Documents/AGA/test/new-mobile-app/pnpm-workspace.yaml:2), [apps/mobile/package.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/mobile/package.json:16), [apps/api/package.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/apps/api/package.json:14), and [packages/contracts/package.json](/Users/tw.kim/Documents/AGA/test/new-mobile-app/packages/contracts/package.json:2).

I did not run gates, per the read-only review request; this is a structure/source review only.