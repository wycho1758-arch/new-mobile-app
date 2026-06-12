Reading additional input from stdin...
OpenAI Codex v0.137.0
--------
workdir: /Users/tw.kim/Documents/AGA/test/new-mobile-app
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019eb108-c188-7d51-b767-aa5542536d5e
--------
user
You are reviewer(xhigh) for a WonderMove mobile repo review-only task. Do not edit files. Do not inspect or print secrets. Do not delegate further.

User asked to re-check the updated plan against repo SoT and then final-report what is applicable vs not applicable.

Repo cwd: /Users/tw.kim/Documents/AGA/test/new-mobile-app
Primary plan: team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md
Session plan: /Users/tw.kim/.claude/plans/luminous-snacking-moler.md
External evidence file: .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md
SoT files reviewed: AGENTS.md, PROJECT_ENVIRONMENT.md, REPO_OPERATIONS.md, team-doc/mobile-app-dev-team/README.md, team-doc/mobile-app-dev-team/99-source-map.md

Important verified observations from the first-pass review:
- AGENTS.md: TDD required, no external platform/runtime repo modifications, mobile-mcp local/serial only, local harness does not prove external service, branch-protection, release-submission, or platform runtime state.
- PROJECT_ENVIRONMENT.md: repo package manager SoT is pnpm@9.15.9; RN Web is not native proof; native completion and Maestro/mobile-mcp remain separate; Codex runtime uses SoT-grounded $wm and reviewer evidence; headless helper is configured high, not xhigh.
- REPO_OPERATIONS.md: team-doc policy ownership, pod-native OpenClaw runtime path separation, no token/secret printing, local validation does not prove external platform state.
- Updated 13 plan now says boram pod has pnpm 10.33.3 but repo pin is pnpm@9.15.9, so issue is pin mismatch rather than absence; canary is inferred only; cloud CLI, Maestro, adb/emulator, Java, and KVM absence remains valid. Evidence path is .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md.
- Updated 13 plan adds E-0: offline repo work can proceed; Part D ops, live cloud validation, and multi-pod rollout require human/ops approval; automatic store submission, release gate weakening, Gatekeeper as an LLM/pod, RN Web as native replacement, and local validation as pod proof are always forbidden.
- Updated 13 plan says Part D is ops annex only before approval; PR5 is split into offline and live acceptance; .maestro/home.yml appId {{ANDROID_PACKAGE}} is generation-time placeholder and needs parameterization.
- Session plan is outside repo under ~/.claude/plans. It is an execution plan for offline repo work only and explicitly forbids external platform/k8s/GitHub settings changes, secrets, cloud/release auth commands, live proof claims, and native completion claims. It uses validator-first/TDD.
- Worktree currently has many unrelated/pre-existing modified/untracked files. The 13 plan is untracked in git status. README and 99-source-map have tracked diffs registering 12/13/ref-organization.
- I re-ran pnpm run test:runtime in this current workspace. It FAILED at validate:repo-operations, after validate-runtime-artifacts and codex-headless-review self-test passed. Failure items are archive-related: REPO_OPERATIONS.md missing TEAM_DOC_ARCHIVE_MANIFEST.json / TEAM_DOC_ARCHIVE_BUNDLE.jsonl / root-owned archive metadata/content / delete-ready terms, missing archive files, scripts/validate-team-doc-archive.mjs missing required terms and containing forbidden duplicated listFiles/requiredArchiveDirs terms. This contradicts the user-provided validation claim for the current workspace.

Review questions:
1. Are the previous HIGH/NO_GO issues from the feedback resolved in the updated 13 plan?
2. What is applicable now, what is applicable only after human/ops approval, and what must not be applied?
3. Is the session execution plan acceptable as a non-SoT session roadmap for this repo purpose?
4. Does the current test:runtime failure change the final verdict or just gate implementation?

