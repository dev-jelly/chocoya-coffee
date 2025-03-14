import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Clock, Droplet, Scale, ThumbsUp, User, Trash2, Lock, Pencil } from 'lucide-react';
import { getRecipeById, deleteRecipe } from '@/lib/actions/recipe';
import { notFound } from 'next/navigation';
import { FavoriteButton } from '@/components/recipe/favorite-button';
import { createClient } from '@/lib/supabase-server';
import { prisma } from '@/lib/db';
import { LikeButton } from '@/components/recipe/like-button';
import { DeleteRecipeButton } from '@/components/recipe/delete-recipe-button';

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // params가 Promise인 경우 await
  const id = params instanceof Promise ? (await params).id : params.id;
  const recipe = await getRecipeById(id) as any;

  if (!recipe) {
    notFound();
  }

  // Supabase 클라이언트 생성 및 사용자 정보 가져오기
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isFavorite = false;
  let userId = user?.id;

  // 좋아요 수 계산
  let likesCount = 0;
  try {
    likesCount = await prisma.recipeLike.count({
      where: {
        recipeId: id,
      },
    });
  } catch (error) {
    console.error('좋아요 수 계산 오류:', error);
  }

  if (userId) {
    // 즐겨찾기 여부 확인
    const favorite = await prisma.favorite.findUnique({
      where: {
        recipeId_userId: {
          recipeId: id,
          userId: userId,
        },
      },
    });

    isFavorite = !!favorite;
  }

  const steps = Array.isArray(recipe.steps)
    ? recipe.steps
    : typeof recipe.steps === 'string'
      ? recipe.steps.split('\n')
      : [];

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <Link
        href="/recipes"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> 모든 레시피로 돌아가기
      </Link>

      <div className="bg-card border rounded-lg p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
          <Coffee className="mr-2" /> {recipe.title}
          {!recipe.isPublic && (
            <span className="ml-3 text-sm flex items-center px-2 py-1 bg-secondary/80 text-secondary-foreground rounded-full">
              <Lock size={12} className="mr-1" />
              비공개
            </span>
          )}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center">
            <Clock size={12} className="mr-1" /> {recipe.preparationTime || '시간 정보 없음'}
          </span>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center">
            <Scale size={12} className="mr-1" /> {recipe.beanAmount || '원두량 정보 없음'}
          </span>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center">
            <Droplet size={12} className="mr-1" /> {recipe.waterAmount || '물 정보 없음'}
          </span>
        </div>

        <div className="text-sm text-muted-foreground mb-6">
          <div className="flex items-center mb-1">
            <User size={14} className="mr-1" />
            작성자: {recipe.author?.name || '익명'}
          </div>
          <div>
            난이도: {recipe.difficulty || '정보 없음'} • 분쇄도: {recipe.grindSize || '정보 없음'}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">레시피 설명</h2>
          <p className="text-muted-foreground">{recipe.description || '설명 없음'}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">준비물</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>커피 원두: {recipe.beanAmount || '정보 없음'}</li>
            <li>물: {recipe.waterAmount || '정보 없음'}</li>
            <li>분쇄도: {recipe.grindSize || '정보 없음'}</li>
            {recipe.equipment && <li>장비: {recipe.equipment}</li>}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">추출 단계</h2>
          {steps.length > 0 ? (
            <ol className="list-decimal list-inside space-y-4">
              {steps.map((step: any, index: number) => (
                <li key={index} className="pl-2">
                  <span className="text-muted-foreground">
                    {typeof step === 'string'
                      ? step.trim()
                      : typeof step === 'object' && step !== null
                        ? (step.text || step.content || step.description || step.step ||
                          (typeof step.toString === 'function' && step.toString() !== '[object Object]'
                            ? step.toString()
                            : JSON.stringify(step)))
                        : String(step)}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground">추출 단계 정보가 없습니다.</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">팁 & 노트</h2>
          <p className="text-muted-foreground">{recipe.notes || '추가 노트가 없습니다.'}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <LikeButton
              recipeId={recipe.id}
              initialLikes={likesCount}
              userId={userId}
            />
            <FavoriteButton
              recipeId={recipe.id}
              initialIsFavorite={isFavorite}
              userId={userId}
            />
          </div>

          {userId === recipe.userId && (
            <div className="flex space-x-2">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors flex items-center"
              >
                <Pencil size={14} className="mr-1" />
                레시피 수정하기
              </Link>
              <form action={async () => {
                'use server';
                if (userId) {
                  await deleteRecipe(recipe.id, userId);
                }
              }}>
                <DeleteRecipeButton recipeId={recipe.id} />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 