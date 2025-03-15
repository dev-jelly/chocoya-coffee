import { NextRequest, NextResponse } from 'next/server';
import { seedGrinders, deleteAllGrinders } from '@/lib/actions/grinder';
import { prisma } from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        // 개발 환경에서는 인증 검사 우회 (NEXT_PUBLIC_SKIP_AUTH=true 환경변수 추가 필요)
        const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' || process.env.NODE_ENV === 'development';

        if (!skipAuth) {
            // Supabase 클라이언트 생성
            const cookieStore = await cookies();
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL || '',
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
                {
                    cookies: {
                        async get(name: string) {
                            const cookie = await cookieStore.get(name);
                            return cookie?.value;
                        },
                        set() { },
                        remove() { },
                    },
                }
            );

            // 사용자 정보 가져오기
            const { data: { user } } = await supabase.auth.getUser();

            if (!user?.email) {
                return NextResponse.json(
                    { error: '인증이 필요합니다.' },
                    { status: 401 }
                );
            }

            // 관리자 이메일 확인 (실제 구현 시 관리자 역할이 있는지 확인)
            // 여기서는 간단히 처리
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            if (user.email !== adminEmail) {
                return NextResponse.json(
                    { error: '관리자 권한이 필요합니다.' },
                    { status: 403 }
                );
            }
        }

        // URL 쿼리 파라미터에서 force 값을 가져옵니다
        const force = request.nextUrl.searchParams.get('force') === 'true';

        // 이미 그라인더 데이터가 있는지 확인
        const existingGrinders = await prisma.grinder.count();

        if (existingGrinders > 0 && !force) {
            return NextResponse.json(
                { message: '그라인더 데이터가 이미 존재합니다. 강제 업데이트하려면 ?force=true 파라미터를 사용하세요.', count: existingGrinders },
                { status: 200 }
            );
        }

        // 강제 업데이트가 설정되었고 데이터가 있는 경우
        if (force && existingGrinders > 0) {
            // 기존 데이터 삭제
            await deleteAllGrinders();
        }

        // 그라인더 데이터 시드 실행
        const result = await seedGrinders();

        if (result.success) {
            return NextResponse.json(
                { message: result.message, force },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error seeding grinder data:', error);
        return NextResponse.json(
            { error: '그라인더 데이터 시드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 