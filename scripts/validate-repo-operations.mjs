#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

function fail(message) {
  errors.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function requireFile(relativePath) {
  if (!exists(relativePath)) {
    fail(`missing required repo operations file: ${relativePath}`);
    return '';
  }
  return read(relativePath);
}

function requireTerms(relativePath, terms) {
  const body = requireFile(relativePath);
  if (!body) return;
  for (const term of terms) {
    if (!body.includes(term)) fail(`${relativePath} missing required repo operations term: ${term}`);
  }
}

function forbidTerms(relativePath, terms) {
  const body = requireFile(relativePath);
  if (!body) return;
  for (const term of terms) {
    if (body.includes(term)) fail(`${relativePath} includes forbidden duplicated repo policy term: ${term}`);
  }
}

function requirePackageScripts() {
  const body = requireFile('package.json');
  if (!body) return;
  let packageJson;
  try {
    packageJson = JSON.parse(body);
  } catch (error) {
    fail(`package.json must be valid JSON: ${error.message}`);
    return;
  }

  const scripts = packageJson.scripts || {};
  const expectedRuntime = 'pnpm run validate && pnpm run validate:repo-operations && pnpm run validate:team-doc && pnpm run test:hooks';
  if (scripts['test:runtime'] !== expectedRuntime) {
    fail(`package.json test:runtime must keep active gates only: ${expectedRuntime}`);
  }
  if (scripts['validate:team-doc-archive'] !== 'node scripts/validate-team-doc-archive.mjs') {
    fail('package.json missing validate:team-doc-archive archive/reference validator script');
  }
  if (scripts['test:runtime']?.includes('validate:team-doc-archive')) {
    fail('package.json test:runtime must not include archive/reference validator');
  }
}

requireTerms('AGENTS.md', [
  'REPO_OPERATIONS.md',
]);

requireTerms('REPO_OPERATIONS.md', [
  '# Repo Operations',
  '## Policy Ownership Map',
  'AGENTS.md',
  'PROJECT_ENVIRONMENT.md',
  'REPO_OPERATIONS.md',
  'team-doc/mobile-app-dev-team/',
  'team-doc/00-source/',
  'team-doc/10-structured/',
  'scripts/',
  'not policy owner',
  '## Document Strata',
  '## Source And Archive Rules',
  '## Validator Responsibility Model',
  '## OpenClaw And Codex Operational Boundaries',
  '## Evidence Gates',
  '## Package Script Composition',
  'validate:team-doc-archive',
  'archive/reference',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'root-owned archive metadata',
  'root-owned archived content',
  'delete-ready',
  'active current team/runtime gate',
  'legacy Confluence-shaped corpus',
  'Codex-only Repo Work Policy',
  '/workspace/CODEX_MANAGED_PATHS.md',
  '/workspace/new-mobile-app/',
  '/workspace/codex-hooks/codex-run',
]);

requirePackageScripts();

requireFile('TEAM_DOC_ARCHIVE_MANIFEST.json');
requireFile('TEAM_DOC_ARCHIVE_BUNDLE.jsonl');

requireTerms('team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md', [
  'REPO_OPERATIONS.md',
  '/workspace/CODEX_MANAGED_PATHS.md',
  '/workspace/new-mobile-app/',
  '/workspace/codex-hooks/codex-run',
]);

forbidTerms('team-doc/mobile-app-dev-team/09-pod-native-openclaw-skills/codex-cli-auth-setup/SKILL.md', [
  'Recommended AGENTS.md policy wording:',
  'Allowed direct actions by this agent:',
  'This agent MUST NOT directly use read/edit/write for Codex-managed repo/path content',
]);

requireTerms('team-doc/mobile-app-dev-team/README.md', [
  'REPO_OPERATIONS.md',
  'team/role/process/reference',
]);

requireTerms('team-doc/mobile-app-dev-team/99-source-map.md', [
  'REPO_OPERATIONS.md',
  'repo-wide operating policy',
]);

requireTerms('scripts/validate-team-doc-archive.mjs', [
  'validate-team-doc-archive',
  'archive/reference',
  'TEAM_DOC_ARCHIVE_MANIFEST.json',
  'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
  'readArchiveManifest',
  'readArchiveBundle',
  'crosswalk coverage',
]);

forbidTerms('scripts/validate-team-doc-archive.mjs', [
  "listFiles('00-source'",
  "listFiles('10-structured'",
  'requiredArchiveDirs',
]);

forbidTerms('scripts/validate-team-doc.mjs', [
  "listFiles('00-source'",
  "listFiles('10-structured'",
  'sourcePath must live under 00-source',
  'source markdown missing frontmatter',
  'structured markdown missing frontmatter',
  'Validated team-doc: ${sourceFiles.length}',
]);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log('Validated repo operations policy ownership.');
