// SCA Flavor Wheel을 기반으로 한 맛 노트 레이블 데이터
// 참고: https://www.specialty.jp/media/wheel.pdf

// 플레이버 휠 타입 정의
export interface FlavorName {
  en: string;
  ko: string;
}

export interface FlavorDetail {
  en: string;
  ko: string;
  colorCode: string;
}

export interface Subcategory {
  name: FlavorName;
  colorCode: string;
  flavors?: FlavorDetail[];
}

export interface Category {
  name: FlavorName;
  colorCode: string;
  subcategories: Subcategory[];
}

export interface FlavorWheel {
  title: FlavorName & { colorCode: string };
  categories: Category[];
  credits: FlavorName & { colorCode: string };
}

// 기존 FlavorLabel 타입은 하위 호환성을 위해 유지
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
import flavorWheelData from './flavor-labels.json';

// 전체 플레이버 휠 데이터 내보내기
export const flavorWheel: FlavorWheel = flavorWheelData.flavorWheel;

// 기존 형식의 flavor labels을 생성하는 함수 (하위 호환성)
export const generateFlavorLabels = (): FlavorLabel[] => {
  const labels: FlavorLabel[] = [];
  let id = 0;

  flavorWheel.categories.forEach(category => {
    // 카테고리 매핑 (필요한 경우 확장)
    const categoryMapping: Record<string, FlavorCategory> = {
      'Floral': 'floral',
      'Fruit': 'fruit',
      'Sweet': 'sweet',
      'Nutty/Cocoa': 'nutty',
      'Spices': 'spice',
      'Roasted': 'roasted',
      'Sour/Fermented': 'other',
      'Green/Vegetative': 'other',
      'Other': 'other'
    };

    // 각 카테고리의 서브카테고리 추가
    category.subcategories.forEach(subcategory => {
      // 기본 서브카테고리를 라벨로 추가
      labels.push({
        id: `flavor-${id++}`,
        name: subcategory.name.ko,
        englishName: subcategory.name.en,
        color: subcategory.colorCode,
        category: categoryMapping[category.name.en] || 'other',
        description: `${category.name.ko} > ${subcategory.name.ko}`
      });

      // 서브카테고리의 상세 맛 추가 (있는 경우)
      if (subcategory.flavors) {
        subcategory.flavors.forEach(flavor => {
          labels.push({
            id: `flavor-${id++}`,
            name: flavor.ko,
            englishName: flavor.en,
            color: flavor.colorCode,
            category: categoryMapping[category.name.en] || 'other',
            description: `${category.name.ko} > ${subcategory.name.ko} > ${flavor.ko}`
          });
        });
      }
    });
  });

  return labels;
};

// 기존 방식과 호환되는 flavorLabels 내보내기
export const flavorLabels: FlavorLabel[] = generateFlavorLabels(); 