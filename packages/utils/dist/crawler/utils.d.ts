import { CrawlingResult } from './types';
/**
 * 지정된 시간(ms) 동안 대기하는 함수
 */
export declare const sleep: (ms: number) => Promise<void>;
/**
 * 문자열에서 숫자만 추출하는 함수
 */
export declare const extractNumber: (text: string) => number;
/**
 * 텍스트에서 원산지 정보를 추출하는 함수
 */
export declare const extractOrigins: (text: string) => string[];
/**
 * 텍스트에서 로스팅 레벨을 추출하는 함수
 */
export declare const extractRoastLevel: (text: string) => string | undefined;
/**
 * 텍스트에서 가공 방식을 추출하는 함수
 */
export declare const extractProcess: (text: string) => string | undefined;
/**
 * 텍스트에서 맛 특성을 추출하는 함수
 */
export declare const extractFlavors: (text: string) => string[];
/**
 * 결과를 JSON 파일로 저장하는 함수
 */
export declare const saveToJson: (data: CrawlingResult, outputPath: string) => void;
/**
 * 현재 시간을 ISO 문자열로 반환하는 함수
 */
export declare const getCurrentTimeISOString: () => string;
/**
 * 두 ISO 시간 문자열 사이의 초 단위 차이를 계산하는 함수
 */
export declare const calculateDurationInSeconds: (startTime: string, endTime: string) => number;
