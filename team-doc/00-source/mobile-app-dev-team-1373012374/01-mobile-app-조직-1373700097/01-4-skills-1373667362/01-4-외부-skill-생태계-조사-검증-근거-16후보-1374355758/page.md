---
pageId: "1374355758"
sourceTitle: "01-4 외부 skill 생태계 조사 검증 근거 (16후보)"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355758"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | 01-4 v4 '외부 공식 skill 선별 설치' 정책과 선택 skill 2행(Maestro MCP/Atlassian Remote MCP)의 조사 근거를 보존한다 |
| Upstream | 01-4. Skills (1373667362) v4, mobile-project-bootstrap-workflow (1374421001) v2 |
| 조사 일자 | 2026-06-07\~08 |
| 조사 방법 요약 | deep-research workflow 102 agents + 보완 검증 트랙 3종, 1차 출처 직접 fetch, star 수 단독 근거 미사용 |

## 조사 방법

조사는 3단계로 수행했다. (1) Confluence SoT에서 6개 역할의 현재 skill 표면과 판정 기준을 추출했다(read-only) \[1\]\[2\]\[3\]\[4\]\[5\]. (2) deep-research workflow(102 agents, claim 100건 추출 → 3-vote 적대적 검증 25건 → 확정 19건 → 합성 9건)로 후보 13종을 조사했다. (3) deep-research의 알려진 StructuredOutput 결함이 재발하여 검증 미완으로 남은 후보(gstack, lazycodex, [design.md](http://design.md), agent-os, awesome 목록 2종)와 조사 중 발견된 신규 후보(`expo/skills`, Maestro MCP, Atlassian MCP, BMAD Codex 지원 여부)는 확정 처방대로 **트랙별 병렬 general-purpose 에이전트가 1차 출처(GitHub raw README/file tree/API, 공식 docs)를 직접 fetch**하여 보완 검증했다. 모든 판정은 2차 출처(블로그·큐레이션)가 아닌 1차 출처 인용을 근거로 한다.

주의: 보완 검증에서 deep-research 본 패스의 확정 claim 1건("공식 카탈로그에 Expo/EAS skill 전무")이 **반박**되었다 — 해당 스캔이 `openai/skills` repo 내부(1,030 paths)에 한정되어 Expo org 자체 공식 repo를 놓친 false negative였다 \[7\]\[20\]. 본 보고서는 보완 검증 결과를 우선한다.

## 판정 기준 (SoT)

판정은 외부 인기도가 아니라 내부 SoT 제약으로 한다. star 수는 단독 근거로 사용하지 않는다 \[24 §3\].

| 기준 | SoT 근거 |
| --- | --- |
| 신규 skill은 "기존 MVP skill로 닫히지 않는 반복 process gap"이 있을 때만 | `01-4. Skills` 작성 규칙 \[1\] |
| role별 1-wrapper 기본값 금지, 기존 skill 소유 Case는 mode/checklist 확장 | `01-4. Skills` \[1\], Case A\~H coverage matrix \[24\] |
| 런타임 = Codex CLI (repo skill: `new-mobile-app/.agents/skills/`, generated-agent: `/workspace/skills/`) | `Role-specific Codex Runtime` (1374289964) \[2\] |
| 도구 설치는 bootstrap task로만, 플랫폼·image·entrypoint 수정 금지 | `01-5` Tooling 공통 문장 \[2\] |
| Detox/Appium/device cloud/custom macOS runner/S3 artifact store/Sentry 기본 도입 금지 | 전 역할 [SOUL.md](http://SOUL.md) 공통 Boundaries \[4\] |
| Design 저작 도구는 Stitch 단독 (Figma 등 금지, DEC-021) | Design [SOUL.md](http://SOUL.md) \[4\] |
| mobile-gatekeeper deterministic gate를 어떤 skill도 대체·재해석 금지 | `01-4` \[1\] |
| task가 요구하지 않는 선택적 인프라 금지 (오버스펙 금지) | 전 역할 공통 Boundaries \[4\] |

## 후보별 조사 결과와 판정 (16후보)

판정 분류: **adopt-pattern**(차용 가치 — 들어갈 위치 명시) / **adapt**(기존 체계가 동등 커버 — 참조만) / **reject**(불필요 — 이유 명시).

### 공식 1차 출처 계열

| 후보 | 실체 (1차 출처 확인) | 판정 | 근거 |
| --- | --- | --- | --- |
| `openai/skills` \[7\] + Codex skill 규약 \[6\] | Codex 공식 카탈로그. .curated 39 skills (figma 5종, playwright 2종, linear/notion, sentry, vercel/netlify 등 deploy). 전체 tree 스캔: expo/eas/maestro/jira/confluence/mobile 키워드 **0건**. push 2026-05-29 | **reject** (개별 skill) / **adapt** (`SKILL.md` 규약) | figma→Stitch-only 충돌(DEC-021) \[4\], playwright→Maestro 체계와 불일치 \[4\], linear/notion→Jira/Confluence SoT와 불일치 \[2\], sentry→기본 도입 금지 \[4\], deploy 계열→웹 타깃(본 조직은 EAS). `SKILL.md`+YAML frontmatter 규약 자체는 이미 채택 중 — name/description 필수, 명시(/skills, $mention)+암시(description) 호출 \[6\] |
| `anthropics/skills` \[8\] | Anthropic 공식. 17 skills (webapp-testing, frontend-design, mcp-builder, skill-creator, docx/pdf/pptx/xlsx 등). 모바일 네이티브 skill 없음. 문서 skill 4종은 source-available(비 오픈소스), 나머지 Apache 2.0 | **reject** | 모바일 도메인 0건. webapp-testing은 웹 전용으로 Maestro 체계 \[4\]와 불일치. 문서 skill은 라이선스 제약 + 본 조직 문서 SoT는 Confluence \[2\] |
| `github/spec-kit` \[9\] | GitHub 공식 SDD 툴킷(MIT). /speckit.constitution\~.implement 7 커맨드. **Codex CLI 명시 지원**(30+ agents). v0.9.5(2026-06-05) 활발. taskstoissues는 GitHub Issues 전용 — Jira 미지원 | **reject** | PRD→분해는 mobile-prd-to-execution(Case B)이 소유 \[1\]. 백로그 SoT는 Jira인데 spec-kit은 Jira 연동 없음. 기존 결론(전체 도입 금지 \[24 §5\])과 이번 재조사 결과 일치 |
| `expo/skills` \[20\] | **Expo 공식**(MIT). 16 skills: eas-update-insights, expo-deployment, expo-cicd-workflows, upgrading-expo, building-native-ui(Expo Router), expo-tailwind-setup(NativeWind v5), expo-dev-client, native-data-fetching 등. README verbatim: "They work with Claude Code, Cursor, **Codex**, and other AI agents." push 2026-06-06 활발 | **adopt-pattern (선별 설치 검토)** | 유일하게 스택(Expo Router/NativeWind/EAS \[4 Architect\])·런타임(Codex 명시)·공식성 3박자 일치. 단 신규 제작 아님 — `01-5` Tooling "bootstrap task로 도구 설치" 규정 \[2\] 안에서 `new-mobile-app/.agents/skills/`에 **조직 스택 일치분만** 선별 설치를 Case A `mobile-project-bootstrap-workflow` 검토 항목으로 추가 후보. 16종 전부 설치는 오버스펙 — 후보: upgrading-expo, expo-deployment/eas-update-insights/expo-cicd-workflows(QA/Release·Architect), building-native-ui/expo-tailwind-setup/native-data-fetching(Mobile App Dev). 채택 여부는 별도 턴 결정 |

### 방법론·하네스 계열

| 후보 | 실체 (1차 출처 확인) | 판정 | 근거 |
| --- | --- | --- | --- |
| `obra/superpowers` \[10\] | MIT 방법론 skill 프레임워크. 12 skills (test-driven-development, systematic-debugging, verification-before-completion, brainstorming, writing-plans, requesting-code-review 등). **Codex CLI 명시 지원**(8개 하네스 문서화) | **adapt** | 핵심 패턴이 codex-practice 6종에 이미 등가 존재: TDD Red→Green→Refactor = Dev practice \[5\], verification-before-completion = git diff 완료 검증 \[5\], writing/executing-plans = Plan-mode-first \[5\], code-review = reviewer 게이트 + author≠approver \[4\]. 전체 suite 추가 도입은 동일 규율의 이중화 — 오버스펙 |
| `garrytan/gstack` \[11\] | MIT, 매우 활발(push 2026-06-07). "Claude Code를 가상 엔지니어링 팀으로" — 53+ 커맨드. README Requirements: **Claude Code** (Codex는 /codex 보조 skill·probe만) | **reject** | 런타임 불일치 — 본 조직 mobile agent는 Codex CLI \[2\]. process checklist 패턴(office-hours, plan-ceo-review)은 이미 comparative prior art로 처리 완료(채택분은 codex-practice에 반영) \[24\] |
| `code-yeongyu/lazycodex` \[12\] | MIT, Codex CLI 명시(OmO wrapper — "npx oh-my-openagent omo install --platform=codex"). 3 commands($ulw-plan/$start-work/$ulw-loop) + 8 skills(review-work, LSP, AST-grep 등). push 2026-06-05 | **reject** | (a) 기존 결정: README 구조만 참고, 도구 도입 금지 — practitioner guide plan에서 확정 \[25\]. (b) plan/execute/verify 규율은 codex-practice가 동등 커버 \[5\]. (c) 실 로직이 상류 OmO 패키지에 있어 간접 공급망 의존 추가 — task가 요구하지 않는 선택적 인프라 \[4\] |
| `BMAD-METHOD` \[13\] | MIT. 12+ 페르소나(PM/Architect/Developer/UX/QA/SM) + 34+ workflows. Codex 지원: README엔 부재하나 installer `platform-codes.yaml`에 `codex: preferred: true` 1차 확인. 단 issue #1782 "Codex CLI has no BMAD awareness after fresh install" setup gap | **reject** | 페르소나 조직 시스템 자체가 본 조직의 6역할 [SOUL.md](http://SOUL.md) 체계 \[2\]\[4\]와 정면 중복 — 보완재가 아닌 대체재. 조직 구조 SoT는 01-2/01-5이며 외부 프레임워크로 대체하지 않음 |
| `ruvnet/claude-flow` \[14\] | "The leading agent meta-harness **for Claude**" — 98 agents/60+ commands/MCP server. Codex 지원 미확인 | **reject** | 런타임 불일치 + 멀티에이전트 조정은 admin-portal/admin-api·rooms·Tasks 플랫폼이 담당 \[2\]. 모바일 특화 없음 |
| `SuperClaude` \[15\] | "configuration framework that enhances **Claude Code**" (비 Anthropic 공식). \~30 슬래시 커맨드. Codex 호환 미확인 | **reject** | 런타임 불일치. 커맨드 스펙트럼(/implement, /test 등)은 기존 skill·practice 체계와 중복 |
| `buildermethods/agent-os` \[17\] | MIT. standards 주입+spec 작성 5 커맨드. README는 멀티툴 주장하나 installer가 `.claude/commands/` 전용 — Codex 설치 경로 부재. push 2026-05-05 (1개월 stale) | **reject** | Codex 미지원(1차 출처 installer 확인). standards 주입은 repo root [AGENTS.md](http://AGENTS.md) + `DESIGN.md` + codex-practice가 이미 담당 \[2\]\[4\] |

### 스펙·큐레이션·MCP 계열

| 후보 | 실체 (1차 출처 확인) | 판정 | 근거 |
| --- | --- | --- | --- |
| `google-labs-code/design.md` \[16\] | Apache-2.0, push 2026-06-03. Stitch 공식 연계([homepage=stitch.withgoogle.com](http://homepage=stitch.withgoogle.com) 스펙). npm `@google/design.md` CLI: lint(9 rules, WCAG AA contrast 포함)/diff/export(tailwind/DTCG)/spec. 포맷 상태 alpha | **adapt** (이미 채택) | Design 역할 repo-root `DESIGN.md` SoT로 **이미 사용 중** \[4\]\[5\]. CLI lint/diff는 향후 mobile-design-handoff checklist에서 deterministic evidence로 활용 가능하나, 현 시점 task 요구 없음 — 선제 도입은 오버스펙 \[4\]. alpha 상태 주의 |
| `hesreallyhim/awesome-claude-code` \[18\] | main README가 stub("I. TODO"), 실 데이터는 README_ALTERNATIVES/. 라이선스 NOASSERTION. push 2026-04-27(6주 stale). Expo/RN/Maestro 항목 0건, Jira/Confluence 실통합 1건뿐 | **reject** | 신뢰 가능한 디스커버리 소스 요건 미달(stub+stale+라이선스 불명). 모바일 커버리지 부재 |
| `VoltAgent/awesome-agent-skills` \[19\] | MIT, push 2026-06-05 활발. "1000+ skills, compatible with Claude Code, **Codex**, Gemini CLI, Cursor". Expo 공식 11 skills 수록 확인, callstack RN best-practices 등. Atlassian/Maestro 0건 | **adapt** (참조용) | skill 디스커버리 참조 소스로만 유효. 큐레이션 자체는 도입 대상이 아니며 신규 skill 근거 아님 \[24 §3\] |
| Maestro MCP server \[21\] | 공식 MCP server — 9 tools(list_devices, inspect_screen, run, run_on_cloud 등). 패키지된 `SKILL.md` 없음. "Claude Code, Cursor, GitHub Copilot" 대상 표기 | **reject (정보 기록)** | QA/Release의 Maestro 실행은 이미 CLI 직접 실행으로 커버 \[4\]\[5\]. MCP 추가는 runtime 구성 변경에 해당하며 task 요구 없음 \[4\]. cloud 계열 tool은 device cloud 금지 \[4\]와 충돌 소지 |
| Atlassian Remote MCP Server \[22\] | Atlassian 공식 — Jira/Confluence 검색·생성, OAuth 권한 모델 | **reject (정보 기록)** | 현 조직의 Jira/Confluence 접근 방식은 운영 플랫폼 레이어 소관. mobile agent [SOUL.md](http://SOUL.md) 차원의 skill gap 아님. 향후 PM 통합 자동화 요구 발생 시 1순위 검토 대상으로 기록만 |

## 최종 권고 (적용 완료 상태)

1. **신규 skill 제작: 0건.** 현 [SOUL.md](http://SOUL.md) 6종과 skill 체계를 변경하지 않는다. **(무변경 확정)**
2. **단일 후속 검토 항목 (채택 결정은 별도 턴)**: `expo/skills`(공식, MIT, Codex 명시 \[20\]) 중 조직 스택 일치분의 선별 설치를 `mobile-project-bootstrap-workflow`(Case A)의 검토 항목으로 추가할지 판단. 이는 `01-5` Tooling의 기존 "bootstrap task 도구 설치" 규정 \[2\] 범위 내이므로 [SOUL.md](http://SOUL.md) 본문 변경 없이도 가능하다. 선별 기준: upgrading-expo, eas-update-insights, expo-deployment, expo-cicd-workflows, building-native-ui, expo-tailwind-setup, native-data-fetching (7/16종) — 나머지 9종(app-clip, brownfield, jetpack-compose/swift-ui 등)은 현 템플릿 스택과 불일치로 제외. **(01-4 v4 및 bootstrap v2에 반영 완료)**
3. **정보 기록만**: Maestro MCP \[21\], Atlassian Remote MCP \[22\] — 향후 운영 요구 발생 시 재평가. 현 시점 도입 근거 없음. **(01-4 v4 및 bootstrap v2에 반영 완료)**
4. **기존 결론 재확인**: gstack/spec-kit/lazycodex 도구 도입 금지 \[24\]\[25\], superpowers 패턴은 codex-practice 등가로 추가 도입 불요, BMAD/claude-flow/SuperClaude/agent-os는 런타임 불일치 또는 조직 구조 중복으로 부적합. **(무변경 확정)**

## 출처

내부 SoT:

* \[1\] Confluence `01-4. Skills` (1373667362, v2)
* \[2\] Confluence `01-5. SOUL.md 템플릿` (1373700138, v4), `Role-specific Codex Runtime` (1374289964)
* \[3\] Confluence `01-3. Workflows Case A~H` (1373667425, v2)
* \[4\] 6 역할 [SOUL.md](http://SOUL.md): Product/Planning 1373798422, Design 1373765702, Mobile Architect 1373667383, Mobile App Dev 1373700159, Backend/API Integrator 1373700180, QA/Release 1373700201
* \[5\] 6 codex-practice pages: 1374355683, 1374421110, 1374421132, 1374552140, 1374453888, 1374519432 (전부 v1)
* \[23\] `Mobile Codex CLI 실무 지침서` (1374519410)
* \[24\] `docs/plans/active/20260607-mobile-role-runtime-skill-research-plan.md` (Case A\~H coverage matrix, 도입 금지 결론)
* \[25\] `docs/plans/active/20260607-mobile-codex-cli-practitioner-guide-plan.md` (lazycodex 참고-only 결정)

외부 1차 출처 (전부 직접 fetch 확인, 2026-06-07\~08):

* \[6\] [https://developers.openai.com/codex/skills](https://developers.openai.com/codex/skills)
* \[7\] [https://github.com/openai/skills](https://github.com/openai/skills)
* \[8\] [https://github.com/anthropics/skills](https://github.com/anthropics/skills)
* \[9\] [https://github.com/github/spec-kit](https://github.com/github/spec-kit)
* \[10\] [https://github.com/obra/superpowers](https://github.com/obra/superpowers)
* \[11\] [https://github.com/garrytan/gstack](https://github.com/garrytan/gstack)
* \[12\] [https://github.com/code-yeongyu/lazycodex](https://github.com/code-yeongyu/lazycodex)
* \[13\] [https://github.com/bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) (tools/installer/ide/platform-codes.yaml 포함)
* \[14\] [https://github.com/ruvnet/claude-flow](https://github.com/ruvnet/claude-flow)
* \[15\] [https://github.com/SuperClaude-Org/SuperClaude_Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework)
* \[16\] [https://github.com/google-labs-code/design.md](https://github.com/google-labs-code/design.md)
* \[17\] [https://github.com/buildermethods/agent-os](https://github.com/buildermethods/agent-os)
* \[18\] [https://github.com/hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
* \[19\] [https://github.com/VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)
* \[20\] [https://github.com/expo/skills](https://github.com/expo/skills) , [https://docs.expo.dev/skills/](https://docs.expo.dev/skills/)
* \[21\] [https://docs.maestro.dev/get-started/maestro-mcp](https://docs.maestro.dev/get-started/maestro-mcp)
* \[22\] [https://www.atlassian.com/platform/remote-mcp-server](https://www.atlassian.com/platform/remote-mcp-server)

조사 메타: deep-research workflow wf_a19b0d25-dc7 (102 agents, claim 100→verified 25→confirmed 19→synthesis 9) + 보완 검증 트랙 3종 (1차 출처 직접 fetch). star 수는 단독 판정 근거로 미사용.
