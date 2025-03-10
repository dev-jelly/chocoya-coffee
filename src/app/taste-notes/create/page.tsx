import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import TasteNoteForm from '@/components/taste-note/taste-note-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const metadata = {
  title: '맛 노트 기록하기 | 초코야 커피',
  description: '나만의 커피 맛 노트를 기록하고 관리하세요',
};

export default async function CreateTasteNotePage() {
  // 세션에서 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/taste-notes/create');
  }
  
  return (
    <div className="container mx-auto py-10">
      <Link href="/recipes" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        레시피 목록으로 돌아가기
      </Link>
      
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="mr-2" />
            커피 맛 노트 기록하기
          </h1>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md mb-6">
          <TasteNoteForm userId={session.user.id} />
        </div>
      </div>
    </div>
  );
} 