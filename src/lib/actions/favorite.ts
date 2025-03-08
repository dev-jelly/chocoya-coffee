import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// 사용자의 즐겨찾기 레시피 목록 가져오기
export async function getFavoriteRecipesByUser(userId: string) {
    try {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId: userId,
            },
            include: {
                recipe: {
                    include: {
                        ingredients: true,
                        steps: {
                            orderBy: {
                                order: 'asc',
                            },
                        },
                        brewingTips: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // 레시피 객체 배열로 변환
        return favorites.map(favorite => favorite.recipe);
    } catch (error) {
        console.error('즐겨찾기 레시피 조회 오류:', error);
        return [];
    }
}

// 레시피 즐겨찾기 추가
export async function addFavorite(userId: string, recipeId: string) {
    try {
        const favorite = await prisma.favorite.create({
            data: {
                userId,
                recipeId,
            },
        });

        revalidatePath('/auth/profile');
        revalidatePath(`/recipes/${recipeId}`);

        return { success: true };
    } catch (error) {
        console.error('즐겨찾기 추가 오류:', error);
        return { success: false, error: '즐겨찾기 추가 중 오류가 발생했습니다.' };
    }
}

// 레시피 즐겨찾기 제거
export async function removeFavorite(userId: string, recipeId: string) {
    try {
        await prisma.favorite.delete({
            where: {
                recipeId_userId: {
                    userId,
                    recipeId,
                },
            },
        });

        revalidatePath('/auth/profile');
        revalidatePath(`/recipes/${recipeId}`);

        return { success: true };
    } catch (error) {
        console.error('즐겨찾기 제거 오류:', error);
        return { success: false, error: '즐겨찾기 제거 중 오류가 발생했습니다.' };
    }
}

// 즐겨찾기 상태 확인
export async function checkFavorite(userId: string, recipeId: string) {
    try {
        const favorite = await prisma.favorite.findUnique({
            where: {
                recipeId_userId: {
                    userId,
                    recipeId,
                },
            },
        });

        return !!favorite;
    } catch (error) {
        console.error('즐겨찾기 상태 확인 오류:', error);
        return false;
    }
} 