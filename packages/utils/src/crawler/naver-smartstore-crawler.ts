import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { CoffeeBean, CrawlerConfig, CrawlingResult } from './types';
import {
  sleep,
  extractNumber,
  extractOrigins,
  extractRoastLevel,
  extractProcess,
  extractFlavors,
  saveToJson,
  getCurrentTimeISOString,
  calculateDurationInSeconds
} from './utils';

// .env 파일 로드
dotenv.config();

/**
 * 환경 변수에서 설정 가져오기
 */
const getConfigFromEnv = (): Partial<CrawlerConfig> => {
  const config: Partial<CrawlerConfig> = {};
  
  // 검색 키워드
  if (process.env.SEARCH_KEYWORDS) {
    config.searchKeywords = process.env.SEARCH_KEYWORDS.split(',').map(k => k.trim());
  }
  
  // 키워드당 최대 상품 수
  if (process.env.MAX_PRODUCTS_PER_KEYWORD) {
    config.maxProductsPerKeyword = parseInt(process.env.MAX_PRODUCTS_PER_KEYWORD, 10);
  }
  
  // 결과 저장 경로
  if (process.env.OUTPUT_PATH) {
    config.outputPath = path.resolve(process.env.OUTPUT_PATH);
  }
  
  // 요청 간 딜레이
  if (process.env.CRAWLER_DELAY) {
    config.delayBetweenRequests = parseInt(process.env.CRAWLER_DELAY, 10);
  }
  
  return config;
};

/**
 * 기본 크롤러 설정
 */
const DEFAULT_CONFIG: CrawlerConfig = {
  searchKeywords: ['원두', '커피원두', '스페셜티 커피', '스페셜티 원두'],
  maxProductsPerKeyword: 20,
  outputPath: path.join(__dirname, '../../../data/coffee-beans.json'),
  delayBetweenRequests: 1000
};

/**
 * 네이버 스마트스토어 크롤러 클래스
 */
class NaverSmartstoreCrawler {
  private config: CrawlerConfig;
  private result: CrawlingResult;
  private browser: Browser | null = null;

  constructor(config: Partial<CrawlerConfig> = {}) {
    // 기본 설정 + 환경 변수 설정 + 사용자 설정 순으로 적용
    const envConfig = getConfigFromEnv();
    this.config = { ...DEFAULT_CONFIG, ...envConfig, ...config };
    
    this.result = {
      totalProducts: 0,
      successCount: 0,
      failedCount: 0,
      products: [],
      errors: [],
      startTime: '',
      endTime: '',
      duration: 0
    };
    
    console.log('크롤러 설정:', {
      searchKeywords: this.config.searchKeywords,
      maxProductsPerKeyword: this.config.maxProductsPerKeyword,
      outputPath: this.config.outputPath,
      delayBetweenRequests: this.config.delayBetweenRequests
    });
  }

  /**
   * 크롤링 시작
   */
  public async start(): Promise<CrawlingResult> {
    this.result.startTime = getCurrentTimeISOString();
    console.log('네이버 스마트스토어 원두 크롤링을 시작합니다...');
    
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      for (const keyword of this.config.searchKeywords) {
        console.log(`키워드 "${keyword}" 검색 중...`);
        await this.crawlByKeyword(keyword);
      }
      
    } catch (error) {
      console.error('크롤링 중 오류가 발생했습니다:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
      
      this.result.endTime = getCurrentTimeISOString();
      this.result.duration = calculateDurationInSeconds(
        this.result.startTime,
        this.result.endTime
      );
      
      // 결과 저장
      saveToJson(this.result, this.config.outputPath);
      
      console.log('크롤링이 완료되었습니다.');
      console.log(`총 ${this.result.totalProducts}개 상품 중 ${this.result.successCount}개 성공, ${this.result.failedCount}개 실패`);
      console.log(`소요 시간: ${this.result.duration.toFixed(2)}초`);
      
      return this.result;
    }
  }

