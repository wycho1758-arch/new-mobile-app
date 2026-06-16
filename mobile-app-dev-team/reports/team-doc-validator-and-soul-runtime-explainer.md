# Team-Doc Validator & SOUL Runtime Explainer

이 문서는 `scripts/validate-team-doc.mjs`(이하 "팀 문서 검증기")가 무엇을 강제하는지,
그리고 `runtime-sources/role-souls/*-soul.md`가 실제 OpenClaw pod 에이전트와 어떤 관계인지 설명한다.
근거는 repo 내 SoT 문서 직접 확인이며, 인용 경로를 함께 표기한다.

## 1. 한 줄 요약

팀 문서 검증기는 **런타임 에이전트에 도는 것이 아니라**, 누군가 팀 운영 문서(특히 role SOUL
정의)를 **수정하는 PR**을 올릴 때 repo CI에서 돌아 **핵심 정체성·경계·구조·안전규칙이
사라지지 않도록 막는 안전장치**다.

## 2. role SOUL 문서의 정체

- `mobile-app-dev-team/runtime-sources/role-souls/*-soul.md`는 데이터 파일이 아니라 **역할 에이전트의
  정의서(설계도)** 다. 실제 첫 줄: `# Mobile App Dev SOUL.md`, `Display Title:`,
  `Operating Role:`, `## Identity` → "You are the Mobile App Developer ...".
- 즉 "이 역할의 AI는 이런 정체성·경계·금지사항을 가진다"는 명세다.

## 3. SOUL 문서 ↔ 실행 pod 에이전트 관계

- pod의 역할 정체성은 런타임에서 `/workspace/SOUL.md` + `WM_ROLE`/`WM_EXPECTED_ROLE`/
  `/workspace/IDENTITY` 같은 표면으로 확인된다 (`16-pod-environment-bootstrap.md`,
  `runtime-sources/pod-native-openclaw-skills/*-runtime-spec.md`).
- repo의 `runtime-sources/role-souls/*-soul.md`는 각 역할의 **repo-managed role spec**이고,
  `runtime-sources/pod-native-openclaw-skills/*-runtime-spec.md`는 그 role spec을 pod-native setup,
  repo-local Codex skill, reviewer, durable artifact, stop condition과 연결하는 runtime/bootstrap
  guidance다.
- 현재 repo SoT만으로는 `runtime-sources/role-souls/*-soul.md`가 live pod의 `/workspace/SOUL.md` seed로
  자동 변환되는 구체 메커니즘을 증명하지 않는다. repo soul.md가 pod로 그대로 복사되지 않는다는
  점만 검증기가 보수적으로 지킨다(검증기가 `mobile-app-dev-soul.md`에서 "verbatim 런타임
  템플릿/raw seed payload"라는 note를 `forbidDocTerms`로 금지). live pod seed 주입은 별도
  platform evidence가 필요하다.

```
[ 사람/거버넌스가 유지하는 설계도(SoT) ]
 runtime-sources/role-souls/mobile-app-dev-soul.md , 09-.../*-runtime-spec.md ...
        │ ① 정체성·경계·금지·역할간 handoff 명세
        │ ② pod setup/runtime guidance와 연결 (live seed 주입은 별도 증거 필요)
        ▼
[ pod 런타임 ] /workspace/SOUL.md + /workspace/skills/<slug>/
        │
        ▼
[ 살아있는 에이전트 ] 예: Mobile App Dev pod
        │
        ▼
③ 실제 프로젝트 작업(앱 코드 PR). 이 단계에선 soul.md를 "읽은 결과"로 행동할 뿐 수정하지 않음.
```

## 4. 검증기는 ③(런타임)이 아니라 ①(설계도 수정 PR)을 지킨다

```
사람/문서담당이 soul.md 등 수정 → PR → [validate-team-doc.mjs]
  핵심 경계/정체성/구조/안전규칙 삭제됨? → 예 → ❌ merge 차단
  모두 존재?                          → 예 → ✅ 통과
```

검증기는 평소 프로젝트 코드 작업이 아니라, **운영 문서(설계도)를 고치는 변경**을 감시한다.

## 5. 왜 "다른 에이전트들의 작업"과 직결되나

- (a) 설계도가 깨지면 → role spec, runtime spec, validator, reviewer handoff가 서로 어긋날 수
  있음 → 프로젝트 작업에서 오작동(예: "구현 전 테스트 먼저" / "고객 시크릿 금지" 규칙 유실).
- (b) 각 soul.md는 **역할 간 경계(handoff)** 도 정의한다(예: Product/Planning은 Design 품질을
  승인하지 않음). 6개 SOUL이 서로 맞물려 협업 경계를 이루므로 한 세트로 검증한다.

## 6. 검증 대상 범위

- 주 대상: `mobile-app-dev-team/**`(현재 관리되는 team/role/process/reference 문서; SoT 5순위).
- 추가로 루트 교차 계약: `AGENTS.md` 라우팅, `.agents/skills/*` 커버리지,
  `docs/plans/work-units/` 핸드오프 계약.
- `.codex/agents/*` TOML 자체의 read-only/reviewer/researcher 계약은 `test:runtime`에
  함께 포함된 `scripts/validate-runtime-artifacts.mjs`가 직접 검사한다. `validate-team-doc.mjs`는
  managed docs 안에서 그 custom-agent 경로와 역할 참조가 어긋나지 않도록 교차 확인한다.
- 검사 종류: 필수 문서/파일 존재, 필수 경계어·구조(헤딩 순서 / frontmatter), 시크릿 스캔,
  완료 plan 아카이브, pod-native skill 계약(status-only · 토큰 출력 금지 · `redact()`).

## 7. 성능·실행 시점 (오해 정리)

- `validate-team-doc.mjs` 단독 ≈ 0.09초, `test:runtime` 전체 ≈ 4초(실측, 환경에 따라 변동).
- **자동 트리거 없음**: husky / git hook / `.claude` hook 부재 → 문서 저장마다 자동 실행되지 않음.
  명시적으로 실행하거나 PR CI에서만 동작.
- 체감 느림은 `test:local-harness`가 preflight, `test:runtime`, `pnpm turbo run lint test`,
  local-harness self/full stage를 함께 실행하기 때문에 생길 수 있다. 이 중 `pnpm turbo run lint test`
  는 흔한 큰 비용 항목이지만, 느림 전체를 팀 문서 검증기 단독 비용으로 보면 안 된다.

## 8. SoT 근거

- `mobile-app-dev-team/governance/sot-and-principles.md` — SoT 우선순위(이 폴더 5순위), "가장 좁은 검증" 원칙.
- `mobile-app-dev-team/README.md` — 문서 구조표, "운영자가 읽고 유지할 current SoT".
- `AGENTS.md` — sync/부팅 흐름(`openclaw-pod-skills-sync` → `project-bootstrap`).
- `mobile-app-dev-team/16-pod-environment-bootstrap.md` — `/workspace/SOUL.md`·`WM_ROLE` 부팅.
- `mobile-app-dev-team/runtime-sources/pod-native-openclaw-skills/product-planning-agent-runtime-spec.md` — SOUL 정체성→런타임 연결.
- `REPO_OPERATIONS.md` Validator Responsibility Model — "Validators enforce documented policy."
- `scripts/validate-team-doc.mjs` — `forbidDocTerms`(verbatim-template note 금지) 등 검사 구현.

> 한계: soul.md→pod seed의 구체 주입 메커니즘은 본 문서 범위에서 미상세. 수치·시간은 실측/근사.
