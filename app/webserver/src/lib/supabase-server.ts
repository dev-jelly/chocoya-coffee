import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Next.js 15 이상에서 비동기 cookies API를 사용하기 위한 서버 클라이언트 생성 함수
 * @returns Supabase 클라이언트 인스턴스
 */
export async function createClient() {
  try {
    // 정적 렌더링 중에는 cookies() 호출이 실패할 수 있음
    let cookieStore;
    try {
      cookieStore = await cookies();
    } catch (error) {
      // 정적 렌더링 중 cookies() 호출 실패 시 빈 쿠키 스토어 사용
      console.warn('정적 렌더링 중 cookies() 호출 실패:', error);
      return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
          cookies: {
            get(name) {
              return '';
            },
            set(name, value, options) { },
            remove(name, options) { }
          }
        }
      );
    }

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          async get(name) {
            const cookie = await cookieStore.get(name);
            return cookie?.value;
          },
          set(name, value, options) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // 서버 컴포넌트에서 호출 시 cookies는 읽기 전용이라 에러가 발생할 수 있음
              console.warn('Warning: Failed to set cookie in a Server Component.', error);
            }
          },
          remove(name, options) {
            try {
              cookieStore.delete({ name, ...options });
            } catch (error) {
              console.warn('Warning: Failed to remove cookie in a Server Component.', error);
            }
          }
        }
      }
    );
  } catch (error) {
    console.error('Supabase 클라이언트 생성 오류:', error);
    // 기본 클라이언트 반환 (제한된 기능으로 작동)
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name) {
            return '';
          },
          set(name, value, options) { },
          remove(name, options) { }
        }
      }
    );
  }
} 