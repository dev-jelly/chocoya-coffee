'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import { createRecipe, updateRecipe } from '@/lib/actions/recipe';
import { GrinderSelector } from './grinder-selector';

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
  waterTemp?: string;
  grinderId?: string | null;
  grinderSetting?: string | null;
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
  temperature?: string;
  grinderId?: string;
  grinderSetting?: string;
}

export default function RecipeForm({ recipe, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const [steps, setSteps] = useState<string[]>(
    recipe?.steps ? recipe.steps.split('\n') : ['', '', '']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 그라인더 관련 상태 추가
  const [selectedGrinderId, setSelectedGrinderId] = useState<string>(recipe?.grinderId || '');
  const [selectedGrinderSetting, setSelectedGrinderSetting] = useState<string>(recipe?.grinderSetting || '');
  const [brewingMethod, setBrewingMethod] = useState<string>(recipe?.method || '');

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

  // 브루잉 방식 변경 처리
  const handleBrewingMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBrewingMethod(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // 그라인더 관련 정보 추가
      if (selectedGrinderId) {
        formData.append('grinderId', selectedGrinderId);
      }

      if (selectedGrinderSetting) {
        formData.append('grinderSetting', selectedGrinderSetting);
      }

      // 단계 정보 추가
      formData.set('stepsCount', steps.length.toString());
      steps.forEach((step, index) => {
        if (step.trim()) {
          formData.set(`step-${index}`, step);
        }
      });

      if (isEditing && recipe) {
        // 레시피 업데이트
        const result = await updateRecipe(recipe.id, '', {}, formData);

        if (result.message === 'success') {
          router.push(`/recipes/${recipe.id}`);
        } else {
          setError('레시피 업데이트 중 오류가 발생했습니다.');
        }
      } else {
        // 레시피 생성
        const result = await createRecipe('', {}, formData);

        if (result.message === 'success') {
          router.push('/recipes');
        } else {
          setError('레시피 생성 중 오류가 발생했습니다.');
        }
      }
    } catch (err) {
      console.error('레시피 저장 중 오류:', err);
      setError('레시피를 저장하는 중 오류가 발생했습니다.');
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
              onChange={handleBrewingMethodChange}
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            >
              <option value="">추출 방식 선택</option>
              <option value="핸드드립">핸드드립</option>
              <option value="에스프레소">에스프레소</option>
              <option value="프렌치프레스">프렌치프레스</option>
              <option value="에어로프레스">에어로프레스</option>
              <option value="모카포트">모카포트</option>
              <option value="콜드브루">콜드브루</option>
              <option value="더치커피">더치커피</option>
              <option value="사이폰">사이폰</option>
              <option value="클레버드리퍼">클레버드리퍼</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1">
              난이도
            </label>
            <select
              id="difficulty"
              name="difficulty"
              defaultValue={recipe?.difficulty || ''}
              className="w-full p-3 rounded-md border border-input bg-background"
            >
              <option value="">난이도 선택</option>
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
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
          <div>
            <label htmlFor="equipment" className="block text-sm font-medium mb-1">
              필요 도구
            </label>
            <input
              type="text"
              id="equipment"
              name="equipment"
              defaultValue={recipe?.equipment || ''}
              placeholder="예: V60 드리퍼, 전용 필터, 서버, 핸드밀, 전자저울"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium mb-1">
              물 온도 <span className="text-xs text-muted-foreground">(°C)</span>
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              defaultValue={recipe?.waterTemp || ''}
              placeholder="92.5"
              className="w-full p-3 rounded-md border border-input bg-background"
              step="0.5"
              min="0"
              max="100"
            />
          </div>
          <div>
            <label htmlFor="grinder" className="block text-sm font-medium mb-1">
              그라인더
            </label>
            <GrinderSelector
              value={selectedGrinderId}
              onChange={setSelectedGrinderId}
              brewingMethod={brewingMethod}
              onGrinderSettingChange={setSelectedGrinderSetting}
            />
          </div>
          <div>
            <label htmlFor="grindSize" className="block text-sm font-medium mb-1">
              분쇄도 *
            </label>
            <input
              type="text"
              id="grindSize"
              name="grindSize"
              value={selectedGrinderSetting || recipe?.grindSize || ''}
              onChange={(e) => setSelectedGrinderSetting(e.target.value)}
              placeholder="예: 중간, 18클릭 (코만단테), 다이얼 2.5 (EK43)"
              className="w-full p-3 rounded-md border border-input bg-background"
              required
            />
          </div>
        </div>
      </div>

      {/* 재료 및 준비물 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">재료 및 준비물</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="beanAmount" className="block text-sm font-medium mb-1">
              원두량 <span className="text-xs text-muted-foreground">(g)</span>
            </label>
            <input
              type="number"
              id="beanAmount"
              name="beanAmount"
              defaultValue={recipe?.beanAmount || ''}
              placeholder="15.0"
              className="w-full p-3 rounded-md border border-input bg-background"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="waterAmount" className="block text-sm font-medium mb-1">
              물 용량 <span className="text-xs text-muted-foreground">(ml)</span>
            </label>
            <input
              type="number"
              id="waterAmount"
              name="waterAmount"
              defaultValue={recipe?.waterAmount || ''}
              placeholder="250"
              className="w-full p-3 rounded-md border border-input bg-background"
              step="1"
              min="0"
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