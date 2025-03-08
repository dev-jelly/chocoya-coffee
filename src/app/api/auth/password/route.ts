import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        // 세션 확인
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, currentPassword, newPassword } = body;

        // 요청한 사용자가 본인인지 확인
        if (session.user.id !== userId) {
            return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
        }

        // 사용자 정보 가져오기
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true },
        });

        if (!user) {
            return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
        }

        // 현재 비밀번호 확인
        if (user.password) {
            const passwordValid = await bcrypt.compare(currentPassword, user.password);
            if (!passwordValid) {
                return NextResponse.json({ error: '현재 비밀번호가 일치하지 않습니다' }, { status: 400 });
            }
        }

        // 새 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 사용자 비밀번호 업데이트
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: '비밀번호가 성공적으로 변경되었습니다' });
    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        return NextResponse.json(
            { error: '비밀번호 변경 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
} 