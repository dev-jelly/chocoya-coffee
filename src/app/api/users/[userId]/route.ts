import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase-server';

export async function DELETE(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // Supabase 클라이언트 생성
        const supabase = await createClient();
        
        // 인증된 사용자 확인
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) {
            return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
        }

        const userId = params.userId;

        // 요청한 사용자가 본인인지 확인
        if (user.id !== userId) {
            return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
        }

        // 사용자 정보 가져오기
        const userInfo = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userInfo) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        // 사용자의 모든 데이터 삭제
        // Prisma의 cascade 기능을 사용하면 관련된 모든 데이터가 자동으로 삭제됩니다
        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({
            message: '계정이 성공적으로 삭제되었습니다',
        });
    } catch (error) {
        console.error('계정 삭제 오류:', error);
        return NextResponse.json(
            { error: '계정 삭제 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = params.userId;
        
        // Supabase 클라이언트 생성
        const supabase = await createClient();
        
        // 인증된 사용자 확인 (선택적으로 처리)
        const { data: { user } } = await supabase.auth.getUser();
        
        // GET 요청은 인증 확인을 완화하여 로그인 직후에도 동작하도록 함
        // 1. 인증된 사용자가 있거나
        // 2. 단순히 사용자 ID를 기반으로 공개 정보만 조회하는 경우
        
        // 사용자 정보 가져오기 (공개 정보만)
        const userInfo = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                image: true,
                bio: true,
                createdAt: true,
            },
        });

        if (!userInfo) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        return NextResponse.json({ userInfo });
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        return NextResponse.json(
            { error: '사용자 정보 조회 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
} 