Return a concise Korean review with findings first, source-grounded reasoning, and final verdict GO/CONDITIONAL_GO/NO_GO.
2026-06-10T10:16:43.322821Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when AuthRequired(AuthRequiredError { www_authenticate_header: "Bearer error=\"invalid_token\", error_description=\"Token has expired. Please re-authenticate to obtain a new token.\"" })
hook: SessionStart
hook: SessionStart Completed
codex
`wm` 리뷰 경로로 진행하겠습니다. 파일은 읽기 전용으로만 확인하고, 외부/시크릿/위임 없이 SoT와 계획 문서의 현재 문구만 대조하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "TDD|required|mobile-mcp|local harness|external|secret|No hardcoding|pnpm|RN Web|headless|xhigh|high|Maestro|Gatekeeper|OpenClaw|runtime|branch|PR|team-doc|source|archive|test:runtime" AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md team-doc/mobile-app-dev-team/README.md team-doc/mobile-app-dev-team/99-source-map.md team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
team-doc/mobile-app-dev-team/README.md:7:`team-doc/00-source/`는 Confluence 원본 export와 감사 기록을 보존하는 historical source이고, 이 폴더는 실제 운영자가 읽고 유지할 current SoT이다. 기존 source export 파일은 여기서 직접 수정하지 않는다.
team-doc/mobile-app-dev-team/README.md:21:| `10-github-artifact-workflow.md` | pod-isolated role agent의 GitHub PR 산출물 handoff 규칙 |
team-doc/mobile-app-dev-team/README.md:25:| `99-source-map.md` | 근거 파일과 active/historical crosswalk |
team-doc/mobile-app-dev-team/README.md:29:- 현재 repo 기준 사실은 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `.agents/skills`, `.codex/agents`를 우선한다.
team-doc/mobile-app-dev-team/README.md:30:- `team-doc/10-structured/`는 정리된 참조 자료로 사용하되, 실제 repo와 다르면 current repo 파일을 우선한다.
team-doc/mobile-app-dev-team/README.md:31:- OpenClaw pod-native skill source는 `09-pod-native-openclaw-skills/`에서 관리한다.
team-doc/mobile-app-dev-team/README.md:32:- Pod-isolated role agent 산출물은 `10-github-artifact-workflow.md`에 따라 GitHub branch/commit/PR과 `docs/plans/work-units/<work-unit-id>/`로 handoff한다.
team-doc/mobile-app-dev-team/README.md:33:- Gatekeeper는 non-LLM deterministic required check이다. Gatekeeper SOUL.md는 만들지 않는다.
team-doc/mobile-app-dev-team/99-source-map.md:7:| `AGENTS.md` | Required repo rules, runtime paths, gate expectations, constraints |
team-doc/mobile-app-dev-team/99-source-map.md:8:| `REPO_OPERATIONS.md` | Root-owned repo-wide operating policy, policy ownership map, source/archive rules, validator responsibility model |
team-doc/mobile-app-dev-team/99-source-map.md:9:| `PROJECT_ENVIRONMENT.md` | Current Expo/RN/API/Codex runtime facts |
team-doc/mobile-app-dev-team/99-source-map.md:12:| `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md` | Current pod-isolated GitHub artifact handoff workflow |
team-doc/mobile-app-dev-team/99-source-map.md:13:| `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md` | Goal and checkpoint plan for the reusable reference organization layer |
team-doc/mobile-app-dev-team/99-source-map.md:14:| `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` | Improvement plan for running the team as OpenClaw cloud pods with autonomous mobile-app E2E |
team-doc/mobile-app-dev-team/99-source-map.md:15:| `team-doc/mobile-app-dev-team/ref-organization/` | Reference organization reusable guidance, current-project examples, and migration crosswalk |
team-doc/mobile-app-dev-team/99-source-map.md:16:| `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md` | File-by-file migration plan from `team-doc/10-structured/**` into `ref-organization/` |
team-doc/mobile-app-dev-team/99-source-map.md:18:| `team-doc/00-source/.../01-2-조직-구성과-역할-1373765682.md` | Original 6 LLM + Gatekeeper role source |
team-doc/mobile-app-dev-team/99-source-map.md:19:| `team-doc/00-source/.../01-5-soul-md-템플릿-1373700138/` | Historical SOUL.md source pages |
team-doc/mobile-app-dev-team/99-source-map.md:25:| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | Historical skill matrix input; current active skill status is validated from `.agents/skills/` and `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`. |
team-doc/mobile-app-dev-team/99-source-map.md:26:| `team-doc/10-structured/03-skills/case-coverage-registry.md` | Historical Case A-H process input; use `ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` for reusable guidance. |
team-doc/mobile-app-dev-team/99-source-map.md:34:| Mobile Architect / Technical Lead | Mobile Architect | Active display title | Technical architecture, route/state, runtime, API impact, and releaseability review owner. |
team-doc/mobile-app-dev-team/99-source-map.md:38:| Release Gatekeeper (System) | Gatekeeper | Non-LLM deterministic gate | No SOUL.md, no custom agent, no human approval replacement. |
team-doc/mobile-app-dev-team/99-source-map.md:44:| `mobile-prd-to-execution` | historical source name | Current repo adapter is `po-prd-to-execution`. |
team-doc/mobile-app-dev-team/99-source-map.md:45:| `mobile-requirement-office-hours` | historical source name | Current repo adapter is `po-requirement-office-hours`. |
team-doc/mobile-app-dev-team/99-source-map.md:46:| `mobile-work-unit-planning-and-agent-sprint` | historical source name | Current repo adapter is `po-work-unit-planning-and-agent-sprint`. |
team-doc/mobile-app-dev-team/99-source-map.md:47:| `mobile-planning-completeness-review` | historical source name | Current repo adapter is `po-planning-completeness-review`. |
team-doc/mobile-app-dev-team/99-source-map.md:48:| `mobile-design-handoff` | historical source name | Current repo adapter is `design-mobile-design-handoff`. |
team-doc/mobile-app-dev-team/99-source-map.md:49:| `mobile-api-contract` | historical source name | Do not list as active unless `.agents/skills/mobile-api-contract/SKILL.md` exists. Current active path is `mobile-backend-api-integrator-workflow` plus `packages/contracts`. |
team-doc/mobile-app-dev-team/99-source-map.md:50:| `mobile-qa-release` | historical source name | Do not list as active unless `.agents/skills/mobile-qa-release/SKILL.md` exists. Current active QA skills are `e2e-test` and `qa-railway-workflow`. |
team-doc/mobile-app-dev-team/99-source-map.md:51:| `mobile-gatekeeper` | historical deterministic concept | Not an LLM skill in the current managed docs. Treat as deterministic required-check concept. |
team-doc/mobile-app-dev-team/99-source-map.md:52:| `mobile-project-bootstrap-workflow` | historical/planned source name | No active repo-local skill in current `.agents/skills`. Case A remains human/operator plus Product/Planning coordination. |
team-doc/mobile-app-dev-team/99-source-map.md:56:`team-doc/10-structured/06-codex-runtime/runtime-boundary.md` may omit newer active skills such as `qa-railway-workflow`. When it conflicts with `PROJECT_ENVIRONMENT.md`, `.agents/skills`, or `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`, use current repo files as the stronger source.
team-doc/mobile-app-dev-team/99-source-map.md:61:- Railway/RN Web evidence does not replace native Maestro/mobile-mcp or production release readiness.
team-doc/mobile-app-dev-team/99-source-map.md:63:- Pod-isolated role agents must use GitHub branch/commit/PR artifacts under `docs/plans/work-units/<work-unit-id>/` for durable handoff; shared local storage is not assumed.
AGENTS.md:3:## OpenClaw And Codex Skill Routing
AGENTS.md:5:- Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` using skill-creator structure.
AGENTS.md:6:- Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts; required validators, evals, scripts, and evidence may still be added when the change needs them.
AGENTS.md:8:This repository is the mobile app template runtime for WonderMove mobile agents.
AGENTS.md:13:- TDD required: write or update tests before implementation changes.
AGENTS.md:14:- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
AGENTS.md:15:- No direct push to `main`; use a branch and PR.
AGENTS.md:16:- Do not modify external platform/runtime repositories from this repository.
AGENTS.md:33:- `apps/api/` — optional Hono + Drizzle backend (include only when a new backend is required; see §15 01-8)
AGENTS.md:37:- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
AGENTS.md:38:- `.agents/`, `.codex/`, `evals/`, `scripts/` — Codex runtime layer, maintained through the runtime gates below
AGENTS.md:43:- Environment/runtime changes must keep `PROJECT_ENVIRONMENT.md` and the Confluence update document in sync with actual repo settings.
AGENTS.md:44:- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
AGENTS.md:46:- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.
AGENTS.md:51:- Prefer Maestro `id` selectors over visible-text selectors.
AGENTS.md:52:- Update app code, Jest tests, and Maestro flows together when changing a selector.
AGENTS.md:57:- `pnpm run test:local-harness` validates Codex CLI runtime structure, role boundaries, skill/agent/hook configuration, gatekeeper/evidence fixtures, and best-effort headless Codex smoke.
AGENTS.md:58:- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
AGENTS.md:59:- OpenClaw packaging paths such as `/workspace/skills`, `OPENCLAW_ROOT`, generated agent packages, and OpenClaw package result files are outside the active local harness scope.
AGENTS.md:60:- Dirty worktree state is not a local harness failure condition; runtime edits must remain locally verifiable while in progress.
AGENTS.md:66:pnpm install
AGENTS.md:69:pnpm turbo run lint test
AGENTS.md:71:# Run codex runtime verification (validate / test:hooks)
AGENTS.md:72:pnpm run test:runtime
AGENTS.md:74:# Run full Codex local harness for runtime-related PRs
AGENTS.md:75:pnpm run test:local-harness
AGENTS.md:78:pnpm --filter mobile start
AGENTS.md:81:pnpm --filter @template/api test
AGENTS.md:84:## Conventions & PR Expectations
AGENTS.md:89:- All changes go through a branch + PR. The quality-gate workflow must pass before merge.
AGENTS.md:90:- Codex runtime changes under `.agents/`, `.codex/`, `evals/{skills,agents,hooks,local-harness}/`, or runtime scripts must pass the conditional local harness gate.
AGENTS.md:97:- Do not modify external platform/runtime repositories from this repository.
AGENTS.md:104:Before opening a PR, verify:
AGENTS.md:106:1. Workspace lint and tests pass: `pnpm turbo run lint test`
AGENTS.md:107:2. Codex runtime artifacts are intact: `pnpm run test:runtime`
AGENTS.md:108:3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
AGENTS.md:109:4. For mobile environment/runtime changes, verify `pnpm --filter mobile exec expo install --check`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`, `pnpm --filter mobile run doctor`, and `codex mcp list`
AGENTS.md:110:5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence
REPO_OPERATIONS.md:6:entrypoint, and it does not replace `PROJECT_ENVIRONMENT.md` as the current
REPO_OPERATIONS.md:7:runtime facts document.
REPO_OPERATIONS.md:13:| `AGENTS.md` | Mandatory agent execution rules, constraints, runtime paths, and required gates. |
REPO_OPERATIONS.md:14:| `PROJECT_ENVIRONMENT.md` | Current runtime and environment facts. |
REPO_OPERATIONS.md:16:| `team-doc/mobile-app-dev-team/` | Team, role, process, reference, and migration documentation. |
REPO_OPERATIONS.md:17:| `team-doc/00-source/` | Immutable Confluence source/export evidence. |
REPO_OPERATIONS.md:18:| `team-doc/10-structured/` | Generated or structured reference layer, not current policy owner. |
REPO_OPERATIONS.md:22:`AGENTS.md` for agent instructions, `PROJECT_ENVIRONMENT.md` for runtime facts,
REPO_OPERATIONS.md:28:- Root policy and runtime files are the current canonical layer for repo-wide
REPO_OPERATIONS.md:32:- `team-doc/00-source/` preserves source/export evidence and should not be
REPO_OPERATIONS.md:34:- `team-doc/10-structured/` remains a generated/reference layer until a
REPO_OPERATIONS.md:35:  separately approved migration or archive plan changes that status.
REPO_OPERATIONS.md:37:Do not delete, rewrite, or migrate `team-doc/00-source/` or
REPO_OPERATIONS.md:38:`team-doc/10-structured/` only because scripts or documents reference them.
REPO_OPERATIONS.md:39:Classify each reference first as current invariant, source/export integrity,
REPO_OPERATIONS.md:44:`team-doc/00-source/` is immutable source/export evidence by default. If it is
REPO_OPERATIONS.md:45:ever moved or archived, the change must preserve `pageId`, source version,
REPO_OPERATIONS.md:46:`fetchedAt`, `sourceUrl`, and an explicit archive/sourcePath strategy before
REPO_OPERATIONS.md:49:`team-doc/10-structured/` is generated/reference material by default. It may be
REPO_OPERATIONS.md:55:## OpenClaw And Codex Operational Boundaries
REPO_OPERATIONS.md:57:Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
REPO_OPERATIONS.md:58:and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
REPO_OPERATIONS.md:64:For OpenClaw pods operating on a Codex-managed repository, repository work must
REPO_OPERATIONS.md:73:passwords, or full secret-bearing config contents. Reports must use redacted
REPO_OPERATIONS.md:78:Done requires linked evidence, not status-only prose. For runtime and docs
REPO_OPERATIONS.md:84:Active runtime composition:
REPO_OPERATIONS.md:87:pnpm run validate
REPO_OPERATIONS.md:88:pnpm run validate:repo-operations
REPO_OPERATIONS.md:89:pnpm run validate:team-doc
REPO_OPERATIONS.md:90:pnpm run test:hooks
REPO_OPERATIONS.md:93:`pnpm run test:runtime` must compose those active current team/runtime gate
REPO_OPERATIONS.md:94:checks. It must not include archive/reference corpus validation as a hidden
REPO_OPERATIONS.md:95:runtime requirement.
REPO_OPERATIONS.md:100:pnpm run validate:team-doc-archive
REPO_OPERATIONS.md:103:Run `validate:team-doc-archive` when changing, moving, archiving, regenerating,
REPO_OPERATIONS.md:104:or auditing `team-doc/00-source/`, `team-doc/10-structured/`, `_meta` source
REPO_OPERATIONS.md:106:legacy Confluence-shaped corpus is current team/runtime SoT.
REPO_OPERATIONS.md:108:Runtime path or harness changes must also run `pnpm run test:local-harness`
REPO_OPERATIONS.md:109:unless a source-backed blocker is reported.
REPO_OPERATIONS.md:111:Local validation and local harness evidence prove repo-local rules only. They do
REPO_OPERATIONS.md:112:not prove actual OrbStack/OpenClaw pod execution, Jira or Confluence behavior,
REPO_OPERATIONS.md:113:GitHub branch protection, EAS production submit, or external platform state.
REPO_OPERATIONS.md:122:- `scripts/validate-team-doc.mjs` validates current managed team docs,
REPO_OPERATIONS.md:125:  `team-doc/00-source/` or `team-doc/10-structured/` as active current
REPO_OPERATIONS.md:126:  team/runtime inputs.
REPO_OPERATIONS.md:127:- `scripts/validate-team-doc-archive.mjs` validates archive/reference integrity
REPO_OPERATIONS.md:128:  for `team-doc/00-source/`, `team-doc/10-structured/`, `_meta` source maps,
REPO_OPERATIONS.md:131:- `scripts/generate-team-doc.mjs` is legacy Confluence-shaped corpus generation
REPO_OPERATIONS.md:132:  and migration tooling. It is not current team/runtime validation.
REPO_OPERATIONS.md:136:Future validator changes must keep required gates explicit in `package.json`
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47:pnpm 10.33.3
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:72:- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:78:- Mobile lint/test, `expo install --check`, `expo doctor`, and `codex mcp list` for mobile runtime changes.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:79:- Local `mobile-mcp` visual QA only when simulator/device is available.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:80:- Maestro smoke only when a usable target and executable app id exist.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:81:- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:86:- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:95:- possibly JS-only checks after the repo is cloned/copied and the correct pnpm version is selected
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:104:6. No Maestro CLI.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:107:9. The repo Maestro `appId` is still a generation-time placeholder.
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:122:- Node/pnpm aligned to repo expectations,
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:125:- Maestro CLI,
.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:127:- executable Maestro app-id handling.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:5:이 문서는 boram-\* 샘플과 같은 OpenClaw cloud pod로 6역할 LLM 모바일 개발 조직을 구성하고,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:6:그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:11:- 이 문서는 정책 SoT가 아니다. 충돌 시 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:12:  `REPO_OPERATIONS.md`, `team-doc/mobile-app-dev-team/00-sot-and-principles.md`가 우선한다.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:22:2. **OpenClaw cloud 플랫폼 repo 조사** (외부 플랫폼 repo `openclaw-cloud`):
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:27:   OpenClaw 런타임 + `openai-codex/gpt-5.5` 모델, ConfigMap 주입된
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:29:   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:30:   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:31:   eas-cli/maestro/Android SDK/adb/emulator/Java/mobile-mcp는 부재, `/dev/kvm`도 없다 —
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:44:| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:45:| Codex 런타임 | repo-local skill 11종, custom agent 13종(verdict reviewer + advisory researcher), hook 5종, MCP(mobile-mcp@0.0.58/serena@v1.5.3/stitch@1.3.2/expo) | `.agents/skills/`, `.codex/agents/`, `.codex/config.toml`, `PROJECT_ENVIRONMENT.md` Codex runtime 절 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:46:| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:47:| 핸드오프 | pod-isolated 역할 간 durable handoff는 GitHub branch/commit/PR + `docs/plans/work-units/<work-unit-id>/` 전용 | `10-github-artifact-workflow.md` |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:48:| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:49:| EAS 빌딩블록 | `e2e-test` 프로파일(credential-less Android APK + iOS simulator, `apps/mobile/eas.json:7`)과 cloud Maestro job(`apps/mobile/.eas/workflows/e2e-test-android.yml`의 `type: maestro`, `flow_path: ['.maestro/home.yml']`) 정의 존재 | 해당 파일 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:51:| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:57:| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:59:| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:61:| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:62:| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:63:| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:64:| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs:236-250`이 team-doc 한정 secret 스캔은 수행) | 해당 파일 | 증거 무결성이 규율에만 의존 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:65:| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:74:GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:79:## Part B. Repo 측 개선 (PR 슬라이스 7개, 의존성 순)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:81:모든 PR은 repo 규칙을 따른다: TDD/validator-first(`AGENTS.md` Required rules),
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:83:`PROJECT_ENVIRONMENT.md` CI 절에 **3중 배선**, 계획·증거는 `.evidence/`에 기록.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:85:### PR1 (P0) — Work-unit 상태머신: `status.json`
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:89:  있는 것(`codex-headless-review.mjs`)과 동일한 패턴을 stage 상태로 확장하는 것.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:96:  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:110:      "required_artifacts": ["..."],
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:113:      "handoff": { "branch": "wu/<id>/00-planning", "pr": "<pr-url>" }
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:118:  "evidence_ladder": { "required_level": "eas-maestro", "achieved_level": "rn-web" },
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:125:    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:128:    (`codex-headless-review.mjs`의 envelope validator 재사용) + handoff 링크 필수;
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:133:  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:135:### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:141:  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:155:### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:157:- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:158:  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:166:    reviewer를 `codex-headless-review.mjs`로 실행 → 전이 적용 → commit/push/PR 갱신.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:171:  run-deterministic-checks, skills[], reviewer_required, attempts_remaining)와
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:179:  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:181:### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:190:    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:200:    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:203:  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:204:    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:206:  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:208:### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:213:  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:219:    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:220:      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:221:    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:223:    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:225:    - stage 00에서 Product/Planning이 `status.json.evidence_ladder.required_level` 설정,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:226:      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:229:      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:232:    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:233:    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:236:    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:243:  `validate:team-doc` 통과.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:245:  `EAS_PROJECT_ID`/GitHub-EAS 연동을 승인·주입 → PR에서 `e2e-test-android.yml` 실행 →
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:249:### PR6 (P1) — SoT refresh / drift 자동 검출
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:258:  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:259:    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:262:    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:264:    drift 시 GitHub issue 생성/갱신(비차단 — PR 게이트는 오프라인·결정적 유지).
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:265:- **수용 기준**: 핀을 한 곳만 수정한 mutated fixture에서 실패; PR 게이트 네트워크 무의존.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:267:### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:272:    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:274:  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:275:    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:276:  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:279:    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:280:- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:287:### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:294:| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:296:| `wm-qa` | QA/Release | agent-mobile **full** | **4 CPU / 8Gi** | Playwright 스크린샷 증거 + EAS/Maestro cloud 트리거 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:303:- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:304:  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:308:  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:317:- `SOUL.md`: `02-role-souls/<role>-soul.md` 그대로 (runtime template note 준수)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:323:  "로컬 파일/채팅으로 핸드오프 금지 — push된 branch/PR + NATS 신호만 유효"
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:330:| 전체 6 pod | `OPENAI_CODEX_AUTH_JSON`(boram 검증 패턴), `GITHUB_TOKEN`(repo 한정 fine-grained; 역할별 bot 계정 분리 권장 — PR 리뷰/승인 귀속성) |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:331:| `wm-qa`만 | `EXPO_TOKEN`(EAS robot, `infra/clawpod/secret.example.yaml` 패턴), Railway 헬스체크용 read 토큰 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:336:`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5).
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:344:- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:345:  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:348:  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:350:  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:351:- `lite` 변형(po/arch/api용): base lite + pnpm + gh만
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:356:  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:364:  1. PR opened/synchronized + label `next:<role>` → 해당 역할 pod 룸으로 라우팅
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:366:  3. PR merged (`wu/*`) → `wm-po` (stage 전진/종결)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:374:   `status.json` 초기화, `evidence_ladder.required_level` 설정, PR(label `next:design`)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:378:5. `wm-mobile-dev` → `apps/mobile` 구현(TDD) → RN Web Playwright 자가 검증 → 코드 PR
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:379:6. `wm-qa` (PR webhook으로 wake) → in-pod Playwright RN Web 증거 →
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:380:   `EXPO_TOKEN`으로 EAS cloud build + cloud Maestro 트리거 → `ingest-eas-evidence.mjs` →
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:382:7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:383:8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:389:| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:390:| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:391:| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:393:| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:394:| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:395:| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:402:  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:403:  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:404:- **정체 감지**: 이 repo의 scheduled workflow(cron)가 무활동 N시간 초과 `wu/*` PR에
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:405:  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:413:## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:418:Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:423:   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:424:   headless로 동작하고 Playwright가 통과; `eas whoami`가 robot token으로 성공;
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:432:5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:445:- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:446:  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:449:  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:450:  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:452:  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:453:  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:454:  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:460:| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:461:| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:462:| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:463:| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:465:| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:466:| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:469:3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:470:**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:478:- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:479:- 모든 required check green, `06-gatekeeper/`는 CI 전사만 포함
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:483:`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.
team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md:488:  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
PROJECT_ENVIRONMENT.md:5:This file is the root source for the current project environment and runtime settings. Keep it in sync when changing package versions, Expo config, NativeWind config, Codex runtime files, CI gates, EAS workflows, required environment variables, or the Codex MCP/CLI setup guide at `docs/CODEX_MCP_ENVIRONMENT.md`.
PROJECT_ENVIRONMENT.md:9:- Package manager: `pnpm@9.15.9` from root `package.json`.
PROJECT_ENVIRONMENT.md:10:- Workspace packages: `apps/*` and `packages/*` from `pnpm-workspace.yaml`.
PROJECT_ENVIRONMENT.md:13:  - `pnpm run test:runtime`
PROJECT_ENVIRONMENT.md:14:  - `pnpm turbo run lint test`
PROJECT_ENVIRONMENT.md:15:  - `pnpm run test:local-harness` for Codex runtime changes.
PROJECT_ENVIRONMENT.md:39:  - `extra.eas.projectId` reads `EAS_PROJECT_ID`.
PROJECT_ENVIRONMENT.md:41:  - `pnpm --filter mobile start`
PROJECT_ENVIRONMENT.md:42:  - `pnpm --filter mobile ios`
PROJECT_ENVIRONMENT.md:43:  - `pnpm --filter mobile android`
PROJECT_ENVIRONMENT.md:44:  - `pnpm --filter mobile run doctor`
PROJECT_ENVIRONMENT.md:45:  - `pnpm --filter mobile lint`
PROJECT_ENVIRONMENT.md:46:  - `pnpm --filter mobile test`
PROJECT_ENVIRONMENT.md:47:  - `pnpm --filter mobile e2e`
PROJECT_ENVIRONMENT.md:48:  - `pnpm --filter mobile e2e:web`
PROJECT_ENVIRONMENT.md:49:  - `pnpm --filter mobile web`
PROJECT_ENVIRONMENT.md:58:- Browser install command: `pnpm --filter mobile exec playwright install chromium`.
PROJECT_ENVIRONMENT.md:59:- Browser E2E command: `pnpm --filter mobile e2e:web`.
PROJECT_ENVIRONMENT.md:61:- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
PROJECT_ENVIRONMENT.md:62:- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
PROJECT_ENVIRONMENT.md:63:- RN Web release E2E requires a deployed backend API URL through public client config:
PROJECT_ENVIRONMENT.md:64:  - `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web`
PROJECT_ENVIRONMENT.md:79:  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
PROJECT_ENVIRONMENT.md:80:  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
PROJECT_ENVIRONMENT.md:88:  - Roll back to the last passing NativeWind v4 / Tailwind CSS v3 baseline if SDK 56 compatibility checks, Metro bundling, Jest, native run smoke, or Maestro/mobile visual QA fail because of NativeWind v5 and cannot be fixed in the same PR.
PROJECT_ENVIRONMENT.md:89:  - Do not promote a production release with unresolved NativeWind v5 rendering, bundling, or native runtime defects.
PROJECT_ENVIRONMENT.md:95:  - root pnpm override pins `lightningcss` to `1.30.1`.
PROJECT_ENVIRONMENT.md:103:  - `apps/mobile/babel.config.js` uses `babel-preset-expo` for runtime builds and adds `react-native-css/babel` only when `api.env('test')` is true so Jest can exercise className translation outside Metro.
PROJECT_ENVIRONMENT.md:113:Public JS runtime variables are parsed by `apps/mobile/env.ts`; app config variables are read directly by `apps/mobile/app.config.ts`.
PROJECT_ENVIRONMENT.md:117:- Public JS runtime variables:
PROJECT_ENVIRONMENT.md:119:  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
PROJECT_ENVIRONMENT.md:120:  - `EXPO_PUBLIC_API_URL`: required URL.
PROJECT_ENVIRONMENT.md:122:  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
PROJECT_ENVIRONMENT.md:123:  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
PROJECT_ENVIRONMENT.md:124:  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
PROJECT_ENVIRONMENT.md:125:  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
PROJECT_ENVIRONMENT.md:127:  - `EAS_PROJECT_ID`: optional UUID.
PROJECT_ENVIRONMENT.md:130:## EAS And Maestro
PROJECT_ENVIRONMENT.md:142:- Maestro flows: `apps/mobile/.maestro`.
PROJECT_ENVIRONMENT.md:143:- Native E2E command: `pnpm --filter mobile e2e`.
PROJECT_ENVIRONMENT.md:148:- Prefer Maestro `id` selectors over visible text.
PROJECT_ENVIRONMENT.md:155:  - `pnpm --filter @template/api dev`
PROJECT_ENVIRONMENT.md:156:  - `pnpm --filter @template/api build`
PROJECT_ENVIRONMENT.md:157:  - `pnpm --filter @template/api lint`
PROJECT_ENVIRONMENT.md:158:  - `pnpm --filter @template/api test`
PROJECT_ENVIRONMENT.md:160:  - `DATABASE_URL`: required URL.
PROJECT_ENVIRONMENT.md:162:  - `API_BEARER_TOKEN`: required secret.
PROJECT_ENVIRONMENT.md:173:  - Railway runtime variables include `DATABASE_URL`, `API_BEARER_TOKEN`, `PORT=3000`, `API_PORT=3000`, `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, and `RAILWAY_HEALTHCHECK_PATH=/readyz`.
PROJECT_ENVIRONMENT.md:174:  - Do not print or commit Railway secret values. `API_BEARER_TOKEN` was rotated after setup output exposed an earlier generated value.
PROJECT_ENVIRONMENT.md:181:- This package is the single source of truth for API request/response types and shared domain schemas.
PROJECT_ENVIRONMENT.md:182:- Runtime export: `./dist/index.js`, with TypeScript types sourced from `./src/index.ts`.
PROJECT_ENVIRONMENT.md:183:- Build command: `pnpm --filter @template/contracts build`.
PROJECT_ENVIRONMENT.md:184:- Test command: `pnpm --filter @template/contracts test`.
PROJECT_ENVIRONMENT.md:185:- API Docker builds must build `@template/contracts` before `@template/api` so deployed Node runtimes do not import TypeScript source from `node_modules`.
PROJECT_ENVIRONMENT.md:191:    - source: `expo/skills`
PROJECT_ENVIRONMENT.md:206:  - The `$wm` headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.
PROJECT_ENVIRONMENT.md:207:  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
PROJECT_ENVIRONMENT.md:208:  - `$qa-railway-workflow` is the repo QA skill for Railway CLI install/login/project/service/database/variable/domain/deploy/status/log/health workflows, redacted Railway evidence, RN Web E2E API URL handoff, and `PROJECT_ENVIRONMENT.md` synchronization. It does not implement app, backend, contract, migration, or mobile UI fixes.
PROJECT_ENVIRONMENT.md:209:  - Product/Planning repo-local Codex adapters use required `po-*` slugs:
PROJECT_ENVIRONMENT.md:210:    - `po-requirement-office-hours` maps source skill `mobile-requirement-office-hours` page `1374519364`.
PROJECT_ENVIRONMENT.md:211:    - `po-work-unit-planning-and-agent-sprint` maps source skill `mobile-work-unit-planning-and-agent-sprint` page `1374650456`.
PROJECT_ENVIRONMENT.md:212:    - `po-prd-to-execution` maps source skill `mobile-prd-to-execution` page `1373634562`.
PROJECT_ENVIRONMENT.md:213:    - `po-planning-completeness-review` maps source skill `mobile-planning-completeness-review` page `1374519387`.
PROJECT_ENVIRONMENT.md:215:  - Design repo-local Codex adapters use required `design-*` slugs:
PROJECT_ENVIRONMENT.md:216:    - `design-mobile-design-handoff` maps source skill `mobile-design-handoff` page `1373765661`, Design SOUL page `1373765702`, and Design Codex practice page `1374290207`.
PROJECT_ENVIRONMENT.md:217:    - `design-stitch-mcp-operating-rules` defines reusable Stitch MCP execution rules for Design handoff work and maps the same Design source/practice pages.
PROJECT_ENVIRONMENT.md:219:    - P0/P1 Product/Planning approvals are scope/evidence approvals for PRD fit, non-goals, evidence readiness, and human-gate routing. They are not Design quality approvals and do not move selected-option ownership out of Design.
PROJECT_ENVIRONMENT.md:233:  - legacy `mobile-*` agents remain available for other runtime/eval surfaces, but `$wm` reviewer routing and `scripts/codex-headless-review.mjs` allow only the dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only agents listed above.
PROJECT_ENVIRONMENT.md:237:- Root Claude runtime artifacts are not part of the active Codex runtime:
PROJECT_ENVIRONMENT.md:241:  - `scripts/validate-runtime-artifacts.mjs` rejects these root paths. Third-party files with the same names under ignored dependency directories are outside this policy.
PROJECT_ENVIRONMENT.md:243:  - `mobile-mcp`
PROJECT_ENVIRONMENT.md:245:  - args: `-y @mobilenext/mobile-mcp@0.0.58`
PROJECT_ENVIRONMENT.md:246:  - local visual QA/device automation is required for mobile UI/runtime checks when a simulator or device is available.
PROJECT_ENVIRONMENT.md:247:  - it is excluded from required CI gates.
PROJECT_ENVIRONMENT.md:258:  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
PROJECT_ENVIRONMENT.md:266:  - this does not replace `mobile-mcp` for local visual QA/device automation.
PROJECT_ENVIRONMENT.md:268:  - `scripts/validate-runtime-artifacts.mjs`
PROJECT_ENVIRONMENT.md:269:    - The root `validate` package script removes transient `.claude-state` before running this validator, while the validator itself still rejects root Claude runtime artifacts.
PROJECT_ENVIRONMENT.md:270:  - `scripts/codex-headless-review.mjs`
PROJECT_ENVIRONMENT.md:271:    - Codex-only read-only helper: `codex -a never exec -m gpt-5.5 -c 'model_reasoning_effort="high"' -s read-only`.
PROJECT_ENVIRONMENT.md:273:    - optional machine-readable reviewer verdict validation: `node scripts/codex-headless-review.mjs --json-envelope --agent <verdict-reviewer> --prompt <text-or-file> --out <path>`.
PROJECT_ENVIRONMENT.md:275:    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
PROJECT_ENVIRONMENT.md:289:  - `pnpm run test:runtime`
PROJECT_ENVIRONMENT.md:290:  - `pnpm turbo run lint test`
PROJECT_ENVIRONMENT.md:291:- Does not run `mobile-mcp`; mobile device automation remains a local QA gate.
PROJECT_ENVIRONMENT.md:292:- Runs `pnpm run test:local-harness` when these paths change:
PROJECT_ENVIRONMENT.md:296:  - `scripts/{validate-runtime-artifacts,codex-headless-review,test-hooks,test-local-harness,clean-tree-guard,codex-preflight}.mjs`
PROJECT_ENVIRONMENT.md:298:  - `PROJECT_ENVIRONMENT.md`
PROJECT_ENVIRONMENT.md:302:  - `pnpm-lock.yaml`
PROJECT_ENVIRONMENT.md:306:- Do not restore OpenClaw packaging scripts or generated package results unless a new source-of-truth explicitly reintroduces that runtime.
PROJECT_ENVIRONMENT.md:308:- Do not add secrets, customer-specific identifiers, or production API URLs to the repo.

hook: PostToolUse
exec
/bin/zsh -lc 'git status --short -- AGENTS.md PROJECT_ENVIRONMENT.md REPO_OPERATIONS.md team-doc/mobile-app-dev-team/README.md team-doc/mobile-app-dev-team/99-source-map.md team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
 M PROJECT_ENVIRONMENT.md
 M REPO_OPERATIONS.md
 M team-doc/mobile-app-dev-team/99-source-map.md
 M team-doc/mobile-app-dev-team/README.md
?? team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "sed -n '1,240p' .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "sed -n '1,260p' team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
# Orbstack Boram Linux SoT Check

- Date: 2026-06-09
- Scope: check whether local Orbstack `boram-*` pod can be used for Linux/Android E2E verification.
- Result: Linux pod exists, but it is not currently an Android local E2E verification environment.

## Local Kubernetes Check

Current Kubernetes context:

```text
orbstack
```

Matching pod:

```text
clawpod/boram-vf7sbm-agent-0   2/2   Running
```

Pod containers:

```text
agent
ontology-bridge
```

Pod details:

- Namespace: `clawpod`
- Node: `orbstack`
- Pod IP: `192.168.194.120`
- Workload: `StatefulSet/boram-vf7sbm-agent`
- `agent` container image: `clawpod/agent:local`
- `ontology-bridge` container image: `clawpod-ontology-bridge:latest`
- `agent` mounts `/workspace` as RW PVC.
- `ontology-bridge` mounts `/workspace` as RO.

## Container Environment Check

`agent` container:

```text
Linux boram-vf7sbm-agent-0 ... aarch64 GNU/Linux
Ubuntu 24.04.4 LTS
node v22.22.2
pnpm 10.33.3
git version 2.43.0
no /dev/kvm
java: not found
adb: not found
emulator: not found
maestro: not found
```

`ontology-bridge` container:

```text
Linux boram-vf7sbm-agent-0 ... aarch64
Alpine Linux 3.23.3
node v22.22.1
no /dev/kvm
java: not found
adb: not found
emulator: not found
maestro: not found
```

Workspace check:

- `/workspace/projects` exists, but no checked-out `new-mobile-app` repo was found there.
- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.

## SoT Comparison

Repo SoT requires:

- Mobile lint/test, `expo install --check`, `expo doctor`, and `codex mcp list` for mobile runtime changes.
- Local `mobile-mcp` visual QA only when simulator/device is available.
- Maestro smoke only when a usable target and executable app id exist.
- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.

Existing repo evidence also says:

- Android/Ubuntu can cover Android QA only when Android SDK, platform tools, KVM, and device/emulator prerequisites are configured.
- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.

## Assessment

The Boram pod is usable as a general Linux execution container for limited tasks:

- shell commands
- Node 22 execution
- git operations
- possibly JS-only checks after the repo is cloned/copied and the correct pnpm version is selected

The Boram pod is not currently usable for Android local E2E:

1. No `/dev/kvm`.
2. CPU architecture is `aarch64`.
3. No Android SDK/platform tools.
4. No Android Emulator.
5. No Java 17.
6. No Maestro CLI.
7. No Android device/emulator target.
8. The current project repo is not mounted or cloned into `/workspace/projects`.
9. The repo Maestro `appId` is still a generation-time placeholder.

## Decision

Using the Boram pod does not solve the Android E2E blocker today.

It can become useful for:

- deterministic Linux checks after repo checkout,
- EAS cloud build/workflow orchestration if EAS auth and public client config are provided,
- agent-runner style tasks that do not require local Android emulator/device access.

It should not be treated as local Android E2E evidence unless the pod is redesigned to include:

- a checked-out repo workspace,
- Node/pnpm aligned to repo expectations,
- Java 17+,
- Android SDK/platform tools,
- Maestro CLI,
- a usable Android device path, such as USB device forwarding or a separate emulator host,
- executable Maestro app-id handling.

For emulator-based Android E2E, this pod also needs a real virtualization/device strategy. Merely being a Linux pod is not enough.

 succeeded in 0ms:
# Pod Organization E2E Improvement Plan

## 목적

이 문서는 boram-\* 샘플과 같은 OpenClaw cloud pod로 6역할 LLM 모바일 개발 조직을 구성하고,
그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
모바일 앱 개발 lifecycle을 **무인으로(E2E)** 수행할 수 있게 만들기 위한 상세 개선 계획이다.

- 문서 분류: 현재 프로젝트 기준 improvement plan (09-, 11-, 12- 계획 문서와 동일한 계층)
- 소유 역할: Product/Planning (계획), Mobile Architect (기술 검토), QA/Release (검증 경로)
- 이 문서는 정책 SoT가 아니다. 충돌 시 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
  `REPO_OPERATIONS.md`, `team-doc/mobile-app-dev-team/00-sot-and-principles.md`가 우선한다.

## 조사 방법과 근거 출처

이 계획은 다음 세 가지 검증된 조사에 기반한다.

1. **이 repo 전수 조사**: root 정책 문서, `.agents/skills`(11개), `.codex/agents`(13개),
   `.codex/hooks`(5개), `scripts/` validator 9종, `.github/workflows/quality-gate.yml`,
   `apps/mobile`, `apps/api`, `packages/contracts`, `infra/clawpod/`,
   `docs/plans/work-units/sample-role-handoff/`, `.evidence/` 구조.
2. **OpenClaw cloud 플랫폼 repo 조사** (외부 플랫폼 repo `openclaw-cloud`):
   admin API의 agent 생성 플로우(agent-orchestrator: ConfigMap/Secret/Service/StatefulSet 생성),
   pod entrypoint 14단계 초기화, NATS JetStream 메시징(`CHAT_MESSAGES.{roomId}`),
   A2A MCP 서버(:18789), webhook gateway(GitHub adapter 포함 10종), agent 이미지 구성.
3. **live 샘플 pod 실측** (OrbStack k8s, namespace `clawpod`, `boram-vf7sbm-agent-0`):
   OpenClaw 런타임 + `openai-codex/gpt-5.5` 모델, ConfigMap 주입된
   SOUL.md/AGENTS.md/TOOLS.md/IDENTITY.md, `/workspace/skills`(codex-cli-auth-setup 포함),
   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
   eas-cli/maestro/Android SDK/adb/emulator/Java/mobile-mcp는 부재, `/dev/kvm`도 없다 —
   checked-in 증거: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`.
   canary pod도 동일 구성으로 추정되나 repo에 직접 증거가 남아 있는 것은 boram이다.
   `~/.codex/auth.json` 존재(Secret `OPENAI_CODEX_AUTH_JSON` 주입).

---

## Part A. 현재 상태 진단

### A-1. 이미 동작이 검증된 것

| 영역 | 검증된 사실 | 근거 |
| --- | --- | --- |
| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
| Codex 런타임 | repo-local skill 11종, custom agent 13종(verdict reviewer + advisory researcher), hook 5종, MCP(mobile-mcp@0.0.58/serena@v1.5.3/stitch@1.3.2/expo) | `.agents/skills/`, `.codex/agents/`, `.codex/config.toml`, `PROJECT_ENVIRONMENT.md` Codex runtime 절 |
| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
| 핸드오프 | pod-isolated 역할 간 durable handoff는 GitHub branch/commit/PR + `docs/plans/work-units/<work-unit-id>/` 전용 | `10-github-artifact-workflow.md` |
| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
| EAS 빌딩블록 | `e2e-test` 프로파일(credential-less Android APK + iOS simulator, `apps/mobile/eas.json:7`)과 cloud Maestro job(`apps/mobile/.eas/workflows/e2e-test-android.yml`의 `type: maestro`, `flow_path: ['.maestro/home.yml']`) 정의 존재 | 해당 파일 |
| Pod 플랫폼 | agent 1개 = ConfigMap + Secret + Service + StatefulSet(+ `/workspace` 10Gi PVC) 패턴, NATS 룸 구독, A2A, webhook gateway 라우팅 — live pod로 27시간+ 무중단 실측 | 플랫폼 repo + live pod 실측 |
| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |

### A-2. 검증된 갭 (개선 대상)

| # | 갭 | 근거 | 영향 |
| --- | --- | --- | --- |
| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
| G2 | **오케스트레이션 주체 없음**: skill 11종이 각 역할의 "어떻게"는 정의하지만 "지금 누가 무엇을"은 어디에도 없음 | `.agents/skills/` 전수 확인; `05-work-processes.md`는 산문 | 인간이 매 stage마다 다음 역할을 호출해야 함 |
| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
| G4 | **pod 부트스트랩 계약 부재**: `codex-preflight.mjs`가 macOS 전제 — codex 후보 경로가 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`(`scripts/codex-preflight.mjs:8`), arch 판정이 `sysctl -n hw.optional.arm64`(`scripts/codex-preflight.mjs:67`). Linux pod에서 결정적으로 실패. 역할 배정(어느 pod가 어느 역할인지) 규약도 없음 | 해당 파일 | 새 pod가 "나는 역할 X이고 준비됐다"를 스스로 증명할 수 없음 |
| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs:236-250`이 team-doc 한정 secret 스캔은 수행) | 해당 파일 | 증거 무결성이 규율에만 의존 |
| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |

### A-3. 진단 요약

조직 설계·역할 계약·게이트·증거 규율은 성숙해 있으나, 그것을 **구동하는 결정적
(deterministic) 상태·해석기·부트스트랩 계층이 없다**. 즉 "역할이 일하는 방법"은 완성됐고
"조직이 스스로 도는 방법"이 미완성이다. 아래 개선은 전부 이 한 문장으로 수렴한다:
**committed repo 상태만으로 다음 액션이 계산되고, 어떤 pod든 그 계산 결과 중 자기 역할
몫만 실행하게 만든다.** 이는 `10-github-artifact-workflow.md`의 "shared storage 없음,
GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
원칙의 직접 연장이며, 새 인프라 발명이 아니라 기존 원칙의 기계화다.

---

## Part B. Repo 측 개선 (PR 슬라이스 7개, 의존성 순)

모든 PR은 repo 규칙을 따른다: TDD/validator-first(`AGENTS.md` Required rules),
신규 validator는 `package.json` script + `quality-gate.yml`의 스크립트 정규식 +
`PROJECT_ENVIRONMENT.md` CI 절에 **3중 배선**, 계획·증거는 `.evidence/`에 기록.

### PR1 (P0) — Work-unit 상태머신: `status.json`

- **WHY**: G1. pod-isolated 조직에서 유일한 durable 입력은 committed 파일이므로
  상태도 committed 파일이어야 한다. reviewer verdict가 이미 JSON envelope로 기계화되어
  있는 것(`codex-headless-review.mjs`)과 동일한 패턴을 stage 상태로 확장하는 것.
- **WHAT**:
  - `docs/plans/work-units/<work-unit-id>/status.json` (schema `wu-status/v1`)
  - `scripts/lib/work-unit-machine.mjs` — 상태 enum/전이표/병렬 그룹 공유 모듈
  - `scripts/validate-work-units.mjs` (+ `evals/local-harness/work-units/` fixture:
    valid 1, 불법 전이 1, envelope 누락 1, gatekeeper에 reviewer 지정 1)
  - `docs/plans/work-units/sample-role-handoff/status.json` 샘플 추가
  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
- **HOW** — 스키마 핵심:

```json
{
  "schema_version": "wu-status/v1",
  "work_unit": "<work-unit-id>",
  "stages": [
    {
      "id": "00-product-planning",
      "role": "product-planning",
      "state": "done",
      "attempts": 1,
      "max_attempts": 3,
      "required_artifacts": ["..."],
      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
                    "envelope_path": "00-product-planning/reviewer-envelope.json" },
      "handoff": { "branch": "wu/<id>/00-planning", "pr": "<pr-url>" }
    }
  ],
  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
                     "state": "pending", "decision_path": "..." } ],
  "evidence_ladder": { "required_level": "eas-maestro", "achieved_level": "rn-web" },
  "events": [ { "at": "<iso8601>", "actor": "<role>", "type": "stage-completed", "stage": "..." } ]
}
```

  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
  - 합법 전이: `pending→in-progress→review→done`; `review→gate-failed→in-progress`(attempts+1);
    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
  - `events`는 append-only — validator가 타임스탬프 단조 증가와 git base 대비 prefix 보존을 검사
  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
    (`codex-headless-review.mjs`의 envelope validator 재사용) + handoff 링크 필수;
    `06-gatekeeper` stage는 role이 `gatekeeper-system`이어야 하고 reviewer agent 지정 금지
    (비-LLM 불변식); 선행 stage 미완료 시 `in-progress` 금지 — 단 `02-architecture`와
    `03-contract-api`는 `01-design`이 `review` 도달 후 병렬 허용(명시적 `parallel_groups` 상수)
- **수용 기준**: `--self-test` 통과(invalid fixture가 명명된 사유로 실패),
  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.

### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`

- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
  파이프라인은 영구 정지한다. 승인을 기계 판독 가능 + 감사 가능하게 만들어야
  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
  `06-gates-and-evidence.md`에 규범 절 1개 추가.
- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
  `decision ∈ approved|rejected|deferred`, `scope`, `decided_by{name,contact,channel}`,
  `decision_reference`(GitHub comment/review URL — 신뢰 앵커), `decided_at`,
  `residual_risk[]`, `evidence_links[]`.
  - 결정적 anti-self-approval: `decided_by.name`이 역할명/agent명 목록과 일치하면 거부
  - `failed-gate-risk` 카테고리는 실패한 check 참조 필수
  - 한계 명시: 진위 보장은 GitHub 계정 신원에 앵커된 **정책 수준**이지 암호학적 증명이
    아니다. 온라인 시 orchestrator가 `gh api`로 작성자 확인 후 work-unit event에
    `verified: true | unverifiable-offline` 기록.
- **수용 기준**: fixture 4종(정상 / agent명 승인자 / 미정의 category / failed-gate-risk
  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.

### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill

- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
  결정된 액션의 *실행*만 담당한다.
- **WHAT**:
  - `scripts/work-unit-next.mjs`: `status.json` + 파일시스템 → 다음 액션 JSON 출력.
    `--apply-transition <stage> <state>`는 공유 모듈을 통해서만 상태를 기록(불법 전이는
    기록 시점에 거부 — validate 시점이 아니라).
  - `.agents/skills/wm-orchestrate/SKILL.md`: 어느 역할 pod든 실행하는 단일 진입 skill.
    절차 = pull → resolver 실행 → 자기 역할(`WM_ROLE`) 몫 필터 → 해당 역할 skill 호출 →
    reviewer를 `codex-headless-review.mjs`로 실행 → 전이 적용 → commit/push/PR 갱신.
  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
- **HOW** — resolver 출력 계약(요지): `next_actions[]`(stage, role, action ∈
  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
  run-deterministic-checks, skills[], reviewer_required, attempts_remaining)와
  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
  `04-skills-and-agents-matrix.md`를 따른다(00→po-planning-reviewer, 01→design-reviewer,
  02/03→wm-contract-reviewer, 04→wm-implementation-reviewer, 05→QA 증거 검사,
  06→결정적 검사만). 재시도 정책: `gate-failed` 시 `wm-gate-fix-advisor` advisory 첨부,
  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
- **수용 기준**: fixture로 8 stage 행복 경로, 02/03 병렬, 재시도, 재시도 소진 에스컬레이션,
  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.

### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약

- **WHY**: G4. live pod 실측상 pod에는 Node 22/git/Chromium이 있고
  `/workspace/skills/codex-cli-auth-setup`이 이미 동작 패턴으로 존재한다
  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
  macOS 전용인 preflight를 pod에서 동작하게 확장하면 된다.
- **WHAT**:
  - `scripts/codex-preflight.mjs`에 `--pod` 모드: codex 후보 경로에 `which codex` +
    `CODEX_BIN` env 추가, arch 판정을 `uname -m` 우선으로 교체(기존 macOS 경로 유지),
    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
    10.33.3 근거), git identity, `gh auth status`,
    Chromium 존재(`rn-web-capable`), `.codex/config.toml` 파싱 + `codex mcp list` 종료코드,
    역할 컨텍스트 fixture 존재. 출력에 `capabilities` 블록:
    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
    auth token 값은 출력하지 않음(기존 codex-cli-auth-setup 가드 계승).
  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
    (`SKILL.md` + `scripts/pod-bootstrap.sh` + `references/report-template.md`):
    역할 해석(`WM_ROLE` env 우선, fallback `/workspace/IDENTITY` 1행, 불일치 시 hard fail) →
    repo clone(주입 토큰; `infra/clawpod/agent-runner.yaml`의 initContainer 패턴 재사용) →
    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
    `codex-preflight --pod --json` → 역할 skill 디렉토리
    실재 확인 → 보고서를 `/workspace/state/`에 기록.
  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
- **수용 기준**: preflight `--self-test`에 Linux형 fixture 추가 통과; 노트북에서
  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.

### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리

- **WHY**: G3. in-pod emulator는 **명시적으로 기각**한다 — KVM/중첩 가상화가 pod 런타임에
  없고(실측), 대규모 병렬은 `AGENTS.md:46`의 직렬화 원칙과도 충돌한다. 반면 이 repo에는
  이미 자율화 가능한 cloud 경로가 잠들어 있다: `eas.json`의 `e2e-test` 프로파일
  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
  ingestion ③ "어느 수준의 증거가 언제 필수인가"의 규범이다.
- **WHAT**:
  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
    - L0 `jest`: 항상 (CI)
    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
      컨테이너/release candidate 접촉 시 필수
    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
      submit 전 필수
    - stage 00에서 Product/Planning이 `status.json.evidence_ladder.required_level` 설정,
      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
      또는 `failed-gate-risk` waiver 존재를 강제
    - `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder다
      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
      파라미터화/주입 방안을 이 문서에서 규정해야 한다
  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
  - `scripts/ingest-eas-evidence.mjs`: eas-cli JSON 출력(`eas build:view --json` 등, 버전
    핀 고정 — `@latest` 금지 정책 준수) → `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-eas-<slug>/result.json`
    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
    요약 블록 생성. URL query token redaction. 네트워크 없는 `--self-test`(녹화 fixture).
  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
    실패 분류).
  - iOS는 Android 경로 검증 후 후속(P2)으로 `e2e-test-ios.yml` 추가 — 본 계획 범위 외로 명시.
- **수용 기준 (오프라인 — 선행 실행 가능)**: ingest `--self-test` 통과(녹화 fixture, 네트워크 0)
  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
  `validate:team-doc` 통과.
- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
  `EAS_PROJECT_ID`/GitHub-EAS 연동을 승인·주입 → PR에서 `e2e-test-android.yml` 실행 →
  증거 ingest). 승인·주입 전에는 `eas whoami`를 포함한 어떤 EAS 명령도 실행하지 않으며,
  native 검증 완료를 주장하지 않는다.

### PR6 (P1) — SoT refresh / drift 자동 검출

- **WHY**: G6. 에이전트 조직은 문서를 SoT로 신뢰하므로 drift는 조용한 오작동의 최대
  원인이다. placeholder를 "수동 절차 + 자동 검출"의 명시적 정책으로 전환한다.
- **WHAT**:
  - `package.json:20`의 placeholder를 `node scripts/sot-snapshot-check.mjs`로 교체:
    `evals/local-harness/sot/snapshot.json` 스키마/page-ID 목록 일치 검증 + `refreshed_at`
    30일 초과 경고(경고만, CI 비차단). 실제 re-fetch는 Atlassian MCP 수동/에이전트 절차로
    `evals/local-harness/README.md`에 규범화(네트워크·MCP 인증이 CI-unsafe하므로).
  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,

hook: PostToolUse
hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
codex
현재 계획 문서가 이전 HIGH/NO_GO 지적을 대부분 명시적으로 흡수했는지 확인하고 있습니다. 특히 pnpm pin, Part D의 ops annex 분리, EAS live 명령 금지, RN Web/native 증거 경계, Gatekeeper 모델링을 SoT와 맞춰 보고 있습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba PROJECT_ENVIRONMENT.md | sed -n '1,330p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Project Environment
     2
     3	Last updated: 2026-06-10
     4
     5	This file is the root source for the current project environment and runtime settings. Keep it in sync when changing package versions, Expo config, NativeWind config, Codex runtime files, CI gates, EAS workflows, required environment variables, or the Codex MCP/CLI setup guide at `docs/CODEX_MCP_ENVIRONMENT.md`.
     6
     7	## Workspace
     8
     9	- Package manager: `pnpm@9.15.9` from root `package.json`.
    10	- Workspace packages: `apps/*` and `packages/*` from `pnpm-workspace.yaml`.
    11	- Turbo tasks: `lint` and `test` from `turbo.json`.
    12	- Required root gates:
    13	  - `pnpm run test:runtime`
    14	  - `pnpm turbo run lint test`
    15	  - `pnpm run test:local-harness` for Codex runtime changes.
    16
    17	## Mobile Runtime
    18
    19	- App path: `apps/mobile`.
    20	- Framework: Expo SDK 56 with Expo Router.
    21	- Runtime versions:
    22	  - `expo`: `~56.0.9`
    23	  - `react`: `19.2.3`
    24	  - `react-dom`: `19.2.3`
    25	  - `react-native`: `0.85.3`
    26	  - `react-native-web`: `^0.21.2`
    27	  - `expo-router`: `~56.2.9`
    28	  - `expo-dev-client`: `~56.0.19`
    29	  - `expo-doctor`: `^1.19.9` as the `doctor` script dependency.
    30	  - `@playwright/test`: `^1.60.0` as the browser E2E test runner.
    31	- Expo config: `apps/mobile/app.config.ts`.
    32	  - Dynamic values come from environment variables.
    33	  - Neutral template fallback values exist only so local config evaluation can run without customer values.
    34	  - Preview, production, and EAS build config fail if app display name, slug, scheme, API URL, iOS bundle identifier, or Android package are missing.
    35	  - Customer and production builds must override app display name, slug, scheme, iOS bundle identifier, Android package, and API URL through environment variables.
    36	  - `newArchEnabled` is `true`.
    37	  - Plugin is `expo-router`.
    38	  - `extra.apiUrl` reads `EXPO_PUBLIC_API_URL`.
    39	  - `extra.eas.projectId` reads `EAS_PROJECT_ID`.
    40	- Mobile scripts:
    41	  - `pnpm --filter mobile start`
    42	  - `pnpm --filter mobile ios`
    43	  - `pnpm --filter mobile android`
    44	  - `pnpm --filter mobile run doctor`
    45	  - `pnpm --filter mobile lint`
    46	  - `pnpm --filter mobile test`
    47	  - `pnpm --filter mobile e2e`
    48	  - `pnpm --filter mobile e2e:web`
    49	  - `pnpm --filter mobile web`
    50	- Node baseline:
    51	  - CI uses Node 22.
    52	  - Mobile TypeScript uses `@types/node` 22.x so code cannot type-check against newer Node-only APIs by accident.
    53
    54	## Mobile Web E2E
    55
    56	- Browser E2E path: `apps/mobile/e2e-web`.
    57	- Browser E2E config: `apps/mobile/playwright.config.ts`.
    58	- Browser install command: `pnpm --filter mobile exec playwright install chromium`.
    59	- Browser E2E command: `pnpm --filter mobile e2e:web`.
    60	- Repo QA skill: `$e2e-test` plans, resets, executes, and records E2E evidence. It is a Codex skill, not the EAS build profile or workflow label named `e2e-test`.
    61	- RN Web E2E validates only RN Web/browser-reproducible UI, navigation, state, and business logic flows.
    62	- RN Web E2E does not validate native modules, OS permissions, native lifecycle behavior, push delivery, biometrics, camera, GPS, or other device/hardware features.
    63	- RN Web release E2E requires a deployed backend API URL through public client config:
    64	  - `EXPO_PUBLIC_API_URL=<deployed-api-url> pnpm --filter mobile e2e:web`
    65	  - `EXPO_PUBLIC_API_URL` is compiled into the client app and is not private; never put bearer tokens, signing keys, passwords, or private endpoints in it.
    66	  - The current Railway QA API URL verified for this workspace is `https://api-production-3d74.up.railway.app`.
    67	  - Evidence: `.evidence/e2e-test/20260609-233244-rn-web-railway-api/`.
    68	- Playwright launches Expo Web with deterministic public test config plus the caller-provided backend API URL:
    69	  - `EAS_BUILD=false`
    70	  - `EXPO_PUBLIC_APP_ENV=development`
    71	  - `EXPO_PUBLIC_APP_DISPLAY_NAME=Mobile App Template`
    72	  - `EXPO_PUBLIC_APP_SLUG=mobile-app-template`
    73	  - `EXPO_PUBLIC_APP_SCHEME=mobileapptemplate`
    74	  - `EXPO_PUBLIC_API_URL` from the command environment
    75	  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER=com.template.mobile`
    76	  - `EXPO_PUBLIC_ANDROID_PACKAGE=com.template.mobile`
    77	- `EXPO_PUBLIC_*` values are public client configuration and must not contain tokens, bearer credentials, signing keys, passwords, or private service endpoints.
    78	- Native completion remains separate:
    79	  - Run Maestro and `mobile-mcp` visual QA when the required EAS account, simulator, emulator, or device is available.
    80	  - If the user chooses direct local/manual native verification instead, record it as HUMAN-GATE evidence with residual risk; do not remove or mark the Maestro/mobile-mcp requirements as replaced.
    81
    82	## Mobile Styling
    83
    84	- Styling layer: NativeWind with React Native primitives and semantic design tokens.
    85	- Current NativeWind package: `nativewind@5.0.0-preview.4`.
    86	- NativeWind v5 is a pre-release package, so this repo pins the exact preview version.
    87	- NativeWind v5 rollback criteria:
    88	  - Roll back to the last passing NativeWind v4 / Tailwind CSS v3 baseline if SDK 56 compatibility checks, Metro bundling, Jest, native run smoke, or Maestro/mobile visual QA fail because of NativeWind v5 and cannot be fixed in the same PR.
    89	  - Do not promote a production release with unresolved NativeWind v5 rendering, bundling, or native runtime defects.
    90	- Tailwind/PostCSS:
    91	  - `tailwindcss`: `^4.3.0`
    92	  - `@tailwindcss/postcss`: `^4.3.0`
    93	  - `postcss`: `^8.5.15`
    94	  - `lightningcss`: `1.30.1`
    95	  - root pnpm override pins `lightningcss` to `1.30.1`.
    96	  - PostCSS config: `apps/mobile/postcss.config.mjs`
    97	- NativeWind dependencies:
    98	  - `react-native-css`: `^3.0.7`
    99	  - `react-native-reanimated`: `4.3.1`
   100	  - `react-native-worklets`: `0.8.3`
   101	  - `react-native-safe-area-context`: `~5.7.0`
   102	- NativeWind config files:
   103	  - `apps/mobile/babel.config.js` uses `babel-preset-expo` for runtime builds and adds `react-native-css/babel` only when `api.env('test')` is true so Jest can exercise className translation outside Metro.
   104	  - `apps/mobile/metro.config.js` wraps Expo Metro with `withNativewind(config, { input: './global.css' })`.
   105	  - `apps/mobile/global.css` imports Tailwind theme/preflight/utilities and `nativewind/theme`; semantic colors are defined with `@theme`.
   106	  - `apps/mobile/nativewind-env.d.ts` references `react-native-css/types`.
   107	  - `apps/mobile/jest.after-env.js` imports `react-native-css/jest` through Jest `setupFilesAfterEnv`.
   108	  - `apps/mobile/src/app/_layout.tsx` imports `../../global.css`.
   109	  - There is no active `tailwind.config.js`; Tailwind CSS v4 configuration is CSS-first.
   110
   111	## Mobile Environment Variables
   112
   113	Public JS runtime variables are parsed by `apps/mobile/env.ts`; app config variables are read directly by `apps/mobile/app.config.ts`.
   114
   115	`EXPO_PUBLIC_*` values are compiled into the client app and are not private. Use them only for public client configuration, never for tokens, passwords, bearer credentials, signing keys, or private service endpoints. Customer-specific and production values still must be injected through environment management instead of being hardcoded in the repo.
   116
   117	- Public JS runtime variables:
   118	  - `EXPO_PUBLIC_APP_ENV`: `development`, `preview`, or `production`; default `development`.
   119	  - `EXPO_PUBLIC_APP_DISPLAY_NAME`: optional in the runtime parser, default is `Mobile App Template`; required explicitly by preview, production, and EAS build config.
   120	  - `EXPO_PUBLIC_API_URL`: required URL.
   121	- Public app config variables:
   122	  - `EXPO_PUBLIC_APP_SLUG`: required by preview, production, and EAS build config.
   123	  - `EXPO_PUBLIC_APP_SCHEME`: required by preview, production, and EAS build config.
   124	  - `EXPO_PUBLIC_IOS_BUNDLE_IDENTIFIER`: required.
   125	  - `EXPO_PUBLIC_ANDROID_PACKAGE`: required.
   126	- Non-public variables:
   127	  - `EAS_PROJECT_ID`: optional UUID.
   128	Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
   129
   130	## EAS And Maestro
   131
   132	- EAS config: `apps/mobile/eas.json`.
   133	  - `development`: development client, internal distribution, `development` channel, `development` EAS environment.
   134	  - `preview`: internal distribution, `preview` channel, `preview` EAS environment.
   135	  - `production`: `production` channel with auto increment and `production` EAS environment.
   136	  - `e2e-test`: Android APK and iOS simulator settings without credentials, using the `preview` EAS environment.
   137	- The EAS profile/workflow label `e2e-test` is distinct from the repo Codex skill `$e2e-test`.
   138	- EAS workflows:
   139	  - `apps/mobile/.eas/workflows/build-and-submit.yml`: production build jobs use the `production` EAS environment and set `EXPO_PUBLIC_APP_ENV=production`.
   140	  - `apps/mobile/.eas/workflows/e2e-test-android.yml`: E2E build job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
   141	  - `apps/mobile/.eas/workflows/ota-update.yml`: preview update job uses the `preview` EAS environment and sets `EXPO_PUBLIC_APP_ENV=preview`.
   142	- Maestro flows: `apps/mobile/.maestro`.
   143	- Native E2E command: `pnpm --filter mobile e2e`.
   144	- Current stable testIDs:
   145	  - `home-title`
   146	  - `counter-value`
   147	  - `counter-increment-button`
   148	- Prefer Maestro `id` selectors over visible text.
   149
   150	## API Runtime
   151
   152	- API path: `apps/api`.
   153	- Stack: Hono, Drizzle ORM, postgres, zod.
   154	- Scripts:
   155	  - `pnpm --filter @template/api dev`
   156	  - `pnpm --filter @template/api build`
   157	  - `pnpm --filter @template/api lint`
   158	  - `pnpm --filter @template/api test`
   159	- Environment variables from `apps/api/src/env.ts`:
   160	  - `DATABASE_URL`: required URL.
   161	  - `API_PORT`: integer, default `3000`.
   162	  - `API_BEARER_TOKEN`: required secret.
   163	- Import direction remains routes to services to db only.
   164	- Shared API/domain schemas must come from `packages/contracts`.
   165	- Current Railway QA deployment:
   166	  - Project: `new-mobile-app`.
   167	  - API service: `api`.
   168	  - Postgres service: `Postgres`.
   169	  - API URL: `https://api-production-3d74.up.railway.app`.
   170	  - Latest verified API deployment id: `4c701f22-3ce9-40ef-a4bd-560252b773f3`.
   171	  - `GET /livez` returns `{"status":"ok"}`.
   172	  - `GET /readyz` returns `{"status":"ok"}`.
   173	  - Railway runtime variables include `DATABASE_URL`, `API_BEARER_TOKEN`, `PORT=3000`, `API_PORT=3000`, `RAILWAY_DOCKERFILE_PATH=apps/api/Dockerfile`, and `RAILWAY_HEALTHCHECK_PATH=/readyz`.
   174	  - Do not print or commit Railway secret values. `API_BEARER_TOKEN` was rotated after setup output exposed an earlier generated value.
   175
   176	## Contracts Package
   177
   178	- Package path: `packages/contracts`.
   179	- Source entry: `./src/index.ts`.
   180	- Peer dependency: `zod ^3.25.0 || ^4.0.0`.
   181	- This package is the single source of truth for API request/response types and shared domain schemas.
   182	- Runtime export: `./dist/index.js`, with TypeScript types sourced from `./src/index.ts`.
   183	- Build command: `pnpm --filter @template/contracts build`.
   184	- Test command: `pnpm --filter @template/contracts test`.
   185	- API Docker builds must build `@template/contracts` before `@template/api` so deployed Node runtimes do not import TypeScript source from `node_modules`.
   186
   187	## Codex Runtime
   188
   189	- Installed Codex plugin marketplaces:
   190	  - `expo-plugins`
   191	    - source: `expo/skills`
   192	    - ref: `main`
   193	    - marketplace root: user-local Codex marketplace cache, not a repo-pinned path; do not commit a resolved absolute path.
   194	- Installed Codex plugins:
   195	  - `expo@expo-plugins`
   196	    - version: `1.1.0`
   197	    - status: installed and enabled
   198	    - plugin root: user-local Codex plugin cache for `expo-plugins/expo/1.1.0`, not a repo-pinned path; do not commit a resolved absolute path.
   199	    - use only for generic Expo, React Native, EAS, dev client, SDK upgrade, deployment, native UI, API route, and data fetching guidance.
   200	    - repo skills remain authoritative for contracts, role boundaries, evidence, and QA gates.
   201	- Repo skills: `.agents/skills/<skill-name>/SKILL.md`.
   202	  - `$wm` plans must be SoT-grounded: material planning decisions cite or name verified SoT inputs, and missing or ambiguous SoT must be reported as unknown/blocked instead of being filled by predictions, assumptions, or expected behavior.
   203	  - `$wm` implementation runs must not proceed past planning until applicable local SoT has been read and cited or named in the plan.
   204	  - `$wm` pre-implementation plan review evidence and final actual-work review evidence are mandatory for non-trivial implementation runs.
   205	  - `$wm` implementation runs require persisted read-only reviewer evidence for both the completed plan and the actual completed work, and final user reports must include material `git diff` change details.
   206	  - The `$wm` headless helper is an allowed review evidence path; the review evidence requirement itself is mandatory.
   207	  - `$e2e-test` is the repo QA skill for E2E test planning, tested-instance reset, planned execution, and objective evidence capture across RN Web Playwright, Maestro, `mobile-mcp`, or manual HUMAN-GATE checks. It records evidence under `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` and does not implement fixes.
   208	  - `$qa-railway-workflow` is the repo QA skill for Railway CLI install/login/project/service/database/variable/domain/deploy/status/log/health workflows, redacted Railway evidence, RN Web E2E API URL handoff, and `PROJECT_ENVIRONMENT.md` synchronization. It does not implement app, backend, contract, migration, or mobile UI fixes.
   209	  - Product/Planning repo-local Codex adapters use required `po-*` slugs:
   210	    - `po-requirement-office-hours` maps source skill `mobile-requirement-office-hours` page `1374519364`.
   211	    - `po-work-unit-planning-and-agent-sprint` maps source skill `mobile-work-unit-planning-and-agent-sprint` page `1374650456`.
   212	    - `po-prd-to-execution` maps source skill `mobile-prd-to-execution` page `1373634562`.
   213	    - `po-planning-completeness-review` maps source skill `mobile-planning-completeness-review` page `1374519387`.
   214	    - These are Product/Planning operational adapters, not a standalone `mobile-product-planning-workflow` role wrapper.
   215	  - Design repo-local Codex adapters use required `design-*` slugs:
   216	    - `design-mobile-design-handoff` maps source skill `mobile-design-handoff` page `1373765661`, Design SOUL page `1373765702`, and Design Codex practice page `1374290207`.
   217	    - `design-stitch-mcp-operating-rules` defines reusable Stitch MCP execution rules for Design handoff work and maps the same Design source/practice pages.
   218	    - These adapters require objective UI/UX framing, DESIGN.md decision handling, Product/Planning P0 scope/evidence approval before Stitch generation, exactly two Stitch visual design directions, Product/Planning P1 scope/evidence approval before HTML extraction, Option A/B HTML extraction via `code.html` or Stitch MCP fetch only after P1, Option A/B image extraction via Stitch MCP, dated `design-pub-html/<YYYY-MM-DD>/` publication, five-state matrix, UX acceptance criteria, and evidence.
   219	    - P0/P1 Product/Planning approvals are scope/evidence approvals for PRD fit, non-goals, evidence readiness, and human-gate routing. They are not Design quality approvals and do not move selected-option ownership out of Design.
   220	    - Before P1 approval, Design must not call or persist `fetch_screen_code`, official ZIP `code.html`, SDK `getHtml`, `htmlCode.downloadUrl`, or equivalent HTML extraction metadata.
   221	    - Stitch prompt generation must use prompt enhancement and current `DESIGN.md`; Gemini 3.1 Pro, Pro, or Thinking mode is requested best-effort when the Stitch surface exposes model or mode selection, with actual capability and limitations recorded in `manifest.json`.
   222	- Custom agents: `.codex/agents/<agent-name>.toml`.
   223	  - wm review routing uses dedicated read-only agents:
   224	    - `wm-implementation-reviewer`
   225	    - `wm-contract-reviewer`
   226	    - `wm-docs-researcher`
   227	    - `wm-gate-fix-advisor`
   228	    - `po-planning-reviewer`
   229	    - `po-scope-gate-reviewer`
   230	    - `po-docs-researcher`
   231	    - `design-reviewer`
   232	    - `design-researcher`
   233	  - legacy `mobile-*` agents remain available for other runtime/eval surfaces, but `$wm` reviewer routing and `scripts/codex-headless-review.mjs` allow only the dedicated `wm-*`, Product/Planning `po-*`, and Design `design-*` read-only agents listed above.
   234	- Hooks: `.codex/hooks.json` and `.codex/hooks/*.mjs`.
   235	- MCP config: `.codex/config.toml`.
   236	- Codex MCP/CLI setup guide: `docs/CODEX_MCP_ENVIRONMENT.md`.
   237	- Root Claude runtime artifacts are not part of the active Codex runtime:
   238	  - `CLAUDE.md`
   239	  - `.claude/`
   240	  - `.claude-state/`
   241	  - `scripts/validate-runtime-artifacts.mjs` rejects these root paths. Third-party files with the same names under ignored dependency directories are outside this policy.
   242	- Required project MCP servers:
   243	  - `mobile-mcp`
   244	  - command: `npx`
   245	  - args: `-y @mobilenext/mobile-mcp@0.0.58`
   246	  - local visual QA/device automation is required for mobile UI/runtime checks when a simulator or device is available.
   247	  - it is excluded from required CI gates.
   248	  - simulator and device operations must be serialized, not parallelized.
   249	  - `serena`
   250	  - command: `uvx`
   251	  - args: `-p 3.13 --from git+https://github.com/oraios/serena@v1.5.3 serena start-mcp-server --project-from-cwd --context=codex`
   252	  - symbolic navigation MCP for symbol overview, symbol lookup, reference search, and bounded repo code navigation.
   253	  - `stitch`
   254	  - command: `npx`
   255	  - args: `-y stitch-mcp@1.3.2`
   256	  - design-authoring MCP for Google Stitch project/screen generation and export handoff.
   257	  - it uses local Google Cloud Application Default Credentials through `gcloud auth application-default login`.
   258	  - actual use requires a Google Cloud project with the Stitch MCP service enabled, plus `GOOGLE_CLOUD_PROJECT` or a `gcloud config set project` value.
   259	  - no Stitch API key is stored in the repo, `.codex/config.toml`, `EXPO_PUBLIC_*`, docs, or evidence.
   260	  - do not use `@latest`.
   261	- Plugin-provided MCP servers:
   262	  - `expo`
   263	  - URL: `https://mcp.expo.dev/mcp`
   264	  - status: enabled
   265	  - authentication: run `codex mcp login expo` when the target Codex session reports Expo MCP is not logged in, then verify with `codex mcp list`; auth display can be session-specific.
   266	  - this does not replace `mobile-mcp` for local visual QA/device automation.
   267	- Runtime scripts:
   268	  - `scripts/validate-runtime-artifacts.mjs`
   269	    - The root `validate` package script removes transient `.claude-state` before running this validator, while the validator itself still rejects root Claude runtime artifacts.
   270	  - `scripts/codex-headless-review.mjs`
   271	    - Codex-only read-only helper: `codex -a never exec -m gpt-5.5 -c 'model_reasoning_effort="high"' -s read-only`.
   272	    - no Claude, `--engine auto`, or `review_engine_preference` fallback path.
   273	    - optional machine-readable reviewer verdict validation: `node scripts/codex-headless-review.mjs --json-envelope --agent <verdict-reviewer> --prompt <text-or-file> --out <path>`.
   274	    - verdict-producing reviewers are `wm-implementation-reviewer`, `wm-contract-reviewer`, `po-planning-reviewer`, `po-scope-gate-reviewer`, and `design-reviewer`.
   275	    - the reviewer JSON envelope contains `verdict`, `reviewer`, `mode`, `scope`, `findings`, `checks_reviewed`, `residual_risks`, and `next_action`; `GO` requires no Critical/High/Medium findings and required checks `PASS` or source-backed `NOT_APPLICABLE`, failed required checks map to `NO_GO`, missing required checks map to `BLOCKED`, and human-gate blockers map to `NEEDS_HUMAN`.
   276	    - researcher/advisor agents are advisory and are not valid `--json-envelope` targets.
   277	  - `scripts/test-hooks.mjs`
   278	  - `scripts/clean-tree-guard.mjs`
   279	  - `scripts/codex-preflight.mjs`
   280	  - `scripts/test-local-harness.mjs`
   281	- Local harness path: `evals/local-harness`.
   282	- Local harness result path: `evals/local-harness/results`.
   283	- Runtime stability evidence path: `.evidence/`.
   284
   285	## CI
   286
   287	- GitHub quality gate: `.github/workflows/quality-gate.yml`.
   288	- Always runs:
   289	  - `pnpm run test:runtime`
   290	  - `pnpm turbo run lint test`
   291	- Does not run `mobile-mcp`; mobile device automation remains a local QA gate.
   292	- Runs `pnpm run test:local-harness` when these paths change:
   293	  - `.agents/**`
   294	  - `.codex/**`
   295	  - `evals/{skills,agents,hooks,local-harness}/**`
   296	  - `scripts/{validate-runtime-artifacts,codex-headless-review,test-hooks,test-local-harness,clean-tree-guard,codex-preflight}.mjs`
   297	  - `.github/workflows/quality-gate.yml`
   298	  - `PROJECT_ENVIRONMENT.md`
   299	  - `docs/{confluence,plans}/**`
   300	  - `AGENTS.md`
   301	  - `package.json`
   302	  - `pnpm-lock.yaml`
   303
   304	## Current Non-Scope
   305
   306	- Do not restore OpenClaw packaging scripts or generated package results unless a new source-of-truth explicitly reintroduces that runtime.
   307	- Do not add shadcn/ui to React Native screens.
   308	- Do not add secrets, customer-specific identifiers, or production API URLs to the repo.

exec
/bin/zsh -lc "nl -ba AGENTS.md | sed -n '1,125p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# AGENTS.md
     2
     3	## OpenClaw And Codex Skill Routing
     4
     5	- Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/<slug>/` using skill-creator structure.
     6	- Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml` for primary artifacts; required validators, evals, scripts, and evidence may still be added when the change needs them.
     7
     8	This repository is the mobile app template runtime for WonderMove mobile agents.
     9	Repo-wide operating policy ownership is defined in `REPO_OPERATIONS.md`.
    10
    11	## Required Rules
    12
    13	- TDD required: write or update tests before implementation changes.
    14	- No hardcoding customer app names, bundle IDs, API URLs, tokens, or credentials.
    15	- No direct push to `main`; use a branch and PR.
    16	- Do not modify external platform/runtime repositories from this repository.
    17	- RN UI uses NativeWind + React Native primitives + semantic design tokens; web-only shadcn/ui is N/A for React Native screens (apply shadcn/ui only to optional web console).
    18
    19	## Codex Runtime Paths
    20
    21	- Native Codex CLI repo skills: `.agents/skills/<skill-name>/SKILL.md`
    22	- Native Codex CLI custom agents: `.codex/agents/<agent-name>.toml`
    23	- Native Codex CLI hooks: `.codex/hooks.json` and `.codex/hooks/`
    24	- Native Codex CLI MCP config: `.codex/config.toml`
    25	- Runtime evals and evidence: `evals/{skills,agents,hooks,local-harness}/`
    26	- Runtime stability evidence: `.evidence/`
    27
    28	## Repository Structure
    29
    30	Monorepo layout (top-level):
    31
    32	- `apps/mobile/` — Expo Router app (template core)
    33	- `apps/api/` — optional Hono + Drizzle backend (include only when a new backend is required; see §15 01-8)
    34	- `packages/contracts/` — shared zod schemas and TypeScript types (single SoT for all API contracts)
    35	- `infra/clawpod/` — EAS Robot token k8s Secret and agent-runner Job examples
    36	- `docs/` — SETUP.md, CREDENTIALS.md, design-references/ (awesome-design-md vendored)
    37	- `.github/workflows/` — quality-gate.yml (PR gate: `pnpm run test:runtime`, `pnpm turbo run lint test`, and conditional `pnpm run test:local-harness` for Codex runtime changes)
    38	- `.agents/`, `.codex/`, `evals/`, `scripts/` — Codex runtime layer, maintained through the runtime gates below
    39
    40	## Expo / React Native Runtime Policy
    41
    42	- Current mobile baseline is Expo SDK 56 (`expo ~56.0.9`) with React Native 0.85, NativeWind v5 preview, Tailwind CSS v4, and `expo-dev-client`.
    43	- Environment/runtime changes must keep `PROJECT_ENVIRONMENT.md` and the Confluence update document in sync with actual repo settings.
    44	- Before a mobile environment change is considered done, verify mobile lint/test, `expo install --check`, native run smoke on iOS/Android when available, and Maestro smoke where available.
    45	- Official Expo skills may be introduced in a separate verified step with `npx skills add expo/skills`. Official Expo skills should cover generic Expo/RN workflows; repo skills remain responsible for this project's contracts, role boundaries, evidence, and QA gates.
    46	- `mobile-mcp` is the required local visual QA/device automation MCP. Pin its version in `.codex/config.toml`, do not use `@latest`, do not add it to required CI gates, and do not parallelize simulator/device operations.
    47
    48	## Mobile QA Selectors
    49
    50	- Mobile screens should expose stable kebab-case `testID` values for long-lived automated checks.
    51	- Prefer Maestro `id` selectors over visible-text selectors.
    52	- Update app code, Jest tests, and Maestro flows together when changing a selector.
    53	- Current baseline examples: `home-title`, `counter-value`, `counter-increment-button`.
    54
    55	## Local Harness Scope
    56
    57	- `pnpm run test:local-harness` validates Codex CLI runtime structure, role boundaries, skill/agent/hook configuration, gatekeeper/evidence fixtures, and best-effort headless Codex smoke.
    58	- It is not an app feature test suite and does not prove Jira, Confluence, GitHub branch protection, EAS build/submit, production submit, or external platform/runtime behavior.
    59	- OpenClaw packaging paths such as `/workspace/skills`, `OPENCLAW_ROOT`, generated agent packages, and OpenClaw package result files are outside the active local harness scope.
    60	- Dirty worktree state is not a local harness failure condition; runtime edits must remain locally verifiable while in progress.
    61
    62	## Build / Test / Lint Commands
    63
    64	```
    65	# Install all workspace dependencies
    66	pnpm install
    67
    68	# Run lint and test across all workspaces (apps/mobile, apps/api if present)
    69	pnpm turbo run lint test
    70
    71	# Run codex runtime verification (validate / test:hooks)
    72	pnpm run test:runtime
    73
    74	# Run full Codex local harness for runtime-related PRs
    75	pnpm run test:local-harness
    76
    77	# Start mobile dev server
    78	pnpm --filter mobile start
    79
    80	# Run api tests only (when apps/api is present)
    81	pnpm --filter @template/api test
    82	```
    83
    84	## Conventions & PR Expectations
    85
    86	- `packages/contracts` is the single SoT for all API request/response types and shared domain schemas. Never declare ad-hoc duplicates in app or api code.
    87	- Database columns use snake_case; TypeScript variables and API fields use camelCase. Convert at the boundary.
    88	- Commit messages follow Conventional Commits (`feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`).
    89	- All changes go through a branch + PR. The quality-gate workflow must pass before merge.
    90	- Codex runtime changes under `.agents/`, `.codex/`, `evals/{skills,agents,hooks,local-harness}/`, or runtime scripts must pass the conditional local harness gate.
    91
    92	## Constraints (do-not)
    93
    94	- Do not push directly to `main`.
    95	- Do not hardcode customer app names, bundle IDs, API URLs, tokens, or credentials.
    96	- Do not use shadcn/ui for React Native screens (NativeWind + RN primitives only; shadcn/ui applies only to optional `apps/console`).
    97	- Do not modify external platform/runtime repositories from this repository.
    98	- `apps/api` import direction: routes → services → db only. Reverse imports are forbidden.
    99	- API request/response types must be defined exclusively in `packages/contracts`. Ad-hoc type declarations outside contracts are forbidden.
   100	- Migrations must use non-interactive procedure only: `drizzle-kit generate` (schema diff, no DB connection needed) + programmatic `migrate()` (idempotent, history-table based). Interactive `migrate dev` or CLI-applied migrations are forbidden.
   101
   102	## Definition of Done / Verification
   103
   104	Before opening a PR, verify:
   105
   106	1. Workspace lint and tests pass: `pnpm turbo run lint test`
   107	2. Codex runtime artifacts are intact: `pnpm run test:runtime`
   108	3. For Codex runtime changes, local harness passes: `pnpm run test:local-harness`
   109	4. For mobile environment/runtime changes, verify `pnpm --filter mobile exec expo install --check`, `pnpm --filter mobile lint`, `pnpm --filter mobile test`, `pnpm --filter mobile run doctor`, and `codex mcp list`
   110	5. For mobile UI/runtime changes with an available simulator or device, run local `mobile-mcp` visual QA/device automation serially and record the result in PR evidence
   111
   112	Applicable commands must exit 0.

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "sed -n '260,560p' team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,
    MCP 핀(`.codex/config.toml`), CI trigger 경로 목록(`quality-gate.yml` 정규식) 일치 검사.
    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
  - `.github/workflows/sot-drift.yml`: 주간 cron, `--online` + snapshot age 검사,
    drift 시 GitHub issue 생성/갱신(비차단 — PR 게이트는 오프라인·결정적 유지).
- **수용 기준**: 핀을 한 곳만 수정한 mutated fixture에서 실패; PR 게이트 네트워크 무의존.

### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생

- **WHY**: G7, G8. 모두 실패를 실행 시점에서 사전점검 시점으로 당기는 작업.
- **WHAT**:
  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
    status-only, 값 출력 금지.
  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
    디렉토리명 `^\d{8}-\d{6}-[a-z0-9-]+$` 강제, 금지 경로(`local/`, `tmp/`, `raw/`, `*.log`)의
    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
  비-design 역할 preflight는 Stitch 블록 skip.

---

## Part C. Pod 조직 설계 (boram 패턴 재사용)

### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper

| Pod 이름(요청명) | Operating Role | 이미지 | 자원 | 비고 |
| --- | --- | --- | --- | --- |
| `wm-po` | Product/Planning | agent-mobile **lite** | 2 CPU / 4Gi | 문서/계획 중심, GUI 불필요 |
| `wm-design` | Design | agent-mobile **full** | 2 CPU / 4Gi | Stitch MCP + 시각 확인용 Chromium/noVNC |
| `wm-arch` | Mobile Architect | agent-mobile **lite** | 2 CPU / 4Gi | 리뷰/계약 co-sign 중심 |
| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
| `wm-api` | Backend/API Integrator | agent-mobile **lite** | 2 CPU / 4Gi | Hono/Drizzle + Railway 배포 |
| `wm-qa` | QA/Release | agent-mobile **full** | **4 CPU / 8Gi** | Playwright 스크린샷 증거 + EAS/Maestro cloud 트리거 |

근거와 결정:

- **1역할 1pod**: `10-github-artifact-workflow.md`가 역할 격리 + GitHub-only handoff를
  전제하고, reviewer agent 분리(`.codex/agents/*-reviewer.toml`)가 행위자 분리를 가정한다.
  플랫폼은 agent당 ConfigMap/Secret/StatefulSet을 이미 지원하므로(검증) 추가 인프라가 없다.
- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
  work-unit의 `06-gatekeeper/` 파일은 CI 결과의 *전사*다 — LLM이 pass/fail을 판단하지 않는다.
- **별도 PM/오케스트레이터 pod를 만들지 않는다**: Product/Planning이 SoT상 intake·routing·
  readiness 소유자(Authority Level: Executive / Delivery Lead)다. 7번째 LLM 조정자는 SOUL
  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
  이미 `wm-po`의 권한 범위다.
- 비용 제약 시 `wm-po`+`wm-arch`(둘 다 문서/리뷰 중심)는 1 pod 2 IDENTITY로 축약 가능하나,
  1단계에서는 6 pod를 유지한다(라우팅 규칙 단순화 + 리뷰 행위자 분리).

### C-2. 프로비저닝 내용 (ConfigMap / Secret / skills)

**ConfigMap** (`{AGENT_ID}-agent-config`, boram과 동일 메커니즘):

- `SOUL.md`: `02-role-souls/<role>-soul.md` 그대로 (runtime template note 준수)
- `IDENTITY.md`: Display Title, Operating Role, 소유 stage(예: QA/Release →
  `05-qa-release/`), 상류/하류 역할, NATS 룸 규약
- `AGENTS.md`(pod용): boram 베이스 + **GitHub handoff protocol 절** 추가 — repo URL,
  `/workspace/repo`로 clone-on-demand, 브랜치 규약 `wu/<work-unit-id>/<stage>`,
  `docs/plans/work-units/<work-unit-id>/` 스키마 요약, 그리고 핵심 규칙
  "로컬 파일/채팅으로 핸드오프 금지 — push된 branch/PR + NATS 신호만 유효"
- `TOOLS.md`: boram 베이스(filesystem, playwright, memory, a2a, skill-store) + 역할 추가분

**Secret** (최소 권한 원칙):

| Pod | Secret 키 |
| --- | --- |
| 전체 6 pod | `OPENAI_CODEX_AUTH_JSON`(boram 검증 패턴), `GITHUB_TOKEN`(repo 한정 fine-grained; 역할별 bot 계정 분리 권장 — PR 리뷰/승인 귀속성) |
| `wm-qa`만 | `EXPO_TOKEN`(EAS robot, `infra/clawpod/secret.example.yaml` 패턴), Railway 헬스체크용 read 토큰 |
| `wm-api`만 | `RAILWAY_TOKEN`(배포) — `qa-railway-workflow`가 "배포는 API, 증거는 QA"로 분리되는 가장 깨끗한 구도 |
| `wm-design`만 | Stitch용 Google ADC |

**`/workspace/skills`** (pod-native): 전 pod에 `codex-cli-auth-setup` +
`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5).
repo-local `.agents/skills`/`.codex/agents`는 clone 후 자동 가용이므로 ConfigMap에
중복 탑재하지 않는다.

### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)

`clawpod/agent-mobile` (base 이미지 파생):

- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
  부트스트랩/preflight는 불일치 시 fail. eas-cli(전역), maestro CLI(**cloud 업로드
  모드 전용** — 로컬 드라이버 불필요), watchman(장시간 `expo start --web` 세션의
  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
- **명시적 제외**: Android SDK / adb / emulator 이미지 — KVM 부재로 사용 불가하며
  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
- `lite` 변형(po/arch/api용): base lite + pnpm + gh만

### C-4. 조정(coordination) 모델 — "GitHub가 상태, NATS는 초인종"

- **GitHub = 유일한 durable handoff**: `10-github-artifact-workflow.md` SoT 그대로.
  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
- **NATS 팀 룸 = wake-up 신호**: 단일 팀 룸(boram의 룸 구독 메커니즘 재사용)에 구조화
  신호만: `HANDOFF work-unit=<id> stage=<stage> pr=<url> next=<role>`. 신호 유실은
  webhook 경로가 보완하므로 신뢰성 요구 없음.
- **A2A = 동기 Q&A 전용**: 예) dev pod가 api pod에 계약 필드 질의. pod AGENTS.md에 규칙
  명문화 — "A2A로 도달한 결정은 work-unit 디렉토리에 기록되어야만 유효". 플랫폼 한도
  (동시 sub-agent 4, 메시지 depth 5) 준수.
- **Webhook gateway 규칙 3종**(GitHub adapter, ops 설정):
  1. PR opened/synchronized + label `next:<role>` → 해당 역할 pod 룸으로 라우팅
  2. check_suite failure (`wu/*` 브랜치) → `wm-qa`(실패 분류 소유) + stage 소유 pod
  3. PR merged (`wu/*`) → `wm-po` (stage 전진/종결)

### C-5. E2E 실행 트레이스와 단절점

"고객이 기능 X를 요청"의 전체 경로:

1. 인입 → `wm-po` 룸 (webhook gateway generic adapter 또는 운영 채널) →
   `po-prd-to-execution` + `po-work-unit-planning-and-agent-sprint` → work-unit 생성,
   `status.json` 초기화, `evidence_ladder.required_level` 설정, PR(label `next:design`)
2. `wm-design` wake → `design-mobile-design-handoff`(+Stitch) → `01-design/` → review
3. `wm-arch` → `02-architecture/` + 계약 co-sign (02/03 병렬 그룹)
4. `wm-api` → `packages/contracts` + `apps/api` 구현 → Railway preview 배포 + smoke
5. `wm-mobile-dev` → `apps/mobile` 구현(TDD) → RN Web Playwright 자가 검증 → 코드 PR
6. `wm-qa` (PR webhook으로 wake) → in-pod Playwright RN Web 증거 →
   `EXPO_TOKEN`으로 EAS cloud build + cloud Maestro 트리거 → `ingest-eas-evidence.mjs` →
   `05-qa-release/` 완성
7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단

**단절점 표** (오늘 이 트레이스가 끊기는 지점과 수선 위치):

| # | 단절점 | 수선 | 위치 |
| --- | --- | --- | --- |
| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
| B4 | EXPO_TOKEN/Railway/ADC가 예시로만 존재 | Secret 실주입 런북 | ops |
| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
| B8 | 고객 인입 경로 미정의 | generic adapter → `wm-po` 룸 + 인입 포맷 문서 | annex + 이 repo 문서 |

### C-6. 장애/에스컬레이션 모델

- **게이트 실패 루프**: check failure webhook → `wm-qa` 실패 분류(`failure-classification.md`,
  소유 역할 지명) → NATS `HANDOFF ... next=<owner>` → 동일 `wu/*` 브랜치에서 수정 → 재검.
  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
- **정체 감지**: 이 repo의 scheduled workflow(cron)가 무활동 N시간 초과 `wu/*` PR에
  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
  동일 — 감지는 판단이 아니다.
- **인간 에스컬레이션**: webhook gateway의 메시징 adapter로 `ESCALATE` 태그 메시지를
  인간 채널로 fan-out. 트리거: production submit, 결제/PII/법무, failed-gate 위험 수용,
  재시도 소진, 해소 불가 blocker.

---

## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)

이 절은 **요구사항 명세**다. 플랫폼 repo 직접 수정은 이 repo의 정책 범위 밖이며
(`12-ref-organization-goal-plan.md` Out of scope 원칙과 동일), 플랫폼 운영자가 이 절만
읽고 구현 가능해야 한다. 이 절의 모든 항목(이미지 빌드/푸시, webhook 규칙, pod 생성,
Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
ops 요구사항 annex로만 유지한다.

1. **이미지 `clawpod/agent-mobile` (+`:lite`)**: C-3 명세. arm64(OrbStack)/amd64 동시 빌드.
   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
   headless로 동작하고 Playwright가 통과; `eas whoami`가 robot token으로 성공;
   base 대비 증가분 합리적 수준(<~1.5Gi).
2. **webhook gateway 규칙**: C-4의 3종. label 기반 라우팅이 rules engine에 없으면 라벨
   파싱 연산자 추가 필요(요구사항으로 전달).
3. **agent 생성 payload 6종**(admin API): 이름/모델/자원(C-1 표), ConfigMap 4파일(C-2),
   Secret 키 목록(값은 redacted) — 런북에 템플릿으로 기록.
4. **k8s Secret 실주입 런북**: `GITHUB_TOKEN`(역할별), `EXPO_TOKEN`(QA), `RAILWAY_TOKEN`(API),
   Google ADC(Design). 값 출력/커밋 금지 규칙 준수.
5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
   validator), release environment protection(인간 reviewer), 역할별 bot 계정.

---

## Part E. 실행 순서와 최종 검증 드릴

### E-0. 실행 범위 결정 (2026-06-10 scope review 반영)

scope review(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`,
`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
실행 범위를 다음과 같이 한정한다.

- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
  스크립트의 fixture self-test·스키마 설계)까지.
- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.

### E-1. 순서

| 단계 | 내용 | 차원 |
| --- | --- | --- |
| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
| 8 | 최종 드릴 | 전체 |

3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
live EAS 실증은 승인·토큰 주입 후로 분리한다.

### E-2. 최종 수용 기준 (드릴)

합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:

- 전 stage `status.json`이 합법 전이만으로 `done` 도달
- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
- 모든 required check green, `06-gatekeeper/`는 CI 전사만 포함
- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)

보조 드릴: ① 임의 pod kill 후 GitHub만으로 상태 복원 ② 고의 테스트 실패 → 3회 재시도 →
`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.

## 리스크와 한계 (명시)

- `status.json` 병합 충돌(02/03 병렬): append-only events + stage별 브랜치 규약으로 완화,
  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
- EAS robot token 발급·GitHub↔EAS 연동은 본질적으로 1회 인간 셋업이다 — 자동화 약속이
  아니라 기록되는 human gate로 관리한다.
- 로컬 harness가 pod 실행을 증명하지 않는다는 기존 한계(`AGENTS.md` Local harness scope)는
  유지된다 — pod 실측 검증은 E-1 3단계/8단계의 운영 드릴이 담당한다.

## Human Gates (이 계획 자체)

다음은 인간 승인 없이 진행하지 않는다:

- 플랫폼 repo 직접 수정(annex는 요구사항 전달까지만)
- production submit 자동화 또는 release human gate 약화
- 역할별 GitHub bot 계정/토큰 발급, EAS robot token 발급
- 6 pod 동시 생성에 따르는 비용 확정

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba REPO_OPERATIONS.md | sed -n '1,150p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Repo Operations
     2
     3	This document is the canonical root-owned operating policy for this repository.
     4	It explains where repo-wide operating rules live and how validators enforce
     5	them. It does not replace `AGENTS.md` as the mandatory agent instruction
     6	entrypoint, and it does not replace `PROJECT_ENVIRONMENT.md` as the current
     7	runtime facts document.
     8
     9	## Policy Ownership Map
    10
    11	| Path | Owner Role |
    12	| --- | --- |
    13	| `AGENTS.md` | Mandatory agent execution rules, constraints, runtime paths, and required gates. |
    14	| `PROJECT_ENVIRONMENT.md` | Current runtime and environment facts. |
    15	| `REPO_OPERATIONS.md` | Canonical repo-wide operating policy and policy ownership model. |
    16	| `team-doc/mobile-app-dev-team/` | Team, role, process, reference, and migration documentation. |
    17	| `team-doc/00-source/` | Immutable Confluence source/export evidence. |
    18	| `team-doc/10-structured/` | Generated or structured reference layer, not current policy owner. |
    19	| `scripts/` | Executable validation and test tooling, not policy owner. |
    20
    21	When these documents conflict, use the narrowest authoritative owner:
    22	`AGENTS.md` for agent instructions, `PROJECT_ENVIRONMENT.md` for runtime facts,
    23	this file for repo-wide operating policy, and role/team docs for role-specific
    24	process detail.
    25
    26	## Document Strata
    27
    28	- Root policy and runtime files are the current canonical layer for repo-wide
    29	  operations.
    30	- Team docs describe how roles, processes, evidence, and migrations work within
    31	  the mobile app development team.
    32	- `team-doc/00-source/` preserves source/export evidence and should not be
    33	  rewritten as current operating policy.
    34	- `team-doc/10-structured/` remains a generated/reference layer until a
    35	  separately approved migration or archive plan changes that status.
    36
    37	Do not delete, rewrite, or migrate `team-doc/00-source/` or
    38	`team-doc/10-structured/` only because scripts or documents reference them.
    39	Classify each reference first as current invariant, source/export integrity,
    40	generated/reference traceability, migration evidence, or accidental coupling.
    41
    42	## Source And Archive Rules
    43
    44	`team-doc/00-source/` is immutable source/export evidence by default. If it is
    45	ever moved or archived, the change must preserve `pageId`, source version,
    46	`fetchedAt`, `sourceUrl`, and an explicit archive/sourcePath strategy before
    47	the original path is removed.
    48
    49	`team-doc/10-structured/` is generated/reference material by default. It may be
    50	used as migration input, historical examples, or generated integrity evidence,
    51	but it is not the canonical owner of current repo-wide policy. A migration plan
    52	must classify each structured reference before moving, rewriting, archiving, or
    53	dropping it.
    54
    55	## OpenClaw And Codex Operational Boundaries
    56
    57	Pod-native OpenClaw skills use `/workspace/skills/<slug>/SKILL.md` at runtime
    58	and are authored under `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/`.
    59	Repo-local Codex skills and agents use `.agents/skills/<skill-name>/SKILL.md`
    60	and `.codex/agents/<agent-name>.toml`.
    61
    62	### Codex-only Repo Work Policy
    63
    64	For OpenClaw pods operating on a Codex-managed repository, repository work must
    65	be routed through Codex CLI. The pod-local AGENTS.md policy should stay
    66	agent-neutral and describe `this agent`, `assistant`, or `the agent`, not a
    67	specific personal name. Codex-managed paths are listed in
    68	`/workspace/CODEX_MANAGED_PATHS.md`, and the repository checkout path for this
    69	project is `/workspace/new-mobile-app/`. The default Codex hook wrapper is
    70	`/workspace/codex-hooks/codex-run` when available.
    71
    72	Do not print or commit auth tokens, API keys, OAuth tokens, refresh tokens,
    73	passwords, or full secret-bearing config contents. Reports must use redacted
    74	status, presence, file mode, and key-name summaries only.
    75
    76	## Evidence Gates
    77
    78	Done requires linked evidence, not status-only prose. For runtime and docs
    79	changes, run the applicable gates from `AGENTS.md` and keep command output with
    80	exit status in evidence.
    81
    82	## Package Script Composition
    83
    84	Active runtime composition:
    85
    86	```text
    87	pnpm run validate
    88	pnpm run validate:repo-operations
    89	pnpm run validate:team-doc
    90	pnpm run test:hooks
    91	```
    92
    93	`pnpm run test:runtime` must compose those active current team/runtime gate
    94	checks. It must not include archive/reference corpus validation as a hidden
    95	runtime requirement.
    96
    97	Archive/reference corpus validation is explicit:
    98
    99	```text
   100	pnpm run validate:team-doc-archive
   101	```
   102
   103	Run `validate:team-doc-archive` when changing, moving, archiving, regenerating,
   104	or auditing `team-doc/00-source/`, `team-doc/10-structured/`, `_meta` source
   105	maps, or migration crosswalks. Do not treat that command as proof that the
   106	legacy Confluence-shaped corpus is current team/runtime SoT.
   107
   108	Runtime path or harness changes must also run `pnpm run test:local-harness`
   109	unless a source-backed blocker is reported.
   110
   111	Local validation and local harness evidence prove repo-local rules only. They do
   112	not prove actual OrbStack/OpenClaw pod execution, Jira or Confluence behavior,
   113	GitHub branch protection, EAS production submit, or external platform state.
   114
   115	## Validator Responsibility Model
   116
   117	Validators enforce documented policy; they are not the policy owner.
   118
   119	- `scripts/validate-repo-operations.mjs` validates root policy ownership,
   120	  `AGENTS.md` linkage, package script composition, and selected cross-document
   121	  operating-policy invariants.
   122	- `scripts/validate-team-doc.mjs` validates current managed team docs,
   123	  role/process documents, active repo-local skill and agent contracts, pod-native
   124	  skill documentation, and current migration documents. It must not require
   125	  `team-doc/00-source/` or `team-doc/10-structured/` as active current
   126	  team/runtime inputs.
   127	- `scripts/validate-team-doc-archive.mjs` validates archive/reference integrity
   128	  for `team-doc/00-source/`, `team-doc/10-structured/`, `_meta` source maps,
   129	  generated-reference shape, legacy Confluence-shaped corpus checks, and
   130	  migration crosswalk traceability.
   131	- `scripts/generate-team-doc.mjs` is legacy Confluence-shaped corpus generation
   132	  and migration tooling. It is not current team/runtime validation.
   133	- Package scripts compose subvalidators explicitly. Do not rely on hidden
   134	  coupling in a monolithic validator to preserve gate strength.
   135
   136	Future validator changes must keep required gates explicit in `package.json`
   137	and must include reviewer evidence before removing or demoting an existing check.

hook: PostToolUse
hook: PostToolUse Completed
codex
검증 중에 한 가지 제약이 있습니다. 세션 계획 파일은 repo 밖 `~/.claude/plans`에 있어 현재 read-only workspace 권한으로 직접 열 수 있는지 확인 중이며, 열리지 않으면 사용자가 제공한 요약 범위 안에서만 판단하겠습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md | sed -n '120,260p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md | sed -n '260,520p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
   120	}
   121	```
   122
   123	  - state enum: `pending | in-progress | review | gate-failed | blocked-human | done | not-applicable`
   124	  - 합법 전이: `pending→in-progress→review→done`; `review→gate-failed→in-progress`(attempts+1);
   125	    `any→blocked-human`(human_gates 항목 필수); `pending→not-applicable`(사유+PRD non-goal 참조 필수)
   126	  - `events`는 append-only — validator가 타임스탬프 단조 증가와 git base 대비 prefix 보존을 검사
   127	  - validator 규칙: `done`은 산출물 실재 + reviewer envelope `GO` 재검증
   128	    (`codex-headless-review.mjs`의 envelope validator 재사용) + handoff 링크 필수;
   129	    `06-gatekeeper` stage는 role이 `gatekeeper-system`이어야 하고 reviewer agent 지정 금지
   130	    (비-LLM 불변식); 선행 stage 미완료 시 `in-progress` 금지 — 단 `02-architecture`와
   131	    `03-contract-api`는 `01-design`이 `review` 도달 후 병렬 허용(명시적 `parallel_groups` 상수)
   132	- **수용 기준**: `--self-test` 통과(invalid fixture가 명명된 사유로 실패),
   133	  `pnpm run test:runtime` green, 샘플 work-unit 검증 통과.
   134
   135	### PR2 (P0) — Human-gate 결정 envelope: `human-gate/v1`
   136
   137	- **WHY**: G5. reviewer가 `NEEDS_HUMAN`을 낼 수는 있으나 해제 레코드가 없으면 자율
   138	  파이프라인은 영구 정지한다. 승인을 기계 판독 가능 + 감사 가능하게 만들어야
   139	  `blocked-human → in-progress` 재개를 validator가 안전하게 허용할 수 있다.
   140	- **WHAT**: `docs/plans/work-units/<id>/00-product-planning/human-gates/<gate-id>.json`
   141	  및 릴리스 승인 `05-qa-release/human-approval.json`. 검증은 PR1 validator에 통합.
   142	  `06-gates-and-evidence.md`에 규범 절 1개 추가.
   143	- **HOW** — 스키마 핵심 필드: `gate_id`, `category`(기존 human gate 카테고리 enum),
   144	  `decision ∈ approved|rejected|deferred`, `scope`, `decided_by{name,contact,channel}`,
   145	  `decision_reference`(GitHub comment/review URL — 신뢰 앵커), `decided_at`,
   146	  `residual_risk[]`, `evidence_links[]`.
   147	  - 결정적 anti-self-approval: `decided_by.name`이 역할명/agent명 목록과 일치하면 거부
   148	  - `failed-gate-risk` 카테고리는 실패한 check 참조 필수
   149	  - 한계 명시: 진위 보장은 GitHub 계정 신원에 앵커된 **정책 수준**이지 암호학적 증명이
   150	    아니다. 온라인 시 orchestrator가 `gh api`로 작성자 확인 후 work-unit event에
   151	    `verified: true | unverifiable-offline` 기록.
   152	- **수용 기준**: fixture 4종(정상 / agent명 승인자 / 미정의 category / failed-gate-risk
   153	  참조 누락) 검증; `blocked-human` stage가 approved 결정 파일 존재 시에만 재개 가능.
   154
   155	### PR3 (P0) — 오케스트레이션: next-action resolver + `wm-orchestrate` skill
   156
   157	- **WHY**: G2. 상태(PR1)와 승인(PR2)이 기계화되면 "다음 액션"은 순수 함수다.
   158	  LLM이 아니라 스크립트가 결정해야 Gatekeeper 결정성 원칙과 일관된다. LLM(skill)은
   159	  결정된 액션의 *실행*만 담당한다.
   160	- **WHAT**:
   161	  - `scripts/work-unit-next.mjs`: `status.json` + 파일시스템 → 다음 액션 JSON 출력.
   162	    `--apply-transition <stage> <state>`는 공유 모듈을 통해서만 상태를 기록(불법 전이는
   163	    기록 시점에 거부 — validate 시점이 아니라).
   164	  - `.agents/skills/wm-orchestrate/SKILL.md`: 어느 역할 pod든 실행하는 단일 진입 skill.
   165	    절차 = pull → resolver 실행 → 자기 역할(`WM_ROLE`) 몫 필터 → 해당 역할 skill 호출 →
   166	    reviewer를 `codex-headless-review.mjs`로 실행 → 전이 적용 → commit/push/PR 갱신.
   167	  - 하드 규칙(SKILL.md 명문): 타 역할 액션 실행 금지, reviewer envelope/human-gate 파일
   168	    수정 금지(pending 요청 생성만 허용), resolver가 `blocked`만 반환하면 정지·보고.
   169	- **HOW** — resolver 출력 계약(요지): `next_actions[]`(stage, role, action ∈
   170	  produce-artifacts | run-reviewer | fix-findings | request-human-gate |
   171	  run-deterministic-checks, skills[], reviewer_required, attempts_remaining)와
   172	  `blocked[]`(사유: human-gate-pending 등). stage→reviewer 매핑은
   173	  `04-skills-and-agents-matrix.md`를 따른다(00→po-planning-reviewer, 01→design-reviewer,
   174	  02/03→wm-contract-reviewer, 04→wm-implementation-reviewer, 05→QA 증거 검사,
   175	  06→결정적 검사만). 재시도 정책: `gate-failed` 시 `wm-gate-fix-advisor` advisory 첨부,
   176	  `max_attempts`(기본 3) 소진 시 `failed-gate-risk` human-gate pending 자동 생성.
   177	- **수용 기준**: fixture로 8 stage 행복 경로, 02/03 병렬, 재시도, 재시도 소진 에스컬레이션,
   178	  human-gate 차단/재개 전부 커버; `--apply-transition` 불법 전이 거부 단위 테스트;
   179	  sample work-unit 사본으로 stage 00 dry-run이 로컬에서 headless reviewer까지 완주.
   180
   181	### PR4 (P0, PR1~3과 병렬 가능) — Pod 부트스트랩 계약
   182
   183	- **WHY**: G4. live pod 실측상 pod에는 Node 22/git/Chromium이 있고
   184	  `/workspace/skills/codex-cli-auth-setup`이 이미 동작 패턴으로 존재한다
   185	  (`09-pod-native-openclaw-skill-plan.md`). 같은 패턴으로 "역할 부트스트랩"을 추가하고,
   186	  macOS 전용인 preflight를 pod에서 동작하게 확장하면 된다.
   187	- **WHAT**:
   188	  - `scripts/codex-preflight.mjs`에 `--pod` 모드: codex 후보 경로에 `which codex` +
   189	    `CODEX_BIN` env 추가, arch 판정을 `uname -m` 우선으로 교체(기존 macOS 경로 유지),
   190	    검사 항목 추가 — node major 22, pnpm `9.15.9` pin 일치(**불일치 시 fail** — boram 실측
   191	    10.33.3 근거), git identity, `gh auth status`,
   192	    Chromium 존재(`rn-web-capable`), `.codex/config.toml` 파싱 + `codex mcp list` 종료코드,
   193	    역할 컨텍스트 fixture 존재. 출력에 `capabilities` 블록:
   194	    `{ "rn_web_e2e": bool, "native_e2e_local": false, "eas_cloud": <EXPO_TOKEN 존재 여부 status-only> }`.
   195	    auth token 값은 출력하지 않음(기존 codex-cli-auth-setup 가드 계승).
   196	  - pod-native skill 소스 `09-pod-native-openclaw-skills/pod-role-bootstrap/`
   197	    (`SKILL.md` + `scripts/pod-bootstrap.sh` + `references/report-template.md`):
   198	    역할 해석(`WM_ROLE` env 우선, fallback `/workspace/IDENTITY` 1행, 불일치 시 hard fail) →
   199	    repo clone(주입 토큰; `infra/clawpod/agent-runner.yaml`의 initContainer 패턴 재사용) →
   200	    corepack으로 pnpm `9.15.9` 활성화(pin mismatch 해소) → `pnpm install --frozen-lockfile` →
   201	    `codex-preflight --pod --json` → 역할 skill 디렉토리
   202	    실재 확인 → 보고서를 `/workspace/state/`에 기록.
   203	  - `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 소스 등록(기존
   204	    codex-cli-auth-setup 검사 패턴 확장; shell script secret-출력 금지 regex 포함).
   205	- **수용 기준**: preflight `--self-test`에 Linux형 fixture 추가 통과; 노트북에서
   206	  `--pod`는 우아하게 skip; validate:team-doc이 skill 소스 누락/secret 출력 시 실패.
   207
   208	### PR5 (P1) — 네이티브 E2E 전략: EAS cloud 일차 경로 + 증거 사다리
   209
   210	- **WHY**: G3. in-pod emulator는 **명시적으로 기각**한다 — KVM/중첩 가상화가 pod 런타임에
   211	  없고(실측), 대규모 병렬은 `AGENTS.md:46`의 직렬화 원칙과도 충돌한다. 반면 이 repo에는
   212	  이미 자율화 가능한 cloud 경로가 잠들어 있다: `eas.json`의 `e2e-test` 프로파일
   213	  (credential-less Android APK + iOS simulator)과 `e2e-test-android.yml`의 cloud Maestro
   214	  job. 빠진 것은 ① robot token 인증의 pod-native 표준화 ② 결과를 `.evidence/`로 끌어오는
   215	  ingestion ③ "어느 수준의 증거가 언제 필수인가"의 규범이다.
   216	- **WHAT**:
   217	  - 신규 문서 `14-native-e2e-strategy.md` — 증거 사다리(evidence ladder) 규범:
   218	    - L0 `jest`: 항상 (CI)
   219	    - L1 `rn-web`: RN Web + Playwright, 모든 UI 작업 필수. pod 내 Chromium으로 실행 가능
   220	      (RN Web이 검증하지 못하는 범위는 `PROJECT_ENVIRONMENT.md` Mobile Web E2E 절을 따름)
   221	    - L2 `eas-maestro`: EAS cloud build + cloud Maestro. native module/권한/네비게이션
   222	      컨테이너/release candidate 접촉 시 필수
   223	    - L3 `human-device`: mobile-mcp/실기기 QA — `human-gate/v1` 결정으로 기록, production
   224	      submit 전 필수
   225	    - stage 00에서 Product/Planning이 `status.json.evidence_ladder.required_level` 설정,
   226	      `validate-work-units.mjs`가 `05-qa-release` 완료 전 `achieved_level >= required_level`
   227	      또는 `failed-gate-risk` waiver 존재를 강제
   228	    - `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder다
   229	      (boram SoT check 증거 문서에 기록) — runtime env가 아니므로 L2 실행 전에 appId
   230	      파라미터화/주입 방안을 이 문서에서 규정해야 한다
   231	  - pod-native skill `09-pod-native-openclaw-skills/eas-robot-auth-setup/`:
   232	    `EXPO_TOKEN` 존재 status-only 확인, `npx eas-cli whoami` 종료코드, `EAS_PROJECT_ID`
   233	    링크 확인. 값 출력 절대 금지. token은 `infra/clawpod/secret.example.yaml` 패턴으로 주입.
   234	  - `scripts/ingest-eas-evidence.mjs`: eas-cli JSON 출력(`eas build:view --json` 등, 버전
   235	    핀 고정 — `@latest` 금지 정책 준수) → `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-eas-<slug>/result.json`
   236	    (build id, commit SHA, Maestro flow 결과, artifact URL, 종료 상태) + `05-qa-release/`
   237	    요약 블록 생성. URL query token redaction. 네트워크 없는 `--self-test`(녹화 fixture).
   238	  - `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(트리거 → 폴링 → ingest →
   239	    실패 분류).
   240	  - iOS는 Android 경로 검증 후 후속(P2)으로 `e2e-test-ios.yml` 추가 — 본 계획 범위 외로 명시.
   241	- **수용 기준 (오프라인 — 선행 실행 가능)**: ingest `--self-test` 통과(녹화 fixture, 네트워크 0)
   242	  + 캐노니컬 증거 경로 패턴 일치; ladder 강제 validator 동작; `14-native-e2e-strategy.md`가
   243	  `validate:team-doc` 통과.
   244	- **수용 기준 (live — human/ops 승인 후에만)**: **실증 1회**(인간이 `EXPO_TOKEN`/
   245	  `EAS_PROJECT_ID`/GitHub-EAS 연동을 승인·주입 → PR에서 `e2e-test-android.yml` 실행 →
   246	  증거 ingest). 승인·주입 전에는 `eas whoami`를 포함한 어떤 EAS 명령도 실행하지 않으며,
   247	  native 검증 완료를 주장하지 않는다.
   248
   249	### PR6 (P1) — SoT refresh / drift 자동 검출
   250
   251	- **WHY**: G6. 에이전트 조직은 문서를 SoT로 신뢰하므로 drift는 조용한 오작동의 최대
   252	  원인이다. placeholder를 "수동 절차 + 자동 검출"의 명시적 정책으로 전환한다.
   253	- **WHAT**:
   254	  - `package.json:20`의 placeholder를 `node scripts/sot-snapshot-check.mjs`로 교체:
   255	    `evals/local-harness/sot/snapshot.json` 스키마/page-ID 목록 일치 검증 + `refreshed_at`
   256	    30일 초과 경고(경고만, CI 비차단). 실제 re-fetch는 Atlassian MCP 수동/에이전트 절차로
   257	    `evals/local-harness/README.md`에 규범화(네트워크·MCP 인증이 CI-unsafe하므로).
   258	  - `scripts/validate-project-environment.mjs`(오프라인, `test:runtime` 포함):
   259	    `PROJECT_ENVIRONMENT.md`의 핀 vs 실파일 — `packageManager`, expo/react-native/nativewind
   260	    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,

 succeeded in 0ms:
   260	    /tailwind/playwright 버전(`apps/mobile/package.json`), lightningcss override,
   261	    MCP 핀(`.codex/config.toml`), CI trigger 경로 목록(`quality-gate.yml` 정규식) 일치 검사.
   262	    `--online` 모드(PR 게이트 제외): Railway QA API `/livez`·`/readyz` 응답 확인.
   263	  - `.github/workflows/sot-drift.yml`: 주간 cron, `--online` + snapshot age 검사,
   264	    drift 시 GitHub issue 생성/갱신(비차단 — PR 게이트는 오프라인·결정적 유지).
   265	- **수용 기준**: 핀을 한 곳만 수정한 mutated fixture에서 실패; PR 게이트 네트워크 무의존.
   266
   267	### PR7 (P2) — 하드닝: Stitch preflight, mobile-mcp 핀 drift, 증거 위생
   268
   269	- **WHY**: G7, G8. 모두 실패를 실행 시점에서 사전점검 시점으로 당기는 작업.
   270	- **WHAT**:
   271	  - `codex-preflight --pod`에 design 역할 한정 블록: ADC 파일/`GOOGLE_APPLICATION_CREDENTIALS`
   272	    존재, `GOOGLE_CLOUD_PROJECT` 비어있지 않음, `stitch-mcp` 핀 버전 resolve — 전부
   273	    status-only, 값 출력 금지.
   274	  - mobile-mcp: `.codex/config.toml` 핀 vs `PROJECT_ENVIRONMENT.md` 표기 drift 검사
   275	    (오프라인, PR6 validator에 포함). 실행 검사를 CI에 넣지 않음(`AGENTS.md:46` 준수).
   276	  - `scripts/validate-evidence-hygiene.mjs`(`test:runtime` 포함): `.evidence/e2e-test/`
   277	    디렉토리명 `^\d{8}-\d{6}-[a-z0-9-]+$` 강제, 금지 경로(`local/`, `tmp/`, `raw/`, `*.log`)의
   278	    커밋 차단(`.gitignore` 일치 확인), `.evidence/` + `docs/plans/work-units/` 전체에
   279	    secret 패턴 스캔(`validate-team-doc.mjs:236-243` 패턴 모듈을 공유 모듈로 추출해 재사용).
   280	- **수용 기준**: 현재 트리 통과; planted-secret fixture가 파일+라인으로 실패;
   281	  비-design 역할 preflight는 Stitch 블록 skip.
   282
   283	---
   284
   285	## Part C. Pod 조직 설계 (boram 패턴 재사용)
   286
   287	### C-1. 토폴로지 — 역할당 1 pod, 총 6 pod + CI Gatekeeper
   288
   289	| Pod 이름(요청명) | Operating Role | 이미지 | 자원 | 비고 |
   290	| --- | --- | --- | --- | --- |
   291	| `wm-po` | Product/Planning | agent-mobile **lite** | 2 CPU / 4Gi | 문서/계획 중심, GUI 불필요 |
   292	| `wm-design` | Design | agent-mobile **full** | 2 CPU / 4Gi | Stitch MCP + 시각 확인용 Chromium/noVNC |
   293	| `wm-arch` | Mobile Architect | agent-mobile **lite** | 2 CPU / 4Gi | 리뷰/계약 co-sign 중심 |
   294	| `wm-mobile-dev` | Mobile App Dev | agent-mobile **full** | **4 CPU / 8Gi** | Metro bundler + pnpm install + Chromium 동시 부하가 boram 기준(2C/4Gi) 초과 |
   295	| `wm-api` | Backend/API Integrator | agent-mobile **lite** | 2 CPU / 4Gi | Hono/Drizzle + Railway 배포 |
   296	| `wm-qa` | QA/Release | agent-mobile **full** | **4 CPU / 8Gi** | Playwright 스크린샷 증거 + EAS/Maestro cloud 트리거 |
   297
   298	근거와 결정:
   299
   300	- **1역할 1pod**: `10-github-artifact-workflow.md`가 역할 격리 + GitHub-only handoff를
   301	  전제하고, reviewer agent 분리(`.codex/agents/*-reviewer.toml`)가 행위자 분리를 가정한다.
   302	  플랫폼은 agent당 ConfigMap/Secret/StatefulSet을 이미 지원하므로(검증) 추가 인프라가 없다.
   303	- **Gatekeeper는 pod가 아니다**: `01-team-composition.md`의 비-LLM 결정성 원칙. GitHub
   304	  Actions required check(`quality-gate.yml` + PR1/PR7 validator)가 Gatekeeper의 실체이며,
   305	  work-unit의 `06-gatekeeper/` 파일은 CI 결과의 *전사*다 — LLM이 pass/fail을 판단하지 않는다.
   306	- **별도 PM/오케스트레이터 pod를 만들지 않는다**: Product/Planning이 SoT상 intake·routing·
   307	  readiness 소유자(Authority Level: Executive / Delivery Lead)다. 7번째 LLM 조정자는 SOUL
   308	  미정의 역할을 신설하는 것이고, PR3의 resolver가 결정적이므로 조정 "판단"이 필요한 지점은
   309	  이미 `wm-po`의 권한 범위다.
   310	- 비용 제약 시 `wm-po`+`wm-arch`(둘 다 문서/리뷰 중심)는 1 pod 2 IDENTITY로 축약 가능하나,
   311	  1단계에서는 6 pod를 유지한다(라우팅 규칙 단순화 + 리뷰 행위자 분리).
   312
   313	### C-2. 프로비저닝 내용 (ConfigMap / Secret / skills)
   314
   315	**ConfigMap** (`{AGENT_ID}-agent-config`, boram과 동일 메커니즘):
   316
   317	- `SOUL.md`: `02-role-souls/<role>-soul.md` 그대로 (runtime template note 준수)
   318	- `IDENTITY.md`: Display Title, Operating Role, 소유 stage(예: QA/Release →
   319	  `05-qa-release/`), 상류/하류 역할, NATS 룸 규약
   320	- `AGENTS.md`(pod용): boram 베이스 + **GitHub handoff protocol 절** 추가 — repo URL,
   321	  `/workspace/repo`로 clone-on-demand, 브랜치 규약 `wu/<work-unit-id>/<stage>`,
   322	  `docs/plans/work-units/<work-unit-id>/` 스키마 요약, 그리고 핵심 규칙
   323	  "로컬 파일/채팅으로 핸드오프 금지 — push된 branch/PR + NATS 신호만 유효"
   324	- `TOOLS.md`: boram 베이스(filesystem, playwright, memory, a2a, skill-store) + 역할 추가분
   325
   326	**Secret** (최소 권한 원칙):
   327
   328	| Pod | Secret 키 |
   329	| --- | --- |
   330	| 전체 6 pod | `OPENAI_CODEX_AUTH_JSON`(boram 검증 패턴), `GITHUB_TOKEN`(repo 한정 fine-grained; 역할별 bot 계정 분리 권장 — PR 리뷰/승인 귀속성) |
   331	| `wm-qa`만 | `EXPO_TOKEN`(EAS robot, `infra/clawpod/secret.example.yaml` 패턴), Railway 헬스체크용 read 토큰 |
   332	| `wm-api`만 | `RAILWAY_TOKEN`(배포) — `qa-railway-workflow`가 "배포는 API, 증거는 QA"로 분리되는 가장 깨끗한 구도 |
   333	| `wm-design`만 | Stitch용 Google ADC |
   334
   335	**`/workspace/skills`** (pod-native): 전 pod에 `codex-cli-auth-setup` +
   336	`pod-role-bootstrap`(PR4); `wm-qa`에 `eas-robot-auth-setup`(PR5).
   337	repo-local `.agents/skills`/`.codex/agents`는 clone 후 자동 가용이므로 ConfigMap에
   338	중복 탑재하지 않는다.
   339
   340	### C-3. 이미지/툴체인 요구 (요지 — 상세는 Part D annex)
   341
   342	`clawpod/agent-mobile` (base 이미지 파생):
   343
   344	- 추가: pnpm **pin 강제** — 현재 이미지에는 pnpm 10.33.3이 이미 탑재되어 있으므로(boram
   345	  실측 증거) 설치가 아니라 `corepack enable` + `pnpm@9.15.9` 활성화로 SoT pin과 일치시키고,
   346	  부트스트랩/preflight는 불일치 시 fail. eas-cli(전역), maestro CLI(**cloud 업로드
   347	  모드 전용** — 로컬 드라이버 불필요), watchman(장시간 `expo start --web` 세션의
   348	  file-watch 안정성), repo lockfile로 pnpm store warm-up 레이어
   349	- **명시적 제외**: Android SDK / adb / emulator 이미지 — KVM 부재로 사용 불가하며
   350	  이미지만 ~수 GiB 비대화. 네이티브는 EAS cloud로 일원화(PR5 근거)
   351	- `lite` 변형(po/arch/api용): base lite + pnpm + gh만
   352
   353	### C-4. 조정(coordination) 모델 — "GitHub가 상태, NATS는 초인종"
   354
   355	- **GitHub = 유일한 durable handoff**: `10-github-artifact-workflow.md` SoT 그대로.
   356	  어떤 pod가 죽어도 clone + `status.json`(PR1)만으로 전체 상태 복원.
   357	- **NATS 팀 룸 = wake-up 신호**: 단일 팀 룸(boram의 룸 구독 메커니즘 재사용)에 구조화
   358	  신호만: `HANDOFF work-unit=<id> stage=<stage> pr=<url> next=<role>`. 신호 유실은
   359	  webhook 경로가 보완하므로 신뢰성 요구 없음.
   360	- **A2A = 동기 Q&A 전용**: 예) dev pod가 api pod에 계약 필드 질의. pod AGENTS.md에 규칙
   361	  명문화 — "A2A로 도달한 결정은 work-unit 디렉토리에 기록되어야만 유효". 플랫폼 한도
   362	  (동시 sub-agent 4, 메시지 depth 5) 준수.
   363	- **Webhook gateway 규칙 3종**(GitHub adapter, ops 설정):
   364	  1. PR opened/synchronized + label `next:<role>` → 해당 역할 pod 룸으로 라우팅
   365	  2. check_suite failure (`wu/*` 브랜치) → `wm-qa`(실패 분류 소유) + stage 소유 pod
   366	  3. PR merged (`wu/*`) → `wm-po` (stage 전진/종결)
   367
   368	### C-5. E2E 실행 트레이스와 단절점
   369
   370	"고객이 기능 X를 요청"의 전체 경로:
   371
   372	1. 인입 → `wm-po` 룸 (webhook gateway generic adapter 또는 운영 채널) →
   373	   `po-prd-to-execution` + `po-work-unit-planning-and-agent-sprint` → work-unit 생성,
   374	   `status.json` 초기화, `evidence_ladder.required_level` 설정, PR(label `next:design`)
   375	2. `wm-design` wake → `design-mobile-design-handoff`(+Stitch) → `01-design/` → review
   376	3. `wm-arch` → `02-architecture/` + 계약 co-sign (02/03 병렬 그룹)
   377	4. `wm-api` → `packages/contracts` + `apps/api` 구현 → Railway preview 배포 + smoke
   378	5. `wm-mobile-dev` → `apps/mobile` 구현(TDD) → RN Web Playwright 자가 검증 → 코드 PR
   379	6. `wm-qa` (PR webhook으로 wake) → in-pod Playwright RN Web 증거 →
   380	   `EXPO_TOKEN`으로 EAS cloud build + cloud Maestro 트리거 → `ingest-eas-evidence.mjs` →
   381	   `05-qa-release/` 완성
   382	7. Gatekeeper(CI) → required check 결정적 판정 → `06-gatekeeper/`에 전사
   383	8. Human release gate → `human-approval.json`(PR2) 승인 전까지 production submit 차단
   384
   385	**단절점 표** (오늘 이 트레이스가 끊기는 지점과 수선 위치):
   386
   387	| # | 단절점 | 수선 | 위치 |
   388	| --- | --- | --- | --- |
   389	| B1 | pnpm pin mismatch(pod 10.33.3 vs SoT 9.15.9) → frozen-lockfile 설치 신뢰 불가 | pod-role-bootstrap의 corepack pin + preflight mismatch fail (+이미지 핀 정렬) | PR4 + annex |
   390	| B2 | GitHub 자격증명/identity 미주입 → push/PR 불가 | 역할별 Secret + pod-role-bootstrap | ops + PR4 |
   391	| B3 | webhook 규칙 없음 → QA가 PR에 깨어나지 못함 | 규칙 3종 등록 | annex (ops 설정) |
   392	| B4 | EXPO_TOKEN/Railway/ADC가 예시로만 존재 | Secret 실주입 런북 | ops |
   393	| B5 | work-unit 상태/증거 required check 부재 → Gatekeeper가 부분적으로 선언적 | PR1/PR2/PR7 validator + branch protection | 이 repo |
   394	| B6 | EAS 트리거·ingest 실행 경로 부재 | PR5 | 이 repo |
   395	| B7 | human gate 통지 채널 부재 | required reviewer/environment protection + 에스컬레이션 | 이 repo + ops |
   396	| B8 | 고객 인입 경로 미정의 | generic adapter → `wm-po` 룸 + 인입 포맷 문서 | annex + 이 repo 문서 |
   397
   398	### C-6. 장애/에스컬레이션 모델
   399
   400	- **게이트 실패 루프**: check failure webhook → `wm-qa` 실패 분류(`failure-classification.md`,
   401	  소유 역할 지명) → NATS `HANDOFF ... next=<owner>` → 동일 `wu/*` 브랜치에서 수정 → 재검.
   402	  재시도 예산 stage당 3회(PR1 `max_attempts`) — 소진 시 `failed-gate-risk` human-gate 자동
   403	  생성(PR3). "실패 게이트의 위험 수용"은 LLM 권한 밖(QA SOUL 금지 조항 준수).
   404	- **정체 감지**: 이 repo의 scheduled workflow(cron)가 무활동 N시간 초과 `wu/*` PR에
   405	  stale 코멘트 → webhook → `wm-po` wake. 결정적 계층(CI)에 두는 이유는 Gatekeeper 철학과
   406	  동일 — 감지는 판단이 아니다.
   407	- **인간 에스컬레이션**: webhook gateway의 메시징 adapter로 `ESCALATE` 태그 메시지를
   408	  인간 채널로 fan-out. 트리거: production submit, 결제/PII/법무, failed-gate 위험 수용,
   409	  재시도 소진, 해소 불가 blocker.
   410
   411	---
   412
   413	## Part D. OpenClaw cloud 플랫폼 요구사항 Annex (이 repo 외부)
   414
   415	이 절은 **요구사항 명세**다. 플랫폼 repo 직접 수정은 이 repo의 정책 범위 밖이며
   416	(`12-ref-organization-goal-plan.md` Out of scope 원칙과 동일), 플랫폼 운영자가 이 절만
   417	읽고 구현 가능해야 한다. 이 절의 모든 항목(이미지 빌드/푸시, webhook 규칙, pod 생성,
   418	Secret/token 발급·주입, branch protection, release environment protection, bot 계정)은
   419	**인간/ops 승인이 기록되기 전에는 실행하지 않는다** — repo 실행 항목이 아니라
   420	ops 요구사항 annex로만 유지한다.
   421
   422	1. **이미지 `clawpod/agent-mobile` (+`:lite`)**: C-3 명세. arm64(OrbStack)/amd64 동시 빌드.
   423	   수용 기준 — full 이미지에서 `pnpm install && pnpm -F mobile exec expo start --web`가
   424	   headless로 동작하고 Playwright가 통과; `eas whoami`가 robot token으로 성공;
   425	   base 대비 증가분 합리적 수준(<~1.5Gi).
   426	2. **webhook gateway 규칙**: C-4의 3종. label 기반 라우팅이 rules engine에 없으면 라벨
   427	   파싱 연산자 추가 필요(요구사항으로 전달).
   428	3. **agent 생성 payload 6종**(admin API): 이름/모델/자원(C-1 표), ConfigMap 4파일(C-2),
   429	   Secret 키 목록(값은 redacted) — 런북에 템플릿으로 기록.
   430	4. **k8s Secret 실주입 런북**: `GITHUB_TOKEN`(역할별), `EXPO_TOKEN`(QA), `RAILWAY_TOKEN`(API),
   431	   Google ADC(Design). 값 출력/커밋 금지 규칙 준수.
   432	5. **GitHub 측 ops**: `main` branch protection + required checks(quality-gate + PR1/PR7
   433	   validator), release environment protection(인간 reviewer), 역할별 bot 계정.
   434
   435	---
   436
   437	## Part E. 실행 순서와 최종 검증 드릴
   438
   439	### E-0. 실행 범위 결정 (2026-06-10 scope review 반영)
   440
   441	scope review(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`,
   442	`...-rereview-20260610.md`, verdict NO_GO → 본 정정으로 해소 대상)와 운영자 피드백에 따라
   443	실행 범위를 다음과 같이 한정한다.
   444
   445	- **즉시 실행 가능 (repo 내부, 오프라인)**: 본 문서 fact 정정 → PR1 → PR2 → PR3,
   446	  PR4(정정 후 병렬 가능), PR6/PR7, PR5의 오프라인 작업(전략 문서·증거 사다리·ingest
   447	  스크립트의 fixture self-test·스키마 설계)까지.
   448	- **human/ops 승인 기록 후에만**: Part D 전체(이미지 빌드/푸시, webhook 라우팅, pod 생성,
   449	  Secret/token 발급·주입, branch protection, release environment protection, bot 계정),
   450	  PR5 live EAS 실증(`eas whoami` 포함 모든 EAS 실행), multi-pod rollout 드릴.
   451	- **항상 금지**: production submit 자동화, release human gate 약화(`human-approval` 부재 =
   452	  release 차단 유지), Gatekeeper를 pod/LLM/custom agent/SOUL.md 소유자로 모델링,
   453	  RN Web/Railway 증거의 native 증거 대체 취급, 로컬 harness/소스 리뷰의 실제
   454	  OrbStack/OpenClaw 실행·branch protection·EAS submit·webhook 동작 증명 취급.
   455
   456	### E-1. 순서
   457
   458	| 단계 | 내용 | 차원 |
   459	| --- | --- | --- |
   460	| 1 | PR1 → PR2 → PR3 (오케스트레이션 코어) | repo |
   461	| 2 | PR4 (부트스트랩; 1과 병렬 가능) | repo |
   462	| 3 | annex 1 이미지 빌드 + `wm-po`/`wm-mobile-dev` 2 pod 선행 생성, clone/push/PR 검증 (B1·B2 해소 확인) | 플랫폼/ops |
   463	| 4 | required check 등록 (B5) — Gatekeeper 실체화 | repo+ops |
   464	| 5 | 나머지 4 pod + webhook 규칙 (B3·B8) | ops |
   465	| 6 | PR5 + EXPO_TOKEN 주입 + 실증 1회 (B4·B6) | repo+ops |
   466	| 7 | PR6, PR7, 에스컬레이션/정체 감지 (B7) | repo |
   467	| 8 | 최종 드릴 | 전체 |
   468
   469	3·5·6단계와 4단계의 ops 부분(branch protection 등), 8단계 multi-pod 드릴은
   470	**human/ops 승인 기록 후에만** 진행한다(E-0). PR5는 오프라인 repo 작업을 먼저 진행하고
   471	live EAS 실증은 승인·토큰 주입 후로 분리한다.
   472
   473	### E-2. 최종 수용 기준 (드릴)
   474
   475	합성 기능 요청 1건을 `wm-po`에 주입했을 때, **human release gate 전까지 인간 개입 0회**로:
   476
   477	- 전 stage `status.json`이 합법 전이만으로 `done` 도달
   478	- RN Web Playwright 증거(스크린샷 포함) + EAS build ID가 포함된 `eas-evidence` 산출
   479	- 모든 required check green, `06-gatekeeper/`는 CI 전사만 포함
   480	- `human-approval.json` 부재 상태에서 release 진행이 차단됨(차단이 곧 성공 조건)
   481
   482	보조 드릴: ① 임의 pod kill 후 GitHub만으로 상태 복원 ② 고의 테스트 실패 → 3회 재시도 →
   483	`failed-gate-risk` human-gate 자동 생성 → 인간 채널 ESCALATE 도달 ③ 정체 PR stale 감지.
   484
   485	## 리스크와 한계 (명시)
   486
   487	- `status.json` 병합 충돌(02/03 병렬): append-only events + stage별 브랜치 규약으로 완화,
   488	  최종 병합 책임은 `wm-po` — PR1 문서에 규칙 명문화.
   489	- human-gate 진위는 GitHub 계정 신원 앵커의 **정책 수준** 보증이다(암호학적 아님).
   490	- EAS robot token 발급·GitHub↔EAS 연동은 본질적으로 1회 인간 셋업이다 — 자동화 약속이
   491	  아니라 기록되는 human gate로 관리한다.
   492	- 로컬 harness가 pod 실행을 증명하지 않는다는 기존 한계(`AGENTS.md` Local harness scope)는
   493	  유지된다 — pod 실측 검증은 E-1 3단계/8단계의 운영 드릴이 담당한다.
   494
   495	## Human Gates (이 계획 자체)
   496
   497	다음은 인간 승인 없이 진행하지 않는다:
   498
   499	- 플랫폼 repo 직접 수정(annex는 요구사항 전달까지만)
   500	- production submit 자동화 또는 release human gate 약화
   501	- 역할별 GitHub bot 계정/토큰 발급, EAS robot token 발급
   502	- 6 pod 동시 생성에 따르는 비용 확정

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md | sed -n '1,120p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Pod Organization E2E Improvement Plan
     2
     3	## 목적
     4
     5	이 문서는 boram-\* 샘플과 같은 OpenClaw cloud pod로 6역할 LLM 모바일 개발 조직을 구성하고,
     6	그 조직이 이 template runtime repo를 사용해 고객 요청부터 릴리스 직전 human gate까지의
     7	모바일 앱 개발 lifecycle을 **무인으로(E2E)** 수행할 수 있게 만들기 위한 상세 개선 계획이다.
     8
     9	- 문서 분류: 현재 프로젝트 기준 improvement plan (09-, 11-, 12- 계획 문서와 동일한 계층)
    10	- 소유 역할: Product/Planning (계획), Mobile Architect (기술 검토), QA/Release (검증 경로)
    11	- 이 문서는 정책 SoT가 아니다. 충돌 시 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`,
    12	  `REPO_OPERATIONS.md`, `team-doc/mobile-app-dev-team/00-sot-and-principles.md`가 우선한다.
    13
    14	## 조사 방법과 근거 출처
    15
    16	이 계획은 다음 세 가지 검증된 조사에 기반한다.
    17
    18	1. **이 repo 전수 조사**: root 정책 문서, `.agents/skills`(11개), `.codex/agents`(13개),
    19	   `.codex/hooks`(5개), `scripts/` validator 9종, `.github/workflows/quality-gate.yml`,
    20	   `apps/mobile`, `apps/api`, `packages/contracts`, `infra/clawpod/`,
    21	   `docs/plans/work-units/sample-role-handoff/`, `.evidence/` 구조.
    22	2. **OpenClaw cloud 플랫폼 repo 조사** (외부 플랫폼 repo `openclaw-cloud`):
    23	   admin API의 agent 생성 플로우(agent-orchestrator: ConfigMap/Secret/Service/StatefulSet 생성),
    24	   pod entrypoint 14단계 초기화, NATS JetStream 메시징(`CHAT_MESSAGES.{roomId}`),
    25	   A2A MCP 서버(:18789), webhook gateway(GitHub adapter 포함 10종), agent 이미지 구성.
    26	3. **live 샘플 pod 실측** (OrbStack k8s, namespace `clawpod`, `boram-vf7sbm-agent-0`):
    27	   OpenClaw 런타임 + `openai-codex/gpt-5.5` 모델, ConfigMap 주입된
    28	   SOUL.md/AGENTS.md/TOOLS.md/IDENTITY.md, `/workspace/skills`(codex-cli-auth-setup 포함),
    29	   Node 22/git/yarn/Chromium 존재. pnpm은 **10.33.3이 존재하나 repo SoT pin
    30	   `pnpm@9.15.9`(`package.json`의 `packageManager`)와 불일치**하고,
    31	   eas-cli/maestro/Android SDK/adb/emulator/Java/mobile-mcp는 부재, `/dev/kvm`도 없다 —
    32	   checked-in 증거: `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md`.
    33	   canary pod도 동일 구성으로 추정되나 repo에 직접 증거가 남아 있는 것은 boram이다.
    34	   `~/.codex/auth.json` 존재(Secret `OPENAI_CODEX_AUTH_JSON` 주입).
    35
    36	---
    37
    38	## Part A. 현재 상태 진단
    39
    40	### A-1. 이미 동작이 검증된 것
    41
    42	| 영역 | 검증된 사실 | 근거 |
    43	| --- | --- | --- |
    44	| 역할 조직 | 6 LLM 역할 + 비-LLM Gatekeeper 모델, 역할별 SOUL.md 템플릿 | `01-team-composition.md`, `02-role-souls/` |
    45	| Codex 런타임 | repo-local skill 11종, custom agent 13종(verdict reviewer + advisory researcher), hook 5종, MCP(mobile-mcp@0.0.58/serena@v1.5.3/stitch@1.3.2/expo) | `.agents/skills/`, `.codex/agents/`, `.codex/config.toml`, `PROJECT_ENVIRONMENT.md` Codex runtime 절 |
    46	| 게이트 | CI `quality-gate.yml`: `test:runtime` + `turbo lint test` + 조건부 `test:local-harness`; reviewer JSON envelope 검증(`codex-headless-review.mjs`) | `.github/workflows/quality-gate.yml`, `scripts/codex-headless-review.mjs` |
    47	| 핸드오프 | pod-isolated 역할 간 durable handoff는 GitHub branch/commit/PR + `docs/plans/work-units/<work-unit-id>/` 전용 | `10-github-artifact-workflow.md` |
    48	| 수직 슬라이스 | home counter가 contracts import, NativeWind, Jest, RN Web Playwright, Maestro flow, EAS 프로파일 경로를 증명 | `apps/mobile/src/app/index.tsx`, `apps/mobile/.maestro/home.yml`, `apps/mobile/eas.json` |
    49	| EAS 빌딩블록 | `e2e-test` 프로파일(credential-less Android APK + iOS simulator, `apps/mobile/eas.json:7`)과 cloud Maestro job(`apps/mobile/.eas/workflows/e2e-test-android.yml`의 `type: maestro`, `flow_path: ['.maestro/home.yml']`) 정의 존재 | 해당 파일 |
    50	| Pod 플랫폼 | agent 1개 = ConfigMap + Secret + Service + StatefulSet(+ `/workspace` 10Gi PVC) 패턴, NATS 룸 구독, A2A, webhook gateway 라우팅 — live pod로 27시간+ 무중단 실측 | 플랫폼 repo + live pod 실측 |
    51	| Pod 내 웹 E2E 기반 | pod 이미지에 Chromium 내장 → RN Web + Playwright 실행 가능 | live pod 실측, `.evidence/e2e-test/20260609-233244-rn-web-railway-api/` |
    52
    53	### A-2. 검증된 갭 (개선 대상)
    54
    55	| # | 갭 | 근거 | 영향 |
    56	| --- | --- | --- | --- |
    57	| G1 | **work-unit에 기계 판독 상태 없음**: `10-github-artifact-workflow.md`는 stage별 산출물 스키마만 정의. 어떤 stage가 진행 중인지, 다음 행동 주체가 누구인지, 게이트 실패 횟수가 몇인지 기록하는 구조가 없음 | `docs/plans/work-units/sample-role-handoff/`에 상태 파일 부재; `validate-team-doc.mjs`는 문서 텍스트만 검증 | pod가 재시작 후 GitHub만으로 상태를 복원할 수 없고, 어떤 스크립트도 "다음 액션"을 결정 불가 → 자율 파이프라인의 근본 결손 |
    58	| G2 | **오케스트레이션 주체 없음**: skill 11종이 각 역할의 "어떻게"는 정의하지만 "지금 누가 무엇을"은 어디에도 없음 | `.agents/skills/` 전수 확인; `05-work-processes.md`는 산문 | 인간이 매 stage마다 다음 역할을 호출해야 함 |
    59	| G3 | **네이티브 E2E 자동 경로 부재**: mobile-mcp는 local 전용·serial·CI 게이트 금지(`AGENTS.md:46`), Maestro는 device/emulator 필요, pod에는 KVM이 없어 emulator 불가(live pod 실측: Android SDK/adb/emulator 부재). EAS `e2e-test` 프로파일과 cloud Maestro workflow는 존재하지만 robot token 인증 절차와 결과 증거 수집이 미자동화 | `AGENTS.md:46`, `apps/mobile/eas.json:7`, `apps/mobile/.eas/workflows/e2e-test-android.yml`, `infra/clawpod/secret.example.yaml`(EXPO_TOKEN 예시만 존재) | QA/Release pod가 native 증거를 자율 생산 불가 |
    60	| G4 | **pod 부트스트랩 계약 부재**: `codex-preflight.mjs`가 macOS 전제 — codex 후보 경로가 `/opt/homebrew/bin/codex`, `/usr/local/bin/codex`(`scripts/codex-preflight.mjs:8`), arch 판정이 `sysctl -n hw.optional.arm64`(`scripts/codex-preflight.mjs:67`). Linux pod에서 결정적으로 실패. 역할 배정(어느 pod가 어느 역할인지) 규약도 없음 | 해당 파일 | 새 pod가 "나는 역할 X이고 준비됐다"를 스스로 증명할 수 없음 |
    61	| G5 | **human-gate가 기계 판독 불가**: reviewer envelope의 `NEEDS_HUMAN` verdict는 존재하지만(`scripts/codex-headless-review.mjs`), 차단을 *해제*하는 인간 승인 레코드 스키마가 없음. `human-gates.md`/`human-approval.md`는 산문 파일 | `06-gates-and-evidence.md` human gate 절, sample work-unit | `NEEDS_HUMAN` 이후 파이프라인이 자동 재개 불가 |
    62	| G6 | **SoT drift 무방비**: `test:local-harness:sot-refresh`가 placeholder(`package.json:20`의 `echo "NOT IMPLEMENTED..."`). `PROJECT_ENVIRONMENT.md`의 버전 핀·Railway URL·CI trigger 목록과 실제 파일(lockfile, `.codex/config.toml`, `quality-gate.yml`) 간 일치를 자동 검사하는 장치 없음 | `package.json:20` | 에이전트가 SoT로 신뢰하는 문서가 조용히 낡음 |
    63	| G7 | **Stitch 사전점검 부재**: stitch MCP는 Google Cloud ADC + 프로젝트 설정 필요(`PROJECT_ENVIRONMENT.md` MCP 절)인데 preflight가 검사하지 않음 → Design pod가 실행 실패 시점에야 발견 | `PROJECT_ENVIRONMENT.md` | Design stage 자율성 저하 |
    64	| G8 | **증거 위생 자동 검증 부재**: 증거 네이밍 규칙·금지 경로·secret 금지(`06-gates-and-evidence.md`)가 문서로만 존재하고 `.evidence/`/`docs/plans/work-units/` 실파일 검사는 없음(단, `validate-team-doc.mjs:236-250`이 team-doc 한정 secret 스캔은 수행) | 해당 파일 | 증거 무결성이 규율에만 의존 |
    65	| G9 | **pod 인프라 갭** (플랫폼 측): ① agent 이미지의 pnpm **pin mismatch**(pod 10.33.3 vs repo SoT `packageManager: pnpm@9.15.9`) — corepack pin 활성화/검증 없이는 frozen-lockfile 설치를 신뢰할 수 없음 ② eas-cli/maestro 없음 ③ GitHub 자격증명 주입·git identity 설정 패턴 없음(boram Secret에는 모델 인증만 존재) ④ webhook gateway에 이 repo PR 이벤트 → 역할 pod 라우팅 규칙 없음 ⑤ 고객 인입(intake) 경로 미정의 | `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` + 플랫폼 repo 조사 | ①은 PR4(부트스트랩 pin 강제)로, 나머지는 Part D annex로 해소 |
    66
    67	### A-3. 진단 요약
    68
    69	조직 설계·역할 계약·게이트·증거 규율은 성숙해 있으나, 그것을 **구동하는 결정적
    70	(deterministic) 상태·해석기·부트스트랩 계층이 없다**. 즉 "역할이 일하는 방법"은 완성됐고
    71	"조직이 스스로 도는 방법"이 미완성이다. 아래 개선은 전부 이 한 문장으로 수렴한다:
    72	**committed repo 상태만으로 다음 액션이 계산되고, 어떤 pod든 그 계산 결과 중 자기 역할
    73	몫만 실행하게 만든다.** 이는 `10-github-artifact-workflow.md`의 "shared storage 없음,
    74	GitHub만이 durable" 원칙과 `01-team-composition.md`의 "Gatekeeper는 비-LLM 결정적 검사"
    75	원칙의 직접 연장이며, 새 인프라 발명이 아니라 기존 원칙의 기계화다.
    76
    77	---
    78
    79	## Part B. Repo 측 개선 (PR 슬라이스 7개, 의존성 순)
    80
    81	모든 PR은 repo 규칙을 따른다: TDD/validator-first(`AGENTS.md` Required rules),
    82	신규 validator는 `package.json` script + `quality-gate.yml`의 스크립트 정규식 +
    83	`PROJECT_ENVIRONMENT.md` CI 절에 **3중 배선**, 계획·증거는 `.evidence/`에 기록.
    84
    85	### PR1 (P0) — Work-unit 상태머신: `status.json`
    86
    87	- **WHY**: G1. pod-isolated 조직에서 유일한 durable 입력은 committed 파일이므로
    88	  상태도 committed 파일이어야 한다. reviewer verdict가 이미 JSON envelope로 기계화되어
    89	  있는 것(`codex-headless-review.mjs`)과 동일한 패턴을 stage 상태로 확장하는 것.
    90	- **WHAT**:
    91	  - `docs/plans/work-units/<work-unit-id>/status.json` (schema `wu-status/v1`)
    92	  - `scripts/lib/work-unit-machine.mjs` — 상태 enum/전이표/병렬 그룹 공유 모듈
    93	  - `scripts/validate-work-units.mjs` (+ `evals/local-harness/work-units/` fixture:
    94	    valid 1, 불법 전이 1, envelope 누락 1, gatekeeper에 reviewer 지정 1)
    95	  - `docs/plans/work-units/sample-role-handoff/status.json` 샘플 추가
    96	  - 3중 배선 (`test:runtime`에 포함, quality-gate 정규식에 `validate-work-units` 추가)
    97	- **HOW** — 스키마 핵심:
    98
    99	```json
   100	{
   101	  "schema_version": "wu-status/v1",
   102	  "work_unit": "<work-unit-id>",
   103	  "stages": [
   104	    {
   105	      "id": "00-product-planning",
   106	      "role": "product-planning",
   107	      "state": "done",
   108	      "attempts": 1,
   109	      "max_attempts": 3,
   110	      "required_artifacts": ["..."],
   111	      "reviewer": { "agent": "po-planning-reviewer", "verdict": "GO",
   112	                    "envelope_path": "00-product-planning/reviewer-envelope.json" },
   113	      "handoff": { "branch": "wu/<id>/00-planning", "pr": "<pr-url>" }
   114	    }
   115	  ],
   116	  "human_gates": [ { "gate_id": "...", "category": "...", "blocking_stage": "...",
   117	                     "state": "pending", "decision_path": "..." } ],
   118	  "evidence_ladder": { "required_level": "eas-maestro", "achieved_level": "rn-web" },
   119	  "events": [ { "at": "<iso8601>", "actor": "<role>", "type": "stage-completed", "stage": "..." } ]
   120	}

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba .evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md | sed -n '1,150p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Orbstack Boram Linux SoT Check
     2
     3	- Date: 2026-06-09
     4	- Scope: check whether local Orbstack `boram-*` pod can be used for Linux/Android E2E verification.
     5	- Result: Linux pod exists, but it is not currently an Android local E2E verification environment.
     6
     7	## Local Kubernetes Check
     8
     9	Current Kubernetes context:
    10
    11	```text
    12	orbstack
    13	```
    14
    15	Matching pod:
    16
    17	```text
    18	clawpod/boram-vf7sbm-agent-0   2/2   Running
    19	```
    20
    21	Pod containers:
    22
    23	```text
    24	agent
    25	ontology-bridge
    26	```
    27
    28	Pod details:
    29
    30	- Namespace: `clawpod`
    31	- Node: `orbstack`
    32	- Pod IP: `192.168.194.120`
    33	- Workload: `StatefulSet/boram-vf7sbm-agent`
    34	- `agent` container image: `clawpod/agent:local`
    35	- `ontology-bridge` container image: `clawpod-ontology-bridge:latest`
    36	- `agent` mounts `/workspace` as RW PVC.
    37	- `ontology-bridge` mounts `/workspace` as RO.
    38
    39	## Container Environment Check
    40
    41	`agent` container:
    42
    43	```text
    44	Linux boram-vf7sbm-agent-0 ... aarch64 GNU/Linux
    45	Ubuntu 24.04.4 LTS
    46	node v22.22.2
    47	pnpm 10.33.3
    48	git version 2.43.0
    49	no /dev/kvm
    50	java: not found
    51	adb: not found
    52	emulator: not found
    53	maestro: not found
    54	```
    55
    56	`ontology-bridge` container:
    57
    58	```text
    59	Linux boram-vf7sbm-agent-0 ... aarch64
    60	Alpine Linux 3.23.3
    61	node v22.22.1
    62	no /dev/kvm
    63	java: not found
    64	adb: not found
    65	emulator: not found
    66	maestro: not found
    67	```
    68
    69	Workspace check:
    70
    71	- `/workspace/projects` exists, but no checked-out `new-mobile-app` repo was found there.
    72	- No `pnpm-workspace.yaml`, `apps/mobile/eas.json`, or `.maestro/home.yml` for this repo was found under the pod workspace scan.
    73
    74	## SoT Comparison
    75
    76	Repo SoT requires:
    77
    78	- Mobile lint/test, `expo install --check`, `expo doctor`, and `codex mcp list` for mobile runtime changes.
    79	- Local `mobile-mcp` visual QA only when simulator/device is available.
    80	- Maestro smoke only when a usable target and executable app id exist.
    81	- Android local E2E needs Android SDK/platform tools, Android Emulator or USB device, Java 17+, Maestro CLI, and an executable Maestro `appId`.
    82
    83	Existing repo evidence also says:
    84
    85	- Android/Ubuntu can cover Android QA only when Android SDK, platform tools, KVM, and device/emulator prerequisites are configured.
    86	- The current Maestro flow still contains `appId: {{ANDROID_PACKAGE}}`, which is a project-generation placeholder, not a runtime env variable.
    87
    88	## Assessment
    89
    90	The Boram pod is usable as a general Linux execution container for limited tasks:
    91
    92	- shell commands
    93	- Node 22 execution
    94	- git operations
    95	- possibly JS-only checks after the repo is cloned/copied and the correct pnpm version is selected
    96
    97	The Boram pod is not currently usable for Android local E2E:
    98
    99	1. No `/dev/kvm`.
   100	2. CPU architecture is `aarch64`.
   101	3. No Android SDK/platform tools.
   102	4. No Android Emulator.
   103	5. No Java 17.
   104	6. No Maestro CLI.
   105	7. No Android device/emulator target.
   106	8. The current project repo is not mounted or cloned into `/workspace/projects`.
   107	9. The repo Maestro `appId` is still a generation-time placeholder.
   108
   109	## Decision
   110
   111	Using the Boram pod does not solve the Android E2E blocker today.
   112
   113	It can become useful for:
   114
   115	- deterministic Linux checks after repo checkout,
   116	- EAS cloud build/workflow orchestration if EAS auth and public client config are provided,
   117	- agent-runner style tasks that do not require local Android emulator/device access.
   118
   119	It should not be treated as local Android E2E evidence unless the pod is redesigned to include:
   120
   121	- a checked-out repo workspace,
   122	- Node/pnpm aligned to repo expectations,
   123	- Java 17+,
   124	- Android SDK/platform tools,
   125	- Maestro CLI,
   126	- a usable Android device path, such as USB device forwarding or a separate emulator host,
   127	- executable Maestro app-id handling.
   128
   129	For emulator-based Android E2E, this pod also needs a real virtualization/device strategy. Merely being a Linux pod is not enough.

hook: PostToolUse
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/99-source-map.md | sed -n '1,80p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Source Map
     2
     3	## Current Repo Sources
     4
     5	| Source | Use |
     6	| --- | --- |
     7	| `AGENTS.md` | Required repo rules, runtime paths, gate expectations, constraints |
     8	| `REPO_OPERATIONS.md` | Root-owned repo-wide operating policy, policy ownership map, source/archive rules, validator responsibility model |
     9	| `PROJECT_ENVIRONMENT.md` | Current Expo/RN/API/Codex runtime facts |
    10	| `.agents/skills/<slug>/SKILL.md` | Active repo-local skill contracts |
    11	| `.codex/agents/<agent>.toml` | Active custom agent contracts |
    12	| `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md` | Current pod-isolated GitHub artifact handoff workflow |
    13	| `team-doc/mobile-app-dev-team/12-ref-organization-goal-plan.md` | Goal and checkpoint plan for the reusable reference organization layer |
    14	| `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` | Improvement plan for running the team as OpenClaw cloud pods with autonomous mobile-app E2E |
    15	| `team-doc/mobile-app-dev-team/ref-organization/` | Reference organization reusable guidance, current-project examples, and migration crosswalk |
    16	| `team-doc/mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md` | File-by-file migration plan from `team-doc/10-structured/**` into `ref-organization/` |
    17	| `docs/plans/work-units/<work-unit-id>/` | Durable GitHub work-unit artifact root for role-pod handoff |
    18	| `team-doc/00-source/.../01-2-조직-구성과-역할-1373765682.md` | Original 6 LLM + Gatekeeper role source |
    19	| `team-doc/00-source/.../01-5-soul-md-템플릿-1373700138/` | Historical SOUL.md source pages |
    20
    21	## Historical Structured Inputs
    22
    23	| Source | Use |
    24	| --- | --- |
    25	| `team-doc/10-structured/03-skills/mvp-skill-matrix.md` | Historical skill matrix input; current active skill status is validated from `.agents/skills/` and `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`. |
    26	| `team-doc/10-structured/03-skills/case-coverage-registry.md` | Historical Case A-H process input; use `ref-organization/04-workflows-and-handoffs/scenario-overlays-a-h.md` for reusable guidance. |
    27
    28	## Display Title To Operating Role Crosswalk
    29
    30	| Display Title | Operating Role | Status | Handling |
    31	| --- | --- | --- | --- |
    32	| Chief Product Officer (CPO) / Product Delivery Lead | Product/Planning | Active display title | Top intake, scope/readiness, role routing, evidence expectation, and human-gate coordination. |
    33	| Product Designer | Design | Active display title | Design quality and Stitch-backed mobile handoff owner. |
    34	| Mobile Architect / Technical Lead | Mobile Architect | Active display title | Technical architecture, route/state, runtime, API impact, and releaseability review owner. |
    35	| Mobile App Developer | Mobile App Dev | Active display title | Expo React Native implementation owner for approved tasks. |
    36	| Backend/API Engineer | Backend/API Integrator | Active display title | Mobile-facing API contract and approved backend/API integration owner. |
    37	| QA/Release Engineer | QA/Release | Active display title | QA evidence and release readiness reporter. |
    38	| Release Gatekeeper (System) | Gatekeeper | Non-LLM deterministic gate | No SOUL.md, no custom agent, no human approval replacement. |
    39
    40	## active-vs-historical skill crosswalk
    41
    42	| Historical Source Name | Current Status | Current Handling |
    43	| --- | --- | --- |
    44	| `mobile-prd-to-execution` | historical source name | Current repo adapter is `po-prd-to-execution`. |
    45	| `mobile-requirement-office-hours` | historical source name | Current repo adapter is `po-requirement-office-hours`. |
    46	| `mobile-work-unit-planning-and-agent-sprint` | historical source name | Current repo adapter is `po-work-unit-planning-and-agent-sprint`. |
    47	| `mobile-planning-completeness-review` | historical source name | Current repo adapter is `po-planning-completeness-review`. |
    48	| `mobile-design-handoff` | historical source name | Current repo adapter is `design-mobile-design-handoff`. |
    49	| `mobile-api-contract` | historical source name | Do not list as active unless `.agents/skills/mobile-api-contract/SKILL.md` exists. Current active path is `mobile-backend-api-integrator-workflow` plus `packages/contracts`. |
    50	| `mobile-qa-release` | historical source name | Do not list as active unless `.agents/skills/mobile-qa-release/SKILL.md` exists. Current active QA skills are `e2e-test` and `qa-railway-workflow`. |
    51	| `mobile-gatekeeper` | historical deterministic concept | Not an LLM skill in the current managed docs. Treat as deterministic required-check concept. |
    52	| `mobile-project-bootstrap-workflow` | historical/planned source name | No active repo-local skill in current `.agents/skills`. Case A remains human/operator plus Product/Planning coordination. |
    53
    54	## Stale Or Lower-Priority Sources
    55
    56	`team-doc/10-structured/06-codex-runtime/runtime-boundary.md` may omit newer active skills such as `qa-railway-workflow`. When it conflicts with `PROJECT_ENVIRONMENT.md`, `.agents/skills`, or `team-doc/mobile-app-dev-team/04-skills-and-agents-matrix.md`, use current repo files as the stronger source.
    57
    58	## Reviewer Notes Incorporated
    59
    60	- Design owns design quality. Product/Planning P0/P1 records scope/evidence approval only.
    61	- Railway/RN Web evidence does not replace native Maestro/mobile-mcp or production release readiness.
    62	- `$wm routing` should distinguish current `wm-*`, `po-*`, `design-*` agents from legacy mobile-* agents.
    63	- Pod-isolated role agents must use GitHub branch/commit/PR artifacts under `docs/plans/work-units/<work-unit-id>/` for durable handoff; shared local storage is not assumed.

exec
/bin/zsh -lc "nl -ba team-doc/mobile-app-dev-team/README.md | sed -n '1,60p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# Mobile App Dev Team
     2
     3	이 폴더는 현재 `new-mobile-app` 프로젝트 기준의 관리용 팀 문서이다.
     4	이 폴더의 범위는 team/role/process/reference 문서이며, repo-wide operating
     5	policy의 소유자는 root의 `REPO_OPERATIONS.md`이다.
     6
     7	`team-doc/00-source/`는 Confluence 원본 export와 감사 기록을 보존하는 historical source이고, 이 폴더는 실제 운영자가 읽고 유지할 current SoT이다. 기존 source export 파일은 여기서 직접 수정하지 않는다.
     8
     9	## 문서 구조
    10
    11	| 파일 | 역할 |
    12	| --- | --- |
    13	| `00-sot-and-principles.md` | 현재 SoT, 관리 원칙, 금지 사항 |
    14	| `01-team-composition.md` | 팀 구성과 책임 경계 |
    15	| `02-role-souls/` | 6개 LLM 실무자별 SOUL.md 초안 |
    16	| `03-role-capability-matrix.md` | 역할별 능력, 산출물, 금지 범위 |
    17	| `04-skills-and-agents-matrix.md` | 현재 `.agents/skills`와 `.codex/agents` 매핑 |
    18	| `05-work-processes.md` | 실제 작업 프로세스 |
    19	| `06-gates-and-evidence.md` | 게이트, 검증, evidence 규칙 |
    20	| `07-new-team-template-guide.md` | 다른 개발팀 생성 시 재사용 절차 |
    21	| `10-github-artifact-workflow.md` | pod-isolated role agent의 GitHub PR 산출물 handoff 규칙 |
    22	| `12-ref-organization-goal-plan.md` | Reference organization 구성 goal/checkpoint 계획 |
    23	| `13-pod-organization-e2e-improvement-plan.md` | Pod 조직(boram-* 패턴)으로 모바일 앱 E2E를 무인 수행하기 위한 개선 계획 |
    24	| `ref-organization/` | Reference organization 재사용 가이드와 current-project example |
    25	| `99-source-map.md` | 근거 파일과 active/historical crosswalk |
    26
    27	## 운영 원칙
    28
    29	- 현재 repo 기준 사실은 `AGENTS.md`, `PROJECT_ENVIRONMENT.md`, `REPO_OPERATIONS.md`, `.agents/skills`, `.codex/agents`를 우선한다.
    30	- `team-doc/10-structured/`는 정리된 참조 자료로 사용하되, 실제 repo와 다르면 current repo 파일을 우선한다.
    31	- OpenClaw pod-native skill source는 `09-pod-native-openclaw-skills/`에서 관리한다.
    32	- Pod-isolated role agent 산출물은 `10-github-artifact-workflow.md`에 따라 GitHub branch/commit/PR과 `docs/plans/work-units/<work-unit-id>/`로 handoff한다.
    33	- Gatekeeper는 non-LLM deterministic required check이다. Gatekeeper SOUL.md는 만들지 않는다.
    34	- Reference organization 문서는 `ref-organization/`에서 관리하며, future team 재사용 가이드와 current-project example을 분리한다.

hook: PreToolUse
hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "sed -n '1,220p' /Users/tw.kim/.claude/plans/luminous-snacking-moler.md" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
# 실행 계획: 13번 개선 계획 fact 정정 + repo-side 개선(PR1~PR7) 오프라인 구현

**계획서 Path: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`** (보고 시 반드시 포함)

## Context

직전 사이클에서 `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`를 작성했고, 사용자 피드백 + repo에 커밋된 scope review 2건(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`, `...-rereview-20260610.md`, verdict **NO_GO**)이 다음을 요구한다:

1. **사실 정정 (HIGH, blocking)**: boram pod에 pnpm이 "없다"고 썼으나, checked-in 증거(`.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47`)는 **pnpm 10.33.3 존재**를 기록. repo SoT는 `pnpm@9.15.9`(package.json:5). 즉 문제는 "부재"가 아니라 **"pin mismatch"**. eas-cli/maestro/adb/emulator/Java/KVM 부재는 그대로 유효(같은 증거 49–53행). canary도 같은 버전으로 추정되나 직접 증거는 boram만 — 문서에 이렇게 기재.
2. **실행 범위 한정**: PR1·PR2·PR3·PR4·PR6·PR7 + PR5의 **오프라인 작업만** repo에서 실행 가능. Part D(이미지/웹훅/pod 생성/Secret/branch protection)는 ops 요구사항 annex로만 유지 — 실행 금지.
3. **금지 사항**: 토큰 발급/주입, live EAS 실행(`eas whoami` 포함), pod/이미지/웹훅 작업, production submit 자동화, release human gate 약화, Gatekeeper의 LLM화, RN Web 증거의 native 대체 취급, 로컬 검증의 pod 실행 증명 취급.

이번 실행의 산출물 = 문서 정정 1건 + repo 내부 구현 6묶음. 모든 단계는 외부 네트워크/자격증명 불필요(오프라인).

## 하드 가드레일 (전 단계 공통)

- 외부 플랫폼 repo·k8s·GitHub 설정 변경 없음. Secret/token 어떤 것도 발급·주입·출력하지 않음.
- `eas`/`railway`/`gh api` 등 인증 필요 명령 실행 금지. 모든 신규 스크립트는 `--self-test`(fixture 기반, 네트워크 0)로 검증.
- `human-approval.json` 부재 = release 차단은 불변식으로 validator에 인코딩.
- `06-gatekeeper` stage에 reviewer agent 지정 금지(비-LLM 불변식)를 validator에 인코딩.
- 신규 validator는 3중 배선: `package.json` scripts + `.github/workflows/quality-gate.yml`의 스크립트 정규식(line ~26) + `PROJECT_ENVIRONMENT.md` CI 절.
- team-doc 수정 시 "CTO" 단어 금지(validate-team-doc.mjs:1114-1124), secret 패턴 금지.
- validator-first(TDD): 각 phase에서 fixture/self-test를 먼저 작성.

## Phase 0 — 13번 문서 fact 정정 (선행, 단독 커밋)

`team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` 수정:

1. **조사 방법 3번** (live pod 실측 절): "모바일 툴체인 전무(pnpm/eas-cli/maestro/...)" → pnpm을 목록에서 제거하고 "pnpm 10.33.3 존재(repo pin 9.15.9와 **불일치**), eas-cli/maestro/Android SDK/adb/emulator/mobile-mcp 부재, /dev/kvm 부재" + 증거 경로 `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` 인용. canary는 동일 추정·직접 증거는 boram임을 명기.
2. **G9 갭 표**: "agent 이미지에 pnpm 없음 → pnpm install부터 실패" → "pnpm **pin mismatch**(pod 10.33.3 vs SoT 9.15.9) → corepack pin 활성화/검증 필요".
3. **C-3 이미지 요구**: "corepack enable + pnpm 9.15.9 핀" 표현을 "pnpm 핀 강제(현재 10.33.3 탑재 → 9.15.9로 corepack pin, 불일치 시 부트스트랩 fail)"로 정정.
4. **C-5 단절점 B1**: "pod에 pnpm 없음 → 5·6단계 시작 불가" → "pnpm 버전 불일치 → frozen-lockfile 설치 불안정. 수선: pod-role-bootstrap의 corepack pin + preflight mismatch fail".
5. **PR4 절**: pnpm 검사 문구를 "pnpm 9.15.9 pin 일치 검사 — mismatch 시 fail (boram 실측 10.33.3 근거)"로 보강.
6. **Part D 서두**: "이 절의 모든 항목은 인간/ops 승인 전 실행 금지"를 1문장 추가 (리뷰 finding 2·3 대응). Part E 표에 "3·5·6단계는 human/ops 승인 게이트 뒤"를 명시.
7. PR5 절에 추가 사실: `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder(위 증거 86행) — 오프라인 작업에 appId 파라미터화 방안 문서화 포함.

검증: `node scripts/validate-team-doc.mjs` + `pnpm run test:runtime`.

## Phase 1 — PR1: Work-unit 상태머신 (우선순위 1)

설계 상세는 13번 문서 Part B PR1 절을 따른다 (`wu-status/v1` 스키마, state enum 7종, 합법 전이표, 02/03 parallel_groups, append-only events).

생성/수정:
- `scripts/lib/work-unit-machine.mjs` — state enum, 전이표, stage 순서/병렬 그룹, 전이 적용 함수(불법 전이 throw). validator와 resolver가 공유.
- `scripts/validate-work-units.mjs` — `docs/plans/work-units/*/status.json` 검증: 스키마, stage id = 디렉토리 8종 일치, done 조건(산출물 실재 + reviewer envelope GO 재검증 + handoff 링크), gate-failed/attempts 규칙, gatekeeper 비-LLM 불변식, 선행 stage 규칙, secret 패턴 스캔. `--self-test` 모드.
  - reviewer envelope 재검증: `scripts/codex-headless-review.mjs`의 envelope 검증 로직 재사용(export 형태 확인 후 필요 시 공유 모듈로 추출 — 기존 `--self-test` 회귀 유지).
- fixtures: `evals/local-harness/work-units/`(valid / 불법 전이 / envelope 누락 / gatekeeper-with-reviewer 4종).
- `docs/plans/work-units/sample-role-handoff/status.json` 샘플 + 해당 README 갱신(필요 시).
- 3중 배선: `package.json`(`validate:work-units`를 `test:runtime` 체인에 추가), `quality-gate.yml` 정규식에 `validate-work-units` 추가, `PROJECT_ENVIRONMENT.md` CI 절 갱신.
- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`에 status.json 규범 절 추가(스키마 요약 + 02/03 병합 책임은 Product/Planning 명기).

