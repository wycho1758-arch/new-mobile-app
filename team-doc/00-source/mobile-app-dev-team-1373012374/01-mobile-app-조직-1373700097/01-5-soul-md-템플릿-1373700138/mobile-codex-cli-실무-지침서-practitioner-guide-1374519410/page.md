---
pageId: "1374519410"
sourceTitle: "Mobile Codex CLI 실무 지침서 / Practitioner Guide"
sourceVersion: "3"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374519410"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | mobile-app-dev-team의 Codex CLI 사용 지침을 README/AGENTS.md 형태로 정의한다. |
| Upstream | 01-4. Skills (`1373667362`), 01-5. [SOUL.md](http://SOUL.md) 템플릿 (`1373700138`), Role-specific Codex Runtime (`1374289964`) |
| Downstream | 6개 역할 [SOUL.md](http://SOUL.md), 6개 role-specific Codex practice skill pages |
| 상태 | reviewer LGTM 후 생성 |

## 목적 / Purpose

KO: 이 문서는 mobile-app-dev-team의 Codex CLI 사용 지침이다. `lazycodex`처럼 README/AGENTS.md 형태로 사용법을 먼저 전달하되, `lazycodex` 명령이나 구현은 도입하지 않는다. 이 문서는 `01-4. Skills`(`1373667362`)가 정의한 MVP skill들과 역할별 SOUL.md를 대체하지 않고, 언제 Plan mode, skill, subagent, hook, reviewer, git diff 검증을 사용해야 하는지 설명한다.

EN: This page defines how the mobile-app-dev-team uses Codex CLI. It follows a README/AGENTS.md-style instruction pattern, similar in documentation shape to `lazycodex`, but it does not adopt LazyCodex commands or implementation. It does not replace the MVP skills defined by `01-4. Skills` (`1373667362`) or role [SOUL.md](http://SOUL.md) pages; it explains when to use Plan mode, skills, subagents, hooks, reviewer gates, and git-diff completion review.

## Workflow Pillars / 작업 기둥

| Pillar | KO | EN |
| --- | --- | --- |
| Planning | 복잡하거나 교차 역할 영향이 있는 작업은 Plan mode로 시작한다. 계획은 SoT-bound, no-over-spec, explicit non-goals, evidence-based acceptance를 가져야 한다. | Start complex or cross-role work in Plan mode. Plans must be SoT-bound, scoped, explicit about non-goals, and evidence-based. |
| Execution | 즉흥 실행을 금지하고, 관련 skill을 먼저 사용한다. subagent는 탐색, 검토, 역할 분리에 한정한다. | Do not improvise execution. Use the relevant skill first. Use subagents only for bounded exploration, review, or ownership separation. |
| Review | 단계별 reviewer gate를 따른다. 결정이 필요한 경우 reviewer(xhigh)로 의사결정을 요청한다. | Follow phase reviewer gates. Ask reviewer(xhigh) for decisions that affect SoT or risk posture. |
| Verified completion | 완료 전 승인 계획 대비 `git diff`, test/build/evidence, checklist-to-diff mapping을 확인한다. | Before reporting Done, check `git diff` against the approved plan, tests/build/evidence, and checklist-to-diff mapping. |
| Hook and gate respect | hook과 `mobile-gatekeeper`는 PR/CI 및 local guardrail에서 결정적으로 작동하며, GitHub required check와 gate 결과는 LLM 판단으로 번복하지 않는다. | Hooks and `mobile-gatekeeper` run deterministically in PR/CI and local guardrails; never override GitHub required checks or gate results with LLM judgment. |

## Skill/Subagent/Hook Map

KO:

* Skill은 반복 가능한 절차와 stable input/output이 있을 때 사용한다.
* Subagent는 병렬 탐색, bounded review, 역할별 관점 확인에 사용한다.
* Hook은 local advisory guardrail이다. hard pass/fail은 `mobile-gatekeeper`와 GitHub required check가 담당한다.
* Reviewer는 plan, phase, final gate에 사용한다. warning이 SoT에 영향을 주면 수정 후 재검증한다.

EN:

* Use a skill when the work has a repeatable procedure and stable input/output.
* Use subagents for parallel exploration, bounded review, or role-specific perspective checks.
* Hooks are local advisory guardrails. Hard pass/fail remains with `mobile-gatekeeper` and GitHub required checks.
* Use reviewer at plan, phase, and final gates. If a warning affects SoT, fix and rerun reviewer.

## Design Start Gate / 디자인 시작 게이트

KO:

* ASCII는 초기 flow/정보구조 합의에만 사용한다.
* 사용자-facing UI 구현의 최종 design evidence로 ASCII만 사용하는 것은 금지한다.
* layout, interaction, visual hierarchy가 불확실하면 structured wireframe 이상이 필요하다.
* 높은 시각 위험은 Stitch/Figma 또는 동등한 high-fidelity prototype이 필요하다.
* Stitch/Figma를 사용할 수 없으면 `design-artifact` HTML wireframe/prototype을 fallback으로 사용하고 이유를 기록한다.
* 반복 구현 규칙은 `DESIGN.md`에 기록하되, 실제 design evidence 없이 임의 style memo로 작성하지 않는다.

EN:

* Use ASCII only for early flow or information-architecture alignment.
* Do not use ASCII-only output as final design evidence for user-facing UI implementation.
* If layout, interaction, or visual hierarchy is uncertain, require at least a structured wireframe.
* High visual risk requires Stitch/Figma or an equivalent high-fidelity prototype.
* If Stitch/Figma is unavailable, use a `design-artifact` HTML wireframe/prototype fallback and record the reason.
* Record repeated implementation rules in `DESIGN.md`, but never create it as an arbitrary style memo without actual design evidence.

## Role Skill Index / 역할별 Skill 인덱스

Runtime note / Runtime 참고:

KO: Product/Planning과 Design은 organization-runtime skill pack이 우선이며, generated-agent packaging 시 `/workspace/skills/<skill-slug>/SKILL.md`를 사용한다. Mobile App Dev, Backend/API Integrator, QA/Release는 new-mobile-app repo skill pack이 우선이며 `new-mobile-app/.agents/skills/<skill-name>/SKILL.md`를 사용한다. Mobile Architect는 organization-runtime과 repo skill pack 양쪽에 둘 수 있다.

EN: Product/Planning and Design prefer the organization-runtime skill pack and use `/workspace/skills/<skill-slug>/SKILL.md` when packaged for generated-agent runtime. Mobile App Dev, Backend/API Integrator, and QA/Release prefer the new-mobile-app repo skill pack at `new-mobile-app/.agents/skills/<skill-name>/SKILL.md`. Mobile Architect may ship in both organization-runtime and repo skill packs.

| Skill | Target [SOUL.md](http://SOUL.md) | Main trigger |
| --- | --- | --- |
| `mobile-product-planning-codex-practice` | Product/Planning (`1373798422`) | vague requirement, PRD decomposition, scope/risk decision |
| `mobile-design-codex-practice` | Design (`1373765702`) | design evidence selection, screen handoff, visual ambiguity |
| `mobile-architect-codex-practice` | Mobile Architect (`1373667383`) | ADR/risk, dependency, navigation/state/API boundary |
| `mobile-app-dev-codex-practice` | Mobile App Dev (`1373700159`) | code implementation, task/design/API diff review |
| `mobile-backend-api-integrator-codex-practice` | Backend/API Integrator (`1373700180`) | API contract, mock-vs-real, auth/session/error shape |
| `mobile-qa-release-codex-practice` | QA/Release (`1373700201`) | evidence verification, failure taxonomy, release gate |

## Forbidden Shortcuts / 금지사항

KO:

* SoT 확인 없이 계획을 작성하거나 실행하지 않는다.
* text-only design으로 사용자-facing UI 구현을 승인하지 않는다.
* 실패한 gate를 pass로 재라벨하지 않는다.
* 계획 밖 scope를 몰래 추가하지 않는다.
* 완료 보고 전 `git diff`와 evidence를 생략하지 않는다.

EN:

* Do not plan or execute without checking SoT.
* Do not approve user-facing UI implementation from text-only design.
* Do not relabel a failed gate as pass.
* Do not silently add scope outside the plan.
* Do not skip `git diff` and evidence checks before reporting Done.

## Reviewer Evidence

* Draft reviewer v4: LGTM, critical 0, warning 0, info 1.
* Info note verified before publish: `1374289964` is the parent Role-specific Codex Runtime page; `1374290005` is its Skills child page.

---

# 2026-06-08 Practitioner Hook Source Basis Pointer

Original practitioner guidance above remains unchanged. For hook design or hook runtime changes, practitioners must now use the updated Source Basis under:

* `Hooks` (`1374060648`) for the four-event hook policy and official/internal source separation.
* `hook-evaluation-and-ci-gate` (`1374355561`) for fixture schema, CI/reviewer criteria, and xhigh headless review evidence.
* event-specific child pages for `SessionStart`, `PreToolUse`, `PostToolUse`, and `Stop`.

Operational clarification:

* official OpenAI/Expo/React Native links justify product mechanics and technical constraints.
* production release approval, CI hard gates, evidence Done rules, and `mobile-gatekeeper` ownership are internal SoT overlay.
* Codex headless review evidence must be captured before treating hook Source Basis updates as complete.

---

# 2026-06-09 Hook Set Correction

`UserPromptSubmit`(`mobile-user-prompt-policy-hook`)와 `PermissionRequest`(`mobile-permission-policy-hook`) 두 훅은 **불필요로 판정되어 설계에서 제거**되었다. 따라서 위 포인터는 6-event가 아니라 4-event(`SessionStart`, `PreToolUse`, `PostToolUse`, `Stop`)를 가리킨다. 근거는 `Hooks`(`1374060648`)와 `Role-specific Codex Runtime`(`1374289964`)의 2026-06-09 correction 참조.