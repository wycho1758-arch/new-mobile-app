#!/usr/bin/env node
import { finish, requireTerms, scanSecrets, teamRoot } from './lib/team-doc-validation-helpers.mjs';

const errors = [];

requireTerms(errors, 'AGENTS.md', [
  '## OpenClaw And Codex Skill Routing',
  'Pod-native OpenClaw skill-only requests use `/workspace/skills/<slug>/SKILL.md` as the runtime shape',
  'After `git clone` or `git pull` for WonderMove new-mobile-app, use `openclaw-pod-skills-sync`',
  'Codex skill or agent requests use `.agents/skills/<skill-name>/SKILL.md` and `.codex/agents/<agent-name>.toml`',
  'TDD required',
], 'governance root');

requireTerms(errors, `${teamRoot}/governance/sot-and-principles.md`, [
  '# SoT And Principles',
  'Source Of Truth',
  'AGENTS.md',
  'PROJECT_ENVIRONMENT.md',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'customer app name',
], 'governance doc');

requireTerms(errors, `${teamRoot}/governance/gates-and-evidence.md`, [
  '# Gates And Evidence',
  'Required Gates',
  'Mobile Evidence Ladder',
  'Release Gatekeeper (System)',
  'Evidence Rules',
  'human-gate',
], 'governance doc');

requireTerms(errors, `${teamRoot}/governance/human-ops-live-readiness-annex.md`, [
  '# Human/Ops Live Readiness Annex',
  'Repo-Local Proof',
  'Approval Envelope',
  'Forbidden Claims',
  'actual OrbStack/OpenClaw pod execution',
], 'governance doc');

requireTerms(errors, `${teamRoot}/governance/app-eas-ota-rollback-runbook.md`, [
  '# App / EAS / OTA Rollback Runbook',
  'rollback_owner',
  'rollback_plan',
  'human / ops owner',
  'does not authorize, prove, or imply',
], 'governance doc');

scanSecrets(errors, teamRoot, (file) => /mobile-app-dev-team\/governance\/.*\.md$/.test(file));

finish(errors, 'Validated governance docs.');
