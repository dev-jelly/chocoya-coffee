import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
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

        // FormData 처리
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const bio = formData.get('bio') as string;
        const profileImage = formData.get('profileImage') as File | null;

        // 이메일 중복 검사 (현재 사용자 제외)
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    id: { not: userId },
                },
            });

            if (existingUser) {
                return NextResponse.json(
                    { error: '이미 사용 중인 이메일입니다' },
                    { status: 400 }
                );
            }
        }

        // 이미지 처리
        let imageUrl = undefined;
        if (profileImage) {
            // 여기서는 간단히 처리하지만, 실제로는 이미지를 클라우드 스토리지(예: S3, Cloudinary)에 업로드해야 합니다
            // 이 예제에서는 이미지 처리를 생략합니다

            // 예시: Cloudinary나 다른 서비스를 사용한 업로드 로직
            // const formData = new FormData();
            // formData.append('file', profileImage);
            // formData.append('upload_preset', 'your_preset');
            // const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
            //   method: 'POST',
            //   body: formData,
            // });
            // const data = await response.json();
            // imageUrl = data.secure_url;

            // 실제 이미지 업로드 로직이 구현되기 전까지 임시로 사용할 더미 URL
            imageUrl = `/dummy-image-${Date.now()}.jpg`;
        }

        // 사용자 정보 업데이트
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                bio,
                ...(imageUrl && { image: imageUrl }),
            },
        });

        return NextResponse.json({
            message: '프로필이 성공적으로 업데이트되었습니다',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
                bio: updatedUser.bio,
            },
        });
    } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        return NextResponse.json(
            { error: '프로필 업데이트 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
}

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

        // 사용자 정보 가져오기
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: '사용자를 찾을 수 없습니다' },
                { status: 404 }
            );
        }

        // 요청한 사용자가 본인이거나 관리자인지 확인
        if (session.user.id !== userId) {
            // 여기서는 간단하게 처리하지만, 실제로는 관리자 권한 확인 로직이 필요합니다
            return NextResponse.json({ error: '권한이 없습니다' }, { status: 403 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('프로필 조회 오류:', error);
        return NextResponse.json(
            { error: '프로필 조회 중 오류가 발생했습니다' },
            { status: 500 }
        );
    }
} 