import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 좋아요 상태 확인 API
export async function GET(
    request: Request,
    { params }: { params: Promise<{ recipeId: string }> | { recipeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ isLiked: false });
        }

        // params를 await 처리
        const resolvedParams = params instanceof Promise ? await params : params;
        const recipeId = resolvedParams.recipeId;
        const userId = session.user.id;

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