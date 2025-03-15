import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee, BookOpen, Pencil, Trash2 } from 'lucide-react';
import { getTasteNoteById, deleteTasteNote } from '@/lib/actions/taste-note';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { DeleteTasteNoteButton } from '@/components/taste-note/delete-taste-note-button';

export default async function TasteNoteDetailPage({ params }: any) {
    // Supabase 클라이언트 생성 및 사용자 정보 가져오기
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user?.id) {
        notFound();
    }

    // 맛 노트 상세 정보 가져오기
    const tasteNote = await getTasteNoteById(params.id, user.id);

    if (!tasteNote) {
        notFound();
    }

    // 맛 노트에서 사용된 플레이버 노트 추출
    const flavorLabelsArray = tasteNote.flavorLabels ?
        tasteNote.flavorLabels.split(',').filter(Boolean) :
        [];

    // 맛 노트에서 사용된 플레이버 컬러 추출
    const flavorColorsArray = tasteNote.flavorColors ?
        tasteNote.flavorColors.split(',').filter(Boolean) :
        [];

    return (
        <div className="container px-4 md:px-6 py-6 md:py-10">
            <Link
                href="/taste-notes"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
            >
                <ArrowLeft size={16} className="mr-1" /> 맛 노트 목록으로 돌아가기
            </Link>

            <div className="bg-card border rounded-lg p-4 md:p-6 lg:p-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
                        <BookOpen className="mr-2" /> {tasteNote.coffeeName}
                    </h1>

                    <div className="flex space-x-2">
                        <Link
                            href={`/taste-notes/${tasteNote.id}/edit`}
                            className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                        >
                            <Pencil size={16} />
                        </Link>
                        <form action={async () => {
                            'use server';
                            await deleteTasteNote(tasteNote.id, user.id);
                        }}>
                            <DeleteTasteNoteButton tasteNoteId={tasteNote.id} />
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">커피 정보</h2>
                        <div className="space-y-2">
                            <div>
                                <p className="font-medium">원두 이름</p>
                                <p className="text-muted-foreground">{tasteNote.coffeeName}</p>
                            </div>

                            {tasteNote.origin && (
                                <div>
                                    <p className="font-medium">원산지</p>
                                    <p className="text-muted-foreground">{tasteNote.origin}</p>
                                </div>
                            )}

                            {tasteNote.roastLevel && (
                                <div>
                                    <p className="font-medium">로스팅 단계</p>
                                    <p className="text-muted-foreground">{tasteNote.roastLevel}</p>
                                </div>
                            )}

                            {tasteNote.roaster && (
                                <div>
                                    <p className="font-medium">로스터리</p>
                                    <p className="text-muted-foreground">{tasteNote.roaster}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">추출 정보</h2>
                        <div className="space-y-2">
                            <div>
                                <p className="font-medium">추출 방법</p>
                                <p className="text-muted-foreground">{tasteNote.brewingMethod}</p>
                            </div>

                            {tasteNote.grindSize && (
                                <div>
                                    <p className="font-medium">분쇄도</p>
                                    <p className="text-muted-foreground">{tasteNote.grindSize}</p>
                                </div>
                            )}

                            {tasteNote.beanAmount && (
                                <div>
                                    <p className="font-medium">원두량</p>
                                    <p className="text-muted-foreground">{tasteNote.beanAmount}</p>
                                </div>
                            )}

                            {tasteNote.waterAmount && (
                                <div>
                                    <p className="font-medium">물 용량</p>
                                    <p className="text-muted-foreground">{tasteNote.waterAmount}</p>
                                </div>
                            )}

                            {tasteNote.waterTemp && (
                                <div>
                                    <p className="font-medium">물 온도</p>
                                    <p className="text-muted-foreground">{tasteNote.waterTemp}</p>
                                </div>
                            )}

                            {tasteNote.brewTime && (
                                <div>
                                    <p className="font-medium">추출 시간</p>
                                    <p className="text-muted-foreground">{tasteNote.brewTime}</p>
                                </div>
                            )}

                            {tasteNote.ratio && (
                                <div>
                                    <p className="font-medium">원두:물 비율</p>
                                    <p className="text-muted-foreground">{tasteNote.ratio}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">맛 평가</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-secondary/20 p-4 rounded-lg">
                            <p className="font-medium text-sm">산미</p>
                            <p className="text-2xl font-bold">{tasteNote.acidity}/10</p>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-lg">
                            <p className="font-medium text-sm">단맛</p>
                            <p className="text-2xl font-bold">{tasteNote.sweetness}/10</p>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-lg">
                            <p className="font-medium text-sm">바디</p>
                            <p className="text-2xl font-bold">{tasteNote.body}/10</p>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-lg">
                            <p className="font-medium text-sm">쓴맛</p>
                            <p className="text-2xl font-bold">{tasteNote.bitterness || "N/A"}/10</p>
                        </div>
                    </div>

                    {tasteNote.flavorNotes && (
                        <div className="mb-4">
                            <p className="font-medium mb-2">풍미 노트</p>
                            <p className="text-muted-foreground">{tasteNote.flavorNotes}</p>
                        </div>
                    )}

                    {flavorLabelsArray.length > 0 && (
                        <div className="mb-4">
                            <p className="font-medium mb-2">플레이버 휠</p>
                            <div className="flex flex-wrap gap-2">
                                {flavorLabelsArray.map((labelId, index) => (
                                    <div
                                        key={labelId}
                                        className="px-2 py-1 rounded-full text-xs font-medium text-white"
                                        style={{ backgroundColor: flavorColorsArray[index] || '#888' }}
                                    >
                                        {labelId}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tasteNote.overallRating && (
                        <div>
                            <p className="font-medium mb-2">전체 점수</p>
                            <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                        key={i}
                                        className={`w-5 h-5 ${i < (tasteNote.overallRating || 0)
                                            ? 'text-primary'
                                            : 'text-muted-foreground'
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.798-2.034c-.784-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                                    </svg>
                                ))}
                                <span className="ml-2">{tasteNote.overallRating}/5</span>
                            </div>
                        </div>
                    )}
                </div>

                {tasteNote.notes && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">노트 & 코멘트</h2>
                        <p className="text-muted-foreground whitespace-pre-line">{tasteNote.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
} 