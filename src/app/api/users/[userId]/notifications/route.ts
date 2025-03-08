import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 알림 설정 가져오기
export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // 세션 확인
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
        }

        const userId = params.userId;

        // 요청한 사용자가 본인인지 확인
        if (session.user.id !== userId) {
            return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
        }

        // 사용자의 알림 설정 가져오기
        const notificationSettings = await prisma.notificationSettings.findUnique({
            where: { userId },
        });

        // 설정이 없으면 기본값 반환
        if (!notificationSettings) {
            return NextResponse.json({
                preferences: {
                    emailNotifications: true,
                    newRecipeNotifications: true,
                    marketingNotifications: false,
                    securityNotifications: true,
                },
            });
        }

        return NextResponse.json({
            preferences: {
                emailNotifications: notificationSettings.emailNotifications,
                newRecipeNotifications: notificationSettings.newRecipeNotifications,
                marketingNotifications: notificationSettings.marketingNotifications,
                securityNotifications: notificationSettings.securityNotifications,
            },
        });
    } catch (error) {
        console.error('알림 설정 조회 오류:', error);
        return NextResponse.json(
            { error: '알림 설정 조회 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}

// 알림 설정 업데이트
export async function POST(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // 세션 확인
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
        }

        const userId = params.userId;

        // 요청한 사용자가 본인인지 확인
        if (session.user.id !== userId) {
            return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
        }

        // 요청 본문 파싱
        const body = await request.json();
        const { preferences } = body;

        // 설정 유효성 검사
        if (!preferences) {
            return NextResponse.json(
                { error: '알림 설정 정보가 필요합니다' },
                { status: 400 }
            );
        }

        // 알림 설정 업데이트 또는 생성 (upsert)
        const updatedSettings = await prisma.notificationSettings.upsert({
            where: { userId },
            update: {
                emailNotifications: preferences.emailNotifications ?? true,
                newRecipeNotifications: preferences.newRecipeNotifications ?? true,
                marketingNotifications: preferences.marketingNotifications ?? false,
                securityNotifications: preferences.securityNotifications ?? true,
            },
            create: {
                userId,
                emailNotifications: preferences.emailNotifications ?? true,
                newRecipeNotifications: preferences.newRecipeNotifications ?? true,
                marketingNotifications: preferences.marketingNotifications ?? false,
                securityNotifications: preferences.securityNotifications ?? true,
            },
        });

        return NextResponse.json({
            message: '알림 설정이 성공적으로 업데이트되었습니다',
            preferences: {
                emailNotifications: updatedSettings.emailNotifications,
                newRecipeNotifications: updatedSettings.newRecipeNotifications,
                marketingNotifications: updatedSettings.marketingNotifications,
                securityNotifications: updatedSettings.securityNotifications,
            },
        });
    } catch (error) {
        console.error('알림 설정 업데이트 오류:', error);
        return NextResponse.json(
            { error: '알림 설정 업데이트 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
} 