## Phase 2 — PR2: Human-gate 결정 envelope (`human-gate/v1`)

설계 상세는 13번 문서 PR2 절.

- 스키마 구현은 `scripts/lib/work-unit-machine.mjs`(또는 동급 lib)에 추가, 검증 규칙은 `validate-work-units.mjs`에 통합: category enum(`06-gates-and-evidence.md`의 human gate 카테고리와 일치 — 구현 시 해당 문서에서 정확한 카테고리 목록 추출), decision enum, **anti-self-approval**(decided_by.name이 역할명/agent명과 일치 시 fail), `failed-gate-risk`는 실패 check 참조 필수, `decision_reference`는 GitHub URL 또는 committed path 필수.
- `blocked-human` stage는 approved 결정 파일 존재 시에만 재개 가능 — 전이 규칙에 인코딩.
- fixtures 4종(정상/agent명 승인자/미정의 category/참조 누락).
- `06-gates-and-evidence.md`에 규범 절 추가 + 한계 명시(GitHub 신원 앵커, 정책 수준).
- sample work-unit에 human-gate 예시 파일 추가.

## Phase 3 — PR3: next-action resolver + `wm-orchestrate` skill

설계 상세는 13번 문서 PR3 절.

- `scripts/work-unit-next.mjs`: status.json + 파일시스템 → `next_actions[]`/`blocked[]` JSON (순수 함수, work-unit-machine.mjs 공유). stage→skill/reviewer 매핑은 `04-skills-and-agents-matrix.md` 기준 상수. `--role <slug>` 필터, `--apply-transition <stage> <state>`(공유 모듈 경유, 불법 전이 거부). 재시도: gate-failed 시 fix-findings + `wm-gate-fix-advisor` 첨부, attempts 소진 시 `request-human-gate`(failed-gate-risk pending 생성).
- `.agents/skills/wm-orchestrate/SKILL.md`: 절차(pull → resolver → **자기 WM_ROLE 몫만** → 역할 skill → headless reviewer → 전이 → commit/push) + 하드 규칙(타 역할 실행 금지, envelope/human-gate 파일 수정 금지 — pending 생성만, blocked-only 시 정지·보고). 기존 skill 문서 형식(`.agents/skills/wm/SKILL.md` 등) 준수.
- fixtures: 행복 경로(8 stage), 02/03 병렬, 재시도 루프, 소진 에스컬레이션, human-gate 차단/재개.
- skill 추가에 따른 등록: `04-skills-and-agents-matrix.md`, `PROJECT_ENVIRONMENT.md` Codex runtime 절(repo skills 목록), `validate-runtime-artifacts.mjs`가 skill 목록을 강제하는지 확인 후 필요 시 갱신.
- 로컬 dry-run: sample work-unit 사본으로 stage 00 resolver→transition 경로 검증(reviewer는 self-test 모드).

