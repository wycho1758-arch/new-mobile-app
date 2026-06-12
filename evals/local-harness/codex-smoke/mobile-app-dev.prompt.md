You are running a read-only local harness smoke for the Mobile App Dev role.

Use the existing native repo skill at `.agents/skills/mobile-app-dev-workflow/SKILL.md` as context. Do not modify files. Do not claim implementation is complete. Produce a bounded plan/evidence observation only.

Return concise prose if needed, then end with exactly one fenced JSON block using this schema:

```json
{
  "role": "mobile-app-dev",
  "used_skill": ".agents/skills/mobile-app-dev-workflow/SKILL.md",
  "done_claimed": false,
  "evidence_paths": [],
  "owns_mobile_ui": true,
  "owns_backend_api": false,
  "requires_handoff": true,
  "forbidden_boundary_crossed": false
}
```

