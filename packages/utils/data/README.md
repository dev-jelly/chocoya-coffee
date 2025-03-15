# 네이버 스마트스토어 원두 데이터

이 디렉토리는 네이버 스마트스토어에서 크롤링한 원두 정보를 JSON 형태로 저장하는 곳입니다.

## 파일 구조

- `coffee-beans.json`: 크롤링된 원두 정보가 저장된 JSON 파일

## 데이터 형식

```json
{
  "totalProducts": 80,
  "successCount": 75,
  "failedCount": 5,
  "products": [
    {
      "id": "1234567890",
      "name": "에티오피아 예가체프 G1 내추럴",
      "brand": "커피브랜드",
      "price": 15000,
      "discountPrice": 12000,
      "imageUrl": "https://example.com/image.jpg",
      "detailImages": [
        "https://example.com/detail1.jpg",
        "https://example.com/detail2.jpg"
      ],
      "origin": ["에티오피아"],
      "roastLevel": "미디엄 로스트",
      "flavor": ["초콜릿", "베리"],
      "process": "내추럴",
      "description": "에티오피아 예가체프 지역에서 재배된 G1 등급의 원두입니다.",
      "weight": "200g",
      "url": "https://smartstore.naver.com/...",
      "crawledAt": "2023-03-15T12:34:56.789Z"
    },
    // ... 더 많은 상품 정보
  ],
  "errors": [
    {
      "url": "https://smartstore.naver.com/...",
      "error": "상품 정보를 찾을 수 없습니다."
    }
  ],
  "startTime": "2023-03-15T12:00:00.000Z",
  "endTime": "2023-03-15T12:30:00.000Z",
  "duration": 1800
}
```

## 사용 방법

이 데이터는 데이터베이스 임포트 등의 용도로 사용할 수 있습니다. 