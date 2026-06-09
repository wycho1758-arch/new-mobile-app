#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const docRoot = path.join(root, 'team-doc');
const fetchedAt = new Date().toISOString();
const baseUrl = 'https://wondermove-official.atlassian.net/wiki';

const nodes = [
  { id: '1373012374', type: 'page', title: 'mobile-app-dev-team', parentId: null, depth: 0, version: '3' },
  { id: '1372356612', type: 'folder', title: '환경구축 및 검증', parentId: '1373012374', depth: 1 },
  { id: '1374453866', type: 'page', title: '2026-06-07 Mobile SOUL.md 감사 완료 및 후속 진행 가이드', parentId: '1372356612', depth: 2, version: 'unknown' },
  { id: '1374290184', type: 'page', title: '2026-06-07 Mobile Local Harness 완료 및 운영 가이드', parentId: '1372356612', depth: 2, version: 'unknown' },
  { id: '1373110273', type: 'folder', title: '조사자료', parentId: '1373012374', depth: 1 },
  { id: '1372815381', type: 'page', title: 'ClawPod용 Expo + EAS 통합 스타터/보일러플레이트 조사 보고서', parentId: '1373110273', depth: 2, version: 'unknown' },
  { id: '1373667330', type: 'page', title: '[00] LLM 조직 구성 표준 프로세스', parentId: '1373012374', depth: 1, version: '3' },
  { id: '1373601794', type: 'page', title: '00-1. 원칙과 제약', parentId: '1373667330', depth: 2, version: 'unknown' },
  { id: '1373601815', type: 'page', title: '00-2. 조직 설계 절차', parentId: '1373667330', depth: 2, version: 'unknown' },
  { id: '1373765641', type: 'page', title: '00-3. 산출물 표준', parentId: '1373667330', depth: 2, version: 'unknown' },
  { id: '1373798401', type: 'page', title: '00-4. 가설·결정 레지스트리', parentId: '1373667330', depth: 2, version: 'unknown' },
  { id: '1373700097', type: 'page', title: '[01] Mobile App 조직', parentId: '1373012374', depth: 1, version: '1' },
  { id: '1373700117', type: 'page', title: '01-1. 방향과 제약', parentId: '1373700097', depth: 2, version: 'unknown' },
  { id: '1373765682', type: 'page', title: '01-2. 조직 구성과 역할', parentId: '1373700097', depth: 2, version: 'unknown' },
  { id: '1373667425', type: 'page', title: '01-3. Workflows — Case A~H', parentId: '1373700097', depth: 2, version: '2' },
  { id: '1373667362', type: 'page', title: '01-4. Skills', parentId: '1373700097', depth: 2, version: '4' },
  { id: '1373634562', type: 'page', title: 'mobile-prd-to-execution', parentId: '1373667362', depth: 3, version: 'unknown' },
  { id: '1373765661', type: 'page', title: 'mobile-design-handoff', parentId: '1373667362', depth: 3, version: 'unknown' },
  { id: '1373765723', type: 'page', title: 'mobile-api-contract', parentId: '1373667362', depth: 3, version: 'unknown' },
  { id: '1373667404', type: 'page', title: 'mobile-qa-release', parentId: '1373667362', depth: 3, version: 'unknown' },
  { id: '1373798443', type: 'page', title: 'mobile-gatekeeper', parentId: '1373667362', depth: 3, version: 'unknown' },
  { id: '1374289964', type: 'page', title: 'Role-specific Codex Runtime', parentId: '1373667362', depth: 3, version: '3' },
  { id: '1374289985', type: 'page', title: 'Runtime Path Decision', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374290005', type: 'page', title: 'Skills', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374290025', type: 'page', title: 'Agents', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374060648', type: 'page', title: 'Hooks', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374355541', type: 'page', title: 'Runtime Evaluation and CI Gate', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374290066', type: 'page', title: 'Optional Subagents and LazyCodex Pattern Reuse', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374355583', type: 'page', title: 'Rollout Blocker and Resume Conditions', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374355605', type: 'page', title: 'Rollout PR Evidence', parentId: '1374289964', depth: 4, version: 'unknown' },
  { id: '1374355758', type: 'page', title: '01-4 외부 skill 생태계 조사 검증 근거 (16후보)', parentId: '1373667362', depth: 3, version: 'unknown' },
  { id: '1373700138', type: 'page', title: '01-5. SOUL.md 템플릿', parentId: '1373700097', depth: 2, version: '4' },
  { id: '1373798422', type: 'page', title: 'SOUL.md — Product/Planning', parentId: '1373700138', depth: 3, version: 'unknown' },
  { id: '1374519364', type: 'page', title: 'mobile-requirement-office-hours', parentId: '1373798422', depth: 4, version: 'unknown' },
  { id: '1374519387', type: 'page', title: 'mobile-planning-completeness-review', parentId: '1373798422', depth: 4, version: 'unknown' },
  { id: '1374421079', type: 'page', title: 'Product Planning Operational Skills Summary', parentId: '1373798422', depth: 4, version: 'unknown' },
  { id: '1374355705', type: 'page', title: 'Product Planning Codex CLI 실무 지침', parentId: '1373798422', depth: 4, version: 'unknown' },
  { id: '1374650456', type: 'page', title: 'mobile-work-unit-planning-and-agent-sprint', parentId: '1373798422', depth: 4, version: 'unknown' },
  { id: '1373765702', type: 'page', title: 'SOUL.md — Design', parentId: '1373700138', depth: 3, version: 'unknown' },
  { id: '1374290207', type: 'page', title: 'Design Codex CLI 실무 지침', parentId: '1373765702', depth: 4, version: 'unknown' },
  { id: '1373667383', type: 'page', title: 'SOUL.md — Mobile Architect', parentId: '1373700138', depth: 3, version: 'unknown' },
  { id: '1374519454', type: 'page', title: 'Mobile Architect Codex CLI 실무 지침', parentId: '1373667383', depth: 4, version: 'unknown' },
  { id: '1373700159', type: 'page', title: 'SOUL.md — Mobile App Dev', parentId: '1373700138', depth: 3, version: 'unknown' },
  { id: '1374421154', type: 'page', title: 'Mobile App Dev Codex CLI 실무 지침', parentId: '1373700159', depth: 4, version: 'unknown' },
  { id: '1373700180', type: 'page', title: 'SOUL.md — Backend/API Integrator', parentId: '1373700138', depth: 3, version: 'unknown' },
  { id: '1374355727', type: 'page', title: 'Backend API Integrator Codex CLI 실무 지침', parentId: '1373700180', depth: 4, version: 'unknown' },
  { id: '1373700201', type: 'page', title: 'SOUL.md — QA/Release', parentId: '1373700138', depth: 3, version: 'unknown' },
  { id: '1374453910', type: 'page', title: 'QA Release Codex CLI 실무 지침', parentId: '1373700201', depth: 4, version: 'unknown' },
  { id: '1374519410', type: 'page', title: 'Mobile Codex CLI 실무 지침서 / Practitioner Guide', parentId: '1373700138', depth: 3, version: '3' },
  { id: '1373634583', type: 'page', title: '01-6. 개발 지침 (root AGENTS.md 확장안)', parentId: '1373700097', depth: 2, version: 'unknown' },
  { id: '1373700222', type: 'page', title: '01-7. 진행 계획과 상태', parentId: '1373700097', depth: 2, version: 'unknown' },
  { id: '1371963427', type: 'page', title: '01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안', parentId: '1373700097', depth: 2, version: '20' },
  { id: '1372422154', type: 'page', title: 'ClawPod Agent 모바일 템플릿 온라인 서비스 사전 등록 가이드', parentId: '1371963427', depth: 3, version: 'unknown' },
  { id: '1373667446', type: 'page', title: '01-9. 검증 근거·감사 기록', parentId: '1373700097', depth: 2, version: 'unknown' },
  { id: '1374060594', type: 'page', title: '01-3 정합성 조사 검증 근거 (2026-06-06)', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374355642', type: 'page', title: '01-8 템플릿 repo 구현 검증 근거 (2026-06-07)', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374453802', type: 'page', title: '2026-06-07 Stage 1 - Confluence Corpus and SoT Map', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374552097', type: 'page', title: '2026-06-07 Stage 2 - Cross-Role Collaboration Contract', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374650371', type: 'page', title: '2026-06-07 Stage 3 - Per-Role SOUL.md Gap Audit Rollup', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374552118', type: 'page', title: '2026-06-07 Stage 3 Role - Product Planning', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374650392', type: 'page', title: '2026-06-07 Stage 3 Role - Design', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374453823', type: 'page', title: '2026-06-07 Stage 3 Role - Mobile Architect', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374290141', type: 'page', title: '2026-06-07 Stage 3 Role - Mobile App Dev', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374650413', type: 'page', title: '2026-06-07 Stage 3 Role - Backend API Integrator', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374421058', type: 'page', title: '2026-06-07 Stage 3 Role - QA Release', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374650433', type: 'page', title: '2026-06-07 Stage 4 - Event-to-Owner Coverage Matrix', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374290163', type: 'page', title: '2026-06-07 Stage 5 - Required Update Skill Audit', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374453844', type: 'page', title: '2026-06-07 Stage 6 - Runtime and Local Harness Validation Fit', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374519340', type: 'page', title: '2026-06-07 Stage 7 - Final Minimal Change Proposal', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1374912522', type: 'page', title: '2026-06-08 First Agent Runtime E2E Canary Plan', parentId: '1373667446', depth: 3, version: 'unknown' },
  { id: '1375830055', type: 'page', title: 'First Agent Runtime E2E Canary — Reproducible Guide (2026-06-08)', parentId: '1374912522', depth: 4, version: 'unknown' },
  { id: '1375305752', type: 'page', title: 'Skill 설치 경로 SoT 검증 보고 — 01-8 vs 01-4 (2026-06-08)', parentId: '1374912522', depth: 4, version: 'unknown' },
  { id: '1376813059', type: 'page', title: '2026-06-08 Codex Hook Source Basis Update Evidence', parentId: '1373667446', depth: 3, version: 'unknown' },
];

const sourceSummaries = {
  '1373012374': [
    '이 스페이스는 admin-portal/admin-api 생성 flow로 LLM 전문 조직을 구성할 때 사용하는 기준 프로세스 SoT다.',
    '구조는 [00] LLM 조직 구성 표준 프로세스와 [01] Mobile App 조직의 2-layer로 나뉜다.',
    '인스턴스는 메타를 참조하지만, 메타는 인스턴스를 직접 참조하지 않는 단방향 의존을 유지한다.',
  ],
  '1373667330': [
    '도메인 무관 LLM 조직 구성 표준 프로세스의 진입점이다.',
    '하위 페이지는 원칙과 제약, 조직 설계 절차, 산출물 표준, 가설·결정 레지스트리로 구성된다.',
    '모든 페이지는 목적, Upstream, Downstream, 관련 DEC-ID, 출처를 담는 헤더 표준 블록을 둔다.',
  ],
  '1373700097': [
    '도메인 인스턴스 #1인 모바일 앱 개발 LLM 조직의 운영 정의 진입점이다.',
    '하위 페이지 01-1부터 01-9까지 방향, 역할, workflow, skill, SOUL, 개발 지침, 계획, repo template, 감사 기록을 소유한다.',
  ],
  '1373667425': [
    '조직이 처리하는 Case A-H workflow를 정의한다.',
    'Case A bootstrap, Case B PRD 분해, Case C UI-only, Case D API-backed, Case E backend/API, Case F gate failure, Case G preview release, Case H production submit으로 나뉜다.',
  ],
  '1373667362': [
    '조직이 사용하는 skill의 2-pack 배치 체계, MVP skill, Case A-H coverage, 선택 skill 목록을 정의한다.',
    '개별 skill 명세는 하위 페이지가 소유하며, hard pass/fail은 deterministic mobile-gatekeeper가 담당한다.',
  ],
  '1373700138': [
    'Soul Builder 입력용 SOUL.md 템플릿의 공통 base와 역할별 템플릿 체계를 정의한다.',
    'YAML frontmatter와 8개 필수 섹션 형식, English/Korean base skeleton, 역할별 페이지 인덱스를 포함한다.',
  ],
  '1371963427': [
    '고객/프로젝트별 모바일 앱을 신규 개발하거나 이어받아 작업할 때 사용할 기본 모바일 앱 프로젝트 템플릿 repo의 SoT다.',
    '목적, 템플릿 변수, 소스 선별, 타깃 디렉터리 구조, 샘플 코드, CI/EAS, 선택 backend, Codex runtime layer를 포함하는 대형 혼합 문서다.',
  ],
  '1374289964': [
    'Mobile App 조직에서 Codex CLI 전용 skills, custom agents, hooks와 generated-agent runtime package를 구분한다.',
    'hook은 local advisory guardrail이고 hard pass/fail은 mobile-gatekeeper 및 GitHub required check가 담당한다.',
  ],
  '1374519410': [
    'mobile-app-dev-team의 Codex CLI 실무 지침서다.',
    'Plan mode, skills, subagents, hooks, reviewer gates, git diff 검증 사용 기준을 설명한다.',
  ],
};

const childrenByParent = new Map();
const nodeById = new Map(nodes.map((node) => [node.id, node]));
for (const node of nodes) {
  if (!childrenByParent.has(node.parentId)) childrenByParent.set(node.parentId, []);
  childrenByParent.get(node.parentId).push(node);
}

function slugify(title, id) {
  const normalized = title
    .toLowerCase()
    .replace(/\[|\]/g, '')
    .replace(/so(u)?l\.md/g, 'soul-md')
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  return `${normalized || 'page'}-${id}`;
}

function pageUrl(id) {
  return `${baseUrl}/spaces/mobileappd/pages/${id}`;
}

function mkdir(relativePath) {
  fs.mkdirSync(path.join(docRoot, relativePath), { recursive: true });
}

function write(relativePath, body) {
  const absolutePath = path.join(docRoot, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${body.trimEnd()}\n`);
}

function escapeYaml(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function frontmatter(data) {
  return [
    '---',
    ...Object.entries(data).map(([key, value]) => `${key}: ${escapeYaml(value)}`),
    '---',
    '',
  ].join('\n');
}

function buildSourcePaths() {
  const paths = new Map();
  const rootNode = nodeById.get('1373012374');
  paths.set(rootNode.id, `00-source/${slugify(rootNode.title, rootNode.id)}`);

  function visit(parentId) {
    for (const child of childrenByParent.get(parentId) || []) {
      if (child.id === '1373012374') continue;
      const parentPath = paths.get(child.parentId);
      paths.set(child.id, `${parentPath}/${slugify(child.title, child.id)}`);
      visit(child.id);
    }
  }

  visit('1373012374');
  return paths;
}

const sourceDirById = buildSourcePaths();

function sourcePath(node) {
  return `${sourceDirById.get(node.id)}/page.md`;
}

function sourceBody(node) {
  const summary = sourceSummaries[node.id] || [
    'Atlassian MCP page-body fetch timed out during this run.',
    'This source placeholder preserves the Confluence tree position and page metadata for follow-up body sync.',
  ];
  return [
    frontmatter({
      pageId: node.id,
      sourceTitle: node.title,
      sourceVersion: node.version || 'n/a',
      sourceUrl: pageUrl(node.id),
      fetchedAt,
      syncStatus: sourceSummaries[node.id] ? 'summarized-from-available-fetch' : 'metadata-only-fetch-timeout',
    }),
    `# ${node.title}`,
    '',
    `- Source page ID: ${node.id}`,
    `- Source version: ${node.version || 'n/a'}`,
    `- Source URL: ${pageUrl(node.id)}`,
    `- Sync status: ${sourceSummaries[node.id] ? 'available body summarized locally' : 'body fetch timed out; metadata preserved'}`,
    '',
    '## Local Source Note',
    '',
    ...summary.map((line) => `- ${line}`),
    '',
    '## Follow-up Sync',
    '',
    'The local tree and split-map include this page. A later successful Atlassian MCP fetch should replace this section with the exact current Confluence markdown body while preserving the frontmatter metadata.',
  ].join('\n');
}

function sourceReadme(node) {
  const children = childrenByParent.get(node.id) || [];
  return [
    `# ${node.title}`,
    '',
    `Source node type: ${node.type}`,
    `Source ID: ${node.id}`,
    node.type === 'page' ? `Source URL: ${pageUrl(node.id)}` : '',
    '',
    '## Children',
    '',
    children.length
      ? children.map((child) => `- [${child.title}](./${path.basename(sourceDirById.get(child.id))}/readme.md)`).join('\n')
      : '- No child pages recorded in the fetched descendant tree.',
    '',
    node.type === 'page' ? '## Page Copy\n\n- [page.md](./page.md)' : '',
  ].filter(Boolean).join('\n');
}

function structuredDoc(file, data, title, paragraphs) {
  write(
    file,
    [
      frontmatter(data),
      `# ${title}`,
      '',
      ...paragraphs,
      '',
      '## Source',
      '',
      `- Page ID: ${data.sourcePageId}`,
      `- Source heading: ${data.sourceHeading}`,
      `- Source version: ${data.sourceVersion}`,
    ].join('\n'),
  );
}

function addStructured(splitEntries, pageId, files) {
  const node = nodeById.get(pageId);
  splitEntries.set(pageId, {
    sourcePageId: pageId,
    sourceTitle: node.title,
    sourcePath: sourcePath(node),
    status: files.length > 1 ? 'split' : 'index',
    files,
  });
}

fs.rmSync(docRoot, { recursive: true, force: true });
mkdir('.');

for (const node of nodes) {
  const dir = sourceDirById.get(node.id);
  mkdir(dir);
  write(`${dir}/readme.md`, sourceReadme(node));
  if (node.type === 'page') write(sourcePath(node), sourceBody(node));
}

const sourceTopChildren = childrenByParent.get('1373012374') || [];
write(
  '00-source/readme.md',
  [
    '# Confluence Original Tree',
    '',
    'This directory mirrors the fetched Confluence parent/child tree from `mobile-app-dev-team`.',
    '',
    '## Top Level',
    '',
    sourceTopChildren.map((child) => `- [${child.title}](./${path.basename(sourceDirById.get(child.id))}/readme.md)`).join('\n'),
  ].join('\n'),
);

const splitEntries = new Map();

structuredDoc(
  '10-structured/00-meta-process/process-overview.md',
  { docType: 'policy', sourcePageId: '1373667330', sourceTitle: '[00] LLM 조직 구성 표준 프로세스', sourceVersion: '3', sourceHeading: '이 레이어가 하는 일' },
  'LLM Organization Standard Process',
  [
    'The meta layer owns domain-independent organization design policy. It stays free of mobile-specific paths and implementation details.',
    '',
    '- Keep dependency direction instance -> meta.',
    '- Use 00-1 through 00-4 for principles, procedure, output standards, and decision registry.',
  ],
);
structuredDoc(
  '10-structured/00-meta-process/page-header-standard.md',
  { docType: 'policy', sourcePageId: '1373667330', sourceTitle: '[00] LLM 조직 구성 표준 프로세스', sourceVersion: '3', sourceHeading: '페이지 헤더 표준 블록' },
  'Page Header Standard',
  [
    'Every page in the Confluence tree should expose purpose, upstream, downstream, related DEC-ID, and source.',
    '',
    'The local split keeps the same traceability through frontmatter and `_meta/split-map.json`.',
  ],
);
addStructured(splitEntries, '1373667330', [
  '10-structured/00-meta-process/readme.md',
  '10-structured/00-meta-process/process-overview.md',
  '10-structured/00-meta-process/page-header-standard.md',
]);

structuredDoc(
  '10-structured/01-mobile-org/organization-overview.md',
  { docType: 'operational-guide', sourcePageId: '1373700097', sourceTitle: '[01] Mobile App 조직', sourceVersion: '1', sourceHeading: '이 섹션이 하는 일' },
  'Mobile App Organization Overview',
  [
    'The mobile organization is instance #1 of the standard process. It owns direction, roles, workflows, skills, SOUL templates, development guidance, plan/status, repo template design, and audit evidence.',
  ],
);
addStructured(splitEntries, '1373700097', [
  '10-structured/01-mobile-org/readme.md',
  '10-structured/01-mobile-org/organization-overview.md',
]);

const workflowCases = [
  ['case-a-bootstrap.md', 'Case A. 신규 프로젝트 bootstrap', 'procedure', 'Create a new mobile repo from the template, inject project variables, and add operating layers such as gatekeeper, evidence, and repo-scoped skills.'],
  ['case-b-prd-breakdown.md', 'Case B. PRD 접수와 Epic/Task 분해', 'procedure', 'Turn PRD input into Epic, Story, and role-owned Tasks with acceptance and evidence requirements.'],
  ['case-c-ui-only-feature.md', 'Case C. UI-only feature', 'procedure', 'Implement screen or UX work without backend changes, with design intent review and Maestro evidence.'],
  ['case-d-api-backed-feature.md', 'Case D. API-backed feature', 'procedure', 'Coordinate screen state, shared API contract, mobile implementation, QA evidence, and linked backend work when needed.'],
  ['case-e-backend-api-change.md', 'Case E. Backend/API 변경 중심 작업', 'procedure', 'Handle mobile-facing backend/API changes through contract updates, compatibility notes, and mobile integration evidence.'],
  ['case-f-gate-failure.md', 'Case F. QA 실패 또는 Gate 실패', 'procedure', 'Classify failures, increment rework_count, route owner fixes, and escalate when the cap is reached.'],
  ['case-g-preview-release.md', 'Case G. Preview/Internal release', 'procedure', 'Run preview/internal EAS build, Maestro critical path, evidence JSON, and release notes before user verification.'],
  ['case-h-production-submit.md', 'Case H. Production submit', 'procedure', 'Proceed only through recorded human approval for production submit, store policy checks, rollback plan, and EAS submit result recording.'],
];
for (const [file, heading, docType, summary] of workflowCases) {
  structuredDoc(
    `10-structured/02-workflows/${file}`,
    { docType, sourcePageId: '1373667425', sourceTitle: '01-3. Workflows — Case A~H', sourceVersion: '2', sourceHeading: heading },
    heading,
    [summary],
  );
}
addStructured(splitEntries, '1373667425', [
  '10-structured/02-workflows/readme.md',
  ...workflowCases.map(([file]) => `10-structured/02-workflows/${file}`),
]);

const skillSplits = [
  ['skill-placement-policy.md', 'Skill placement policy', 'policy', 'Separate organization-runtime skill pack from new-mobile-app repo skill pack.'],
  ['external-skill-selection-policy.md', 'External official skill selection policy', 'policy', 'External official skills are selected deliberately; full install of all candidates is prohibited.'],
  ['mvp-skill-matrix.md', 'MVP skill matrix', 'registry', 'Tracks the MVP five skills, their install locations, target roles, and default case coverage.'],
  ['case-coverage-registry.md', 'Case A-H skill coverage registry', 'registry', 'Maps each workflow case to the skill or mode that owns repeatable execution coverage.'],
  ['optional-skills.md', 'Optional skills', 'reference', 'Lists post-MVP skills and adoption triggers without turning them into current requirements.'],
];
for (const [file, heading, docType, summary] of skillSplits) {
  structuredDoc(
    `10-structured/03-skills/${file}`,
    { docType, sourcePageId: '1373667362', sourceTitle: '01-4. Skills', sourceVersion: '4', sourceHeading: heading },
    heading,
    [summary],
  );
}
addStructured(splitEntries, '1373667362', [
  '10-structured/03-skills/readme.md',
  ...skillSplits.map(([file]) => `10-structured/03-skills/${file}`),
]);

const soulSplits = [
  ['soul-base-template.md', 'SOUL.md common base', 'role-contract', 'Defines the shared SOUL contract and 8-section skeleton that role pages inherit.'],
  ['soul-base-template-en.md', 'English base skeleton', 'template', 'English operational skeleton for generated role SOUL.md files.'],
  ['soul-base-template-ko.md', 'Korean base skeleton', 'template', 'Korean interpretation of the base skeleton for review and alignment.'],
  ['role-pages-index.md', 'Role page index', 'index', 'Indexes Product/Planning, Design, Mobile Architect, Mobile App Dev, Backend/API Integrator, and QA/Release SOUL pages.'],
];
for (const [file, heading, docType, summary] of soulSplits) {
  structuredDoc(
    `10-structured/04-soul-contracts/${file}`,
    { docType, sourcePageId: '1373700138', sourceTitle: '01-5. SOUL.md 템플릿', sourceVersion: '4', sourceHeading: heading },
    heading,
    [summary],
  );
}
addStructured(splitEntries, '1373700138', [
  '10-structured/04-soul-contracts/readme.md',
  ...soulSplits.map(([file]) => `10-structured/04-soul-contracts/${file}`),
]);

const repoSplits = [
  ['template-purpose-and-dod.md', 'Purpose and Definition of Done', 'policy', 'Defines the template repo purpose and the baseline completion criteria.'],
  ['variables.md', 'Template variables', 'reference', 'Lists project generation inputs and rendering rules.'],
  ['source-selection.md', 'Source selection matrix', 'reference', 'Records which upstream projects or official docs inform the template.'],
  ['target-tree.md', 'Target directory structure', 'reference', 'Documents the monorepo target tree and optional workspaces.'],
  ['mobile-runtime.md', 'Mobile runtime sample set', 'reference', 'Captures Expo, NativeWind, Jest, Maestro, app config, and contracts sample boundaries.'],
  ['ci-and-eas.md', 'CI and EAS workflows', 'procedure', 'Documents PR gate, EAS profiles, EAS workflows, and release flow boundaries.'],
  ['optional-api.md', 'Optional API workspace', 'reference', 'Separates optional Hono/Drizzle backend ownership and constraints.'],
  ['codex-runtime-layer.md', 'Codex runtime layer', 'runtime', 'Documents repo-scoped Codex skills, custom agents, hooks, evals, and validation scripts.'],
  ['references.md', 'Reference basis', 'reference', 'Indexes official and project source references used by the template design.'],
];
for (const [file, heading, docType, summary] of repoSplits) {
  structuredDoc(
    `10-structured/05-repo-template/${file}`,
    { docType, sourcePageId: '1371963427', sourceTitle: '01-8. ClawPod Agent용 기본 모바일 앱 프로젝트 템플릿 repo 구성 설계안', sourceVersion: '20', sourceHeading: heading },
    heading,
    [summary],
  );
}
addStructured(splitEntries, '1371963427', [
  '10-structured/05-repo-template/readme.md',
  ...repoSplits.map(([file]) => `10-structured/05-repo-template/${file}`),
]);

structuredDoc(
  '10-structured/06-codex-runtime/runtime-boundary.md',
  { docType: 'runtime', sourcePageId: '1374289964', sourceTitle: 'Role-specific Codex Runtime', sourceVersion: '3', sourceHeading: '이 페이지의 역할' },
  'Codex Runtime Boundary',
  [
    'Defines the separation between Codex CLI native repo skills, custom agents, hooks, and generated-agent runtime skill packages.',
  ],
);
structuredDoc(
  '10-structured/06-codex-runtime/practitioner-guide.md',
  { docType: 'operational-guide', sourcePageId: '1374519410', sourceTitle: 'Mobile Codex CLI 실무 지침서 / Practitioner Guide', sourceVersion: '3', sourceHeading: 'Workflow Pillars / 작업 기둥' },
  'Mobile Codex CLI Practitioner Guide',
  [
    'Explains when to use planning, skills, subagents, hooks, reviewers, and verified completion checks.',
  ],
);
addStructured(splitEntries, '1374289964', [
  '10-structured/06-codex-runtime/readme.md',
  '10-structured/06-codex-runtime/runtime-boundary.md',
]);
addStructured(splitEntries, '1374519410', [
  '10-structured/06-codex-runtime/readme.md',
  '10-structured/06-codex-runtime/practitioner-guide.md',
]);

structuredDoc(
  '10-structured/07-evidence-and-audit/evidence-index.md',
  { docType: 'evidence', sourcePageId: '1373667446', sourceTitle: '01-9. 검증 근거·감사 기록', sourceVersion: 'unknown', sourceHeading: '하위 검증 근거' },
  'Evidence and Audit Index',
  [
    'Frozen evidence and audit pages are preserved as source material and indexed here. They are not merged into policy pages.',
  ],
);
addStructured(splitEntries, '1373667446', [
  '10-structured/07-evidence-and-audit/readme.md',
  '10-structured/07-evidence-and-audit/evidence-index.md',
]);

function writeStructuredReadme(dir, title, description) {
  const files = fs
    .readdirSync(path.join(docRoot, dir), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'readme.md')
    .map((entry) => `- [${entry.name.replace(/\.md$/, '')}](./${entry.name})`);
  write(dir + '/readme.md', [`# ${title}`, '', description, '', '## Documents', '', files.join('\n') || '- No documents yet.'].join('\n'));
}

writeStructuredReadme('10-structured/00-meta-process', 'Meta Process', 'Domain-independent process and page governance.');
writeStructuredReadme('10-structured/01-mobile-org', 'Mobile Organization', 'Mobile App organization overview and local navigation.');
writeStructuredReadme('10-structured/02-workflows', 'Workflows', 'Case A-H workflow procedures split from the mixed workflow source page.');
writeStructuredReadme('10-structured/03-skills', 'Skills', 'Skill policies, registries, and optional skill references split by document character.');
writeStructuredReadme('10-structured/04-soul-contracts', 'SOUL Contracts', 'Role-contract and template material split from the SOUL source page.');
writeStructuredReadme('10-structured/05-repo-template', 'Repo Template', 'Template policy, references, implementation details, API, CI/EAS, and runtime material split by character.');
writeStructuredReadme('10-structured/06-codex-runtime', 'Codex Runtime', 'Runtime boundary and practitioner guide material.');
writeStructuredReadme('10-structured/07-evidence-and-audit', 'Evidence and Audit', 'Evidence pages are indexed without merging frozen audit content.');

write(
  '10-structured/readme.md',
  [
    '# Structured Team Docs',
    '',
    'This tree reorganizes the Confluence corpus by document character and reading purpose.',
    '',
    '## Sections',
    '',
    '- [Meta Process](./00-meta-process/readme.md)',
    '- [Mobile Organization](./01-mobile-org/readme.md)',
    '- [Workflows](./02-workflows/readme.md)',
    '- [Skills](./03-skills/readme.md)',
    '- [SOUL Contracts](./04-soul-contracts/readme.md)',
    '- [Repo Template](./05-repo-template/readme.md)',
    '- [Codex Runtime](./06-codex-runtime/readme.md)',
    '- [Evidence and Audit](./07-evidence-and-audit/readme.md)',
  ].join('\n'),
);

const splitEntryValues = [];
for (const node of nodes.filter((node) => node.type === 'page')) {
  if (splitEntries.has(node.id)) {
    splitEntryValues.push(splitEntries.get(node.id));
  } else {
    splitEntryValues.push({
      sourcePageId: node.id,
      sourceTitle: node.title,
      sourcePath: sourcePath(node),
      status: 'source-only',
      files: [sourcePath(node)],
    });
  }
}

const mapNodes = nodes.map((node) => ({
  ...node,
  url: node.type === 'page' ? pageUrl(node.id) : null,
  sourcePath: node.type === 'page' ? sourcePath(node) : `${sourceDirById.get(node.id)}/readme.md`,
}));

write(
  '_meta/confluence-page-map.json',
  JSON.stringify({ fetchedAt, homePageId: '1373012374', baseUrl, nodes: mapNodes }, null, 2),
);
write(
  '_meta/split-map.json',
  JSON.stringify({ generatedAt: fetchedAt, entries: splitEntryValues }, null, 2),
);
write(
  '_meta/fetch-report.md',
  [
    '# Fetch Report',
    '',
    `Generated at: ${fetchedAt}`,
    '',
    '## Result',
    '',
    '- Descendant tree metadata was preserved from the successful Atlassian MCP descendant fetch.',
    '- Full page-body sync was blocked after repeated Atlassian MCP timeouts on 2026-06-09.',
    '- Source files therefore contain metadata and local summaries for previously observed core pages, while other pages are marked `metadata-only-fetch-timeout`.',
    '',
    '## Follow-up',
    '',
    'Run a body refresh when Atlassian MCP page fetches are stable, replacing each `page.md` body below the frontmatter with exact Confluence markdown.',
  ].join('\n'),
);
write(
  '_meta/validation-report.md',
  [
    '# Validation Report',
    '',
    'Run `node scripts/validate-team-doc.mjs` after generation.',
    '',
    'Expected checks include source tree mirroring, lowercase `readme.md` indexes, source metadata, structured frontmatter, split-map coverage, and probable secret scanning.',
  ].join('\n'),
);
write(
  '_meta/readme.md',
  [
    '# Team Doc Metadata',
    '',
    '- [Confluence page map](./confluence-page-map.json)',
    '- [Split map](./split-map.json)',
    '- [Fetch report](./fetch-report.md)',
    '- [Validation report](./validation-report.md)',
  ].join('\n'),
);

write(
  'readme.md',
  [
    '# Team Docs',
    '',
    'Local documentation corpus for the WonderMove mobile-app-dev-team Confluence space.',
    '',
    '## Index',
    '',
    '- [Original Confluence tree](./00-source/readme.md)',
    '- [Structured docs](./10-structured/readme.md)',
    '- [Metadata](./_meta/readme.md)',
    '',
    '## Sync Status',
    '',
    'This corpus is metadata-complete for the descendant tree captured from Confluence. Full body refresh is pending because Atlassian MCP page fetches timed out during generation; see [_meta/fetch-report.md](./_meta/fetch-report.md).',
  ].join('\n'),
);

console.log(`Generated team-doc with ${nodes.filter((node) => node.type === 'page').length} page nodes.`);
