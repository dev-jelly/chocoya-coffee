import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase-server';
import { ArrowLeft } from 'lucide-react';
import ProfileEditForm from '@/components/auth/profile-edit-form';

export const metadata = {
  title: '프로필 수정 | 초코야 커피',
  description: '내 프로필 정보 수정',
};

export default async function ProfileEditPage() {
  // Supabase 클라이언트 생성 및 사용자 정보 가져오기
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  if (!authUser?.id) {
    redirect('/auth/login?callbackUrl=/profile/edit');
  }
  
  // 사용자 정보 가져오기
  const user = await prisma.user.findUnique({
    where: {
      id: authUser.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
    },
  });
  
  if (!user) {
    return <div className="container py-8">사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} className="mr-1" /> 프로필로 돌아가기
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">프로필 수정</h1>
        </div>
        
        <div className="bg-card border rounded-lg p-6">
          <ProfileEditForm user={user} />
        </div>
      </div>
    </div>
  );
} 