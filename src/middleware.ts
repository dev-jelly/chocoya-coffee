import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증이 필요한 경로 목록
const protectedRoutes = [
  '/profile',
  '/auth/profile',
  '/recipes/create',
  '/recipes/my',
  '/beans/create',
  '/taste-notes/create',
  '/admin'
];

// 이미 인증된 사용자가 접근할 수 없는 경로 (예: 로그인 페이지)
const authRoutes = [
  '/auth/login',
  '/auth/register'
];

// 데이터베이스 연결 오류 시 리다이렉트하지 않을 경로
const allowedErrorPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/recipes',
  '/beans',
  '/brewing-guide',
  '/taste-notes',
  '/error'
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map(cookie => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set({
                name,
                value,
                ...options,
              });
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              });
              response.cookies.set({
                name,
                value,
                ...options,
              });
            });
          }
        },
      }
    );

    // 사용자 인증 확인 (보안 권장사항에 따라 getUser() 사용)
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    // 보호된 경로에 인증되지 않은 사용자가 접근할 때
    if (
      protectedRoutes.some(route => pathname.startsWith(route)) &&
      !user
    ) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // 인증 경로에 이미 인증된 사용자가 접근할 때
    if (
      authRoutes.some(route => pathname.startsWith(route)) &&
      user
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 관리자 페이지 접근 권한 확인
    if (pathname.startsWith('/admin')) {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chocoya.coffee';
      
      if (!user || user.email !== adminEmail) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return response;
  } catch (error) {
    console.error('미들웨어 오류:', error);
    
    // 현재 경로가 허용된 오류 경로인 경우 리다이렉트하지 않음
    const pathname = request.nextUrl.pathname;
    if (allowedErrorPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
      return NextResponse.next();
    }
    
    // 오류 페이지로 리다이렉트 (필요한 경우)
    // return NextResponse.redirect(new URL('/error', request.url));
    
    // 오류가 발생해도 계속 진행 (대부분의 경우 이 방식이 더 나음)
    return NextResponse.next();
  }
}

// 미들웨어 적용 경로
export const config = {
  matcher: [
    /*
     * 인증이 필요한 경로
     * /auth/:path 경로와 일치하는 모든 경로
     * /profile, /admin으로 시작하는 모든 경로
     * /recipes/create, /recipes/my로 시작하는 모든 경로
     * /beans/create로 시작하는 모든 경로
     * /taste-notes/create로 시작하는 모든 경로
     */
    '/profile/:path*',
    '/auth/:path*',
    '/admin/:path*',
    '/recipes/create/:path*',
    '/recipes/my/:path*',
    '/beans/create/:path*',
    '/taste-notes/create/:path*',
  ],
}; 