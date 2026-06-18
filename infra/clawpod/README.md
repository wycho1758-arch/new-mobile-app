# infra/clawpod

Kubernetes manifest examples for running EAS builds inside an OpenClaw pod (namespace: `clawpod`).

## Files

| File | Kind | Purpose |
|------|------|---------|
| `secret.example.yaml` | `Secret` | Template for the EAS Robot token and public Expo config values injected into the agent-runner Job |
| `agent-runner.yaml` | `Job` | Template for the Kubernetes Job that clones the repo and runs `eas-cli` non-interactively |

## How They Fit Together

1. Create a real `Secret` from `secret.example.yaml` — replace every `${…}` placeholder with actual values — and apply it to the cluster **without committing real values**.
2. The `agent-runner.yaml` Job references that Secret to receive `EXPO_TOKEN` and public config at runtime.
3. The init step clones the repo using a deploy token; the `eas` container runs `eas-cli build --non-interactive` against `apps/mobile`.

## Secrets Rule

These files are **example templates only**. Never commit real tokens, passwords, signing keys, or private endpoints. `EXPO_TOKEN` and deploy credentials must be injected through a cluster Secret or secure store, never hardcoded in YAML or environment variable strings checked into source control.

See `docs/CREDENTIALS.md` for credential ownership and delegation limits, and `mobile-app-dev-team/16-pod-environment-bootstrap.md` for the full pod bootstrap sequence.
