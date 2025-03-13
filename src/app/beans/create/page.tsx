import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Bean } from 'lucide-react';
import { redirect } from 'next/navigation';
import BeanForm from '@/components/bean/bean-form';
import { createClient } from '@/lib/supabase-server';

export const metadata = {
  title: '원두 정보 등록 | 초코야 커피',
  description: '나만의 원두 정보를 등록하고 관리하세요',
};

export default async function CreateBeanPage() {
  // Supabase 클라이언트 생성 및 사용자 정보 가져오기
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.id) {
    redirect('/auth/login?callbackUrl=/beans/create');
  }
  
  return (
    <div className="container mx-auto py-10">
      <Link href="/beans" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        원두 목록으로 돌아가기
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Bean className="mr-2" />
            원두 정보 등록하기
          </h1>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
          <BeanForm userId={user.id} />
        </div>
      </div>
    </div>
  );
} 