import { PrismaClient } from '@prisma/client';

// PrismaClient는 전역 변수로 선언하여 핫 리로딩 시 여러 인스턴스가 생성되는 것을 방지
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma; 