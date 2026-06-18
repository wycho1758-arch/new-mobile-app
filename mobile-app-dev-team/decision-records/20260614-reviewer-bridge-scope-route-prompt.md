# reviewer bridge — route test (po-scope-gate-reviewer)

Mode: scope. Route smoke test for the reviewer bridge agent's scope-gate path.

Target/scope decision: adding one read-only `.claude/agents/reviewer.md` bridge agent
that dispatches to Codex reviewers, while explicitly keeping full Codex→Claude reviewer
ports deferred/NO_GO (a previously recorded decision).

Verify (read-only): Is the scope contained and consistent with the prior NO_GO on
reviewer ports — i.e., does adding a bridge agent stay within bounds (a dispatcher, not
a reviewer-logic port), avoid scope creep, and require no human gate? Flag any scope
containment, non-goal, or author-vs-approver concern.

Decide GO / NO_GO with a machine-readable verdict envelope.
