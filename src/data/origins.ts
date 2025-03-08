// 커피 원산지 데이터
// 스페셜티 커피 관점에서 메이저 원산지를 위에 두고 마이너 원산지를 아래로 배치

export interface CoffeeOrigin {
    id: string;
    name: string; // 국가명
    major: boolean; // 스페셜티 커피 관점에서 주요 생산국 여부
}

// 커피 원산지 목록 (스페셜티 커피 중요도 순으로 정렬)
export const coffeeOrigins: CoffeeOrigin[] = [
    // 스페셜티 커피 관점에서의 주요 원산지 (메이저 원산지)
    { id: 'ethiopia', name: '에티오피아', major: true },  // 커피의 발상지, 다양한 풍미 프로필
    { id: 'kenya', name: '케냐', major: true },           // 밝은 산미와 과일향이 특징적
    { id: 'colombia', name: '콜롬비아', major: true },     // 균형 잡힌 풍미와 깨끗한 맛
    { id: 'guatemala', name: '과테말라', major: true },    // 복합적인 맛과 향이 특징
    { id: 'panama', name: '파나마', major: true },        // 게이샤 품종으로 유명
    { id: 'costa_rica', name: '코스타리카', major: true }, // 일관된 품질의 클린한 컵
    { id: 'rwanda', name: '르완다', major: true },        // 밝은 산미와 과일향
    { id: 'el_salvador', name: '엘살바도르', major: true }, // 밸런스 좋은 스페셜티 커피
    { id: 'nicaragua', name: '니카라과', major: true },    // 부드러운 바디와 초콜릿 맛
    { id: 'honduras', name: '온두라스', major: true },     // 최근 스페셜티 시장에서 급성장
    { id: 'burundi', name: '부룬디', major: true },       // 풍부한 베리향과 산미
    { id: 'yemen', name: '예멘', major: true },           // 오랜 역사와 독특한 와인향
    { id: 'tanzania', name: '탄자니아', major: true },     // 밝은 산미와 감귤향
    { id: 'peru', name: '페루', major: true },           // 유기농 커피로 유명

    // 스페셜티 커피로는 덜 알려졌거나 대량 생산 위주의 국가들 (마이너 원산지)
    { id: 'brazil', name: '브라질', major: false },       // 세계 최대 커피 생산국이지만 주로 상업용
    { id: 'vietnam', name: '베트남', major: false },      // 로부스타 대량 생산
    { id: 'indonesia', name: '인도네시아', major: false },  // 독특한 향미의 커피
    { id: 'india', name: '인도', major: false },         // 몬순 말라바르로 알려짐
    { id: 'uganda', name: '우간다', major: false },       // 주로 로부스타 생산
    { id: 'mexico', name: '멕시코', major: false },       // 주로 상업용 생산
    { id: 'ecuador', name: '에콰도르', major: false },     // 소규모 스페셜티 생산
    { id: 'papua_new_guinea', name: '파푸아뉴기니', major: false }, // 독특한 풍미
    { id: 'jamaica', name: '자메이카', major: false },     // 블루마운틴으로 유명하지만 희소
    { id: 'thailand', name: '태국', major: false },       // 최근 발전 중인 원산지
    { id: 'laos', name: '라오스', major: false },         // 소규모 생산
    { id: 'china', name: '중국', major: false },         // 윈난성 중심의 생산
    { id: 'dominican_republic', name: '도미니카 공화국', major: false },
    { id: 'cuba', name: '쿠바', major: false },
    { id: 'haiti', name: '아이티', major: false },
    { id: 'bolivia', name: '볼리비아', major: false },     // 고지대 커피로 알려졌지만 소량 생산
];

// 원산지 가져오기 (메이저 원산지 먼저, 그 다음 마이너 원산지)
export const getOrigins = () => {
    const majorOrigins = coffeeOrigins.filter(origin => origin.major);
    const minorOrigins = coffeeOrigins.filter(origin => !origin.major);

    return [...majorOrigins, ...minorOrigins];
};

// 원산지 ID로 원산지 이름 찾기
export const getOriginNameById = (id: string | null | undefined): string => {
    if (!id) return '';

    const origin = coffeeOrigins.find(origin => origin.id === id);
    return origin ? origin.name : '';
}; 