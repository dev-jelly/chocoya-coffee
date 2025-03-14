import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase-server';
import { ArrowLeft, Coffee, Lock, Eye, Pencil, Trash2 } from 'lucide-react';
import { DeleteRecipeButton } from '@/components/recipe/delete-recipe-button';

export const metadata = {
    title: '내 레시피 | 초코야 커피',
    description: '내가 작성한 모든 레시피',
};

export default async function UserRecipesPage() {
    // Supabase 클라이언트 생성 및 사용자 정보 가져오기
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        redirect('/auth/login?callbackUrl=/profile/recipes');
    }

    // 사용자의 모든 레시피 가져오기
    const recipes = await prisma.recipe.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div className="container mx-auto py-10 px-4">
            <Link href="/profile" className="inline-flex items-center text-primary hover:underline mb-6">
                <ArrowLeft className="mr-2" size={16} />
                프로필로 돌아가기
            </Link>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">내 레시피</h1>
                <Link
                    href="/recipes/create"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    새 레시피 작성
                </Link>
            </div>

            {recipes.length === 0 ? (
                <div className="bg-card border rounded-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4">작성한 레시피가 없습니다</h2>
                    <p className="text-muted-foreground mb-6">
                        나만의 커피 레시피를 작성하고 기록해보세요.
                    </p>
                    <Link
                        href="/recipes/create"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        첫 레시피 작성하기
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="bg-card border rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold line-clamp-1">{recipe.title}</h2>
                                    {!recipe.isPublic && (
                                        <div className="flex items-center text-muted-foreground text-xs px-2 py-1 bg-secondary rounded-full">
                                            <Lock size={12} className="mr-1" />
                                            비공개
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                    <Coffee size={14} className="mr-1" />
                                    {recipe.brewingMethod}
                                    <span className="mx-2">•</span>
                                    {recipe.preparationTime}
                                </div>

                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {recipe.description || '설명 없음'}
                                </p>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <Link
                                        href={`/recipes/${recipe.id}`}
                                        className="inline-flex items-center text-primary text-sm hover:underline"
                                    >
                                        <Eye size={14} className="mr-1" />
                                        자세히 보기
                                    </Link>

                                    <div className="flex space-x-2">
                                        <Link
                                            href={`/recipes/${recipe.id}/edit`}
                                            className="p-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                                        >
                                            <Pencil size={14} />
                                        </Link>
                                        <form action={async () => {
                                            'use server';
                                            await prisma.recipe.delete({
                                                where: { id: recipe.id },
                                            });
                                        }}>
                                            <DeleteRecipeButton recipeId={recipe.id} />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 