  /**
   * 특정 URL에서 커피 정보 가져오기
   */
  public async getCoffeeInfoFromUrl(url: string): Promise<CoffeeBean | null> {
    this.result.startTime = getCurrentTimeISOString();
    console.log(`URL에서 커피 정보를 가져옵니다: ${url}`);
    
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      });
      
      const product = await this.crawlProductDetail(url);
      
      if (product) {
        console.log(`상품 정보 가져오기 성공: ${product.name}`);
        return product;
      } else {
        console.error('상품 정보를 가져오지 못했습니다.');
        return null;
      }
      
    } catch (error) {
      console.error(`URL에서 커피 정보를 가져오는 중 오류 발생: ${url}`, error);
      return null;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  /**
   * 키워드로 상품 목록 크롤링
   */
  private async crawlByKeyword(keyword: string): Promise<void> {
    if (!this.browser) return;
    
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    try {
      // 네이버 스마트스토어 검색 페이지 접속
      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(keyword)}&cat_id=&frm=NVSHATC`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      // 스크롤 다운하여 더 많은 상품 로드
      await this.scrollDown(page);
      
      // 상품 URL 추출
      const productUrls = await page.evaluate(() => {
        const links: string[] = [];
        const productCards = document.querySelectorAll('.product_item__MDtDF');
        
        productCards.forEach(card => {
          const anchor = card.querySelector('a.product_link__TrAac');
          if (anchor && anchor.getAttribute('href')) {
            links.push(anchor.getAttribute('href') as string);
          }
        });
        
        return links;
      });
      
      console.log(`${productUrls.length}개의 상품 URL을 찾았습니다.`);
      
      // 최대 상품 수 제한
      const limitedUrls = productUrls.slice(0, this.config.maxProductsPerKeyword);
      this.result.totalProducts += limitedUrls.length;
      
      // 각 상품 상세 페이지 크롤링
      for (const url of limitedUrls) {
        try {
          const product = await this.crawlProductDetail(url);
          if (product) {
            this.result.products.push(product);
            this.result.successCount++;
            console.log(`상품 크롤링 성공: ${product.name}`);
          }
        } catch (error) {
          this.result.failedCount++;
          this.result.errors.push({
            url,
            error: error instanceof Error ? error.message : String(error)
          });
          console.error(`상품 크롤링 실패: ${url}`, error);
        }
        
        // 요청 간 딜레이
        await sleep(this.config.delayBetweenRequests);
      }
      
    } catch (error) {
      console.error(`키워드 "${keyword}" 크롤링 중 오류 발생:`, error);
    } finally {
      await page.close();
    }
  }

  /**
   * 페이지 스크롤 다운
   */
  private async scrollDown(page: Page): Promise<void> {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  /**
   * 상품 상세 페이지 크롤링
   */
  private async crawlProductDetail(url: string): Promise<CoffeeBean | null> {
    if (!this.browser) return null;
    
    const page = await this.browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // 상품 ID 추출
      const productId = url.split('/').pop() || '';
      
      // 상품명 추출
      const name = await page.$eval('h3._3oDjSvLwq9', (el: Element) => el.textContent?.trim() || '');
      
      // 브랜드명 추출
      let brand = '';
      try {
        brand = await page.$eval('a._3oDjSvLwq9 span', (el: Element) => el.textContent?.trim() || '');
      } catch (e) {
        // 브랜드명이 없는 경우 무시
      }
      
      // 가격 추출
      const priceText = await page.$eval('span._1LY7DqCnwR', (el: Element) => el.textContent?.trim() || '0');
      const price = extractNumber(priceText);
      
      // 할인가격 추출 (있을 경우)
      let discountPrice: number | undefined;
      try {
        const discountPriceText = await page.$eval('span._3ygr_I_Xas', (el: Element) => el.textContent?.trim() || '0');
        discountPrice = extractNumber(discountPriceText);
      } catch (e) {
        // 할인가격이 없는 경우 무시
      }
      
      // 대표 이미지 URL 추출
      const imageUrl = await page.$eval('img._2RYeHYHcFl', (el: Element) => el.getAttribute('src') || '');
      
      // 상세 이미지 URL 목록 추출
      const detailImages = await page.evaluate(() => {
        const images: string[] = [];
        document.querySelectorAll('div._2Xe0HVhCew img').forEach((img: Element) => {
          const src = img.getAttribute('src');
          if (src) images.push(src);
        });
        return images;
      });
      
      // 상품 설명 추출
      const description = await page.evaluate(() => {
        const descEl = document.querySelector('div._1YShY6EQ56');
        return descEl ? descEl.textContent?.trim() || '' : '';
      });
      
      // HTML 가져오기
      const html = await page.content();
      const $ = cheerio.load(html);
      
      // 상품 정보 추출
      const infoText = $('div._1YShY6EQ56').text();
      
      // 원산지 추출
      const origin = extractOrigins(infoText);
      
      // 로스팅 레벨 추출
      const roastLevel = extractRoastLevel(infoText);
      
      // 가공 방식 추출
      const process = extractProcess(infoText);
      
      // 맛 특성 추출
      const flavor = extractFlavors(infoText);
      
      // 중량 추출 (일반적으로 상품명이나 설명에 포함)
      let weight = '';
      const weightMatches = (name + ' ' + description).match(/(\d+)(\s*)(g|kg|그램|킬로그램)/i);
      if (weightMatches) {
        weight = weightMatches[0];
      }
      
      // 결과 반환
      return {
        id: productId,
        name,
        brand,
        price,
        discountPrice,
        imageUrl,
        detailImages,
        origin,
        roastLevel,
        flavor,
        process,
        description,
        weight,
        url,
        crawledAt: getCurrentTimeISOString()
      };
      
    } catch (error) {
      console.error(`상품 상세 페이지 크롤링 중 오류 발생: ${url}`, error);
      throw error;
    } finally {
      await page.close();
    }
  }

  /**
   * 카테고리 URL에서 상품 리스트 크롤링
   */
  public async crawlCategoryPage(categoryUrl: string): Promise<CrawlingResult> {
    this.result.startTime = getCurrentTimeISOString();
    console.log(`카테고리 페이지 크롤링을 시작합니다: ${categoryUrl}`);
    
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      });
      
      const page = await this.browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      
      // 카테고리 페이지 접속
      await page.goto(categoryUrl, { waitUntil: 'networkidle2' });
      
      // 스크롤 다운하여 더 많은 상품 로드
      await this.scrollDown(page);
      
      // 상품 URL 추출
      const productUrls = await page.evaluate(() => {
        const links: string[] = [];
        const productCards = document.querySelectorAll('.thumbnail_thumb_wrap__RbcYO');
        
        productCards.forEach(card => {
          const anchor = card.closest('a');
          if (anchor && anchor.getAttribute('href')) {
            links.push(anchor.getAttribute('href') as string);
          }
        });
        
        return links;
      });
      
      console.log(`${productUrls.length}개의 상품 URL을 찾았습니다.`);
      
      // 최대 상품 수 제한
      const limitedUrls = productUrls.slice(0, this.config.maxProductsPerKeyword);
      this.result.totalProducts += limitedUrls.length;
      
      // 각 상품 상세 페이지 크롤링
      for (const url of limitedUrls) {
        try {
          const product = await this.crawlProductDetail(url);
          if (product) {
            this.result.products.push(product);
            this.result.successCount++;
            console.log(`상품 크롤링 성공: ${product.name}`);
          }
        } catch (error) {
          this.result.failedCount++;
          this.result.errors.push({
            url,
            error: error instanceof Error ? error.message : String(error)
          });
          console.error(`상품 크롤링 실패: ${url}`, error);
        }
        
        // 요청 간 딜레이
        await sleep(this.config.delayBetweenRequests);
      }
      
      await page.close();
      
    } catch (error) {
      console.error('카테고리 페이지 크롤링 중 오류가 발생했습니다:', error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
      
      this.result.endTime = getCurrentTimeISOString();
      this.result.duration = calculateDurationInSeconds(
        this.result.startTime,
        this.result.endTime
      );
      
      // 결과 저장
      saveToJson(this.result, this.config.outputPath);
      
      console.log('크롤링이 완료되었습니다.');
      console.log(`총 ${this.result.totalProducts}개 상품 중 ${this.result.successCount}개 성공, ${this.result.failedCount}개 실패`);
      console.log(`소요 시간: ${this.result.duration.toFixed(2)}초`);
      
      return this.result;
    }
  }
}

/**
 * 메인 함수
 */
async function main() {
  const crawler = new NaverSmartstoreCrawler();
  await crawler.start();
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main().catch(console.error);
}

export default NaverSmartstoreCrawler; 