## Phase 4 — PR4: Pod 부트스트랩 계약 (Phase 1~3과 병렬 가능, Phase 0 이후)

설계 상세는 13번 문서 PR4 절. **pnpm 검사는 "pin 9.15.9 일치, mismatch 시 fail"** (Phase 0 정정 반영).

- `scripts/codex-preflight.mjs` 확장: `--pod` 모드 — codex 후보 경로에 `which codex`/`CODEX_BIN` 추가, arch 판정 `uname -m` 우선(macOS sysctl fallback 유지, 기존 동작 무회귀), node 22/pnpm pin/git identity/`gh auth status` 종료코드/Chromium 존재/`codex mcp list` 종료코드/역할 컨텍스트 fixture 존재 검사, `capabilities` 블록(`rn_web_e2e`, `native_e2e_local: false`, `eas_cloud`: EXPO_TOKEN **존재 여부만** status-only). 노트북에서는 `pod: skipped`.
- 기존 `--self-test`에 Linux형 fixture 추가(`evals/local-harness/preflight/` 기존 fixture 패턴 확인 후 동일 형식).
- pod-native skill 소스 `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/`(SKILL.md + scripts/pod-bootstrap.sh + references/report-template.md): 역할 해석(WM_ROLE env 우선 → `/workspace/IDENTITY` fallback, 불일치 hard fail) → clone → corepack pin pnpm 9.15.9 → `pnpm install --frozen-lockfile` → preflight → 보고. 기존 `codex-cli-auth-setup/` 구조·secret 비출력 가드 동일 적용.
- `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 등록(기존 codex-cli-auth-setup 검사 패턴 확장), `09-pod-native-openclaw-skills/README.md` 갱신.
- 주의: 로컬 검증은 pod 실행 증명이 아님을 SKILL.md와 13번 문서에 유지.

## Phase 5 — PR6 + PR7: 하드닝

설계 상세는 13번 문서 PR6/PR7 절.

PR6:
- `package.json:20` placeholder → `node scripts/sot-snapshot-check.mjs`(스냅샷 스키마/page-ID 목록 vs `evals/local-harness/README.md`, age 30일 경고 — 비차단). 수동 refresh 절차를 `evals/local-harness/README.md`에 규범화.
- `scripts/validate-project-environment.mjs`(오프라인, test:runtime 포함): PROJECT_ENVIRONMENT.md 핀 vs `package.json`/`apps/mobile/package.json`/lockfile override/`.codex/config.toml`(mobile-mcp·serena·stitch 핀)/`quality-gate.yml` trigger 정규식 일치. `--online`(Railway /livez·/readyz)은 구현하되 **PR 게이트·이번 실행에서 호출하지 않음**.
- `.github/workflows/sot-drift.yml`(주간 cron, 비차단, issue 생성) — 파일 추가만; 동작 증명은 하지 않음(로컬 검증 한계 준수).

PR7:
- preflight `--pod`에 design 역할 한정 Stitch 블록(ADC 파일/GOOGLE_CLOUD_PROJECT/핀 resolve — 전부 status-only, 실행·인증 시도 없음. 네트워크 필요한 resolve 검사는 fixture로 self-test).
- `scripts/validate-evidence-hygiene.mjs`: `.evidence/e2e-test/` 디렉토리명 패턴, 금지 경로 커밋 차단, `.evidence/`+`docs/plans/work-units/` secret 스캔 — `validate-team-doc.mjs:236-243` 패턴을 공유 모듈(`scripts/lib/secret-patterns.mjs`)로 추출해 양쪽에서 재사용(기존 validate-team-doc 무회귀). planted-secret fixture.
- 현재 트리에서 hygiene 검사가 실패하는 기존 파일이 있으면: 수정하지 않고 보고 후 allowlist 여부를 사용자에게 확인(기존 증거 파일은 불변 원칙).

## Phase 6 — PR5: 네이티브 E2E **오프라인 작업만**

설계 상세는 13번 문서 PR5 절. **금지: eas 명령 실행, EXPO_TOKEN 관련 모든 실행, live proof, native 완료 주장.**

- `team-doc/mobile-app-dev-team/14-native-e2e-strategy.md`: 증거 사다리 L0~L3 규범, required_level 설정·강제 규칙, in-pod emulator 기각 근거(KVM 부재 — boram 증거 인용), `appId: {{ANDROID_PACKAGE}}` placeholder 처리 방안(파라미터화 요구사항), live proof는 "EXPO_TOKEN/EAS_PROJECT_ID/GitHub-EAS 연동 인간 승인 후"로 명시적 보류 표기. README/99-source-map에 14번 등록.
- `scripts/ingest-eas-evidence.mjs`: 입력은 **녹화된 fixture JSON**(eas build:view/workflow run 형태) → `.evidence/e2e-test/<ts>-eas-<slug>/result.json` + `05-qa-release/` 요약 블록. URL token redaction. `--self-test`만으로 전체 검증(네트워크 0). eas-cli 버전 핀은 상수로만 기록.
- pod-native skill 소스 `eas-robot-auth-setup/`: SKILL.md/스크립트는 작성하되 "실행은 ops 승인 + token 주입 후" 가드 문구 포함, 검사 전부 status-only 설계.
- `validate-work-units.mjs`에 evidence_ladder 강제 규칙 추가(achieved < required && waiver 없음 → 05 done 차단).
- `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(실행 전제 조건: 토큰 주입 완료 명시).

