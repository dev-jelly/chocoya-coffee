import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 추가할 새 타임모어 모델들
        const newGrinders = [
            {
                id: 'timemore-c3-max',
                name: 'Chestnut C3 Max',
                name_ko: '타임모어 체스트넛 C3 맥스',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Chestnut C3 Max is an upgraded version of the popular C2 model with improved grind consistency.',
                description_ko: '체스트넛 C3 맥스는 인기 모델인 C2의 업그레이드 버전으로 더 향상된 분쇄 일관성을 제공합니다.',
                imageUrl: null
            },
            {
                id: 'timemore-chestnut-s3',
                name: 'Chestnut S3',
                name_ko: '타임모어 체스트넛 S3',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Timemore Chestnut S3 is a premium manual coffee grinder with S-shaped handle design for better ergonomics.',
                description_ko: '타임모어 체스트넛 S3는 S자형 핸들 디자인으로 더 나은 인체공학을 제공하는 프리미엄 수동 커피 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'timemore-c3s-max-pro',
                name: 'Chestnut C3S MAX Pro',
                name_ko: '타임모어 체스트넛 C3S 맥스 프로',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The C3S MAX Pro offers professional-grade grinding with titanium-coated burrs for enhanced durability.',
                description_ko: 'C3S 맥스 프로는 티타늄 코팅 버를 사용하여 내구성을 높인 전문가급 그라인딩을 제공합니다.',
                imageUrl: null
            },
            {
                id: 'timemore-c3-esp',
                name: 'Chestnut C3 ESP',
                name_ko: '타임모어 체스트넛 C3 ESP',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Chestnut C3 ESP is specially designed for espresso grinding with finer adjustment capabilities.',
                description_ko: '체스트넛 C3 ESP는 더 세밀한 조정 기능으로 에스프레소 그라인딩에 특화되어 설계되었습니다.',
                imageUrl: null
            },
            {
                id: 'timemore-c3-esp-pro',
                name: 'Chestnut C3 ESP Pro',
                name_ko: '타임모어 체스트넛 C3 ESP 프로',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The C3 ESP Pro is the premium version of the ESP model with improved materials and grinding performance.',
                description_ko: 'C3 ESP 프로는 ESP 모델의 프리미엄 버전으로 향상된 소재와 그라인딩 성능을 제공합니다.',
                imageUrl: null
            },
            {
                id: 'timemore-c3s-pro',
                name: 'Chestnut C3S Pro',
                name_ko: '타임모어 체스트넛 C3S 프로',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The C3S Pro is designed for coffee enthusiasts looking for premium grinding experience with improved ergonomics.',
                description_ko: 'C3S 프로는 향상된 인체공학을 갖춘 프리미엄 그라인딩 경험을 찾는 커피 애호가를 위해 설계되었습니다.',
                imageUrl: null
            },
            {
                id: 'timemore-c3s',
                name: 'CHESTNUT C3S',
                name_ko: '타임모어 체스트넛 C3S',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The CHESTNUT C3S is a versatile manual grinder suitable for various brewing methods with consistent grind size.',
                description_ko: '체스트넛 C3S는 일관된 분쇄 크기로 다양한 추출 방법에 적합한 다재다능한 수동 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'timemore-xlite',
                name: 'Xlite',
                name_ko: '타임모어 엑스라이트',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Xlite is a premium lightweight manual grinder perfect for travel and outdoor brewing.',
                description_ko: '엑스라이트는 여행과 야외 추출에 완벽한 프리미엄 경량 수동 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'timemore-c3-matt',
                name: 'Chestnut C3 Matt',
                name_ko: '타임모어 체스트넛 C3 매트',
                brand: 'Timemore',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Chestnut C3 Matt features a stylish matte finish with the reliable grinding performance of the C3 series.',
                description_ko: '체스트넛 C3 매트는 세련된 매트 마감과 C3 시리즈의 안정적인 그라인딩 성능을 갖추고 있습니다.',
                imageUrl: null
            }
        ];

        const results = [];
        let addedCount = 0;

        // 각 그라인더에 대해 처리
        for (const grinderData of newGrinders) {
            // 이미 존재하는지 확인
            const existingGrinder = await prisma.grinder.findUnique({
                where: { id: grinderData.id }
            });

            if (!existingGrinder) {
                // 새 그라인더 추가
                const newGrinder = await prisma.grinder.create({
                    data: grinderData
                });
                results.push(newGrinder);
                addedCount++;
            } else {
                results.push({ ...existingGrinder, status: '이미 존재함' });
            }
        }

        return NextResponse.json({
            success: true,
            message: `타임모어 그라인더 ${addedCount}개가 성공적으로 추가되었습니다.`,
            addedCount,
            results
        });
    } catch (error) {
        console.error('Error adding Timemore models:', error);
        return NextResponse.json({
            success: false,
            error: '타임모어 모델 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 