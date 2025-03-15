import { CoffeeBean, CrawlerConfig, CrawlingResult } from './types';
/**
 * 네이버 스마트스토어 크롤러 클래스
 */
declare class NaverSmartstoreCrawler {
    private config;
    private result;
    private browser;
    constructor(config?: Partial<CrawlerConfig>);
    /**
     * 크롤링 시작
     */
    start(): Promise<CrawlingResult>;
    /**
     * 특정 URL에서 커피 정보 가져오기
     */
    getCoffeeInfoFromUrl(url: string): Promise<CoffeeBean | null>;
    /**
     * 키워드로 상품 목록 크롤링
     */
    private crawlByKeyword;
    /**
     * 페이지 스크롤 다운
     */
    private scrollDown;
    /**
     * 상품 상세 페이지 크롤링
     */
    private crawlProductDetail;
    /**
     * 카테고리 URL에서 상품 리스트 크롤링
     */
    crawlCategoryPage(categoryUrl: string): Promise<CrawlingResult>;
}
export default NaverSmartstoreCrawler;
