# Codex Run Materialization

`openclaw-pod-skills-sync` owns runtime materialization of the
`codex-interactive-repo-work` launch wrapper.

Repo source of truth:

```text
mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run
```

Runtime proof target:

```text
/workspace/codex-hooks/codex-run
```

The sync report schema `openclaw-pod-skills-sync/v2` records this under:

```text
codex_hooks.codex_run
```

Expected successful shape:

```json
{
  "status": "applied",
  "source_path": "<repo>/mobile-app-dev-team/runtime-sources/skills/codex-interactive-repo-work/scripts/codex-run",
  "target_path": "/workspace/codex-hooks/codex-run",
  "sha256": "<sha256>",
  "cmp": true
}
```

`/workspace/codex-hooks/codex-run` is a runtime snapshot only. Do not edit it as
source of truth. Change the repo-source script, run sync, then verify executable
bit and byte-for-byte equality.
