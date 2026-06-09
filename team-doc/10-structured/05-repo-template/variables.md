---
docType: "reference"
sourcePageId: "1371963427"
sourceTitle: "01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안"
sourceVersion: "20"
sourceHeading: "Template variables"
---

# Template variables

Lists project generation inputs and rendering rules.

## Generation inputs

Every project-specific identifier is a template variable injected at generation time — no customer or app value is hardcoded as a default. The variable set:

- `APP_DISPLAY_NAME` — app display name (e.g. `Customer Mobile`).
- `APP_SLUG` — Expo slug (e.g. `customer-mobile`).
- `APP_SCHEME` — deep link scheme (e.g. `customermobile`).
- `IOS_BUNDLE_IDENTIFIER` — iOS bundle identifier (e.g. `com.customer.mobile`).
- `ANDROID_PACKAGE` — Android package / appId.
- `API_URL` — API base URL the app calls.
- `EAS_PROJECT_ID` — EAS project UUID, finalized after `eas init`.
- `EXPO_OWNER` — Expo account/org (customer or ClawPod-managed org).
- `SENTRY_DSN` — client DSN.
- `SENTRY_ORG` / `SENTRY_PROJECT` — sourcemap upload target.
- `SENTRY_AUTH_TOKEN` — EAS Build/Update sourcemap upload token (Secret-injected).
- `EXPO_TOKEN_SECRET_NAME` — k8s Secret name the agent runner references (e.g. `clawpod-eas-{{agent}}-{{project}}`).
- `DATABASE_URL` — PostgreSQL connection string (only when `apps/api` is included; Secret-injected).
- `API_PORT` — api listen port (only when `apps/api` is included; e.g. `3000`).
- `API_BEARER_TOKEN` — bearer placeholder validation token (only when `apps/api` is included; Secret-injected).

Values such as `cloud.clawpod.app`, `ClawPod Mobile`, or `@clawpod/api` are never baked into template code and appear only as placeholders in docs/samples. The `@template/*` package scope (`@template/contracts`, `@template/api`) is a fixed internal workspace alias, not a customer/app identifier, so it is NOT substituted.

## Rendering rules

Three syntaxes carry different meanings and lifecycles:

- `{{...}}` — source / Maestro-flow placeholders. A single project-wide find-and-replace at generation removes them (e.g. `{{ANDROID_PACKAGE}}` in `.maestro/home.yml`).
- `${...}` — infra manifest placeholders, rendered just before apply via `envsubst` (`infra/clawpod/*.yaml`).
- `${{ ... }}` — EAS-native expressions in EAS workflows; NOT a rendering target.

Rendering uses simple one-time substitution (a project-wide replace script or editor bulk replace) for source, and `envsubst` only for infra — no new generator framework is introduced. The operator performs it once at bootstrap, tied to the Phase 3 variable injection. After rendering, grep by variable name to confirm no tokens remain. Verification must match variable tokens, not raw brace patterns: RN/JSX object literals (e.g. `screenOptions={{ ... }}`) and EAS-native `${{ ... }}` are not placeholders.

## Source

- Page ID: 1371963427
- Source heading: Template variables
- Source version: 20
