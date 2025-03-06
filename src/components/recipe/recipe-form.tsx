'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createRecipe, updateRecipe } from '@/lib/actions/recipe';

// Recipe 타입 정의
interface Recipe {
  id: string;
  title: string;
  method: string;
  difficulty: string;
  preparationTime: string;
  beanAmount: string;
  waterAmount: string;
  grindSize: string;
  description: string | null;
  equipment: string | null;
  notes: string | null;
  steps: string | null;
  authorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
}

interface RecipeFormProps {
  recipe?: Recipe;
  isEditing?: boolean;
}

// 폼 데이터 타입 정의
interface RecipeFormData {
  title: string;
  method: string;
  difficulty: string;
  preparationTime: string;
  beanAmount: string;
  waterAmount: string;
  grindSize: string;
  description: string;
  equipment: string;
  notes: string;
  steps: string;
}

export default function RecipeForm({ recipe, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const [steps, setSteps] = useState<string[]>(
    recipe?.steps ? recipe.steps.split('\n') : ['', '', '']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddStep = () => {
    setSteps([...steps, '']);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      
      // 폼 데이터 가공
      const recipeData: RecipeFormData = {
        title: formData.get('title') as string,
        method: formData.get('method') as string,
        difficulty: formData.get('difficulty') as string,
        preparationTime: formData.get('preparationTime') as string,
        beanAmount: formData.get('beanAmount') as string,
        waterAmount: formData.get('waterAmount') as string,
        grindSize: formData.get('grindSize') as string,
        description: formData.get('description') as string || '',
        equipment: formData.get('equipment') as string || '',
        notes: formData.get('notes') as string || '',
        steps: steps.filter(step => step.trim() !== '').join('\n'),
      };

      if (isEditing && recipe) {
        // 레시피 업데이트
        await updateRecipe(recipe.id, recipeData);
        router.push(`/recipes/${recipe.id}`);
      } else {
        // 새 레시피 생성
        const newRecipe = await createRecipe(recipeData);
        router.push(`/recipes/${newRecipe}`);
      }
    } catch (err) {
      console.error('레시피 저장 중 오류 발생:', err);
      setError('레시피를 저장하는 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* 기본 정보 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              레시피 이름 *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={recipe?.title || ''}
              placeholder="예: 클래식 V60 핸드드립"
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="method" className="block text-sm font-medium mb-1">
              추출 방식 *
            </label>
            <select
              id="method"
              name="method"
              defaultValue={recipe?.method || ''}
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            >
              <option value="">추출 방식 선택</option>
              <option value="pourOver">핸드드립</option>
              <option value="aeropress">에어로프레스</option>
              <option value="frenchPress">프렌치프레스</option>
              <option value="coldBrew">콜드브루</option>
              <option value="mokaPot">모카포트</option>
              <option value="chemex">케멕스</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              난이도
            </label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={recipe?.difficulty || '초급'}
              className="w-full p-3 rounded-md border border-input bg-background"
            >
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="상급">상급</option>
            </select>
          </div>
          <div>
            <label htmlFor="preparationTime" className="block text-sm font-medium mb-1">
              총 소요 시간 *
            </label>
            <input
              type="text"
              id="preparationTime"
              name="preparationTime"
              defaultValue={recipe?.preparationTime || ''}
              placeholder="예: 4분, 12시간 등"
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              설명
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={recipe?.description || ''}
              rows={3}
              placeholder="이 레시피의 특징이나 맛의 특성을 간략히 설명해주세요."
              className="w-full p-3 rounded-md border border-input bg-background resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      
      {/* 재료 및 준비물 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">재료 및 준비물</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="beanAmount" className="block text-sm font-medium mb-1">
              원두량 *
            </label>
            <input
              type="text"
              id="beanAmount"
              name="beanAmount"
              defaultValue={recipe?.beanAmount || ''}
              placeholder="예: 15g"
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="grindSize" className="block text-sm font-medium mb-1">
              분쇄도 *
            </label>
            <select
              id="grindSize"
              name="grindSize"
              defaultValue={recipe?.grindSize || ''}
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            >
              <option value="">분쇄도 선택</option>
              <option value="매우 고운">매우 고운</option>
              <option value="고운">고운</option>
              <option value="중간-고운">중간-고운</option>
              <option value="중간">중간</option>
              <option value="중간-굵은">중간-굵은</option>
              <option value="굵은">굵은</option>
              <option value="매우 굵은">매우 굵은</option>
            </select>
          </div>
          <div>
            <label htmlFor="waterAmount" className="block text-sm font-medium mb-1">
              물 용량 *
            </label>
            <input
              type="text"
              id="waterAmount"
              name="waterAmount"
              defaultValue={recipe?.waterAmount || ''}
              placeholder="예: 250ml"
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            />
          </div>
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium mb-1">
              필요한 장비
            </label>
            <input
              type="text"
              id="equipment"
              name="equipment"
              defaultValue={recipe?.equipment || ''}
              placeholder="예: V60 드리퍼, 필터 페이퍼, 굿넥 포트"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
        </div>
      </div>
      
      {/* 추출 방법 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">추출 방법</h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  스텝 {index + 1}
                </label>
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="text-destructive text-sm hover:underline flex items-center"
                  >
                    <Trash2 size={14} className="mr-1" /> 삭제
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`${index + 1}번째 단계를 설명해주세요.`}
                className="w-full p-3 rounded-md border border-input bg-background resize-none"
              ></textarea>
            </div>
          ))}
          
          <button
            type="button"
            onClick={handleAddStep}
            className="flex items-center text-primary hover:underline"
          >
            <Plus size={16} className="mr-1" />
            단계 추가
          </button>
        </div>
      </div>
      
      {/* 브루잉 팁 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">팁 & 노트</h2>
        <textarea
          id="notes"
          name="notes"
          defaultValue={recipe?.notes || ''}
          rows={4}
          placeholder="맛을 극대화하기 위한 팁이나 조언을 적어주세요."
          className="w-full p-3 rounded-md border border-input bg-background resize-none"
        ></textarea>
      </div>
      
      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/recipes')}
          className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting 
            ? '저장 중...' 
            : isEditing 
              ? '레시피 수정하기' 
              : '레시피 공유하기'
          }
        </button>
      </div>
    </form>
  );
} 