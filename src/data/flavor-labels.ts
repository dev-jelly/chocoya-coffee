// SCA Flavor Wheel을 기반으로 한 맛 노트 레이블 데이터
// 참고: https://www.specialty.jp/media/wheel.pdf

export type FlavorCategory = 'fruit' | 'floral' | 'sweet' | 'nutty' | 'spice' | 'roasted' | 'other';

export type FlavorLabel = {
  id: string;
  name: string;  // 한국어 이름
  englishName: string;  // 영어 이름
  color: string;  // HEX 색상값
  category: FlavorCategory;
  description?: string;  // 간단한 설명
};

// JSON에서 데이터 가져오기
import flavorLabelsData from './flavor-labels.json';

// 타입 캐스팅을 통해 JSON 데이터의 category를 FlavorCategory로 처리
export const flavorLabels: FlavorLabel[] = flavorLabelsData.flavorLabels.map(label => ({
  ...label,
  category: label.category as FlavorCategory
})); 