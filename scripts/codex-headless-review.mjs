#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  formatCodexSelectionFailure,
  selectCodexBinary,
} from './lib/codex-binary-resolver.mjs';

const root = process.cwd();
const allowedAgents = new Set([
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'wm-docs-researcher',
  'wm-gate-fix-advisor',
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'po-docs-researcher',
  'design-reviewer',
  'design-researcher',
]);
const verdictProducingReviewers = new Set([
  'wm-implementation-reviewer',
  'wm-contract-reviewer',
  'po-planning-reviewer',
  'po-scope-gate-reviewer',
  'design-reviewer',
]);
const verdicts = new Set(['GO', 'NO_GO', 'NEEDS_HUMAN', 'BLOCKED']);
const modes = new Set(['plan', 'final', 'scope', 'contract', 'design']);
const severities = new Set(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);
const checkStatuses = new Set(['PASS', 'FAIL', 'NOT_RUN', 'NOT_APPLICABLE']);
const nextActions = new Set(['proceed', 'fix_findings', 'ask_human', 'rerun_review']);
const owners = new Set([
  'Product/Planning',
  'Design',
  'Mobile Architect',
  'Mobile App Dev',
  'Backend/API Integrator',
  'QA/Release',
  'human',
]);

function usage() {
  console.error('Usage: node scripts/codex-headless-review.mjs [--json-envelope] --agent <name> --prompt <text|file> --out <path>');
  console.error('       node scripts/codex-headless-review.mjs --self-test');
  process.exit(2);
}

function readArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function readAgentInstructions(agentName) {
  const agentPath = path.join(root, '.codex/agents', `${agentName}.toml`);
  if (!fs.existsSync(agentPath)) throw new Error(`Missing agent file: ${agentPath}`);
  const body = fs.readFileSync(agentPath, 'utf8');
  const match = body.match(/developer_instructions\s*=\s*"""([\s\S]*?)"""/);
  if (!match) throw new Error(`${agentName} missing developer_instructions`);

  if (!/read-only|Do not|Workspace-write mode requires/i.test(body)) {
    throw new Error(`${agentName} missing read-only or boundary instruction`);
  }
  if (/reviewer|researcher/.test(agentName)) {
    if (!/source references|cite sources|links/i.test(body)) {
      throw new Error(`${agentName} must require source references`);
    }
    if (!/recursiv(e|ely) delegat/i.test(body)) {
      throw new Error(`${agentName} must prohibit recursive delegation`);
    }
  }
  return match[1].trim();
}

function resolvePrompt(input) {
  if (!input) usage();
  const candidate = path.resolve(root, input);
  return fs.existsSync(candidate) ? fs.readFileSync(candidate, 'utf8') : input;
}

function addValidationError(errors, condition, message) {
  if (!condition) errors.push(message);
}

export function extractReviewerEnvelope(markdown) {
  const matches = [...markdown.matchAll(/```json\s*([\s\S]*?)\s*```/g)];
  if (!matches.length) return { ok: false, reason: 'missing-json-envelope' };
  if (matches.length > 1) return { ok: false, reason: 'multiple-json-envelopes' };
  const match = matches[0];
  const trailing = markdown.slice((match.index ?? 0) + match[0].length);
  if (trailing.trim()) return { ok: false, reason: 'json-envelope-not-final' };
  try {
    return { ok: true, value: JSON.parse(match[1]) };
  } catch (error) {
    return { ok: false, reason: 'malformed-json', detail: error.message };
  }
}

