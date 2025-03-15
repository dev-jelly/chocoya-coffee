/**
 * 원두 정보를 담는 인터페이스
 */
export interface CoffeeBean {
    id: string;
    name: string;
    brand: string;
    price: number;
    discountPrice?: number;
    imageUrl: string;
    detailImages: string[];
    origin: string[];
    roastLevel?: string;
    flavor?: string[];
    process?: string;
    description: string;
    weight: string;
    url: string;
    crawledAt: string;
}
/**
 * 크롤링 설정 인터페이스
 */
export interface CrawlerConfig {
    searchKeywords: string[];
    maxProductsPerKeyword: number;
    outputPath: string;
    delayBetweenRequests: number;
}
/**
 * 크롤링 결과 인터페이스
 */
export interface CrawlingResult {
    totalProducts: number;
    successCount: number;
    failedCount: number;
    products: CoffeeBean[];
    errors: Array<{
        url: string;
        error: string;
    }>;
    startTime: string;
    endTime: string;
    duration: number;
}
