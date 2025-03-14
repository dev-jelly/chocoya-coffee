import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 좋아요 수 조회 API
export async function GET(
    request: Request,
    context: any
) {
    try {
        // recipeId 가져오기
        const recipeId = context.params.recipeId;

        // 좋아요 수 카운트
        const count = await prisma.recipeLike.count({
            where: {
                recipeId,
            },
        });

        return NextResponse.json({ count });
    } catch (error: any) {
        console.error('좋아요 수 조회 중 오류:', error);
        return NextResponse.json(
            { error: '좋아요 수 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 