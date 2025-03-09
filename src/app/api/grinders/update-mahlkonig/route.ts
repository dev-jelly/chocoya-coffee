import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // 말코닉 브랜드의 그라인더 찾기
        const mahlkonigGrinders = await prisma.grinder.findMany({
            where: {
                brand: '말코닉',
            }
        });

        // 결과 저장 배열
        const updatedGrinders = [];
        let updatedCount = 0;

        // 각 그라인더에 대해 브랜드 이름 수정
        for (const grinder of mahlkonigGrinders) {
            // 영문 이름 그대로 유지하고 브랜드만 변경
            const updatedGrinder = await prisma.grinder.update({
                where: { id: grinder.id },
                data: {
                    brand: 'Mahlkönig',
                    name_ko: grinder.name_ko || `말코닉 ${grinder.name}` // 한글 이름이 없는 경우 생성
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
            error: 'Mahlkönig 그라인더 데이터 업데이트 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 