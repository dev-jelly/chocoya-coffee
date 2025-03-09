import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 'Mahlkönig' 브랜드의 모든 그라인더 찾기
        const mahlkonigGrinders = await prisma.grinder.findMany({
            where: {
                brand: 'Mahlkönig',
            }
        });

        let updatedCount = 0;
        const updatedGrinders = [];

        // 각 말코닉 그라인더 업데이트
        for (const grinder of mahlkonigGrinders) {
            const updatedGrinder = await prisma.grinder.update({
                where: { id: grinder.id },
                data: {
                    brand: '말코닉', // 브랜드 이름 한글로 변경
                    // 이름이 그대로면 '말코닉 EK43'과 같이 업데이트, 아니면 기존 name_ko 유지
                    name_ko: grinder.name_ko === grinder.name
                        ? `말코닉 ${grinder.name}`
                        : grinder.name_ko
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
            message: `말코닉(Mahlkönig) 그라인더 데이터가 성공적으로 업데이트되었습니다. ${updatedCount}개의 그라인더가 수정되었습니다.`,
            updatedCount,
            updatedGrinders
        });
    } catch (error) {
        console.error('Error updating Mahlkönig grinders:', error);
        return NextResponse.json({
            success: false,
            error: '말코닉 그라인더 데이터 업데이트 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 