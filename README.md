# 마이리즈 Brand Homepage

커스텀 피규어 브랜드 **마이리즈**의 홈페이지 + 관리자 시스템입니다.

---

## 접속 주소

| 서비스 | 주소 | 설명 |
|--------|------|------|
| 홈페이지 (프론트엔드) | http://localhost:3002 | 고객용 브랜드 홈페이지 |
| 관리자 페이지 | http://localhost:3001 | 콘텐츠 관리자 페이지 |
| 백엔드 API | http://localhost:4001 | REST API 서버 |

### 관리자 로그인

| 항목 | 값 |
|------|----|
| 비밀번호 | `myreez2024` |

> 비밀번호 변경: `docker-compose.dev.yml` 파일의 `ADMIN_PASSWORD` 환경변수를 수정하세요.

---

## 관리자 기능

- **배너 관리** — 메인 히어로 슬라이더 이미지 등록/수정/삭제/순서변경
- **영상 관리** — 고객 후기 영상(MP4) 또는 썸네일 이미지 등록/수정/삭제/순서변경
- **갤러리 관리** — 완성 작품 사진 등록/수정/삭제/순서변경 (정사각형·가로형·세로형 레이아웃)
- **제품 관리** — 제품 라인업 이미지·이름·가격·카테고리·뱃지 등록/수정/삭제/순서변경

---

## 기술 스택

### 프론트엔드 (`apps/frontend`)
| 항목 | 버전/설명 |
|------|-----------|
| Next.js | 15 (App Router, Turbopack) |
| React | 19 |
| Tailwind CSS | v4 |
| TypeScript | 5 |

### 관리자 (`apps/admin`)
| 항목 | 버전/설명 |
|------|-----------|
| Next.js | 15 (App Router, Turbopack) |
| React | 19 |
| Tailwind CSS | v4 |
| TypeScript | 5 |
| lucide-react | 아이콘 |

### 백엔드 (`apps/backend`)
| 항목 | 버전/설명 |
|------|-----------|
| Node.js | 20 |
| Express | 4 |
| TypeScript | 5 |
| tsx | TS 직접 실행 |
| multer | 파일 업로드 (이미지/동영상) |
| 데이터 저장 | JSON 파일 (`apps/backend/data/`) |
| 업로드 파일 | `apps/backend/uploads/` |

### 인프라
| 항목 | 설명 |
|------|------|
| Docker Compose | 개발 환경 컨테이너 오케스트레이션 |
| npm workspaces | 모노레포 패키지 관리 |

---

## 실행 방법

### Docker (권장)

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### 포트 정리

| 컨테이너 | 내부 포트 | 외부 포트 |
|----------|-----------|-----------|
| frontend | 3000 | 3002 |
| admin | 3001 | 3003 → 3001 |
| backend | 4000 | 4001 |

---

## 프로젝트 구조

```
brand-homepage/
├── apps/
│   ├── frontend/          # 홈페이지 (Next.js)
│   ├── admin/             # 관리자 페이지 (Next.js)
│   └── backend/           # API 서버 (Express)
│       ├── data/          # JSON 데이터 파일
│       └── uploads/       # 업로드된 파일
├── docker-compose.dev.yml
└── package.json
```
