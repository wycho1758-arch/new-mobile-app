#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docRoot = path.join(root, 'team-doc');
const errors = [];

const requiredDirs = [
  '.',
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

function exists(relativePath) {
  return fs.existsSync(path.join(docRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(docRoot, relativePath), 'utf8');
}

function readJson(relativePath) {
  try {
    return JSON.parse(read(relativePath));
  } catch (error) {
    fail(`${relativePath} must be valid JSON: ${error.message}`);
    return null;
  }
}

function listFiles(baseDir, predicate = () => true) {
  const absoluteBase = path.join(docRoot, baseDir);
  if (!fs.existsSync(absoluteBase)) return [];
  const out = [];
  const stack = [absoluteBase];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolute);
      } else {
        const relative = path.relative(docRoot, absolute);
        if (predicate(relative)) out.push(relative);
      }
    }
  }
  return out.sort();
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

for (const dir of requiredDirs) {
  const readme = path.join(dir, 'readme.md');
  if (!exists(readme)) fail(`missing lowercase index: team-doc/${readme}`);
}

const pageMap = exists('_meta/confluence-page-map.json')
  ? readJson('_meta/confluence-page-map.json')
  : (fail('missing team-doc/_meta/confluence-page-map.json'), null);
const splitMap = exists('_meta/split-map.json')
  ? readJson('_meta/split-map.json')
  : (fail('missing team-doc/_meta/split-map.json'), null);

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
    if (node.sourcePath && !exists(node.sourcePath)) {
      fail(`sourcePath does not exist for page ${node.id}: ${node.sourcePath}`);
    }
    if (node.sourcePath && !node.sourcePath.startsWith('00-source/')) {
      fail(`sourcePath must live under 00-source for page ${node.id}: ${node.sourcePath}`);
    }
    if (node.depth > 0 && node.parentId && !node.sourcePath?.includes('/')) {
      fail(`sourcePath must mirror parent/child tree for page ${node.id}: ${node.sourcePath}`);
    }
  }
}

const sourceFiles = listFiles('00-source', (file) => file.endsWith('.md') && !file.endsWith('/readme.md'));
for (const file of sourceFiles) {
  const frontmatter = parseFrontmatter(read(file));
  if (!frontmatter) {
    fail(`source markdown missing frontmatter: team-doc/${file}`);
    continue;
  }
  for (const key of ['pageId', 'sourceTitle', 'sourceVersion', 'sourceUrl', 'fetchedAt']) {
    if (!frontmatter[key]) fail(`source markdown missing ${key}: team-doc/${file}`);
  }
}

const structuredFiles = listFiles(
  '10-structured',
  (file) => file.endsWith('.md') && !file.endsWith('/readme.md'),
);
for (const file of structuredFiles) {
  const frontmatter = parseFrontmatter(read(file));
  if (!frontmatter) {
    fail(`structured markdown missing frontmatter: team-doc/${file}`);
    continue;
  }
  for (const key of ['docType', 'sourcePageId', 'sourceTitle', 'sourceVersion', 'sourceHeading']) {
    if (!frontmatter[key]) fail(`structured markdown missing ${key}: team-doc/${file}`);
  }
  if (frontmatter.docType && !allowedDocTypes.has(frontmatter.docType)) {
    fail(`structured markdown has invalid docType "${frontmatter.docType}": team-doc/${file}`);
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
      if (!exists(file)) fail(`split-map entry ${pageId} references missing file: ${file}`);
    }
  }
}

const generatedFiles = listFiles('.', (file) => /\.(md|json)$/.test(file));
const secretPatterns = [
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  /\b[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{24,}\b/,
  /DATABASE_URL\s*=\s*["']?(postgres|mysql):\/\/(?!.*(example|placeholder|localhost|test))/i,
  /API_BEARER_TOKEN\s*=\s*["']?(?!test|placeholder|example)[A-Za-z0-9_.-]{12,}/i,
];

for (const file of generatedFiles) {
  const body = read(file);
  for (const pattern of secretPatterns) {
    if (pattern.test(body)) fail(`probable secret or concrete credential in team-doc/${file}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated team-doc: ${sourceFiles.length} source files, ${structuredFiles.length} structured files.`);
