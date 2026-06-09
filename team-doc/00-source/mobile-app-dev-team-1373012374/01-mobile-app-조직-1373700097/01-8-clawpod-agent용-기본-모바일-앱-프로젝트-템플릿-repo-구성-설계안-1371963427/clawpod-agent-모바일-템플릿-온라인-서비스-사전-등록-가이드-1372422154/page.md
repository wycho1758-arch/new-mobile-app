---
pageId: "1372422154"
sourceTitle: "ClawPod Agent 모바일 템플릿 온라인 서비스 사전 등록 가이드"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1372422154"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

**문서 목적**

이 문서는 [ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1371963427)을 진행하기 전에 사람이 미리 등록하거나 준비해야 하는 온라인 서비스, 계정, 결제 항목을 정리합니다.

대상 프로젝트는 ClawPod 자체 모바일 앱이 아니라 **ClawPod으로 생성된 Agent가 고객/프로젝트별 모바일 앱을 작업할 때 사용하는 기본 모바일 앱 프로젝트 템플릿**입니다. Agent는 Mac, Xcode, Android Studio, 물리 디바이스 없이 Expo EAS 클라우드에서 빌드·테스트·제출·OTA를 실행해야 합니다.

**무료 우선 원칙**

* 기본 정책은 **무료 플랜 또는 무료 한도로 시작**입니다.
* 결제는 dry-run과 템플릿 검증에 꼭 필요하지 않으면 보류합니다.
* Apple Developer Program과 Google Play Console은 **스토어 제출 전**까지 가입/결제를 미룹니다.
* Codex, Google Stitch, Jira는 이번 운영 모델의 필수 실행면이지만, 가능한 경우 기존 계정 또는 무료/최소 플랜으로 시작합니다.
* 유료 플랜은 사용량, 팀 규모, production 제출, 보안/운영 요건이 확인된 뒤 승인합니다.
* Agent에게 카드 정보, 개인 계정 비밀번호, Apple/Google/Sentry/GitHub/OpenAI/Atlassian owner 권한을 직접 맡기지 않습니다. Agent에는 필요한 token/secret만 최소 권한으로 주입합니다.

## 1. 배경과 목적 요약

| 구분 | 내용 |
| --- | --- |
| 프로젝트 목적 | ClawPod Agent가 고객/프로젝트 모바일 앱을 시작할 때 쓰는 기본 템플릿 repo 준비 |
| 개발 실행면 | Codex. Agent는 Codex로 코드 작성, 테스트, 문서 반영, PR 준비를 수행 |
| 설계 실행면 | Confluence. SoT, 운영 기준, 결정 사항을 문서화 |
| 티켓/보고 실행면 | Jira. 작업 티켓, 진행 보고, 완료/보류 상태를 관리 |
| 디자인/publishing 실행면 | Google Stitch. 모바일 UI 초안, 디자인 반복, 공유/publishing 링크 또는 산출물을 관리 |
| 모바일 빌드 실행면 | Expo EAS Build / Submit / Update / Workflows / Credentials |
| 검증 목표 | 공유 패키지 import → Jest unit test → Maestro E2E → EAS cloud build |
| 운영 방식 | GitHub PR gate는 정적 검사/유닛 테스트, 모바일 cloud build/E2E/submit/update는 EAS Workflows |
| 인증 방식 | Agent runner에 `EXPO_TOKEN`을 k8s Secret으로 주입 |
| 비용 정책 | 무료로 가능한 단계는 무료로 진행, production 제출/사용량 초과 전까지 paid plan 보류 |

## 2. 필수 서비스

필수 서비스는 템플릿 생성, 설계, 티켓 보고, 디자인/publishing, 개발, PR 검증, EAS cloud build/E2E, Agent 자동 실행을 위해 필요합니다. 단, 결제는 가능한 한 보류합니다.