export function validateReviewerEnvelope(envelope, expectedReviewer) {
  const errors = [];
  const object = envelope && typeof envelope === 'object' && !Array.isArray(envelope);
  addValidationError(errors, object, 'envelope must be a JSON object');
  if (!object) return errors;

  addValidationError(errors, verdicts.has(envelope.verdict), 'verdict must be GO, NO_GO, NEEDS_HUMAN, or BLOCKED');
  addValidationError(errors, verdictProducingReviewers.has(envelope.reviewer), 'reviewer must be a verdict-producing reviewer');
  if (expectedReviewer) addValidationError(errors, envelope.reviewer === expectedReviewer, `reviewer must match requested agent ${expectedReviewer}`);
  addValidationError(errors, modes.has(envelope.mode), 'mode must be plan, final, scope, contract, or design');
  addValidationError(errors, envelope.scope && typeof envelope.scope === 'object' && !Array.isArray(envelope.scope), 'scope must be an object');
  if (envelope.scope && typeof envelope.scope === 'object' && !Array.isArray(envelope.scope)) {
    addValidationError(errors, envelope.scope.baseline === null || typeof envelope.scope.baseline === 'string', 'scope.baseline must be string or null');
    addValidationError(errors, typeof envelope.scope.target === 'string' && envelope.scope.target.length > 0, 'scope.target must be a non-empty string');
    addValidationError(errors, Array.isArray(envelope.scope.paths_reviewed), 'scope.paths_reviewed must be an array');
    if (Array.isArray(envelope.scope.paths_reviewed)) {
      addValidationError(errors, envelope.scope.paths_reviewed.every((item) => typeof item === 'string'), 'scope.paths_reviewed entries must be strings');
    }
  }

  addValidationError(errors, Array.isArray(envelope.findings), 'findings must be an array');
  if (Array.isArray(envelope.findings)) {
    for (const [index, finding] of envelope.findings.entries()) {
      const prefix = `findings[${index}]`;
      addValidationError(errors, finding && typeof finding === 'object' && !Array.isArray(finding), `${prefix} must be an object`);
      if (!finding || typeof finding !== 'object' || Array.isArray(finding)) continue;
      addValidationError(errors, severities.has(finding.severity), `${prefix}.severity must be CRITICAL, HIGH, MEDIUM, or LOW`);
      addValidationError(errors, typeof finding.summary === 'string' && finding.summary.length > 0, `${prefix}.summary must be a non-empty string`);
      addValidationError(errors, Array.isArray(finding.source_refs) && finding.source_refs.length > 0, `${prefix}.source_refs must be a non-empty array`);
      if (Array.isArray(finding.source_refs)) {
        addValidationError(errors, finding.source_refs.every((item) => typeof item === 'string' && /:\d+$/.test(item)), `${prefix}.source_refs entries must be path:line strings`);
      }
      addValidationError(errors, owners.has(finding.owner), `${prefix}.owner is not a supported owner`);
    }
  }

  addValidationError(errors, Array.isArray(envelope.checks_reviewed), 'checks_reviewed must be an array');
  if (Array.isArray(envelope.checks_reviewed)) {
    for (const [index, check] of envelope.checks_reviewed.entries()) {
      const prefix = `checks_reviewed[${index}]`;
      addValidationError(errors, check && typeof check === 'object' && !Array.isArray(check), `${prefix} must be an object`);
      if (!check || typeof check !== 'object' || Array.isArray(check)) continue;
      addValidationError(errors, typeof check.command === 'string' && check.command.length > 0, `${prefix}.command must be a non-empty string`);
      addValidationError(errors, checkStatuses.has(check.status), `${prefix}.status must be PASS, FAIL, NOT_RUN, or NOT_APPLICABLE`);
      addValidationError(errors, typeof check.evidence === 'string' && check.evidence.length > 0, `${prefix}.evidence must be a non-empty string`);
    }
  }

  addValidationError(errors, Array.isArray(envelope.residual_risks), 'residual_risks must be an array');
  if (Array.isArray(envelope.residual_risks)) {
    addValidationError(errors, envelope.residual_risks.every((item) => typeof item === 'string'), 'residual_risks entries must be strings');
  }
  addValidationError(errors, nextActions.has(envelope.next_action), 'next_action must be proceed, fix_findings, ask_human, or rerun_review');

  const highOrMediumFinding = Array.isArray(envelope.findings)
    && envelope.findings.some((finding) => ['CRITICAL', 'HIGH', 'MEDIUM'].includes(finding?.severity));
  const failedCheck = Array.isArray(envelope.checks_reviewed)
    && envelope.checks_reviewed.some((check) => check?.status === 'FAIL');
  const notRunCheck = Array.isArray(envelope.checks_reviewed)
    && envelope.checks_reviewed.some((check) => check?.status === 'NOT_RUN');

  if (envelope.verdict === 'GO') {
    addValidationError(errors, !highOrMediumFinding, 'GO cannot include Critical/High/Medium findings');
    addValidationError(errors, !failedCheck, 'GO cannot include failed required checks');
    addValidationError(errors, !notRunCheck, 'GO cannot include NOT_RUN required checks');
  }
  if (failedCheck) addValidationError(errors, envelope.verdict === 'NO_GO', 'failed required checks must produce NO_GO');
  if (notRunCheck && !['BLOCKED', 'NEEDS_HUMAN'].includes(envelope.verdict)) {
    errors.push('NOT_RUN required checks must produce BLOCKED or NEEDS_HUMAN');
  }

  return errors;
}

function writeParsedEnvelope(outputPath, envelope) {
  const parsedPath = outputPath.replace(/\.[^/.]+$/, '.json');
  fs.writeFileSync(parsedPath, `${JSON.stringify(envelope, null, 2)}\n`);
}

