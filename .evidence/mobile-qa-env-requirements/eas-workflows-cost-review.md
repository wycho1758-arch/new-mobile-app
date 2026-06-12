# EAS Workflows Cost Review For Linux-First QA

- Date: 2026-06-09
- Scope: current internet check for whether EAS Workflows can solve Linux-first mobile QA for free
- Result: partially free, not fully free. EAS Build and limited Workflow minutes are available on Free, but EAS Maestro E2E jobs are not listed as free.

## Sources Checked

- Expo pricing: https://expo.dev/pricing
- Expo billing plans: https://docs.expo.dev/billing/plans
- EAS Workflows introduction: https://docs.expo.dev/eas/workflows/introduction
- EAS Workflows syntax: https://docs.expo.dev/eas/workflows/syntax
- EAS Workflows Maestro E2E example: https://docs.expo.dev/eas/workflows/examples/e2e-tests
- EAS development builds: https://docs.expo.dev/develop/development-builds/create-a-build
- Expo Web: https://docs.expo.dev/workflow/web/

## Pricing Findings

Free plan currently includes:

- 15 Android and 15 iOS builds.
- Low-priority queue.
- 60 minutes on CI/CD Workflows.
- EAS Build access from an Expo account.

Free plan does not appear to include:

- EAS Workflows Maestro end-to-end test jobs. Expo pricing lists Maestro E2E jobs as unavailable on Free and as paid on Starter/Production/Enterprise.

Paid Maestro pricing shown by Expo:

- `Run Maestro end-to-end test jobs`: `$0.05, plus CI/CD minute usage` on paid plans.

Implication:

- EAS Build for iOS/Android can be used in the Free plan within monthly build limits.
- EAS Workflows can be used in the Free plan within CI/CD minute limits for eligible jobs.
- Full EAS Workflows-based Maestro E2E on Android Emulator or iOS Simulator should not be assumed free.
- A physical iOS development build still requires Apple Developer account/signing for device installation.

## Linux-First Strategy By Cost

### Free / Local-First

Use this for daily development:

- Linux local Jest/typecheck/lint.
- Expo Web smoke for shared UI, routing, and API flows.
- Linux local Android Emulator/USB Android with `mobile-mcp`.
- Local Android Maestro if the app id is rendered or the Maestro flow is parameterized.
- EAS Build free quota for occasional Android/iOS builds.

This covers most developer feedback without paid EAS Maestro jobs.

### Possibly Free But Quota-Limited

Use carefully:

- EAS Build iOS simulator or iOS device builds from Linux within the free monthly build quota.
- EAS Workflows custom/build/update jobs within 60 CI/CD minutes, if the job type is available on Free and does not invoke paid Maestro E2E jobs.

These are useful for smoke/build confidence but are not a replacement for native E2E automation.

### Paid / Needed For Automated iOS Native E2E

Use when PR readiness needs repeatable iOS device/simulator E2E evidence:

- EAS Workflows Maestro job on iOS Simulator.
- EAS Workflows Maestro job on Android Emulator if using the EAS prepackaged Maestro job.
- BrowserStack real-device Maestro/Appium automation.
- AWS Device Farm with Appium/XCTest, if replacing Maestro YAML with Appium/XCTest tests is acceptable.
- Bitrise/GitHub Actions/macOS runner/MacStadium-style macOS capacity.

## Expo Web Role

Expo Web is still important for a Linux-first workflow:

- It is available locally on Linux.
- It supports universal React Native apps through React Native Web and Expo Router.
- It is appropriate for quick UI/routing/API smoke checks.

But Web is not equivalent to iOS/Android native QA:

- It does not prove native module compatibility.
- It does not prove iOS/Android rendering parity.
- It does not exercise mobile OS permissions, device gestures, native accessibility tree, or App Store/TestFlight packaging.

## Recommendation

Do not rely on EAS Workflows as a fully free replacement for local iOS Simulator QA.

Recommended plan:

1. Daily Linux loop:
   - deterministic repo gates
   - Expo Web
   - Android Emulator/USB Android
   - local Android `mobile-mcp`
   - local Android Maestro

2. Free quota smoke:
   - EAS Build iOS/Android within monthly included builds
   - use iOS simulator/device artifacts for manual or limited smoke where possible

3. Paid CI evidence when needed:
   - EAS Workflows Maestro for PR/release iOS simulator evidence
   - or BrowserStack/AWS Device Farm/Bitrise depending on required test framework and device coverage

Bottom line: Linux-first is feasible, but a zero-cost setup cannot fully replace automated iOS native E2E evidence. The free plan can reduce cost for builds and early smoke, while paid EAS Maestro or device-cloud capacity is needed for repeatable cloud iOS E2E.

