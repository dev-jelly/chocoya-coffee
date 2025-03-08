// 그라인더 데이터
// 유명한 그라인더들의 정보와 특성을 포함합니다.

export interface GrinderData {
    id: string;
    name: string;
    brand: string;
    type: 'manual' | 'electric' | 'commercial';
    burr?: string;
    burrSize?: string;
    adjustmentType: 'click' | 'dial' | 'micrometer' | 'stepless';
    description: string;
    imageUrl?: string;
    settings: GrinderSetting[];
}

export interface GrinderSetting {
    name: string;
    value: string;
    brewingMethod: string;
    description: string;
}

// 주요 그라인더 데이터
export const grinders: GrinderData[] = [
    {
        id: 'comandante-c40',
        name: 'Comandante C40 MK4',
        brand: 'Comandante',
        type: 'manual',
        burr: '고품질 코니컬 스틸 버',
        burrSize: '40mm',
        adjustmentType: 'click',
        description: '독일 정밀 공학의 결정체로 알려진 프리미엄 수동 그라인더입니다. 1클릭당 약 30미크론의 정밀한 조절이 가능하며, 일관된 입자 분포로 높은 추출 품질을 제공합니다.',
        imageUrl: '/grinders/comandante-c40.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '10-15 클릭',
                brewingMethod: '에스프레소',
                description: '에스프레소 머신에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '15-18 클릭',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '핸드드립 (밝은 로스팅)',
                value: '22-26 클릭',
                brewingMethod: '핸드드립',
                description: '밝은 로스팅 원두에 적합한 중간 분쇄도'
            },
            {
                name: '핸드드립 (중간-어두운 로스팅)',
                value: '18-22 클릭',
                brewingMethod: '핸드드립',
                description: '중간-어두운 로스팅 원두에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '14-18 클릭',
                brewingMethod: '에어로프레스',
                description: '에어로프레스 표준 추출에 적합한 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '28-32 클릭',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            },
            {
                name: '콜드브루',
                value: '30-35 클릭',
                brewingMethod: '콜드브루',
                description: '콜드브루에 적합한 매우 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'timemore-c2',
        name: 'Timemore Chestnut C2',
        brand: 'Timemore',
        type: 'manual',
        burr: '스테인리스 스틸 코니컬 버',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: '합리적인 가격대의 고품질 수동 그라인더로, 뛰어난 성능 대비 가격이 매력적입니다. 견고한 알루미늄 바디와 스테인리스 스틸 버가 장착되어 일관된 분쇄가 가능합니다.',
        imageUrl: '/grinders/timemore-c2.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '6-10 클릭',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '10-12 클릭',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '핸드드립',
                value: '15-18 클릭',
                brewingMethod: '핸드드립',
                description: '핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '12-14 클릭',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '20-22 클릭',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'kinu-m47',
        name: 'Kinu M47 Classic',
        brand: 'Kinu',
        type: 'manual',
        burr: '고품질 스틸 코니컬 버',
        burrSize: '47mm',
        adjustmentType: 'micrometer',
        description: '독일 제조사의 프리미엄 수동 그라인더로, 마이크로미터 조정 방식을 사용해 매우 정밀한 분쇄도 조절이 가능합니다. 스테인리스 스틸 본체와 대형 버로 빠르고 균일한 분쇄가 가능합니다.',
        imageUrl: '/grinders/kinu-m47.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '1.0-2.0',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '2.5-3.0',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '핸드드립',
                value: '3.5-4.0',
                brewingMethod: '핸드드립',
                description: '핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '2.5-3.5',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '4.5-5.0',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'ek43',
        name: 'EK43',
        brand: 'Mahlkönig',
        type: 'commercial',
        burr: '플랫 스틸 버',
        burrSize: '98mm',
        adjustmentType: 'dial',
        description: '전 세계 전문 카페에서 가장 인정받는 상업용 그라인더 중 하나로, 거대한 98mm 플랫 버로 일관된 입자 분포를 제공합니다. 에스프레소부터 핸드드립까지 다양한 추출 방식에 활용됩니다.',
        imageUrl: '/grinders/ek43.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '1.0-1.5',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '핸드드립 (밝은 로스팅)',
                value: '8.0-9.0',
                brewingMethod: '핸드드립',
                description: '밝은 로스팅 원두의 핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '핸드드립 (중간 로스팅)',
                value: '7.0-8.0',
                brewingMethod: '핸드드립',
                description: '중간 로스팅 원두의 핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '배치 브루',
                value: '8.5-9.5',
                brewingMethod: '배치 브루',
                description: '대량 추출에 적합한 중간-굵은 분쇄도'
            }
        ]
    },
    {
        id: 'df64',
        name: 'DF64',
        brand: 'DF (G-IOTA)',
        type: 'electric',
        burr: '이탈리안 플랫 스틸 버',
        burrSize: '64mm',
        adjustmentType: 'stepless',
        description: '가성비 높은 싱글 도징 그라인더로, 64mm 플랫 버와 무단계 분쇄도 조절 시스템을 갖추고 있습니다. 에스프레소에서 핸드드립까지 모든 추출 방식에 적합합니다.',
        imageUrl: '/grinders/df64.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '5-15',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '20-25',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '핸드드립',
                value: '40-50',
                brewingMethod: '핸드드립',
                description: '핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '25-35',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '60-70',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'niche-zero',
        name: 'Niche Zero',
        brand: 'Niche',
        type: 'electric',
        burr: '코니컬 버',
        burrSize: '63mm',
        adjustmentType: 'dial',
        description: '영국의 싱글 도즈 그라인더로, 63mm 코니컬 버와 직관적인 다이얼 방식의 분쇄도 조절 시스템을 갖추고 있습니다. 제로 리텐션 설계로 원두 낭비가 적고 홈 바리스타들에게 인기가 높습니다.',
        imageUrl: '/grinders/niche-zero.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '5-15',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '20-25',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '핸드드립',
                value: '50-60',
                brewingMethod: '핸드드립',
                description: '핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '30-40',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '70-75',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-k-plus',
        name: '1Zpresso K-Plus',
        brand: '1Zpresso',
        type: 'manual',
        burr: '스테인리스 스틸 코니컬 버',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: '대만의 수동 그라인더 브랜드로, 48mm 대형 코니컬 버를 사용하여 빠르고 일관된 분쇄가 가능합니다. 외부 조절 링을 통해 편리하게 분쇄도를 조절할 수 있습니다.',
        imageUrl: '/grinders/1zpresso-k-plus.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '1-2 회전 (클릭 6-12)',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '2-2.5 회전 (클릭 12-15)',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '핸드드립',
                value: '3-4 회전 (클릭 18-24)',
                brewingMethod: '핸드드립',
                description: '핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '2.5-3 회전 (클릭 15-18)',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '5-6 회전 (클릭 30-36)',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'fellow-ode',
        name: 'Fellow Ode Brew Grinder',
        brand: 'Fellow',
        type: 'electric',
        burr: '플랫 스틸 버',
        burrSize: '64mm',
        adjustmentType: 'dial',
        description: '홈 브루잉에 초점을 맞춘 세련된 디자인의 전동 그라인더입니다. 64mm 플랫 버를 사용하여 일관된 분쇄가 가능하고, 정확한 계량과 저소음 설계가 특징입니다.',
        imageUrl: '/grinders/fellow-ode.jpg',
        settings: [
            {
                name: '핸드드립 (밝은 로스팅)',
                value: '2-3',
                brewingMethod: '핸드드립',
                description: '밝은 로스팅 원두의 핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '핸드드립 (중간 로스팅)',
                value: '3-4',
                brewingMethod: '핸드드립',
                description: '중간 로스팅 원두의 핸드드립에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '1-2',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '6-7',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            },
            {
                name: '콜드브루',
                value: '7-10',
                brewingMethod: '콜드브루',
                description: '콜드브루에 적합한 매우 굵은 분쇄도'
            }
        ]
    }
];

// 그라인더 타입 이름 매핑
export const grinderTypeNames = {
    manual: '수동 그라인더',
    electric: '전동 그라인더',
    commercial: '상업용 그라인더'
};

// 그라인더 조절 방식 이름 매핑
export const adjustmentTypeNames = {
    click: '클릭',
    dial: '다이얼',
    micrometer: '마이크로미터',
    stepless: '무단계'
};

// 그라인더 ID로 찾기
export const getGrinderById = (id: string) => {
    return grinders.find(grinder => grinder.id === id);
};

// 그라인더 타입별로 필터링
export const getGrindersByType = (type: 'manual' | 'electric' | 'commercial') => {
    return grinders.filter(grinder => grinder.type === type);
};

// 브루잉 방식에 맞는 그라인더 설정 찾기
export const findGrinderSettingsByBrewingMethod = (grinderId: string, brewingMethod: string) => {
    const grinder = getGrinderById(grinderId);
    if (!grinder) return [];

    return grinder.settings.filter(setting =>
        setting.brewingMethod.toLowerCase() === brewingMethod.toLowerCase()
    );
}; 