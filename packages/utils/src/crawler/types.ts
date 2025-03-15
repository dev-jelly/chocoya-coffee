/**
 * 원두 정보를 담는 인터페이스
 */
export interface CoffeeBean {
  id: string;                  // 상품 ID
  name: string;                // 상품명
  brand: string;               // 브랜드명
  price: number;               // 가격
  discountPrice?: number;      // 할인가격 (있을 경우)
  imageUrl: string;            // 대표 이미지 URL
  detailImages: string[];      // 상세 이미지 URL 목록
  origin: string[];            // 원산지
  roastLevel?: string;         // 로스팅 레벨
  flavor?: string[];           // 맛 특성
  process?: string;            // 가공 방식
  description: string;         // 상품 설명
  weight: string;              // 중량
  url: string;                 // 상품 URL
  crawledAt: string;           // 크롤링 시간
}

/**
 * 크롤링 설정 인터페이스
 */
export interface CrawlerConfig {
  searchKeywords: string[];    // 검색 키워드 목록
  maxProductsPerKeyword: number; // 키워드당 최대 상품 수
  outputPath: string;          // 결과 저장 경로
  delayBetweenRequests: number; // 요청 간 딜레이 (ms)
}

/**
 * 크롤링 결과 인터페이스
 */
export interface CrawlingResult {
  totalProducts: number;       // 총 크롤링된 상품 수
  successCount: number;        // 성공적으로 크롤링된 상품 수
  failedCount: number;         // 실패한 크롤링 수
  products: CoffeeBean[];      // 크롤링된 상품 목록
  errors: Array<{              // 에러 목록
    url: string;
    error: string;
  }>;
  startTime: string;           // 크롤링 시작 시간
  endTime: string;             // 크롤링 종료 시간
  duration: number;            // 소요 시간 (초)
} 