| 서비스 | 필수 사유 | 필요 시점 | 무료 우선 판단 | 사용자 액션 | Agent에 전달할 값 | 전달 금지 |
| --- | --- | --- | --- | --- | --- | --- |
| Codex / OpenAI 계정 | Agent 개발 실행면. 코드 작성, 테스트, 문서 반영, PR 준비는 **Codex CLI**(`codex exec` 비대화 실행, ChatGPT-plan 인증)로 수행 | Day 0 | 기존 ChatGPT/Codex 접근권을 먼저 사용. 공식 Codex 안내 기준으로 eligible ChatGPT plan 또는 필요한 최소 plan/credit만 검토 | OpenAI/ChatGPT 계정 또는 조직 계정 준비, Codex 접근 가능 여부 확인, 필요 시 최소 플랜 승인 | Codex workspace/repo 연결 정보, 필요한 경우 제한된 API/org 설정 | OpenAI 계정 비밀번호, owner API key, 결제 카드 |
| Google Stitch | 디자인 및 publishing 실행면. 모바일 UI 초안, 반복 설계, 공유/publishing 산출물 생성 | Day 0 | Google Labs/Stitch 사용 가능 범위에서 무료 또는 no-cost path 우선. 가격/제공 조건은 사용 직전 공식 페이지 재확인 | Google 계정 준비, Stitch 접근 가능 여부 확인, 프로젝트별 design workspace/link 생성 | Stitch project/share URL, design/publishing 산출물 링크 | Google 계정 비밀번호, 결제 카드, owner 권한 |
| Jira | 티켓 보고 실행면. 작업 티켓, 진행 상태, 완료/보류 보고 관리 | Day 0 | Atlassian Free 또는 현재 사용 중인 Jira를 우선 재사용. 사용자 수/권한/자동화 한도 초과 시 paid 검토 | Jira project 생성 또는 기존 project 지정, workflow/status/report field 확인 | project key, issue URL, ticket id | 개인 로그인 정보, site admin owner credential |
| Atlassian Confluence | 설계 실행면. SoT, 등록 가이드, 결정 사항 관리 | Day 0 | 현재 사용 중. Free/현재 plan을 우선 재사용하고 사용자 수/스토리지 초과 시 paid 검토 | SoT 및 하위 가이드 페이지 유지, 결정 사항 기록 | page URL, space key | 개인 로그인 정보, site admin owner credential |
| GitHub 계정/조직 + repository | 템플릿 repo, PR, source control, GitHub Actions quality gate | Day 0 | 무료로 시작 가능. public repo는 Actions 무료, private repo는 포함량/초과 과금 확인 | 조직 또는 repo 생성, branch protection/ruleset 설정, 필요 시 GitHub App/Actions 활성화 | repo URL, branch명, read/write 범위가 제한된 deploy token 또는 GitHub App 권한 | 개인 비밀번호, owner PAT, 결제 카드 |
| Expo 계정/Organization + EAS project | EAS cloud build/E2E/OTA/submit 실행면 | Day 0 \~ dry-run 전 | Expo Free plan으로 제한된 Android/iOS build, EAS Workflows, Update를 먼저 사용 | Expo account/org 생성, `apps/mobile`에서 `eas init`, `EAS_PROJECT_ID` 확정 | `EXPO_OWNER`, `EAS_PROJECT_ID`, project slug | 개인 비밀번호, 결제 카드 |
| Expo access token / Robot user | Agent가 `EXPO_TOKEN`으로 EAS CLI를 비대화식 실행 | Agent 자동 실행 전 | token 생성 자체는 결제가 아니라 권한/보안 이슈. Expo 공식 문서는 personal access token도 허용하나, 본 운영 모델은 개인 계정 분리와 역할 기반 최소 권한을 위해 Robot user를 채택 | Expo dashboard에서 Robot user 또는 access token 생성, 최소 권한 부여, 만료/회수 절차 기록 | `EXPO_TOKEN`을 k8s Secret으로 주입 | token 원문을 문서/채팅/repo에 평문 저장 |
| ClawPod k8s/orchestrator 권한 | Agent runner Secret 주입 및 EAS CLI 실행 | Agent runner 실행 전 | 외부 유료 서비스 아님 | `EXPO_TOKEN_SECRET_NAME` 기준 Secret 생성 권한 확보, namespace 확인 | Secret 이름, namespace, service account 범위 | Secret 값 원문 |

