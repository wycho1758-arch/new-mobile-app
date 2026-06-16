# Native E2E Strategy

This document defines the repo-local evidence ladder for mobile QA. It exists to keep the template runtime reusable across customer apps while preventing RN Web, local harness, or offline fixture checks from being overstated as native proof.

## Purpose

The repo is a mobile app template runtime for WonderMove mobile agents. A customer work unit may need different evidence depending on what it changes. Product/Planning sets the required evidence level in `status.json`, QA/Release records what was achieved, and the deterministic validator blocks overclaims before Gatekeeper consumes the artifact.

## Evidence Ladder

| Level | Slug | Use | Evidence |
| --- | --- | --- | --- |
| L0 | `jest` | Unit, component, contract, and runtime checks that do not exercise a user flow | Jest, contract tests, runtime validator output |
| L1 | `rn-web` | Browser-reproducible UI, navigation, state, and business-flow checks | Playwright command output and `.evidence/e2e-test/<YYYYMMDD-HHMMSS>-<slug>/` |
| L2 | `eas-maestro` | Native package plus cloud Maestro proof for native modules, permissions, navigation container behavior, or release-candidate touching work | Redacted `eas-evidence/v1` result from EAS/Maestro output |
| L3 | `human-device` | Human-gated device/mobile-mcp proof for release-sensitive or device-specific claims | Linked mobile-mcp/device evidence plus `human-gate/v1` residual-risk decision |

`PROJECT_ENVIRONMENT.md` remains authoritative for the RN Web boundary: RN Web validates browser-reproducible behavior only and does not prove native modules, OS permissions, native lifecycle, push, biometrics, camera, GPS, or hardware behavior.

## Work-Unit Contract

Product/Planning records the required level:

```json
{
  "evidence_ladder": {
    "required_level": "L2"
  }
}
```

QA/Release records the achieved level before marking `05-qa-release` as `done`:

```json
{
  "evidence_ladder": {
    "required_level": "L2",
    "achieved_level": "L2"
  }
}
```

`scripts/validate-work-units.mjs` enforces:

- `05-qa-release` `done` requires `required_level` and `achieved_level`.
- `achieved_level` must be at least `required_level`.
- If `achieved_level` is lower, the work unit must contain an approved `failed-gate-risk` human gate with `failed_check_reference`.
- `rn-web-evidence` does not satisfy L2 or L3.
- L2 needs native/EAS evidence such as `eas-evidence`, `eas-maestro-evidence`, or `native-evidence`.
- L3 needs device evidence such as `mobile-mcp-evidence`, `human-device-evidence`, or `device-evidence`.

## EAS/Maestro Offline Ingest

`scripts/ingest-eas-evidence.mjs` ingests recorded EAS/Maestro JSON into a redacted `eas-evidence/v1` result. The self-test is offline and uses fixtures under `evals/local-harness/eas-evidence/fixtures/`.

The canonical live evidence path, once human/ops approval exists and live output is available, is:

```text
.evidence/e2e-test/<YYYYMMDD-HHMMSS>-eas-<slug>/result.json
```

The script redacts token-bearing URL query strings and must not print `EXPO_TOKEN`, bearer tokens, signing keys, passwords, private endpoints, or raw auth payloads.

## Maestro App ID

`apps/mobile/.maestro/home.yml` currently uses:

```yaml
appId: {{ANDROID_PACKAGE}}
```

This is a generation-time placeholder, not a runtime environment lookup. Before live L2 execution, the caller must render or inject the customer-specific Android package value from approved public app config. Do not hardcode a customer package name in the repo.

## Boundaries

Allowed repo-local PR5 work:

- Strategy docs.
- Work-unit validator fixtures and deterministic ladder checks.
- Offline EAS/Maestro ingest fixtures and redaction self-test.
- `$e2e-test` skill documentation updates.
- Runtime docs and package script wiring needed for deterministic gates.

Human/ops approval required before live execution:

- Any live EAS command, EAS auth check, token use, or EAS/GitHub integration.
- mobile-mcp, simulator, emulator, or physical-device execution.
- Pod rollout, webhook routing, Secret/token provisioning, branch protection, bot account, platform image work, or Confluence live publish.

Always forbidden:

- Treating RN Web, Railway, local harness, source review, or offline fixtures as native proof.
- Store-submit automation or release human-gate weakening.
- Customer app names, bundle IDs, API URLs, tokens, credentials, or private endpoints hardcoded in the repo.
