import React from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Coffee, ArrowUpDown } from 'lucide-react';
import { getTasteNotes } from '@/lib/actions/taste-note';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { formatKoreanDate } from '@/lib/utils';

export const metadata = {
    title: '맛 노트 | 초코야 커피',
    description: '나만의 커피 맛 노트를 기록하고 관리하세요',
};

export default async function TasteNotesPage() {
    // Supabase 클라이언트 생성
    const supabase = await createClient();
    
    // 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        redirect('/auth/login?callbackUrl=/taste-notes');
    }

    // 맛 노트 목록 가져오기
    const tasteNotes = await getTasteNotes(user.id);

    return (
        <div className="container px-4 md:px-6 py-6 md:py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                    <BookOpen className="mr-2" /> 내 맛 노트
                </h1>

                <Link
                    href="/taste-notes/create"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Plus size={16} className="mr-1" /> 새 맛 노트
                </Link>
            </div>

            {tasteNotes.length === 0 ? (
                <div className="bg-card border rounded-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-4">맛 노트가 없습니다</h2>
                    <p className="text-muted-foreground mb-6">
                        맛 노트를 작성하여 나만의 커피 경험을 기록해보세요.
                    </p>
                    <Link
                        href="/taste-notes/create"
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={16} className="mr-1" /> 첫 맛 노트 작성하기
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasteNotes.map((note) => (
                        <Link key={note.id} href={`/taste-notes/${note.id}`} passHref>
                            <div
                                className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                                style={{
                                    borderLeft: note.primaryColor ? `4px solid ${note.primaryColor}` : undefined
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-lg font-semibold">{note.coffeeName}</h2>
                                    <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
                                        {note.brewingMethod}
                                    </div>
                                </div>

                                <div className="mb-4 flex-grow">
                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">산미</p>
                                            <p className="font-semibold">{note.acidity}/10</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">단맛</p>
                                            <p className="font-semibold">{note.sweetness}/10</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-muted-foreground">바디</p>
                                            <p className="font-semibold">{note.body}/10</p>
                                        </div>
                                    </div>

                                    {note.flavorNotes && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {note.flavorNotes}
                                        </p>
                                    )}
                                </div>

                                <div className="text-xs text-muted-foreground">
                                    {formatKoreanDate(note.createdAt, { showWeekday: true })}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 