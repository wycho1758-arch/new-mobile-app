---
name: brief-gatekeeper
description: >
  Prevents premature execution of ambiguous work requests by verifying request verb, scope, output format, and background before starting.
  Runs an explicit clarity checklist, bundles any missing items into a single question round, then confirms understanding before acting.
  Use when a file, document, or work request arrives (especially business analyses, reviews, reports, role/team design, JD/SOP/manual processing) — particularly if the request uses vague verbs like "정리", "처리", "봐줘", "분석해줘", "이거 해줘", or omits scope/output format.
  Do not use for simple greetings, casual chat, already fully-specified requests with verb+scope+format all clear, short follow-up questions on work already in progress, code writing, translation, or pure format conversion.
---

# Brief Gatekeeper (v0.15)

**업무 요청의 모호성을 해소하고, 역할 설계가 필요한지 판단하는 게이트키퍼 스킬.**

> **독립 스킬:** 이 스킬은 자기완결로 동작하며 다른 스킬을 호출하지 않는다. 복잡도가 높아
> 에스컬레이션 조건을 충족하면 외부 스킬을 호출하는 대신 **사용자/Product·Planning 역할에
> 핸드오프(역할·범위 설계 필요)를 제시하고 멈춘다.** read-only·확인형이며 게이트를 우회하지 않는다.

**핵심 원칙:** 이 스킬이 발동되면 **반드시** 체크리스트 판정 결과를 사용자에게 *가시적으로* 노출하고, *모든* 분기에서 Step 4(이해 확인)를 실행한다. 예외는 아래 "스킵 화이트리스트"에 명시된 경우로만 한정한다.

절차 상세: [references/procedure.md](references/procedure.md)
에스컬레이션 판정표: [references/escalation-criteria.md](references/escalation-criteria.md)
핸드오프 스키마: [references/handoff-schema.md](references/handoff-schema.md)
질문/확인 예시: [examples/clarification-question.md](examples/clarification-question.md), [examples/confirmation.md](examples/confirmation.md)
v0.13→v0.15 변경 사유: [references/changelog.md](references/changelog.md)

---

## 스킵 화이트리스트 (이 경우에만 발동 안 함)

아래 요청 유형은 BG를 건너뛴다. **이 목록에 명시되지 않은 요청은 반드시 체크리스트를 수행한다.**

- 인사, 잡담, 안부, 상태 확인
- 이미 진행 중인 작업의 짧은 후속 질문 (예: "방금 보낸 표에서 3번 항목만 수정")
- 필수 3항목(요청 동사·집중 범위·결과물 형태)이 *모두 단일 해석으로* 명시된 요청
- 단일 코드 작성·디버깅 (예: "이 파이썬 에러 고쳐줘")
- 번역 (언어 A → 언어 B, 출력 형식 동일)
- 형식 변환 (예: CSV → JSON, PDF → 텍스트)

**중요:** "요약", "정리", "해석", "분석", "검토", "처리" 같은 동사는 *결과물 형태·범위에 다중 해석 여지*가 있으므로 **스킵 대상이 아니다.** 반드시 체크리스트로 진입한다.

---

## 표준 작업 체크리스트 (에이전트 실행 시 복사)

BG 발동 시 아래 체크리스트를 응답에 포함시키고, 각 단계 완료 시 ✅ 표시한다:

```
[Brief Gatekeeper] 📋
- [ ] Step 1: 문서·요청 이해 (종류·도메인·한 줄 요약)
- [ ] Step 2: 명확성 체크리스트 판정표 출력 (#1~#4)
- [ ] Step 3: 부족 항목 있으면 1회 묶음 질문 (없으면 스킵)
- [ ] Step 4: 이해 확인 (요약 + "맞으면 진행/수정" 선택지) — 전 분기 필수
- [ ] Step 5: 6기준 간이 판정 (분석·보고서·전략 요청일 때 필수)
- [ ] Step 6: 실행 또는 Product/Planning 핸드오프
```

---

## 명확성 체크리스트 (Step 2에서 반드시 판정표로 출력)

| # | 항목 | YES 조건 | 필수 여부 |
|---|------|----------|-----------|
| 1 | **요청 동사** | 분석/요약/검토/작성/추출/비교/계산 등 **구체 동작**이 식별됨 | 필수 |
| 2 | **집중 범위** | 전체/특정부분/특정관점이 식별됨 | 필수 |
| 3 | **결과물 형태** | 요약텍스트/표/엑셀/보고서/슬라이드 등 **형식**이 식별됨 | 필수 |
| 4 | **배경 정보** | 대상·범위기준·시점·작업배경이 식별됨 | 조건부 |

### #1 "요청 동사" 판정 보조 규칙

**구체 동작 (YES):** 분석, 요약, 검토, 작성, 추출, 비교, 계산, 번역, 변환, 교정, 생성

**모호 동작 (NO — 반드시 재질문):** 정리, 처리, 봐줘, 손봐줘, 확인해줘, 체크해봐, 이거 해줘, 어떻게 생각해

→ 모호 동작은 구체 동작 중 어느 것인지 묻는다.

### #4 "배경 정보" 판정 규칙

- 요청 유형이 **분석 / 전략 제안 / 보고서 작성 / 평가·검토·리뷰** → 필수 (YES/NO)
- 그 외 (단순 추출·변환·계산) → N/A

