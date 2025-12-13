# Technical Specification

## Core Principles

```
                    Backend Services
                   (Business Logic)
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       Unified API              Tool Definition
       Endpoints                 (= API Spec)
             │
  ┌──────────┴──────────┐
  ▼                     ▼
Frontend             AI Agent
```

- **App Independence** - Each app is fully independent (API-only communication)
- **Single Source of Truth** - Business logic in Service layer only
- **Feature Parity** - What works in frontend also works in chat
- **JWT Auth** - Same authentication for frontend and AI agent
- **No separate MCP server** - Tool definitions = API specs

---

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              Presentation Layer                 │
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
│   (Business Logic - Single Source of Truth)    │
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

| Layer          | Responsibility                     |
| -------------- | ---------------------------------- |
| Presentation   | UI rendering, user interaction     |
| API            | Request handling, validation, auth |
| Service        | Business logic, orchestration      |
| Data           | Data access, caching, file storage |
| Infrastructure | Databases, object storage, cache   |

---

## API Design

### Endpoint Pattern

```
POST   /api/{app}           # create
GET    /api/{app}           # findAll
GET    /api/{app}/:id       # findOne
PUT    /api/{app}/:id       # update
DELETE /api/{app}/:id       # remove
```

### Tool Definition Pattern

```json
{
  "name": "{app}.{action}",
  "description": "...",
  "endpoint": "POST /api/{app}",
  "parameters": { ... }
}
```

Tool definitions are auto-generated from API specs.

---

## Chat App

Chat operates in **two modes**:

1. **Sidebar/Widget Mode** - Accessible from any app (right sidebar or floating button)
   - Use AI while working in doc, sheet, slide, etc.
   - Context-aware assistance within current app

2. **Standalone Mode** - Independent full app
   - Command-only usage without viewing other apps
   - Direct conversation interface

### Cross-App Control via Chat

```
User (Presentation) → Chat → AI App (Service Layer)
                                    ↓
                              API calls to other apps
                                    ↓
                        file / doc / sheet / slide / ...
```

User can control all apps through chat without directly opening them.

### Mobile Strategy

1. **Phase 1**: Chat mobile app (command-based control)
2. **Phase 2**: Expand to other apps as needed

---

## AI Agent Flow

```
User: "Create Q3 draft based on Q1 and Q2 files"
    ↓
Chat App → AI App (Claude/GPT/Gemini)
    ↓
AI Agent generates Tool Calls:
  1. file.search("Q1") → Q1.xlsx
  2. sheet.read(Q1.xlsx)
  3. doc.create("Q3_draft.docx")
    ↓
Tool Call → HTTP (same JWT)
    ↓
User screen: Q3_draft.docx opens
```

---

## LLM Router

**Providers:** OpenAI, Anthropic, Google, xAI, Custom HTTP

**Model Selection Priority:**

1. Request explicit
2. Chat room setting
3. User preference
4. Tenant default
5. Global default

---

## Filesystem

```
/users/{userId}/          # Personal Space
/spaces/{spaceId}/        # Shared Space
```

**Permissions:** owner (full) / editor (read/write) / viewer (read)
