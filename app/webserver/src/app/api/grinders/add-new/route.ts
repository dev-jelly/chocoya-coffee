import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 새로운 그라인더 데이터
const newGrinders = [
    {
        id: 'weber-key-plus',
        name: 'Weber Key+ Grinder',
        name_ko: '웨버 키+ 그라인더',
        brand: 'Weber Workshops',
        type: 'electric',
        burr: 'Premium Flat Burr',
        burrSize: '83mm',
        adjustmentType: 'stepless',
        description: 'The Weber Key+ is an advanced version of the Key grinder with improved features and performance for home enthusiasts.',
        description_ko: '웨버 키+는 가정용 커피 애호가를 위해 개선된 기능과 성능을 갖춘 키 그라인더의 고급 버전입니다.',
        imageUrl: '/grinders/weber-key-plus.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '1.5-2.0',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso extraction',
                description_ko: '에스프레소 추출에 적합한 고운 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '3.5-4.0',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over brewing methods',
                description_ko: '푸어오버 추출 방식에 적합한 중간 분쇄도'
            }
        ]
    },
    {
        id: 'wilfa-uniform-plus',
        name: 'Wilfa Uniform+ Grinder',
        name_ko: '윌파 유니폼+ 그라인더',
        brand: 'Wilfa',
        type: 'electric',
        burr: 'Steel Flat Burr',
        burrSize: '58mm',
        adjustmentType: 'stepless',
        description: 'The Wilfa Uniform+ is a home grinder with professional-grade flat burrs and precise adjustment mechanism.',
        description_ko: '윌파 유니폼+는 전문가급 평평한 버와 정밀한 조절 메커니즘을 갖춘 가정용 그라인더입니다.',
        imageUrl: '/grinders/wilfa-uniform-plus.jpg',
        settings: [
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '25-30',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods like V60 or Kalita',
                description_ko: 'V60이나 칼리타와 같은 푸어오버 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '40-45',
                brewingMethod: '프렌치프레스',
                description: 'Coarse grind for French Press brewing',
                description_ko: '프렌치프레스 추출에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: 'fellow-opus',
        name: 'Fellow Opus Conical Burr Grinder',
        name_ko: '펠로우 오퍼스 코니컬 버 그라인더',
        brand: 'Fellow',
        type: 'electric',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '40mm',
        adjustmentType: 'click',
        description: 'The Fellow Opus is a compact and elegant electric grinder with advanced anti-static technology and 41 grind settings.',
        description_ko: '펠로우 오퍼스는 고급 정전기 방지 기술과 41가지 분쇄 설정을 갖춘 컴팩트하고 우아한 전동 그라인더입니다.',
        imageUrl: '/grinders/fellow-opus.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '5-10',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso extraction',
                description_ko: '에스프레소 추출에 적합한 고운 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '20-25',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods',
                description_ko: '푸어오버 방식에 적합한 중간 분쇄도'
            },
            {
                name: 'French Press',
                name_ko: '프렌치프레스',
                value: '30-35',
                brewingMethod: '프렌치프레스',
                description: 'Coarse grind for immersion brewing',
                description_ko: '침지식 추출에 적합한 굵은 분쇄도'
            }
        ]
    },
    {
        id: '1zpresso-j-max',
        name: '1Zpresso J-Max Manual Grinder',
        name_ko: '원제스프레소 J-맥스 수동 그라인더',
        brand: '1Zpresso',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '48mm',
        adjustmentType: 'click',
        description: 'The 1Zpresso J-Max is a premium manual grinder with external adjustment ring and 409 precise click settings.',
        description_ko: '원제스프레소 J-맥스는 외부 조절 링과 409개의 정밀한 클릭 설정을 갖춘 프리미엄 수동 그라인더입니다.',
        imageUrl: '/grinders/1zpresso-j-max.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '1.0-1.5 회전 (80-120 클릭)',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso machines',
                description_ko: '에스프레소 머신에 적합한 고운 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '2.5-3.0 회전 (200-240 클릭)',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over brewing',
                description_ko: '푸어오버 추출에 적합한 중간 분쇄도'
            }
        ]
    },
    {
        id: 'timemore-g1',
        name: 'Timemore G1 Plus Manual Grinder',
        name_ko: '타임모어 G1 플러스 수동 그라인더',
        brand: 'Timemore',
        type: 'manual',
        burr: 'Stainless Steel Conical Burr',
        burrSize: '38mm',
        adjustmentType: 'click',
        description: 'The Timemore G1 Plus is an updated version of the G1 with improved adjustment mechanism and larger capacity.',
        description_ko: '타임모어 G1 플러스는 개선된 조절 메커니즘과 더 큰 용량을 갖춘 G1의 업그레이드 버전입니다.',
        imageUrl: '/grinders/timemore-g1.jpg',
        settings: [
            {
                name: 'Espresso',
                name_ko: '에스프레소',
                value: '6-8 클릭',
                brewingMethod: '에스프레소',
                description: 'Fine grind for espresso extraction',
                description_ko: '에스프레소 추출에 적합한 고운 분쇄도'
            },
            {
                name: 'Pour Over',
                name_ko: '푸어오버',
                value: '12-16 클릭',
                brewingMethod: '푸어오버',
                description: 'Medium grind for pour over methods',
                description_ko: '푸어오버 방식에 적합한 중간 분쇄도'
            }
        ]
    }
];

export async function GET() {
    try {
        let addedCount = 0;

        // 모든 새 그라인더 데이터를 순회하며 추가
        for (const grinderData of newGrinders) {
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
                    },
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: `새 그라인더 데이터가 성공적으로 처리되었습니다. ${addedCount}개의 새 그라인더가 추가되었습니다.`,
            addedCount
        });
    } catch (error) {
        console.error('Error adding new grinders:', error);
        return NextResponse.json({
            success: false,
            error: '새 그라인더 데이터 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 