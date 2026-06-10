# PR5 Native Evidence Ladder Implementation Final Review Prompt

You are `wm-implementation-reviewer` using high-depth final review. Operate read-only.

## Scope To Review

- Baseline commit: `e2e6491 docs: record PR5 evidence ladder plan review`
- Target: current working tree
- Approved plan: `docs/plans/active/20260611-pr5-native-evidence-ladder-preimplementation-plan.md`
- Plan reviewer evidence:
  - `.evidence/reviews/pr5-native-evidence-ladder-preimplementation-xhigh-20260611.md`
  - `.evidence/reviews/pr5-native-evidence-ladder-preimplementation-xhigh-20260611.json`
- Implementation checkpoint:
  - `.evidence/reviews/pr5-native-evidence-ladder-implementation-checkpoint-20260611.md`

## Changed Scope

Expected PR5 offline implementation paths include:

- `scripts/ingest-eas-evidence.mjs`
- `scripts/lib/work-unit-machine.mjs`
- `scripts/work-unit-next.mjs`
- `scripts/validate-repo-operations.mjs`
- `package.json`
- `.github/workflows/quality-gate.yml`
- `evals/work-units/fixtures/**/evidence-ladder-*`
- `evals/local-harness/eas-evidence/fixtures/eas-maestro-success-tokenized-url.json`
- `team-doc/mobile-app-dev-team/14-native-e2e-strategy.md`
- `team-doc/mobile-app-dev-team/06-gates-and-evidence.md`
- `team-doc/mobile-app-dev-team/README.md`
- `team-doc/mobile-app-dev-team/99-source-map.md`
- `.agents/skills/e2e-test/SKILL.md`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- this final review prompt/checkpoint evidence

## Required Review Questions

1. Did implementation stay inside the approved PR5 offline scope?
2. Is TDD evidence credible: RED fixture failures before implementation and green checks after?
3. Does `validate-work-units` now prevent RN Web-only evidence from satisfying L2/L3 native claims?
4. Does offline EAS ingest redact tokenized URL query data and avoid live EAS/token/device work?
5. Are package, CI, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `$e2e-test`, and team-doc updates consistent?
6. Do the gates in the checkpoint support final local completion?
7. Are there any secrets, customer-specific identifiers, native readiness overclaims, or external platform actions?

## Gates Claimed By Checkpoint

All exited 0 after implementation:

- `pnpm run validate:eas-evidence`
- `pnpm run validate:work-units`
- `node scripts/validate-team-doc.mjs`
- `node scripts/work-unit-next.mjs --self-test`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`
- `git diff --check`
- root `CLAUDE.md`, `.claude/`, `.claude-state` absence check

Known RED checks before implementation:

- `node scripts/validate-work-units.mjs --self-test` failed because new invalid ladder fixtures unexpectedly passed.
- `pnpm run validate:eas-evidence` failed because `scripts/ingest-eas-evidence.mjs` did not exist.

## Output Contract

Return findings first. End with exactly one fenced JSON envelope:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `final`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

Use `GO` only if there are no Critical/High/Medium findings and required checks are PASS or source-backed NOT_APPLICABLE. This final review may accept recorded broad gates from the checkpoint, but should rerun narrow read-only checks where useful.
