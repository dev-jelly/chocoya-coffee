import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    // 응답 객체 생성
    const response = NextResponse.redirect(new URL('/', requestUrl.origin));
    
    // 서버 클라이언트 생성 - request.cookies는 NextRequest에서 제공하므로 비동기 처리가 필요 없음
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: any) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );
    
    // 소셜 로그인 콜백을 처리하고 세션 교환
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/auth/login?error=callback_error', requestUrl.origin));
    }
    
    // 성공적으로 로그인되면 홈페이지로 리디렉션
    return response;
  }
  
  // 오류가 있다면 로그인 페이지로 리디렉션
  return NextResponse.redirect(new URL('/auth/login?error=no_code', requestUrl.origin));
} 