import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const grinders = await prisma.grinder.findMany({
            include: {
                settings: true,
            },
        });

        return NextResponse.json({
            success: true,
            count: grinders.length,
            grinders: grinders.map(g => ({
                id: g.id,
                name: g.name,
                brand: g.brand,
            })),
        });
    } catch (error) {
        console.error('Error fetching grinders:', error);
        return NextResponse.json(
            { error: '그라인더 데이터 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 