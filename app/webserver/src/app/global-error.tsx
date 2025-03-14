'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-background">
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
                <button
                  onClick={() => reset()}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  다시 시도
                </button>
                
                <a
                  href="/"
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
                  </svg>
                  홈으로 돌아가기
                </a>
              </div>
            </div>
            
            {isDbError && (
              <div className="text-sm text-gray-500">
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
      </body>
    </html>
  );
} 