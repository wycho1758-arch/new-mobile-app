#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const teamDocRoot = path.join(root, 'team-doc');
const manifestPath = path.join(root, 'TEAM_DOC_ARCHIVE_MANIFEST.json');
const bundlePath = path.join(root, 'TEAM_DOC_ARCHIVE_BUNDLE.jsonl');

if (process.env.ALLOW_LEGACY_TEAM_DOC_ARCHIVE_CAPTURE !== '1') {
  console.error('Legacy team-doc archive capture is retired from active tooling. Set ALLOW_LEGACY_TEAM_DOC_ARCHIVE_CAPTURE=1 only for an approved pre-deletion/source-refresh recapture.');
  process.exit(1);
}

const sourceRoots = [
  '00-source',
  '10-structured',
  '_meta',
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function sha256(body) {
  return crypto.createHash('sha256').update(body).digest('hex');
}

function parseFrontmatter(body) {
  if (!body.startsWith('---\n')) return null;
  const end = body.indexOf('\n---\n', 4);
  if (end < 0) return null;
  const block = body.slice(4, end).trim();
  const data = {};
  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].replace(/^"|"$/g, '');
  }
  return data;
}

function listFiles(relativeRoot) {
  const absoluteRoot = path.join(teamDocRoot, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) {
    fail(`Missing archive source root: team-doc/${relativeRoot}`);
  }

  const files = [];
  const stack = [absoluteRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
        continue;
      }
      files.push(absolute);
    }
  }
  return files.sort();
}

function classify(teamDocRelativePath) {
  if (teamDocRelativePath.startsWith('00-source/')) return 'source';
  if (teamDocRelativePath.startsWith('10-structured/')) return 'structured';
  if (teamDocRelativePath.startsWith('_meta/')) return 'meta';
  return 'unknown';
}

const files = sourceRoots.flatMap((sourceRoot) => listFiles(sourceRoot));
const manifestEntries = [];
const bundleEntries = [];

for (const absolutePath of files) {
  const repoPath = path.relative(root, absolutePath).split(path.sep).join('/');
  const teamDocRelativePath = path.relative(teamDocRoot, absolutePath).split(path.sep).join('/');
  const content = fs.readFileSync(absolutePath, 'utf8');
  const digest = sha256(content);
  const bytes = Buffer.byteLength(content, 'utf8');
  const kind = classify(teamDocRelativePath);
  const frontmatter = repoPath.endsWith('.md') ? parseFrontmatter(content) : null;

  const entry = {
    path: repoPath,
    teamDocRelativePath,
    kind,
    sha256: digest,
    bytes,
    extension: path.extname(repoPath).slice(1),
    frontmatter,
  };

  manifestEntries.push(entry);
  bundleEntries.push({
    path: repoPath,
    teamDocRelativePath,
    sha256: digest,
    bytes,
    encoding: 'utf8',
    content,
  });
}

const bundleByPath = new Map(bundleEntries.map((entry) => [entry.path, entry]));
for (const entry of manifestEntries) {
  const bundled = bundleByPath.get(entry.path);
  if (!bundled) fail(`Manifest entry missing bundle content: ${entry.path}`);
  if (bundled.sha256 !== entry.sha256) fail(`Bundle hash mismatch: ${entry.path}`);
  if (bundled.bytes !== entry.bytes) fail(`Bundle byte count mismatch: ${entry.path}`);
}

const sourceFiles = manifestEntries.filter((entry) => entry.kind === 'source' && entry.path.endsWith('.md') && !entry.path.endsWith('/readme.md'));
const structuredFiles = manifestEntries.filter((entry) => entry.kind === 'structured' && entry.path.endsWith('.md') && !entry.path.endsWith('/readme.md'));
const metaFiles = manifestEntries.filter((entry) => entry.kind === 'meta');
const docTypeCounts = {};
for (const entry of structuredFiles) {
  const docType = entry.frontmatter?.docType || '<missing>';
  docTypeCounts[docType] = (docTypeCounts[docType] || 0) + 1;
}

const manifest = {
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  sourceRoots: sourceRoots.map((sourceRoot) => `team-doc/${sourceRoot}/`),
  archiveSourcePathStrategy: {
    originalRoots: sourceRoots.map((sourceRoot) => `team-doc/${sourceRoot}/`),
    manifestPath: 'TEAM_DOC_ARCHIVE_MANIFEST.json',
    bundlePath: 'TEAM_DOC_ARCHIVE_BUNDLE.jsonl',
    restoreInstructions: 'Restore entries by writing each TEAM_DOC_ARCHIVE_BUNDLE.jsonl line content to its path field.',
  },
  deletionReadiness: {
    status: 'captured-not-yet-delete-ready',
    evidencePaths: [
      '.evidence/reviews/team-doc-delete-readiness-evidence-20260610.md',
      '.evidence/reviews/team-doc-delete-readiness-final-review-high-20260610.md',
    ],
  },
  totals: {
    files: manifestEntries.length,
    sourceMarkdownFiles: sourceFiles.length,
    structuredMarkdownFiles: structuredFiles.length,
    metaFiles: metaFiles.length,
    bytes: manifestEntries.reduce((sum, entry) => sum + entry.bytes, 0),
    docTypes: docTypeCounts,
  },
  files: manifestEntries,
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(
  bundlePath,
  `${bundleEntries.map((entry) => JSON.stringify(entry)).join('\n')}\n`,
);

console.log(`Wrote TEAM_DOC_ARCHIVE_MANIFEST.json with ${manifestEntries.length} entries.`);
console.log(`Wrote TEAM_DOC_ARCHIVE_BUNDLE.jsonl with ${bundleEntries.length} entries.`);
console.log(`Captured ${sourceFiles.length} source markdown files and ${structuredFiles.length} structured markdown files.`);
