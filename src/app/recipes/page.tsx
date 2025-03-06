import React from 'react';
import Link from 'next/link';
import { Coffee, Clock, Droplet, Scale } from 'lucide-react';
import { RecipesNav } from '@/components/layout/recipes-nav';
import { getRecipes } from '@/lib/actions/recipe';

export const metadata = {
  title: '초코야 커피 - 브루잉 레시피',
  description: '다양한 커피 브루잉 레시피를 찾아보세요',
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams?: { method?: string };
}) {
  // 데이터베이스에서 레시피 가져오기
  const recipes = await getRecipes(searchParams?.method);

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
        <Coffee className="mr-2" /> 커피 브루잉 레시피
      </h1>
      
      <div className="mb-6 md:mb-8">
        <p className="text-muted-foreground text-sm md:text-base">
          다양한 추출 방식으로 나만의 완벽한 커피를 만들어보세요. 각 레시피를 클릭하면 상세 가이드를 확인할 수 있습니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link 
            href="/brewing-guide" 
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            브루잉 가이드
          </Link>
          <Link 
            href="/recipes/create" 
            className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            내 레시피 공유하기
          </Link>
        </div>
      </div>
      
      <RecipesNav />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-card">
                <div className="p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">{recipe.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-3">
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
                  <p className="text-muted-foreground text-sm">{recipe.description || '설명 없음'}</p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    난이도: {recipe.difficulty || '정보 없음'} • 분쇄도: {recipe.grindSize || '정보 없음'}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">해당 조건에 맞는 레시피가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
} 