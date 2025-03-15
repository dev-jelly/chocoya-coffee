import React from 'react';
import Link from 'next/link';
import { Coffee, Clock, Droplet, Scale, AlertCircle, RefreshCw } from 'lucide-react';
import { RecipesNav } from '@/components/layout/recipes-nav';
import { getRecipes } from '@/lib/actions/recipe';
import { withDatabase } from '@/lib/db';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Recipe 타입 정의
interface Recipe {
  id: string;
  title: string;
  description: string | null;
  preparationTime: string | null;
  beanAmount: string | null;
  waterAmount: string | null;
  difficulty: string | null;
  grindSize: string | null;
  brewingMethod: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const metadata = {
  title: '초코야 커피 - 브루잉 레시피',
  description: '다양한 커피 브루잉 레시피를 찾아보세요',
};

export default async function RecipesPage(props: any) {
  // searchParams 직접 접근
  const searchParams = props.searchParams || {};
  const methodParam = searchParams.method;
  const method = typeof methodParam === 'string' ? methodParam : undefined;

  // 데이터베이스 연결 오류 상태 관리
  let error = null;

  // 데이터베이스에서 레시피 가져오기 (오류 처리 포함)
  const recipes = await withDatabase<Recipe[]>(
    async () => {
      return await getRecipes(method);
    },
    [], // 오류 발생 시 빈 배열 반환
    (err) => {
      console.error('레시피 조회 오류:', err);
      error = err instanceof Error
        ? err.message
        : '레시피를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  );

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

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
          <div className="flex-1">
            <p className="text-red-700 font-medium">데이터베이스 연결 오류</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <div className="mt-3">
              <Link
                href="/recipes"
                className="inline-flex items-center text-sm text-red-700 hover:text-red-800"
              >
                <RefreshCw size={14} className="mr-1" /> 새로고침
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe: Recipe) => (
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
      )}
    </div>
  );
} 