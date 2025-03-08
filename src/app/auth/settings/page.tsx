import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import PasswordChangeForm from '@/components/auth/password-change-form';
import NotificationSettings from '@/components/auth/notification-settings';
import DeleteAccountSection from '@/components/auth/delete-account-section';

export const metadata = {
  title: '계정 설정 | 초코야 커피',
  description: '계정 설정 및 관리 페이지',
};

export default async function SettingsPage() {
  // 로그인 확인
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // 사용자 ID와 이메일 가져오기
  const userId = session.user.id;
  const userEmail = session.user.email;

  return (
    <div className="container mx-auto py-10">
      <Link href="/auth/profile" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        프로필로 돌아가기
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">계정 설정</h1>

        <div className="space-y-6">
          {/* 비밀번호 변경 섹션 */}
          <PasswordChangeForm userId={userId} userEmail={userEmail} />

          {/* 알림 설정 섹션 */}
          <NotificationSettings userId={userId} />

          {/* 계정 삭제 섹션 */}
          <DeleteAccountSection userId={userId} />
        </div>
      </div>
    </div>
  );
} 