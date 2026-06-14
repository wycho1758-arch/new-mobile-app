# wm Checkpoint Review Plan Review Prompt

Review mode: plan.
Reviewer: wm-implementation-reviewer.

## User Request

The user explicitly invoked `$wm` and requested a SoT-grounded modification plan for the wm process. The plan must:

- make SoT-grounded planning mandatory;
- create the plan first and have a reviewer check that the required review steps are clearly included;
- include review of the plan before execution;
- include step-by-step checkpoint reviews during plan execution;
- include final review after all work is complete;
- inspect `.codex/agents/**` and report the wm modification plan only after reviewer review.

## SoT Read

- `.agents/skills/wm/SKILL.md:14` requires planning before non-trivial work with scope, owner, paths, tests, evidence, and gate impact.
- `.agents/skills/wm/SKILL.md:15` requires SoT-grounded planning and forbids filling gaps with predictions, assumptions, or expected behavior.
- `.agents/skills/wm/SKILL.md:16` requires material planning decisions to route to read-only agents and record agent, question, conclusion, source refs/evidence, and reflection/impact.
- `.agents/skills/wm/SKILL.md:29` blocks implementation until applicable local SoT is read and cited or named.
- `.agents/skills/wm/SKILL.md:31` requires pre-implementation plan review evidence and final actual-work review evidence.
- `.agents/skills/wm/SKILL.md:32` requires the completed implementation plan to be reviewed by an appropriate read-only reviewer before implementation starts.
- `.agents/skills/wm/SKILL.md:33` requires completed work to be reviewed against the approved plan, git diff, command output, and evidence before Done.
- `.agents/skills/wm/SKILL.md:55` requires the narrowest failing test, eval fixture, harness assertion, or validator check before implementation.
- `.agents/skills/wm/SKILL.md:57` through `.agents/skills/wm/SKILL.md:64` define verification, evidence, git diff, and status reporting requirements.
- `.agents/skills/wm/SKILL.md:76` through `.agents/skills/wm/SKILL.md:84` list the allowed read-only routing agents.
- `.agents/skills/wm/SKILL.md:86` requires reviewer/researcher outputs to include source references, avoid edits, and avoid recursive delegation.
- `.agents/skills/wm/SKILL.md:88` through `.agents/skills/wm/SKILL.md:90` define the reviewer JSON envelope contract and headless review helper.
- `AGENTS.md:34` through `AGENTS.md:41` define Codex runtime paths, including skills, custom agents, evals, and evidence.
- `AGENTS.md:99` through `AGENTS.md:105` require runtime changes under `.agents/`, `.codex/`, `evals/`, or runtime scripts to pass runtime and local harness gates.
- `AGENTS.md:117` through `AGENTS.md:127` define Definition of Done verification commands.
- `PROJECT_ENVIRONMENT.md:218` through `PROJECT_ENVIRONMENT.md:225` restate the current `$wm` runtime rules for SoT planning, read-only routing, no write-capable executor delegation, plan/final reviewer evidence, and final reports.
- `PROJECT_ENVIRONMENT.md:247` through `PROJECT_ENVIRONMENT.md:258` state `$wm` must route through dedicated read-only `wm-*`, `po-*`, and `design-*` agents and that legacy `mobile-*` agents are not `$wm` reviewer routing.
- `REPO_OPERATIONS.md:23` through `REPO_OPERATIONS.md:26` define the narrowest-authoritative-owner rule.
- `REPO_OPERATIONS.md:127` through `REPO_OPERATIONS.md:146` define custom agents under `.codex/agents/<name>.toml` and warn not to place skills and agents in the wrong paths.
- `REPO_OPERATIONS.md:160` through `REPO_OPERATIONS.md:164` require linked evidence, not status-only prose.
- `REPO_OPERATIONS.md:198` through `REPO_OPERATIONS.md:206` require local harness for runtime path or harness changes and clarify external-platform proof limits.
- `scripts/validate-runtime-artifacts.mjs:635` through `scripts/validate-runtime-artifacts.mjs:668` currently validates many `$wm` requirements, including plan review and final review, but does not explicitly validate step-by-step checkpoint review language.
- `scripts/validate-runtime-artifacts.mjs:713` through `scripts/validate-runtime-artifacts.mjs:720` validates `$wm` runtime facts in `PROJECT_ENVIRONMENT.md`, but does not explicitly validate checkpoint review language.
- `.codex/agents/wm-implementation-reviewer.toml:4` through `.codex/agents/wm-implementation-reviewer.toml:16` define read-only review behavior and required checks.
- `scripts/codex-headless-review.mjs:7` through `scripts/codex-headless-review.mjs:24` allow the dedicated read-only agents and verdict-producing reviewers.

## Proposed wm Modification Plan

Scope: Codex runtime policy only. No mobile app, API, contract schema, Design handoff, or external platform work.

Owner role: runtime maintainer under `$wm`; reviewer: `wm-implementation-reviewer` for plan and final review. Use `po-scope-gate-reviewer` only if a planned change introduces human-gate or scope-risk ambiguity. Use `wm-gate-fix-advisor` only if runtime/local-harness gates fail.

Affected paths:

- `.agents/skills/wm/SKILL.md`
- `PROJECT_ENVIRONMENT.md`
- `scripts/validate-runtime-artifacts.mjs`
- `evals/skills/wm/positive.prompt.md`
- a new or updated `evals/skills/wm/*checkpoint-review*.prompt.md` fixture, if the existing positive fixture should stay compact
- `.evidence/reviews/` for plan review, checkpoint review, gate output summaries, and final review evidence

Non-goals:

- no edits to `.codex/agents/*.toml` unless reviewer finds an agent contract gap;
- no new write-capable executor agent;
- no changes to app code, API contracts, Design workflows, production/EAS/Jira/Confluence state, or OpenClaw runtime repositories.

