#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fixtureDir = 'evals/local-harness/project-environment/fixtures';
const args = process.argv.slice(2);

const requiredFiles = [
  'package.json',
  'apps/mobile/package.json',
  'turbo.json',
  '.codex/config.toml',
  '.github/workflows/quality-gate.yml',
  '.github/workflows/auto-merge.yml',
  'PROJECT_ENVIRONMENT.md',
  'REPO_OPERATIONS.md',
  'evals/local-harness/sot/snapshot.json',
];

const mobileDependencyFields = [
  ['dependencies', 'expo'],
  ['dependencies', 'react'],
  ['dependencies', 'react-dom'],
  ['dependencies', 'react-native'],
  ['dependencies', 'react-native-web'],
  ['dependencies', 'expo-router'],
  ['dependencies', 'expo-dev-client'],
  ['dependencies', 'nativewind'],
  ['devDependencies', '@playwright/test'],
  ['devDependencies', 'tailwindcss'],
  ['devDependencies', '@tailwindcss/postcss'],
  ['devDependencies', 'postcss'],
  ['devDependencies', 'lightningcss'],
];

function readFileMap(baseRoot = root) {
  return Object.fromEntries(
    requiredFiles.map((relativePath) => [
      relativePath,
      fs.existsSync(path.join(baseRoot, relativePath))
        ? fs.readFileSync(path.join(baseRoot, relativePath), 'utf8')
        : '',
    ]),
  );
}

function parseJson(errors, files, relativePath) {
  try {
    return JSON.parse(files[relativePath]);
  } catch (error) {
    errors.push(`${relativePath} must be valid JSON: ${error.message}`);
    return null;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function envBacktickValue(environment, label) {
  const pattern = new RegExp(`${escapeRegExp(label)}[^\\n]*?\`([^\\\`]+)\``);
  const match = environment.match(pattern);
  return match?.[1] || null;
}

function envPackageVersion(environment, packageName) {
  if (packageName === 'nativewind') {
    const match = environment.match(/Current NativeWind package:\s*`nativewind@([^`]+)`/);
    return match?.[1] || null;
  }

  const pattern = new RegExp(`- \`${escapeRegExp(packageName)}\`: \`([^\\\`]+)\``);
  const match = environment.match(pattern);
  return match?.[1] || null;
}

function requireEqual(errors, label, actual, expected) {
  if (actual !== expected) {
    errors.push(`${label} mismatch: expected ${expected || '<missing>'}, got ${actual || '<missing>'}`);
  }
}

function extractPin(text, pattern, label, errors) {
  const match = text.match(pattern);
  if (!match) {
    errors.push(`${label} pin missing`);
    return null;
  }
  return match[1];
}

function extractQualityGateRuntimePattern(qualityGate) {
  const match = qualityGate.match(/grep -Eq '([^']+)'/s);
  return match?.[1] || '';
}

function qualityGateSetsPnpmActionVersion(qualityGate) {
  const lines = qualityGate.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (!/uses:\s*pnpm\/action-setup@v4\b/.test(lines[index])) continue;

    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      const line = lines[cursor];
      if (/^\s*-\s+uses:/.test(line) || /^\s*-\s+run:/.test(line) || /^\s*-\s+id:/.test(line)) break;
      if (/^\s*with:\s*\{[^}]*\bversion\s*:/.test(line) || /^\s*version\s*:/.test(line)) {
        return true;
      }
    }
  }
  return false;
}

