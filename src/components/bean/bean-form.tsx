'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { createBean, updateBean } from '@/lib/actions/bean';
import { Calendar } from 'lucide-react';

interface BeanFormProps {
  userId: string;
  bean?: any; // 수정 시 사용
  isEditing?: boolean;
}

export default function BeanForm({ userId, bean, isEditing = false }: BeanFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: bean?.name || '',
    origin: bean?.origin || '',
    region: bean?.region || '',
    farm: bean?.farm || '',
    altitude: bean?.altitude || '',
    process: bean?.process || '',
    variety: bean?.variety || '',
    roastLevel: bean?.roastLevel || '',
    roaster: bean?.roaster || '',
    roastDate: bean?.roastDate ? new Date(bean.roastDate).toISOString().split('T')[0] : '',
    description: bean?.description || '',
    isPublic: bean?.isPublic ?? true,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 폼 데이터 생성
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataObj.append(key, value.toString());
        }
      });
      
      // 서버 액션 호출
      const result = isEditing
        ? await updateBean(bean.id, userId, {}, formDataObj)
        : await createBean(userId, {}, formDataObj);
      
      if (result.errors) {
        // 오류 처리
        toast({
          title: '원두 정보 저장 실패',
          description: result.message || '원두 정보를 저장하는 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
      } else {
        // 성공 시
        toast({
          title: '원두 정보 저장 성공',
          description: '원두 정보가 성공적으로 저장되었습니다.',
        });
        router.push('/beans');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: '원두 정보 저장 실패',
        description: '서버 오류가 발생했습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
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
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              원두 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
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
            <label htmlFor="region" className="block text-sm font-medium mb-1">
              지역
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              placeholder="예: 예가체프"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          
          <div>
            <label htmlFor="farm" className="block text-sm font-medium mb-1">
              농장명
            </label>
            <input
              type="text"
              id="farm"
              name="farm"
              value={formData.farm}
              onChange={handleInputChange}
              placeholder="예: 아리차"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          
          <div>
            <label htmlFor="altitude" className="block text-sm font-medium mb-1">
              고도
            </label>
            <input
              type="text"
              id="altitude"
              name="altitude"
              value={formData.altitude}
              onChange={handleInputChange}
              placeholder="예: 1,900-2,200m"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          
          <div>
            <label htmlFor="process" className="block text-sm font-medium mb-1">
              프로세스
            </label>
            <select
              id="process"
              name="process"
              value={formData.process}
              onChange={handleInputChange}
              className="w-full p-3 rounded-md border border-input bg-background"
            >
              <option value="">프로세스 선택</option>
              <option value="워시드">워시드</option>
              <option value="내추럴">내추럴</option>
              <option value="허니">허니</option>
              <option value="펄프드 내추럴">펄프드 내추럴</option>
              <option value="웻 헐드">웻 헐드</option>
              <option value="기타">기타</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="variety" className="block text-sm font-medium mb-1">
              품종
            </label>
            <input
              type="text"
              id="variety"
              name="variety"
              value={formData.variety}
              onChange={handleInputChange}
              placeholder="예: 게이샤, 부르봉, 카투라"
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
              placeholder="예: 센트커피"
              className="w-full p-3 rounded-md border border-input bg-background"
            />
          </div>
          
          <div>
            <label htmlFor="roastDate" className="block text-sm font-medium mb-1">
              로스팅 날짜
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-muted-foreground" />
              </div>
              <input
                type="date"
                id="roastDate"
                name="roastDate"
                value={formData.roastDate}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 rounded-md border border-input bg-background"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 설명 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">설명</h2>
        <textarea
          id="description"
          name="description"
          rows={5}
          value={formData.description}
          onChange={handleInputChange}
          placeholder="원두에 대한 설명을 입력하세요. (맛, 향, 특징 등)"
          className="w-full p-3 rounded-md border border-input bg-background resize-none"
        ></textarea>
      </div>
      
      {/* 공개 설정 */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleCheckboxChange}
          className="rounded text-primary"
        />
        <label htmlFor="isPublic" className="text-sm">
          이 원두 정보를 다른 사용자에게 공개합니다.
        </label>
      </div>
      
      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.push('/beans')}
          disabled={isSubmitting}
          className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {isSubmitting ? '저장 중...' : (isEditing ? '수정하기' : '등록하기')}
        </button>
      </div>
    </form>
  );
} 