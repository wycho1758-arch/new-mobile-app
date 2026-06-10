#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { findSecretLikeValues } from './lib/secret-patterns.mjs';

const root = process.cwd();
const docRoot = path.join(root, 'team-doc');
const errors = [];

const validatorName = 'validate-team-doc-archive';
const validatorScope = 'archive/reference';
const manifestFile = 'TEAM_DOC_ARCHIVE_MANIFEST.json';
const bundleFile = 'TEAM_DOC_ARCHIVE_BUNDLE.jsonl';

const archiveIndexDirs = [
  '00-source',
  '10-structured',
  '10-structured/00-meta-process',
  '10-structured/01-mobile-org',
  '10-structured/02-workflows',
  '10-structured/03-skills',
  '10-structured/04-soul-contracts',
  '10-structured/05-repo-template',
  '10-structured/06-codex-runtime',
  '10-structured/07-evidence-and-audit',
  '_meta',
];

const allowedDocTypes = new Set([
  'policy',
  'procedure',
  'template',
  'reference',
  'registry',
  'evidence',
  'runtime',
  'role-contract',
  'operational-guide',
  'index',
]);

function fail(message) {
  errors.push(message);
}

function sha256(body) {
  return crypto.createHash('sha256').update(body).digest('hex');
}

function exists(relativePath) {
  return fs.existsSync(path.join(docRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(docRoot, relativePath), 'utf8');
}

function readRoot(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readArchiveManifest() {
  try {
    return JSON.parse(readRoot(manifestFile));
  } catch (error) {
    fail(`${manifestFile} must be valid JSON: ${error.message}`);
    return null;
  }
}

function readArchiveBundle() {
  let raw;
  try {
    raw = readRoot(bundleFile).trim();
  } catch (error) {
    fail(`${bundleFile} must be readable: ${error.message}`);
    return [];
  }
  if (!raw) {
    fail(`${bundleFile} must contain at least one JSONL entry`);
    return [];
  }

  return raw.split('\n').map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      fail(`${bundleFile} line ${index + 1} must be valid JSON: ${error.message}`);
      return null;
    }
  }).filter(Boolean);
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

