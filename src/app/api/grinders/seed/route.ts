import { NextRequest, NextResponse } from 'next/server';
import { seedGrinders } from '@/lib/actions/grinder';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
    try {
        // 관리자 권한 확인 (실제 운영 환경에서는 더 강력한 검증 필요)
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: '인증이 필요합니다.' },
                { status: 401 }
            );
        }

        // 관리자 이메일 확인 (실제 구현 시 관리자 역할이 있는지 확인)
        // 여기서는 간단히 처리
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        if (session.user.email !== adminEmail) {
            return NextResponse.json(
                { error: '관리자 권한이 필요합니다.' },
                { status: 403 }
            );
        }

        // 이미 그라인더 데이터가 있는지 확인
        const existingGrinders = await prisma.grinder.count();

        if (existingGrinders > 0) {
            return NextResponse.json(
                { message: '그라인더 데이터가 이미 존재합니다.', count: existingGrinders },
                { status: 200 }
            );
        }

        // 그라인더 데이터 시드 실행
        const result = await seedGrinders();

        if (result.success) {
            return NextResponse.json(
                { message: result.message },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error seeding grinder data:', error);
        return NextResponse.json(
            { error: '그라인더 데이터 시드 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 