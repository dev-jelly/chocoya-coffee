'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee } from 'lucide-react';
import RecipeForm from '@/components/recipe/recipe-form';

export function CreateRecipeContent() {
  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <Link 
        href="/recipes" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> 레시피 목록으로 돌아가기
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
        <Coffee className="mr-2" /> 새 레시피 작성하기
      </h1>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          나만의 커피 브루잉 레시피를 작성하고 커뮤니티와 공유해보세요. 
          상세한 정보를 제공할수록 다른 사용자들에게 도움이 됩니다.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-4 md:p-6 lg:p-8">
        <RecipeForm />
      </div>
    </div>
  );
} 