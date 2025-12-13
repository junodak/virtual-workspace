# Virtual Workspace

A virtual workspace on the internet. Users can interact with apps directly via UI or through an AI agent.

**Core Concept:** Chat with an employee you manage, and view their computer screen

[한국어](README_KR.md)

## Apps

| App       | Description           |
| --------- | --------------------- |
| `file`    | Filesystem management |
| `doc`     | Document editor       |
| `slide`   | Presentation          |
| `sheet`   | Spreadsheet           |
| `gallery` | Image/Video viewer    |
| `browser` | Web browsing, search  |
| `mail`    | Email                 |
| `db`      | Database viewer       |
| `chat`    | Chat UI + AI agent    |
| `ai`      | LLM routing           |

## Quick Start

```bash
git clone https://github.com/your-repo/virtual-workspace.git
cd virtual-workspace
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

Open http://localhost

## Documentation

- [Technical Specification](docs/SPEC.md)