function runSelfTest() {
  const fixtureRoot = path.join(root, 'evals/agents/reviewer-json-envelope');
  const cases = [
    ['valid-go.md', true],
    ['valid-no-go.md', true],
    ['valid-needs-human.md', true],
    ['valid-blocked.md', true],
    ['invalid-missing-envelope.md', false],
    ['invalid-malformed-json.md', false],
    ['invalid-unsupported-reviewer.md', false],
    ['invalid-required-fail-go.md', false],
    ['invalid-required-not-run-go.md', false],
  ];
  const failures = [];
  for (const [fileName, shouldPass] of cases) {
    const markdown = fs.readFileSync(path.join(fixtureRoot, fileName), 'utf8');
    const extracted = extractReviewerEnvelope(markdown);
    const validationErrors = extracted.ok ? validateReviewerEnvelope(extracted.value) : [extracted.reason];
    const passed = extracted.ok && validationErrors.length === 0;
    if (passed !== shouldPass) {
      failures.push(`${fileName}: expected ${shouldPass ? 'pass' : 'fail'}, got ${passed ? 'pass' : 'fail'}${validationErrors.length ? ` (${validationErrors.join('; ')})` : ''}`);
    }
  }
  if (failures.length) fail(failures.map((failure) => `- ${failure}`).join('\n'));
  console.log('Codex headless review helper self-test passed.');
}

if (hasFlag('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const jsonEnvelope = hasFlag('--json-envelope');
const agentName = readArg('--agent');
const promptInput = readArg('--prompt');
const outPath = readArg('--out');

if (!agentName || !promptInput || !outPath) usage();
if (!allowedAgents.has(agentName)) fail(`Unsupported agent: ${agentName}`, 2);
if (jsonEnvelope && !verdictProducingReviewers.has(agentName)) {
  fail(`--json-envelope is only supported for verdict-producing reviewers: ${agentName}`, 2);
}

const instructions = readAgentInstructions(agentName);
const prompt = resolvePrompt(promptInput);
const outputPath = path.resolve(root, outPath);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const envelopeInstructions = jsonEnvelope
  ? [
      '',
      'Machine-readable reviewer verdict envelope:',
      '- End the response with exactly one fenced ```json block and no text after it.',
      '- The JSON object must include verdict, reviewer, mode, scope, findings, checks_reviewed, residual_risks, and next_action.',
      '- verdict must be GO, NO_GO, NEEDS_HUMAN, or BLOCKED.',
      '- GO requires no Critical/High/Medium findings and no FAIL or NOT_RUN required checks.',
      '- Failed required checks must use NO_GO; missing required checks must use BLOCKED unless the blocker is a human gate that uses NEEDS_HUMAN.',
      `- reviewer must equal ${agentName}.`,
    ]
  : [];

const reviewPrompt = [
  `Agent: ${agentName}`,
  '',
  'Agent instructions:',
  instructions,
  '',
  'Additional constraints:',
  '- Operate read-only.',
  '- Include source references for findings and claims.',
  '- Do not perform recursive delegation.',
  '- Do not modify files, run mutating commands, or mark failed gates as passed.',
  ...envelopeInstructions,
  '',
  'Review request:',
  prompt,
].join('\n');

const selectedCodex = selectCodexBinary();
if (!selectedCodex.selected) fail(formatCodexSelectionFailure(selectedCodex));

const codexArgs = [
  '-a',
  'never',
  'exec',
  '-m',
  'gpt-5.5',
  '-c',
  'model_reasoning_effort="high"',
  '-s',
  'read-only',
  '-C',
  root,
  '--output-last-message',
  outputPath,
  '-',
];

const run = spawnSync(selectedCodex.selected.descriptor.command, [
  ...selectedCodex.selected.descriptor.argsPrefix,
  ...codexArgs,
], {
  input: reviewPrompt,
  encoding: 'utf8',
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: selectedCodex.selected.descriptor.shell || false,
});

if ((run.status ?? 1) !== 0) {
  console.error(`Codex headless review failed using ${selectedCodex.acceptedPath}`);
  process.exit(run.status ?? 1);
}

if (jsonEnvelope) {
  const markdown = fs.readFileSync(outputPath, 'utf8');
  const extracted = extractReviewerEnvelope(markdown);
  if (!extracted.ok) fail(`Reviewer JSON envelope validation failed: ${extracted.reason}${extracted.detail ? ` (${extracted.detail})` : ''}`);
  const validationErrors = validateReviewerEnvelope(extracted.value, agentName);
  if (validationErrors.length) fail(`Reviewer JSON envelope validation failed:\n${validationErrors.map((error) => `- ${error}`).join('\n')}`);
  writeParsedEnvelope(outputPath, extracted.value);
}