## 단계별 공통 검증

각 Phase 종료 시:
1. 신규 스크립트 `--self-test` 전부 통과
2. `pnpm run test:runtime` (validate + repo-operations + team-doc + hooks)
3. `pnpm turbo run lint test`
4. `pnpm run test:local-harness` — `.agents/**`, `scripts/*validation*`, preflight 등 트리거 경로를 건드리므로 사실상 매 phase 필수
5. 세션 hook이 재생성한 루트 `CLAUDE.md`/`.claude`가 validate를 깨면 제거 후 재실행(이전 사이클에서 확인된 세션 아티팩트)

## 최종 보고 요건

- **계획서 Path 명시**: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`
- Phase별 산출 파일 목록 + 게이트 결과(명령·종료 상태)
- 실행하지 않은 것(금지 목록: pod/이미지/웹훅/토큰/live EAS/production submit)과 그 사유를 명시
- 후속 human/ops 승인 대기 항목 표(PR5 live proof, multi-pod rollout)

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse Completed
hook: PostToolUse Completed
exec
/bin/zsh -lc 'pnpm run test:runtime' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
hook: PostToolUse
hook: PostToolUse Completed
 exited 1 in 844ms:

> mobile-app-template@ test:runtime /Users/tw.kim/Documents/AGA/test/new-mobile-app
> pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks


> mobile-app-template@ validate /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node -e "require('node:fs').rmSync('.claude-state', { recursive: true, force: true })" && node scripts/validate-runtime-artifacts.mjs && node scripts/codex-headless-review.mjs --self-test

Validated 11 skills, 13 agents, and 4 hook events.
Codex headless review helper self-test passed.

> mobile-app-template@ validate:repo-operations /Users/tw.kim/Documents/AGA/test/new-mobile-app
> node scripts/validate-repo-operations.mjs

- REPO_OPERATIONS.md missing required repo operations term: TEAM_DOC_ARCHIVE_MANIFEST.json
- REPO_OPERATIONS.md missing required repo operations term: TEAM_DOC_ARCHIVE_BUNDLE.jsonl
- REPO_OPERATIONS.md missing required repo operations term: root-owned archive metadata
- REPO_OPERATIONS.md missing required repo operations term: root-owned archived content
- REPO_OPERATIONS.md missing required repo operations term: delete-ready
- scripts/validate-team-doc-archive.mjs missing required repo operations term: TEAM_DOC_ARCHIVE_MANIFEST.json
- scripts/validate-team-doc-archive.mjs missing required repo operations term: TEAM_DOC_ARCHIVE_BUNDLE.jsonl
- scripts/validate-team-doc-archive.mjs missing required repo operations term: readArchiveManifest
- scripts/validate-team-doc-archive.mjs missing required repo operations term: readArchiveBundle
- scripts/validate-team-doc-archive.mjs missing required repo operations term: crosswalk coverage
- scripts/validate-team-doc-archive.mjs includes forbidden duplicated repo policy term: listFiles('00-source'
- scripts/validate-team-doc-archive.mjs includes forbidden duplicated repo policy term: listFiles('10-structured'
- scripts/validate-team-doc-archive.mjs includes forbidden duplicated repo policy term: requiredArchiveDirs
 ELIFECYCLE  Command failed with exit code 1.
 ELIFECYCLE  Command failed with exit code 1.

codex
`pnpm run test:runtime`도 현재 워크스페이스에서 재확인했고, 제공된 관찰과 동일하게 `validate:repo-operations`에서 실패했습니다. 이 실패는 13번 계획의 적용 범위 판단을 바꾸기보다, 구현/PR 진행 전에 반드시 해소해야 하는 현재 게이트 상태로 보는 쪽이 SoT와 맞습니다.
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse
hook: PreToolUse Completed
hook: PreToolUse Completed
hook: PreToolUse Completed
exec
/bin/zsh -lc "nl -ba /Users/tw.kim/.claude/plans/luminous-snacking-moler.md | sed -n '120,260p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
exec
/bin/zsh -lc "nl -ba package.json | sed -n '1,80p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
   120	- 후속 human/ops 승인 대기 항목 표(PR5 live proof, multi-pod rollout)

 succeeded in 0ms:
     1	{
     2	  "name": "mobile-app-template",
     3	  "private": true,
     4	  "type": "module",
     5	  "packageManager": "pnpm@9.15.9",
     6	  "devDependencies": {
     7	    "turbo": "^2.9.16"
     8	  },
     9	  "pnpm": {
    10	    "overrides": {
    11	      "lightningcss": "1.30.1"
    12	    }
    13	  },
    14	  "scripts": {
    15	    "lint": "turbo run lint",
    16	    "test": "turbo run test",
    17	    "test:runtime": "pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks",
    18	    "test:local-harness:preflight": "node scripts/clean-tree-guard.mjs --self-test && node scripts/codex-preflight.mjs --self-test && node scripts/codex-preflight.mjs",
    19	    "test:local-harness": "pnpm run test:local-harness:preflight && pnpm run test:runtime && pnpm turbo run lint test && node scripts/test-local-harness.mjs --self-test --stage all && node scripts/test-local-harness.mjs --stage all",
    20	    "test:local-harness:sot-refresh": "echo \"NOT IMPLEMENTED: refresh evals/local-harness/sot/snapshot.json manually via Atlassian MCP page IDs recorded in evals/local-harness/README.md\"",
    21	    "validate": "node -e \"require('node:fs').rmSync('.claude-state', { recursive: true, force: true })\" && node scripts/validate-runtime-artifacts.mjs && node scripts/codex-headless-review.mjs --self-test",
    22	    "generate:team-doc-archive": "node scripts/create-team-doc-archive-manifest.mjs",
    23	    "validate:repo-operations": "node scripts/validate-repo-operations.mjs",
    24	    "validate:team-doc-archive": "node scripts/validate-team-doc-archive.mjs",
    25	    "validate:team-doc": "node scripts/validate-team-doc.mjs",
    26	    "test:hooks": "node scripts/test-hooks.mjs"
    27	  }
    28	}

hook: PostToolUse
hook: PostToolUse
exec
/bin/zsh -lc "nl -ba /Users/tw.kim/.claude/plans/luminous-snacking-moler.md | sed -n '1,120p'" in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
     1	# 실행 계획: 13번 개선 계획 fact 정정 + repo-side 개선(PR1~PR7) 오프라인 구현
     2
     3	**계획서 Path: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`** (보고 시 반드시 포함)
     4
     5	## Context
     6
     7	직전 사이클에서 `team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md`를 작성했고, 사용자 피드백 + repo에 커밋된 scope review 2건(`.evidence/reviews/pod-organization-e2e-improvement-plan-scope-review-20260610.md`, `...-rereview-20260610.md`, verdict **NO_GO**)이 다음을 요구한다:
     8
     9	1. **사실 정정 (HIGH, blocking)**: boram pod에 pnpm이 "없다"고 썼으나, checked-in 증거(`.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md:47`)는 **pnpm 10.33.3 존재**를 기록. repo SoT는 `pnpm@9.15.9`(package.json:5). 즉 문제는 "부재"가 아니라 **"pin mismatch"**. eas-cli/maestro/adb/emulator/Java/KVM 부재는 그대로 유효(같은 증거 49–53행). canary도 같은 버전으로 추정되나 직접 증거는 boram만 — 문서에 이렇게 기재.
    10	2. **실행 범위 한정**: PR1·PR2·PR3·PR4·PR6·PR7 + PR5의 **오프라인 작업만** repo에서 실행 가능. Part D(이미지/웹훅/pod 생성/Secret/branch protection)는 ops 요구사항 annex로만 유지 — 실행 금지.
    11	3. **금지 사항**: 토큰 발급/주입, live EAS 실행(`eas whoami` 포함), pod/이미지/웹훅 작업, production submit 자동화, release human gate 약화, Gatekeeper의 LLM화, RN Web 증거의 native 대체 취급, 로컬 검증의 pod 실행 증명 취급.
    12
    13	이번 실행의 산출물 = 문서 정정 1건 + repo 내부 구현 6묶음. 모든 단계는 외부 네트워크/자격증명 불필요(오프라인).
    14
    15	## 하드 가드레일 (전 단계 공통)
    16
    17	- 외부 플랫폼 repo·k8s·GitHub 설정 변경 없음. Secret/token 어떤 것도 발급·주입·출력하지 않음.
    18	- `eas`/`railway`/`gh api` 등 인증 필요 명령 실행 금지. 모든 신규 스크립트는 `--self-test`(fixture 기반, 네트워크 0)로 검증.
    19	- `human-approval.json` 부재 = release 차단은 불변식으로 validator에 인코딩.
    20	- `06-gatekeeper` stage에 reviewer agent 지정 금지(비-LLM 불변식)를 validator에 인코딩.
    21	- 신규 validator는 3중 배선: `package.json` scripts + `.github/workflows/quality-gate.yml`의 스크립트 정규식(line ~26) + `PROJECT_ENVIRONMENT.md` CI 절.
    22	- team-doc 수정 시 "CTO" 단어 금지(validate-team-doc.mjs:1114-1124), secret 패턴 금지.
    23	- validator-first(TDD): 각 phase에서 fixture/self-test를 먼저 작성.
    24
    25	## Phase 0 — 13번 문서 fact 정정 (선행, 단독 커밋)
    26
    27	`team-doc/mobile-app-dev-team/13-pod-organization-e2e-improvement-plan.md` 수정:
    28
    29	1. **조사 방법 3번** (live pod 실측 절): "모바일 툴체인 전무(pnpm/eas-cli/maestro/...)" → pnpm을 목록에서 제거하고 "pnpm 10.33.3 존재(repo pin 9.15.9와 **불일치**), eas-cli/maestro/Android SDK/adb/emulator/mobile-mcp 부재, /dev/kvm 부재" + 증거 경로 `.evidence/mobile-qa-env-requirements/orbstack-boram-linux-sot-check.md` 인용. canary는 동일 추정·직접 증거는 boram임을 명기.
    30	2. **G9 갭 표**: "agent 이미지에 pnpm 없음 → pnpm install부터 실패" → "pnpm **pin mismatch**(pod 10.33.3 vs SoT 9.15.9) → corepack pin 활성화/검증 필요".
    31	3. **C-3 이미지 요구**: "corepack enable + pnpm 9.15.9 핀" 표현을 "pnpm 핀 강제(현재 10.33.3 탑재 → 9.15.9로 corepack pin, 불일치 시 부트스트랩 fail)"로 정정.
    32	4. **C-5 단절점 B1**: "pod에 pnpm 없음 → 5·6단계 시작 불가" → "pnpm 버전 불일치 → frozen-lockfile 설치 불안정. 수선: pod-role-bootstrap의 corepack pin + preflight mismatch fail".
    33	5. **PR4 절**: pnpm 검사 문구를 "pnpm 9.15.9 pin 일치 검사 — mismatch 시 fail (boram 실측 10.33.3 근거)"로 보강.
    34	6. **Part D 서두**: "이 절의 모든 항목은 인간/ops 승인 전 실행 금지"를 1문장 추가 (리뷰 finding 2·3 대응). Part E 표에 "3·5·6단계는 human/ops 승인 게이트 뒤"를 명시.
    35	7. PR5 절에 추가 사실: `.maestro/home.yml`의 `appId: {{ANDROID_PACKAGE}}`는 generation-time placeholder(위 증거 86행) — 오프라인 작업에 appId 파라미터화 방안 문서화 포함.
    36
    37	검증: `node scripts/validate-team-doc.mjs` + `pnpm run test:runtime`.
    38
    39	## Phase 1 — PR1: Work-unit 상태머신 (우선순위 1)
    40
    41	설계 상세는 13번 문서 Part B PR1 절을 따른다 (`wu-status/v1` 스키마, state enum 7종, 합법 전이표, 02/03 parallel_groups, append-only events).
    42
    43	생성/수정:
    44	- `scripts/lib/work-unit-machine.mjs` — state enum, 전이표, stage 순서/병렬 그룹, 전이 적용 함수(불법 전이 throw). validator와 resolver가 공유.
    45	- `scripts/validate-work-units.mjs` — `docs/plans/work-units/*/status.json` 검증: 스키마, stage id = 디렉토리 8종 일치, done 조건(산출물 실재 + reviewer envelope GO 재검증 + handoff 링크), gate-failed/attempts 규칙, gatekeeper 비-LLM 불변식, 선행 stage 규칙, secret 패턴 스캔. `--self-test` 모드.
    46	  - reviewer envelope 재검증: `scripts/codex-headless-review.mjs`의 envelope 검증 로직 재사용(export 형태 확인 후 필요 시 공유 모듈로 추출 — 기존 `--self-test` 회귀 유지).
    47	- fixtures: `evals/local-harness/work-units/`(valid / 불법 전이 / envelope 누락 / gatekeeper-with-reviewer 4종).
    48	- `docs/plans/work-units/sample-role-handoff/status.json` 샘플 + 해당 README 갱신(필요 시).
    49	- 3중 배선: `package.json`(`validate:work-units`를 `test:runtime` 체인에 추가), `quality-gate.yml` 정규식에 `validate-work-units` 추가, `PROJECT_ENVIRONMENT.md` CI 절 갱신.
    50	- `team-doc/mobile-app-dev-team/10-github-artifact-workflow.md`에 status.json 규범 절 추가(스키마 요약 + 02/03 병합 책임은 Product/Planning 명기).
    51
    52	## Phase 2 — PR2: Human-gate 결정 envelope (`human-gate/v1`)
    53
    54	설계 상세는 13번 문서 PR2 절.
    55
    56	- 스키마 구현은 `scripts/lib/work-unit-machine.mjs`(또는 동급 lib)에 추가, 검증 규칙은 `validate-work-units.mjs`에 통합: category enum(`06-gates-and-evidence.md`의 human gate 카테고리와 일치 — 구현 시 해당 문서에서 정확한 카테고리 목록 추출), decision enum, **anti-self-approval**(decided_by.name이 역할명/agent명과 일치 시 fail), `failed-gate-risk`는 실패 check 참조 필수, `decision_reference`는 GitHub URL 또는 committed path 필수.
    57	- `blocked-human` stage는 approved 결정 파일 존재 시에만 재개 가능 — 전이 규칙에 인코딩.
    58	- fixtures 4종(정상/agent명 승인자/미정의 category/참조 누락).
    59	- `06-gates-and-evidence.md`에 규범 절 추가 + 한계 명시(GitHub 신원 앵커, 정책 수준).
    60	- sample work-unit에 human-gate 예시 파일 추가.
    61
    62	## Phase 3 — PR3: next-action resolver + `wm-orchestrate` skill
    63
    64	설계 상세는 13번 문서 PR3 절.
    65
    66	- `scripts/work-unit-next.mjs`: status.json + 파일시스템 → `next_actions[]`/`blocked[]` JSON (순수 함수, work-unit-machine.mjs 공유). stage→skill/reviewer 매핑은 `04-skills-and-agents-matrix.md` 기준 상수. `--role <slug>` 필터, `--apply-transition <stage> <state>`(공유 모듈 경유, 불법 전이 거부). 재시도: gate-failed 시 fix-findings + `wm-gate-fix-advisor` 첨부, attempts 소진 시 `request-human-gate`(failed-gate-risk pending 생성).
    67	- `.agents/skills/wm-orchestrate/SKILL.md`: 절차(pull → resolver → **자기 WM_ROLE 몫만** → 역할 skill → headless reviewer → 전이 → commit/push) + 하드 규칙(타 역할 실행 금지, envelope/human-gate 파일 수정 금지 — pending 생성만, blocked-only 시 정지·보고). 기존 skill 문서 형식(`.agents/skills/wm/SKILL.md` 등) 준수.
    68	- fixtures: 행복 경로(8 stage), 02/03 병렬, 재시도 루프, 소진 에스컬레이션, human-gate 차단/재개.
    69	- skill 추가에 따른 등록: `04-skills-and-agents-matrix.md`, `PROJECT_ENVIRONMENT.md` Codex runtime 절(repo skills 목록), `validate-runtime-artifacts.mjs`가 skill 목록을 강제하는지 확인 후 필요 시 갱신.
    70	- 로컬 dry-run: sample work-unit 사본으로 stage 00 resolver→transition 경로 검증(reviewer는 self-test 모드).
    71
    72	## Phase 4 — PR4: Pod 부트스트랩 계약 (Phase 1~3과 병렬 가능, Phase 0 이후)
    73
    74	설계 상세는 13번 문서 PR4 절. **pnpm 검사는 "pin 9.15.9 일치, mismatch 시 fail"** (Phase 0 정정 반영).
    75
    76	- `scripts/codex-preflight.mjs` 확장: `--pod` 모드 — codex 후보 경로에 `which codex`/`CODEX_BIN` 추가, arch 판정 `uname -m` 우선(macOS sysctl fallback 유지, 기존 동작 무회귀), node 22/pnpm pin/git identity/`gh auth status` 종료코드/Chromium 존재/`codex mcp list` 종료코드/역할 컨텍스트 fixture 존재 검사, `capabilities` 블록(`rn_web_e2e`, `native_e2e_local: false`, `eas_cloud`: EXPO_TOKEN **존재 여부만** status-only). 노트북에서는 `pod: skipped`.
    77	- 기존 `--self-test`에 Linux형 fixture 추가(`evals/local-harness/preflight/` 기존 fixture 패턴 확인 후 동일 형식).
    78	- pod-native skill 소스 `team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/pod-role-bootstrap/`(SKILL.md + scripts/pod-bootstrap.sh + references/report-template.md): 역할 해석(WM_ROLE env 우선 → `/workspace/IDENTITY` fallback, 불일치 hard fail) → clone → corepack pin pnpm 9.15.9 → `pnpm install --frozen-lockfile` → preflight → 보고. 기존 `codex-cli-auth-setup/` 구조·secret 비출력 가드 동일 적용.
    79	- `validate-team-doc.mjs`의 pod-skill 검사에 신규 skill 등록(기존 codex-cli-auth-setup 검사 패턴 확장), `09-pod-native-openclaw-skills/README.md` 갱신.
    80	- 주의: 로컬 검증은 pod 실행 증명이 아님을 SKILL.md와 13번 문서에 유지.
    81
    82	## Phase 5 — PR6 + PR7: 하드닝
    83
    84	설계 상세는 13번 문서 PR6/PR7 절.
    85
    86	PR6:
    87	- `package.json:20` placeholder → `node scripts/sot-snapshot-check.mjs`(스냅샷 스키마/page-ID 목록 vs `evals/local-harness/README.md`, age 30일 경고 — 비차단). 수동 refresh 절차를 `evals/local-harness/README.md`에 규범화.
    88	- `scripts/validate-project-environment.mjs`(오프라인, test:runtime 포함): PROJECT_ENVIRONMENT.md 핀 vs `package.json`/`apps/mobile/package.json`/lockfile override/`.codex/config.toml`(mobile-mcp·serena·stitch 핀)/`quality-gate.yml` trigger 정규식 일치. `--online`(Railway /livez·/readyz)은 구현하되 **PR 게이트·이번 실행에서 호출하지 않음**.
    89	- `.github/workflows/sot-drift.yml`(주간 cron, 비차단, issue 생성) — 파일 추가만; 동작 증명은 하지 않음(로컬 검증 한계 준수).
    90
    91	PR7:
    92	- preflight `--pod`에 design 역할 한정 Stitch 블록(ADC 파일/GOOGLE_CLOUD_PROJECT/핀 resolve — 전부 status-only, 실행·인증 시도 없음. 네트워크 필요한 resolve 검사는 fixture로 self-test).
    93	- `scripts/validate-evidence-hygiene.mjs`: `.evidence/e2e-test/` 디렉토리명 패턴, 금지 경로 커밋 차단, `.evidence/`+`docs/plans/work-units/` secret 스캔 — `validate-team-doc.mjs:236-243` 패턴을 공유 모듈(`scripts/lib/secret-patterns.mjs`)로 추출해 양쪽에서 재사용(기존 validate-team-doc 무회귀). planted-secret fixture.
    94	- 현재 트리에서 hygiene 검사가 실패하는 기존 파일이 있으면: 수정하지 않고 보고 후 allowlist 여부를 사용자에게 확인(기존 증거 파일은 불변 원칙).
    95
    96	## Phase 6 — PR5: 네이티브 E2E **오프라인 작업만**
    97
    98	설계 상세는 13번 문서 PR5 절. **금지: eas 명령 실행, EXPO_TOKEN 관련 모든 실행, live proof, native 완료 주장.**
    99
   100	- `team-doc/mobile-app-dev-team/14-native-e2e-strategy.md`: 증거 사다리 L0~L3 규범, required_level 설정·강제 규칙, in-pod emulator 기각 근거(KVM 부재 — boram 증거 인용), `appId: {{ANDROID_PACKAGE}}` placeholder 처리 방안(파라미터화 요구사항), live proof는 "EXPO_TOKEN/EAS_PROJECT_ID/GitHub-EAS 연동 인간 승인 후"로 명시적 보류 표기. README/99-source-map에 14번 등록.
   101	- `scripts/ingest-eas-evidence.mjs`: 입력은 **녹화된 fixture JSON**(eas build:view/workflow run 형태) → `.evidence/e2e-test/<ts>-eas-<slug>/result.json` + `05-qa-release/` 요약 블록. URL token redaction. `--self-test`만으로 전체 검증(네트워크 0). eas-cli 버전 핀은 상수로만 기록.
   102	- pod-native skill 소스 `eas-robot-auth-setup/`: SKILL.md/스크립트는 작성하되 "실행은 ops 승인 + token 주입 후" 가드 문구 포함, 검사 전부 status-only 설계.
   103	- `validate-work-units.mjs`에 evidence_ladder 강제 규칙 추가(achieved < required && waiver 없음 → 05 done 차단).
   104	- `.agents/skills/e2e-test/SKILL.md`에 native ladder 절 추가(실행 전제 조건: 토큰 주입 완료 명시).
   105
   106	## 단계별 공통 검증
   107
   108	각 Phase 종료 시:
   109	1. 신규 스크립트 `--self-test` 전부 통과
   110	2. `pnpm run test:runtime` (validate + repo-operations + team-doc + hooks)
   111	3. `pnpm turbo run lint test`
   112	4. `pnpm run test:local-harness` — `.agents/**`, `scripts/*validation*`, preflight 등 트리거 경로를 건드리므로 사실상 매 phase 필수
   113	5. 세션 hook이 재생성한 루트 `CLAUDE.md`/`.claude`가 validate를 깨면 제거 후 재실행(이전 사이클에서 확인된 세션 아티팩트)
   114
   115	## 최종 보고 요건
   116
   117	- **계획서 Path 명시**: `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`
   118	- Phase별 산출 파일 목록 + 게이트 결과(명령·종료 상태)
   119	- 실행하지 않은 것(금지 목록: pod/이미지/웹훅/토큰/live EAS/production submit)과 그 사유를 명시
   120	- 후속 human/ops 승인 대기 항목 표(PR5 live proof, multi-pod rollout)