## 3. Production 제출 전 필수 서비스

아래 항목은 템플릿 dry-run에는 필수가 아닙니다. 실제 App Store / Play Store 제출 일정이 확정되면 가입합니다.

| 서비스 | 필요 시점 | 결제/조건 | 사용자 액션 | Agent에 전달할 값 | 전달 금지 |
| --- | --- | --- | --- | --- | --- |
| Apple Developer Program | iOS App Store/TestFlight 제출 전 | Apple 공식 기준 99 USD/year. 조직 계정은 법인 확인 및 D-U-N-S 필요 | Apple Account 준비, 조직/개인 계정 유형 결정, 2FA, 결제, App Store Connect 팀 구성 | team id, bundle id, App Store Connect role/API key id 등 최소값 | Apple Account 비밀번호, 2FA, 결제 정보 |
| App Store Connect API key / credentials | iOS EAS Submit 자동화 전 | Apple Developer 가입 이후 생성 | API key 생성, issuer id/key id/private key 보관, EAS credentials 정책 확정 | `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID`, 필요한 경우 key를 Secret으로 주입 | `.p8` key 평문, 개인 Apple 세션 |
| Google Play Console developer account | Android Play Store 제출 전 | Google 공식 기준 US$25 one-time registration fee. 신원/연락처 검증 필요 | Google account 준비, developer account type 결정, 등록비 결제, identity/contact verification. **Android 최초 제출은 human owner가 Play Console에 앱을 수동 업로드 1회 수행해야 함** (Google 요구사항: API 기반 제출은 최소 1회 수동 업로드 이후에만 동작 — Expo Submit 공식 문서) | package name, app id, track명 | Google account 비밀번호, 결제 정보 |
| Google Play service account / API access | Android EAS Submit 자동화 전 | Play Console 계정 필요 | Google Cloud/Play Console 연동, service account 생성, 권한 최소화 | service account JSON을 Secret으로 주입, track명 | service account key 평문, owner 계정 |

## 4. Option 서비스

아래는 선택 또는 조건부 서비스입니다. 무료 한도 또는 no-cost path가 있으면 먼저 그 경로를 사용합니다.

| 서비스 | 구분 | 무료 우선 판단 | 도입 기준 | 사용자 액션 | Agent에 전달할 값 |
| --- | --- | --- | --- | --- | --- |
| Sentry | Option | Developer/free plan으로 1인/소규모 검증 가능. 팀·이벤트량 증가 시 paid 검토 | crash tracking, sourcemap symbolication을 유지하기로 결정한 경우 | Sentry org/project 생성, DSN/Auth token 생성 | `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` Secret |
| Figma | Option | Google Stitch를 기본 디자인/publishing 실행면으로 사용하므로 Figma는 보조 handoff가 필요할 때만. Starter/free 우선. **각주 (DEC-021)**: 디자인 저작 도구는 Stitch로 한정 — Figma는 저작 도구가 아니라 고객 요구 시 전달 포맷 옵션으로만 검토 | 고객/디자이너 협업이 Figma 파일을 요구할 때 | team/file 생성, 권한 부여 | Figma file URL, design token export |
| Maestro Cloud | Option | SoT 기본은 EAS Workflows의 `maestro` job이므로 별도 가입 불필요 | 별도 test analytics/hosted orchestration이 필요할 때만 | Maestro Cloud 필요성/가격 확인 | project/workspace id |
| mobile-mcp (로컬 visual QA MCP) | Option | `npx @mobilenext/mobile-mcp@<pinned>` — 계정/결제 불요(npx 무계정). `.codex/config.toml`에 버전 핀(`@latest` 금지) | Agent의 시뮬레이터/디바이스 시각 QA·자동화가 필요할 때 (CI 필수 게이트 아님) | 없음(로컬 실행) | 없음 |
| OpenAI API 추가 과금 | Option/조건부 | Codex/ChatGPT 기존 접근권으로 개발 가능하면 보류. API 사용은 사용량 과금 가능 | Codex 외부에서 별도 API 자동화가 필요할 때 | 조직 정책, 예산, token 발급 방식 확정 | 제한된 API key 또는 CLI auth 방식 |
| 결제 provider | PRD 조건부 | 템플릿에는 불필요 | 앱 PRD가 결제 기능을 요구할 때 | Toss/Stripe/Polar 등 별도 결정 | test key Secret |
| backend DB (apps/api 포함 시) | 조건부 | 템플릿 기본엔 불필요. `apps/api`(Hono+Drizzle) 포함 프로젝트만 | 신규 backend가 필요한 프로젝트 (01-8 §15) | PostgreSQL provisioning, `DATABASE_URL`을 k8s Secret으로 주입 | `DATABASE_URL` Secret |
| 이메일/SMS/Push provider | PRD 조건부 | 템플릿에는 불필요 | 앱 PRD가 외부 발송을 요구할 때. **push 알림 사용 시에는 provider 선택과 별개로 FCM service account(Android)·APNs push key(iOS) 자격증명을 EAS credentials에 선행 등록해야 함** (Expo 공식 FCM/managed credentials 문서) | provider 선택, sender/domain 검증, push 사용 시 FCM/APNs 자격증명 등록 | API key Secret |
| 개인정보/분석 도구 | PRD 조건부 | 템플릿에는 불필요 | PII, analytics, marketing attribution 필요 시 | DPA/약관/지역 보관 정책 확인 | public config, limited API key |

