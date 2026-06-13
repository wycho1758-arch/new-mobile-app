Findings:

1. **Medium: 필수 MCP 승격 계획에 고정된 SoT/핀ning 경로가 빠져 있습니다.**
   계획은 `expo`, `atlassian`, `playwright`를 agent-owned 등록 대상으로 승격하지만, 현재 `.codex/config.toml`에는 `mobile-mcp`, `serena`, `stitch`만 고정되어 있고, 문서의 `atlassian`/`playwright` 등록 명령은 패키지 버전이 고정되어 있지 않습니다. repo-required MCP는 고정된 명령을 써야 한다는 SoT와 충돌할 수 있습니다.
   Sources: `.evidence/reviews/20260613-project-bootstrap-required-env-plan.md:46`, `.evidence/reviews/20260613-project-bootstrap-required-env-plan.md:55`, `docs/CODEX_MCP_ENVIRONMENT.md:78`, `.codex/config.toml:1`, `docs/CODEX_MCP_ENVIRONMENT.md:357`, `docs/CODEX_MCP_ENVIRONMENT.md:406`.

2. **Medium: Checkpoint 1이 “각 checkpoint별 reviewer 점검” 요구를 강제하지 않습니다.**
   계획은 Checkpoint 1에서 “reviewer/advisor check … if needed; at minimum record command output”라고 되어 있어, 사용자가 요구한 checkpoint별 reviewer 점검과 `$wm`의 리뷰 증거 원칙을 만족한다고 보기 어렵습니다. 테스트 추가 후 실패 의도 점검도 명시적으로 reviewer evidence를 남기도록 바꿔야 합니다.
   Sources: `.evidence/reviews/20260613-project-bootstrap-required-env-plan.md:72`, `.evidence/reviews/20260613-project-bootstrap-required-env-plan.md:75`, `.agents/skills/wm/SKILL.md:31`, `.agents/skills/wm/SKILL.md:63`.

```json
{
  "verdict": "NO_GO",
  "reviewer": "wm-implementation-reviewer",
  "mode": "plan",
  "scope": ".evidence/reviews/20260613-project-bootstrap-required-env-plan.md against AGENTS.md, PROJECT_ENVIRONMENT.md, docs/CODEX_MCP_ENVIRONMENT.md, .codex/config.toml, and project-bootstrap files",
  "findings": [
    {
      "severity": "Medium",
      "title": "Required MCP promotion lacks a pinned repo SoT/config path",
      "source_refs": [
        ".evidence/reviews/20260613-project-bootstrap-required-env-plan.md:46",
        ".evidence/reviews/20260613-project-bootstrap-required-env-plan.md:55",
        "docs/CODEX_MCP_ENVIRONMENT.md:78",
        ".codex/config.toml:1",
        "docs/CODEX_MCP_ENVIRONMENT.md:357",
        "docs/CODEX_MCP_ENVIRONMENT.md:406"
      ],
      "impact": "The plan may promote atlassian/playwright/expo to required readiness while registering mutable or not repo-pinned MCP definitions, which conflicts with the repo MCP safety rule."
    },
    {
      "severity": "Medium",
      "title": "Checkpoint 1 does not require reviewer evidence",
      "source_refs": [
        ".evidence/reviews/20260613-project-bootstrap-required-env-plan.md:72",
        ".evidence/reviews/20260613-project-bootstrap-required-env-plan.md:75",
        ".agents/skills/wm/SKILL.md:31",
        ".agents/skills/wm/SKILL.md:63"
      ],
      "impact": "The plan does not fully satisfy the user's checkpoint-by-checkpoint reviewer requirement before implementation proceeds."
    }
  ],
  "checks_reviewed": [
    {
      "check": "SoT inputs are named and relevant",
      "status": "PASS"
    },
    {
      "check": "TDD-first implementation path",
      "status": "PASS"
    },
    {
      "check": "Required environment intent except EAS",
      "status": "PASS_WITH_FINDINGS"
    },
    {
      "check": "Pinned MCP/config safety",
      "status": "FAIL"
    },
    {
      "check": "Reviewer checkpoints",
      "status": "FAIL"
    },
    {
      "check": "Secret and human-gate boundaries",
      "status": "PASS"
    }
  ],
  "residual_risks": [
    "Railway and gcloud installation authority remains platform-dependent and should stay blocker-guided unless an approved non-secret install source is added to SoT.",
    "node_repl remains Codex app/plugin-owned and should not be synthesized from user-local paths."
  ],
  "next_action": "Update the plan before implementation: add a pinned/approved SoT strategy for newly required MCP registrations, and make every checkpoint require persisted reviewer evidence. Re-run this plan review afterward."
}
```