hook: PostToolUse
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PostToolUse Completed
hook: PreToolUse
hook: PreToolUse Completed
exec
/bin/zsh -lc 'rg -n "appId|ANDROID_PACKAGE" apps/mobile/.maestro apps/mobile/eas.json apps/mobile/.eas/workflows/e2e-test-android.yml' in /Users/tw.kim/Documents/AGA/test/new-mobile-app
 succeeded in 0ms:
apps/mobile/.maestro/home.yml:1:appId: {{ANDROID_PACKAGE}}

hook: PostToolUse
hook: PostToolUse Completed
codex
**Findings**

1. 이전 HIGH/NO_GO 지적은 13번 계획 문서 수준에서는 해소됐습니다. pnpm “부재”가 아니라 pod `10.33.3` vs repo SoT `pnpm@9.15.9` pin mismatch로 정정됐고, boram 외 canary는 추정이라고 한정했습니다. 근거: `package.json:5`, `.evidence/.../orbstack-boram-linux-sot-check.md:47`, `13-pod...md:29-33`.

2. 적용 범위 분리도 SoT와 맞습니다. 즉시 가능한 것은 repo 내부 오프라인 작업(PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline 설계/fixture/self-test)까지입니다. human/ops 승인 후에만 가능한 것은 Part D 전체, Secret/token 주입, branch protection, live EAS 실행, multi-pod rollout입니다. 항상 금지는 production submit 자동화, release human gate 약화, Gatekeeper LLM/pod화, RN Web/Railway를 native 증거로 대체, local validation을 pod/branch/EAS 증명으로 주장하는 것입니다. 근거: `13-pod...md:445-454`, `13-pod...md:469-471`, `AGENTS.md:57-60`, `REPO_OPERATIONS.md:111-113`.

