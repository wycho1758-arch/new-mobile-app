**Findings**

Medium - `assert_json_no_secret_like` can fail on safe report-disclaimer text, not only secret values. The new helper forbids plain phrases like `ADC JSON`, `service account JSON`, and `bearer ...`; the current setup report already contains a safety/disclaimer field saying it records no ADC JSON, database URLs, bearer tokens, or private keys. Once `tool_readiness` is implemented and the new assertions are reached, this can produce a false failure or pressure the implementation to remove useful safety wording instead of preventing real secret leakage. Source refs: `evals/skills/project-bootstrap-agent-setup-smoke.sh:122`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:134`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:135`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:136`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:498`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:499`.

Medium - The fake Railway/gcloud CLI fixture does not prove the implementation rechecks `railway --version` or `gcloud --version`. The installer body is generated from an unquoted heredoc, so the `$1` in the generated fake CLI can be expanded while generating the installer content rather than when the fake CLI is invoked. The fake CLI also exits 0 for all other commands and records no command log. As written, the eval can pass `version_status === "checked"` without proving that the exact version command was executed. Source refs: `evals/skills/project-bootstrap-agent-setup-smoke.sh:84`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:90`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:93`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:106`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:107`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:730`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:735`.

Low - The new primary-guidance raw-blocker assertion only checks representative raw blocker strings for `expo` and `railway`, while the checkpoint intent specifically names `node_repl`, Railway, and `gcloud`. The helper to verify all report blockers are support-only already exists, but this new case does not use it. Source refs: `evals/skills/project-bootstrap-agent-setup-smoke.sh:310`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:793`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:798`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:813`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:814`.

No Critical or High findings found. Tests-first scope is otherwise respected: only `evals/skills/project-bootstrap-agent-setup-smoke.sh` is modified, and implementation scripts / SoT docs have no diff at this checkpoint. I could not independently rerun the smoke script in this read-only review runtime because `mktemp` cannot create temp dirs here; the expected failure is source-backed by the current report schema lacking `tool_readiness.node_repl`.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "final",
  "scope": {
    "baseline": "794b8c6",
    "target": "worktree: evals/skills/project-bootstrap-agent-setup-smoke.sh",
    "paths_reviewed": [
      "AGENTS.md",
      "PROJECT_ENVIRONMENT.md",
      ".evidence/reviews/20260614-project-bootstrap-required-tool-agent-ownership-plan.md",
      ".evidence/reviews/20260614-project-bootstrap-required-tool-agent-ownership-test-checkpoint.md",
      "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh"
    ]
  },
  "findings": [
    {
      "severity": "MEDIUM",
      "summary": "Secret-like report assertion can false-fail on safe disclaimer text such as ADC JSON, service account JSON, and bearer tokens rather than actual secret values.",
      "source_refs": [
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:122",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:134",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:135",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:136",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:498",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:499"
      ],
      "owner": "mobile-app-dev"
    },
    {
      "severity": "MEDIUM",
      "summary": "Approved-installer fake CLI fixture does not prove railway/gcloud --version was rechecked because the generated CLI does not reliably branch on runtime argv and exits 0 for arbitrary invocations.",
      "source_refs": [
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:84",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:90",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:93",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:106",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:107",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:730",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:735"
      ],
      "owner": "mobile-app-dev"
    },
    {
      "severity": "LOW",
      "summary": "Raw-blocker support-only assertion in the new preflight guidance case checks expo and railway but not the newly targeted node_repl and gcloud raw blocker strings.",
      "source_refs": [
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:310",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:793",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:798",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:813",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:814"
      ],
      "owner": "mobile-app-dev"
    }
  ],
  "checks_reviewed": [
    {
      "command": "git diff --name-status",
      "status": "PASS",
      "evidence": "Only evals/skills/project-bootstrap-agent-setup-smoke.sh is modified in the tracked diff."
    },
    {
      "command": "git diff -- mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh PROJECT_ENVIRONMENT.md docs/CODEX_MCP_ENVIRONMENT.md docs/confluence/20260608-codex-expo-rn-runtime-sot-update.md",
      "status": "PASS",
      "evidence": "No implementation script or SoT doc diff is present at this checkpoint."
    },
    {
      "command": "bash evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "status": "PASS",
      "evidence": ".evidence/reviews/20260614-project-bootstrap-required-tool-agent-ownership-test-checkpoint.md:35 records expected pre-implementation failure; source inspection confirms current report has mcp.node_repl but no tool_readiness.node_repl at project-bootstrap-agent-setup.sh:481."
    },
    {
      "command": "git diff --check -- evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "status": "PASS",
      "evidence": "No whitespace errors reported."
    },
    {
      "command": "pnpm run test:runtime",
      "status": "NOT_APPLICABLE",
      "evidence": "Checkpoint is intentionally failing-eval-only before implementation; AGENTS.md:106 requires this before PR readiness, not for this failing-test checkpoint."
    },
    {
      "command": "pnpm turbo run lint test",
      "status": "NOT_APPLICABLE",
      "evidence": "No app/API/runtime implementation has been changed yet; workspace gate remains required before PR readiness per AGENTS.md:106."
    },
    {
      "command": "pnpm run test:local-harness",
      "status": "NOT_APPLICABLE",
      "evidence": "Runtime-change PR gate remains required before PR readiness per AGENTS.md:108; this checkpoint only adds failing eval coverage."
    },
    {
      "command": "mobile-mcp visual QA",
      "status": "NOT_APPLICABLE",
      "evidence": "No mobile UI/runtime screen change is in scope."
    }
  ],
  "residual_risks": [
    "Reviewer rerun of the smoke script was blocked by the read-only sandbox because mktemp could not create a temp directory; rerun in a writable local shell after fixing the eval issues.",
    "Implementation scripts, SoT docs, docs/confluence mirror updates, and final PR gates are still pending and require a separate final review.",
    "No API contract drift or mobile UI boundary risk was found in this checkpoint because no app/API code changed."
  ],
  "next_action": "fix_findings"
}
```