### 진행 조건

필수 항목 #1~#3 모두 YES + #4가 YES 또는 N/A → Step 4(확인)로 진행.
한 항목이라도 NO → Step 3(질문)로 진행.

---

## 질문 규칙 (Step 3)

- **구조화된 질문 포맷**으로 질문한다: 번호 매긴 선택지 + ★ 권장 옵션 표기.
- 각 질문에 선택지 4~5개 + 권장 옵션(★) 제시.
- **이미 명확한 항목은 묻지 않는다**. 단, *다른 부족 항목은 반드시 묻는다* (이 규칙을 근거로 전체 질문을 스킵하면 안 됨).

**질문 라운드 규칙 (최대 2라운드):**
- **라운드 1:** 부족 항목을 한 번에 묶어서 질문.
- **라운드 2:** 라운드 1 답변이 여전히 불충분할 때, 부족 항목만 1회 추가 질문.
- **2라운드 후 불명확 → 멈춤.** 억지로 진행하지 않는다.

---

## 이해 확인 규칙 (Step 4) — 전 분기 필수

**어느 분기(1·3·4)에서도 반드시 수행한다. 예외 없음.**

**분기 1(전항목 YES)에서도 Step 4는 반드시 '사용자 응답을 받는 단계'로 실행한다.** 체크박스만 체크하고 넘어가면 Fail.
**'자명', '명확함', '추가 확인 불필요' 등의 표현으로 Step 4를 스킵 정당화하면 Fail.**

Step 4를 완료로 표기하려면, 사용자 응답(a/b/c 등)이 선행되어야 한다. 응답 없이 `[x] Step 4` 표기는 체크리스트 위조(Fail).

필수 산출물 3개:
1. **요약 박스**: 요청·범위·결과물·(배경)·진행 방식·예상 소요
2. **진행 방식 리스트**: 단계별 계획
3. **선택지 블록**: `(a) 맞습니다, 진행 ★` / `(b) 수정 필요` — **선택지 블록이 없으면 자동 Fail**

수정 요청 시 해당 항목만 재질문. 이 수정 질문은 **라운드 2**로 카운트한다.

---

## 에스컬레이션 판정 (Step 5) — 조건부 필수

**필수 수행 조건:** 요청 유형이 분석 / 전략 제안 / 보고서 작성 / 평가·리뷰 중 하나.
**스킵 조건:** 단순 추출·변환·계산·번역.

Product/Planning의 6가지 기준으로 간이 판정한다. 각 기준을 `low(1) / mid(2) / high(3)`로 평가:

| 기준 | 점수 |
|------|:---:|
| 업무 유형 복합도 | 1 / 2 / 3 |
| 공식 vs 판단 | 1 / 2 / 3 |
| 외부 커뮤니케이션 | 1 / 2 / 3 |
| 표준 절차 | 1 / 2 / 3 |
| 도메인 전문성 | 1 / 2 / 3 |
| 실수 영향도 | 1 / 2 / 3 |

**Product/Planning 핸드오프 조건 (둘 중 하나라도):**
- high ≥ 3, 또는
- 총점 ≥ 14 (만점 18)

판정 결과 역시 응답에 *가시적으로* 출력한다. 상세: [references/escalation-criteria.md](references/escalation-criteria.md).

---

## 결과 분기

| 분기 | 조건 | 응답 내용 | 다음 동작 |
|:----:|------|-----------|-----------|
| **1. 바로 진행** | 체크리스트 전항목 YES + Step 5 호출조건 미달 | 체크리스트 판정표 + Step 4 이해 확인 | 사용자 확인 후 실행 |
| **2. 추가 확인** | 체크리스트 1개 이상 NO | 체크리스트 판정표 + Step 3 묶음 질문 | 답변 수신 → Step 2 복귀 |
| **3. 기존 역할로 충분** | 판정 완료 + Step 5 호출조건 미달 | Step 4 확인 후 해당 역할 명시 | 역할/팀에 위임 |
| **4. Product/Planning 핸드오프** | Step 5 호출조건 충족 | Step 4 확인 후 에스컬레이션 핸드오프 | 핸드오프 스키마로 전달 |
| **5. 멈춤** | 질문 2라운드 후에도 불명확 | 사유 + 안내 | 작업 중단 |

**모든 분기에서 Step 4(이해 확인)는 필수다.**

---

## 핵심 원칙 (준수 체크)

1. 체크리스트 판정표는 *반드시 사용자에게 노출* — 내부 판정만 수행하는 것은 금지
2. `[Brief Gatekeeper] 📋` 태그로 발동 사실을 명시
3. 모호 동사(정리·처리·봐줘 등)는 #1 NO 판정
4. 스킵은 화이트리스트에 명시된 경우로만 한정
5. Step 4 확인은 전 분기 필수 — "바로 진행"이라도 확인 먼저 (체크박스만 찍기 금지, 선택지 블록 필수)
6. 이미 명확한 항목은 재질문 금지, 그러나 다른 부족 항목은 반드시 질문
7. 질문은 구조화된 포맷(번호 선택지 + ★ 권장 옵션)으로 전달
8. 질문은 최대 2라운드
9. Step 5 판정도 응답에 노출 (분석·보고서·전략 요청일 때)
10. Product/Planning 핸드오프 시 handoff-schema의 필수 4필드 전달
