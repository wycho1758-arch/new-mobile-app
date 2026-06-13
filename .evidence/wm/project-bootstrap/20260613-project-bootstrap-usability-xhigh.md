**Findings**

**Medium**: The current SoT supports `project-bootstrap` as the simple user-facing setup workflow, but the runbook still presents its internals as peer manual steps. `project-bootstrap/SKILL.md` defines the skill as orchestration and says the agent must handle agent-owned setup before asking the user for help (`mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:8`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:10`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:11`). Its workflow explicitly runs agent setup, preflight, Codex CLI/auth setup, `pod-role-bootstrap`, and re-preflight/role checks (`mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:160`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:184`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:197`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:203`, `mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:209`). However, `16-pod-environment-bootstrap.md` lists `project-bootstrap`, `codex-cli-auth-setup`, role identity/repo/managed-path steps, and `pod-role-bootstrap` as separate Zero-To-Ready steps (`mobile-app-dev-team/16-pod-environment-bootstrap.md:276`, `mobile-app-dev-team/16-pod-environment-bootstrap.md:283`, `mobile-app-dev-team/16-pod-environment-bootstrap.md:285`, `mobile-app-dev-team/16-pod-environment-bootstrap.md:291`). That makes users reason about three setup skills as peers, which is a usability gap for the stated goal. Owner: Product/Planning or pod runtime docs owner.

**Low**: The skill matrix is accurate as an installation/dependency matrix, but it can reinforce the wrong user model unless labeled carefully. The README lists current skills separately and per-role required skills as `codex-cli-auth-setup` and `pod-role-bootstrap`, with `project-bootstrap` described as project-level orchestration (`mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:13`, `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:15`, `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:17`, `mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:21`). `project-bootstrap/SKILL.md` also lists `codex-cli-auth-setup` and `pod-role-bootstrap` as required pod skills (`mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:76`). This is not a runtime contradiction if those are dependencies, but the user-facing docs should state that normal users invoke `project-bootstrap`; the other skills are dependencies or advanced recovery paths. Owner: pod-native skills docs owner.

**SoT Position**

The draft usability interpretation is SoT-backed with one important precision: `project-bootstrap` is the standard workflow/skill entry point, not merely the `project-bootstrap-preflight.sh` script. The SoT supports: clone or install pod artifact, invoke `project-bootstrap`, let the agent run non-secret setup/preflight/Codex auth status/pod-role bootstrap/re-preflight/role checks, and return only human-owned credential/account/live-action blockers.

Do not merge the implementation contracts blindly. The internal skills should remain separate because they have reusable, secret-safe contracts and reports. But the normal setup UX should expose/use `project-bootstrap` as the simple standard entry point. Follow-up should update `16-pod-environment-bootstrap.md` so `codex-cli-auth-setup` and `pod-role-bootstrap` are described as internals/dependencies or advanced recovery steps, and add validator wording so the runbook cannot drift back into a three-peer-step user flow.

`pnpm run validate:repo-operations`, `pnpm run validate:team-doc`, and `node scripts/codex-preflight.mjs --self-test` passed. I did not run mutating smoke scripts.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "contract",
  "scope": {
    "baseline": "a171ff6",
    "target": "working-tree",
    "paths_reviewed": [
      "AGENTS.md",
      "PROJECT_ENVIRONMENT.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md",
      "mobile-app-dev-team/16-pod-environment-bootstrap.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/SKILL.md",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-agent-setup.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh",
      "mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/scripts/pod-bootstrap.sh",
      "scripts/validate-team-doc.mjs",
      "scripts/validate-repo-operations.mjs",
      "scripts/codex-preflight.mjs",
      "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "evals/local-harness/preflight/fixtures/pod.valid-codex-node-wrapper.json",
      "evals/local-harness/preflight/fixtures/pod.valid-codex-node-wrapper-x86_64.json"
    ]
  },
  "findings": [
    {
      "severity": "MEDIUM",
      "summary": "The SoT supports project-bootstrap as the user-facing orchestration workflow, but 16-pod-environment-bootstrap.md still presents codex-cli-auth-setup and pod-role-bootstrap as peer manual Zero-To-Ready steps after project-bootstrap, creating a setup usability gap.",
      "source_refs": [
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:8",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:10",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:160",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:197",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:203",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:209",
        "mobile-app-dev-team/16-pod-environment-bootstrap.md:276",
        "mobile-app-dev-team/16-pod-environment-bootstrap.md:283",
        "mobile-app-dev-team/16-pod-environment-bootstrap.md:291"
      ],
      "owner": "Product/Planning or pod runtime docs owner"
    },
    {
      "severity": "LOW",
      "summary": "The pod-native skill README correctly lists separate reusable skills, but without explicit dependency/internal wording it can reinforce the same peer-step mental model for setup users.",
      "source_refs": [
        "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:13",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:15",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:17",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/README.md:21",
        "mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/SKILL.md:76"
      ],
      "owner": "pod-native skills docs owner"
    }
  ],
  "checks_reviewed": [
    {
      "command": "pnpm run validate:repo-operations",
      "status": "PASS",
      "evidence": "Exited 0; output: Validated repo operations policy ownership."
    },
    {
      "command": "pnpm run validate:team-doc",
      "status": "PASS",
      "evidence": "Exited 0; output: Validated current mobile-app-dev-team managed docs."
    },
    {
      "command": "node scripts/codex-preflight.mjs --self-test",
      "status": "PASS",
      "evidence": "Exited 0; output: codex-preflight self-test passed."
    },
    {
      "command": "evals/skills/project-bootstrap-agent-setup-smoke.sh",
      "status": "NOT_APPLICABLE",
      "evidence": "Not run in this read-only review because the smoke script creates temporary files; source inspection confirms it covers agent setup, Codex precheck ordering, MCP registration, role report generation, and status-only preflight cases."
    },
    {
      "command": "pnpm turbo run lint test",
      "status": "NOT_APPLICABLE",
      "evidence": "This was a read-only SoT usability review, not a final implementation gate run."
    },
    {
      "command": "pnpm run test:local-harness",
      "status": "NOT_APPLICABLE",
      "evidence": "This was a read-only SoT usability review; local harness remains required before PR readiness for runtime changes."
    }
  ],
  "residual_risks": [
    "The review did not execute live OpenClaw/OrbStack, Codex auth, MCP registration, pod checkout, mobile-mcp, EAS, Stitch, Railway, GitHub, Jira, or Confluence behavior.",
    "Working tree contains uncommitted and untracked runtime/preflight/evidence files; PR readiness still requires a scoped branch, committed test fixtures where intended, runtime gates, and final reviewer evidence.",
    "The correct user-facing position is source-backed, but the runbook wording still needs follow-up before claiming the docs deliver the intended simple setup UX."
  ],
  "next_action": "fix_findings"
}
```