Material decisions and SoT basis:

1. Keep `$wm` planning SoT-grounded and mandatory before non-trivial work.
   Basis: `.agents/skills/wm/SKILL.md:14`, `.agents/skills/wm/SKILL.md:15`, `.agents/skills/wm/SKILL.md:29`, `PROJECT_ENVIRONMENT.md:218`, `PROJECT_ENVIRONMENT.md:221`.

2. Preserve existing pre-implementation plan review and final actual-work review gates.
   Basis: `.agents/skills/wm/SKILL.md:31`, `.agents/skills/wm/SKILL.md:32`, `.agents/skills/wm/SKILL.md:33`, `PROJECT_ENVIRONMENT.md:223`, `PROJECT_ENVIRONMENT.md:224`.

3. Add explicit step-by-step checkpoint review requirements to `$wm` implementation runs.
   Proposed rule: the approved plan must define checkpoint boundaries before execution. After each checkpoint that changes runtime behavior, validator policy, eval fixtures, evidence requirements, or affected SoT, execution must pause for a bounded read-only checkpoint review or record a source-backed skip reason when no material risk changed. Checkpoint review input must include the approved plan, completed checkpoint diff, test/eval output, evidence path, and remaining plan impact. A failed or blocked checkpoint review must be addressed before the next checkpoint proceeds.
   Basis: user request; existing SoT requires material planning decisions to route to read-only agents (`.agents/skills/wm/SKILL.md:16`) and requires evidence rather than status-only prose (`REPO_OPERATIONS.md:160` through `REPO_OPERATIONS.md:164`), but current `$wm` text does not explicitly require step-by-step checkpoint review.

4. Strengthen validator coverage so checkpoint review is not prose-only.
   Proposed checks in `scripts/validate-runtime-artifacts.mjs`:
   - assert `wm` skill contains `checkpoint review`;
   - assert `wm` skill requires checkpoint boundaries in the approved plan;
   - assert checkpoint review inputs include approved plan, checkpoint diff, command output, evidence path, and remaining plan impact;
   - assert failed or blocked checkpoint review cannot proceed to the next checkpoint without addressing findings;
   - assert `PROJECT_ENVIRONMENT.md` documents checkpoint review evidence for `$wm`;
   - assert an eval fixture covers checkpoint review requirements.
   Basis: validators enforce documented policy, not policy ownership (`REPO_OPERATIONS.md:208` through `REPO_OPERATIONS.md:257`), and runtime path/harness changes require local harness (`REPO_OPERATIONS.md:198` through `REPO_OPERATIONS.md:199`).

5. Follow TDD for the change.
   Sequence:
   - Red: add or update eval/validator assertion for checkpoint review terms first; run the narrow validator command and expect failure if run before docs are updated.
   - Green: update `$wm` skill and `PROJECT_ENVIRONMENT.md` to satisfy the new assertion.
   - Refine: run `pnpm run test:runtime`; run `pnpm run test:local-harness` because runtime path/harness validation is affected; record outputs in evidence.
   Basis: `.agents/skills/wm/SKILL.md:20`, `.agents/skills/wm/SKILL.md:55`, `AGENTS.md:28`, `AGENTS.md:121` through `AGENTS.md:127`.

6. Plan review, checkpoint review, and final review sequence:
   - Plan review: run `node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt <plan-prompt> --out .evidence/reviews/<date>-wm-checkpoint-review-plan-review.md` before implementation.
   - Checkpoint 1 review: after validator/eval red-stage changes, review whether the failing assertion accurately captures the requested checkpoint review contract.
   - Checkpoint 2 review: after `$wm` skill and `PROJECT_ENVIRONMENT.md` updates, review the diff and narrow command output before broad gates.
   - Checkpoint 3 review: after `pnpm run test:runtime` and `pnpm run test:local-harness`, review gate output and residual risk before final report.
   - Final review: run `wm-implementation-reviewer` against the approved plan, full relevant git diff, command output, evidence paths, and final status before Done.
   Basis: user request; `.agents/skills/wm/SKILL.md:31` through `.agents/skills/wm/SKILL.md:34`; `.agents/skills/wm/SKILL.md:62` through `.agents/skills/wm/SKILL.md:64`.

Expected tests and gates:

- narrow validator during TDD: `node scripts/validate-runtime-artifacts.mjs` or `pnpm run validate` depending on package script composition;
- required runtime gate: `pnpm run test:runtime`;
- required runtime/harness gate: `pnpm run test:local-harness`;
- final diff/status checks: `git diff -- .agents/skills/wm/SKILL.md PROJECT_ENVIRONMENT.md scripts/validate-runtime-artifacts.mjs evals/skills/wm` and `git status --short`.

Evidence paths:

- plan review: `.evidence/reviews/20260614-wm-checkpoint-review-plan-review.md`
- checkpoint reviews: `.evidence/reviews/20260614-wm-checkpoint-review-cp1.md`, `cp2.md`, `cp3.md`
- final review: `.evidence/reviews/20260614-wm-checkpoint-review-final-review.md`
- command evidence: `.evidence/reviews/20260614-wm-checkpoint-review-gates.md`

Gate impact:

- This is a Codex runtime change, so `pnpm run test:runtime` and `pnpm run test:local-harness` are required before Done.
- No mobile runtime, API contract, Design/Stitch, production, payment, PII/privacy, legal, external messaging, or failed-gate risk acceptance human gate is introduced by the plan.

Review question:

Does this proposed modification plan satisfy the user's request and the repository SoT, especially the mandatory SoT planning, plan review, step-by-step checkpoint review, and final review requirements? Return findings first and the required JSON envelope.
