import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getTasteNoteById } from '@/lib/actions/taste-note';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import TasteNoteEditForm from '@/components/taste-note/taste-note-edit-form';

export const metadata = {
    title: '맛 노트 수정 | 초코야 커피',
    description: '커피 맛 노트를 수정하고 업데이트하세요',
};

export default async function EditTasteNotePage({
    params,
}: {
    params: { id: string };
}) {
    // Supabase 클라이언트 생성 및 사용자 정보 가져오기
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        redirect('/auth/login?callbackUrl=/taste-notes');
    }

    // 맛 노트 상세 정보 가져오기
    const tasteNote = await getTasteNoteById(params.id, user.id);

    if (!tasteNote) {
        notFound();
    }

    return (
        <div className="container px-4 md:px-6 py-6 md:py-10">
            <Link
                href={`/taste-notes/${params.id}`}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
            >
                <ArrowLeft size={16} className="mr-1" /> 맛 노트 상세로 돌아가기
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center">
                <BookOpen className="mr-2" /> 맛 노트 수정하기
            </h1>

            <div className="mb-6">
                <p className="text-muted-foreground">
                    맛 노트 정보를 수정하고 업데이트하세요. 더 정확하고 상세한 정보를 제공할수록
                    나중에 참고하기 좋습니다.
                </p>
            </div>

            <div className="bg-card border rounded-lg p-4 md:p-6 lg:p-8">
                <TasteNoteEditForm tasteNote={tasteNote} userId={user.id} />
            </div>
        </div>
    );
} 