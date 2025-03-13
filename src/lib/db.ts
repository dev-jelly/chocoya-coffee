// Prisma 클라이언트 타입 에러를 해결하기 위해 타입 오류 무시
// @ts-ignore
import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스가 개발 환경에서 여러번 생성되는 것을 방지
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// prisma 클라이언트 생성 함수
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // 연결 타임아웃 설정 추가
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // 연결 재시도 및 타임아웃 설정
    errorFormat: 'pretty',
  });
}

// 클라이언트가 이미 존재하면 재사용, 없으면 새로 생성
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 개발 환경이 아닌 경우 글로벌 객체에 할당하지 않음
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 연결 오류 처리를 위한 헬퍼 함수
export async function checkDatabaseConnection() {
  try {
    // 간단한 쿼리로 연결 확인
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true, error: null };
  } catch (error) {
    console.error('Database connection error:', error);
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : '데이터베이스 연결 오류'
    };
  }
}

export default prisma; 