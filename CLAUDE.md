# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Virtual Workspace** - A virtual workspace on the internet.

- Users interact via UI or AI agent
- Core Concept: Chat with an employee you manage, and view their computer screen

## Architecture

- **Single Source of Truth** - Business logic in Service layer only
- **Feature Parity** - What works in frontend also works in chat
- **JWT Auth** - Frontend and AI use the same JWT
- **No separate MCP server** - Tool definitions = API specs

## Project Structure

```
/apps/
  /{appName}/           # NestJS backend (file, doc, slide, sheet, gallery, browser, mail, db, chat)
  /ai/                  # Python/FastAPI
  /web/                 # Next.js frontend

/nginx/                 # Reverse proxy config

docker-compose.yml      # Development
docker-compose.prod.yml # Production
```

## Tech Stack

- Backend: NestJS (TypeScript)
- Frontend: Next.js (React)
- AI: Python/FastAPI
- Infra: PostgreSQL, Redis, MinIO

## Commands

```bash
docker compose up -d              # Start all
docker compose up -d <service>    # Start specific
docker compose logs -f <service>  # View logs
```

## Ports

| Service   | Port      |
| --------- | --------- |
| web       | 3000      |
| file~chat | 3001~3009 |
| ai        | 8000      |
| nginx     | 80        |
| postgres  | 5432      |
| redis     | 6379      |
| minio     | 9000      |

## Documentation

- `docs/SPEC.md` - Technical specification
- `docs/SPEC_KR.md` - 기술 명세 (한국어)
