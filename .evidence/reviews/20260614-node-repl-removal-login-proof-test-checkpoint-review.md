# node_repl Removal Login Proof Test Checkpoint Review

Date: 2026-06-14
Reviewer: wm-implementation-reviewer
Mode: plan
Verdict: GO

## Findings

None.

## Summary

Checkpoint 1 matches the approved TDD sequence. The only smoke failure
reproduced in the current worktree is the expected pre-implementation assertion:
`r.tool_readiness.node_repl.required === false`. The current diff is limited to
`evals/skills/project-bootstrap-agent-setup-smoke.sh`, and the checkpoint
evidence records the expected red phase before implementation.

## JSON Envelope

```json
{
  "verdict": "GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "plan",
  "scope": {
    "checkpoint": "1",
    "plan_path": ".evidence/reviews/20260614-node-repl-removal-login-proof-plan.md",
    "diff_paths": [
      "evals/skills/project-bootstrap-agent-setup-smoke.sh"
    ],
    "evidence_paths": [
      ".evidence/reviews/20260614-node-repl-removal-login-proof-test-checkpoint.md"
    ]
  },
  "findings": [],
  "checks_reviewed": [
    {
      "check": "Current diff is test/eval-only before implementation",
      "result": "PASS",
      "evidence": "git diff --stat shows only evals/skills/project-bootstrap-agent-setup-smoke.sh changed"
    },
    {
      "check": "Smoke failure matches expected TDD red phase",
      "result": "PASS",
      "evidence": "bash evals/skills/project-bootstrap-agent-setup-smoke.sh exits 1 with assertion failed: r.tool_readiness.node_repl.required === false"
    },
    {
      "check": "Checkpoint evidence accurately records expected failure",
      "result": "PASS",
      "evidence": ".evidence/reviews/20260614-node-repl-removal-login-proof-test-checkpoint.md records the same assertion and marks it as expected TDD failure"
    },
    {
      "check": "Plan supports moving node_repl from required blocker to optional inventory",
      "result": "PASS",
      "evidence": ".evidence/reviews/20260614-node-repl-removal-login-proof-plan.md defines node_repl removal from required MCP blocker as Checkpoint 1 implementation target"
    },
    {
      "check": "Railway/gcloud test expectations are aligned with plan",
      "result": "PASS",
      "evidence": "Diff adds npm i -g @railway/cli, railway login, gcloud auth login, gcloud auth application-default login, gcloud config set project <project-id>, and gcloud config get-value project expectations"
    },
    {
      "check": "Secret handling remains metadata/status only",
      "result": "PASS",
      "evidence": "Diff keeps assert_json_no_secret_like checks and evidence states credential contents must not be read"
    }
  ],
  "residual_risks": [
    "Implementation must still update SKILL.md, PROJECT_ENVIRONMENT.md, docs/CODEX_MCP_ENVIRONMENT.md, project-bootstrap scripts, and any blocker/report templates to satisfy the new tests.",
    "Later checkpoints must verify that live CLI/login UX commands do not print tokens, OAuth codes, ADC JSON, service account JSON, or credential file contents.",
    "gcloud installation behavior must remain SoT-backed and must not silently add broad package sources without the approved official installer path."
  ],
  "next_action": "Proceed to implementation for Checkpoint 2, then run the smoke/evidence checks and request the next reviewer checkpoint before continuing."
}
```
