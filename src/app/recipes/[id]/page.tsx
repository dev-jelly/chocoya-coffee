import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, Clock, Droplet, Scale, ThumbsUp, User } from 'lucide-react';
import { getRecipeById } from '@/lib/actions/recipe';
import { notFound } from 'next/navigation';
import { FavoriteButton } from '@/components/recipe/favorite-button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipeById(params.id);
  
  if (!recipe) {
    notFound();
  }
  
  // 현재 로그인한 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  let isFavorite = false;
  let userId = undefined;
  
  if (session?.user?.id) {
    userId = session.user.id;
    
    // 즐겨찾기 여부 확인
    const favorite = await prisma.favorite.findUnique({
      where: {
        recipeId_userId: {
          recipeId: params.id,
          userId: session.user.id,
        },
      },
    });
    
    isFavorite = !!favorite;
  }

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
          {recipe.steps ? (
            <ol className="list-decimal list-inside space-y-4">
              {recipe.steps.split('\n').map((step: string, index: number) => (
                <li key={index} className="pl-2">
                  <span className="text-muted-foreground">{step.trim()}</span>
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
            <button className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ThumbsUp size={16} className="mr-1" /> 좋아요 {recipe.likes || 0}
            </button>
            <FavoriteButton 
              recipeId={recipe.id} 
              initialIsFavorite={isFavorite}
              userId={userId}
            />
          </div>
          
          {session?.user?.id === recipe.userId && (
            <Link 
              href={`/recipes/${recipe.id}/edit`} 
              className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              레시피 수정하기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 