## 5. 단계별 등록 플로우

부기 (2026-06-07): 본 체크리스트는 템플릿 repo(`Wondermove-Inc/new-mobile-app`)의 `docs/SETUP.md` human-gate 섹션(Day 0 / Day 1 / Preview·Internal / Production submit)으로 인스턴스화되어 있다. 구현 검증 기록은 [01-8 템플릿 repo 구현 검증 근거 (2026-06-07)](https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1374355642) 참조.

### Day 0 — 비용 없이 시작

- [ ] Codex 사용 가능 계정/조직을 확인한다. 기존 ChatGPT/Codex 접근권을 우선 사용하고, 신규 paid plan은 필요한 경우에만 승인한다.
- [ ] Google Stitch 접근 가능 계정을 확인하고, 디자인/publishing 프로젝트를 생성한다. 가격/제공 조건은 사용 직전 공식 페이지로 재확인한다.
- [ ] Jira project를 생성하거나 기존 project를 지정하고, 티켓 보고 workflow를 확정한다.
- [ ] Confluence SoT와 이 페이지를 기준 문서로 고정한다.
- [ ] GitHub repo 또는 organization repo를 생성한다.
- [ ] Expo account/org를 생성하고 Free plan으로 시작한다.
- [ ] Figma/Sentry는 필요한 프로젝트에서만 생성한다.
- [ ] Apple Developer Program과 Google Play Console 결제는 하지 않는다.

### Day 1 — dry-run 전

- [ ] Codex에서 repo 접근, 작업 브랜치, `AGENTS.md` 지침 로딩을 확인한다.
- [ ] Google Stitch에서 모바일 UI 초안과 공유/publishing 링크 생성이 가능한지 확인한다.
- [ ] Jira에 템플릿 생성/검증 티켓을 만들고 진행 상태 보고 기준을 확인한다.
- [ ] `eas init`으로 EAS project를 만들고 `EAS_PROJECT_ID`를 확정한다.
- [ ] Expo access token 또는 Robot user token을 생성한다.
- [ ] ClawPod k8s Secret에 `EXPO_TOKEN`을 주입한다.
- [ ] GitHub Actions quality gate를 무료/포함량 안에서 실행한다.
- [ ] EAS Free plan 한도 안에서 Android e2e-test build를 먼저 실행한다.

### Preview/Internal build 전

