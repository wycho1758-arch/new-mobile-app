---
pageId: "1372815381"
sourceTitle: "ClawPod용 Expo + EAS 통합 스타터/보일러플레이트 조사 보고서"
sourceVersion: "unknown"
sourceUrl: "https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1372815381"
fetchedAt: "2026-06-09T03:41:15.000Z"
syncStatus: "synced"
---

**요약(TL;DR)**

* 단일 저장소로 타깃 스택을 가장 많이 충족하는 후보는 **obytes/react-native-template-obytes**(GitHub 4.1k 스타, MIT)와 **infinitered/ignite**(약 19.5k 스타, MIT) 두 개이며, 둘 다 Expo + EAS + Maestro + GitHub Actions(EXPO_TOKEN)를 실제 커밋된 설정으로 포함합니다. 다만 둘 다 `@sentry/react-native`는 기본 미포함(수동 추가, 가이드 제공)입니다.
* EAS Build/Submit/Update/Workflows/Credentials 자체는 Expo의 호스팅 클라우드 서비스로 오픈소스 자가호스팅이 불가합니다. 스타터 저장소는 이 서비스들을 위한 설정(eas.json, 워크플로 YAML, GitHub Action)만 미리 배선할 수 있을 뿐, 호스팅 백엔드를 대체하지 못합니다.
* AI 에이전트가 Mac/기기 없이 빌드를 구동하는 ClawPod 모델에는 Expo Organization + Robot(Bot) user 토큰을 EXPO_TOKEN 환경변수로 런타임 주입하는 패턴이 정확히 부합하며(Expo 공식 문서로 확인), 이는 컨테이너/런타임에 주입하는 k8s/k3s Secret 모델과 1:1 대응하지만 단일 스타터에 완성형으로 들어있는 경우는 없습니다.

## 핵심 결론

* 타깃 스택 6개 영역을 단일 저장소로 "전부" 충족하는 보일러플레이트는 존재하지 않습니다. 특히 다중 테넌시/Robot user 토큰 주입 패턴과 Sentry는 거의 모든 스타터에서 빠져 있습니다.
* **obytes/react-native-template-obytes**가 개발 환경(TypeScript, Expo Router, NativeWind, 환경변수 관리)과 CI(10개 이상 GitHub Actions, EXPO_TOKEN 주입, Maestro E2E, EAS Build/Submit/Update)를 가장 균형 있게 커버합니다. EAS Workflows(.eas/workflows YAML)보다는 GitHub Actions 기반입니다.
* **infinitered/ignite**는 가장 성숙하고(2016년부터 9년 연속 개발) `.maestro/`와 `eas.json`을 생성된 앱에 포함하지만, Sentry와 `.eas/workflows`는 기본 미포함이고 EAS 빌드 스크립트가 `--local` 위주입니다.
* EAS Workflows + Maestro의 정식 `maestro` job 타입 예시는 Expo 공식 문서와 `expo/eas-custom-builds-example` 저장소에 있으나, 후자는 custom builds 방식이고 스타 수가 매우 적으며 라이선스 파일이 없습니다.
* create-expo-app의 기본 템플릿은 `.maestro`나 `.eas/workflows`, `eas.json`을 기본 포함하지 않습니다.

## 후보 비교표

