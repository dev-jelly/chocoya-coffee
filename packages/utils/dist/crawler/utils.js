"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDurationInSeconds = exports.getCurrentTimeISOString = exports.saveToJson = exports.extractFlavors = exports.extractProcess = exports.extractRoastLevel = exports.extractOrigins = exports.extractNumber = exports.sleep = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
/**
 * 지정된 시간(ms) 동안 대기하는 함수
 */
var sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.sleep = sleep;
/**
 * 문자열에서 숫자만 추출하는 함수
 */
var extractNumber = function (text) {
    var matches = text.match(/[\d,]+/);
    if (!matches)
        return 0;
    return parseInt(matches[0].replace(/,/g, ''), 10);
};
exports.extractNumber = extractNumber;
/**
 * 텍스트에서 원산지 정보를 추출하는 함수
 */
var extractOrigins = function (text) {
    // 일반적인 원산지 패턴 (예: "에티오피아", "콜롬비아", "브라질" 등)
    var origins = [];
    var originPatterns = [
        '에티오피아', '콜롬비아', '브라질', '과테말라', '코스타리카',
        '케냐', '인도네시아', '자메이카', '하와이', '예멘', '르완다',
        '탄자니아', '엘살바도르', '온두라스', '니카라과', '파나마'
    ];
    for (var _i = 0, originPatterns_1 = originPatterns; _i < originPatterns_1.length; _i++) {
        var pattern = originPatterns_1[_i];
        if (text.includes(pattern)) {
            origins.push(pattern);
        }
    }
    return origins;
};
exports.extractOrigins = extractOrigins;
/**
 * 텍스트에서 로스팅 레벨을 추출하는 함수
 */
var extractRoastLevel = function (text) {
    var roastLevels = [
        '라이트 로스트', '미디엄 로스트', '미디엄 다크 로스트', '다크 로스트',
        '시나몬 로스트', '시티 로스트', '풀 시티 로스트', '프렌치 로스트', '이탈리안 로스트'
    ];
    for (var _i = 0, roastLevels_1 = roastLevels; _i < roastLevels_1.length; _i++) {
        var level = roastLevels_1[_i];
        if (text.toLowerCase().includes(level.toLowerCase())) {
            return level;
        }
    }
    return undefined;
};
exports.extractRoastLevel = extractRoastLevel;
/**
 * 텍스트에서 가공 방식을 추출하는 함수
 */
var extractProcess = function (text) {
    var processes = [
        '워시드', '내추럴', '허니', '펄프드 내추럴', '세미워시드', '웻 헐드'
    ];
    for (var _i = 0, processes_1 = processes; _i < processes_1.length; _i++) {
        var process_1 = processes_1[_i];
        if (text.toLowerCase().includes(process_1.toLowerCase())) {
            return process_1;
        }
    }
    return undefined;
};
exports.extractProcess = extractProcess;
/**
 * 텍스트에서 맛 특성을 추출하는 함수
 */
var extractFlavors = function (text) {
    var flavors = [];
    var flavorPatterns = [
        '초콜릿', '견과류', '캐러멜', '과일', '베리', '시트러스', '꽃향', '스파이시',
        '바닐라', '달콤한', '산미', '균형잡힌', '바디감', '고소한', '쌉싸름한'
    ];
    for (var _i = 0, flavorPatterns_1 = flavorPatterns; _i < flavorPatterns_1.length; _i++) {
        var pattern = flavorPatterns_1[_i];
        if (text.includes(pattern)) {
            flavors.push(pattern);
        }
    }
    return flavors;
};
exports.extractFlavors = extractFlavors;
/**
 * 결과를 JSON 파일로 저장하는 함수
 */
var saveToJson = function (data, outputPath) {
    // 디렉토리가 없으면 생성
    var dir = path_1.default.dirname(outputPath);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
    // JSON 파일로 저장
    fs_1.default.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("\uACB0\uACFC\uAC00 ".concat(outputPath, "\uC5D0 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
};
exports.saveToJson = saveToJson;
/**
 * 현재 시간을 ISO 문자열로 반환하는 함수
 */
var getCurrentTimeISOString = function () {
    return new Date().toISOString();
};
exports.getCurrentTimeISOString = getCurrentTimeISOString;
/**
 * 두 ISO 시간 문자열 사이의 초 단위 차이를 계산하는 함수
 */
var calculateDurationInSeconds = function (startTime, endTime) {
    var start = new Date(startTime).getTime();
    var end = new Date(endTime).getTime();
    return (end - start) / 1000;
};
exports.calculateDurationInSeconds = calculateDurationInSeconds;
