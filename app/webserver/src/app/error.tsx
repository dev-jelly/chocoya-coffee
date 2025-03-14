'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 오류 로깅
    console.error('애플리케이션 오류:', error);
  }, [error]);

  // 오류 메시지 처리
  let errorMessage = '알 수 없는 오류가 발생했습니다.';
  let isDbError = false;

  if (error.message) {
    if (
      error.message.includes('데이터베이스') ||
      error.message.includes('database') ||
      error.message.includes('P5010') ||
      error.message.includes('connection')
    ) {
      isDbError = true;
      errorMessage = '데이터베이스 연결 오류가 발생했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.';
    } else {
      errorMessage = error.message;
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="max-w-md">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            {isDbError ? '데이터베이스 연결 오류' : '오류가 발생했습니다'}
          </h1>
          <p className="text-red-600 mb-6">{errorMessage}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => reset()}
              className="flex items-center justify-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              다시 시도
            </Button>
            
            <Button asChild variant="default">
              <Link href="/" className="flex items-center justify-center">
                <Home className="mr-2 h-4 w-4" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
        
        {isDbError && (
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">다음 방법을 시도해 보세요:</p>
            <ul className="list-disc text-left pl-5 space-y-1">
              <li>인터넷 연결 상태를 확인하세요.</li>
              <li>브라우저를 새로고침하거나 잠시 후 다시 시도하세요.</li>
              <li>문제가 지속되면 관리자에게 문의하세요.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 