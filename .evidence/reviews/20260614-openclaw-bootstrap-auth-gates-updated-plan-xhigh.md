**Findings**

High: The plan does not explicitly wire provider auth readiness into `project-bootstrap-preflight.sh`, so the reported false pass can survive implementation. Current preflight blocks on CLI/MCP presence only, while Railway/gcloud auth statuses are collected in the agent setup report but are not used by the project report’s `blockers` array. The plan’s implementation step names `project-bootstrap-agent-setup.sh`, but the pass/fail authority is the preflight report.
Source refs: `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:359`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:370`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:861`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:613`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:700`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:814`.
Owner: Mobile App Dev.

High: Expo auth readiness remains ambiguous because the plan allows “codex mcp login/list state … and/or npx expo whoami/login status.” The repo SoT says Expo MCP readiness is target Codex session OAuth state, and `codex mcp list` must no longer report Expo startup incomplete. `npx expo whoami` is a separate Expo CLI account surface and must not satisfy Expo MCP auth unless the plan defines it as a separate optional CLI gate with its own blocker.
Source refs: `PROJECT_ENVIRONMENT.md:301`, `PROJECT_ENVIRONMENT.md:305`, `docs/CODEX_MCP_ENVIRONMENT.md:332`, `docs/CODEX_MCP_ENVIRONMENT.md:338`, `docs/CODEX_MCP_ENVIRONMENT.md:345`, `docs/CODEX_MCP_ENVIRONMENT.md:358`, `docs/CODEX_MCP_ENVIRONMENT.md:666`.
Owner: Mobile App Dev.

Medium: The install approval rule conflicts with current SoT and fixtures unless the plan defines exact approval flags and updates all existing install language. Current SoT and smoke coverage allow Railway install via `npm i -g @railway/cli` whenever npm is available; the updated plan says package/system installs block without explicit approval. That is a valid policy change, but the plan needs concrete approval env/flag names and required report fields so validators and smoke fixtures do not preserve the old auto-install contract.
Source refs: `PROJECT_ENVIRONMENT.md:319`, `PROJECT_ENVIRONMENT.md:322`, `docs/CODEX_MCP_ENVIRONMENT.md:460`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:64`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:368`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:789`, `evals/skills/project-bootstrap-agent-setup-smoke.sh:815`.
Owner: Mobile App Dev.

Medium: Token-bearing clone rejection is planned for `project-bootstrap`, but the direct advanced recovery path through `pod-role-bootstrap` can still clone `REPO_CLONE_URL` without rejecting embedded credentials. The repo README keeps direct `pod-role-bootstrap` invocation available for advanced recovery, and its script currently calls `git clone "${REPO_CLONE_URL}"` after only checking that the variable is non-empty. The token-bearing rejection must cover that path too, or the plan must explicitly remove/guard direct clone authority there.
Source refs: `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:11`, `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:14`, `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md:10`, `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:96`, `mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:107`.
Owner: Mobile App Dev.

Medium: Verification gates are missing the AGENTS.md mobile environment/runtime checks or an explicit source-backed not-applicable rationale. This plan updates `PROJECT_ENVIRONMENT.md`, MCP/auth readiness, and project-bootstrap runtime behavior, so the DoD can require `expo install --check`, mobile lint/test/doctor, and `codex mcp list` in addition to runtime/local-harness/turbo gates. The plan lists runtime gates and turbo, but not these environment checks.
Source refs: `AGENTS.md:43`, `AGENTS.md:44`, `AGENTS.md:102`, `AGENTS.md:109`, `PROJECT_ENVIRONMENT.md:260`, `PROJECT_ENVIRONMENT.md:301`, `PROJECT_ENVIRONMENT.md:319`.
Owner: Mobile App Dev.

No Critical findings.

