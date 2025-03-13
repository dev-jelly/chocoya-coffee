import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * Next.js 15 이상에서 비동기 cookies API를 사용하기 위한 서버 클라이언트 생성 함수
 * @returns Supabase 클라이언트 인스턴스
 */
export async function createClient() {
  try {
    const cookieStore = await cookies();
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set({ name, value, ...options });
              });
            } catch (error) {
              // 서버 컴포넌트에서 호출 시 cookies는 읽기 전용이라 에러가 발생할 수 있음
              // 미들웨어에서 쿠키 갱신이 처리되므로 이 오류는 무시 가능
              console.warn('Warning: Failed to set cookies in a Server Component.', error);
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
          getAll: () => [],
          setAll: () => {}
        }
      }
    );
  }
} 