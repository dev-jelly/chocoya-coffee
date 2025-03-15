import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        // Supabase 클라이언트 생성
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            {
                cookies: {
                    async get(name: string) {
                        const cookie = await cookieStore.get(name);
                        return cookie?.value;
                    },
                    set() { },
                    remove() { },
                },
            }
        );

        // 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser();

        if (!user?.id) {
            return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
        }

        const body = await request.json();
        const { userId, currentPassword, newPassword } = body;

        // 요청한 사용자가 본인인지 확인
        if (user.id !== userId) {
            return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
        }

        // 사용자 정보 가져오기
        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true },
        });

        if (!dbUser) {
            return NextResponse.json({ error: '사용자를 찾을 수 없습니다' }, { status: 404 });
        }

        // 현재 비밀번호 확인
        if (dbUser.password) {
            const passwordValid = await bcrypt.compare(currentPassword, dbUser.password);
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

        // Supabase 비밀번호도 업데이트
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('Supabase 비밀번호 업데이트 오류:', error);
            // DB 비밀번호는 업데이트되었으므로 오류를 반환하지 않고 계속 진행
        }

        return NextResponse.json({ message: '비밀번호가 성공적으로 변경되었습니다' });
    } catch (error) {
        console.error('비밀번호 변경 오류:', error);
        return NextResponse.json(
            { error: '비밀번호 변경 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
} 