import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// 좋아요 상태 확인 API
export async function GET(
    request: Request,
    { params }: { params: Promise<{ recipeId: string }> | { recipeId: string } }
) {
    try {
        // Supabase 클라이언트 생성
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            {
                cookies: {
                    get(name: string) {
                        const cookie = cookieStore.get(name);
                        return cookie?.value;
                    },
                    set(name: string, value: string, options: any) {
                        // API 라우트에서는 쿠키를 설정할 필요가 없음
                    },
                    remove(name: string, options: any) {
                        // API 라우트에서는 쿠키를 제거할 필요가 없음
                    },
                },
            }
        );
        
        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.id) {
            return NextResponse.json({ isLiked: false });
        }

        // params를 await 처리
        const resolvedParams = params instanceof Promise ? await params : params;
        const recipeId = resolvedParams.recipeId;
        const userId = user.id;

        // 좋아요 여부 확인
        const like = await prisma.recipeLike.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });

        return NextResponse.json({ isLiked: !!like });
    } catch (error: any) {
        console.error('좋아요 상태 확인 중 오류:', error);
        return NextResponse.json(
            { error: '좋아요 상태 확인 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 