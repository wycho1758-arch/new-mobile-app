#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const args = process.argv.slice(2);
const defaultFixture = 'evals/local-harness/eas-evidence/fixtures/eas-maestro-success-tokenized-url.json';
const selfTestRoot = 'evals/local-harness/results/eas-evidence-self-test';

function argValue(name, fallback = null) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  return args[index + 1] || fallback;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(root, relativePath), 'utf8'));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function redactUrl(value) {
  try {
    const parsed = new URL(value);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return value.replace(/([?&](?:token|access_token|signature|X-Amz-Signature)=)[^&\s]+/gi, '$1<redacted>');
  }
}

function redact(value) {
  if (typeof value === 'string') {
    if (/^https?:\/\//.test(value)) return redactUrl(value);
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redact(item)]));
  }
  return value;
}

function canonicalEvidenceDir(outRoot, timestamp, slug) {
  if (!/^\d{8}-\d{6}$/.test(timestamp)) {
    throw new Error('timestamp must match YYYYMMDD-HHMMSS');
  }
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    throw new Error('slug must be lowercase kebab-case');
  }
  return path.join(outRoot, `${timestamp}-eas-${slug}`);
}

function normalizeEasEvidence(input, options) {
  const redacted = redact(input);
  const build = redacted.build || redacted;
  const artifacts = build.artifacts || {};
  const maestro = redacted.maestro || {};

  return {
    schema: 'eas-evidence/v1',
    generated_at: options.generatedAt,
    evidence_level: 'L2',
    provider: 'eas-maestro',
    source: options.source,
    build: {
      id: build.id || null,
      status: build.status || null,
      platform: build.platform || null,
      profile: build.profile || null,
      commit_sha: build.gitCommitHash || build.commitSha || null,
      artifact_url: artifacts.applicationArchiveUrl || artifacts.buildUrl || null,
      build_url: artifacts.buildUrl || build.buildUrl || null,
    },
    maestro: {
      status: maestro.status || null,
      flow_path: maestro.flowPath || maestro.flow_path || null,
      summary: maestro.summary || null,
    },
  };
}

function assertNoQueryTokens(value, label = 'result') {
  const serialized = JSON.stringify(value);
  if (/[?&](?:token|access_token|signature|X-Amz-Signature)=/i.test(serialized)) {
    throw new Error(`${label} contains unredacted tokenized URL query`);
  }
  if (serialized.includes('fixture-token-to-redact')) {
    throw new Error(`${label} contains fixture token value`);
  }
}

function ingest(options) {
  const input = readJson(options.input);
  const evidenceDir = canonicalEvidenceDir(options.outRoot, options.timestamp, options.slug);
  const result = normalizeEasEvidence(input, {
    generatedAt: options.generatedAt,
    source: options.source,
  });
  assertNoQueryTokens(result);

  const resultFile = path.join(root, evidenceDir, 'result.json');
  writeJson(resultFile, result);
  fs.writeFileSync(
    path.join(root, evidenceDir, 'summary.md'),
    [
      '# EAS Maestro Evidence',
      '',
      `- Evidence level: ${result.evidence_level}`,
      `- Provider: ${result.provider}`,
      `- Build id: ${result.build.id || 'unknown'}`,
      `- Build status: ${result.build.status || 'unknown'}`,
      `- Maestro status: ${result.maestro.status || 'unknown'}`,
      '',
      'This artifact records ingested EAS/Maestro output only. It does not by itself prove production release approval.',
      '',
    ].join('\n'),
  );

  return {
    evidence_dir: evidenceDir.replaceAll(path.sep, '/'),
    result_path: path.join(evidenceDir, 'result.json').replaceAll(path.sep, '/'),
    result,
  };
}

function runSelfTest() {
  const outRoot = selfTestRoot;
  fs.rmSync(path.join(root, outRoot), { recursive: true, force: true });
  const output = ingest({
    input: defaultFixture,
    outRoot,
    timestamp: '20260611-010000',
    slug: 'home',
    generatedAt: '2026-06-11T01:00:00.000Z',
    source: 'offline-fixture',
  });

  if (output.evidence_dir !== `${selfTestRoot}/20260611-010000-eas-home`) {
    throw new Error(`unexpected evidence_dir: ${output.evidence_dir}`);
  }
  if (output.result.schema !== 'eas-evidence/v1') {
    throw new Error('result schema mismatch');
  }
  if (output.result.evidence_level !== 'L2' || output.result.provider !== 'eas-maestro') {
    throw new Error('result evidence level/provider mismatch');
  }
  if (output.result.build.artifact_url !== 'https://artifacts.example.test/build.apk') {
    throw new Error(`artifact URL was not redacted as expected: ${output.result.build.artifact_url}`);
  }
  assertNoQueryTokens(output.result, 'self-test result');
  console.log('Validated EAS evidence ingest fixtures.');
}

if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
  try {
    if (args.includes('--self-test')) {
      runSelfTest();
    } else {
      const input = argValue('--input');
      if (!input) throw new Error('usage: node scripts/ingest-eas-evidence.mjs --input <json> --slug <slug> [--timestamp YYYYMMDD-HHMMSS] [--out-root .evidence/e2e-test]');
      const timestamp = argValue('--timestamp', new Date().toISOString().replace(/[-:]/g, '').slice(0, 8) + '-' + new Date().toISOString().replace(/[-:]/g, '').slice(9, 15));
      const output = ingest({
        input,
        outRoot: argValue('--out-root', '.evidence/e2e-test'),
        timestamp,
        slug: argValue('--slug', 'eas-evidence'),
        generatedAt: new Date().toISOString(),
        source: input,
      });
      console.log(JSON.stringify(output, null, 2));
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
