# Codex CLI setup report template

## Codex CLI 설치/Auth/무승인 실행 보고

### 결론

```text
Codex CLI: <version>
설치 경로: <path>
Auth: <auth present/configured>
무승인 실행: <passed/failed/not requested>
```

### 확인 내용

- Node/npm version:
- npm package:
- `codex --version`:
- `~/.codex/auth.json`: exists/missing, mode only
- `codex doctor`: key readiness results only
- no-approval smoke test output:

### 주의

- auth token 값은 출력하지 않음
- token/key/secret/password 값은 기록하지 않고 status only 형식으로 보고
- `--dangerously-bypass-approvals-and-sandbox`는 명시 요청/테스트 환경에서만 사용
- Codex MCP 서버는 별도 설정이 필요할 수 있음
