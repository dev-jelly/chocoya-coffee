import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee } from 'lucide-react';
import RecipeForm from '@/components/recipe/recipe-form';
import { getRecipeById } from '@/lib/actions/recipe';
import { notFound } from 'next/navigation';

// 대신 간단한 타입 정의 추가
type Recipe = any; // 또는 필요한 속성만 정의

export const metadata = {
  title: '초코야 커피 - 레시피 수정',
  description: '커피 브루잉 레시피를 수정하세요',
};

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <Link
        href={`/recipes/${params.id}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> 레시피 상세로 돌아가기
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
        <Coffee className="mr-2" /> 레시피 수정하기
      </h1>

      <div className="mb-6">
        <p className="text-muted-foreground">
          레시피 정보를 수정하고 업데이트하세요. 더 정확하고 상세한 정보를 제공할수록
          다른 사용자들에게 도움이 됩니다.
        </p>
      </div>

      <div className="bg-card border rounded-lg p-4 md:p-6 lg:p-8">
        <RecipeForm
          recipe={recipe as any}
          isEditing={true}
        />
      </div>
    </div>
  );
} 