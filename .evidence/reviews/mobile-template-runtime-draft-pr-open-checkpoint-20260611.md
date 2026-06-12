# Mobile Template Runtime Draft PR Open Checkpoint

## Scope

This checkpoint records the state after continuing the active goal by pushing the
branch and opening a draft PR.

Draft PR:

- URL: https://github.com/Wondermove-Inc/new-mobile-app/pull/2
- Number: 2
- Title: `[codex] Build mobile template runtime gates and evidence`
- Base: `main`
- Head: `feat/mobile-app-template`
- State: `OPEN`
- Draft: `true`
- Mergeable query result: `MERGEABLE`

Current branch head at PR creation:

- `2ab137a docs: add draft pr body evidence`

## Actions Taken

- Pushed `feat/mobile-app-template` to `origin`.
- Opened draft PR #2 against `main`.
- Used `.evidence/reviews/mobile-template-runtime-draft-pr-body-20260611.md`
  as the PR body.
- Did not mark the PR ready for review.
- Did not request live EAS, mobile-mcp/device, pod rollout, webhooks, Secrets,
  branch protection, Confluence, Railway, Stitch/GCloud, release, or store
  action.

## Remote Check State

GitHub PR query result immediately after PR creation:

- `statusCheckRollup`: empty list.
- `gh pr checks 2 --watch=false`: `no checks reported on the
  'feat/mobile-app-template' branch`.
- `gh run list --branch feat/mobile-app-template --limit 10`: empty list.
- `gh workflow list`: empty output.

Local Git ref check:

- `git ls-tree -r origin/main .github/workflows`: empty output.
- `git ls-tree -r HEAD .github/workflows`: contains
  `.github/workflows/quality-gate.yml`.

Interpretation:

- The branch contains the intended quality-gate workflow.
- The default branch currently does not expose `.github/workflows` in the local
  `origin/main` ref.
- Therefore no remote GitHub Actions/check-run pass can be claimed for PR #2 at
  this time.
- This does not invalidate the recorded local gate evidence, but it means the PR
  is draft/local-packageable only, not remotely CI-proven.

## Local Evidence Still Available

The latest local PR packaging evidence remains:

- `pnpm run test:runtime`: recorded pass.
- `pnpm turbo run lint test`: recorded pass.
- `pnpm run test:local-harness`: recorded pass.
- Mobile env/runtime checks: recorded pass.
- Base RN Web E2E: recorded pass with deployed-backend API reachability skipped
  when no explicit `EXPO_PUBLIC_API_URL` is supplied.

## Non-Claims

Do not claim from this checkpoint:

- remote GitHub CI pass;
- branch protection enforcement;
- GitHub required-check enforcement;
- deployed backend API proof;
- native/device/EAS/mobile-mcp proof;
- pod/webhook/Secret/platform readiness;
- release readiness or store submission safety.

## Next Eligible Actions

Allowed repo-local actions:

1. Keep PR #2 as draft and report that remote checks are not present.
2. Let a repo owner decide how to seed/enable required GitHub workflows on the
   default branch if remote PR checks are required before review.
3. Continue only with documentation/evidence updates that do not claim remote CI
   proof.

Not allowed without separate human/ops approval:

- editing GitHub repository settings or branch protection;
- using live platform credentials;
- running live EAS, device/mobile-mcp, pod, webhook, Railway, Confluence, or
  Stitch/GCloud operations.