| 저장소 | 스타 | 라이선스 | Expo+EAS | Maestro | GitHub 트리거 | Sentry | Robot/멀티테넌시 | 개발환경 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| obytes/react-native-template-obytes | 4.1k | MIT | <custom data-type="status" data-id="id-0">부분</custom> | <custom data-type="status" data-id="id-1">있음</custom> | <custom data-type="status" data-id="id-2">있음</custom> | <custom data-type="status" data-id="id-3">레시피</custom> | <custom data-type="status" data-id="id-4">없음</custom> | <custom data-type="status" data-id="id-5">강력</custom> |
| infinitered/ignite | \~19.5k | MIT | <custom data-type="status" data-id="id-6">부분</custom> | <custom data-type="status" data-id="id-7">있음</custom> | <custom data-type="status" data-id="id-8">제한적</custom> | <custom data-type="status" data-id="id-9">없음</custom> | <custom data-type="status" data-id="id-10">없음</custom> | <custom data-type="status" data-id="id-11">매우 강력</custom> |
| t3-oss/create-t3-turbo | 5.6k | MIT | <custom data-type="status" data-id="id-12">약함</custom> | <custom data-type="status" data-id="id-13">없음</custom> | <custom data-type="status" data-id="id-14">CI만</custom> | <custom data-type="status" data-id="id-15">없음</custom> | <custom data-type="status" data-id="id-16">없음</custom> | <custom data-type="status" data-id="id-17">모노레포</custom> |
| byCedric/expo-monorepo-example | — | — | <custom data-type="status" data-id="id-18">부분</custom> | <custom data-type="status" data-id="id-19">없음</custom> | <custom data-type="status" data-id="id-20">있음</custom> | <custom data-type="status" data-id="id-21">없음</custom> | <custom data-type="status" data-id="id-22">참고</custom> | <custom data-type="status" data-id="id-23">모노레포</custom> |
| expo/eas-custom-builds-example | \~23 | 없음 | <custom data-type="status" data-id="id-24">데모</custom> | <custom data-type="status" data-id="id-25">있음</custom> | <custom data-type="status" data-id="id-26">N/A</custom> | <custom data-type="status" data-id="id-27">없음</custom> | <custom data-type="status" data-id="id-28">없음</custom> | <custom data-type="status" data-id="id-29">데모</custom> |

## 후보 상세

### 1. obytes/react-native-template-obytes — 종합 1순위(개발환경 + CI 균형)

