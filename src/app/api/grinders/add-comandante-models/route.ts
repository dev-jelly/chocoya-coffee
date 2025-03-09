import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 추가할 새 코만단테 모델들
        const newGrinders = [
            {
                id: 'comandante-x25',
                name: 'Comandante X25',
                name_ko: '코만단테 X25',
                brand: 'Comandante',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Comandante X25 is a premium manual coffee grinder with high-quality burrs designed for both filter and espresso.',
                description_ko: '코만단테 X25는 필터와 에스프레소 모두에 적합한 고품질 버를 갖춘 프리미엄 수동 커피 그라인더입니다.',
                imageUrl: null
            },
            {
                id: 'comandante-c60',
                name: 'Comandante C60',
                name_ko: '코만단테 C60',
                brand: 'Comandante',
                type: 'manual',
                adjustmentType: 'stepped',
                burr: 'conical',
                burrSize: '38mm',
                description: 'The Comandante C60 is a high-capacity manual coffee grinder perfect for brewing larger batches.',
                description_ko: '코만단테 C60은 대량 추출에 적합한 대용량 수동 커피 그라인더입니다.',
                imageUrl: null
            }
        ];

        // 이미 존재하는지 확인
        const existingX25 = await prisma.grinder.findUnique({
            where: { id: 'comandante-x25' }
        });

        const existingC60 = await prisma.grinder.findUnique({
            where: { id: 'comandante-c60' }
        });

        const results = [];

        // X25 추가
        if (!existingX25) {
            const x25 = await prisma.grinder.create({
                data: newGrinders[0]
            });
            results.push(x25);
        } else {
            results.push({ ...existingX25, status: '이미 존재함' });
        }

        // C60 추가
        if (!existingC60) {
            const c60 = await prisma.grinder.create({
                data: newGrinders[1]
            });
            results.push(c60);
        } else {
            results.push({ ...existingC60, status: '이미 존재함' });
        }

        return NextResponse.json({
            success: true,
            message: '코만단테 X25와 C60 모델이 추가되었습니다.',
            addedGrinders: results
        });
    } catch (error) {
        console.error('Error adding Comandante models:', error);
        return NextResponse.json({
            success: false,
            error: '코만단테 모델 추가 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 