Residual risk: This was a read-only plan review. I did not run the future implementation gates, did not verify live provider auth state, and did not write the requested `.evidence/reviews/` artifacts.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "plan",
  "scope": {
    "baseline": "b9c84e139c77ada761c218511612edafeee89a24",
    "target": "updated executable plan in review prompt",
    "paths_reviewed": [
      "AGENTS.md",
      "PROJECT_ENVIRONMENT.md",
      "README.md",
      "docs/CODEX_MCP_ENVIRONMENT.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/report-template.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/scripts/codex-cli-precheck.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh",
      "scripts/validate-team-doc.mjs",
      "scripts/validate-repo-operations.mjs",
      "evals/skills/project-bootstrap-agent-setup-smoke.sh"
    ]
  },
  "findings": [
    {
      "severity": "HIGH",
      "summary": "Provider auth readiness is planned in setup, but the pass/fail authority is project-bootstrap-preflight; without explicitly updating preflight blockers to consume auth readiness, the false pass can remain.",
      "source_refs": [
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:359",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:370",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh:861",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:613",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:700",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:814"
      ],
      "owner": "Mobile App Dev"
    },
    {
      "severity": "HIGH",
      "summary": "Expo auth check wording permits the wrong account surface to satisfy readiness; Expo MCP target-session OAuth and workspace Expo CLI login need separate gates/blockers.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:301",
        "PROJECT_ENVIRONMENT.md:305",
        "docs/CODEX_MCP_ENVIRONMENT.md:332",
        "docs/CODEX_MCP_ENVIRONMENT.md:338",
        "docs/CODEX_MCP_ENVIRONMENT.md:345",
        "docs/CODEX_MCP_ENVIRONMENT.md:358",
        "docs/CODEX_MCP_ENVIRONMENT.md:666"
      ],
      "owner": "Mobile App Dev"
    },
    {
      "severity": "MEDIUM",
      "summary": "Install approval policy is underspecified and conflicts with current Railway auto-install SoT/fixtures unless exact approval flags and report fields are added.",
      "source_refs": [
        "PROJECT_ENVIRONMENT.md:319",
        "PROJECT_ENVIRONMENT.md:322",
        "docs/CODEX_MCP_ENVIRONMENT.md:460",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:64",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh:368",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:789",
        "evals/skills/project-bootstrap-agent-setup-smoke.sh:815"
      ],
      "owner": "Mobile App Dev"
    },
    {
      "severity": "MEDIUM",
      "summary": "Token-bearing clone URL rejection must cover the direct pod-role-bootstrap recovery path, which currently clones REPO_CLONE_URL without rejecting embedded credentials.",
      "source_refs": [
        "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:11",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:14",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md:10",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:96",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh:107"
      ],
      "owner": "Mobile App Dev"
    },
    {
      "severity": "MEDIUM",
      "summary": "Verification gates omit AGENTS.md mobile environment/runtime checks or an explicit source-backed not-applicable rationale.",
      "source_refs": [
        "AGENTS.md:43",
        "AGENTS.md:44",
        "AGENTS.md:102",
        "AGENTS.md:109",
        "PROJECT_ENVIRONMENT.md:260",
        "PROJECT_ENVIRONMENT.md:301",
        "PROJECT_ENVIRONMENT.md:319"
      ],
      "owner": "Mobile App Dev"
    }
  ],
  "checks_reviewed": [
    {
      "command": "git rev-parse HEAD && git status --short",
      "status": "PASS",
      "evidence": "Baseline identified as b9c84e139c77ada761c218511612edafeee89a24; worktree has pre-existing dirty/untracked files, reviewed read-only."
    },
    {
      "command": "rg/nl source inspection of AGENTS.md, PROJECT_ENVIRONMENT.md, project-bootstrap, codex-cli-auth-setup, pod-role-bootstrap, validators, and smoke evals",
      "status": "PASS",
      "evidence": "Reviewed cited source lines for scope, current auth checks, install policy, clone handling, and verification requirements."
    },
    {
      "command": "bash -n changed shell scripts and smoke file",
      "status": "NOT_APPLICABLE",
      "evidence": "Plan-mode review only; no implementation diff was provided. Required for final implementation review."
    },
    {
      "command": "node --check changed validators",
      "status": "NOT_APPLICABLE",
      "evidence": "Plan-mode review only; no changed validator diff was provided. Required for final implementation review."
    },
    {
      "command": "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "status": "NOT_APPLICABLE",
      "evidence": "Plan-mode review only; future RED/GREEN evidence must run this smoke after tests are added."
    },
    {
      "command": "pnpm run test:runtime",
      "status": "NOT_APPLICABLE",
      "evidence": "Plan-mode review only; required after runtime implementation changes."
    },
    {
      "command": "pnpm run test:local-harness",
      "status": "NOT_APPLICABLE",
      "evidence": "Plan-mode review only; required after Codex runtime changes."
    },
    {
      "command": "pnpm turbo run lint test",
      "status": "NOT_APPLICABLE",
      "evidence": "Plan-mode review only; required before PR unless source-backed not applicable."
    }
  ],
  "residual_risks": [
    "Live Railway, gcloud, ADC, and Expo auth state was not verified in this read-only plan review.",
    "The requested evidence files under .evidence/reviews/ were not written because this reviewer operated read-only.",
    "The worktree contains pre-existing uncommitted and untracked files unrelated to this read-only review."
  ],
  "next_action": "fix_findings"
}
```