- [ ] EAS Free build 한도와 queue delay를 확인한다.
- [ ] 빌드가 잦거나 대기 시간이 blocker가 될 때만 Expo Starter/Production 검토를 시작한다.
- [ ] Codex 사용량/credit이 부족할 때만 추가 credit 또는 상위 plan을 검토한다.
- [ ] Jira 사용자 수, 권한, 자동화 한도가 부족할 때만 paid plan을 검토한다.
- [ ] Google Stitch가 유료 조건을 요구하거나 한도가 부족할 때만 paid 또는 대체 도구 승인을 요청한다.
- [ ] Sentry를 유지하기로 했다면 free Developer plan 또는 최소 plan으로 DSN/Auth token을 준비한다.
- [ ] Figma handoff가 필요하면 Figma Starter/free로 먼저 시작한다.

### Production submit 전

- [ ] iOS 제출이 필요하면 Apple Developer Program 가입/결제와 App Store Connect 설정을 진행한다.
- [ ] Android 제출이 필요하면 Google Play Console 가입/등록비 결제와 identity verification을 진행한다.
- [ ] Android 최초 제출은 human owner가 Play Console에 앱(빌드 산출물)을 수동 업로드 1회 수행한다. Google 요구사항상 API 기반 제출(EAS Submit 자동화)은 최소 1회 수동 업로드 이후에만 동작한다 (Expo Submit 공식 문서 / 2026-06-06 표준성 감사 반영).
- [ ] EAS Submit 자동화를 위해 Apple/Google service credentials를 Secret으로 준비한다.
- [ ] Store 계정 명의와 고객/운영 대행 주체를 확정한다.
- [ ] production 빌드 빈도와 OTA MAU 기준으로 Expo paid plan 필요성을 최종 판단한다.

## 6. Secret / Credential 원칙

| 구분 | Owner | Agent 위임 가능 여부 | 처리 원칙 |
| --- | --- | --- | --- |
| 결제 카드 | Human owner | 불가 | 서비스 billing 화면에서만 입력. 문서/채팅/repo 저장 금지 |
| OpenAI/ChatGPT account password / 2FA | Human owner | 불가 | Agent에게 공유 금지 |
| Google Account password / 2FA | Human owner | 불가 | Stitch/Play Console 모두 계정 원문 공유 금지 |
| Atlassian account password / 2FA | Human owner | 불가 | Jira/Confluence 개인 로그인 공유 금지 |
| Apple Account password / 2FA | Human owner | 불가 | Agent에게 공유 금지 |
| `EXPO_TOKEN` | Human owner 생성, ClawPod Secret 관리 | 제한적으로 가능 | Secret으로만 주입, 평문 로그 금지, 권한 최소화 |
| Codex/OpenAI API key 또는 CLI auth | Human owner 생성 | 제한적으로 가능 | 필요 시 최소 권한/예산 제한. owner key 평문 저장 금지 |
| Jira API token | Human owner 또는 service account 생성 | 제한적으로 가능 | 티켓 생성/수정 최소 권한, Secret 저장 |
| `SENTRY_AUTH_TOKEN` | Human owner 생성 | 제한적으로 가능 | sourcemap upload 권한만 부여, Secret 저장 |
| App Store Connect API key | Human owner 생성 | 제한적으로 가능 | EAS Submit에 필요한 최소 권한, `.p8` 평문 저장 금지 |
| Google service account JSON | Human owner 생성 | 제한적으로 가능 | Play Console submit 최소 권한, Secret 저장 |
| public app config | Project owner | 가능 | `APP_DISPLAY_NAME`, slug, package id 등은 문서화 가능 |

## 7. 결제 보류 / 승인 기준

