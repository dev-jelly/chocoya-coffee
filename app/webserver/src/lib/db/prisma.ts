// 런타임에서 직접 환경 변수 설정하여 Data Proxy 사용 안함 강제
process.env.PRISMA_CLIENT_ENGINE_TYPE = 'binary';

// @ts-ignore - 타입 오류 무시
import { PrismaClient } from '@prisma/client';

// 전역 변수 설정으로 핫 리로딩 시 여러 인스턴스 생성 방지
const globalForPrisma = global as unknown as { prisma: any };

// 개발 환경에서는 전역 변수를 사용하고, 프로덕션 환경에서는 새 인스턴스 생성
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 개발 환경에서만 전역 변수에 할당
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 