function validateAutoMergeWorkflow(errors, autoMerge) {
  if (!autoMerge.trim()) {
    errors.push('auto-merge.yml must exist');
    return;
  }

  const requiredSnippets = [
    ['auto-merge.yml must trigger on workflow_run', /workflow_run:/],
    ['auto-merge.yml must listen for Quality gate workflow', /workflows:\s*\[\s*['"]Quality gate['"]\s*\]/],
    ['auto-merge.yml must run only on completed workflow_run events', /types:\s*\[\s*completed\s*\]/],
    ['auto-merge.yml must require pull_request source event', /github\.event\.workflow_run\.event\s*==\s*['"]pull_request['"]/],
    ['auto-merge.yml must require successful Quality gate conclusion', /github\.event\.workflow_run\.conclusion\s*==\s*['"]success['"]/],
    ['auto-merge.yml must require exactly one associated pull request', /github\.event\.workflow_run\.pull_requests\s*&&\s*github\.event\.workflow_run\.pull_requests\.length\s*==\s*1/],
    ['auto-merge.yml must require base branch main', /github\.event\.workflow_run\.pull_requests\[0\]\.base\.ref\s*==\s*['"]main['"]/],
    ['auto-merge.yml must grant contents write permission', /contents:\s*write/],
    ['auto-merge.yml must grant pull-requests write permission', /pull-requests:\s*write/],
    ['auto-merge.yml must pass PR_URL from workflow_run pull request html_url', /PR_URL:\s*\$\{\{\s*github\.event\.workflow_run\.pull_requests\[0\]\.html_url\s*\}\}/],
    ['auto-merge.yml must pass HEAD_SHA from workflow_run head_sha', /HEAD_SHA:\s*\$\{\{\s*github\.event\.workflow_run\.head_sha\s*\}\}/],
    ['auto-merge.yml must inspect PR state before merge', /gh pr view "\$PR_URL"/],
    ['auto-merge.yml must skip closed PRs', /pr\.state\s*!=\s*['"]OPEN['"]/],
    ['auto-merge.yml must skip draft PRs', /isDraft\s*==\s*true/],
    ['auto-merge.yml must verify PR head SHA matches workflow_run head_sha', /headRefOid\s*!=\s*process\.env\.HEAD_SHA/],
    ['auto-merge.yml must use GitHub native auto-merge', /gh pr merge "\$PR_URL" --auto/],
    ['auto-merge.yml must use squash merge strategy non-interactively', /--squash/],
    ['auto-merge.yml must guard the exact head commit', /--match-head-commit "\$HEAD_SHA"/],
  ];

  for (const [message, pattern] of requiredSnippets) {
    if (!pattern.test(autoMerge)) errors.push(message);
  }

  if (/--admin/.test(autoMerge)) {
    errors.push('auto-merge.yml must not use --admin');
  }
  if (/actions\/checkout@/.test(autoMerge)) {
    errors.push('auto-merge.yml must not check out PR code');
  }
  if (/PAT|PERSONAL_ACCESS_TOKEN|secrets\.(?!GITHUB_TOKEN\b)|ghp_|github_pat_/i.test(autoMerge)) {
    errors.push('auto-merge.yml must not use PATs or hardcoded tokens');
  }
}

function validateSnapshot(errors, snapshot) {
  if (!snapshot) return;
  if (snapshot.snapshotVersion !== 1) {
    errors.push('snapshot snapshotVersion must be 1');
  }
  if (typeof snapshot.fetchedAt !== 'string' || Number.isNaN(Date.parse(snapshot.fetchedAt))) {
    errors.push('snapshot fetchedAt must be an ISO timestamp');
  }
  if (snapshot.source?.type !== 'confluence') {
    errors.push('snapshot source.type must remain confluence provenance');
  }
  if (typeof snapshot.source?.cloudId !== 'string' || !snapshot.source.cloudId.startsWith('https://')) {
    errors.push('snapshot source.cloudId must be an https provenance URL');
  }
  if (!Array.isArray(snapshot.pages) || snapshot.pages.length === 0) {
    errors.push('snapshot pages must be a non-empty array');
    return;
  }
  snapshot.pages.forEach((page, index) => {
    for (const key of ['key', 'pageId', 'title']) {
      if (typeof page?.[key] !== 'string' || page[key].trim() === '') {
        errors.push(`snapshot pages[${index}].${key} must be a non-empty string`);
      }
    }
    if (!Number.isInteger(page?.version) || page.version < 1) {
      errors.push(`snapshot pages[${index}].version must be a positive integer`);
    }
  });
  const taxonomyNotes = snapshot.skillTaxonomy?.taxonomyNotes;
  if (!taxonomyNotes || typeof taxonomyNotes !== 'object' || Array.isArray(taxonomyNotes)) {
    errors.push('snapshot skillTaxonomy.taxonomyNotes must document source-page taxonomy mappings');
  } else {
    for (const term of [
      'Confluence/MVP source-page namespace',
      'not .agents/skills runtime drift',
      'po-prd-to-execution',
      'design-mobile-design-handoff',
      'project-bootstrap',
    ]) {
      if (!JSON.stringify(taxonomyNotes).includes(term)) {
        errors.push(`snapshot skillTaxonomy.taxonomyNotes missing mapping term: ${term}`);
      }
    }
  }
}

export function validateProjectEnvironment(files = readFileMap()) {
  const errors = [];
  const packageJson = parseJson(errors, files, 'package.json');
  const mobilePackageJson = parseJson(errors, files, 'apps/mobile/package.json');
  const turboJson = parseJson(errors, files, 'turbo.json');
  const snapshot = parseJson(errors, files, 'evals/local-harness/sot/snapshot.json');
  const environment = files['PROJECT_ENVIRONMENT.md'] || '';
  const repoOperations = files['REPO_OPERATIONS.md'] || '';
  const codexConfig = files['.codex/config.toml'] || '';
  const qualityGate = files['.github/workflows/quality-gate.yml'] || '';
  const autoMerge = files['.github/workflows/auto-merge.yml'] || '';
  const qualityGateRuntimePattern = extractQualityGateRuntimePattern(qualityGate);

  if (packageJson) {
    const declaredPackageManager = envBacktickValue(environment, 'Package manager:');
    requireEqual(errors, 'package.json packageManager', packageJson.packageManager, declaredPackageManager);
    requireEqual(errors, 'package.json pnpm.overrides.lightningcss', packageJson.pnpm?.overrides?.lightningcss, '1.30.1');
    if (packageJson.packageManager?.startsWith('pnpm@') && qualityGateSetsPnpmActionVersion(qualityGate)) {
      errors.push('quality-gate.yml must not set pnpm/action-setup version when package.json packageManager pins pnpm');
    }
  }

  if (mobilePackageJson) {
    for (const [section, packageName] of mobileDependencyFields) {
      const actual = mobilePackageJson[section]?.[packageName];
      const expected = envPackageVersion(environment, packageName);
      requireEqual(errors, `apps/mobile/package.json ${section}.${packageName}`, actual, expected);
    }
  }

  if (turboJson) {
    const buildOutputs = turboJson.tasks?.build?.outputs;
    if (!Array.isArray(buildOutputs) || !buildOutputs.includes('dist/**')) {
      errors.push('turbo.json tasks.build.outputs must include dist/** for workspace package build artifacts');
    }
    const testDependsOn = turboJson.tasks?.test?.dependsOn;
    if (!Array.isArray(testDependsOn) || !testDependsOn.includes('^build')) {
      errors.push('turbo.json tasks.test.dependsOn must include ^build so clean CI builds workspace package exports before tests');
    }
  }

  const mobileMcpConfig = extractPin(codexConfig, /@mobilenext\/mobile-mcp@([^"'\]\s]+)/, 'mobile-mcp', errors);
  const mobileMcpEnv = extractPin(environment, /@mobilenext\/mobile-mcp@([^`"'\]\s]+)/, 'mobile-mcp PROJECT_ENVIRONMENT.md', errors);
  const serenaConfig = extractPin(codexConfig, /oraios\/serena@([^"'\]\s]+)/, 'serena', errors);
  const serenaEnv = extractPin(environment, /oraios\/serena@([^`"'\]\s]+)/, 'serena PROJECT_ENVIRONMENT.md', errors);
  const stitchConfig = extractPin(codexConfig, /stitch-mcp@([^"'\]\s]+)/, 'stitch', errors);
  const stitchEnv = extractPin(environment, /stitch-mcp@([^`"'\]\s]+)/, 'stitch PROJECT_ENVIRONMENT.md', errors);

  requireEqual(errors, 'mobile-mcp pin', mobileMcpConfig, mobileMcpEnv);
  requireEqual(errors, 'serena pin', serenaConfig, serenaEnv);
  requireEqual(errors, 'stitch pin', stitchConfig, stitchEnv);

  if (/@mobilenext\/mobile-mcp@latest/.test(codexConfig)) {
    errors.push('mobile-mcp must not use @latest');
  }
  if (/stitch-mcp@latest/.test(codexConfig)) {
    errors.push('stitch-mcp must not use @latest');
  }
  if (/oraios\/serena@(?:main|latest)/.test(codexConfig)) {
    errors.push('serena must not use an unpinned branch or @latest');
  }

  for (const command of ['pnpm run test:runtime', 'pnpm turbo run lint test', 'pnpm run test:local-harness']) {
    if (!qualityGate.includes(command)) {
      errors.push(`quality-gate.yml must include ${command}`);
    }
  }
  if (!qualityGateRuntimePattern.includes('\\.github/workflows/.*\\.yml')) {
    errors.push('quality-gate.yml must detect .github/workflows/*.yml changes');
  }
  if (!environment.includes('.github/workflows/auto-merge.yml')) {
    errors.push('PROJECT_ENVIRONMENT.md must document .github/workflows/auto-merge.yml');
  }
  for (const script of [
    'validate-repo-operations',
    'validate-team-doc',
    'validate-team-doc-archive',
    'validate-project-environment',
    'validate-evidence-hygiene',
  ]) {
    if (!qualityGateRuntimePattern.includes(script)) {
      errors.push(`quality-gate.yml must detect scripts/${script}.mjs`);
    }
    if (!environment.includes(`scripts/${script}.mjs`)) {
      errors.push(`PROJECT_ENVIRONMENT.md must document scripts/${script}.mjs`);
    }
  }
  if (!environment.includes('validate:project-environment')) {
    errors.push('PROJECT_ENVIRONMENT.md must document validate:project-environment');
  }
  if (!environment.includes('validate:evidence-hygiene')) {
    errors.push('PROJECT_ENVIRONMENT.md must document validate:evidence-hygiene');
  }
  if (!environment.includes('tracked Claude Code helper artifacts')) {
    errors.push('PROJECT_ENVIRONMENT.md must distinguish tracked Claude Code helper artifacts from transient Claude local state');
  }
  if (
    /requires these root paths to remain\s+covered by `\.gitignore`/.test(environment)
    || /`CLAUDE\.md`\s+- `\.claude\/`\s+- `\.claude-state\/`/.test(environment)
  ) {
    errors.push('PROJECT_ENVIRONMENT.md must not describe tracked CLAUDE.md as gitignored transient state');
  }
  if (!repoOperations.includes('validate:project-environment')) {
    errors.push('REPO_OPERATIONS.md must include validate:project-environment in active runtime composition');
  }
  if (!repoOperations.includes('validate:evidence-hygiene')) {
    errors.push('REPO_OPERATIONS.md must include validate:evidence-hygiene in active runtime composition');
  }
  if (!repoOperations.includes('scripts/validate-project-environment.mjs')) {
    errors.push('REPO_OPERATIONS.md must document scripts/validate-project-environment.mjs responsibility');
  }
  if (!repoOperations.includes('scripts/validate-evidence-hygiene.mjs')) {
    errors.push('REPO_OPERATIONS.md must document scripts/validate-evidence-hygiene.mjs responsibility');
  }
  if (packageJson) {
    const script = packageJson.scripts?.['validate:project-environment'];
    requireEqual(errors, 'package.json scripts.validate:project-environment', script, 'node scripts/validate-project-environment.mjs --self-test && node scripts/validate-project-environment.mjs');
    if (!packageJson.scripts?.['test:runtime']?.includes('pnpm run validate:project-environment')) {
      errors.push('package.json test:runtime must include pnpm run validate:project-environment');
    }
    const evidenceScript = packageJson.scripts?.['validate:evidence-hygiene'];
    requireEqual(errors, 'package.json scripts.validate:evidence-hygiene', evidenceScript, 'node scripts/validate-evidence-hygiene.mjs --self-test && node scripts/validate-evidence-hygiene.mjs');
    if (!packageJson.scripts?.['test:runtime']?.includes('pnpm run validate:evidence-hygiene')) {
      errors.push('package.json test:runtime must include pnpm run validate:evidence-hygiene');
    }
  }

  validateAutoMergeWorkflow(errors, autoMerge);

  validateSnapshot(errors, snapshot);

  return errors;
}

function setJsonPath(target, pathParts, value) {
  let cursor = target;
  for (const part of pathParts.slice(0, -1)) {
    cursor = cursor[part];
  }
  cursor[pathParts[pathParts.length - 1]] = value;
}

function deleteJsonPath(target, pathParts) {
  let cursor = target;
  for (const part of pathParts.slice(0, -1)) {
    cursor = cursor[part];
  }
  delete cursor[pathParts[pathParts.length - 1]];
}

function applyMutation(files, mutation) {
  if (mutation.type === 'replace') {
    if (!files[mutation.file].includes(mutation.from)) {
      throw new Error(`${mutation.file} fixture mutation source not found: ${mutation.from}`);
    }
    files[mutation.file] = files[mutation.file].replace(mutation.from, mutation.to);
    return;
  }

  if (mutation.type === 'json-set' || mutation.type === 'json-delete') {
    const value = JSON.parse(files[mutation.file]);
    if (mutation.type === 'json-set') setJsonPath(value, mutation.path, mutation.value);
    if (mutation.type === 'json-delete') deleteJsonPath(value, mutation.path);
    files[mutation.file] = `${JSON.stringify(value, null, 2)}\n`;
    return;
  }

  throw new Error(`unknown fixture mutation type: ${mutation.type}`);
}

function runSelfTest() {
  const files = fs.readdirSync(path.join(root, fixtureDir)).filter((file) => file.endsWith('.json')).sort();
  const failures = [];

  for (const file of files) {
    const fixturePath = path.join(root, fixtureDir, file);
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    const fixtureFiles = readFileMap();

    for (const mutation of fixture.mutations || []) {
      applyMutation(fixtureFiles, mutation);
    }

    const errors = validateProjectEnvironment(fixtureFiles);
    if (fixture.valid && errors.length > 0) {
      failures.push(`${file}: valid fixture failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
    }
    if (!fixture.valid && errors.length === 0) {
      failures.push(`${file}: invalid fixture unexpectedly passed`);
    }
    for (const expectedError of fixture.expectedErrors || []) {
      if (!errors.some((error) => error.includes(expectedError))) {
        failures.push(`${file}: missing expected error containing "${expectedError}". Actual errors:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
      }
    }
  }

  if (failures.length) {
    console.error(failures.map((failure) => `- ${failure}`).join('\n'));
    process.exit(1);
  }

  console.log('Validated project environment fixtures.');
}

if (args.includes('--self-test')) {
  runSelfTest();
} else {
  const errors = validateProjectEnvironment();
  if (errors.length) {
    console.error(errors.map((error) => `- ${error}`).join('\n'));
    process.exit(1);
  }
  console.log('Validated project environment drift checks.');
}
