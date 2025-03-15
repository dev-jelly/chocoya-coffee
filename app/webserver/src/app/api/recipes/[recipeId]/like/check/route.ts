import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase-server';

// 좋아요 상태 확인 API
export async function GET(
    request: Request,
    context: any
) {
    try {
        // Supabase 클라이언트 생성
        const supabase = await createClient();

        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.id) {
            return NextResponse.json({ isLiked: false });
        }

        // recipeId 가져오기
        const recipeId = context.params.recipeId;
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