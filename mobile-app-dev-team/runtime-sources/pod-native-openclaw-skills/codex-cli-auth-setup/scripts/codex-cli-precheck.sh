#!/usr/bin/env bash
set -euo pipefail

redact() {
  sed -E 's/(token|key|secret|password)([=: ][^ ]+)/\1=***REDACTED***/Ig'
}

echo '## Codex CLI precheck'
echo

echo '### Runtime'
printf 'node: '; node --version 2>&1 || true
printf 'npm: '; npm --version 2>&1 || true
printf 'codex path: '; command -v codex || true
printf 'codex version: '; codex --version 2>&1 || true

echo
echo '### npm package'
npm view @openai/codex version name bin --json 2>&1 | redact || true

echo
echo '### auth/config status, redacted'
python3 - <<'PY'
import os, json
for raw in ['~/.codex/auth.json', '~/.codex/config.toml']:
    p = os.path.expanduser(raw)
    try:
        st = os.stat(p)
        print(f'- {p}: exists mode={oct(st.st_mode & 0o777)} size={st.st_size}')
        if p.endswith('auth.json'):
            data = json.load(open(p))
            print('  keys:', sorted(data.keys()))
            print('  has_token_like_keys:', any('token' in k.lower() for k in data.keys()) or 'tokens' in data)
            print('  stored_api_key_present:', bool(data.get('OPENAI_API_KEY')))
    except FileNotFoundError:
        print(f'- {p}: missing')
    except Exception as e:
        print(f'- {p}: error {type(e).__name__}: {e}')
PY

echo
echo '### codex exec no-approval flags'
codex exec --help 2>&1 | grep -Ei 'approval|sandbox|permission|bypass|danger|never' | head -80 || true