function parseArchivedJson(bundleByTeamDocPath, relativePath) {
  const entry = bundleByTeamDocPath.get(relativePath);
  if (!entry) {
    fail(`archive bundle missing JSON file: team-doc/${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(entry.content);
  } catch (error) {
    fail(`archived ${relativePath} must be valid JSON: ${error.message}`);
    return null;
  }
}

const manifest = readArchiveManifest();
const bundleEntries = readArchiveBundle();
const bundleByPath = new Map();
const bundleByTeamDocPath = new Map();

for (const entry of bundleEntries) {
  if (!entry.path) fail(`${bundleFile} entry missing path`);
  if (!entry.teamDocRelativePath) fail(`${bundleFile} entry missing teamDocRelativePath: ${entry.path || '<unknown>'}`);
  if (entry.encoding !== 'utf8') fail(`${bundleFile} entry must use utf8 encoding: ${entry.path}`);
  if (typeof entry.content !== 'string') fail(`${bundleFile} entry content must be a string: ${entry.path}`);
  if (typeof entry.sha256 !== 'string') fail(`${bundleFile} entry missing sha256: ${entry.path}`);
  if (typeof entry.bytes !== 'number') fail(`${bundleFile} entry missing bytes: ${entry.path}`);
  if (entry.path && bundleByPath.has(entry.path)) fail(`${bundleFile} duplicate path: ${entry.path}`);
  if (entry.teamDocRelativePath && bundleByTeamDocPath.has(entry.teamDocRelativePath)) {
    fail(`${bundleFile} duplicate teamDocRelativePath: ${entry.teamDocRelativePath}`);
  }
  if (entry.path) bundleByPath.set(entry.path, entry);
  if (entry.teamDocRelativePath) bundleByTeamDocPath.set(entry.teamDocRelativePath, entry);

  if (typeof entry.content === 'string') {
    const actualHash = sha256(entry.content);
    const actualBytes = Buffer.byteLength(entry.content, 'utf8');
    if (entry.sha256 !== actualHash) fail(`${bundleFile} sha256 mismatch: ${entry.path}`);
    if (entry.bytes !== actualBytes) fail(`${bundleFile} byte count mismatch: ${entry.path}`);
  }
}

let manifestFiles = [];
if (manifest) {
  if (manifest.schemaVersion !== 1) fail(`${manifestFile} schemaVersion must be 1`);
  if (!manifest.createdAt) fail(`${manifestFile} missing createdAt`);
  if (!Array.isArray(manifest.sourceRoots)) fail(`${manifestFile} sourceRoots must be an array`);
  if (!manifest.archiveSourcePathStrategy?.bundlePath) fail(`${manifestFile} missing archiveSourcePathStrategy.bundlePath`);
  if (manifest.archiveSourcePathStrategy?.bundlePath !== bundleFile) {
    fail(`${manifestFile} archiveSourcePathStrategy.bundlePath must be ${bundleFile}`);
  }
  if (!manifest.deletionReadiness?.status) fail(`${manifestFile} missing deletionReadiness.status`);
  if (!Array.isArray(manifest.deletionReadiness?.evidencePaths)) {
    fail(`${manifestFile} deletionReadiness.evidencePaths must be an array`);
  }
  if (!Array.isArray(manifest.files)) {
    fail(`${manifestFile} files must be an array`);
  } else {
    manifestFiles = manifest.files;
  }
}

for (const entry of manifestFiles) {
  for (const key of ['path', 'teamDocRelativePath', 'kind', 'sha256', 'bytes']) {
    if (entry[key] === undefined || entry[key] === null || entry[key] === '') {
      fail(`${manifestFile} entry missing ${key}: ${entry.path || '<unknown>'}`);
    }
  }
  const bundled = bundleByPath.get(entry.path);
  if (!bundled) {
    fail(`${manifestFile} entry missing matching bundle entry: ${entry.path}`);
    continue;
  }
  if (bundled.teamDocRelativePath !== entry.teamDocRelativePath) {
    fail(`${manifestFile} teamDocRelativePath mismatch: ${entry.path}`);
  }
  if (bundled.sha256 !== entry.sha256) fail(`${manifestFile} sha256 mismatch with bundle: ${entry.path}`);
  if (bundled.bytes !== entry.bytes) fail(`${manifestFile} byte count mismatch with bundle: ${entry.path}`);
}

for (const entry of bundleEntries) {
  const manifestEntry = manifestFiles.find((candidate) => candidate.path === entry.path);
  if (!manifestEntry) fail(`${bundleFile} entry missing matching manifest entry: ${entry.path}`);
}

for (const dir of archiveIndexDirs) {
  const readme = `${dir}/readme.md`;
  if (!bundleByTeamDocPath.has(readme)) fail(`missing archived lowercase index: team-doc/${readme}`);
}

const pageMap = parseArchivedJson(bundleByTeamDocPath, '_meta/confluence-page-map.json');
const splitMap = parseArchivedJson(bundleByTeamDocPath, '_meta/split-map.json');

if (pageMap) {
  if (!pageMap.homePageId) fail('confluence-page-map.json missing homePageId');
  if (!pageMap.fetchedAt) fail('confluence-page-map.json missing fetchedAt');
  if (!Array.isArray(pageMap.nodes)) fail('confluence-page-map.json nodes must be an array');

  const nodes = Array.isArray(pageMap.nodes) ? pageMap.nodes : [];
  const pageNodes = nodes.filter((node) => node.type === 'page');
  if (!pageNodes.length) fail('confluence-page-map.json must include at least one page node');

  for (const node of pageNodes) {
    for (const key of ['id', 'title', 'version', 'url', 'sourcePath']) {
      if (!node[key]) fail(`page node missing ${key}: ${node.id || node.title || '<unknown>'}`);
    }
    if (node.sourcePath && !bundleByTeamDocPath.has(node.sourcePath)) {
      fail(`sourcePath does not exist in root archive bundle for page ${node.id}: ${node.sourcePath}`);
    }
    if (node.sourcePath && !node.sourcePath.startsWith('00-source/')) {
      fail(`sourcePath must live under 00-source for page ${node.id}: ${node.sourcePath}`);
    }
    if (node.depth > 0 && node.parentId && !node.sourcePath?.includes('/')) {
      fail(`sourcePath must mirror parent/child tree for page ${node.id}: ${node.sourcePath}`);
    }
  }
}

const sourceFiles = bundleEntries
  .filter((entry) => entry.teamDocRelativePath?.startsWith('00-source/'))
  .filter((entry) => entry.teamDocRelativePath.endsWith('.md') && !entry.teamDocRelativePath.endsWith('/readme.md'))
  .sort((a, b) => a.teamDocRelativePath.localeCompare(b.teamDocRelativePath));

for (const file of sourceFiles) {
  const frontmatter = parseFrontmatter(file.content);
  if (!frontmatter) {
    fail(`source markdown missing frontmatter: team-doc/${file.teamDocRelativePath}`);
    continue;
  }
  for (const key of ['pageId', 'sourceTitle', 'sourceVersion', 'sourceUrl', 'fetchedAt']) {
    if (!frontmatter[key]) fail(`source markdown missing ${key}: team-doc/${file.teamDocRelativePath}`);
  }
}

const structuredFiles = bundleEntries
  .filter((entry) => entry.teamDocRelativePath?.startsWith('10-structured/'))
  .filter((entry) => entry.teamDocRelativePath.endsWith('.md') && !entry.teamDocRelativePath.endsWith('/readme.md'))
  .sort((a, b) => a.teamDocRelativePath.localeCompare(b.teamDocRelativePath));

for (const file of structuredFiles) {
  const frontmatter = parseFrontmatter(file.content);
  if (!frontmatter) {
    fail(`structured markdown missing frontmatter: team-doc/${file.teamDocRelativePath}`);
    continue;
  }
  for (const key of ['docType', 'sourcePageId', 'sourceTitle', 'sourceVersion', 'sourceHeading']) {
    if (!frontmatter[key]) fail(`structured markdown missing ${key}: team-doc/${file.teamDocRelativePath}`);
  }
  if (frontmatter.docType && !allowedDocTypes.has(frontmatter.docType)) {
    fail(`structured markdown has invalid docType "${frontmatter.docType}": team-doc/${file.teamDocRelativePath}`);
  }
}

const obsoleteGeneratedSkillSlugs = [
  'mobile-prd-to-execution',
  'mobile-design-handoff',
  'mobile-api-contract',
  'mobile-qa-release',
  'mobile-gatekeeper',
  'mobile-project-bootstrap-workflow',
];

for (const file of structuredFiles) {
  if (/Sentry|@sentry|SENTRY/.test(file.content)) {
    fail(`structured doc must not describe Sentry as current/default template scope: team-doc/${file.teamDocRelativePath}`);
  }
  if (/`title`, `counter`, `increment`/.test(file.content)) {
    fail(`structured doc has obsolete mobile testID set: team-doc/${file.teamDocRelativePath}`);
  }
  for (const slug of obsoleteGeneratedSkillSlugs) {
    if (file.content.includes(`\`${slug}\``)) {
      fail(`structured doc references obsolete generated skill slug ${slug}: team-doc/${file.teamDocRelativePath}`);
    }
  }
}

