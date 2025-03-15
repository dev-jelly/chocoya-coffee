const axios = require('axios');

/**
 * MCP 클라이언트 테스트
 */
async function main() {
  try {
    // MCP 서버 URL
    const MCP_SERVER_URL = 'http://localhost:3001';
    
    // 함수 목록 조회
    console.log('함수 목록 조회 중...');
    const functionsResponse = await axios.get(`${MCP_SERVER_URL}/functions`);
    console.log('사용 가능한 함수 목록:', functionsResponse.data);
    
    // 크롤링 함수 호출
    console.log('\n크롤링 함수 호출 중...');
    const request = {
      name: 'crawl_naver_smartstore',
      parameters: {
        searchKeywords: '스페셜티 커피',
        maxProductsPerKeyword: '5',
        outputPath: './data/client-example-result.json',
        delayBetweenRequests: '2000'
      }
    };
    
    const invokeResponse = await axios.post(
      `${MCP_SERVER_URL}/invoke`,
      request
    );
    
    // 결과 출력
    console.log('\n크롤링 결과:');
    console.log(`총 상품 수: ${invokeResponse.data.result.totalProducts}`);
    console.log(`성공: ${invokeResponse.data.result.successCount}`);
    console.log(`실패: ${invokeResponse.data.result.failedCount}`);
    console.log(`소요 시간: ${invokeResponse.data.result.duration.toFixed(2)}초`);
    
  } catch (error) {
    console.error('오류 발생:', error);
    if (error.response) {
      console.error('응답 데이터:', error.response.data);
    }
  }
}

// 스크립트 실행
main().catch(console.error); 