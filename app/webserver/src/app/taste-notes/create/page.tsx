import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TasteNoteForm from '@/components/taste-note/taste-note-form';
import { createClient } from '@/lib/supabase-server'; 
import { redirect } from 'next/navigation';

export const metadata = {
    title: '맛 노트 작성 | 초코야 커피',
    description: '새로운 커피 맛 노트를 작성하세요',
};

export default async function CreateTasteNotePage() {
    // Supabase 클라이언트 생성 및 사용자 정보 가져오기
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        redirect('/auth/login?callbackUrl=/taste-notes/create');
    }

    return (
        <div className="container px-4 md:px-6 py-6 md:py-10">
            <Link
                href="/taste-notes"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
            >
                <ArrowLeft size={16} className="mr-1" /> 맛 노트 목록으로 돌아가기
            </Link>

            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold">새 맛 노트 작성</h1>
                <p className="text-muted-foreground mt-1">
                    커피의 맛과 느낌을 기록하세요. 나만의 커피 경험을 추적하고 공유할 수 있습니다.
                </p>
            </div>

            <TasteNoteForm userId={user.id} />
        </div>
    );
} 