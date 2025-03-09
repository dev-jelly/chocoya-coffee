import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 'Comandante' 브랜드의 모든 그라인더 찾기
        const comandanteGrinders = await prisma.grinder.findMany({
            where: {
                brand: 'Comandante',
            }
        });

        let updatedCount = 0;
        const updatedGrinders = [];

        // 각 코만단테 그라인더 업데이트
        for (const grinder of comandanteGrinders) {
            // 이름에 '컴댄트'가 포함되어 있으면 '코만단테'로 변경
            const newNameKo = grinder.name_ko ? grinder.name_ko.replace(/컴댄트/, '코만단테') :
                `코만단테 ${grinder.name.replace('Comandante ', '')}`;

            const updatedGrinder = await prisma.grinder.update({
                where: { id: grinder.id },
                data: {
                    // 브랜드명은 유지하고 한글 이름만 변경
                    name_ko: newNameKo
                }
            });

            updatedCount++;
            updatedGrinders.push({
                id: updatedGrinder.id,
                name: updatedGrinder.name,
                name_ko: updatedGrinder.name_ko,
                brand: updatedGrinder.brand
            });
        }

        return NextResponse.json({
            success: true,
            message: `코만단테(Comandante) 그라인더 데이터가 성공적으로 업데이트되었습니다. ${updatedCount}개의 그라인더가 수정되었습니다.`,
            updatedCount,
            updatedGrinders
        });
    } catch (error) {
        console.error('Error updating Comandante grinders:', error);
        return NextResponse.json({
            success: false,
            error: '코만단테 그라인더 데이터 업데이트 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 