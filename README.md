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

이 프로젝트는 Supabase PostgreSQL 데이터베이스를 사용합니다. 

#### 1. Supabase 설정 (프로덕션 또는 공유 개발 환경용)

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 대시보드에서 `Settings` > `Database` 메뉴로 이동하여 PostgreSQL 연결 정보를 확인합니다.
3. `.env` 파일을 생성하고 다음 환경 변수를 설정합니다:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
   ```

#### 2. 로컬 개발 환경 설정

1. `.env` 파일에 다음 환경 변수를 설정합니다:
   ```
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   NEXTAUTH_SECRET="랜덤_문자열"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. 의존성 설치 및 Prisma 생성:
   ```bash
   pnpm install
   npx prisma generate
   ```

3. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

4. 데이터베이스 마이그레이션 및 시드:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

## Prisma 마이그레이션 가이드

Prisma를 사용한 데이터베이스 마이그레이션은 스키마 변경 사항을 추적하고 적용하는 과정입니다. 아래는 주요 마이그레이션 명령어와 사용 방법입니다.

### 1. 새 마이그레이션 생성 및 적용

스키마를 변경한 후에는 마이그레이션을 생성하고 적용해야 합니다:

```bash
# 새 마이그레이션 생성
npx prisma migrate dev --name 마이그레이션_이름
# 예: npx prisma migrate dev --name add_recipe_model
```

이 명령어는:
- 새 마이그레이션 파일을 생성합니다 (`prisma/migrations` 폴더에 저장)
- 로컬 개발 데이터베이스에 변경 사항을 적용합니다
- Prisma 클라이언트를 재생성합니다

### 2. 데이터베이스 초기화 (개발 환경에서만 사용)

모든 데이터를 삭제하고 처음부터 다시 시작하려면:

```bash
# 주의: 모든 데이터가 삭제됩니다!
npx prisma migrate reset
```

이 명령어는:
- 데이터베이스를 삭제하고 다시 생성합니다
- 모든 마이그레이션을 처음부터 적용합니다
- 시드 스크립트를 실행합니다 (있는 경우)

### 3. 데이터베이스 상태 확인

현재 데이터베이스의 상태를 확인하려면:

```bash
npx prisma migrate status
```

### 4. 프로덕션 환경에서의 마이그레이션

프로덕션 환경에서는 다음 명령어를 사용합니다:

```bash
npx prisma migrate deploy
```

이 명령어는:
- 아직 적용되지 않은 마이그레이션만 적용합니다
- 데이터베이스 스키마와 Prisma 스키마의 일관성을 유지합니다
- 새 마이그레이션을 생성하지 않습니다

### 5. 스키마 변경 없이 Prisma 클라이언트 업데이트

Prisma 클라이언트만 업데이트하려면:

```bash
npx prisma generate
```

### 6. 데이터베이스 시각화 및 관리

Prisma Studio를 사용하여 데이터베이스를 시각적으로 관리할 수 있습니다:

```bash
npx prisma studio
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
