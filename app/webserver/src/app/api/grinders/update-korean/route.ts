import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { grinders as initialGrinders } from '@/data/grinders';

export async function GET(request: NextRequest) {
    try {
        // 기존 그라인더 업데이트
        const results = [];

        for (const grinderData of initialGrinders) {
            // 이름과 브랜드로 매칭
            const existingGrinder = await prisma.grinder.findFirst({
                where: {
                    name: grinderData.name,
                    brand: grinderData.brand,
                },
                include: {
                    settings: true,
                },
            });

            if (existingGrinder) {
                // 그라인더 업데이트
                const updatedGrinder = await prisma.grinder.update({
                    where: { id: existingGrinder.id },
                    data: {
                        name_ko: grinderData.name_ko,
                        description_ko: grinderData.description_ko,
                    },
                });

                results.push({
                    id: updatedGrinder.id,
                    name: updatedGrinder.name,
                    name_ko: updatedGrinder.name_ko,
                });

                // 그라인더 설정 업데이트
                for (const setting of grinderData.settings) {
                    // 이름으로 매칭되는 설정 찾기
                    const existingSetting = existingGrinder.settings.find(s =>
                        s.name.toLowerCase() === setting.name.toLowerCase() ||
                        (s.name.toLowerCase() === setting.name_ko?.toLowerCase())
                    );

                    if (existingSetting) {
                        await prisma.grinderSetting.update({
                            where: { id: existingSetting.id },
                            data: {
                                name_ko: setting.name_ko,
                                description_ko: setting.description_ko,
                            },
                        });
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: '그라인더 한국어 정보가 업데이트되었습니다.',
            updatedGrinders: results.length,
            results,
        });
    } catch (error) {
        console.error('Error updating grinder Korean data:', error);
        return NextResponse.json(
            { error: '그라인더 한국어 데이터 업데이트 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 