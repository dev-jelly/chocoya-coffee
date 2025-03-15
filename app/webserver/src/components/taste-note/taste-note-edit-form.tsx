'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { FlavorWheelSelector } from '@/components/taste-note/flavor-wheel-selector';
import { updateTasteNote } from '@/lib/actions/taste-note';
import { useToast } from '@/components/ui/use-toast';
import { getBeans } from '@/lib/actions/bean';
import { getRecipes } from '@/lib/actions/recipe';

interface TasteNoteEditFormProps {
    tasteNote: any;
    userId: string;
}

export default function TasteNoteEditForm({ tasteNote, userId }: TasteNoteEditFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
    const [beans, setBeans] = useState<any[]>([]);
    const [recipes, setRecipes] = useState<any[]>([]);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        coffeeName: tasteNote.coffeeName || '',
        origin: tasteNote.origin || '',
        roastLevel: tasteNote.roastLevel || '',
        roaster: tasteNote.roaster || '',
        brewingMethod: tasteNote.brewingMethod || '',
        grindSize: tasteNote.grindSize || '',
        beanAmount: tasteNote.beanAmount || '',
        waterAmount: tasteNote.waterAmount || '',
        waterTemp: tasteNote.waterTemp || '',
        brewTime: tasteNote.brewTime || '',
        ratio: tasteNote.ratio || '',
        overallRating: tasteNote.overallRating || 3,
        acidity: tasteNote.acidity || 5,
        sweetness: tasteNote.sweetness || 5,
        body: tasteNote.body || 5,
        bitterness: tasteNote.bitterness || 5,
        notes: tasteNote.notes || '',
        recipeId: tasteNote.recipeId || '',
        beanId: tasteNote.beanId || '',
    });

    // 원두 및 레시피 목록 가져오기
    useEffect(() => {
        const fetchData = async () => {
            const beansData = await getBeans();
            setBeans(beansData);

            const recipesData = await getRecipes();
            setRecipes(recipesData);
        };

        fetchData();
    }, []);

    // 플레이버 레이블 초기화
    useEffect(() => {
        if (tasteNote.flavorLabels) {
            setSelectedLabelIds(tasteNote.flavorLabels.split(',').filter(Boolean));
        }
    }, [tasteNote.flavorLabels]);

    // 입력 필드 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 레인지 슬라이더 변경 핸들러
    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    };

    // 선택된 플레이버 레이블 가져오기
    const getSelectedLabels = () => {
        // 여기서는 실제 레이블 데이터를 가져오는 로직이 필요합니다
        // 간단히 ID와 색상만 반환하는 예시
        return selectedLabelIds.map(id => ({
            id,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16) // 임의의 색상
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 맛 노트 데이터 준비
            const selectedLabels = getSelectedLabels();
            const flavorColors = selectedLabels.map(label => label.color).join(',');
            const primaryColor = selectedLabels.length > 0 ? selectedLabels[0].color : undefined;

            // 폼 데이터 생성
            const formDataObj = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formDataObj.append(key, value.toString());
                }
            });

            // 맛 노트 레이블 데이터 추가
            formDataObj.append('flavorLabels', selectedLabelIds.join(','));
            formDataObj.append('flavorColors', flavorColors);
            if (primaryColor) {
                formDataObj.append('primaryColor', primaryColor);
            }

            // 서버 액션 호출
            const result = await updateTasteNote(tasteNote.id, userId, {}, formDataObj);

            if (result.errors) {
                // 오류 처리
                toast({
                    title: '맛 노트 수정 실패',
                    description: result.message || '맛 노트를 수정하는 중 오류가 발생했습니다.',
                    variant: 'destructive',
                });
            } else {
                // 성공 시
                toast({
                    title: '맛 노트 수정 성공',
                    description: '맛 노트가 성공적으로 수정되었습니다.',
                });
                router.push(`/taste-notes/${tasteNote.id}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: '맛 노트 수정 실패',
                description: '서버 오류가 발생했습니다. 다시 시도해주세요.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 커피 정보 섹션 */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">커피 정보</h2>

                    <div>
                        <label htmlFor="coffeeName" className="block text-sm font-medium mb-1">
                            원두 이름 *
                        </label>
                        <input
                            type="text"
                            id="coffeeName"
                            name="coffeeName"
                            value={formData.coffeeName}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
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
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
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
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">선택하세요</option>
                            <option value="라이트">라이트</option>
                            <option value="미디엄 라이트">미디엄 라이트</option>
                            <option value="미디엄">미디엄</option>
                            <option value="미디엄 다크">미디엄 다크</option>
                            <option value="다크">다크</option>
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
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="beanId" className="block text-sm font-medium mb-1">
                            등록된 원두 선택
                        </label>
                        <select
                            id="beanId"
                            name="beanId"
                            value={formData.beanId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">선택하세요</option>
                            {beans.map((bean) => (
                                <option key={bean.id} value={bean.id}>
                                    {bean.name} - {bean.roaster || '로스터리 정보 없음'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 추출 정보 섹션 */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">추출 정보</h2>

                    <div>
                        <label htmlFor="brewingMethod" className="block text-sm font-medium mb-1">
                            추출 방법 *
                        </label>
                        <select
                            id="brewingMethod"
                            name="brewingMethod"
                            value={formData.brewingMethod}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">선택하세요</option>
                            <option value="에스프레소">에스프레소</option>
                            <option value="드립">드립</option>
                            <option value="프렌치 프레스">프렌치 프레스</option>
                            <option value="에어로프레스">에어로프레스</option>
                            <option value="모카포트">모카포트</option>
                            <option value="콜드브루">콜드브루</option>
                            <option value="사이폰">사이폰</option>
                            <option value="클레버">클레버</option>
                            <option value="케멕스">케멕스</option>
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
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="beanAmount" className="block text-sm font-medium mb-1">
                                원두량
                            </label>
                            <input
                                type="text"
                                id="beanAmount"
                                name="beanAmount"
                                value={formData.beanAmount}
                                onChange={handleChange}
                                placeholder="예: 18g"
                                className="w-full p-2 border rounded-md"
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
                                onChange={handleChange}
                                placeholder="예: 250ml"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="waterTemp" className="block text-sm font-medium mb-1">
                                물 온도
                            </label>
                            <input
                                type="text"
                                id="waterTemp"
                                name="waterTemp"
                                value={formData.waterTemp}
                                onChange={handleChange}
                                placeholder="예: 93°C"
                                className="w-full p-2 border rounded-md"
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
                                onChange={handleChange}
                                placeholder="예: 2분 30초"
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="ratio" className="block text-sm font-medium mb-1">
                            비율
                        </label>
                        <input
                            type="text"
                            id="ratio"
                            name="ratio"
                            value={formData.ratio}
                            onChange={handleChange}
                            placeholder="예: 1:15"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="recipeId" className="block text-sm font-medium mb-1">
                            사용한 레시피
                        </label>
                        <select
                            id="recipeId"
                            name="recipeId"
                            value={formData.recipeId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">선택하세요</option>
                            {recipes.map((recipe) => (
                                <option key={recipe.id} value={recipe.id}>
                                    {recipe.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* 맛 평가 섹션 */}
            <div className="space-y-4 pt-6 border-t">
                <h2 className="text-lg font-semibold">맛 평가</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="acidity" className="block text-sm font-medium mb-1">
                                산미: {formData.acidity}/10
                            </label>
                            <input
                                type="range"
                                id="acidity"
                                name="acidity"
                                min="1"
                                max="10"
                                value={formData.acidity}
                                onChange={handleRangeChange}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="sweetness" className="block text-sm font-medium mb-1">
                                단맛: {formData.sweetness}/10
                            </label>
                            <input
                                type="range"
                                id="sweetness"
                                name="sweetness"
                                min="1"
                                max="10"
                                value={formData.sweetness}
                                onChange={handleRangeChange}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="body" className="block text-sm font-medium mb-1">
                                바디: {formData.body}/10
                            </label>
                            <input
                                type="range"
                                id="body"
                                name="body"
                                min="1"
                                max="10"
                                value={formData.body}
                                onChange={handleRangeChange}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="bitterness" className="block text-sm font-medium mb-1">
                                쓴맛: {formData.bitterness}/10
                            </label>
                            <input
                                type="range"
                                id="bitterness"
                                name="bitterness"
                                min="1"
                                max="10"
                                value={formData.bitterness}
                                onChange={handleRangeChange}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label htmlFor="overallRating" className="block text-sm font-medium mb-1">
                                전체 평가: {formData.overallRating}/5
                            </label>
                            <input
                                type="range"
                                id="overallRating"
                                name="overallRating"
                                min="1"
                                max="5"
                                value={formData.overallRating}
                                onChange={handleRangeChange}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            플레이버 휠
                        </label>
                        <FlavorWheelSelector
                            selectedLabels={selectedLabelIds}
                            onChange={(labels) => {
                                setSelectedLabelIds(labels);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 노트 섹션 */}
            <div className="space-y-4 pt-6 border-t">
                <h2 className="text-lg font-semibold">노트 & 코멘트</h2>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-1">
                        추가 노트
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full p-2 border rounded-md"
                        placeholder="이 커피에 대한 추가 생각이나 느낌을 자유롭게 기록하세요."
                    />
                </div>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-6 border-t flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center"
                >
                    <Save size={16} className="mr-1" />
                    {isSubmitting ? '저장 중...' : '맛 노트 저장하기'}
                </button>
            </div>
        </form>
    );
} 