import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

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

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
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
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 사용자 세션 확인
  const { data: { session } } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // 보호된 경로에 인증되지 않은 사용자가 접근할 때
  if (
    protectedRoutes.some(route => pathname.startsWith(route)) &&
    !session
  ) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 인증 경로에 이미 인증된 사용자가 접근할 때
  if (
    authRoutes.some(route => pathname.startsWith(route)) &&
    session
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 관리자 페이지 접근 권한 확인
  if (pathname.startsWith('/admin')) {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chocoya.coffee';
    
    if (!session || session.user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
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