# CP-4 Phase 2C Review Request — workspace READMEs

Mode: final.

Scope: Phase 2C of the doc-gap remediation goal plan (worktree branch `chore/doc-gap-remediation`, on top of CP-3 + CP-4 2A + 2B). Four new README files for workspace members that previously lacked one. Documentation-only, no code/validator change:

- `apps/api/README.md` — optional Hono+Drizzle backend: stack, import direction `routes → services → db`, `@template/contracts` dependency, non-interactive migration procedure (`drizzle-kit generate` + programmatic `runMigrations()` in `src/db/migrate.ts`), dev commands.
- `packages/contracts/README.md` — single SoT for zod schemas + TS types; no ad-hoc duplicates; snake_case DB vs camelCase boundary; zod peer dep; dev commands.
- `infra/README.md` — overview pointing to `clawpod/`; example-not-live note.
- `infra/clawpod/README.md` — `secret.example.yaml` (Secret) + `agent-runner.yaml` (Job); how they fit; no-committed-secrets rule; pointers to `docs/CREDENTIALS.md` and `mobile-app-dev-team/16-pod-environment-bootstrap.md`.

Goal: close the workspace-README gap (critic item) so first-class workspaces under apps/, packages/, infra/ each have local orientation.

Verify (read-only) factual accuracy vs the repo:
1. Package names: `apps/api/package.json` name is `@template/api`; `packages/contracts/package.json` name is `@template/contracts`; their `scripts` match what the READMEs claim (api dev/test/lint; contracts build/lint/test `node --test __tests__/*.test.mjs`).
2. `apps/api/src/db/migrate.ts` exists and the import direction rule matches AGENTS.md.
3. `infra/clawpod/` actually contains `secret.example.yaml` and `agent-runner.yaml` (no invented files); `infra/` contains only `clawpod/`.
4. Referenced docs exist: `docs/CREDENTIALS.md`, `mobile-app-dev-team/16-pod-environment-bootstrap.md`.
5. No validator requires/forbids these README paths (so adding them is safe); confirm gates still pass.

Quality gates already run (all PASS / exit 0): validate (runtime-artifacts + codex self-test), `validate:team-doc`, `validate:repo-operations`, `test-local-harness --stage all`, `validate:evidence-hygiene`.

Decide GO / NO_GO with a machine-readable verdict envelope.
