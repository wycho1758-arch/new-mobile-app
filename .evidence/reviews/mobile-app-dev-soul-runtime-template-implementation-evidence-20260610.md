# Mobile App Dev SOUL Runtime Template Pilot Evidence

Date: 2026-06-10

## Scope

Pilot scope requested by user:

- Update exactly one SOUL document first: `team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md`.
- Add validator support only as needed for the pilot.
- Run read-only reviewer before asking the user to confirm the remaining role SOUL template updates.

## Existing Dirty Worktree Before Pilot

Before this pilot edit, the worktree already contained unrelated changes, including:

- `scripts/validate-team-doc.mjs`
- `team-doc/mobile-app-dev-team/02-role-souls/backend-api-integrator-soul.md`
- `team-doc/mobile-app-dev-team/03-role-capability-matrix.md`
- `team-doc/mobile-app-dev-team/05-work-processes.md`
- several existing `.evidence/reviews/*` files
- `team-doc/mobile-app-dev-team/08-role-title-update-plan.md`

Those pre-existing changes were not reverted. The pilot-specific validator addition is the ordered heading helper and the `mobile-app-dev-soul.md` runtime template checks.

## Plan Review Evidence

- `.evidence/reviews/mobile-app-dev-soul-runtime-template-plan-xhigh-20260610.md`

Plan review findings addressed:

- Added runtime template guard text to `mobile-app-dev-soul.md`.
- Used ordered H1/H2 heading validation rather than prose-only term checks for the runtime SOUL structure.
- Ran both `pnpm run test:runtime` and `pnpm turbo run lint test`.

## Red Step

Command:

```sh
node scripts/validate-team-doc.mjs
```

Expected failure after adding the pilot validator assertion and before updating `mobile-app-dev-soul.md`:

```text
- team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md missing required role-boundary term: Runtime template note:
- team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md missing required role-boundary term: This document is a runtime `/workspace/SOUL.md` template
- team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md missing required role-boundary term: It is not a raw `create-full` `soulMd` seed payload
- team-doc/mobile-app-dev-team/02-role-souls/mobile-app-dev-soul.md missing ordered runtime SOUL heading: ## Identity
```

Result: failed as expected.

## Green Step

Command:

```sh
node scripts/validate-team-doc.mjs
```

Result:

```text
Validated team-doc: 71 source files, 32 structured files.
```

## Runtime Gate

Command:

```sh
pnpm run test:runtime
```

Result:

```text
Validated 11 skills, 13 agents, and 4 hook events.
Validated team-doc: 71 source files, 32 structured files.
Passed 40 hook fixture tests.
```

Exit status: 0.

## Workspace Lint/Test Gate

Command:

```sh
pnpm turbo run lint test
```

Result:

```text
Tasks: 6 successful, 6 total
Cached: 6 cached, 6 total
mobile Jest: 2 test suites passed, 5 tests passed
api Vitest: 1 test file passed, 2 tests passed
contracts node test: 1 passed
```

Exit status: 0.

## Final Review Evidence

- `.evidence/reviews/mobile-app-dev-soul-runtime-template-final-xhigh-20260610.md`

