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
  isPublic?: boolean;
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
  isPublic?: boolean;
}

// 추출 방식 별 추출 기구 목록 정의
const extractionEquipment = {
  '푸어오버': [
    { id: 'v60', name: 'Hario V60', description: '하리오 V60 드리퍼' },
    { id: 'kalita', name: 'Kalita Wave', description: '칼리타 웨이브 드리퍼' },
    { id: 'chemex', name: 'Chemex', description: '케멕스 드리퍼' },
    { id: 'origami', name: 'Origami', description: '오리가미 드리퍼' },
    { id: 'kono', name: 'Kono Meimon', description: '코노 메이몬 드리퍼' },
    { id: 'other_pourover', name: '기타', description: '기타 푸어오버 장비' }
  ],
  '에스프레소': [
    { id: 'semi_auto', name: '반자동 에스프레소 머신', description: '바리스타가 분쇄도, 탬핑, 추출 시간을 조절하는 머신' },
    { id: 'full_auto', name: '전자동 에스프레소 머신', description: '버튼 하나로 모든 과정이 자동화된 머신' },
    { id: 'manual_lever', name: '레버 에스프레소 머신', description: '수동으로 압력을 조절하는 전통적인 방식의 머신' },
    { id: 'capsule', name: '캡슐 머신', description: '캡슐을 이용한 간편한 에스프레소 추출' },
    { id: 'nanopresso', name: '나노프레소', description: '휴대용 수동 에스프레소 추출 기구' },
    { id: 'flair', name: '플레어', description: '수동식 레버 타입의 휴대용 에스프레소 추출 기구' },
    { id: 'rok', name: 'ROK 에스프레소 메이커', description: '수동식 레버 타입의 에스프레소 메이커' },
    { id: 'other_espresso', name: '기타', description: '기타 에스프레소 추출 장비' }
  ],
  '프렌치프레스': [
    { id: 'bodum', name: '보덤 프렌치프레스', description: '클래식한 디자인의 프렌치프레스' },
    { id: 'hario', name: '하리오 프렌치프레스', description: '내구성 좋은 유리 재질의 프렌치프레스' },
    { id: 'espro', name: '에스프로 프레스', description: '미세한 이중 필터로 더 깨끗한 추출의 프렌치프레스' },
    { id: 'frieling', name: '프릴링 스테인레스 프레스', description: '스테인레스 재질로 내구성이 뛰어난 프렌치프레스' },
    { id: 'other_frenchpress', name: '기타', description: '기타 프렌치프레스 장비' }
  ],
  '에어로프레스': [
    { id: 'aeropress_standard', name: '에어로프레스 스탠다드', description: '기본적인 에어로프레스' },
    { id: 'aeropress_go', name: '에어로프레스 고', description: '여행용으로 컴팩트한 에어로프레스' },
    { id: 'fellow_prismo', name: '펠로우 프리즈모 부착형', description: '에어로프레스에 부착하여 에스프레소 스타일로 추출' },
    { id: 'other_aeropress', name: '기타', description: '기타 에어로프레스 액세서리 사용' }
  ],
  '모카포트': [
    { id: 'bialetti', name: '비알레띠 모카포트', description: '클래식한 이탈리안 모카포트' },
    { id: 'bialetti_induction', name: '비알레띠 인덕션용 모카포트', description: '인덕션에서 사용 가능한 모카포트' },
    { id: 'electric_moka', name: '전기식 모카포트', description: '전기로 작동하는 편리한 모카포트' },
    { id: 'other_moka', name: '기타', description: '기타 브랜드의 모카포트' }
  ],
  '콜드브루': [
    { id: 'toddy', name: '토디 콜드브루 시스템', description: '대용량 침지식 콜드브루 추출 시스템' },
    { id: 'hario_mizudashi', name: '하리오 미즈다시', description: '간편한 콜드브루 포트' },
    { id: 'filtron', name: '필트론', description: '대용량 홈 콜드브루 시스템' },
    { id: 'oxo', name: 'OXO 콜드브루 메이커', description: '간편한 밸브 시스템의 콜드브루 메이커' },
    { id: 'bruer', name: '브루어 콜드브루', description: '슬로우 드립 방식의 콜드브루 메이커' },
    { id: 'diy_coldbrew', name: 'DIY 방식', description: '자체 제작 방식의 콜드브루 추출' },
    { id: 'other_coldbrew', name: '기타', description: '기타 콜드브루 추출 방식' }
  ],
  '더치커피': [
    { id: 'dutch_tower_wood', name: '목재 더치 타워', description: '전통적인 목재 더치커피 추출 장치' },
    { id: 'dutch_tower_glass', name: '유리 더치 타워', description: '모던한 유리 재질의 더치커피 타워' },
    { id: 'cold_drip_ceramic', name: '도자기 콜드 드립', description: '도자기 재질의 드립 시스템' },
    { id: 'yama_tower', name: '야마 드립 타워', description: '일본식 유리 드립 타워' },
    { id: 'other_dutch', name: '기타', description: '기타 더치커피 추출 장비' }
  ],
  '사이폰': [
    { id: 'hario_syphon', name: '하리오 사이폰', description: '일본식 진공식 추출 시스템' },
    { id: 'yama_syphon', name: '야마 사이폰', description: '고급 유리 재질의 사이폰' },
    { id: 'other_syphon', name: '기타', description: '기타 사이폰 추출 장비' }
  ],
  '클레버드리퍼': [
    { id: 'clever_standard', name: '클레버 드리퍼 스탠다드', description: '스탠다드 사이즈의 클레버 드리퍼' },
    { id: 'clever_large', name: '클레버 드리퍼 라지', description: '대용량 클레버 드리퍼' },
    { id: 'other_clever', name: '기타', description: '기타 클레버 드리퍼 유사 장비' }
  ],
  '기타': [
    { id: 'other_method', name: '직접 입력', description: '위에 없는 추출 방식 및 장비' }
  ]
};

