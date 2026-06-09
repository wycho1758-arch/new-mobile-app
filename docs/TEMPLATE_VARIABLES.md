# TEMPLATE_VARIABLES.md

이 문서는 모바일 앱 템플릿의 변수 목록과 렌더링 규약을 설명합니다. SoT §3 전문 반영.

---

## 변수 표 (12종)

| 변수 | 설명 | 예시 |
|------|------|------|
| `APP_DISPLAY_NAME` | 앱 표시 이름 | `Customer Mobile` |
| `APP_SLUG` | Expo slug | `customer-mobile` |
| `APP_SCHEME` | deep link scheme | `customermobile` |
| `IOS_BUNDLE_IDENTIFIER` | iOS bundle identifier | `com.customer.mobile` |
| `ANDROID_PACKAGE` | Android package/appId | `com.customer.mobile` |
| `API_URL` | 앱이 호출할 API base URL | `https://api.customer.com` |
| `EAS_PROJECT_ID` | EAS project UUID | EAS init 후 확정 |
| `EXPO_OWNER` | Expo account/org | 고객 또는 ClawPod-managed org |
| `EXPO_TOKEN_SECRET_NAME` | Agent runner가 참조할 k8s Secret 이름 | `clawpod-eas-{{agent}}-{{project}}` |
| `DATABASE_URL` | PostgreSQL 연결 문자열 (`apps/api` 포함 시) | Secret 주입 |
| `API_PORT` | api 리슨 포트 (`apps/api` 포함 시) | `3000` |
| `API_BEARER_TOKEN` | bearer 자리표시자 검증 토큰 (`apps/api` 포함 시) | Secret 주입 |

> `cloud.clawpod.app`, `ClawPod Mobile`, `@clawpod/api` 같은 값은 템플릿 코드에 고정하지 않습니다.
> `@template` 패키지 스코프(`@template/contracts`, `@template/api`)는 고정 내부 워크스페이스 alias이므로 치환 대상이 아닙니다.

---

## 렌더링 규약

변수는 두 가지 문법으로 표기되며 용처와 렌더링 시점이 다릅니다.

### 1. `{{...}}` — 소스 및 Maestro placeholder

**사용 위치**: 소스 파일, Maestro flow 파일 (예: `.maestro/home.yml`의 `{{ANDROID_PACKAGE}}`), Secret 이름 패턴 (예: `clawpod-eas-{{agent}}-{{project}}`).

**렌더링 시점**: 프로젝트 생성 시 1회. 전 파일을 대상으로 검색·치환 스크립트 또는 에디터 일괄 치환으로 소멸시킵니다.

**렌더링 도구**: 단순 1회 검색·치환. 신규 generator 프레임워크는 도입하지 않습니다.

```bash
# 예시: APP_DISPLAY_NAME 치환
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \) \
  | xargs sed -i '' 's/{{APP_DISPLAY_NAME}}/Customer Mobile/g'
```

### 2. `${...}` — infra manifest placeholder

**사용 위치**: `infra/clawpod/*.yaml` 파일 (예: `${EXPO_TOKEN_SECRET_NAME}`, `${APP_DISPLAY_NAME}`).

**렌더링 시점**: k8s 적용 직전. `envsubst`로 렌더링합니다.

```bash
# 예시: secret.example.yaml envsubst 후 적용
export EXPO_TOKEN_SECRET_NAME="clawpod-eas-myagent-myproject"
export APP_DISPLAY_NAME="Customer Mobile"
export APP_SLUG="customer-mobile"
# ... 기타 변수 export ...
envsubst < infra/clawpod/secret.example.yaml | kubectl apply -f -
```

### 3. `${{ ... }}` — EAS 네이티브 표현식 (렌더링 비대상)

**사용 위치**: `.eas/workflows/*.yml` 파일 (예: `${{ needs.build_android.outputs.build_id }}`).

**렌더링 방침**: EAS Workflows 엔진이 해석하는 네이티브 표현식입니다. `envsubst`나 검색·치환 대상이 아닙니다. **절대 치환하지 않습니다.**

---

## 렌더링 후 잔존 토큰 검사

프로젝트 생성 후 `{{...}}` 소스 placeholder가 잔존하지 않는지 변수명 기준으로 grep합니다.

```bash
# {{...}} 소스 placeholder 잔존 검사 (변수명 기준)
grep -rn \
  -e '{{APP_DISPLAY_NAME}}' \
  -e '{{APP_SLUG}}' \
  -e '{{APP_SCHEME}}' \
  -e '{{IOS_BUNDLE_IDENTIFIER}}' \
  -e '{{ANDROID_PACKAGE}}' \
  -e '{{API_URL}}' \
  -e '{{EAS_PROJECT_ID}}' \
  -e '{{EXPO_OWNER}}' \
  --include="*.ts" --include="*.tsx" --include="*.yml" --include="*.yaml" --include="*.json" \
  . 2>/dev/null | grep -v '.git/'
```

```bash
# ${...} infra placeholder 잔존 검사 (envsubst 적용 전 확인용)
grep -rn \
  -e '\${APP_DISPLAY_NAME}' \
  -e '\${APP_SLUG}' \
  -e '\${APP_SCHEME}' \
  -e '\${IOS_BUNDLE_IDENTIFIER}' \
  -e '\${ANDROID_PACKAGE}' \
  -e '\${API_URL}' \
  -e '\${EAS_PROJECT_ID}' \
  -e '\${EXPO_TOKEN_SECRET_NAME}' \
  -e '\${DATABASE_URL}' \
  -e '\${API_PORT}' \
  -e '\${API_BEARER_TOKEN}' \
  infra/ 2>/dev/null
```

> **오탐 주의**: RN/JSX의 객체 리터럴 `{{ }}` (예: `screenOptions={{ headerShown: false }}`)나 EAS 네이티브 `${{ needs.build_android.outputs.build_id }}`는 placeholder가 아닙니다.
> 변수명 토큰(`{{ANDROID_PACKAGE}}`, `${API_URL}` 등)으로만 검사하며, 원시 brace 패턴(`{{`, `${`) 전체를 grep하지 않습니다.

---

## 렌더링 흐름 요약

```
프로젝트 생성 시 (Human owner / 운영자 bootstrap)
  │
  ├── 1. {{...}} 소스 치환 (전 파일 1회 검색·치환)
  │      대상: *.ts, *.tsx, *.yml, *.yaml, *.json
  │      소멸: 모든 {{VARIABLE}} 토큰
  │
  ├── 2. envsubst 렌더링 (k8s 적용 직전)
  │      대상: infra/clawpod/*.yaml
  │      소멸: 모든 ${VARIABLE} 토큰 (k8s manifest 내)
  │
  └── 3. ${{ ... }} EAS 표현식 — 렌더링 안 함 (EAS 엔진 전용)
         대상: .eas/workflows/*.yml
         보존: EAS Workflows 런타임이 해석
```
