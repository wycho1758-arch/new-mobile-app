# Skill Evaluation Evidence

Command:

```sh
npm run validate
```

Result:

- PASS: 2 native Codex skills validated under `.agents/skills`.
- PASS: each `SKILL.md` has YAML frontmatter, matching `name`, non-empty `description`, and stays under 500 lines.
- PASS: positive and negative prompt fixtures exist for both role workflow skills.

Validated artifacts:

- `.agents/skills/mobile-app-dev-workflow/SKILL.md`
- `.agents/skills/mobile-backend-api-integrator-workflow/SKILL.md`
