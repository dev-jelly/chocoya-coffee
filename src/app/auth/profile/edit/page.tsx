import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProfileEditForm from '@/components/auth/profile-edit-form';

export const metadata = {
  title: '프로필 수정 | 초코야 커피',
  description: '프로필 정보 수정 페이지',
};

export default async function EditProfilePage() {
  // 로그인 확인
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // 사용자 정보 가져오기
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
    }
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/auth/profile" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        프로필로 돌아가기
      </Link>

      <div className="bg-card p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">프로필 수정</h1>

        <ProfileEditForm user={user} />
      </div>
    </div>
  );
} 