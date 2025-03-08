'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { grinders as initialGrinders } from "@/data/grinders";

// 그라인더 목록 가져오기
export async function getGrinders(search?: string) {
    try {
        let whereClause = {};

        if (search) {
            whereClause = {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { brand: { contains: search, mode: 'insensitive' } },
                    { type: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            };
        }

        const grinders = await prisma.grinder.findMany({
            where: whereClause,
            include: {
                settings: true,
            },
            orderBy: { brand: 'asc' },
        });

        return grinders;
    } catch (error) {
        console.error('Error fetching grinders:', error);
        return [];
    }
}

// 그라인더 상세 정보 가져오기
export async function getGrinderById(id: string) {
    try {
        const grinder = await prisma.grinder.findUnique({
            where: { id },
            include: {
                settings: true,
                recipes: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        return grinder;
    } catch (error) {
        console.error('Error fetching grinder:', error);
        return null;
    }
}

// 그라인더 생성
export async function createGrinder(data: any) {
    try {
        const { settings, ...grinderData } = data;

        const grinder = await prisma.grinder.create({
            data: {
                ...grinderData,
                settings: {
                    create: settings || [],
                },
            },
        });

        revalidatePath('/grinders');
        return { success: true, data: grinder };
    } catch (error) {
        console.error('Error creating grinder:', error);
        return { success: false, error: 'Failed to create grinder' };
    }
}

// 그라인더 수정
export async function updateGrinder(id: string, data: any) {
    try {
        const { settings, ...grinderData } = data;

        // 기존 설정 삭제 후 새로운 설정 생성
        if (settings) {
            await prisma.grinderSetting.deleteMany({
                where: { grinderId: id },
            });
        }

        const grinder = await prisma.grinder.update({
            where: { id },
            data: {
                ...grinderData,
                ...(settings && {
                    settings: {
                        create: settings,
                    },
                }),
            },
        });

        revalidatePath(`/grinders/${id}`);
        revalidatePath('/grinders');
        return { success: true, data: grinder };
    } catch (error) {
        console.error('Error updating grinder:', error);
        return { success: false, error: 'Failed to update grinder' };
    }
}

// 그라인더 삭제
export async function deleteGrinder(id: string) {
    try {
        await prisma.grinder.delete({
            where: { id },
        });

        revalidatePath('/grinders');
        return { success: true };
    } catch (error) {
        console.error('Error deleting grinder:', error);
        return { success: false, error: 'Failed to delete grinder' };
    }
}

// 브루잉 방식에 따른 그라인더 설정 가져오기
export async function getGrinderSettingsByBrewingMethod(grinderId: string, brewingMethod: string) {
    try {
        const settings = await prisma.grinderSetting.findMany({
            where: {
                grinderId,
                brewingMethod: {
                    contains: brewingMethod,
                    mode: 'insensitive',
                },
            },
        });

        return settings;
    } catch (error) {
        console.error('Error fetching grinder settings:', error);
        return [];
    }
}

// 초기 그라인더 데이터 DB에 추가 (시드용)
export async function seedGrinders() {
    try {
        // 모든 그라인더 데이터를 순회하며 추가
        for (const grinderData of initialGrinders) {
            const { settings, ...grinderInfo } = grinderData;

            // 이미 존재하는지 확인
            const existingGrinder = await prisma.grinder.findFirst({
                where: {
                    name: grinderInfo.name,
                    brand: grinderInfo.brand,
                },
            });

            if (!existingGrinder) {
                // 그라인더 생성
                await prisma.grinder.create({
                    data: {
                        id: grinderInfo.id,
                        name: grinderInfo.name,
                        brand: grinderInfo.brand,
                        type: grinderInfo.type,
                        burr: grinderInfo.burr,
                        burrSize: grinderInfo.burrSize,
                        adjustmentType: grinderInfo.adjustmentType,
                        description: grinderInfo.description,
                        imageUrl: grinderInfo.imageUrl,
                        settings: {
                            create: settings.map(setting => ({
                                name: setting.name,
                                value: setting.value,
                                brewingMethod: setting.brewingMethod,
                                description: setting.description,
                            })),
                        },
                    },
                });
            }
        }

        return { success: true, message: '그라인더 데이터가 성공적으로 추가되었습니다.' };
    } catch (error) {
        console.error('Error seeding grinders:', error);
        return { success: false, error: '그라인더 데이터 추가 중 오류가 발생했습니다.' };
    }
} 