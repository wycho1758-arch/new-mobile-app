# Reviewer Workflow Comparison Analysis

Date: 2026-06-10

## Scope

Compared:

- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/skills/reviewer/SKILL.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.claude/agents/reviewer.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/agents/reviewer.md`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/scripts/invoke-code-reviewer.sh`
- `/Users/tw.kim/Documents/AGA/test/openclaw-cloud/.codex/skills/codex-review/rules/{prompts,schemas}`
- Current project `.agents/skills/wm/SKILL.md`
- Current project `scripts/codex-headless-review.mjs`
- Current project `.codex/agents/*reviewer*.toml`
- Current project `PROJECT_ENVIRONMENT.md`
- Current project `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`

## OpenClaw Reviewer Model

The openclaw-cloud reviewer is a single bounded review gate.

Key properties:

- The skill declares a compact JSON return contract:

```json
{
  "verdict": "LGTM | FIX_APPLIED | ESCALATE",
  "qa": "PASS | FAIL",
  "security": "PASS | FAIL | SKIP",
  "performance": "PASS | ADVISORY | SKIP",
  "unresolved_issues": []
}
```

- The actual agent expands that into a richer JSON object with `plan_path`, phase, `graphify_scan`, `standards_violations`, `codex_review`, `code_review`, `qa`, `security`, `performance`, `ui`, `retries_used`, `unresolved_issues`, and `next_action`.
- The pipeline is fixed: Graphify, standards cross-check, selective deep dive, change classification, expert fan-out, synthesis, optional fix loop, JSON verdict.
- Code/doc review is delegated through `.codex/scripts/invoke-code-reviewer.sh`.
- The script performs schema-shaped payload validation with a hand-written `jq` subset check, then stamps `review_engine`, records `engine_attempts`, and normalizes skip/failure reasons. Because the schema disallows additional properties, the post-stamped engine metadata is not part of the raw payload schema validation.
- The model distinguishes the high-level reviewer verdict from lower-level code-review results.

Strengths:

- Clear machine-readable return contract.
- Engine attempts and skip reasons are explicit.
- A single orchestrator decides Go/No-Go style outcomes.
- Conditional gates for QA/security/performance/UI are encoded in one place.
- Schema validation reduces ambiguity in downstream consumption.

Weaknesses / portability risks:

- It is heavy for this mobile repo's current scope.
- It assumes Graphify, Memory MCP, QA/security/performance/UI agents, and fix-loop machinery that are not current SoT here.
- The Claude source and Codex port are not identical: `.claude/agents/reviewer.md` says code reviewer is codex primary with Claude fallback, while `.codex/skills/reviewer/SKILL.md` and `.codex/agents/reviewer.md` say Claude first with Codex fallback.
- It can blur reviewer and fixer boundaries because the orchestrator includes a dev-executor retry loop. Current mobile SoT keeps reviewers read-only.

## Current Project Reviewer Model

The current project has several narrow read-only reviewers instead of one general reviewer.

Key properties:

- `$wm` requires review-only requests to route to read-only custom agents.
- `$wm` requires plan-review evidence and final actual-work review evidence for non-trivial implementation runs.
- `scripts/codex-headless-review.mjs` allows only the configured `wm-*`, `po-*`, and `design-*` read-only agents.
- The helper runs Codex in read-only mode and writes the final message to an evidence path.
- Agent outputs are human-readable findings-first reports with source references.
- There is no enforced JSON schema for reviewer output.
- There is no unified verdict enum, no normalized `qa/security/performance/ui` fields, and no `engine_attempts`.

Strengths:

- Matches current mobile SoT and role boundaries.
- Keeps reviewers read-only and prevents recursive delegation.
- Reviewers are domain-specific: implementation, contract, planning/scope, and design.
- Lightweight and easy to run from the current repo.
- Avoids importing unrelated OpenClaw admin-portal standards into the mobile template.

Weaknesses:

