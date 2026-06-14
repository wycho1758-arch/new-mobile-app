# Architecture Note

status: required
owner: Mobile Architect
input artifact: `docs/plans/work-units/project-bootstrap-auth-gates/README.md`
output artifact: this runtime/dependency policy note
acceptance criteria: constrain the dependency remediation to the approved Expo SDK 56 patch drift scope
evidence requirement: durable work-unit evidence entry with kind `architecture-note`
dependencies/blockers: package update must stay inside the approved human-gate scope
open decisions: none
next responsible role: Mobile App Dev

## Runtime Dependency Scope

The approved remediation is limited to these package manifest and lockfile
updates:

- `@expo/metro-runtime`
- `expo`
- `expo-dev-client`
- `expo-linking`
- `expo-router`
- `jest-expo`
- `pnpm-lock.yaml`

The purpose is to align the current Expo SDK 56 patch dependency set with
`expo install --check` and `expo-doctor` expectations. This is not an Expo SDK
major/minor upgrade and does not authorize unrelated dependency updates.

## Boundary Assessment

- Route definitions: no intended change.
- State management: no intended change.
- Module boundaries: no intended change.
- API contracts: no intended change.
- Native project directories: no `apps/mobile/ios` or `apps/mobile/android`
  directories are present; this remains a CNG-style update and does not require
  `expo prebuild`.
- Releaseability risk: patch dependency drift should be resolved only after the
  Expo/mobile/runtime checks below pass.

## Required Verification

After the package update, run:

- `pnpm --filter mobile exec expo install --check`
- `pnpm --filter mobile run doctor`
- `pnpm --filter mobile lint`
- `pnpm --filter mobile test`
- `pnpm run test:runtime`
- `pnpm run test:local-harness`
- `pnpm turbo run lint test`

If any check fails, stop and record the blocker before expanding scope.
