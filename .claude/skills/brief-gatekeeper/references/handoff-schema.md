# Brief Gatekeeper → Product/Planning 핸드오프 스키마

Brief Gatekeeper가 "기존 구조로 부족"으로 판단하여 Product/Planning를 호출할 때,
아래 구조로 인자를 전달합니다.

**이 스키마는 Brief Gatekeeper와 Product/Planning 양쪽에서 동일하게 참조합니다.**

---

## 필수 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `document_summary` | string | 입력 문서의 구조화된 요약 (종류, 주제, 핵심 내용) |
| `clarified_request` | string | 명확화된 요청 내용 (무엇을, 어디에 집중해서, 어떤 형태로) |
| `insufficiency_reason` | string | 기존 역할/팀으로 부족한 구체적 이유 |
| `quick_scan_result` | object | 6가지 기준 간이 판정 결과 {task_complexity: low/mid/high, formula_vs_judgment: low/mid/high, external_comm: low/mid/high, standard_procedure: low/mid/high, domain_expertise: low/mid/high, error_impact: low/mid/high, total_score: number, high_count: number} |

## 선택 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `audience` | string | 결과물 대상 (내부 팀 / 임원 / 외부 고객 등) |
| `scope` | string | 범위 기준 (전사 / 특정 팀 / 특정 서비스 등) |
| `timeframe` | string | 시점 기준 (기간, 날짜 등) |
| `background` | string | 작업 배경, 비교 대상, 이슈 등 |
| `checklist_result` | object | 명확성 체크리스트 판정 결과 {request_verb: YES/NO, scope: YES/NO, output_format: YES/NO, background: YES/NO/N/A} |

---

## 전달 형식

Product/Planning 핸드오프 시 `$ARGUMENTS`로 아래 형식의 마크다운을 전달합니다:

```markdown
## 문서 요약
{document_summary}

## 명확화된 요청
{clarified_request}

## 기존 역할 부족 사유
{insufficiency_reason}

## 배경 정보 (있을 경우)
- 대상: {audience}
- 범위: {scope}
- 시점: {timeframe}
- 배경: {background}

## 간이 판정 결과
{quick_scan_result 객체를 YAML 또는 표 형식으로 전달}
```

---

## Product/Planning 가드

Product/Planning는 입력에 위 필수 필드 4개가 모두 포함되어 있는지 먼저 확인한다.
**하나라도 없으면 반려 응답을 보내고 `/brief-gatekeeper`로 위임한다.**

---

## 반려 응답 형식

Product/Planning가 필수 필드 부족으로 반려할 때 아래 형식으로 응답한다:

```markdown
## 반려
- 부족한 필드: {field_name}
- 사유: {왜 부족한지 구체적 설명}
```

**Brief Gatekeeper의 반려 대응:**
1. 반려 응답에서 부족한 필드명과 사유를 확인한다.
2. 해당 필드만 보충하여 1회 재전달한다.
3. 2회 반려 시 멈추고 사용자에게 상황을 안내한다.
