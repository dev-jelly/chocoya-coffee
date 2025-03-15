const { NaverSmartstoreCrawler } = require('./dist/index');
const fs = require('fs');
const path = require('path');

/**
 * 카테고리 URL에서 상품 리스트를 크롤링하는 테스트
 */
async function main() {
  // 테스트할 카테고리 URL
  const categoryUrl = process.argv[2];
  
  if (!categoryUrl) {
    console.error('사용법: node test-category-url.js <카테고리_URL>');
    process.exit(1);
  }
  
  console.log(`카테고리 URL에서 상품 리스트를 크롤링합니다: ${categoryUrl}`);
  
  try {
    // 크롤러 생성
    const crawler = new NaverSmartstoreCrawler({
      maxProductsPerKeyword: 10, // 최대 10개 상품만 크롤링
      outputPath: './data/category-products.json',
      delayBetweenRequests: 1500 // 요청 간 1.5초 딜레이
    });
    
    // 카테고리 페이지 크롤링
    const result = await crawler.crawlCategoryPage(categoryUrl);
    
    console.log('\n크롤링 결과:');
    console.log(`총 ${result.totalProducts}개 상품 중 ${result.successCount}개 성공, ${result.failedCount}개 실패`);
    console.log(`소요 시간: ${result.duration.toFixed(2)}초`);
    console.log(`결과가 ${crawler.config.outputPath}에 저장되었습니다.`);
    
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
main().catch(console.error); 