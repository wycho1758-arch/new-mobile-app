# Reviewer JSON Envelope Change Plan

Date: 2026-06-10

## Scope

Add deterministic reviewer return semantics to the current WonderMove mobile repo reviewer flow without importing the broader OpenClaw reviewer orchestrator.

The target is a thin JSON envelope layered onto the existing read-only, role-specific reviewer model.

## Source Of Truth Checked

- `AGENTS.md`
- `PROJECT_ENVIRONMENT.md`
- `.agents/skills/wm/SKILL.md`
- `.codex/agents/{wm-implementation-reviewer,wm-contract-reviewer,po-planning-reviewer,po-scope-gate-reviewer,design-reviewer}.toml`
- `scripts/codex-headless-review.mjs`
- `scripts/validate-runtime-artifacts.mjs`
- `evals/agents/*`
- `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md`
- `.evidence/reviews/reviewer-workflow-comparison-analysis-20260610.md`

## Current State

- `$wm` already requires SoT-grounded planning, tests-first implementation, plan review evidence, final work review evidence, and read-only custom reviewer routing.
- `scripts/codex-headless-review.mjs` already forces `codex -a never exec -m gpt-5.5 -s read-only`, validates the allowed agent list, requires source references, and rejects recursive delegation gaps.
- Reviewer outputs are findings-first prose. There is no machine-checkable verdict, check status, finding severity array, or next action contract.
- Current SoT forbids Claude/auto fallback terms in the helper and `$wm`; OpenClaw's Graphify/Claude/fix-loop model must not be copied into this repo.

## Target Contract

Require verdict-producing reviewer agents to include source-cited prose plus one fenced JSON envelope.

Verdict-producing reviewers:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `design-reviewer`

Excluded from machine-readable reviewer verdict contract:

- `wm-docs-researcher`
- `po-docs-researcher`
- `design-researcher`
- `wm-gate-fix-advisor`

Envelope:

```json
{
  "verdict": "GO | NO_GO | NEEDS_HUMAN | BLOCKED",
  "reviewer": "wm-implementation-reviewer | wm-contract-reviewer | po-planning-reviewer | po-scope-gate-reviewer | design-reviewer",
  "mode": "plan | final | scope | contract | design",
  "scope": {
    "baseline": "commit-or-null",
    "target": "commit-or-path",
    "paths_reviewed": []
  },
  "findings": [
    {
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "summary": "short finding summary",
      "source_refs": ["path:line"],
      "owner": "Product/Planning | Design | Mobile Architect | Mobile App Dev | Backend/API Integrator | QA/Release | human"
    }
  ],
  "checks_reviewed": [
    {
      "command": "pnpm run test:runtime",
      "status": "PASS | FAIL | NOT_RUN | NOT_APPLICABLE",
      "evidence": "path-or-reason"
    }
  ],
  "residual_risks": [],
  "next_action": "proceed | fix_findings | ask_human | rerun_review"
}
```

Verdict rules:

- `GO` only when there are no Critical/High/Medium findings and every required reviewed check is `PASS` or source-backed `NOT_APPLICABLE`.
- `NO_GO` when any Critical/High/Medium finding remains or a required check failed.
- `NEEDS_HUMAN` when the blocker is a human gate: production submit, payment or money movement, PII/privacy-sensitive behavior, external messaging or email/SMS push, legal/terms/contracts, business approval, compliance/policy decision, Human Owner budget/business decision, irreversible scope tradeoff, scope expansion, or risk acceptance after a gate failure.
- `BLOCKED` when required SoT, diff, evidence, or command output is missing.
- Required `NOT_RUN` checks must be `BLOCKED` unless explicitly justified as `NOT_APPLICABLE`.

## TDD-First Implementation Plan

1. Add validator/eval expectations first.
   - Update `scripts/validate-runtime-artifacts.mjs` to define the five verdict-producing reviewers.
   - Assert each verdict-producing reviewer TOML contains the envelope fields, verdict enum, check status enum, severity enum, source reference requirement, and read-only/no-fix-loop boundary.
   - Assert researcher/advisor agents are not forced into the verdict envelope.
   - Add validator-required positive/negative eval fixtures for `evals/agents/wm-implementation-reviewer/` and `evals/agents/wm-contract-reviewer/` before editing those TOMLs.
   - Update existing `evals/agents/{po-planning-reviewer,po-scope-gate-reviewer,design-reviewer}/` prompts so positive reviewer fixtures ask for the structured envelope and negative/advisory fixtures remain advisory-only where applicable.
   - Add helper parser fixtures before changing `scripts/codex-headless-review.mjs`: valid `GO`, valid `NO_GO`, valid `NEEDS_HUMAN`, valid `BLOCKED`, missing envelope, malformed JSON, unsupported reviewer, required `FAIL`, and required `NOT_RUN`.
   - Add helper self-test assertions that consume those fixtures and fail before the parser implementation exists.

