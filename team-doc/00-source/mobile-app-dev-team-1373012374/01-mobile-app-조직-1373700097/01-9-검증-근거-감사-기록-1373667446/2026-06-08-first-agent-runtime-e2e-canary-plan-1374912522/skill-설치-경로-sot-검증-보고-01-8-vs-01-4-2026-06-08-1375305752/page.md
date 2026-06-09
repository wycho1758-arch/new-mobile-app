---
pageId: "1375305752"
sourceTitle: "Skill 설치 경로 SoT 검증 보고 — 01-8 vs 01-4 (2026-06-08)"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1375305752"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

# Skill 설치 SoT 검증 보고 (new-mobile-app repo 기준 최종 정정) — 2026-06-08

> **정정 이력**: v1 = Confluence + openclaw-cloud만 (로컬 repo 누락). v2 = clawpod-agent 포함 (대상 과다). **v3 (본판) = 대상은 new-mobile-app repo 단일**, GitHub clone이 로컬에 존재함을 전제로 재작성. 검증만, 실행 없음.

## 0. 전제 (사용자 확정)

* skill 설치의 대상 SoT는 **new-mobile-app repo 하나**다.
* 이 repo는 **GitHub (**`github.com/Wondermove-Inc/new-mobile-app`) 에서 clone 받아 진행하며, 그 **clone이 현재 로컬 (**`/Users/tw.kim/Documents/AGA/test/new-mobile-app`, branch `feat/mobile-app-template`) 에 존재한다.

## 1. new-mobile-app repo가 정의하는 skill 설치 SoT (코드/문서 근거)

| 항목 | SoT 근거 (new-mobile-app) | 내용 |
| --- | --- | --- |
| **pod 설치 경로** | `AGENTS.md:19` | "OpenClaw generated-agent package tests simulate install to `/workspace/skills/<skill-slug>/`; `.agents/skills` is not the pod install path." → 실제 pod 설치 경로는 `/workspace/skills/<slug>/`, `.agents/skills`는 pod 설치 경로가 아님 (소스) |
| **repo skill 소스** | `AGENTS.md:15`, `.agents/skills/<slug>/SKILL.md` | Native Codex CLI repo skills = `.agents/skills/`. 현재 2종: `mobile-app-dev-workflow`, `mobile-backend-api-integrator-workflow` (+`references/sot.md`) |
| **패키징** | `scripts/package-openclaw-skills.mjs` (`npm run package:openclaw-skills`) | `.agents/skills/<slug>` → `.generated/openclaw-skill-packages/<slug>` 복사 (slug `^[a-z0-9-]+$`, [SKILL.md](http://SKILL.md) 필수, path-escape 차단). generated==source 무결성 확인됨 |
| **설치 검증** | `scripts/test-openclaw-packages.mjs` (`npm run test:openclaw`) | generated 패키지를 `<workspace>/skills/<slug>`로 복사 시뮬레이션 + [SKILL.md](http://SKILL.md) 존재/escape 검사. 로그: "Simulated OpenClaw install for N skills under **/workspace/skills/<slug>**" |
| **repo→agent 주입** | `infra/clawpod/agent-runner.yaml` | initContainer (`alpine/git`) 가 `git clone --depth 1 --branch ${REPO_BRANCH} https://${REPO_DEPLOY_TOKEN}@${REPO_HOST}/${REPO_PATH}.git /workspace` → **agent pod가 repo를** `/workspace`로 clone, workingDir `/workspace/apps/mobile` |

## 2. 결론

* **skill 설치의 SoT = new-mobile-app repo 그 자체** (GitHub clone, 로컬 보유). Confluence 01-8/01-4 prose나 clawpod-agent가 아니라, 이 repo의 `AGENTS.md` + 패키징/설치 스크립트 + agent-runner manifest가 1차 SoT다.
* repo가 명시하는 **pod 설치 경로 =** `/workspace/skills/<slug>/SKILL.md` ([AGENTS.md:19](http://AGENTS.md:19)). `.agents/skills`는 repo 소스일 뿐 pod 설치 경로가 아니다.
* 정식 흐름: agent pod가 repo를 `/workspace`로 **git clone** → `.agents/skills`를 `package:openclaw-skills`로 패키징 → `/workspace/skills/<slug>`에 설치 (generated-agent package).

## 3. CK5 재평가 (정직)

| 관점 | 판정 |
| --- | --- |
| 설치 경로 | **일치** — CK5가 쓴 `/workspace/skills/<name>/SKILL.md`는 repo AGENTS.md:19가 명시한 pod 설치 경로와 동일 |
| skill 소스/내용 | **불일치** — CK5는 Confluence Product/Planning skill 3종을 손으로 작성. new-mobile-app repo의 skill (`.agents/skills` 2종: dev-role workflow) 도, 그 패키징 파이프라인 (`package:openclaw-skills`→generated) 도 사용하지 않음 |
| repo clone | **미수행** — canary는 openclaw-cloud `create-full`로 생성 (repo clone initContainer 없음). agent-runner.yaml의 git-clone→/workspace 흐름을 거치지 않아 `/workspace`에 new-mobile-app repo가 clone되지 않음 |
| 종합 | CK5는 "경로는 맞았으나 SoT (new-mobile-app clone + 패키징) 흐름을 따르지 않았다." 사용자 지적이 정확하며, 이전 보고서들은 이 repo를 SoT로 보지 못한 오류 |

## 4. 정정 사항 (작성자 과실)

* v1: 로컬 repo 미확인 (Confluence/openclaw-cloud만). v2: clawpod-agent까지 끌어와 대상 흐림. → **대상은 new-mobile-app 단일**이며, GitHub clone이 로컬에 있다는 사실을 기준으로 했어야 함.

## 5. 후속 (실행 없음, 지시 시 진행)

* new-mobile-app clone 기준 정식 검증: (a) repo `npm run package:openclaw-skills` → `.generated/openclaw-skill-packages` 생성 확인, (b) generated 패키지를 agent `/workspace/skills/<slug>`에 설치 (또는 agent-runner clone 경로 재현), (c) 런타임이 해당 skill을 로드/활성화하는지 실증.
* `.agents/skills` 현재 2종 (dev-role) vs 01-4 계획 (api-contract/qa-release/gatekeeper) 차이는 템플릿 구현 진행 상태로 별도 점검.

## 참조

* new-mobile-app (GitHub `github.com/Wondermove-Inc/new-mobile-app`, 로컬 `feat/mobile-app-template`): `AGENTS.md:15,19`, `.agents/skills/{mobile-app-dev-workflow,mobile-backend-api-integrator-workflow}/SKILL.md`, `scripts/package-openclaw-skills.mjs`, `scripts/test-openclaw-packages.mjs`, `.generated/openclaw-skill-packages/`, `infra/clawpod/agent-runner.yaml` (git-clone initContainer), `package.json` (`package:openclaw-skills`, `test:openclaw`).
* 대조: canary `canary-pp-202606080757` (create-full 생성, repo clone 없음), `/workspace/skills/`에 Product/Planning 3종 수작성.