if (pageMap && splitMap) {
  if (!Array.isArray(splitMap.entries)) fail('split-map.json entries must be an array');
  const entries = Array.isArray(splitMap.entries) ? splitMap.entries : [];
  const entryByPage = new Map(entries.map((entry) => [String(entry.sourcePageId), entry]));
  const sourcePageIds = pageMap.nodes
    .filter((node) => node.type === 'page')
    .map((node) => String(node.id));

  for (const pageId of sourcePageIds) {
    const entry = entryByPage.get(pageId);
    if (!entry) {
      fail(`split-map.json missing source page ${pageId}`);
      continue;
    }
    if (!['split', 'index', 'source-only'].includes(entry.status)) {
      fail(`split-map entry ${pageId} has invalid status: ${entry.status}`);
    }
    if (!Array.isArray(entry.files) || entry.files.length === 0) {
      fail(`split-map entry ${pageId} must map to at least one file`);
      continue;
    }
    for (const file of entry.files) {
      if (!bundleByTeamDocPath.has(file)) fail(`split-map entry ${pageId} references missing archived file: ${file}`);
    }
  }
}

const archivedGeneratedFiles = bundleEntries.filter((entry) => {
  if (!/\.(md|json|sh)$/.test(entry.teamDocRelativePath || '')) return false;
  return entry.teamDocRelativePath.startsWith('00-source/')
    || entry.teamDocRelativePath.startsWith('10-structured/')
    || entry.teamDocRelativePath.startsWith('_meta/');
});

for (const file of archivedGeneratedFiles) {
  for (const match of findSecretLikeValues(file.content)) {
    fail(`probable secret or concrete credential in archived team-doc/${file.teamDocRelativePath}:${match.line}`);
  }
}

const refOrganizationCrosswalk = 'mobile-app-dev-team/ref-organization/99-source-map-and-migration/old-to-new-crosswalk.md';
if (exists(refOrganizationCrosswalk)) {
  const body = read(refOrganizationCrosswalk);
  const legacyStructuredFiles = structuredFiles.map((entry) => entry.teamDocRelativePath);
  for (const file of legacyStructuredFiles) {
    if (!body.includes(`\`team-doc/${file}\``)) {
      fail(`ref-organization crosswalk coverage missing legacy structured file: team-doc/${file}`);
    }
  }
}

if (manifest?.totals) {
  if (manifest.totals.files !== manifestFiles.length) fail(`${manifestFile} totals.files mismatch`);
  if (manifest.totals.sourceMarkdownFiles !== sourceFiles.length) fail(`${manifestFile} totals.sourceMarkdownFiles mismatch`);
  if (manifest.totals.structuredMarkdownFiles !== structuredFiles.length) fail(`${manifestFile} totals.structuredMarkdownFiles mismatch`);
  const metaFiles = bundleEntries.filter((entry) => entry.teamDocRelativePath?.startsWith('_meta/'));
  if (manifest.totals.metaFiles !== metaFiles.length) fail(`${manifestFile} totals.metaFiles mismatch`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated team-doc archive/reference corpus from root archive files: ${sourceFiles.length} source files, ${structuredFiles.length} structured files.`);
