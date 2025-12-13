# 기술 명세

## 핵심 원칙

```
                   Backend Services
                    (비즈니스 로직)
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       Unified API              Tool 정의
       Endpoints               (= API 스펙)
             │
  ┌──────────┴──────────┐
  ▼                     ▼
Frontend             AI Agent
```

- **Single Source of Truth** - 비즈니스 로직은 Service 레이어에만
- **Feature Parity** - 프론트에서 되는 건 채팅에서도 된다
- **JWT 인증** - 프론트엔드와 AI가 동일한 인증 사용
- **별도 MCP 서버 없음** - Tool 정의 = API 스펙

---

## API 설계

### 엔드포인트 패턴
```
POST   /api/{app}           # create
GET    /api/{app}           # findAll
GET    /api/{app}/:id       # findOne
PUT    /api/{app}/:id       # update
DELETE /api/{app}/:id       # remove
```

### Tool 정의 패턴
```json
{
  "name": "{app}.{action}",
  "description": "...",
  "endpoint": "POST /api/{app}",
  "parameters": { ... }
}
```

Tool 정의는 API 스펙에서 자동 생성.

---

## AI 에이전트 플로우

```
유저: "1분기 2분기 파일 기반으로 3분기 초안 만들어줘"
    ↓
Chat App → AI App (Claude/GPT/Gemini)
    ↓
AI Agent가 Tool Call 생성:
  1. file.search("1분기") → Q1.xlsx
  2. sheet.read(Q1.xlsx)
  3. doc.create("Q3_draft.docx")
    ↓
Tool Call → HTTP (동일 JWT)
    ↓
유저 화면: Q3_draft.docx 열림
```

---

## LLM Router

**Providers:** OpenAI, Anthropic, Google, xAI, Custom HTTP

**모델 선택 우선순위:**
1. 요청에서 명시
2. 채팅방 설정
3. 유저 선호
4. 테넌트 기본값
5. 글로벌 기본값

---

## 파일시스템

```
/users/{userId}/          # 개인 공간
/spaces/{spaceId}/        # 공유 공간
```

**권한:** owner (전체) / editor (읽기/쓰기) / viewer (읽기)
