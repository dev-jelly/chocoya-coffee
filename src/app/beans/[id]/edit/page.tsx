import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Bean } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect, notFound } from 'next/navigation';
import BeanForm from '@/components/bean/bean-form';
import { getBeanById } from '@/lib/actions/bean';

export const metadata = {
  title: '원두 정보 수정 | 초코야 커피',
  description: '등록한 원두 정보를 수정하세요',
};

export default async function EditBeanPage({
  params,
}: {
  params: { id: string };
}) {
  // 세션에서 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/beans/${params.id}/edit`);
  }
  
  // 원두 정보 가져오기
  const bean = await getBeanById(params.id);
  
  if (!bean) {
    notFound();
  }
  
  // 작성자 확인
  if (bean.userId !== session.user.id) {
    redirect(`/beans/${params.id}`);
  }
  
  return (
    <div className="container mx-auto py-10">
      <Link href={`/beans/${params.id}`} className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        원두 상세 페이지로 돌아가기
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Bean className="mr-2" />
            원두 정보 수정하기
          </h1>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
          <BeanForm userId={session.user.id} bean={bean} isEditing={true} />
        </div>
      </div>
    </div>
  );
} 