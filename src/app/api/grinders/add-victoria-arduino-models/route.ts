import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 추가할 Victoria Arduino 전문용 그라인더 모델들
        const newGrinders = [
            {
                id: 'victoria-arduino-mythos-two',
                name: 'Mythos Two',
                name_ko: '빅토리아 아르두이노 미토스 투',
                brand: 'Victoria Arduino',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '85mm',
                description: 'The Victoria Arduino Mythos Two is a cutting-edge espresso grinder with 85mm titanium-coated burrs designed for high-volume cafes.',
                description_ko: '빅토리아 아르두이노 미토스 투는 대용량 카페를 위해 설계된 85mm 티타늄 코팅 버를 갖춘 최첨단 에스프레소 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'victoria-arduino-mythos-one',
                name: 'Mythos One',
                name_ko: '빅토리아 아르두이노 미토스 원',
                brand: 'Victoria Arduino',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '75mm',
                description: 'The Victoria Arduino Mythos One features a patented Clima Pro technology that maintains consistent grinding temperature for superior espresso extraction.',
                description_ko: '빅토리아 아르두이노 미토스 원은 우수한 에스프레소 추출을 위해 일정한 그라인딩 온도를 유지하는 특허받은 클리마 프로 기술을 갖추고 있습니다.',
                imageUrl: null
            },
            {
                id: 'victoria-arduino-atom-65',
                name: 'Atom 65',
                name_ko: '빅토리아 아르두이노 아톰 65',
                brand: 'Victoria Arduino',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '65mm',
                description: 'The Victoria Arduino Atom 65 is a compact, high-performance grinder with 65mm flat burrs, perfect for medium-sized cafes and specialty coffee shops.',
                description_ko: '빅토리아 아르두이노 아톰 65는 65mm 평면 버를 갖춘 소형 고성능 그라인더로, 중형 카페와 스페셜티 커피숍에 완벽합니다.',
                imageUrl: null
            },
            {
                id: 'victoria-arduino-atom-75',
                name: 'Atom 75',
                name_ko: '빅토리아 아르두이노 아톰 75',
                brand: 'Victoria Arduino',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '75mm',
                description: 'The Victoria Arduino Atom 75 offers higher grinding capacity with 75mm flat burrs, designed for busy espresso bars requiring consistent quality.',
                description_ko: '빅토리아 아르두이노 아톰 75는 75mm 평면 버로 더 높은 그라인딩 용량을 제공하며, 일관된 품질이 요구되는 바쁜 에스프레소 바를 위해 설계되었습니다.',
                imageUrl: null
            },
            {
                id: 'victoria-arduino-gravimetric',
                name: 'Gravimetric Grinder',
                name_ko: '빅토리아 아르두이노 그라비메트릭 그라인더',
                brand: 'Victoria Arduino',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '85mm',
                description: 'The Victoria Arduino Gravimetric Grinder features precise weight-based dosing technology for ultimate consistency in espresso preparation.',
                description_ko: '빅토리아 아르두이노 그라비메트릭 그라인더는 에스프레소 준비에서 궁극적인 일관성을 위한 정밀한 무게 기반 도징 기술을 갖추고 있습니다.',
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
            message: `빅토리아 아르두이노(Victoria Arduino) 그라인더 ${addedCount}개가 성공적으로 추가되었습니다.`,
            addedCount,
            results
        });
    } catch (error) {
        console.error('Error adding Victoria Arduino models:', error);
        return NextResponse.json({
            success: false,
            error: '빅토리아 아르두이노(Victoria Arduino) 모델 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 