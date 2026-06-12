# EAS Starter E2E Review

- Date: 2026-06-09
- Scope: whether Expo EAS Starter can cover Linux-first Android/iOS E2E
- Result: yes for capability, no for fixed-cost/unlimited usage.

## Sources Checked

- Expo pricing: https://expo.dev/pricing
- Expo billing plans: https://docs.expo.dev/billing/plans
- EAS Workflows introduction: https://docs.expo.dev/eas/workflows/introduction
- EAS Workflows syntax: https://docs.expo.dev/eas/workflows/syntax
- EAS Workflows Maestro E2E: https://docs.expo.dev/eas/workflows/examples/e2e-tests
- EAS development builds: https://docs.expo.dev/develop/development-builds/create-a-build

## Starter Capability

Starter enables the EAS Workflows/CI path needed for automated mobile E2E:

- EAS Workflows can run build, update, submit, deploy, and Maestro jobs.
- EAS Workflows supports Android Emulator jobs on Linux nested-virtualization workers.
- EAS Workflows supports iOS build and iOS Simulator jobs on macOS workers.
- EAS Workflows Maestro examples include Android and iOS E2E workflows.

Therefore, a Linux-first team can use Starter to run:

- Android build + Android Emulator Maestro E2E.
- iOS Simulator build + iOS Simulator Maestro E2E.
- Native build artifacts generated remotely instead of requiring local Xcode.

## Starter Cost Model

Starter is not a flat "all E2E included" plan.

Official pricing currently shows:

- Starter subscription: monthly paid plan.
- Starter includes build credit for EAS Build.
- Build jobs use included build credits, then usage-based pricing.
- CI/CD Workflows minutes are usage-based on Starter.
- Maestro E2E jobs cost `$0.05, plus CI/CD minute usage`.

Implication:

- Starter makes E2E possible.
- Starter does not make repeated E2E free or unlimited.
- Actual monthly cost depends on number of builds, number of Maestro jobs, worker type, and runtime duration.

## What Is Needed For This Repo

Required repo/workflow setup:

1. EAS project initialized and `EAS_PROJECT_ID` configured.
2. GitHub repository linked or workflows triggered manually with `eas workflow:run`.
3. EAS build profile for E2E:
   - Android APK for emulator testing.
   - iOS Simulator `.app` build for simulator testing.
4. Maestro flow app id made executable:
   - generated project renders `{{ANDROID_PACKAGE}}`, or
   - repo changes flow to Maestro parameter syntax such as `${APP_ID}` + `-e APP_ID=...`.
5. `EXPO_PUBLIC_*` values provided through public client configuration for the selected environment. These values are compiled into the client app and must not contain tokens or private credentials.
6. `EXPO_TOKEN` or equivalent EAS authentication configured in CI/workflow environment.

## iOS Detail

For iOS Simulator E2E:

- Local macOS is not required for developers.
- EAS uses macOS workers for iOS builds/simulator jobs.
- A simulator build profile can avoid physical-device signing requirements.

For physical iOS device QA:

- Apple Developer account and provisioning are still required.
- This is separate from simulator E2E.

## Recommended Starter Strategy

Use Starter as the cloud E2E lane, not as the daily local loop:

1. Daily on Linux:
   - Jest/lint/typecheck
   - Expo Web smoke
   - Android Emulator/USB Android
   - local Android `mobile-mcp`
   - local Android Maestro when available

2. PR or merge gate on Starter:
   - Android EAS build + Maestro E2E on Android Emulator
   - iOS Simulator EAS build + Maestro E2E on macOS worker

3. Release gate:
   - Add physical-device QA through TestFlight, BrowserStack, AWS Device Farm, or manual device testing if required.

## Decision

Starter is sufficient to make automated Android and iOS Simulator E2E possible for a Linux-first team.

Starter is not sufficient to guarantee no additional costs. Expect:

- monthly Starter subscription,
- EAS Build credit consumption,
- Maestro job charge,
- CI/CD minute usage.

