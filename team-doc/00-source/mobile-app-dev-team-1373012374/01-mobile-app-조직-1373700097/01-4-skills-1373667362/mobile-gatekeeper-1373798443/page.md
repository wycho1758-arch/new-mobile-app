---
pageId: "1373798443"
sourceTitle: "mobile-gatekeeper"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1373798443"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

| 항목 | 내용 |
| --- | --- |
| 목적 | agent가 작업 중 같은 gate script를 실행하도록 돕습니다. 실제 pass/fail은 deterministic script와 GitHub required check가 합니다. |
| Upstream | 01-4, \[00\] 00-3 (evidence/gate 추상 계약) |
| Downstream | 01-3 전 케이스 (01-2의 언급은 정의 위치 링크 — 의존 edge 아님) |
| 관련 DEC-ID | DEC-002, DEC-005 |
| 출처 | 운영계획 §3.1 #5 (2026-06-05 수정본 — task-PR 분기) |

## mobile-gatekeeper

### 목적

* agent가 작업 중 같은 gate script를 실행하도록 돕습니다.
* 실제 pass/fail은 deterministic script와 GitHub required check가 합니다.

### 위치

```
new-mobile-app repo skill pack
```

### 파일 구조

```
.agents/skills/mobile-gatekeeper/SKILL.md
scripts/mobile-gatekeeper-check.ts
.github/workflows/mobile-gatekeeper.yml
```

### 대상 [SOUL.md](http://SOUL.md)(role)

| Role | 사용 방식 |
| --- | --- |
| Gatekeeper(non-LLM) | deterministic owner. SOUL.md를 갖지 않으며 script와 GitHub required check가 pass/fail을 판단한다. |
| Mobile App Dev | direct responder. mobile implementation PR의 evidence/gate 실패를 수정한다. |
| Backend/API Integrator | direct responder. backend/API 연계 PR의 contract/evidence/gate 실패를 수정한다. |
| QA/Release | evidence provider. EAS/Maestro 결과와 release evidence를 기록한다. |
| Mobile Architect | reviewer/escalation. architecture, EAS, contract 경계의 gate 실패를 검토한다. |
| Product/Planning | escalation-only. rework cap, scope 변경, human decision이 필요한 경우에만 개입한다. |

### 단일 SoT

* `SKILL.md`와 GitHub workflow는 repo-root `scripts/mobile-gatekeeper-check.ts` 단일 파일을 실행합니다.
* 검사 로직을 skill 내부나 workflow YAML 안에 복제하지 않습니다.
* skill은 실행 절차와 결과 해석만 담당하고, 판정 술어는 script에 둡니다.
* 어떤 workflow skill도 gatekeeper pass/fail을 대체하거나 재해석하지 않습니다. Workflow skill은 gate result를 소비하고 다음 수정 owner만 정렬합니다.
* 위 세 파일은 모두 모노레포 root 기준 경로이며(`apps/mobile/` 내부가 아님), Confluence 템플릿에는 포함되어 있지 않으므로 Phase 3에서 조직 운영 레이어로 추가합니다.

### EAS/Maestro 결과 브리지

* Maestro E2E와 EAS build는 EAS Workflows(클라우드)에서 실행되므로, GitHub required check가 그 결과를 직접 알 수 없습니다.
* QA/Release가 EAS workflow run id, build id, Maestro 결과를 `.evidence/<task-id>.json`에 기록하고, gatekeeper required check는 이 evidence 파일을 기반으로 `eas_build_id_exists`, `maestro_passed` 등을 검증합니다.
* EAS/Maestro webhook ingestion으로 이 브리지를 자동화하는 것은 Phase 5 후순위입니다.

### 주 사용 agent

* Mobile App Dev
* Backend/API Integrator
* QA/Release
* Mobile Architect

주: 위 4종은 gate 결과에 직접 대응하는 역할로 의미를 한정합니다. PR을 만드는 모든 역할은 SOUL Gate Compliance에 따라 review 요청 전 mobile-gatekeeper 게이트를 준수합니다 (01-3 정합성 조사 GAP-09).

### 입력

* task id
* PR URL 또는 branch
* `.evidence/<task-id>.json`
* EAS/Maestro 결과

### 출력

* gate result JSON
* 실패 field 목록
* next action
* exit code

### 동작

1. evidence 파일을 찾습니다.
2. deterministic script를 실행합니다.
3. 누락 field, SHA 불일치, Maestro 실패, author=approver 등을 보고합니다.
4. agent에게 수정할 항목을 알려줍니다.

### 검사 예(feature PR 기준)

```
task_id_exists: true
branch_contains_task_id: true
pr_body_has_evidence_link: true
pr_head_sha: exists
ci_checkout_sha: exists
eas_build_id_exists: true
eas_build_git_commit_matches_expected_checkout_sha: true
maestro_passed: true
approver_not_author: true
rework_count_lt_cap: true
```

### GitHub CI 조건

* required check로 등록합니다.
* 모든 PR에서 항상 실행합니다.
* path filter나 conditional skip 등 workflow YAML 레벨 분기로 빠지면 안 됩니다.
* PR 종류 분기는 deterministic script 내부에서만 판정합니다. branch명 또는 PR body의 task-id 유무로 feature PR 여부를 판별합니다.
* feature PR(task-id 존재): evidence 누락, EAS 미실행, Maestro 미수집은 exit 1입니다.
* non-task PR(task-id 없음 — docs 수정, Case A initial/bootstrap PR 등): EAS/Maestro/evidence 검사를 적용하지 않고 통과시키되, `task_pr: false` 판정을 gate result JSON에 기록합니다. 모든 PR에 EAS 클라우드 빌드를 강제하면 비용·속도 면에서 오버스펙이고, evidence가 존재할 수 없는 initial PR이 영구히 merge 불가능해지는 자기모순이 생기기 때문입니다.
* 잔여 위험: feature 작업이 task-id를 누락해 non-task PR로 위장할 수 있습니다. 이는 reviewer(approver) 확인과 Tasks 운영(모든 feature 작업은 task 선행 생성)으로 차단하며, gate result JSON의 `task_pr` 값을 PR comment로 노출해 review 시 확인 가능하게 합니다.
* skipped/neutral이 hard gate를 우회하지 않도록 sentinel job을 둡니다.
