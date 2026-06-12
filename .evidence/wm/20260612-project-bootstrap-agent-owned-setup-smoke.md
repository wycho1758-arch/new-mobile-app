# Project Bootstrap Agent-Owned Setup Smoke

checked_at: 2026-06-12T14:44:00+09:00
branch: docs/role-title-display-identity
head: b7f37a11aea837f6c442e9bf4446271e42a45d1e

## Command

```bash
tmpdir=$(mktemp -d)
managed="$tmpdir/managed.md"
report="$tmpdir/report.json"
blockers="$tmpdir/blockers.md"
printf -- '- %s/\n' "$PWD" > "$managed"
env -u WM_ROLE -u WM_EXPECTED_ROLE \
  REPO_PATH="$PWD" \
  CODEX_MANAGED_PATHS="$managed" \
  PROJECT_BOOTSTRAP_REPORT_PATH="$report" \
  PROJECT_BOOTSTRAP_BLOCKERS_MD_PATH="$blockers" \
  PROJECT_BOOTSTRAP_BLOCKER_RESOLUTION_GUIDE="$PWD/mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/references/blocker-resolution-guide.md" \
  bash mobile-app-dev-team/09-pod-native-openclaw-skills/project-bootstrap/scripts/project-bootstrap-preflight.sh
node - "$report" "$blockers" <<'NODE'
const fs = require('node:fs');
const [reportPath, blockersPath] = process.argv.slice(2);
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const blockersMd = fs.readFileSync(blockersPath, 'utf8');
const must = [
  ['status blocked', report.status === 'blocked'],
  ['guide written', report.blocker_guide.status === 'written'],
  ['guide file exists', fs.existsSync(blockersPath)],
  ['missing role identity blocker', report.blockers.includes('missing role identity')],
  ['role guide included', blockersMd.includes('## Role Identity Blockers') && blockersMd.includes('role_slug="<canonical-role-slug>"')],
  ['agent-owned setup included', blockersMd.includes('## Agent-owned setup actions') && blockersMd.includes('Managed path registry')],
  ['human-owned blockers included', blockersMd.includes('## Human-owned blockers') && blockersMd.includes('human-gate/v1')],
  ['no user role choice', blockersMd.includes('Do not ask the user to choose the role')],
  ['identity setup required', blockersMd.includes('agent must set the identity itself') || blockersMd.includes('Agent must set the identity itself')],
  ['no live pod-role-bootstrap from guide', blockersMd.includes('Do not run `pod-role-bootstrap`, `pnpm install`, EAS builds/submits')],
];
for (const [name, ok] of must) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (must.some(([, ok]) => !ok)) process.exit(1);
console.log(`blocker_count=${report.blockers.length}`);
console.log(`blocker_guide=${report.blocker_guide.path}`);
NODE
```

## Result

```text
PASS status blocked
PASS guide written
PASS guide file exists
PASS missing role identity blocker
PASS role guide included
PASS agent-owned setup included
PASS human-owned blockers included
PASS no user role choice
PASS identity setup required
PASS no live pod-role-bootstrap from guide
blocker_count=4
blocker_guide=/var/folders/q9/m8qpcc0n2zd5w9t5tg9r9f8w0000gn/T/tmp.IhgH8I5CHn/blockers.md
```

## Interpretation

The generated blocker Markdown includes the required role-identity guidance,
agent-owned setup actions, human-owned blockers, and live-action boundary.
