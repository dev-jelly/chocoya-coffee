'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Coffee, Save } from 'lucide-react';
import { FlavorWheelSelector } from '@/components/taste-note/flavor-wheel-selector';
import { FlavorWheelImage } from '@/components/taste-note/flavor-wheel-image';
import { flavorLabels, FlavorLabel } from '@/data/flavor-labels';

export default function TasteNoteForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    coffeeName: '',
    origin: '',
    roastLevel: '',
    roaster: '',
    brewingMethod: '',
    grindSize: '',
    beanAmount: '',
    waterAmount: '',
    waterTemp: '',
    brewTime: '',
    ratio: '',
    overallRating: 3,
    acidity: 5,
    sweetness: 5,
    body: 5,
    bitterness: 5,
    notes: '',
    recipeId: '',
  });
  
  // 선택된 라벨 ID를 기반으로 라벨 객체 목록 반환
  const getSelectedLabels = (): FlavorLabel[] => {
    return selectedLabelIds
      .map(id => flavorLabels.find(label => label.id === id))
      .filter((label): label is FlavorLabel => label !== undefined);
  };
  
  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 범위 슬라이더 값 변경 처리
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
  };
  
  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 맛 노트 데이터 준비
      const flavorColors = getSelectedLabels().map(label => label.color);
      const primaryColor = flavorColors.length > 0 ? flavorColors[0] : undefined;
      
      // API 호출 또는 서버 액션 호출 로직 추가
      // 성공 시 맛 노트 목록 페이지로 이동
      console.log('Form submitted', {
        ...formData,
        flavorLabels: selectedLabelIds,
        flavorColors,
        primaryColor,
      });
      
      router.push('/taste-notes');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="coffeeName" className="block text-sm font-medium mb-1">
              커피 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="coffeeName"
              name="coffeeName"
              value={formData.coffeeName}
              onChange={handleInputChange}
              required
              placeholder="예: 에티오피아 예가체프"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="origin" className="block text-sm font-medium mb-1">
              원산지
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleInputChange}
              placeholder="예: 에티오피아"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="roastLevel" className="block text-sm font-medium mb-1">
              로스팅 단계
            </label>
            <select
              id="roastLevel"
              name="roastLevel"
              value={formData.roastLevel}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-input bg-background"
            >
              <option value="">로스팅 단계 선택</option>
              <option value="라이트">라이트 로스트</option>
              <option value="미디엄 라이트">미디엄 라이트 로스트</option>
              <option value="미디엄">미디엄 로스트</option>
              <option value="미디엄 다크">미디엄 다크 로스트</option>
              <option value="다크">다크 로스트</option>
            </select>
          </div>
          <div>
            <label htmlFor="roaster" className="block text-sm font-medium mb-1">
              로스터리
            </label>
            <input
              type="text"
              id="roaster"
              name="roaster"
              value={formData.roaster}
              onChange={handleInputChange}
              placeholder="예: 생트 로스터스"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
        </div>
      </div>
      
      {/* 추출 정보 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">추출 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="brewingMethod" className="block text-sm font-medium mb-1">
              추출 방식 <span className="text-red-500">*</span>
            </label>
            <select
              id="brewingMethod"
              name="brewingMethod"
              value={formData.brewingMethod}
              onChange={handleInputChange}
              required
              className="w-full p-3 rounded-md border border-input bg-background"
            >
              <option value="">추출 방식 선택</option>
              <option value="핸드드립">핸드드립</option>
              <option value="에스프레소">에스프레소</option>
              <option value="프렌치프레스">프렌치프레스</option>
              <option value="에어로프레스">에어로프레스</option>
              <option value="모카포트">모카포트</option>
              <option value="콜드브루">콜드브루</option>
              <option value="더치커피">더치커피</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <div>
            <label htmlFor="grindSize" className="block text-sm font-medium mb-1">
              분쇄도
            </label>
            <input
              type="text"
              id="grindSize"
              name="grindSize"
              value={formData.grindSize}
              onChange={handleInputChange}
              placeholder="예: 중간(미디엄)"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="beanAmount" className="block text-sm font-medium mb-1">
              원두량
            </label>
            <input
              type="text"
              id="beanAmount"
              name="beanAmount"
              value={formData.beanAmount}
              onChange={handleInputChange}
              placeholder="예: 15g"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="waterAmount" className="block text-sm font-medium mb-1">
              물 용량
            </label>
            <input
              type="text"
              id="waterAmount"
              name="waterAmount"
              value={formData.waterAmount}
              onChange={handleInputChange}
              placeholder="예: 250ml"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="waterTemp" className="block text-sm font-medium mb-1">
              물 온도
            </label>
            <input
              type="text"
              id="waterTemp"
              name="waterTemp"
              value={formData.waterTemp}
              onChange={handleInputChange}
              placeholder="예: 92°C"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          <div>
            <label htmlFor="brewTime" className="block text-sm font-medium mb-1">
              추출 시간
            </label>
            <input
              type="text"
              id="brewTime"
              name="brewTime"
              value={formData.brewTime}
              onChange={handleInputChange}
              placeholder="예: 3:30"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
        </div>
      </div>
      
      {/* 맛 프로필 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">맛 프로필</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              종합 평가
            </label>
            <div className="flex items-center">
              <input
                type="range"
                id="overallRating"
                name="overallRating"
                min="1"
                max="5"
                value={formData.overallRating}
                onChange={handleRangeChange}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  산미 (Acidity)
                </label>
                <input
                  type="range"
                  id="acidity"
                  name="acidity"
                  min="1"
                  max="10"
                  value={formData.acidity}
                  onChange={handleRangeChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>낮음</span>
                  <span>높음</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  단맛 (Sweetness)
                </label>
                <input
                  type="range"
                  id="sweetness"
                  name="sweetness"
                  min="1"
                  max="10"
                  value={formData.sweetness}
                  onChange={handleRangeChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>낮음</span>
                  <span>높음</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  바디감 (Body)
                </label>
                <input
                  type="range"
                  id="body"
                  name="body"
                  min="1"
                  max="10"
                  value={formData.body}
                  onChange={handleRangeChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>가벼움</span>
                  <span>무거움</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  쓴맛 (Bitterness)
                </label>
                <input
                  type="range"
                  id="bitterness"
                  name="bitterness"
                  min="1"
                  max="10"
                  value={formData.bitterness}
                  onChange={handleRangeChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>낮음</span>
                  <span>높음</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                맛 노트 (Flavor Notes)
              </label>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    이 커피에서 느껴지는 맛과 향을 선택해주세요. 여러 개 선택 가능합니다.
                  </p>
                  <FlavorWheelSelector
                    selectedLabels={selectedLabelIds}
                    onChange={setSelectedLabelIds}
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    이 커피의 맛을 시각화한 이미지
                  </p>
                  <FlavorWheelImage
                    selectedLabels={getSelectedLabels()}
                    size={200}
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 노트 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">노트</h2>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="이 커피에 대한 추가 느낌이나 메모를 적어보세요."
          className="w-full p-3 rounded-md border border-input bg-background resize-none"
        ></textarea>
      </div>
      
      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/taste-notes"
          className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>저장 중...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              저장하기
            </>
          )}
        </button>
      </div>
    </form>
  );
} 