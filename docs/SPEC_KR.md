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

- **앱 독립성** - 각 앱은 완전히 독립적 (API로만 통신)
- **Single Source of Truth** - 비즈니스 로직은 Service 레이어에만
- **Feature Parity** - 프론트에서 되는 건 채팅에서도 된다
- **JWT 인증** - 프론트엔드와 AI가 동일한 인증 사용
- **별도 MCP 서버 없음** - Tool 정의 = API 스펙

---

## 아키텍처 레이어

```
┌─────────────────────────────────────────────────┐
│            Presentation Layer                   │
│         (web, chat widget, mobile)              │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                 API Layer                       │
│           (REST endpoints, JWT)                 │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│               Service Layer                     │
│    (비즈니스 로직 - Single Source of Truth)     │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│                 Data Layer                      │
│         (Repository, ORM, Storage)              │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│            Infrastructure Layer                 │
│       (PostgreSQL, Redis, MinIO)                │
└─────────────────────────────────────────────────┘
```

| 레이어 | 책임 |
|-------|------|
| Presentation | UI 렌더링, 사용자 상호작용 |
| API | 요청 처리, 유효성 검사, 인증 |
| Service | 비즈니스 로직, 오케스트레이션 |
| Data | 데이터 접근, 캐싱, 파일 저장 |
| Infrastructure | DB, 오브젝트 스토리지, 캐시 |

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

## Chat 앱

Chat은 **두 가지 모드**로 동작:

1. **사이드바/위젯 모드** - 어느 앱에서든 접근 가능 (우측 사이드바 또는 플로팅 버튼)
   - doc, sheet, slide 등에서 작업하면서 AI 사용
   - 현재 앱 컨텍스트를 인식한 지원

2. **독립 모드** - 독립적인 전체 앱
   - 다른 앱 화면 없이 명령만으로 사용
   - 직접 대화 인터페이스

### Chat을 통한 앱 간 제어

```
유저 (Presentation) → Chat → AI App (Service Layer)
                                    ↓
                              다른 앱에 API 호출
                                    ↓
                        file / doc / sheet / slide / ...
```

유저는 다른 앱을 직접 열지 않고도 채팅으로 모든 앱을 제어할 수 있음.

### 모바일 전략

1. **Phase 1**: Chat 모바일 앱 (명령 기반 제어)
2. **Phase 2**: 필요에 따라 다른 앱들로 확장

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
