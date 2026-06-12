# wm overspec root artifact evidence

Date: 2026-06-09

## Plan review follow-up

`.evidence/wm-overspec-plan-review.md` required tests-first sequencing for root Claude artifact rejection:

1. Add the validator rejection first.
2. Confirm it fails while a root Claude artifact exists.
3. Remove the artifacts and rerun runtime gates.

## Red check

To avoid reintroducing forbidden files into the working tree, the runtime surface was copied to a temporary directory, `CLAUDE.md`, `.claude/`, and `.claude-state/` were added at that temporary root, and the validator was run there.

Command:

```sh
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
tar -cf - .agents .codex evals scripts PROJECT_ENVIRONMENT.md package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json apps packages docs | tar -xf - -C "$tmpdir"
touch "$tmpdir/CLAUDE.md"
mkdir "$tmpdir/.claude" "$tmpdir/.claude-state"
cd "$tmpdir"
node scripts/validate-runtime-artifacts.mjs
```

Result: exit 1, expected failure.

Relevant output:

```text
- root Claude runtime artifact must not be present: CLAUDE.md
- root Claude runtime artifact must not be present: .claude
- root Claude runtime artifact must not be present: .claude-state
```

## Green checks

After the real root `CLAUDE.md`, `.claude/`, and `.claude-state/` artifacts were removed:

- `node scripts/validate-runtime-artifacts.mjs` passed with `Validated 3 skills, 8 agents, and 4 hook events.`
- `pnpm run test:runtime` passed with runtime validation and hook fixtures.
- `pnpm run test:local-harness` passed with preflight, runtime gate, workspace lint/test, self-test, and `local harness all passed`.