export default function RecipeForm({ recipe, isEditing = false }: RecipeFormProps) {
  const router = useRouter();
  const [steps, setSteps] = useState<string[]>(
    recipe?.steps ? recipe.steps.split('\n') : ['', '', '']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(recipe?.isPublic !== false);

  // 그라인더 관련 상태 추가
  const [selectedGrinderId, setSelectedGrinderId] = useState<string>(recipe?.grinderId || '');
  const [selectedGrinderSetting, setSelectedGrinderSetting] = useState<string>(recipe?.grinderSetting || '');
  const [brewingMethod, setBrewingMethod] = useState<string>(recipe?.method || '');
  const [selectedEquipment, setSelectedEquipment] = useState<string>(recipe?.equipment || '');
  const [otherEquipment, setOtherEquipment] = useState('');

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
    setSelectedEquipment('');
  };

  // 추출 기구 변경 핸들러
  const handleEquipmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEquipment(e.target.value);
    // 기타 옵션 선택 시 기존 equipment 값 초기화
    if (!e.target.value.startsWith('other_')) {
      setOtherEquipment('');
    }
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

      // 선택된 장비 정보 추가
      if (selectedEquipment.startsWith('other_') && otherEquipment) {
        formData.set('equipment', otherEquipment);
      } else if (selectedEquipment) {
        const methodEquipment = extractionEquipment[brewingMethod as keyof typeof extractionEquipment] || [];
        const equipment = methodEquipment.find(item => item.id === selectedEquipment);
        if (equipment) {
          formData.set('equipment', equipment.name);
        }
      }

      // 공개 설정 추가 (체크 해제 시에도 정확히 처리)
      formData.set('isPublic', isPublic.toString());

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
              placeholder="예: 클래식 V60 푸어오버"
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
              <option value="푸어오버">푸어오버</option>
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
              추출 기구
            </label>
            {brewingMethod ? (
              <div className="space-y-2">
                <select
                  id="equipment"
                  name="equipment_id"
                  value={selectedEquipment}
                  onChange={handleEquipmentChange}
                  className="w-full p-3 rounded-md border border-input bg-background"
                >
                  <option value="">추출 기구 선택</option>
                  {extractionEquipment[brewingMethod as keyof typeof extractionEquipment]?.map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </option>
                  ))}
                </select>

                {selectedEquipment && (
                  <p className="text-xs text-muted-foreground">
                    {extractionEquipment[brewingMethod as keyof typeof extractionEquipment]?.find(
                      (equipment) => equipment.id === selectedEquipment
                    )?.description || ''}
                  </p>
                )}

                {selectedEquipment.startsWith('other_') && (
                  <input
                    type="text"
                    value={otherEquipment}
                    onChange={(e) => setOtherEquipment(e.target.value)}
                    placeholder="추출 기구를 직접 입력해주세요"
                    className="w-full p-3 rounded-md border border-input bg-background mt-2"
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-3 border border-dashed rounded-md">
                먼저 추출 방식을 선택해주세요.
              </p>
            )}
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

      {/* 공개 설정 */}
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            이 레시피를 다른 사용자와 공유합니다
          </label>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          체크를 해제하면 나만 볼 수 있는 비공개 레시피로 저장됩니다. 언제든지 설정을 변경할 수 있습니다.
        </p>
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