3. 세션 계획 `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`는 non-SoT session roadmap으로는 수용 가능합니다. 외부 플랫폼/k8s/GitHub 설정 변경 금지, secret/token 비출력, `eas`/`railway`/`gh api` 금지, validator-first/TDD를 명시하고 있어 repo SoT와 충돌하지 않습니다. 단, repo 정책이나 완료 증거로 승격하면 안 됩니다.

4. `pnpm run test:runtime` 실패는 현재 구현/PR 게이트를 막지만, 업데이트된 13번 계획의 적용성 판단 자체를 NO_GO로 되돌리지는 않습니다. 실패는 `validate:repo-operations`의 archive 관련 validator/document drift입니다. 다만 “현재 workspace validation green” 주장은 불가하고, 실행 착수 전 이 게이트 실패를 먼저 해소해야 합니다.

**Verdict: CONDITIONAL_GO**

조건부 승인입니다. 계획과 세션 로드맵은 오프라인 repo 작업 범위로 진행 가능하지만, live/ops 작업은 승인 전 금지이고, 현재 `test:runtime` 실패가 해결되기 전에는 구현 완료나 PR-ready로 판단할 수 없습니다.
hook: Stop
hook: Stop Completed
tokens used
88,332
**Findings**

1. 이전 HIGH/NO_GO 지적은 13번 계획 문서 수준에서는 해소됐습니다. pnpm “부재”가 아니라 pod `10.33.3` vs repo SoT `pnpm@9.15.9` pin mismatch로 정정됐고, boram 외 canary는 추정이라고 한정했습니다. 근거: `package.json:5`, `.evidence/.../orbstack-boram-linux-sot-check.md:47`, `13-pod...md:29-33`.

