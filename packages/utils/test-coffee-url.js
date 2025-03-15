const { NaverSmartstoreCrawler } = require('./dist/index');
const fs = require('fs');
const path = require('path');

/**
 * URL에서 커피 정보를 가져오는 테스트
 */
async function main() {
  // 테스트할 URL
  const url = process.argv[2];
  
  if (!url) {
    console.error('사용법: node test-coffee-url.js <스마트스토어_URL>');
    process.exit(1);
  }
  
  console.log(`URL에서 커피 정보를 가져옵니다: ${url}`);
  
  try {
    // 크롤러 생성
    const crawler = new NaverSmartstoreCrawler();
    
    // URL에서 커피 정보 가져오기
    const coffeeInfo = await crawler.getCoffeeInfoFromUrl(url);
    
    if (coffeeInfo) {
      console.log('\n커피 정보:');
      console.log(`이름: ${coffeeInfo.name}`);
      console.log(`브랜드: ${coffeeInfo.brand}`);
      console.log(`가격: ${coffeeInfo.price.toLocaleString()}원`);
      
      if (coffeeInfo.discountPrice) {
        console.log(`할인가: ${coffeeInfo.discountPrice.toLocaleString()}원`);
      }
      
      console.log(`원산지: ${coffeeInfo.origin.join(', ')}`);
      
      if (coffeeInfo.roastLevel) {
        console.log(`로스팅 레벨: ${coffeeInfo.roastLevel}`);
      }
      
      if (coffeeInfo.process) {
        console.log(`가공 방식: ${coffeeInfo.process}`);
      }
      
      if (coffeeInfo.flavor && coffeeInfo.flavor.length > 0) {
        console.log(`맛 특성: ${coffeeInfo.flavor.join(', ')}`);
      }
      
      console.log(`중량: ${coffeeInfo.weight}`);
      
      // 결과를 JSON 파일로 저장
      const outputDir = path.join(__dirname, 'data');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, 'coffee-info.json');
      fs.writeFileSync(outputPath, JSON.stringify(coffeeInfo, null, 2), 'utf8');
      console.log(`\n결과가 ${outputPath}에 저장되었습니다.`);
    } else {
      console.error('커피 정보를 가져오지 못했습니다.');
    }
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

// 스크립트 실행
main().catch(console.error); 