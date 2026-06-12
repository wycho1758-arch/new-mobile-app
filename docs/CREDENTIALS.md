# CREDENTIALS.md

이 문서는 모바일 앱 템플릿에서 사용하는 자격증명(credential)과 시크릿(secret)의 관리 방법, Secret 주입 위치, Owner/Agent 위임 가능 여부를 설명합니다.

> 세부 원칙은 사전 등록 가이드 §6 "Secret / Credential 원칙"을 따릅니다:
> https://wondermove-official.atlassian.net/wiki/spaces/mobileappd/pages/1372422154

---

## Owner / Agent 위임 가능 여부 (요약 표)

| Credential | 위임 가능 여부 | Owner | 주입 방법 |
|------------|--------------|-------|-----------|
| EXPO_TOKEN (Robot user) | Agent 위임 가능 (Secret으로만 제한) | Human owner 생성 | k8s Secret → envFrom |
| DATABASE_URL | Agent 위임 가능 (Secret으로만 제한) | Human owner (ops) | k8s Secret → envFrom |
| App Store Connect API key | Human owner 전용 — Agent 위임 불가 | Human owner | k8s Secret (.p8 평문 금지) |
| Google Play service account JSON | Human owner 전용 — Agent 위임 불가 | Human owner | k8s Secret (JSON 평문 금지) |
| 결제카드 / 계정 비밀번호 / 2FA | Human owner 전용 — Agent 위임 불가 | Human owner | 저장 금지 |

> 결제카드, 계정 비밀번호, 2FA 코드는 어떤 형태로도 Agent에 위임하거나 Secret에 저장하지 않습니다.

---

## EXPO_TOKEN

**용도**: Expo Organization Robot user의 access token. EAS CLI가 `EXPO_TOKEN` 환경 변수를 인식하면 `eas login` 없이 비대화식으로 인증됩니다.

> `infra/clawpod/secret.example.yaml`에는 배포 주입 편의를 위해 `EXPO_PUBLIC_*` 값도 함께 예시로 들어 있습니다. `EXPO_PUBLIC_*` 값은 앱 번들에 컴파일되는 공개 클라이언트 설정이며 credential/secret이 아닙니다. 토큰, 비밀번호, bearer credential, signing key, 비공개 endpoint를 `EXPO_PUBLIC_*`로 넣지 않습니다.

**생성 절차**:
1. Expo Organization 대시보드에서 Robot user를 생성합니다.
   - Robot user는 개인 계정 권한을 상속하지 않으며 역할 제한이 가능합니다 (Expo programmatic access 문서 기준).
   - 네이밍 권고: `{project}-{agent}` 또는 `{customer}-{project}-{agent}`
2. Robot user에 Access Token을 생성합니다.
3. 토큰을 k8s Secret으로만 저장합니다 (아래 참조).

**Secret 주입**:

`infra/clawpod/secret.example.yaml`을 참조하여 실제 값으로 `envsubst` 후 k8s에 적용합니다:

```bash
# envsubst로 placeholder 렌더링 후 적용
export EXPO_TOKEN_SECRET_NAME="clawpod-eas-{agent}-{project}"
export APP_DISPLAY_NAME="Your App Name"
# ... 기타 변수 export ...
envsubst < infra/clawpod/secret.example.yaml | kubectl apply -f -
```

`agent-runner.yaml`의 `envFrom.secretRef.name`이 이 Secret을 참조합니다.

**금지 사항**:
- 평문을 repo에 커밋하지 않습니다.
- 이미지에 굽지 않습니다 (ENV 레이어 포함).
- `infra/clawpod/secret.example.yaml`에는 `REPLACE_WITH_ROBOT_USER_TOKEN` 플레이스홀더만 존재해야 합니다.

## DATABASE_URL (apps/api 포함 시)

**용도**: `apps/api`가 포함된 프로젝트에서 PostgreSQL 연결 문자열. 앱 부팅 시 `env.ts`가 파싱하고 `migrate()`와 Drizzle 클라이언트가 사용합니다.

**형식**: `postgres://user:password@host:5432/dbname`

**Secret 주입**:

k8s 환경에서는 `infra/clawpod/secret.example.yaml`에 `DATABASE_URL` 키를 추가하거나 별도 Secret으로 분리하여 `envFrom`으로 주입합니다:

```yaml
stringData:
  DATABASE_URL: "postgres://app:app@postgresql.clawpod.svc.cluster.local:5432/app"
```

**로컬 개발**:

`apps/api/compose.yaml`로 로컬 PostgreSQL을 기동 후 `DATABASE_URL`을 환경 변수로 주입합니다 (`docs/SETUP.md (d)` 참조).

**금지 사항**:
- 비밀번호가 포함된 URL을 소스 코드나 `vitest.config.ts`의 `test.env`에 실제 비밀번호로 커밋하지 않습니다.
  (`vitest.config.ts`의 `postgres://test:test@localhost:5432/test`는 테스트 전용 기본값이며 운영 DB와 분리되어야 합니다.)

---

## Store Credentials

### App Store Connect (iOS)

**용도**: EAS Submit이 iOS 앱을 App Store에 자동 제출할 때 사용하는 API key.

**구성 요소**:
- `EXPO_ASC_KEY_ID`: App Store Connect API key ID
- `EXPO_ASC_ISSUER_ID`: App Store Connect issuer ID
- `.p8` 파일: API key private key (평문 파일 커밋 금지)

**Secret 주입**:

```bash
# EAS secret으로 등록
eas secret:create --scope project --name EXPO_ASC_KEY_ID --value <key_id>
eas secret:create --scope project --name EXPO_ASC_ISSUER_ID --value <issuer_id>
eas secret:create --scope project --name ASC_API_KEY --type file --path ./AuthKey_<KEY_ID>.p8
```

k8s Secret에도 동일하게 주입하여 agent-runner가 EAS Submit을 실행할 수 있도록 합니다.

**Human owner 전용**: App Store Connect 계정 생성, 계약 동의, 앱 등록은 Human owner만 수행합니다. Agent에 위임하지 않습니다.

**금지 사항**:
- `.p8` 파일을 repo에 커밋하지 않습니다.
- `EXPO_ASC_KEY_ID` / `EXPO_ASC_ISSUER_ID`를 소스 코드에 인라인하지 않습니다.

### Google Play (Android)

**용도**: EAS Submit이 Android 앱을 Google Play Console에 자동 제출할 때 사용하는 service account.

**구성 요소**:
- Service account JSON 파일 (Google Cloud Console에서 발급)
- Google Play Console에서 해당 service account에 "릴리스 관리자" 역할 부여 필요

**Android 최초 1회 수동 업로드 요구사항**:

Google Play는 신규 앱의 첫 번째 APK/AAB를 수동으로 업로드해야 합니다. 이후 제출만 EAS Submit으로 자동화할 수 있습니다.
- 최초 업로드: Human owner가 Google Play Console에서 직접 수행 (내부 테스트 트랙 또는 비공개 테스트 트랙)
- 이후 제출: `build-and-submit.yml` EAS Workflow 자동화

**Secret 주입**:

```bash
# EAS secret으로 등록
eas secret:create --scope project --name GOOGLE_SERVICE_ACCOUNT_KEY --type file --path ./service-account.json
```

**Human owner 전용**: Google Play Developer 계정 생성, 앱 등록, 최초 수동 업로드는 Human owner만 수행합니다. Agent에 위임하지 않습니다.

**금지 사항**:
- service account JSON을 repo에 커밋하지 않습니다.
- JSON 내용을 환경 변수에 인라인하지 않습니다.
