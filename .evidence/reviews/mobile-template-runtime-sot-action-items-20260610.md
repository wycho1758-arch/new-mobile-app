# SoT-Based Project Inspection and Categorized Action Items (with boram Pod Delivery Assessment)

- Date: 2026-06-10 (refreshed same day after first xhigh review `mobile-template-runtime-sot-action-items-xhigh-20260610.md` returned NO_GO on staleness)
- Author: Claude Code session (read-only inspection; this document and its review artifacts are the only outputs)
- Scope: current repo state vs SoT, live boram pod measurement, categorized action items with execution order
- Snapshot caveat: this worktree is being actively modified by a concurrent session (PR1 implementation and the Confluence-decoupling slice landed between this report's first draft and its first review on the same day). Repo-state claims below reflect the refresh time and may age quickly; the categorized action items and ordering are the durable content.
- Method deviation: Serena MCP is pinned in `.codex/config.toml` (serena@v1.5.3) for the Codex CLI runtime only and is not connected to this Claude session. Inspection was performed via direct file reads of SoT documents and runtime artifacts plus read-only `kubectl` queries. No symbol-level Serena verification was performed in this checkpoint.

## 1. SoT Baseline Consulted

- `AGENTS.md` — repo rules, runtime paths, gates, Definition of Done
- `PROJECT_ENVIRONMENT.md` — runtime versions (pnpm@9.15.9, Expo SDK 56, RN 0.85, NativeWind v5 preview), Codex MCP pins
- `REPO_OPERATIONS.md` — root policy ownership, Codex-only repo work policy, pod-native skill location (`/workspace/skills/<slug>/SKILL.md`)
- `team-doc/mobile-app-dev-team/00-sot-and-principles.md` — SoT priority hierarchy
- `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` — approved execution path (PR1–PR7 repo slices + platform annex), gaps G1–G9
- `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skill-plan.md`, `11-openclaw-codex-completion-hooks-plan.md` — pod delivery patterns already proven (codex-cli-auth-setup skill, codex-hooks)
- `docs/plans/active/20260610-wm-mobile-template-runtime-goal-plan.md` — runtime goal plan
- Checkpoint evidence chain: `.evidence/reviews/mobile-template-runtime-rebaseline-cleanup-checkpoint-xhigh-final-rereview2-20260610.md` (GO → PR1 pre-implementation planning) → `.evidence/reviews/pr1-work-unit-status-machine-preimplementation-xhigh-rereview-20260610.md` (GO → implement PR1 tests-first) → `.evidence/reviews/pr1-work-unit-status-machine-implementation-checkpoint-20260610.md` + `.evidence/reviews/pr1-work-unit-status-machine-implementation-xhigh-rereview-20260610.md` (NO_GO; fix loop in progress, final rereview prompt prepared)

## 2. Current Repo State (verified)

- Phase 0 rebaseline is complete with a GO verdict. **PR1 implementation has started in this worktree** (passive `wu-status/v1` validator: `scripts/lib/work-unit-machine.mjs`, `scripts/validate-work-units.mjs`, RED/GREEN fixtures under `evals/work-units/fixtures/`, gate wiring via `validate:work-units` in `package.json` `test:runtime` and `quality-gate.yml` triggers); its latest implementation xhigh rereview is **NO_GO** with the fix loop in progress. PR2–PR7 remain approved but not implemented.
- Validation gates exist and are wired: `pnpm run test:runtime`, `pnpm turbo run lint test`, `pnpm run test:local-harness`, hook policy tests, CI `quality-gate.yml`.
- Runtime layer exists: 11 repo-local skills (`.agents/skills/`), 13 custom agents (`.codex/agents/`), 5 completion hooks (`.codex/hooks.json`), MCP pins (mobile-mcp@0.0.58, serena@v1.5.3, stitch@1.3.2).
- Template app layer exists and is environment-variable-driven (no hardcoded customer values): `apps/mobile` (Expo SDK 56 + Expo Router + NativeWind v5 preview), `apps/api` (Hono + Drizzle, optional), `packages/contracts` (API type SoT).
- Pod provisioning seeds exist: `infra/clawpod/agent-runner.yaml` (EAS build Job + repo clone via `REPO_DEPLOY_TOKEN`), `infra/clawpod/secret.example.yaml`.
- Worktree is dirty with two in-flight concurrent slices — the Confluence-dependency-decoupling slice and the PR1 implementation slice — currently 16 modified tracked files (including `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `package.json`, `.github/workflows/quality-gate.yml`, validators, `evals/local-harness/README.md`, role-skill `references/sot.md` files, doc 13) plus untracked `.evidence/reviews/*` (this inspection adds more), `.claude/`, `.claude-state/`. PR packaging must classify/separate these (already flagged by the rebaseline cleanup checkpoint). See `.evidence/reviews/confluence-dependency-decoupling-planning-evidence-20260610.md` and `.evidence/reviews/pr1-work-unit-status-machine-implementation-checkpoint-20260610.md`.
- **`pnpm run test:runtime` PASSES on the current worktree** (re-run at refresh time by this inspection; the gate now includes the PR1 `validate:work-units` step and 44 hook fixture tests). An earlier run by this inspection the same day failed on 6 then-unmet decoupling validator requirements; that was a transient intermediate state of the concurrent decoupling slice, since resolved by the concurrent session. Recorded as a concurrent-input observation, not authored work.

## 3. boram Pod Live Measurement (read-only, 2026-06-10)

Target: `boram-vf7sbm-agent-0`, namespace `clawpod`, StatefulSet `boram-vf7sbm-agent`, image `clawpod/agent:local`, containers `agent` + `ontology-bridge`.

Present and aligned with the pod delivery patterns in docs 09/11:

| Item | Observed | SoT alignment |
| --- | --- | --- |
| Codex CLI | `/workspace/.npm-global/bin/codex`, `~/.codex/auth.json` present | matches codex-cli-auth-setup outcome (doc 09 family) |
| Completion hooks | `/workspace/codex-hooks/` (codex-completion-hook.js, codex-run, lib, smoke test) | matches doc 11 delivery |
| Pod-native skills | `/workspace/skills/{cli-anything, codex-cli-auth-setup, desktop, tasks}` | `codex-cli-auth-setup` follows `/workspace/skills/<slug>/SKILL.md` contract |
| Codex-only policy hook | `/workspace/CODEX_MANAGED_PATHS.md` exists but is **empty** (no repo registered) | mechanism present, unused |
| Tooling | node v22.22.2, git 2.43.0, gh 2.92.0, chromium at `/usr/bin/chromium` | meets preflight expectations |
| Config mounts | `IDENTITY.md`, `SOUL.md`, `AGENTS.md`, `TOOLS.md` via ConfigMap; `OPENAI_CODEX_AUTH_JSON` via Secret | matches pod runtime surface |

Missing or mismatched vs the template-runtime pod contract:

| Gap | Observed | SoT reference |
| --- | --- | --- |
| No repo clone | no `/workspace/new-mobile-app/` checkout; `CODEX_MANAGED_PATHS.md` empty | doc 13 pod contract; REPO_OPERATIONS Codex-only policy (canonical path `/workspace/new-mobile-app/`) |
| Role mismatch | `AGENT_ROLE` = "CTO - Tech strategy & engineering"; no `WM_ROLE` env | 6 wm roles in `01-team-composition.md`; PR4 bootstrap asserts `WM_ROLE` |
| pnpm drift | pnpm **10.33.3** on pod vs SoT **9.15.9** | gap G9 in doc 13 — now empirically confirmed on a live pod |
| No GitHub credential confirmed | only `OPENAI_CODEX_AUTH_JSON` Secret visible in pod env; no `GITHUB_TOKEN`/`REPO_DEPLOY_TOKEN` | `infra/clawpod/secret.example.yaml`, doc 13 platform annex |
| No pod bootstrap skill | `pod-role-bootstrap` absent | expected — PR4 not implemented yet |

Decision recorded (user-approved): **boram is used as the sample validation pod** for the template delivery procedure. Creating dedicated `wm-*` role pods remains a follow-up platform item (Category C).

## 4. Categorized Action Items (with execution order)

Priority semantics: P0 = immediate/sequenced now, P1 = follow-up after P0 dependencies. Execution order is the numbered order within and across categories as stated.

### Category D — SoT/Document Hygiene (P0, do first; no code changes)

| # | Action | Evidence/Basis |
| --- | --- | --- |
| D0 | **Keep the `pnpm run test:runtime` gate green while two concurrent slices are in flight** (resolved at refresh time): the gate failed transiently mid-slice earlier the same day and passes now. Land the decoupling slice and PR1 as separately packaged PRs so the gate never depends on a half-applied validator extension. | section 2 gate runs, `.evidence/reviews/confluence-dependency-decoupling-planning-evidence-20260610.md` |
| D1 | Classify and package the dirty worktree before any PR: the 12-file decoupling slice, untracked `.evidence/reviews/*` (including this inspection's files), `.claude/`, `.claude-state/`. Keep `.claude*` out of PRs. | rebaseline cleanup checkpoint final rereview (GO with packaging condition) |
| D2 | Record the Serena deviation: this inspection was file-based; symbol-level checks via the pinned serena@v1.5.3 belong to the Codex runtime when needed. | `.codex/config.toml` |
| D3 | Record the boram pod measurement (section 3) as the live baseline that PR4's `preflight --pod` must detect (pnpm drift, missing WM_ROLE, missing repo clone). | this document |

### Category A — Repo-Side Runtime Implementation (P0, the approved PR train)

Order is fixed by doc 13 Part E. PR1 is already in its implementation review loop (see section 2); the next permitted step on the train is closing that loop.

| # | Action | Closes gap |
| --- | --- | --- |
| A1 | PR1 — work-unit state machine (`status.json` schema + validator). **In progress**: implementation landed in the worktree (tests-first, gate-wired); latest implementation xhigh rereview is NO_GO — fix findings, pass the prepared final rereview, then package the PR. | G1 |
| A2 | PR2 — human-gate decision envelope (`human-gate/v1` schema, GitHub comment anchors). | G5 |
| A3 | PR3 — orchestration (`wm-orchestrate` skill + `work-unit-next.mjs` deterministic resolver). | G2 |
| A4 | PR4 — pod bootstrap contract (`codex-preflight.mjs --pod` mode + `pod-role-bootstrap` pod-native skill: WM_ROLE/IDENTITY assertion, corepack pnpm 9.15.9 pin, Chromium/codex/git/gh checks, capability report). Section 3 findings are the acceptance fixture: the bootstrap must fail-or-fix exactly the drifts measured on boram. | G4, G9 (pod side) |
| A5 (P1) | PR5 — native E2E ladder (offline prep approved; live EAS proof blocked on token injection), PR6 — SoT drift detection, PR7 — hardening (Stitch ADC, mobile-mcp pin drift, evidence hygiene). | G3, G6, G7, G8 |

### Category B — Template Delivery to boram Pod (P0 prep in parallel with A; execute after A4)

| # | Action | Detail |
| --- | --- | --- |
| B1 | Provision a GitHub credential on the pod | Add `GITHUB_TOKEN` (or `REPO_DEPLOY_TOKEN` per `infra/clawpod/secret.example.yaml`) to `boram-vf7sbm-agent-secrets`; verify `gh auth status` inside the pod. Without this, clone/PR flows cannot run. |
| B2 | Clone the template repo into the pod | `git clone https://github.com/Wondermove-Inc/new-mobile-app.git /workspace/new-mobile-app` (token-auth) — the canonical checkout path per `REPO_OPERATIONS.md` Codex-only Repo Work Policy — then register `/workspace/new-mobile-app/` in `/workspace/CODEX_MANAGED_PATHS.md`. |
| B3 | Role alignment for sample validation | Keep boram's CTO identity for org duties; for template validation runs, set `WM_ROLE` (start with `mobile-dev` or `qa`) via StatefulSet env or session-scoped export, aligned with `/workspace/IDENTITY.md` expectations defined in PR4. Document that boram is a sample/validation pod, not a production wm role pod. |
| B4 | Pin pnpm on the pod | `corepack prepare pnpm@9.15.9 --activate` as interim fix for G9; durable fix is the agent image rebuild (C1). Verify `pnpm install --frozen-lockfile` succeeds in the clone. |
| B5 | Deliver `pod-role-bootstrap` after A4 lands | Reuse the proven b64/zip skill delivery pattern from `codex-cli-auth-setup` (`/workspace/codex-cli-auth-setup.skill.b64` precedent) into `/workspace/skills/pod-role-bootstrap/`; then run `node scripts/codex-preflight.mjs --pod` in the clone and store the readiness report as evidence. |
| B6 | Smoke the gates inside the pod | In `/workspace/new-mobile-app`: `pnpm run test:runtime` and `pnpm turbo run lint test` via Codex CLI (per Codex-only policy). Record results to `.evidence/`. This is the delivery acceptance test. |

### Category C — Platform/Ops (P1, outside this repo; doc 13 Phases 3–8)

| # | Action | Detail |
| --- | --- | --- |
| C1 | Build `clawpod/agent-mobile` image (full + lite) with pnpm 9.15.9, eas-cli, maestro, watchman | durable fix for G9; boram currently runs generic `clawpod/agent:local` |
| C2 | Deploy `wm-po`, `wm-design`, `wm-arch`, `wm-mobile-dev`, `wm-api`, `wm-qa` pods + Secrets + ConfigMaps | after B-track validates the delivery procedure on boram |
| C3 | GitHub webhook routing (PR label → next role wake via NATS) | doc 13 platform annex |
| C4 | Branch protection + required checks (quality-gate.yml as required) | Gatekeeper enforcement |
| C5 | Human-gate environment protection + escalation channels; EAS robot token injection (unblocks PR5 live proof) | doc 13 |

### Execution order summary

```
D0 (gate green; keep it green) → D1–D3 (hygiene, now)
  → A1 PR1 (close NO_GO fix loop, package PR) → A2 PR2 → A3 PR3 → A4 PR4   [repo train]
  → B1, B2, B3, B4 (pod prep; can start once D done, parallel to A)
  → B5, B6 (after A4)                          [delivery acceptance on boram]
  → A5 (PR5–PR7) and C1–C5                     [P1: scale-out + platform]
```

## 5. Constraints Honored

- No code, runtime artifact, or pod mutation was performed in this checkpoint; outputs are evidence documents only.
- Pre-existing worktree modifications (doc 13 etc.) were not touched and are classified as concurrent current-state inputs, not this checkpoint's authored work.
