# Virtual Workspace

인터넷에 존재하는 가상 워크스페이스. UI로 직접 조작하거나 AI 에이전트를 통해 작업 수행.

**핵심 컨셉:** 내가 관리하는 직원과 채팅하고, 그 직원의 컴퓨터 화면을 보는 느낌

[English](README.md)

## 앱

| 앱        | 설명                  |
| --------- | --------------------- |
| `file`    | 파일시스템 관리       |
| `doc`     | 문서 편집기           |
| `slide`   | 프레젠테이션          |
| `sheet`   | 스프레드시트          |
| `gallery` | 이미지/영상 뷰어      |
| `browser` | 웹 브라우징, 검색     |
| `mail`    | 이메일                |
| `db`      | 데이터베이스 뷰어     |
| `chat`    | 채팅 UI + AI 에이전트 |
| `ai`      | LLM 라우팅            |

## 빠른 시작

```bash
git clone https://github.com/your-repo/virtual-workspace.git
cd virtual-workspace
cp .env.example .env
# .env 파일 설정
docker compose up -d
```

http://localhost 접속

## 문서

- [기술 명세](docs/SPEC_KR.md)
