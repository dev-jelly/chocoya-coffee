"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = __importDefault(require("puppeteer"));
var cheerio = __importStar(require("cheerio"));
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var utils_1 = require("./utils");
// .env 파일 로드
dotenv_1.default.config();
/**
 * 환경 변수에서 설정 가져오기
 */
var getConfigFromEnv = function () {
    var config = {};
    // 검색 키워드
    if (process.env.SEARCH_KEYWORDS) {
        config.searchKeywords = process.env.SEARCH_KEYWORDS.split(',').map(function (k) { return k.trim(); });
    }
    // 키워드당 최대 상품 수
    if (process.env.MAX_PRODUCTS_PER_KEYWORD) {
        config.maxProductsPerKeyword = parseInt(process.env.MAX_PRODUCTS_PER_KEYWORD, 10);
    }
    // 결과 저장 경로
    if (process.env.OUTPUT_PATH) {
        config.outputPath = path_1.default.resolve(process.env.OUTPUT_PATH);
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
var DEFAULT_CONFIG = {
    searchKeywords: ['원두', '커피원두', '스페셜티 커피', '스페셜티 원두'],
    maxProductsPerKeyword: 20,
    outputPath: path_1.default.join(__dirname, '../../../data/coffee-beans.json'),
    delayBetweenRequests: 1000
};
/**
 * 네이버 스마트스토어 크롤러 클래스
 */
var NaverSmartstoreCrawler = /** @class */ (function () {
    function NaverSmartstoreCrawler(config) {
        if (config === void 0) { config = {}; }
        this.browser = null;
        // 기본 설정 + 환경 변수 설정 + 사용자 설정 순으로 적용
        var envConfig = getConfigFromEnv();
        this.config = __assign(__assign(__assign({}, DEFAULT_CONFIG), envConfig), config);
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
    NaverSmartstoreCrawler.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _i, _b, keyword, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.result.startTime = (0, utils_1.getCurrentTimeISOString)();
                        console.log('네이버 스마트스토어 원두 크롤링을 시작합니다...');
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 7, 8, 11]);
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                headless: true,
                                args: ['--no-sandbox', '--disable-setuid-sandbox']
                            })];
                    case 2:
                        _a.browser = _c.sent();
                        _i = 0, _b = this.config.searchKeywords;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _b.length)) return [3 /*break*/, 6];
                        keyword = _b[_i];
                        console.log("\uD0A4\uC6CC\uB4DC \"".concat(keyword, "\" \uAC80\uC0C9 \uC911..."));
                        return [4 /*yield*/, this.crawlByKeyword(keyword)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        error_1 = _c.sent();
                        console.error('크롤링 중 오류가 발생했습니다:', error_1);
                        return [3 /*break*/, 11];
                    case 8:
                        if (!this.browser) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.browser.close()];
                    case 9:
                        _c.sent();
                        _c.label = 10;
                    case 10:
                        this.result.endTime = (0, utils_1.getCurrentTimeISOString)();
                        this.result.duration = (0, utils_1.calculateDurationInSeconds)(this.result.startTime, this.result.endTime);
                        // 결과 저장
                        (0, utils_1.saveToJson)(this.result, this.config.outputPath);
                        console.log('크롤링이 완료되었습니다.');
                        console.log("\uCD1D ".concat(this.result.totalProducts, "\uAC1C \uC0C1\uD488 \uC911 ").concat(this.result.successCount, "\uAC1C \uC131\uACF5, ").concat(this.result.failedCount, "\uAC1C \uC2E4\uD328"));
                        console.log("\uC18C\uC694 \uC2DC\uAC04: ".concat(this.result.duration.toFixed(2), "\uCD08"));
                        return [2 /*return*/, this.result];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 특정 URL에서 커피 정보 가져오기
     */
    NaverSmartstoreCrawler.prototype.getCoffeeInfoFromUrl = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, product, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.result.startTime = (0, utils_1.getCurrentTimeISOString)();
                        console.log("URL\uC5D0\uC11C \uCEE4\uD53C \uC815\uBCF4\uB97C \uAC00\uC838\uC635\uB2C8\uB2E4: ".concat(url));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, 5, 8]);
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                headless: true,
                                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
                            })];
                    case 2:
                        _a.browser = _b.sent();
                        return [4 /*yield*/, this.crawlProductDetail(url)];
                    case 3:
                        product = _b.sent();
                        if (product) {
                            console.log("\uC0C1\uD488 \uC815\uBCF4 \uAC00\uC838\uC624\uAE30 \uC131\uACF5: ".concat(product.name));
                            return [2 /*return*/, product];
                        }
                        else {
                            console.error('상품 정보를 가져오지 못했습니다.');
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        error_2 = _b.sent();
                        console.error("URL\uC5D0\uC11C \uCEE4\uD53C \uC815\uBCF4\uB97C \uAC00\uC838\uC624\uB294 \uC911 \uC624\uB958 \uBC1C\uC0DD: ".concat(url), error_2);
                        return [2 /*return*/, null];
                    case 5:
                        if (!this.browser) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.browser.close()];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7: return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 키워드로 상품 목록 크롤링
     */
    NaverSmartstoreCrawler.prototype.crawlByKeyword = function (keyword) {
        return __awaiter(this, void 0, void 0, function () {
            var page, searchUrl, productUrls, limitedUrls, _i, limitedUrls_1, url, product, error_3, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1366, height: 768 })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 15, 16, 18]);
                        searchUrl = "https://search.shopping.naver.com/search/all?query=".concat(encodeURIComponent(keyword), "&cat_id=&frm=NVSHATC");
                        return [4 /*yield*/, page.goto(searchUrl, { waitUntil: 'networkidle2' })];
                    case 4:
                        _a.sent();
                        // 스크롤 다운하여 더 많은 상품 로드
                        return [4 /*yield*/, this.scrollDown(page)];
                    case 5:
                        // 스크롤 다운하여 더 많은 상품 로드
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var links = [];
                                var productCards = document.querySelectorAll('.product_item__MDtDF');
                                productCards.forEach(function (card) {
                                    var anchor = card.querySelector('a.product_link__TrAac');
                                    if (anchor && anchor.getAttribute('href')) {
                                        links.push(anchor.getAttribute('href'));
                                    }
                                });
                                return links;
                            })];
                    case 6:
                        productUrls = _a.sent();
                        console.log("".concat(productUrls.length, "\uAC1C\uC758 \uC0C1\uD488 URL\uC744 \uCC3E\uC558\uC2B5\uB2C8\uB2E4."));
                        limitedUrls = productUrls.slice(0, this.config.maxProductsPerKeyword);
                        this.result.totalProducts += limitedUrls.length;
                        _i = 0, limitedUrls_1 = limitedUrls;
                        _a.label = 7;
                    case 7:
                        if (!(_i < limitedUrls_1.length)) return [3 /*break*/, 14];
                        url = limitedUrls_1[_i];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.crawlProductDetail(url)];
                    case 9:
                        product = _a.sent();
                        if (product) {
                            this.result.products.push(product);
                            this.result.successCount++;
                            console.log("\uC0C1\uD488 \uD06C\uB864\uB9C1 \uC131\uACF5: ".concat(product.name));
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        error_3 = _a.sent();
                        this.result.failedCount++;
                        this.result.errors.push({
                            url: url,
                            error: error_3 instanceof Error ? error_3.message : String(error_3)
                        });
                        console.error("\uC0C1\uD488 \uD06C\uB864\uB9C1 \uC2E4\uD328: ".concat(url), error_3);
                        return [3 /*break*/, 11];
                    case 11: 
                    // 요청 간 딜레이
                    return [4 /*yield*/, (0, utils_1.sleep)(this.config.delayBetweenRequests)];
                    case 12:
                        // 요청 간 딜레이
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        _i++;
                        return [3 /*break*/, 7];
                    case 14: return [3 /*break*/, 18];
                    case 15:
                        error_4 = _a.sent();
                        console.error("\uD0A4\uC6CC\uB4DC \"".concat(keyword, "\" \uD06C\uB864\uB9C1 \uC911 \uC624\uB958 \uBC1C\uC0DD:"), error_4);
                        return [3 /*break*/, 18];
                    case 16: return [4 /*yield*/, page.close()];
                    case 17:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 페이지 스크롤 다운
     */
    NaverSmartstoreCrawler.prototype.scrollDown = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.evaluate(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                            var totalHeight = 0;
                                            var distance = 100;
                                            var timer = setInterval(function () {
                                                var scrollHeight = document.body.scrollHeight;
                                                window.scrollBy(0, distance);
                                                totalHeight += distance;
                                                if (totalHeight >= scrollHeight) {
                                                    clearInterval(timer);
                                                    resolve();
                                                }
                                            }, 100);
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 상품 상세 페이지 크롤링
     */
    NaverSmartstoreCrawler.prototype.crawlProductDetail = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var page, productId, name_1, brand, e_1, priceText, price, discountPrice, discountPriceText, e_2, imageUrl, detailImages, description, html, $, infoText, origin_1, roastLevel, process_1, flavor, weight, weightMatches, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.browser)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1366, height: 768 })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 19, 20, 22]);
                        return [4 /*yield*/, page.goto(url, { waitUntil: 'networkidle2' })];
                    case 4:
                        _a.sent();
                        productId = url.split('/').pop() || '';
                        return [4 /*yield*/, page.$eval('h3._3oDjSvLwq9', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                    case 5:
                        name_1 = _a.sent();
                        brand = '';
                        _a.label = 6;
                    case 6:
                        _a.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, page.$eval('a._3oDjSvLwq9 span', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ''; })];
                    case 7:
                        brand = _a.sent();
                        return [3 /*break*/, 9];
                    case 8:
                        e_1 = _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [4 /*yield*/, page.$eval('span._1LY7DqCnwR', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '0'; })];
                    case 10:
                        priceText = _a.sent();
                        price = (0, utils_1.extractNumber)(priceText);
                        discountPrice = void 0;
                        _a.label = 11;
                    case 11:
                        _a.trys.push([11, 13, , 14]);
                        return [4 /*yield*/, page.$eval('span._3ygr_I_Xas', function (el) { var _a; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '0'; })];
                    case 12:
                        discountPriceText = _a.sent();
                        discountPrice = (0, utils_1.extractNumber)(discountPriceText);
                        return [3 /*break*/, 14];
                    case 13:
                        e_2 = _a.sent();
                        return [3 /*break*/, 14];
                    case 14: return [4 /*yield*/, page.$eval('img._2RYeHYHcFl', function (el) { return el.getAttribute('src') || ''; })];
                    case 15:
                        imageUrl = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var images = [];
                                document.querySelectorAll('div._2Xe0HVhCew img').forEach(function (img) {
                                    var src = img.getAttribute('src');
                                    if (src)
                                        images.push(src);
                                });
                                return images;
                            })];
                    case 16:
                        detailImages = _a.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var _a;
                                var descEl = document.querySelector('div._1YShY6EQ56');
                                return descEl ? ((_a = descEl.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '' : '';
                            })];
                    case 17:
                        description = _a.sent();
                        return [4 /*yield*/, page.content()];
                    case 18:
                        html = _a.sent();
                        $ = cheerio.load(html);
                        infoText = $('div._1YShY6EQ56').text();
                        origin_1 = (0, utils_1.extractOrigins)(infoText);
                        roastLevel = (0, utils_1.extractRoastLevel)(infoText);
                        process_1 = (0, utils_1.extractProcess)(infoText);
                        flavor = (0, utils_1.extractFlavors)(infoText);
                        weight = '';
                        weightMatches = (name_1 + ' ' + description).match(/(\d+)(\s*)(g|kg|그램|킬로그램)/i);
                        if (weightMatches) {
                            weight = weightMatches[0];
                        }
                        // 결과 반환
                        return [2 /*return*/, {
                                id: productId,
                                name: name_1,
                                brand: brand,
                                price: price,
                                discountPrice: discountPrice,
                                imageUrl: imageUrl,
                                detailImages: detailImages,
                                origin: origin_1,
                                roastLevel: roastLevel,
                                flavor: flavor,
                                process: process_1,
                                description: description,
                                weight: weight,
                                url: url,
                                crawledAt: (0, utils_1.getCurrentTimeISOString)()
                            }];
                    case 19:
                        error_5 = _a.sent();
                        console.error("\uC0C1\uD488 \uC0C1\uC138 \uD398\uC774\uC9C0 \uD06C\uB864\uB9C1 \uC911 \uC624\uB958 \uBC1C\uC0DD: ".concat(url), error_5);
                        throw error_5;
                    case 20: return [4 /*yield*/, page.close()];
                    case 21:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 카테고리 URL에서 상품 리스트 크롤링
     */
    NaverSmartstoreCrawler.prototype.crawlCategoryPage = function (categoryUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, productUrls, limitedUrls, _i, limitedUrls_2, url, product, error_6, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.result.startTime = (0, utils_1.getCurrentTimeISOString)();
                        console.log("\uCE74\uD14C\uACE0\uB9AC \uD398\uC774\uC9C0 \uD06C\uB864\uB9C1\uC744 \uC2DC\uC791\uD569\uB2C8\uB2E4: ".concat(categoryUrl));
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 17, 18, 21]);
                        _a = this;
                        return [4 /*yield*/, puppeteer_1.default.launch({
                                headless: true,
                                args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
                            })];
                    case 2:
                        _a.browser = _b.sent();
                        return [4 /*yield*/, this.browser.newPage()];
                    case 3:
                        page = _b.sent();
                        return [4 /*yield*/, page.setViewport({ width: 1366, height: 768 })];
                    case 4:
                        _b.sent();
                        // 카테고리 페이지 접속
                        return [4 /*yield*/, page.goto(categoryUrl, { waitUntil: 'networkidle2' })];
                    case 5:
                        // 카테고리 페이지 접속
                        _b.sent();
                        // 스크롤 다운하여 더 많은 상품 로드
                        return [4 /*yield*/, this.scrollDown(page)];
                    case 6:
                        // 스크롤 다운하여 더 많은 상품 로드
                        _b.sent();
                        return [4 /*yield*/, page.evaluate(function () {
                                var links = [];
                                var productCards = document.querySelectorAll('.thumbnail_thumb_wrap__RbcYO');
                                productCards.forEach(function (card) {
                                    var anchor = card.closest('a');
                                    if (anchor && anchor.getAttribute('href')) {
                                        links.push(anchor.getAttribute('href'));
                                    }
                                });
                                return links;
                            })];
                    case 7:
                        productUrls = _b.sent();
                        console.log("".concat(productUrls.length, "\uAC1C\uC758 \uC0C1\uD488 URL\uC744 \uCC3E\uC558\uC2B5\uB2C8\uB2E4."));
                        limitedUrls = productUrls.slice(0, this.config.maxProductsPerKeyword);
                        this.result.totalProducts += limitedUrls.length;
                        _i = 0, limitedUrls_2 = limitedUrls;
                        _b.label = 8;
                    case 8:
                        if (!(_i < limitedUrls_2.length)) return [3 /*break*/, 15];
                        url = limitedUrls_2[_i];
                        _b.label = 9;
                    case 9:
                        _b.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.crawlProductDetail(url)];
                    case 10:
                        product = _b.sent();
                        if (product) {
                            this.result.products.push(product);
                            this.result.successCount++;
                            console.log("\uC0C1\uD488 \uD06C\uB864\uB9C1 \uC131\uACF5: ".concat(product.name));
                        }
                        return [3 /*break*/, 12];
                    case 11:
                        error_6 = _b.sent();
                        this.result.failedCount++;
                        this.result.errors.push({
                            url: url,
                            error: error_6 instanceof Error ? error_6.message : String(error_6)
                        });
                        console.error("\uC0C1\uD488 \uD06C\uB864\uB9C1 \uC2E4\uD328: ".concat(url), error_6);
                        return [3 /*break*/, 12];
                    case 12: 
                    // 요청 간 딜레이
                    return [4 /*yield*/, (0, utils_1.sleep)(this.config.delayBetweenRequests)];
                    case 13:
                        // 요청 간 딜레이
                        _b.sent();
                        _b.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 8];
                    case 15: return [4 /*yield*/, page.close()];
                    case 16:
                        _b.sent();
                        return [3 /*break*/, 21];
                    case 17:
                        error_7 = _b.sent();
                        console.error('카테고리 페이지 크롤링 중 오류가 발생했습니다:', error_7);
                        return [3 /*break*/, 21];
                    case 18:
                        if (!this.browser) return [3 /*break*/, 20];
                        return [4 /*yield*/, this.browser.close()];
                    case 19:
                        _b.sent();
                        _b.label = 20;
                    case 20:
                        this.result.endTime = (0, utils_1.getCurrentTimeISOString)();
                        this.result.duration = (0, utils_1.calculateDurationInSeconds)(this.result.startTime, this.result.endTime);
                        // 결과 저장
                        (0, utils_1.saveToJson)(this.result, this.config.outputPath);
                        console.log('크롤링이 완료되었습니다.');
                        console.log("\uCD1D ".concat(this.result.totalProducts, "\uAC1C \uC0C1\uD488 \uC911 ").concat(this.result.successCount, "\uAC1C \uC131\uACF5, ").concat(this.result.failedCount, "\uAC1C \uC2E4\uD328"));
                        console.log("\uC18C\uC694 \uC2DC\uAC04: ".concat(this.result.duration.toFixed(2), "\uCD08"));
                        return [2 /*return*/, this.result];
                    case 21: return [2 /*return*/];
                }
            });
        });
    };
    return NaverSmartstoreCrawler;
}());
/**
 * 메인 함수
 */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var crawler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    crawler = new NaverSmartstoreCrawler();
                    return [4 /*yield*/, crawler.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
    main().catch(console.error);
}
exports.default = NaverSmartstoreCrawler;