- Return shape is underspecified. The caller must infer Go/No-Go from prose.
- `xhigh` is a review intensity convention, not a schema field or agent identity.
- The helper validates agent allow-list/read-only text, but not the output structure.
- Evidence can be present but not machine-checkable.
- There is no standard summary object for severity counts, unresolved issues, next action, skipped gates, or commands reviewed.

## Practical Comparison

| Topic | openclaw-cloud reviewer | current project reviewer |
| --- | --- | --- |
| Reviewer shape | Single orchestrator gate | Multiple role-specific read-only reviewers |
| Return | JSON verdict contract | Human-readable findings-first report |
| Schema validation | Yes for code-review result | No reviewer output schema |
| Engine metadata | `review_engine`, `engine_attempts`, `skip_reason` | Not standardized |
| Fan-out | QA/security/performance/UI conditional agents | Manual reviewer selection by caller |
| Fix loop | Built in, max 2 retries | Forbidden for reviewers |
| SoT fit here | Partial, too broad | High, but less deterministic |
| Main weakness | Too heavy and mixed with fixer loop | Ambiguous return semantics |

## Recommended Improvement For Current Project

Do not copy the openclaw-cloud orchestrator wholesale. Instead, add a thin structured reviewer result envelope while preserving current role-specific read-only reviewers.

Scope this envelope to verdict-producing reviewer agents only:

- `wm-implementation-reviewer`
- `wm-contract-reviewer`
- `po-planning-reviewer`
- `po-scope-gate-reviewer`
- `design-reviewer`

Do not force `wm-docs-researcher`, `po-docs-researcher`, `design-researcher`, or `wm-gate-fix-advisor` into an approval verdict. Researcher/advisor outputs may use a separate non-approval metadata block later, but their output should remain advisory unless a new SoT explicitly changes that.

Recommended envelope:

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
      "summary": "...",
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

Suggested rules:

- `GO` only when there are no Critical/High/Medium findings and all required reviewed checks are `PASS` or `NOT_APPLICABLE`.
- `NO_GO` when any Critical/High/Medium finding remains.
- `NEEDS_HUMAN` when the issue is a human gate, business decision, risk acceptance, legal/privacy/payment/production submit, or scope expansion.
- `BLOCKED` when required SoT, diff, evidence, or command output is missing.
- Any required check with `FAIL` must produce `NO_GO` and a blocking finding.
- Any required check with `NOT_RUN` must produce `BLOCKED` unless the reviewer explicitly classifies it as `NOT_APPLICABLE` with a source-backed reason.
- Keep the prose findings, but require the JSON envelope at the top or bottom of the reviewer output.
- Keep reviewers read-only; do not add a fix loop into reviewer agents.
- Add validator coverage that every allowed reviewer TOML mentions the envelope terms and `scripts/codex-headless-review.mjs` can optionally extract/validate the JSON block.

## Proposed Phased Plan

Phase 1: Tests-first contract introduction.

- Update evals/validator assertions first so reviewer output contract drift fails before implementation text changes.
- Add runtime validator checks for the reviewer result envelope terms, GO blocking rules, and reviewer-only scope.
- Update `$wm` reviewer section to require a structured reviewer result envelope.
- Update each allowed reviewer TOML output section with the envelope.
- Keep source-cited prose findings mandatory.
- Do not change execution engines.

Phase 2: Helper validation.

- Add optional `--json-envelope` validation to `scripts/codex-headless-review.mjs`.
- Store raw final message and parsed envelope side by side when validation is enabled.
- Add tests for PASS, FAIL, NOT_RUN, NOT_APPLICABLE, missing JSON envelope, and unsupported reviewer/researcher/advisor envelope cases.

Phase 3: Role-aware command/evidence mapping.

- Define command review expectations by mode: plan, final, contract, design, scope.
- Avoid openclaw-cloud's Graphify/security/performance/UI fan-out until the mobile repo has current SoT for those gates.

## Conclusion

The current reviewer behavior is correct on read-only role routing but weak on deterministic return semantics. The openclaw-cloud reviewer is stronger on JSON contracts and engine traceability, but it is too broad and contains assumptions that are not current SoT for this mobile repo. The best improvement is a small JSON envelope layered onto the current read-only role-specific reviewer model.
