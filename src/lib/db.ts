// Prisma 클라이언트 타입 에러를 해결하기 위해 타입 오류 무시
// @ts-ignore
import { PrismaClient } from '@prisma/client';

// PrismaClient 인스턴스가 개발 환경에서 여러번 생성되는 것을 방지
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  isConnected: boolean;
  connectionError: string | null;
};

// 데이터베이스 연결 상태 관리
if (!globalForPrisma.isConnected) {
  globalForPrisma.isConnected = false;
  globalForPrisma.connectionError = null;
}

// prisma 클라이언트 생성 함수
function createPrismaClient(): PrismaClient {
  // 환경 변수에서 데이터베이스 URL 가져오기
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  
  // 연결 설정
  const connectionConfig: any = {
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  };
  
  // 데이터소스 설정 (URL이 있는 경우에만)
  if (databaseUrl) {
    connectionConfig.datasources = {
      db: {
        url: databaseUrl,
      },
    };
  }
  
  return new PrismaClient(connectionConfig);
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
    // 이미 연결 상태를 확인한 경우 캐시된 결과 반환
    if (globalForPrisma.isConnected) {
      return { connected: true, error: null };
    }
    
    if (globalForPrisma.connectionError) {
      return { connected: false, error: globalForPrisma.connectionError };
    }
    
    // 간단한 쿼리로 연결 확인 (raw SQL 대신 Prisma API 사용)
    await prisma.user.findFirst({
      select: { id: true },
      take: 1
    });
    
    // 연결 성공 시 상태 업데이트
    globalForPrisma.isConnected = true;
    globalForPrisma.connectionError = null;
    
    return { connected: true, error: null };
  } catch (error) {
    console.error('Database connection error:', error);
    
    // 오류 메시지 개선
    let errorMessage = '데이터베이스 연결 오류';
    if (error instanceof Error) {
      if (error.message.includes('P5010') || error.message.includes('fetch failed')) {
        errorMessage = '데이터베이스 서버에 연결할 수 없습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('timeout')) {
        errorMessage = '데이터베이스 연결 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('authentication')) {
        errorMessage = '데이터베이스 인증에 실패했습니다. 관리자에게 문의하세요.';
      }
    }
    
    // 연결 실패 시 상태 업데이트
    globalForPrisma.isConnected = false;
    globalForPrisma.connectionError = errorMessage;
    
    return { 
      connected: false, 
      error: errorMessage
    };
  }
}

// 데이터베이스 작업 래퍼 함수 (오류 처리 포함)
export async function withDatabase<T>(
  operation: () => Promise<T>,
  fallback: T,
  errorHandler?: (error: any) => void
): Promise<T> {
  try {
    // 데이터베이스 연결 확인
    const connection = await checkDatabaseConnection();
    if (!connection.connected) {
      if (errorHandler) {
        errorHandler(new Error(connection.error || '데이터베이스 연결 오류'));
      }
      return fallback;
    }
    
    // 데이터베이스 작업 수행
    return await operation();
  } catch (error) {
    console.error('Database operation error:', error);
    if (errorHandler) {
      errorHandler(error);
    }
    return fallback;
  }
}

export default prisma; 