2. Update reviewer SoT text.
   - Update `.agents/skills/wm/SKILL.md` read-only review routing to require source-cited prose plus the JSON envelope for verdict-producing reviewers.
   - Update `PROJECT_ENVIRONMENT.md` Codex runtime section with the same reviewer return contract.
   - Update `docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md` with the same Codex runtime reviewer return contract, or explicitly record a source-backed not-applicable rationale if this document is superseded before implementation.
   - Keep legacy `mobile-*` reviewers out of `$wm` routing.

3. Update verdict-producing reviewer TOMLs.
   - Add an `Output Contract` section to the five target reviewer TOMLs.
   - Preserve findings-first prose.
   - Require exactly one fenced JSON envelope at the end of the report.
   - Preserve read-only/no source edits/no recursive delegation/no failed-gate pass authority.

4. Add optional helper validation.
   - Extend `scripts/codex-headless-review.mjs` with an optional `--json-envelope` flag.
   - When enabled, parse the final fenced JSON block from `--output-last-message`.
   - Validate allowed reviewer, enum values, finding source refs, check status, and verdict blocking rules.
   - Reject `--json-envelope` for researcher/advisor agents unless a later SoT introduces a separate advisory schema.
   - Keep default behavior backward-compatible until all callers are migrated.

5. Verification.
   - Run `pnpm run validate` after validator and TOML/doc changes.
   - Run `pnpm run test:runtime`.
   - Run `pnpm run test:local-harness` because `.agents/`, `.codex/`, `evals/`, and `scripts/` are runtime surfaces.
   - Run `pnpm turbo run lint test` because `test:local-harness` already includes it, but record the explicit result if run independently.
   - Run final read-only reviewer evidence with a complete command that exercises the new envelope path, for example:
     `node scripts/codex-headless-review.mjs --json-envelope --agent wm-implementation-reviewer --prompt <review-prompt-or-file> --out .evidence/reviews/<final-review>.md`.

## Non-Goals

- Do not add Graphify, Memory MCP, Claude fallback, `--engine auto`, `review_engine_preference`, or OpenClaw fix-loop behavior.
- Do not make reviewer agents edit files or mark failed gates as passed.
- Do not change mobile app/runtime implementation code.
- Do not force researcher/advisor agents into machine-readable reviewer verdict semantics.
- Do not add security/performance/UI fan-out reviewers until a current repo SoT introduces those gates.

## Risks And Mitigations

- Risk: reviewer JSON may be syntactically invalid.
  - Mitigation: optional helper parser validates only when `--json-envelope` is requested; validators force the prompt contract before strict runtime usage.
- Risk: `GO` may be returned despite missing evidence.
  - Mitigation: helper rule treats failed required checks as `NO_GO` and missing required checks as `BLOCKED`.
- Risk: terminology may imply gate-passing authority.
  - Mitigation: use `verdict-producing reviewer`; keep human gates and failed-gate pass authority out of reviewer scope.
- Risk: headless Codex instability may block review evidence.
  - Mitigation: keep headless helper as one supported evidence path, not the only review path, and analyze failures separately.

## Next Step After Implementation

Analyze intermittent `codex-headless-review.mjs` execution issues against SoT.

Planned analysis scope:

- Collect failure examples from recent `.evidence/reviews/*`, terminal output, and hook messages without reading secrets.
- Compare failures against `PROJECT_ENVIRONMENT.md` Codex runtime requirements: Codex-only helper, `gpt-5.5`, high reasoning, read-only sandbox, no Claude/auto fallback.
- Classify root causes:
  - MCP/plugin auth noise or invalid-token warnings that do not necessarily fail the review.
  - Codex CLI non-zero exit.
  - output file not written by `--output-last-message`.
  - malformed or missing reviewer envelope after implementation.
  - hook interference or Stop hook reminders.
  - model/runtime availability or timeout.
- Recommend whether to add retry, timeout, diagnostic logging, or a separate advisory fallback evidence path while preserving read-only and no-Claude-fallback SoT.

## Expected Decision Before Implementation

No product or human-risk decision is required for the plan itself. Implementation should start only after read-only reviewer evidence finds no Critical/High/Medium blockers for this plan.