2. 적용 범위 분리도 SoT와 맞습니다. 즉시 가능한 것은 repo 내부 오프라인 작업(PR1, PR2, PR3, PR4, PR6, PR7, PR5 offline 설계/fixture/self-test)까지입니다. human/ops 승인 후에만 가능한 것은 Part D 전체, Secret/token 주입, branch protection, live EAS 실행, multi-pod rollout입니다. 항상 금지는 production submit 자동화, release human gate 약화, Gatekeeper LLM/pod화, RN Web/Railway를 native 증거로 대체, local validation을 pod/branch/EAS 증명으로 주장하는 것입니다. 근거: `13-pod...md:445-454`, `13-pod...md:469-471`, `AGENTS.md:57-60`, `REPO_OPERATIONS.md:111-113`.

3. 세션 계획 `/Users/tw.kim/.claude/plans/luminous-snacking-moler.md`는 non-SoT session roadmap으로는 수용 가능합니다. 외부 플랫폼/k8s/GitHub 설정 변경 금지, secret/token 비출력, `eas`/`railway`/`gh api` 금지, validator-first/TDD를 명시하고 있어 repo SoT와 충돌하지 않습니다. 단, repo 정책이나 완료 증거로 승격하면 안 됩니다.

4. `pnpm run test:runtime` 실패는 현재 구현/PR 게이트를 막지만, 업데이트된 13번 계획의 적용성 판단 자체를 NO_GO로 되돌리지는 않습니다. 실패는 `validate:repo-operations`의 archive 관련 validator/document drift입니다. 다만 “현재 workspace validation green” 주장은 불가하고, 실행 착수 전 이 게이트 실패를 먼저 해소해야 합니다.

**Verdict: CONDITIONAL_GO**

조건부 승인입니다. 계획과 세션 로드맵은 오프라인 repo 작업 범위로 진행 가능하지만, live/ops 작업은 승인 전 금지이고, 현재 `test:runtime` 실패가 해결되기 전에는 구현 완료나 PR-ready로 판단할 수 없습니다.
