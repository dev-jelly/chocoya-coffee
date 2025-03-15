import fs from 'fs';
import path from 'path';
import { CoffeeBean, CrawlingResult } from './types';

/**
 * 지정된 시간(ms) 동안 대기하는 함수
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 문자열에서 숫자만 추출하는 함수
 */
export const extractNumber = (text: string): number => {
  const matches = text.match(/[\d,]+/);
  if (!matches) return 0;
  return parseInt(matches[0].replace(/,/g, ''), 10);
};

/**
 * 텍스트에서 원산지 정보를 추출하는 함수
 */
export const extractOrigins = (text: string): string[] => {
  // 일반적인 원산지 패턴 (예: "에티오피아", "콜롬비아", "브라질" 등)
  const origins = [];
  const originPatterns = [
    '에티오피아', '콜롬비아', '브라질', '과테말라', '코스타리카', 
    '케냐', '인도네시아', '자메이카', '하와이', '예멘', '르완다',
    '탄자니아', '엘살바도르', '온두라스', '니카라과', '파나마'
  ];
  
  for (const pattern of originPatterns) {
    if (text.includes(pattern)) {
      origins.push(pattern);
    }
  }
  
  return origins;
};

/**
 * 텍스트에서 로스팅 레벨을 추출하는 함수
 */
export const extractRoastLevel = (text: string): string | undefined => {
  const roastLevels = [
    '라이트 로스트', '미디엄 로스트', '미디엄 다크 로스트', '다크 로스트',
    '시나몬 로스트', '시티 로스트', '풀 시티 로스트', '프렌치 로스트', '이탈리안 로스트'
  ];
  
  for (const level of roastLevels) {
    if (text.toLowerCase().includes(level.toLowerCase())) {
      return level;
    }
  }
  
  return undefined;
};

/**
 * 텍스트에서 가공 방식을 추출하는 함수
 */
export const extractProcess = (text: string): string | undefined => {
  const processes = [
    '워시드', '내추럴', '허니', '펄프드 내추럴', '세미워시드', '웻 헐드'
  ];
  
  for (const process of processes) {
    if (text.toLowerCase().includes(process.toLowerCase())) {
      return process;
    }
  }
  
  return undefined;
};

/**
 * 텍스트에서 맛 특성을 추출하는 함수
 */
export const extractFlavors = (text: string): string[] => {
  const flavors = [];
  const flavorPatterns = [
    '초콜릿', '견과류', '캐러멜', '과일', '베리', '시트러스', '꽃향', '스파이시',
    '바닐라', '달콤한', '산미', '균형잡힌', '바디감', '고소한', '쌉싸름한'
  ];
  
  for (const pattern of flavorPatterns) {
    if (text.includes(pattern)) {
      flavors.push(pattern);
    }
  }
  
  return flavors;
};

/**
 * 결과를 JSON 파일로 저장하는 함수
 */
export const saveToJson = (data: CrawlingResult, outputPath: string): void => {
  // 디렉토리가 없으면 생성
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // JSON 파일로 저장
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`결과가 ${outputPath}에 저장되었습니다.`);
};

/**
 * 현재 시간을 ISO 문자열로 반환하는 함수
 */
export const getCurrentTimeISOString = (): string => {
  return new Date().toISOString();
};

/**
 * 두 ISO 시간 문자열 사이의 초 단위 차이를 계산하는 함수
 */
export const calculateDurationInSeconds = (startTime: string, endTime: string): number => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return (end - start) / 1000;
}; 