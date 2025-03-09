import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 1Zpresso 그라인더 데이터
const zpressoGrinders = [
    {
        id: '1zpresso-k-ultra',
        name: 'K-Ultra Manual Coffee Grinder',
        name_ko: '1Zpresso K-울트라',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Titanium-coated Conical Burr',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: 'The K-Ultra is a high-performance manual grinder designed for all brewing methods with advanced burr technology.',
        description_ko: 'K-울트라는 고급 버 기술로 모든 추출 방식에 적합하게 설계된 고성능 수동 그라인더입니다.',
        imageUrl: '/grinders/1zpresso-k-ultra.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '1.0-1.8 회전',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso extraction',
                description_ko: '에스프레소 추출에 적합한 고운 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '2.5-3.2 회전',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over brewing methods',
                description_ko: '푸어오버 추출 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '3.8-4.5 회전',
                brewingMethod: '프렌치프레스',
                description: 'Coarse grind for immersion brewing',
                description_ko: '침지식 추출에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-j-ultra',
        name: 'J-Ultra Manual Coffee Grinder',
        name_ko: '1Zpresso J-울트라',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: 'The J-Ultra is specifically optimized for espresso with precise adjustment mechanism and specialized burr design.',
        description_ko: 'J-울트라는 정밀한 조절 메커니즘과 특수 버 설계로 에스프레소에 최적화된 그라인더입니다.',
        imageUrl: '/grinders/1zpresso-j-ultra.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '0.8-1.5 회전',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso machines',
                description_ko: '에스프레소 머신에 적합한 고운 분쇄도'
            },
            {
                name: 'Moka Pot',
                name_ko: '모카포트',
                value: '1.6-2.0 회전',
                brewingMethod: '모카포트',
                description: 'Medium-fine grind for moka pot brewing',
                description_ko: '모카포트 추출에 적합한 중간-고운 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-zp6-special',
        name: 'ZP6 Special Manual Coffee Grinder',
        name_ko: '1Zpresso ZP6 스페셜',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Custom Stainless Steel Conical Burr',
        burrSize: '45mm',
        adjustmentType: 'click',
        description: 'The ZP6 Special is designed specifically for pour over brewing with a unique burr set that enhances clarity and sweetness.',
        description_ko: 'ZP6 스페셜은 선명함과 달콤함을 강화하는 독특한 버 세트로 푸어오버 추출에 특화된 그라인더입니다.',
        imageUrl: '/grinders/1zpresso-zp6-special.jpg',
        settings: [
            {
                name: 'Pour Over (Light Roast)',
                name_ko: '푸어오버 (라이트 로스팅)',
                value: '2.5-3.0 회전',
                brewingMethod: '푸어오버',
                description: 'Medium grind for light roasted beans in pour over',
                description_ko: '푸어오버에서 라이트 로스팅 원두에 적합한 중간 분쇄도'
            },
            {
                name: 'Pour Over (Medium-Dark Roast)',
                name_ko: '푸어오버 (미디엄-다크 로스팅)',
                value: '2.2-2.7 회전',
                brewingMethod: '푸어오버',
                description: 'Medium grind for medium to dark roasted beans in pour over',
                description_ko: '푸어오버에서 미디엄에서 다크 로스팅 원두에 적합한 중간 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-je-plus-s',
        name: 'JE-Plus S Manual Coffee Grinder',
        name_ko: '1Zpresso JE-플러스 S',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Special E&B Burr',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: 'The JE-Plus S features an external adjustment system and specialized burr designed for espresso with improved workflow.',
        description_ko: 'JE-플러스 S는 외부 조절 시스템과 향상된 작업 흐름으로 에스프레소에 최적화된 특수 버를 갖추고 있습니다.',
        imageUrl: '/grinders/1zpresso-je-plus-s.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '1.0-1.5 회전',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso extraction',
                description_ko: '에스프레소 추출에 적합한 고운 분쇄도'
            },
            {
                name: 'AeroPress',
                name_ko: '에어로프레스',
                value: '1.8-2.3 회전',
                brewingMethod: '에어로프레스',
                description: 'Medium-fine grind for AeroPress brewing',
                description_ko: '에어로프레스 추출에 적합한 중간-고운 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-x-ultra',
        name: 'X-Ultra Manual Coffee Grinder',
        name_ko: '1Zpresso X-울트라',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: 'The X-Ultra is a compact and versatile manual grinder suitable for all brewing methods with excellent grind consistency.',
        description_ko: 'X-울트라는 우수한 분쇄 일관성으로 모든 추출 방식에 적합한 컴팩트하고 다용도 수동 그라인더입니다.',
        imageUrl: '/grinders/1zpresso-x-ultra.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '6-9 클릭',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso extraction',
                description_ko: '에스프레소 추출에 적합한 고운 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '16-22 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods',
                description_ko: '푸어오버 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '26-32 클릭',
                brewingMethod: '프렌치프레스',
                description: 'Coarse grind for French press',
                description_ko: '프렌치프레스에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-j',
        name: 'J Manual Coffee Grinder',
        name_ko: '1Zpresso J',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: 'The J grinder offers excellent performance for pour over brewing with its high-quality burrs and stable grinding experience.',
        description_ko: 'J 그라인더는 고품질 버와 안정적인 분쇄 경험으로 푸어오버 추출에 탁월한 성능을 제공합니다.',
        imageUrl: '/grinders/1zpresso-j.jpg',
        settings: [
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '2.4-3.0 회전',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods',
                description_ko: '푸어오버 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'AeroPress',
                name_ko: '에어로프레스',
                value: '1.8-2.2 회전',
                brewingMethod: '에어로프레스',
                description: 'Medium-fine grind for AeroPress brewing',
                description_ko: '에어로프레스 추출에 적합한 중간-고운 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '3.5-4.0 회전',
                brewingMethod: '프렌치프레스',
                description: 'Coarse grind for French press brewing',
                description_ko: '프렌치프레스 추출에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-q',
        name: 'Q Manual Coffee Grinder',
        name_ko: '1Zpresso Q',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: 'The Q grinder is a compact and portable option for pour over brewing with good consistency and easy adjustment.',
        description_ko: 'Q 그라인더는 좋은 일관성과 쉬운 조절이 가능한 푸어오버 추출용 컴팩트하고 휴대성이 좋은 옵션입니다.',
        imageUrl: '/grinders/1zpresso-q.jpg',
        settings: [
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '16-22 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods',
                description_ko: '푸어오버 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'AeroPress',
                name_ko: '에어로프레스',
                value: '12-16 클릭',
                brewingMethod: '에어로프레스',
                description: 'Medium-fine grind for AeroPress brewing',
                description_ko: '에어로프레스 추출에 적합한 중간-고운 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-q-air',
        name: 'Q Air Manual Coffee Grinder',
        name_ko: '1Zpresso Q 에어',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '35mm',
        adjustmentType: 'click',
        description: 'The Q Air is an ultra-lightweight and compact manual grinder, perfect for travel while still delivering good grind quality for pour over brewing.',
        description_ko: 'Q 에어는 초경량 컴팩트 수동 그라인더로, 여행에 완벽하면서도 푸어오버 추출을 위한 좋은 분쇄 품질을 제공합니다.',
        imageUrl: '/grinders/1zpresso-q-air.jpg',
        settings: [
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '16-22 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods',
                description_ko: '푸어오버 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'AeroPress',
                name_ko: '에어로프레스',
                value: '12-16 클릭',
                brewingMethod: '에어로프레스',
                description: 'Medium-fine grind for AeroPress brewing',
                description_ko: '에어로프레스 추출에 적합한 중간-고운 분쇄도'
            }
        ]
    }
];

export async function GET() {
    try {
        let addedCount = 0;

        // 모든 1Zpresso 그라인더 데이터를 순회하며 추가
        for (const grinderData of zpressoGrinders) {
            const { settings, ...grinderInfo } = grinderData;

            // 이미 존재하는지 확인
            const existingGrinder = await prisma.grinder.findFirst({
                where: {
                    OR: [
                        { id: grinderInfo.id },
                        {
                            name: grinderInfo.name,
                            brand: grinderInfo.brand,
                        }
                    ]
                },
            });

            if (!existingGrinder) {
                // 그라인더 생성
                await prisma.grinder.create({
                    data: {
                        id: grinderInfo.id,
                        name: grinderInfo.name,
                        name_ko: grinderInfo.name_ko,
                        brand: grinderInfo.brand,
                        type: grinderInfo.type,
                        burr: grinderInfo.burr,
                        burrSize: grinderInfo.burrSize,
                        adjustmentType: grinderInfo.adjustmentType,
                        description: grinderInfo.description,
                        description_ko: grinderInfo.description_ko,
                        imageUrl: grinderInfo.imageUrl,
                        settings: {
                            create: settings.map(setting => ({
                                name: setting.name,
                                name_ko: setting.name_ko,
                                value: setting.value,
                                brewingMethod: setting.brewingMethod,
                                description: setting.description,
                                description_ko: setting.description_ko,
                            })),
                        },
                    },
                });
                addedCount++;
            } else {
                // 이미 존재하는 경우 정보 업데이트
                await prisma.grinder.update({
                    where: { id: existingGrinder.id },
                    data: {
                        name_ko: grinderInfo.name_ko,
                        description_ko: grinderInfo.description_ko,
                        burr: grinderInfo.burr,
                        burrSize: grinderInfo.burrSize,
                        imageUrl: grinderInfo.imageUrl,
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `1Zpresso 그라인더 데이터가 성공적으로 처리되었습니다. ${addedCount}개의 새 그라인더가 추가되었습니다.`,
            addedCount
        });
    } catch (error) {
        console.error('Error adding 1Zpresso grinders:', error);
        return NextResponse.json({
            success: false,
            error: '1Zpresso 그라인더 데이터 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 