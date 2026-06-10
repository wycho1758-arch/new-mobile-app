# All Role SOUL Runtime Template Implementation Evidence - 2026-06-10

## Scope

- Updated all six managed role SOUL documents under `team-doc/mobile-app-dev-team/02-role-souls/`.
- Removed the Mobile App Dev runtime-template note paragraph requested for deletion.
- Updated `scripts/validate-team-doc.mjs` with runtime SOUL heading checks, role-boundary term checks, and a forbidden-term assertion for the deleted paragraph.

## TDD Red

Command:

```sh
node scripts/validate-team-doc.mjs
```

Result: exit 1 before document implementation.

Key failures:

- `mobile-app-dev-soul.md` included the forbidden `Runtime template note: ... copying this file verbatim.` paragraph.
- Five non-converted role SOUL files were missing ordered runtime SOUL headings.
- Mobile Architect and QA/Release were missing newly required role-boundary terms.

## Implementation Summary

- `product-planning-soul.md`: converted to runtime SOUL structure while preserving Product/Planning scope, non-goal, human-gate, readiness, and P0/P1 design-quality boundary.
- `design-soul.md`: converted to runtime SOUL structure while preserving Stitch, Option A/B, five-state, P0/P1, and publication boundaries.
- `mobile-architect-soul.md`: converted to runtime SOUL structure while preserving no dedicated repo-local skill and no ownership absorption boundaries.
- `mobile-app-dev-soul.md`: removed the requested runtime-template note paragraph; retained the already converted runtime SOUL structure.
- `backend-api-integrator-soul.md`: converted to runtime SOUL structure while preserving Backend/API Service Owner, `packages/contracts`, backend implementation, DB schema/migration, deployment config, runtime smoke, rollback note, and service evidence terms.
- `qa-release-soul.md`: converted to runtime SOUL structure while preserving `e2e-test`, `qa-railway-workflow`, RN Web/Railway evidence limits, failed-gate, and human-risk boundaries.

## Verification

Command:

```sh
node scripts/validate-team-doc.mjs
```

Result: exit 0.

Key output:

```text
Validated team-doc: 71 source files, 32 structured files.
```

Command:

```sh
pnpm run test:runtime
```

Result: exit 0.

Key output:

```text
Validated 11 skills, 13 agents, and 4 hook events.
Validated team-doc: 71 source files, 32 structured files.
Passed 40 hook fixture tests.
```

Command:

```sh
pnpm turbo run lint test
```

Result: exit 0.

Key output:

```text
Tasks: 6 successful, 6 total
Cached: 6 cached, 6 total
```

Command:

```sh
pnpm run test:local-harness
```

Result: exit 0.

Key output:

```text
clean-tree-guard self-test passed
codex-preflight self-test passed
Validated 11 skills, 13 agents, and 4 hook events.
Passed 40 hook fixture tests.
Tasks: 6 successful, 6 total
self-test all passed
local harness all passed
```

Command:

```sh
rg -n 'Runtime template note|raw `create-full`|seed payload' team-doc/mobile-app-dev-team/02-role-souls scripts/validate-team-doc.mjs || true
```

Result: exit 0.

Key output:

```text
scripts/validate-team-doc.mjs:367: forbidden-term assertion only
```

## Residual Risk

- The worktree contains unrelated dirty files outside this implementation scope. This change does not claim `.codex/hooks.json`, `.codex/hooks/mobile-stop-call-check.mjs`, `scripts/test-hooks.mjs`, `evals/hooks/fixtures/mcp-list-devices-server.mjs`, `team-doc/mobile-app-dev-team/03-role-capability-matrix.md`, `team-doc/mobile-app-dev-team/05-work-processes.md`, or `team-doc/mobile-app-dev-team/08-role-title-update-plan.md`.
- PR staging for this change should include only `scripts/validate-team-doc.mjs`, the six files under `team-doc/mobile-app-dev-team/02-role-souls/`, and the all-role SOUL evidence files unless another separately reviewed change intentionally includes the out-of-scope files.
- Full reviewer approval is recorded separately by the final xhigh review.