* **URL**: [https://github.com/obytes/react-native-template-obytes](https://github.com/obytes/react-native-template-obytes)
* **스타/포크**: 4.1k 스타, 617 포크 / **라이선스**: MIT
* **유지보수**: 매우 활발. 최신 릴리스 v9.0.0(2026-01-27), 총 58개 릴리스, 709 커밋, TypeScript 87.6%
* **확인된 커밋 파일**: `eas.json`, `app.config.ts`, `.maestro/`, `.github/`(workflows + composite actions), `env.ts`(Zod 환경변수 검증)

**타깃 스택 체크리스트(저장소 직접 확인 기준)**

1. **Expo + EAS 코어** — 부분. `eas.json`에 development/staging/production 프로필. `package.json`에 EAS Build 스크립트. EAS Update는 GitHub Action으로 사용. EAS Workflows 대신 GitHub Actions로 오케스트레이션. Credentials는 사용자 직접 업로드.
2. **Maestro E2E** — 있음. 루트 `.maestro/` 디렉터리, `e2e-test` 스크립트, `.github/workflows/e2e-android.yml`로 에뮬레이터 실행.
3. **GitHub 소스 + 트리거** — 있음. `.github/actions/eas-build/action.yml`에서 EXPO_TOKEN 필수 입력으로 명시, repo secret으로 주입(`expo/expo-github-action@v8` 패턴).
4. **Sentry** — 기본 미포함. 공식 레시피로 `@sentry/react-native` + 소스맵 업로드 절차 제공. 수동 통합 필요.
5. **다중 테넌시 / Robot user** — 없음(EXPO_TOKEN 주입 패턴만 존재).
6. **종합 개발환경** — 강력. TypeScript, Expo Router, NativeWind, Zustand+MMKV, React Query, TanStack Form+Zod, i18next, Jest, Husky.

### 2. infinitered/ignite — 성숙도/안정성 1순위

* **URL**: [https://github.com/infinitered/ignite](https://github.com/infinitered/ignite)
* **스타**: 약 19.5k(출처별 19.5k\~19.8k 편차) / **라이선스**: MIT(이름·로고는 상표 보호)
* **유지보수**: 최신 릴리스 v11.4.0(2026-01-06). Expo SDK 55, RN 0.81, React 19
* **확인**: 생성 앱은 `.maestro/` + `eas.json` 포함. `boilerplate/package.json`에 `@sentry/react-native` 없음, `.eas/workflows` 없음

**타깃 스택 체크리스트**

1. **Expo + EAS 코어** — 부분. `eas.json` 포함, EAS Build 스크립트는 대부분 `--local`. Submit/Update/Workflows 기본 배선 아님.
2. **Maestro E2E** — 있음. `.maestro/` 예시 플로우, Ignite 기본 E2E 솔루션(Detox/Appium 아님).
3. **GitHub 소스 + 트리거** — 제한적. CLI 저장소에 `.github/` 있으나 생성 앱에 EXPO_TOKEN 기반 EAS 트리거 기본 배선 아님.
4. **Sentry** — 기본 미포함. Cookbook 레시피로 수동 추가.
5. **다중 테넌시 / Robot user** — 없음.
6. **종합 개발환경** — 매우 강력. React Navigation v7, Reanimated v4, MMKV v3, Reactotron, i18n, 컴포넌트/모델 제너레이터, 테마/다크모드.

### 3. t3-oss/create-t3-turbo — 모노레포 스캐폴드(웹+모바일 코드 공유)

* **URL**: [https://github.com/t3-oss/create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) / 5.6k 스타, MIT
* 2025 현대화(Better Auth, Drizzle, tRPC v11, Expo SDK 54, RN 0.81, NativeWind v5)
* Expo+EAS는 약함(`eas update:configure` 수동 전제), Maestro/Sentry/Robot 없음. Turborepo로 web+Expo 간 tRPC/auth/db/ui 공유. ClawPod가 관리형 SaaS 콘솔(웹)과 모바일 앱 코드를 공유한다면 적합하나 모바일 CI/CD는 직접 추가 필요.

### 4. byCedric/expo-monorepo-example — EAS 모노레포 + 자격증명 주입 참고

* **URL**: [https://github.com/byCedric/expo-monorepo-example](https://github.com/byCedric/expo-monorepo-example)
* Expo 팀 멤버 유지. EAS 빌드 워크플로 + EXPO_TOKEN GitHub secret, 로컬 자격증명 직접 관리 및 "비밀 파일 base64 인코딩 주입" 패턴 문서화 — ClawPod Secret 주입 모델 참고 가치. Maestro/Sentry 없음.

### 5. expo/eas-custom-builds-example — EAS Maestro job 공식 예시(참고용)

* **URL**: [https://github.com/expo/eas-custom-builds-example](https://github.com/expo/eas-custom-builds-example) / 스타 \~23, 라이선스 파일 없음
* `.eas/build/build-and-maestro-test.yml`에 `eas/build` + `eas/maestro_test` 스텝. 단 `.maestro/`가 아닌 `maestro/`, `.eas/workflows`가 아닌 custom builds 방식. 스타터가 아닌 단일 기능 데모.
* 참고: `expo/eas-tests-example`는 Maestro가 아닌 Detox 기반 — 본 목적 부적합.

### 6. lingvano/react-native-eas-maestro, MathieuFedrigo/maestro-expo — Maestro CI 데모(참고용)

* 둘 다 Expo + EAS + Maestro Cloud/CI 통합 소형 예시. 전체 개발환경 스타터가 아닌 E2E 파이프라인 레시피 성격.

## EAS 호스팅 서비스 구분(정확한 사실)

EAS Build / Submit / Update / Workflows / Credentials는 모두 Expo가 운영하는 호스팅 클라우드 서비스입니다. 오픈소스로 공개되어 자가호스팅 가능한 것은 클라이언트 SDK/CLI/설정 파일이지 빌드·업데이트 백엔드가 아닙니다. 따라서 어떤 스타터도 이 백엔드를 대체할 수 없고, 설정(eas.json, .eas/workflows, GitHub Action)만 미리 배선합니다.

* EAS Workflows는 GitHub 연동 시 push/PR/label/cron 트리거를 지원하며 `build → maestro → submit → update` 잡 타입 제공. EAS 대시보드에서 실행되어 별도 CI 서버 불필요.
* **비용(2026년 기준)**: Expo 공식 문서 기준 Starter 플랜은 월 $19에 빌드 크레딧 $45 포함, Production 플랜은 월 $199에 $225 포함. Maestro로 E2E 시 테스트 잡당 $0.05 기본 요금 + 소비 CI 분(minutes) 비용 추가(metacto 2026-05 가이드).

## Robot user / 토큰 주입 (ClawPod 관련)

* Expo는 Account가 Robot(Bot) user를 생성해 access token만으로 인증하도록 지원. Bot user는 로그인 불가, 프로젝트 소유 불가, 역할 기반 권한 제한 가능.
* `EXPO_TOKEN` 환경변수 설정 시 `eas login` 없이 모든 EAS CLI 명령을 토큰으로 인증(`EXPO_TOKEN=token eas build`). 이미지에 굽지 않고 컨테이너/런타임에 주입하는 ClawPod의 k8s/k3s Secret 모델과 정확히 일치.
* iOS 자격증명 자동 복구가 필요하면 ASC API Key를 환경변수(`EXPO_ASC_API_KEY_PATH`, `EXPO_ASC_KEY_ID`, `EXPO_ASC_ISSUER_ID`, `EXPO_APPLE_TEAM_ID`, `EXPO_APPLE_TEAM_TYPE`)로 CI에 주입 가능.

## 권장안

1. **즉시 클론할 단일 출발점: obytes/react-native-template-obytes**. 개발환경과 CI를 가장 균형 있게 제공, 활발히 유지, MIT.
  

    * 추가 작업: ① Sentry 통합(공식 레시피로 `@sentry/react-native` + 소스맵 업로드), ② EAS Credentials 업로드(iOS 인증서/ASC 키, Android keystore), ③ Robot user 생성 후 EXPO_TOKEN을 k8s/k3s Secret으로 주입, ④ Sentry DSN/스토어 계정 설정, ⑤ 필요 시 GitHub Actions를 EAS Workflows로 이관.
    
2. **최대 성숙도/안정성 우선이면 infinitered/ignite**. 단 EAS Submit/Update/Workflows 트리거와 Sentry는 직접 배선, EAS Build 스크립트가 `--local` 위주라 클라우드 빌드용 조정 필요.
3. **웹 콘솔 + 모바일 앱 코드 공유가 핵심이면 create-t3-turbo** 위에 `.eas/workflows` + `.maestro` + Sentry를 얹는 하이브리드.
4. **EAS Workflows의 정식 maestro job**을 쓰려면 Expo 공식 "Run E2E tests on EAS Workflows with Maestro" 가이드의 `eas.json`(e2e-test 프로필) + `.eas/workflows/e2e-test-android.yml`/`e2e-test-ios.yml` + `.maestro/home.yml`을 obytes 베이스에 직접 추가.

## 주의사항(Caveats)

* **"단일 저장소 = 전부 충족"은 불가능**: Sentry, 다중 테넌시/Robot user 토큰 주입은 어떤 메이저 스타터에도 완성형으로 없음. 최소 2\~3개 항목은 수동 추가 전제.
* **EAS 백엔드는 오픈소스 아님**: 스타터는 설정만 배선. 빌드·업데이트·제출은 Expo 유료 호스팅 의존.
* **스타 수/날짜는 변동**: GitHub 스타·릴리스 표기는 조사 시점 값이며 출처별 편차 존재(예: Ignite 19.5k\~19.8k, 최신 릴리스 v11.4.0 vs 일부 출처 v11.5.0).
* **expo/eas-custom-builds-example, expo/eas-tests-example는 라이선스 파일 미확인** — 프로덕션 채택 시 리스크. eas-tests-example는 Detox 기반.
* obytes의 Sentry는 기본 미포함이며, 커뮤니티에서 EAS Build의 .env/secret 접근 관련 설정 함정(SENTRY_ORG/PROJECT 누락 등)이 보고된 바 있음.
* create-t3-turbo는 모바일 CI/CD/E2E가 약하므로 ClawPod 핵심 요구(모바일 빌드/릴리스 자동화)에는 추가 작업이 큼.

---

_본 보고서는 웹 검색 기반 조사 결과이며, GitHub 스타 수·릴리스·날짜 등 수치는 조사 시점 기준입니다._