| 서비스 | 결제 보류 기준 | 결제 승인 기준 |
| --- | --- | --- |
| Codex / OpenAI | 기존 Codex/ChatGPT 접근권으로 개발 가능하면 보류 | Codex 접근 불가, credit 부족, 팀 운영상 Business/Enterprise가 필요한 경우 |
| Google Stitch | 사용 가능한 무료/no-cost 범위로 디자인/publishing 가능하면 보류 | 공식 제공 조건상 유료가 필요하거나 한도/협업/publishing 제약이 blocker가 될 때 |
| Jira/Confluence | 10명 이하/2GB 등 Free 또는 현재 plan 조건으로 충분하면 보류 | 사용자 수, 권한, 저장소, 자동화, 지원 요구 증가 |
| Expo | Free plan build/workflow/update 한도로 dry-run 가능하면 보류 | build queue/timeout/한도/production 배포가 blocker가 될 때 |
| GitHub | Free/public 또는 포함 Actions minutes로 충분하면 보류 | private repo CI 사용량 초과, 조직 보안 기능 필요 |
| Sentry | crash tracking이 아직 필수 아니거나 free 한도 충분하면 보류 | 팀 사용자, 이벤트량, 보존 기간, release health 요구 증가 |
| Figma | Google Stitch 산출물만으로 충분하면 보류. **각주 (DEC-021)**: 디자인 저작 도구는 Stitch로 한정 — Figma는 전달 포맷 옵션으로만 검토 | 고객/디자이너가 Figma handoff, Dev Mode, 팀 파일을 요구할 때 |
| Apple Developer Program | iOS submit/TestFlight 전까지 보류 | iOS App Store/TestFlight 일정 확정 |
| Google Play Console | Android submit 전까지 보류 | Android Play Store/internal track 일정 확정 |

## 8. 공식 기준 출처

* OpenAI Codex: [Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt), [Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/), [Codex rate card](https://help.openai.com/articles/20001106-codex-rate-card), [Codex CLI 공식 문서](https://developers.openai.com/codex)
* Google Stitch: [Google Labs Stitch announcement](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/), [Google Labs Stitch update](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-updates/)
* Atlassian Jira/Confluence pricing: [Jira pricing](https://www.atlassian.com/software/jira/pricing), [Confluence pricing](https://www.atlassian.com/software/confluence/pricing)
* Expo EAS pricing/plans: [Expo pricing](https://expo.dev/pricing), [Expo EAS plans](https://docs.expo.dev/billing/plans/)
* Expo programmatic access / `EXPO_TOKEN`: [Expo programmatic access](https://docs.expo.dev/accounts/programmatic-access/)
* Expo submit: [Submit to app stores](https://docs.expo.dev/deploy/submit-to-app-stores/), [EAS Submit introduction](https://docs.expo.dev/submit/introduction/) (Android 최초 1회 수동 업로드 요구)
* Expo push credentials: [FCM credentials](https://docs.expo.dev/push-notifications/fcm-credentials/), [Managed credentials](https://docs.expo.dev/app-signing/managed-credentials/)
* Apple Developer Program: [Apple Developer Program](https://developer.apple.com/programs/), [Choosing a Membership](https://developer.apple.com/support/compare-memberships/)
* Google Play Console: [Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)
* GitHub pricing / Actions billing: [GitHub pricing](https://github.com/pricing), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
* Sentry pricing: [Sentry pricing](https://sentry.io/pricing/)
* Figma pricing: [Figma pricing](https://www.figma.com/pricing/)
* Maestro Cloud docs: [Maestro Cloud overview](https://docs.maestro.dev/maestro-cloud)
* OpenAI API pricing: [OpenAI API pricing](https://openai.com/api/pricing/)

## 9. 결론

현재 단계에서 실제로 바로 등록 또는 접근 확인이 필요한 것은 **Codex/OpenAI 계정, Google Stitch 접근, Jira project, Confluence SoT, GitHub repo, Expo account/org + EAS project, Expo access token/Robot user, ClawPod Secret 주입 권한**입니다. 이 중 Codex/Google Stitch/Jira/Confluence는 각각 개발, 디자인/publishing, 티켓 보고, 설계 실행면이므로 필수입니다.

다만 결제는 여전히 무료 우선입니다. **Apple Developer Program, Google Play Console, Expo paid plan, Sentry paid plan, Figma paid plan, Maestro Cloud, 추가 OpenAI API 과금은 모두 보류**합니다. production 제출, 사용량 초과, 팀 협업 규모 증가, PRD 조건이 확인되는 시점에만 별도 승인합니다.
