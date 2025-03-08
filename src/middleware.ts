import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 인증이 필요한 경로 목록
const authRequiredPaths = [
  '/recipes/create',
  '/recipes/edit',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // 인증이 필요한 경로에 접근하는 경우
  if (
    authRequiredPaths.some(path => pathname.startsWith(path)) ||
    pathname.match(/\/recipes\/[^/]+\/edit/)
  ) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!token) {
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: [
    '/recipes/create',
    '/recipes/:id/edit',
  ],
}; 