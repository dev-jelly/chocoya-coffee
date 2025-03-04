# 초코야 커피 (Chocoya Coffee)

커피 레시피를 기록하고 공유하는 웹 애플리케이션입니다.

## 기능

- 사용자 인증 (이메일, OAuth)
- 레시피 등록 및 공유
- 레시피 추천 및 댓글
- 브루잉 레시피 상세 기록 (시간, 물 양, 분쇄도, 물 온도 등)
- SCA 기준 맛 평가 및 기록
- 맛 노트 등록

## 기술 스택

- **프론트엔드**: Next.js, React, TypeScript
- **백엔드**: Next.js API Routes
- **데이터베이스**: 
  - 개발: SQLite
  - 프로덕션: PostgreSQL
- **ORM**: Prisma
- **인증**: NextAuth.js
- **상태 관리**: Zustand
- **데이터 검증**: Zod
- **스타일링**: Tailwind CSS, shadcn/ui
- **배포**: Vercel

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- npm 또는 pnpm

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/chocoya-coffee.git
cd chocoya-coffee

# 의존성 설치
npm install
# 또는
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 필요한 환경 변수 설정

# 개발 서버 실행
npm run dev
# 또는
pnpm dev
```

### 데이터베이스 설정

```bash
# Prisma 마이그레이션 실행
npx prisma migrate dev
# 또는
pnpm prisma migrate dev

# 개발용 데이터 시드 (선택 사항)
npx prisma db seed
# 또는
pnpm prisma db seed
```

## 프로젝트 구조

```
chocoya-coffee/
├── prisma/               # Prisma 스키마 및 마이그레이션
├── public/               # 정적 파일
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 라우트
│   │   ├── auth/         # 인증 관련 페이지
│   │   ├── recipes/      # 레시피 관련 페이지
│   │   └── ...
│   ├── components/       # React 컴포넌트
│   │   ├── auth/         # 인증 관련 컴포넌트
│   │   ├── layout/       # 레이아웃 컴포넌트
│   │   ├── recipes/      # 레시피 관련 컴포넌트
│   │   └── ui/           # UI 컴포넌트 (shadcn/ui)
│   ├── lib/              # 유틸리티 및 헬퍼 함수
│   │   ├── auth/         # 인증 관련 유틸리티
│   │   ├── db/           # 데이터베이스 관련 유틸리티
│   │   ├── store/        # Zustand 스토어
│   │   └── validations/  # Zod 스키마
│   └── ...
└── ...
```

## 라이선스

MIT
