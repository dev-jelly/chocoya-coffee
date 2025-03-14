import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        // '1Zpresso' 브랜드의 모든 그라인더 찾기
        const zpressoGrinders = await prisma.grinder.findMany({
            where: {
                brand: '1Zpresso',
            }
        });

        let updatedCount = 0;
        const updatedGrinders = [];

        // 각 1Zpresso 그라인더 업데이트
        for (const grinder of zpressoGrinders) {
            // 영문 이름에서 "Manual Coffee Grinder"와 같은 불필요한 부분 제거
            let newName = grinder.name;

            // 모든 Manual Coffee Grinder, Manual Grinder 제거
            newName = newName.replace(/\s+Manual\s+(Coffee\s+)?Grinder/gi, '');

            // 1Zpresso 접두사 제거 (영문 이름에는 필요 없음)
            newName = newName.replace(/^1Zpresso\s+/i, '');

            // 이름이 너무 짧으면 원래 이름 유지 (실수 방지)
            if (newName.length < 2) {
                newName = grinder.name.replace(/\s+Manual\s+(Coffee\s+)?Grinder/gi, '');
            }

            // 한글 이름 설정 - "1Zpresso 모델명" 형식으로 통일
            const modelName = newName;
            const newNameKo = `1Zpresso ${modelName}`;

            const updatedGrinder = await prisma.grinder.update({
                where: { id: grinder.id },
                data: {
                    name: newName,
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
            message: `1Zpresso 그라인더 데이터가 성공적으로 업데이트되었습니다. ${updatedCount}개의 그라인더가 수정되었습니다.`,
            updatedCount,
            updatedGrinders
        });
    } catch (error) {
        console.error('Error updating 1Zpresso grinders:', error);
        return NextResponse.json({
            success: false,
            error: '1Zpresso 그라인더 데이터 업데이트 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
} 