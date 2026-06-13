# Design Codex 사용 Skill 분석

Role: Design
SOUL: `mobile-app-dev-team/02-role-souls/design-soul.md`

## 역할 기준

Design은 승인된 모바일 요구사항을 Stitch 기반 구현 handoff로 바꾸는 역할입니다. UX quality, state coverage, accessibility intent, visual handoff quality를 소유합니다.

Design은 app code, backend API, migration, QA flow, release operation을 구현하지 않습니다.

## 현재 상태

사용 가능한 repo-local Codex skill:

- `design-mobile-design-handoff`
- `design-stitch-mcp-operating-rules`
- `wm-orchestrate`
- `git-workflow`

사용 가능한 custom agent:

- `design-reviewer`
- `design-researcher`
- `po-planning-reviewer`
- `po-scope-gate-reviewer`

pod-native setup skill:

- `project-bootstrap`
- `codex-cli-auth-setup`
- `pod-role-bootstrap`
- `stitch-adc-setup`

주요 durable artifact:

- `docs/plans/work-units/<work-unit-id>/01-design/*`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-a.html`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-a.png`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-b.html`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/option-b.png`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/manifest.json`
- `design-pub-html/<YYYY-MM-DD>/<work-unit-id>/handoff.md`

판정: **강한 부분 충족**입니다. Design repo-local skill은 충분하지만, pod에서 이 skill들을 어떤 순서와 조건으로 써야 하는지 연결하는 bridge가 없습니다.

## Stitch 공식 문서 및 프롬프트 계약

Design pod에서 Codex는 Stitch를 단순 MCP 실행 표면으로만 다루면 안 됩니다. Stitch는 공식 문서 기준으로 text prompt와 image prompt를 통해 UI screen과 code-oriented design output을 생성하는 도구입니다. 따라서 skill은 아래 내용을 포함해야 합니다.

1. Stitch 작업 전 SoT를 읽고 수정 없이 계획을 수립합니다. P0 scope/evidence approval, DESIGN.md decision, Product/Planning requirement, target states, accessibility intent를 확인합니다.
2. 계획에는 사용할 Stitch input 유형을 명시합니다.
   - text prompt only
   - image prompt plus text instruction
   - existing design iteration
   - code/handoff extraction after approval
3. 공식 문서 기준으로 Stitch가 생성할 수 있는 것과 없는 것을 기록합니다. MCP readiness는 credential/readiness 증거일 뿐, 실제 generation/export 품질 증거가 아닙니다.
4. 계획은 `design-reviewer`로 검토하고 사용자에게 보고합니다. P0 승인 전에는 Stitch generation을 하지 않습니다.
5. 승인 후 Stitch prompt를 실행하고, 정확히 두 개 option을 생성합니다.
6. P1 승인 전에는 HTML extraction 또는 implementation handoff publication을 하지 않습니다.
7. 작업 완료 후 `design-reviewer`가 two-option coverage, five-state coverage, accessibility intent, NativeWind/RN handoff suitability를 최종 확인합니다.
8. `git diff`와 `git status --short`로 `01-design/*`, `design-pub-html/*`, manifest/handoff가 계획과 일치하는지 확인합니다.

Stitch prompt는 최소한 아래 구조를 가져야 합니다.

```text
Create two distinct mobile app screen design options for [work-unit-id].
Use the approved Product/Planning requirement: [brief requirement].
Target platform: Expo React Native mobile app.
Design system constraints: NativeWind-compatible structure, React Native primitives, semantic design tokens, stable testID intent, no web-only shadcn/ui assumptions.
States to cover: default, loading, empty, error, success.
Accessibility intent: [focus order, contrast, labels, dynamic text concerns].
Interaction requirements: [primary action, secondary action, disabled states].
Output expectation: screen-level visual design suitable for implementation handoff, not production app code.
Avoid: unapproved scope, backend behavior invention, hidden data model assumptions, unreadable text, decorative-only UI.
```

Image prompt를 사용할 때는 이미지의 출처, 사용 목적, 어떤 부분을 유지하거나 변경해야 하는지, 공식 문서 기준의 Stitch capability와 limitation을 handoff에 기록해야 합니다.

### `DESIGN.md` baseline 및 동일 Stitch 프로젝트 연속성 계약

Design 작업에서 Codex의 첫 단계는 Stitch generation이 아닙니다. 먼저 사용자 또는 Product/Planning이 이 work unit에서 사용할 design-system baseline을 선택하거나 승인해야 합니다.

- 기존 repo `DESIGN.md`
- Stitch에서 import/generated 된 `DESIGN.md`
- `UPDATE_DESIGN_MD_REQUIRED`: design-system 업데이트 승인이 필요하므로 Stitch generation 전 block

선택된 `DESIGN.md` 또는 `design.md`는 해당 work unit의 design-system SoT입니다. 이후 Stitch 작업은 이 baseline 안에서 확장해야 합니다. 기존 디자인을 이어가는 작업이면 승인된 디자인의 동일 Stitch project, project id, 또는 share link를 사용해야 하며, 다른 프로젝트로 fork하려면 reviewer가 승인한 fork reason을 기록해야 합니다.

이 패키지에서 확인한 공식/공개 근거:

- Google Labs DESIGN.md post: `DESIGN.md`는 Stitch가 brand/design-system reasoning을 유지하도록 design rule을 프로젝트 간 가져가거나 내보내는 데 쓰일 수 있습니다.
  - Source: https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/
- Google Codelab Stitch MCP design-to-code flow: Stitch 작업은 project 생성/명명/listing 확인을 포함하고, fetched design context에서 `DESIGN.md`를 생성할 수 있습니다.
  - Source: https://codelabs.developers.google.com/design-to-code-with-antigravity-stitch
- Google AI Developers Forum Stitch Prompt Guide: high-level prompt 후 screen-by-screen refinement, 구체적인 UI/UX 용어와 incremental change가 필요합니다.
  - Source: https://discuss.ai.google.dev/t/stitch-prompt-guide/83844

Design-system drift는 단순 시각 취향 문제가 아니라 handoff blocker입니다. 아래는 stop 또는 reviewer fail 조건입니다.

- 선택된 `DESIGN.md` 또는 `design.md` baseline이 없음
- baseline `DESIGN.md`와 선택한 Stitch project가 충돌함
- continuation work가 승인된 fork reason 없이 다른 Stitch project를 사용함
- prompt가 승인된 `DESIGN.md`와 충돌함
- output style이 승인된 `DESIGN.md`로 추적되지 않음
- 승인 없이 visual token, typography, spacing, component shape language, brand tone이 바뀜
- manifest/handoff에 baseline 또는 drift metadata가 없음
- `design-reviewer`가 drift 또는 same-project continuity 실패를 지적함

manifest 또는 handoff에는 최소한 아래 metadata가 있어야 합니다.

- `design_system_baseline`
- `design_md_source_path_or_url`
- `design_md_hash_or_version` when practical
- `stitch_project_id_or_share_link`
- `extends_existing_project: true|false`
- `fork_reason`
- `drift_check_result`
- `design_reviewer_verdict_path`

Stitch prompt에는 아래 field가 필요합니다.

```text
Design-system baseline: extend the approved DESIGN.md and same Stitch project; do not change visual tokens, typography, spacing, component shape language, or brand tone unless the plan explicitly includes an approved design-system update.
```

추후 skill/eval 보강 시 필요한 scenario:

- `DESIGN.md` baseline이 없으면 Stitch generation 전 stop
- Stitch project가 다르면 승인된 fork reason 없이는 stop
- 승인 없는 token/theme drift는 handoff stop
- 승인된 fork path는 fork reason과 reviewer evidence를 기록

## 필요한 Codex CLI 프로세스

1. `project-bootstrap`로 readiness를 확인합니다.
2. Stitch work가 필요하면 `stitch-adc-setup` 상태를 확인합니다. credential 내용은 출력하지 않습니다.
3. `WM_ROLE` 또는 `/workspace/IDENTITY`가 Design인지 확인합니다.
4. 승인된 Product/Planning requirement 또는 task가 있는지 확인합니다.
5. `DESIGN.md` decision을 확인합니다.
   - 사용자 또는 Product/Planning이 승인한 `DESIGN.md`/`design.md` baseline을 기록합니다.
   - continuation work이면 동일 Stitch project/project id/share link를 확인합니다.
6. P0 scope/evidence approval packet을 준비하고 P0 승인 전에는 Stitch generation을 하지 않습니다.
7. `design-mobile-design-handoff`와 `design-stitch-mcp-operating-rules`를 사용합니다.
8. 정확히 두 개의 Stitch option을 만듭니다.
9. P1 승인 전에는 HTML extraction을 하지 않습니다.
10. P1 승인 후 `design-pub-html/<date>/<work-unit-id>/`에 HTML/image/manifest/handoff를 작성합니다.
11. `design-reviewer` review 후 Mobile App Dev로 handoff합니다.

## 현재 문제점

Missing process:

- repo-local Design skill은 강하지만, pod에서 P0/P1, Stitch readiness, publication, reviewer handoff를 강제하는 실행 절차가 없습니다.

Missing pod-native bridge skill:

- 필요합니다. `codex-role-workflow`가 Design role을 `design-*` skill, `stitch-adc-setup`, `01-design/*`, `design-pub-html/*`와 연결해야 합니다.

Missing repo-local Codex skill:

- 현재 추가 필요 없음. `design-mobile-design-handoff`와 `design-stitch-mcp-operating-rules`가 충분합니다.

Missing custom reviewer/researcher/advisor:

- 현재 추가 필요 없음. `design-reviewer`, `design-researcher`가 있습니다.

Ambiguous handoff path:

- 경로는 정의되어 있지만 pod-native 실행 절차가 P0 -> Stitch -> P1 -> publication -> GitHub handoff를 강제하지 않습니다.

Overlap or role-boundary risk:

- Design이 app code나 backend/API 구현으로 넘어가면 안 됩니다.

External proof or human-gate risk:

- `stitch-adc-setup`은 readiness status일 뿐 Stitch generation/export proof가 아닙니다. P0/P1은 실제 stop gate입니다.

Validator/eval gap:

- Design role이 missing P0/P1에서 멈추는 eval이 필요합니다.

## 추가/보강 권고

추가:

- `mobile-app-dev-team/09-pod-native-openclaw-skills/codex-role-workflow/SKILL.md`

이 skill은 Design pod에서 다음을 보장해야 합니다.

- Design role 확인
- P0/P1 gate 확인
- `stitch-adc-setup` status 확인
- `design-*` skill 선택
- `01-design/*`와 `design-pub-html/*` artifact checklist 제시
- `design-reviewer` handoff

보강:

- `.agents/skills/design-mobile-design-handoff/SKILL.md`
- `.agents/skills/design-stitch-mcp-operating-rules/SKILL.md`

보강 내용:

- Stitch 공식 문서 확인 또는 `design-researcher`/`wm-docs-researcher` routing 기준
- 사용자/Product가 승인한 `DESIGN.md` baseline과 동일 Stitch project 연속성 확인
- P0 계획 reviewer 전 Stitch generation 금지
- Stitch prompt template와 refinement prompt template
- MCP readiness, generation proof, export proof, reviewer proof의 차이
- manifest baseline metadata와 drift check
- final reviewer와 `git diff`/`git status --short` 보고 의무

## 완료 기준

- P0 승인 전 Stitch generation 금지
- P1 승인 전 HTML extraction 금지
- 선택된 `DESIGN.md` 또는 `design.md` baseline이 기록됨
- continuation work는 승인된 fork reason이 없는 한 동일 Stitch project를 사용함
- manifest/handoff에 `design_system_baseline`, design source, Stitch project id/share link, extension/fork status, drift result, reviewer verdict path가 기록됨
- 승인되지 않은 design-system drift는 Mobile App Dev handoff를 막음
- Stitch 공식 문서 근거 또는 docs-researcher evidence가 기록됨
- Stitch prompt, source inputs, capability/limitation이 handoff에 기록됨
- 두 개 option과 five-state coverage 요구
- `design-reviewer` evidence 요구
- 최종 reviewer가 implementation handoff suitability를 확인함
- `git diff`와 `git status --short` 확인 결과가 보고됨
- Design 외 role work 금지
