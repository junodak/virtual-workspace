# Core App

Virtual Workspace의 핵심 백엔드 서비스.

- 사용자 인증 (Auth)
- 사용자 관리 (User)
- 앱 레지스트리

## 실행

```bash
# 개발
docker compose up core -d

# 헬스체크
curl http://localhost:3001/api/core/health
```

## 포트

- 3001
