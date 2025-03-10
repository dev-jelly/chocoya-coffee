import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 추가할 Mazzer 전문용 그라인더 모델들
        const newGrinders = [
            {
                id: 'mazzer-major-v',
                name: 'Major V',
                name_ko: '마쩨르 메이저 V',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '83mm',
                description: 'The Mazzer Major V is a professional on-demand grinder with 83mm flat burrs, designed for high-volume coffee shops.',
                description_ko: '마쩨르 메이저 V는 83mm 평면 버를 갖춘 전문가용 온디맨드 그라인더로, 대용량 커피숍을 위해 설계되었습니다.',
                imageUrl: null
            },
            {
                id: 'mazzer-super-jolly-v',
                name: 'Super Jolly V',
                name_ko: '마쩨르 수퍼 졸리 V',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '64mm',
                description: 'The Mazzer Super Jolly V is a versatile commercial grinder with 64mm flat burrs, ideal for medium-sized coffee shops.',
                description_ko: '마쩨르 수퍼 졸리 V는 64mm 평면 버를 갖춘 다용도 상업용 그라인더로, 중형 커피숍에 이상적입니다.',
                imageUrl: null
            },
            {
                id: 'mazzer-mini-v',
                name: 'Mini V',
                name_ko: '마쩨르 미니 V',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '58mm',
                description: 'The Mazzer Mini V is a compact commercial grinder with 58mm flat burrs, perfect for small coffee shops and home use.',
                description_ko: '마쩨르 미니 V는 58mm 평면 버를 갖춘 소형 상업용 그라인더로, 소규모 커피숍과 가정용으로 완벽합니다.',
                imageUrl: null
            },
            {
                id: 'mazzer-robur-s',
                name: 'Robur S',
                name_ko: '마쩨르 로부르 S',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'conical',
                burrSize: '71mm',
                description: 'The Mazzer Robur S features 71mm conical burrs, offering exceptional grinding precision for espresso with minimal heat generation.',
                description_ko: '마쩨르 로부르 S는 71mm 원뿔형 버를 갖추고 있으며, 최소한의 열 발생으로 에스프레소를 위한 뛰어난 그라인딩 정밀도를 제공합니다.',
                imageUrl: null
            },
            {
                id: 'mazzer-kony-s',
                name: 'Kony S',
                name_ko: '마쩨르 코니 S',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'conical',
                burrSize: '63mm',
                description: 'The Mazzer Kony S is equipped with 63mm conical burrs, designed for consistent espresso grinding with low retention.',
                description_ko: '마쩨르 코니 S는 63mm 원뿔형 버를 장착하고 있으며, 낮은 잔류량으로 일관된 에스프레소 그라인딩을 위해 설계되었습니다.',
                imageUrl: null
            },
            {
                id: 'mazzer-zm',
                name: 'ZM',
                name_ko: '마쩨르 ZM',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '83mm',
                description: 'The Mazzer ZM is a high-end filter coffee grinder with 83mm flat burrs and advanced technology for precise particle size distribution.',
                description_ko: '마쩨르 ZM은 83mm 평면 버와 정밀한 입자 크기 분포를 위한 고급 기술을 갖춘 고급 필터 커피 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'mazzer-dk',
                name: 'DK',
                name_ko: '마쩨르 DK',
                brand: 'Mazzer',
                type: 'electric',
                adjustmentType: 'stepless',
                burr: 'flat',
                burrSize: '65mm',
                description: 'The Mazzer DK is a high-performance flat burr grinder designed for the filter coffee enthusiasts requiring excellent uniformity.',
                description_ko: '마쩨르 DK는 우수한 균일성을 요구하는 필터 커피 애호가를 위해 설계된 고성능 평면 버 그라인더입니다.',
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
            message: `마쩨르(Mazzer) 그라인더 ${addedCount}개가 성공적으로 추가되었습니다.`,
            addedCount,
            results
        });
    } catch (error) {
        console.error('Error adding Mazzer models:', error);
        return NextResponse.json({
            success: false,
            error: '마쩨르(Mazzer) 모델 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 