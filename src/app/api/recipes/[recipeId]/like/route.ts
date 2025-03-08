import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 좋아요 토글 API
export async function POST(
    request: Request,
    { params }: { params: Promise<{ recipeId: string }> | { recipeId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        // params를 await 처리
        const resolvedParams = params instanceof Promise ? await params : params;
        const recipeId = resolvedParams.recipeId;
        const userId = session.user.id;

        // 레시피가 존재하는지 확인
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
        });

        if (!recipe) {
            return NextResponse.json(
                { error: '레시피를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 이미 좋아요를 눌렀는지 확인
        const existingLike = await prisma.recipeLike.findUnique({
            where: {
                userId_recipeId: {
                    userId,
                    recipeId,
                },
            },
        });

        let isLiked;

        if (existingLike) {
            // 좋아요 제거
            await prisma.recipeLike.delete({
                where: {
                    userId_recipeId: {
                        userId,
                        recipeId,
                    },
                },
            });

            isLiked = false;
        } else {
            // 좋아요 추가
            await prisma.recipeLike.create({
                data: {
                    userId,
                    recipeId,
                },
            });

            isLiked = true;
        }

        return NextResponse.json({ success: true, isLiked });
    } catch (error: any) {
        console.error('좋아요 처리 중 오류:', error);
        return NextResponse.json(
            { error: '좋아요 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

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