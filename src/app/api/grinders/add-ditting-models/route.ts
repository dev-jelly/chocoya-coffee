import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 추가할 Ditting 전문용 그라인더 모델들
        const newGrinders = [
            {
                id: 'ditting-807-shop',
                name: '807 Shop Grinder',
                name_ko: '디팅 807 숍 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '80mm',
                description: 'The Ditting 807 Shop Grinder is a reliable, high-precision commercial grinder designed for coffee shops and roasteries.',
                description_ko: '디팅 807 숍 그라인더는 커피숍과 로스터리를 위해 설계된 신뢰할 수 있는 고정밀 상업용 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'ditting-807-filter',
                name: '807 FILTER Shop Grinder',
                name_ko: '디팅 807 필터 숍 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '80mm',
                description: 'The Ditting 807 FILTER Shop Grinder is specifically optimized for filter coffee grinding with precise adjustment settings.',
                description_ko: '디팅 807 필터 숍 그라인더는 정밀한 조정 설정으로 필터 커피 그라인딩에 최적화되어 있습니다.',
                imageUrl: null
            },
            {
                id: 'ditting-807-lab-sweet',
                name: '807 LAB SWEET Shop Grinder',
                name_ko: '디팅 807 랩 스위트 숍 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '80mm',
                description: 'The Ditting 807 LAB SWEET Shop Grinder features specialized burrs designed to enhance sweetness in filter coffee.',
                description_ko: '디팅 807 랩 스위트 숍 그라인더는 필터 커피의 단맛을 향상시키기 위해 설계된 특수 버를 갖추고 있습니다.',
                imageUrl: null
            },
            {
                id: 'ditting-1203-shop',
                name: '1203 Shop Grinder',
                name_ko: '디팅 1203 숍 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '120mm',
                description: 'The Ditting 1203 Shop Grinder offers exceptional grinding performance with larger 120mm burrs for high-volume coffee shops.',
                description_ko: '디팅 1203 숍 그라인더는 대용량 커피숍을 위한 120mm 대형 버로 뛰어난 그라인딩 성능을 제공합니다.',
                imageUrl: null
            },
            {
                id: 'ditting-1403-shop',
                name: '1403 Shop Grinder',
                name_ko: '디팅 1403 숍 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '140mm',
                description: 'The Ditting 1403 Shop Grinder is a heavy-duty grinder with 140mm burrs, perfect for high-volume specialty coffee shops.',
                description_ko: '디팅 1403 숍 그라인더는 140mm 버를 갖춘 고중량 그라인더로, 대용량 스페셜티 커피숍에 완벽합니다.',
                imageUrl: null
            },
            {
                id: 'ditting-1403-industrial',
                name: '1403 INDUSTRIAL Industrial Grinder',
                name_ko: '디팅 1403 인더스트리얼 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '140mm',
                description: 'The Ditting 1403 INDUSTRIAL Grinder is designed for industrial-scale coffee production with continuous operation capability.',
                description_ko: '디팅 1403 인더스트리얼 그라인더는 연속 작동 기능을 갖춘 산업 규모의 커피 생산을 위해 설계되었습니다.',
                imageUrl: null
            },
            {
                id: 'ditting-1827-high-volume',
                name: '1827 HIGH VOLUME Industrial Grinder',
                name_ko: '디팅 1827 하이 볼륨 인더스트리얼 그라인더',
                brand: 'Ditting',
                type: 'electric',
                adjustmentType: 'stepped',
                burr: 'flat',
                burrSize: '180mm',
                description: 'The Ditting 1827 HIGH VOLUME Industrial Grinder is the ultimate solution for large-scale coffee production with massive 180mm burrs.',
                description_ko: '디팅 1827 하이 볼륨 인더스트리얼 그라인더는 180mm 대형 버를 갖춘 대규모 커피 생산을 위한 최고의 솔루션입니다.',
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
            message: `디팅(Ditting) 그라인더 ${addedCount}개가 성공적으로 추가되었습니다.`,
            addedCount,
            results
        });
    } catch (error) {
        console.error('Error adding Ditting models:', error);
        return NextResponse.json({
            success: false,
            error: '디팅(Ditting) 모델 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 