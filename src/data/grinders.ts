// 그라인더 데이터
// 유명한 그라인더들의 정보와 특성을 포함합니다.

export interface GrinderData {
    id: string;
    name: string;     // 영어 이름
    name_ko?: string; // 한국어 이름
    brand: string;
    type: 'manual' | 'electric' | 'commercial';
    burr?: string;
    burrSize?: string;
    adjustmentType: 'click' | 'dial' | 'micrometer' | 'stepless';
    description: string; // 영어 설명
    description_ko?: string; // 한국어 설명
    imageUrl?: string;
    settings: GrinderSetting[];
}

export interface GrinderSetting {
    id?: string;
    name: string;
    name_ko?: string; // 한국어 이름
    value: string;
    brewingMethod: string;
    description: string; // 영어 설명
    description_ko?: string; // 한국어 설명
}

// 그라인더 타입 및 조절 방식 이름
export const grinderTypeNames = {
    manual: '수동 그라인더',
    electric: '전동 그라인더',
    commercial: '상업용 그라인더',
};

export const adjustmentTypeNames = {
    click: '클릭',
    dial: '다이얼',
    micrometer: '마이크로미터',
    stepless: '무단계',
};

// 주요 그라인더 데이터
export const grinders: GrinderData[] = [
    {
        id: 'comandante-c40',
        name: 'Comandante C40 MK4',
        name_ko: '코만단테 C40 MK4',
        brand: 'Comandante',
        type: 'manual',
        burr: '고품질 코니컬 스틸 버',
        burrSize: '40mm',
        adjustmentType: 'click',
        description: '독일 정밀 공학의 결정체로 알려진 프리미엄 수동 그라인더입니다. 1클릭당 약 30미크론의 정밀한 조절이 가능하며, 일관된 입자 분포로 높은 추출 품질을 제공합니다.',
        description_ko: '독일의 정밀 공학을 통해 제작된 프리미엄 수동 그라인더입니다. 1클릭당 약 30미크론의 정밀한 조절이 가능하며, 일관된 입자 분포로 높은 추출 품질을 제공합니다.',
        imageUrl: '/grinders/comandante-c40.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '10-15 클릭',
                brewingMethod: '에스프레소',
                description: 'Very fine grind suitable for espresso machines',
                description_ko: '에스프레소 머신에 적합한 매우 고운 분쇄도'
            },
            {
                name: 'Moka Pot',
                name_ko: '모카포트',
                value: '15-18 클릭',
                brewingMethod: '모카포트',
                description: 'Fine to medium grind suitable for moka pots',
                description_ko: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: 'Pour Over (Light Roast)',
                name_ko: '푸어오버 (밝은 로스팅)',
                value: '22-26 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind suitable for light roasted beans',
                description_ko: '밝은 로스팅 원두에 적합한 중간 분쇄도'
            },
            {
                name: 'Pour Over (Medium-Dark Roast)',
                name_ko: '푸어오버 (중간-어두운 로스팅)',
                value: '18-22 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind suitable for medium to dark roasted beans',
                description_ko: '중간-어두운 로스팅 원두에 적합한 중간 분쇄도'
            },
            {
                name: 'AeroPress',
                name_ko: '에어로프레스',
                value: '14-18 클릭',
                brewingMethod: '에어로프레스',
                description: 'Grind suitable for standard AeroPress brewing',
                description_ko: '에어로프레스 표준 추출에 적합한 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '26-30 클릭',
                brewingMethod: '프렌치프레스',
                description: 'Coarse grind suitable for French press brewing',
                description_ko: '프렌치프레스에 적합한 굵은 분쇄도'
            },
            {
                name: 'Cold Brew',
                name_ko: '콜드브루',
                value: '28-32 클릭',
                brewingMethod: '콜드브루',
                description: 'Coarse grind suitable for cold brew',
                description_ko: '콜드브루에 적합한 굵은 분쇄도'
            },
        ]
    },
    {
        id: 'timemore-c2',
        name: 'Timemore Chestnut C2',
        name_ko: '타임모어 체스튼 C2',
        brand: 'Timemore',
        type: 'manual',
        burr: '스테인리스 스틸 코니컬 버',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: '합리적인 가격대의 고품질 수동 그라인더로, 뛰어난 성능 대비 가격이 매력적입니다. 견고한 알루미늄 바디와 스테인리스 스틸 버가 장착되어 일관된 분쇄가 가능합니다.',
        description_ko: '합리적인 가격대의 고품질 수동 그라인더로, 뛰어난 성능 대비 가격이 매력적입니다. 견고한 알루미늄 바디와 스테인리스 스틸 버가 장착되어 일관된 분쇄가 가능합니다.',
        imageUrl: '/grinders/timemore-c2.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '6-10 클릭',
                brewingMethod: '에스프레소',
                description: 'Very fine grind suitable for espresso',
                description_ko: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: 'Moka Pot',
                name_ko: '모카포트',
                value: '10-12 클릭',
                brewingMethod: '모카포트',
                description: 'Fine to medium grind suitable for moka pots',
                description_ko: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '15-18 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind suitable for pour over methods',
                description_ko: '푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: 'AeroPress',
                name_ko: '에어로프레스',
                value: '12-14 클릭',
                brewingMethod: '에어로프레스',
                description: 'Medium-fine grind suitable for AeroPress',
                description_ko: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '20-22 클릭',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'kinu-m47',
        name: 'Kinu M47 Classic',
        name_ko: '키누 M47 클래식',
        brand: 'Kinu',
        type: 'manual',
        burr: '고품질 스틸 코니컬 버',
        burrSize: '47mm',
        adjustmentType: 'micrometer',
        description: '독일 제조사의 프리미엄 수동 그라인더로, 마이크로미터 조정 방식을 사용해 매우 정밀한 분쇄도 조절이 가능합니다. 스테인리스 스틸 본체와 대형 버로 빠르고 균일한 분쇄가 가능합니다.',
        description_ko: '독일의 제조사의 프리미엄 수동 그라인더로, 마이크로미터 조정 방식을 사용해 매우 정밀한 분쇄도 조절이 가능합니다. 스테인리스 스틸 본체와 대형 버로 빠르고 균일한 분쇄가 가능합니다.',
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
                name: '푸어오버',
                value: '3.5-4.0',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
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
        name_ko: 'EK43',
        brand: 'Mahlkönig',
        type: 'commercial',
        burr: '플랫 스틸 버',
        burrSize: '98mm',
        adjustmentType: 'dial',
        description: '전 세계 전문 카페에서 가장 인정받는 상업용 그라인더 중 하나로, 거대한 98mm 플랫 버로 일관된 입자 분포를 제공합니다. 에스프레소부터 핸드드립까지 다양한 추출 방식에 활용됩니다.',
        description_ko: '전 세계 전문 카페에서 가장 인정받는 상업용 그라인더 중 하나로, 거대한 98mm 플랫 버로 일관된 입자 분포를 제공합니다. 에스프레소부터 핸드드립까지 다양한 추출 방식에 활용됩니다.',
        imageUrl: '/grinders/ek43.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '1.0-1.5',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '푸어오버 (밝은 로스팅)',
                value: '8.0-9.0',
                brewingMethod: '푸어오버',
                description: '밝은 로스팅 원두의 푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '푸어오버 (중간 로스팅)',
                value: '7.0-8.0',
                brewingMethod: '푸어오버',
                description: '중간 로스팅 원두의 푸어오버에 적합한 중간 분쇄도'
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
        name_ko: 'DF64',
        brand: 'DF (G-IOTA)',
        type: 'electric',
        burr: '이탈리안 플랫 스틸 버',
        burrSize: '64mm',
        adjustmentType: 'stepless',
        description: '가성비 높은 싱글 도징 그라인더로, 64mm 플랫 버와 무단계 분쇄도 조절 시스템을 갖추고 있습니다. 에스프레소에서 핸드드립까지 모든 추출 방식에 적합합니다.',
        description_ko: '가성비 높은 싱글 도징 그라인더로, 64mm 플랫 버와 무단계 분쇄도 조절 시스템을 갖추고 있습니다. 에스프레소에서 핸드드립까지 모든 추출 방식에 적합합니다.',
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
                name: '푸어오버',
                value: '40-50',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
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
        name_ko: '니쉬 제로',
        brand: 'Niche',
        type: 'electric',
        burr: '코니컬 버',
        burrSize: '63mm',
        adjustmentType: 'dial',
        description: '영국의 싱글 도즈 그라인더로, 63mm 코니컬 버와 직관적인 다이얼 방식의 분쇄도 조절 시스템을 갖추고 있습니다. 제로 리텐션 설계로 원두 낭비가 적고 홈 바리스타들에게 인기가 높습니다.',
        description_ko: '영국의 싱글 도즈 그라인더로, 63mm 코니컬 버와 직관적인 다이얼 방식의 분쇄도 조절 시스템을 갖추고 있습니다. 제로 리텐션 설계로 원두 낭비가 적고 홈 바리스타들에게 인기가 높습니다.',
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
                name: '푸어오버',
                value: '50-60',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
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
        name_ko: '1Zpresso K-Plus',
        brand: '1Zpresso',
        type: 'manual',
        burr: '스테인리스 스틸 코니컬 버',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: '대만의 수동 그라인더 브랜드로, 48mm 대형 코니컬 버를 사용하여 빠르고 일관된 분쇄가 가능합니다. 외부 조절 링을 통해 편리하게 분쇄도를 조절할 수 있습니다.',
        description_ko: '대만의 수동 그라인더 브랜드로, 48mm 대형 코니컬 버를 사용하여 빠르고 일관된 분쇄가 가능합니다. 외부 조절 링을 통해 편리하게 분쇄도를 조절할 수 있습니다.',
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
                name: '푸어오버',
                value: '3-4 회전 (클릭 18-24)',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
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
        name_ko: '펠로우 오드 브루 그라인더',
        brand: 'Fellow',
        type: 'electric',
        burr: '플랫 스틸 버',
        burrSize: '64mm',
        adjustmentType: 'dial',
        description: '홈 브루잉에 초점을 맞춘 세련된 디자인의 전동 그라인더입니다. 64mm 플랫 버를 사용하여 일관된 분쇄가 가능하고, 정확한 계량과 저소음 설계가 특징입니다.',
        description_ko: '홈 브루잉에 초점을 맞춘 세련된 디자인의 전동 그라인더입니다. 64mm 플랫 버를 사용하여 일관된 분쇄가 가능하고, 정확한 계량과 저소음 설계가 특징입니다.',
        imageUrl: '/grinders/fellow-ode.jpg',
        settings: [
            {
                name: '푸어오버 (밝은 로스팅)',
                value: '2-3',
                brewingMethod: '푸어오버',
                description: '밝은 로스팅 원두의 푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '푸어오버 (중간 로스팅)',
                value: '3-4',
                brewingMethod: '푸어오버',
                description: '중간 로스팅 원두의 푸어오버에 적합한 중간 분쇄도'
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
    },
    {
        id: 'timemore-chestnut-c2',
        name: 'Chestnut C2 MAX',
        name_ko: '타임모어 체스튼 C2 MAX',
        brand: 'Timemore',
        type: 'manual',
        burr: '스테인리스 스틸 코니컬 버',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: '가성비가 우수한 중국 제조 수동 그라인더로, 안정적인 성능과 빠른 분쇄 속도를 제공합니다. 편안한 그립감과 내구성 있는 디자인이 특징입니다.',
        description_ko: '가성비가 우수한 중국 제조 수동 그라인더로, 안정적인 성능과 빠른 분쇄 속도를 제공합니다. 편안한 그립감과 내구성 있는 디자인이 특징입니다.',
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
                name: '푸어오버',
                value: '18-22 클릭',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '12-16 클릭',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '22-26 클릭',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'timemore-slim-plus',
        name: 'Slim Plus',
        name_ko: '슬림 플러스',
        brand: 'Timemore',
        type: 'manual',
        burr: '스테인리스 스틸 코니컬 버',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: '슬림한 디자인의 휴대용 수동 그라인더로, 여행 시 휴대하기 좋습니다. 우수한 품질의 버로 정밀한 분쇄가 가능합니다.',
        description_ko: '슬림한 디자인의 휴대용 수동 그라인더로, 여행 시 휴대하기 좋습니다. 우수한 품질의 버로 정밀한 분쇄가 가능합니다.',
        imageUrl: '/grinders/timemore-slim.jpg',
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
                name: '푸어오버',
                value: '16-20 클릭',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '12-14 클릭',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '20-24 클릭',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'baratza-encore',
        name: 'Encore',
        name_ko: '엔코어',
        brand: 'Baratza',
        type: 'electric',
        burr: '코니컬 스틸 버',
        burrSize: '40mm',
        adjustmentType: 'dial',
        description: '홈 바리스타들을 위한 시작용 전동 그라인더로, 40mm 강철 코니컬 버와 40단계 조절이 가능합니다. 내구성이 뛰어나고 일관된 분쇄를 제공합니다.',
        description_ko: '홈 바리스타들을 위한 시작용 전동 그라인더로, 40mm 강철 코니컬 버와 40단계 조절이 가능합니다. 내구성이 뛰어나고 일관된 분쇄를 제공합니다.',
        imageUrl: '/grinders/baratza-encore.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '5-8',
                brewingMethod: '에스프레소',
                description: '비압력식 에스프레소에 적합한 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '8-12',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 중간-고운 분쇄도'
            },
            {
                name: '드립 커피',
                value: '15-20',
                brewingMethod: '푸어오버',
                description: '드립 커피에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '12-16',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '28-32',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'baratza-virtuoso-plus',
        name: 'Virtuoso+',
        name_ko: '비르투오소 플러스',
        brand: 'Baratza',
        type: 'electric',
        burr: '코니컬 스틸 버',
        burrSize: '40mm',
        adjustmentType: 'dial',
        description: '중급 홈 바리스타를 위한 그라인더로, 고품질 버와 디지털 타이머가 특징입니다. 40단계 조절이 가능하며 Encore보다 더 정밀한 분쇄도를 제공합니다.',
        description_ko: '중급 홈 바리스타를 위한 그라인더로, 고품질 버와 디지털 타이머가 특징입니다. 40단계 조절이 가능하며 Encore보다 더 정밀한 분쇄도를 제공합니다.',
        imageUrl: '/grinders/baratza-virtuoso.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '1-4',
                brewingMethod: '에스프레소',
                description: '일부 에스프레소 머신에 적합한 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '5-10',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 중간-고운 분쇄도'
            },
            {
                name: '드립 커피',
                value: '14-18',
                brewingMethod: '푸어오버',
                description: '드립 커피에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '10-14',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '30-35',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'baratza-sette-270',
        name: 'Sette 270',
        name_ko: '셋테 270',
        brand: 'Baratza',
        type: 'electric',
        burr: '코니컬 스틸 버',
        burrSize: '40mm',
        adjustmentType: 'micrometer',
        description: '에스프레소 특화 그라인더로, 마이크로 조절이 가능하고 영점 분쇄 시스템을 채택했습니다. 30단계 매크로 조절과 9단계 마이크로 조절로 정밀한 분쇄도 설정이 가능합니다.',
        description_ko: '에스프레소 특화 그라인더로, 마이크로 조절이 가능하고 영점 분쇄 시스템을 채택했습니다. 30단계 매크로 조절과 9단계 마이크로 조절로 정밀한 분쇄도 설정이 가능합니다.',
        imageUrl: '/grinders/baratza-sette.jpg',
        settings: [
            {
                name: '에스프레소 (밝은 로스팅)',
                value: '8E',
                brewingMethod: '에스프레소',
                description: '밝은 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '에스프레소 (중간 로스팅)',
                value: '9F',
                brewingMethod: '에스프레소',
                description: '중간 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '에스프레소 (어두운 로스팅)',
                value: '10G',
                brewingMethod: '에스프레소',
                description: '어두운 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '모카포트',
                value: '15A',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 중간-고운 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '18C',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            }
        ]
    },
    {
        id: 'weber-key',
        name: 'Key Grinder',
        name_ko: '키 그라인더',
        brand: 'Weber Workshops',
        type: 'electric',
        burr: '플랫 티타늄 코팅 스틸 버',
        burrSize: '83mm',
        adjustmentType: 'micrometer',
        description: '최고급 홈 그라인더로, 83mm의 대형 티타늄 코팅 플랫 버를 사용합니다. 마이크로미터 조절 시스템과 정밀한 조절 다이얼이 특징이며, 정밀한 분쇄와 우수한 일관성을 제공합니다.',
        description_ko: '최고급 홈 그라인더로, 83mm의 대형 티타늄 코팅 플랫 버를 사용합니다. 마이크로미터 조절 시스템과 정밀한 조절 다이얼이 특징이며, 정밀한 분쇄와 우수한 일관성을 제공합니다.',
        imageUrl: '/grinders/weber-key.jpg',
        settings: [
            {
                name: '에스프레소 (밝은 로스팅)',
                value: '1.1-1.4',
                brewingMethod: '에스프레소',
                description: '밝은 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '에스프레소 (중간 로스팅)',
                value: '1.4-1.7',
                brewingMethod: '에스프레소',
                description: '중간 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '드립 커피 (밝은 로스팅)',
                value: '2.4-2.8',
                brewingMethod: '푸어오버',
                description: '밝은 로스팅 원두의 푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '드립 커피 (중간 로스팅)',
                value: '2.2-2.6',
                brewingMethod: '푸어오버',
                description: '중간 로스팅 원두의 푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '2.0-2.4',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            }
        ]
    },
    {
        id: 'niche-zero',
        name: 'Zero',
        name_ko: '제로',
        brand: 'Niche',
        type: 'electric',
        burr: '코니컬 스틸 버',
        burrSize: '63mm',
        adjustmentType: 'stepless',
        description: '영국 제조의 싱글 도징 그라인더로, 63mm 고품질 하디드 스틸 코니컬 버와 무단계 조절 시스템을 갖추고 있습니다. 영점 리텐션 특성으로 신선한 커피만 분쇄할 수 있습니다.',
        description_ko: '영국 제조의 싱글 도징 그라인더로, 63mm 고품질 하디드 스틸 코니컬 버와 무단계 조절 시스템을 갖추고 있습니다. 영점 리텐션 특성으로 신선한 커피만 분쇄할 수 있습니다.',
        imageUrl: '/grinders/niche-zero.jpg',
        settings: [
            {
                name: '에스프레소 (밝은 로스팅)',
                value: '12-16',
                brewingMethod: '에스프레소',
                description: '밝은 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '에스프레소 (중간-어두운 로스팅)',
                value: '16-20',
                brewingMethod: '에스프레소',
                description: '중간-어두운 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '모카포트',
                value: '25-30',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 중간-고운 분쇄도'
            },
            {
                name: '드립 커피',
                value: '45-55',
                brewingMethod: '푸어오버',
                description: '드립 커피에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '30-40',
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
        id: 'eureka-mignon-specialita',
        name: 'Mignon Specialita',
        name_ko: '미니옹 스페셜리타',
        brand: 'Eureka',
        type: 'electric',
        burr: '플랫 스틸 버',
        burrSize: '55mm',
        adjustmentType: 'micrometer',
        description: '이탈리아 제조의 고급 에스프레소 그라인더로, 마이크로메트릭 조절 시스템과 55mm 평평한 스틸 버를 갖추고 있습니다. 정확한 도징과 낮은 소음이 특징입니다.',
        description_ko: '이탈리아 제조의 고급 에스프레소 그라인더로, 마이크로메트릭 조절 시스템과 55mm 평평한 스틸 버를 갖추고 있습니다. 정확한 도징과 낮은 소음이 특징입니다.',
        imageUrl: '/grinders/eureka-mignon.jpg',
        settings: [
            {
                name: '에스프레소 (밝은 로스팅)',
                value: '마이크로미터 1.0-1.5',
                brewingMethod: '에스프레소',
                description: '밝은 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '에스프레소 (중간 로스팅)',
                value: '마이크로미터 1.5-2.0',
                brewingMethod: '에스프레소',
                description: '중간 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '에스프레소 (어두운 로스팅)',
                value: '마이크로미터 2.0-2.5',
                brewingMethod: '에스프레소',
                description: '어두운 로스팅 원두에 적합한 에스프레소 분쇄도'
            },
            {
                name: '모카포트',
                value: '마이크로미터 4.0-5.0',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 중간-고운 분쇄도'
            }
        ]
    },
    {
        id: 'mahlkonig-x54',
        name: 'X54',
        name_ko: 'X54',
        brand: 'Mahlkönig',
        type: 'electric',
        burr: '플랫 디스크 버',
        burrSize: '54mm',
        adjustmentType: 'stepless',
        description: '독일 프리미엄 브랜드의 홈용 그라인더로, 54mm 플랫 스틸 버와 무단계 조절 시스템을 제공합니다. 정밀한 분쇄, 낮은 리텐션과 정확한 도징이 특징입니다.',
        description_ko: '독일 프리미엄 브랜드의 홈용 그라인더로, 54mm 플랫 스틸 버와 무단계 조절 시스템을 제공합니다. 정밀한 분쇄, 낮은 리텐션과 정확한 도징이 특징입니다.',
        imageUrl: '/grinders/mahlkonig-x54.jpg',
        settings: [
            {
                name: '에스프레소',
                value: '0-10',
                brewingMethod: '에스프레소',
                description: '에스프레소에 적합한 매우 고운 분쇄도'
            },
            {
                name: '모카포트',
                value: '10-20',
                brewingMethod: '모카포트',
                description: '모카포트에 적합한 고운-중간 분쇄도'
            },
            {
                name: '푸어오버',
                value: '35-45',
                brewingMethod: '푸어오버',
                description: '푸어오버에 적합한 중간 분쇄도'
            },
            {
                name: '에어로프레스',
                value: '20-30',
                brewingMethod: '에어로프레스',
                description: '에어로프레스에 적합한 중간-고운 분쇄도'
            },
            {
                name: '프렌치프레스',
                value: '55-65',
                brewingMethod: '프렌치프레스',
                description: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    }
];

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