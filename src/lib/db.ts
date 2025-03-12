import { PrismaClient } from '@prisma/client/edge';

// PrismaClient 인스턴스가 개발 환경에서 여러번 생성되는 것을 방지
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// prisma 클라이언트 생성 함수
function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    // 연결 풀링 설정
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// 클라이언트가 이미 존재하면 재사용, 없으면 새로 생성
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// 개발 환경이 아닌 경우 글로벌 객체에 할당하지 않음
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma; 