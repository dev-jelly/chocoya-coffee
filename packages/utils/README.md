# @chocoya-coffee/utils

초코야 커피 프로젝트의 유틸리티 패키지입니다.

## 기능

- 네이버 스마트스토어 원두 크롤러: 네이버 스마트스토어에서 원두 정보를 크롤링하여 JSON 형태로 저장합니다.
- URL 기반 커피 정보 추출: 특정 네이버 스마트스토어 URL에서 원두 정보를 추출하여 JSON으로 제공합니다.
- 카테고리 기반 상품 리스트 크롤링: 네이버 스마트스토어 카테고리 URL에서 상품 리스트를 크롤링합니다.

## 설치

```bash
# 프로젝트 루트에서 실행
pnpm install
```

## 사용 방법

### 네이버 스마트스토어 원두 크롤러

```bash
# 프로젝트 루트에서 실행
pnpm --filter @chocoya-coffee/utils crawl
```

또는 직접 코드에서 사용:

```typescript
import { NaverSmartstoreCrawler } from '@chocoya-coffee/utils';

async function main() {
  const crawler = new NaverSmartstoreCrawler({
    searchKeywords: ['스페셜티 커피', '원두'],
    maxProductsPerKeyword: 10,
    outputPath: './data/my-coffee-beans.json',
    delayBetweenRequests: 1500
  });
  
  const result = await crawler.start();
  console.log(`총 ${result.totalProducts}개 상품 중 ${result.successCount}개 성공`);
}

main().catch(console.error);
```

### URL에서 커피 정보 가져오기

특정 네이버 스마트스토어 URL에서 원두 정보를 가져올 수 있습니다.

```bash
# 프로젝트 루트에서 실행
pnpm --filter @chocoya-coffee/utils coffee:url "https://smartstore.naver.com/[상품URL]"
```

또는 직접 코드에서 사용:

```typescript
import { NaverSmartstoreCrawler } from '@chocoya-coffee/utils';

async function main() {
  const url = 'https://smartstore.naver.com/[상품URL]';
  const crawler = new NaverSmartstoreCrawler();
  
  const coffeeInfo = await crawler.getCoffeeInfoFromUrl(url);
  if (coffeeInfo) {
    console.log('커피 정보:', coffeeInfo);
  }
}

main().catch(console.error);
```

### 카테고리 URL에서 상품 리스트 크롤링

네이버 스마트스토어 카테고리 URL에서 상품 리스트를 크롤링할 수 있습니다.

```bash
# 프로젝트 루트에서 실행
pnpm --filter @chocoya-coffee/utils coffee:category "https://smartstore.naver.com/[스토어명]/category/[카테고리ID]"
```

또는 직접 코드에서 사용:

```typescript
import { NaverSmartstoreCrawler } from '@chocoya-coffee/utils';

async function main() {
  const categoryUrl = 'https://smartstore.naver.com/[스토어명]/category/[카테고리ID]';
  const crawler = new NaverSmartstoreCrawler({
    maxProductsPerKeyword: 10,
    outputPath: './data/category-products.json',
    delayBetweenRequests: 1500
  });
  
  const result = await crawler.crawlCategoryPage(categoryUrl);
  console.log(`총 ${result.totalProducts}개 상품 중 ${result.successCount}개 성공`);
}

main().catch(console.error);
```

## 개발

```bash
# 개발 모드로 실행 (파일 변경 감지)
pnpm --filter @chocoya-coffee/utils dev

# 빌드
pnpm --filter @chocoya-coffee/utils build

# 린트 검사
pnpm --filter @chocoya-coffee/utils lint
```

## 데이터 형식

크롤링된 데이터는 다음과 같은 형식의 JSON 파일로 저장됩니다:

```typescript
interface CoffeeBean {
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
```

## 주의사항

- 크롤링은 해당 웹사이트의 이용약관을 준수하여 사용해야 합니다.
- 과도한 요청은 IP 차단의 원인이 될 수 있으므로 `delayBetweenRequests` 값을 적절히 조정하세요.
- 상업적 용도로 사용 시 법적 문제가 발생할 수 있습니다. 