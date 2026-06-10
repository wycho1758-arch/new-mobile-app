# PR7 Evidence Hygiene And Preflight Hardening Implementation: xhigh Final Review Prompt

Date: 2026-06-11
Reviewer: wm-implementation-reviewer
Mode: final

## Request

Review the completed PR7 implementation against the approved preimplementation plan, SoT, git diff, checkpoint, and gate evidence. Do not edit files.

Baseline:

- `e609116 docs: record PR7 evidence hygiene plan review`

Approved plan/evidence:

- `docs/plans/active/20260611-pr7-evidence-hygiene-preimplementation-plan.md`
- `.evidence/reviews/pr7-evidence-hygiene-preimplementation-xhigh-20260611.md`
- `.evidence/reviews/pr7-evidence-hygiene-preimplementation-xhigh-20260611.json`

Implementation checkpoint:

- `.evidence/reviews/pr7-evidence-hygiene-implementation-checkpoint-20260611.md`

## Changed Paths To Review

- `scripts/lib/secret-patterns.mjs`
- `scripts/validate-evidence-hygiene.mjs`
- `evals/local-harness/evidence-hygiene/fixtures/`
- `scripts/validate-team-doc.mjs`
- `scripts/validate-team-doc-archive.mjs`
- `scripts/codex-preflight.mjs`
- `evals/local-harness/preflight/fixtures/pod.invalid-design-stitch-missing.json`
- `evals/local-harness/preflight/fixtures/pod.valid-design-stitch-present-redacted.json`
- `evals/local-harness/preflight/fixtures/pod.valid-non-design-stitch-skip.json`
- `package.json`
- `.github/workflows/quality-gate.yml`
- `PROJECT_ENVIRONMENT.md`
- `REPO_OPERATIONS.md`
- `scripts/validate-repo-operations.mjs`
- `scripts/validate-project-environment.mjs`
- `evals/local-harness/project-environment/fixtures/invalid-quality-gate-missing-evidence-hygiene.json`
- `.evidence/api-app-run-check/api.md`
- `.evidence/reviews/pr7-evidence-hygiene-implementation-checkpoint-20260611.md`

## Checks To Verify Or Source-Review

Checkpoint records these commands as exit 0:

- `node scripts/validate-evidence-hygiene.mjs --self-test`
- `node scripts/validate-evidence-hygiene.mjs`
- `node scripts/codex-preflight.mjs --self-test`
- `node scripts/validate-project-environment.mjs --self-test`
- `node scripts/validate-project-environment.mjs`
- `node scripts/validate-repo-operations.mjs`
- `node scripts/validate-team-doc.mjs`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`
- `git diff --check`
- root `CLAUDE.md`, `.claude/`, `.claude-state` absence check

## Review Questions

1. Did the implementation stay inside the approved offline deterministic PR7 scope?
2. Is the TDD evidence credible, including missing-script RED, planted secret/file-line fixture, invalid evidence path fixtures, current-tree valid state, Design Stitch missing/configured fixtures, non-Design Stitch skip, and output redaction?
3. Does `scripts/validate-evidence-hygiene.mjs` catch forbidden evidence paths, invalid E2E evidence directory names, and secret-pattern findings with file and line?
4. Are shared secret-pattern extraction and existing team-doc/archive validators preserved without weakening current checks?
5. Does `scripts/codex-preflight.mjs --pod` check Stitch status only for Design roles and avoid printing ADC paths, Google project IDs, tokens, or secret-bearing values?
6. Are package script composition, CI runtime-change detection, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `validate-repo-operations`, and `validate-project-environment` aligned?
7. Did the implementation avoid live Stitch/Google Cloud operations, mobile-mcp/device execution, Confluence/Atlassian, Railway, EAS, GitHub issue creation, branch protection, webhook, pod rollout, Secret/token provisioning, and release-readiness claims?
8. Are there any Critical/High/Medium findings that must block commit?

## Expected Review Output

Return findings first, then exactly one fenced JSON envelope with:

- `verdict`: `GO`, `NO_GO`, `NEEDS_HUMAN`, or `BLOCKED`
- `reviewer`: `wm-implementation-reviewer`
- `mode`: `final`
- `scope`
- `findings`
- `checks_reviewed`
- `residual_risks`
- `next_action`

Use `GO` only if there are no Critical/High/Medium findings and required checks are source-backed `PASS` or `NOT_APPLICABLE`.
