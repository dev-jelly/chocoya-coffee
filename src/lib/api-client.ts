'use client';

import { toast } from '@/components/ui/use-toast';

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// API 요청 옵션 타입 정의
export interface ApiRequestOptions extends RequestInit {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessageOverride?: string | Record<number, string>;
}

/**
 * 모든 API 요청을 처리하는 래퍼 함수
 * 에러 처리 및 토스트 알림을 자동으로 처리합니다.
 */
export async function apiClient<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessageOverride,
    ...fetchOptions
  } = options;

  // 기본 헤더 설정
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // 서버 응답 데이터 파싱
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // 응답 객체 생성
    const result: ApiResponse<T> = {
      success: response.ok,
      status: response.status,
      ...(typeof data === 'object' ? data : { data }),
    };

    // 성공 처리
    if (response.ok) {
      if (showSuccessToast) {
        toast({
          title: '성공',
          description: successMessage || data.message || '요청이 성공적으로 처리되었습니다.',
        });
      }
      return result;
    }

    // 에러 처리
    const errorMessage = 
      typeof errorMessageOverride === 'object' && errorMessageOverride 
        ? errorMessageOverride[response.status] || data.error || data.message || getErrorMessageByStatus(response.status)
        : errorMessageOverride || data.error || data.message || getErrorMessageByStatus(response.status);

    if (showErrorToast) {
      toast({
        title: '오류',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    return result;
  } catch (error: any) {
    // 네트워크 오류 등 예외 처리
    console.error('API 요청 오류:', error);
    
    const result: ApiResponse<T> = {
      success: false,
      error: error.message || '요청 처리 중 오류가 발생했습니다.',
      status: 0,
    };

    if (showErrorToast) {
      toast({
        title: '네트워크 오류',
        description: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
        variant: 'destructive',
      });
    }

    return result;
  }
}

/**
 * HTTP 상태 코드별 기본 에러 메시지 제공
 */
function getErrorMessageByStatus(status: number): string {
  switch (status) {
    case 400:
      return '잘못된 요청입니다.';
    case 401:
      return '인증이 필요합니다. 다시 로그인해주세요.';
    case 403:
      return '접근 권한이 없습니다.';
    case 404:
      return '요청한 리소스를 찾을 수 없습니다.';
    case 409:
      return '요청이 현재 상태와 충돌합니다.';
    case 422:
      return '제공된 데이터가 유효하지 않습니다.';
    case 429:
      return '너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.';
    case 500:
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    case 503:
      return '서비스를 일시적으로 사용할 수 없습니다.';
    default:
      return '알 수 없는 오류가 발생했습니다.';
  }
}

// 특정 HTTP 메서드를 위한 편의 함수들
export const api = {
  get: <T = any>(url: string, options?: ApiRequestOptions) => 
    apiClient<T>(url, { method: 'GET', ...options }),
    
  post: <T = any>(url: string, data?: any, options?: ApiRequestOptions) => 
    apiClient<T>(url, { 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
    
  put: <T = any>(url: string, data?: any, options?: ApiRequestOptions) => 
    apiClient<T>(url, { 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
    
  patch: <T = any>(url: string, data?: any, options?: ApiRequestOptions) => 
    apiClient<T>(url, { 
      method: 'PATCH', 
      body: data ? JSON.stringify(data) : undefined,
      ...options 
    }),
    
  delete: <T = any>(url: string, options?: ApiRequestOptions) => 
    apiClient<T>(url, { method: 'DELETE', ...options }),
}; 