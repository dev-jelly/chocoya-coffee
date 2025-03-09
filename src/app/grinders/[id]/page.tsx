import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Coffee, Settings, Pencil, Trash2 } from 'lucide-react';
import { getGrinderById, deleteGrinder } from '@/lib/actions/grinder';
import { grinderTypeNames, adjustmentTypeNames } from '@/data/grinders';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DeleteGrinderButton } from '@/components/grinder/delete-grinder-button';

export default async function GrinderDetailPage({
    params,
}: {
    params: { id: string };
}) {
    // 세션에서 사용자 정보 가져오기
    const session = await getServerSession(authOptions);

    // 그라인더 상세 정보 가져오기
    const grinder = await getGrinderById(params.id);

    if (!grinder) {
        notFound();
    }

    const isOwner = session?.user?.id === grinder.userId;

    return (
        <div className="container px-4 md:px-6 py-6 md:py-10">
            <Link
                href="/grinders"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
            >
                <ArrowLeft size={16} className="mr-1" /> 그라인더 목록으로 돌아가기
            </Link>

            <div className="bg-card border rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 그라인더 이미지 */}
                    {grinder.imageUrl && (
                        <div className="p-4 md:p-6 flex items-center justify-center">
                            <div className="relative w-full h-64 md:h-80">
                                <Image
                                    src={grinder.imageUrl}
                                    alt={grinder.name_ko || grinder.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    )}

                    {/* 그라인더 정보 */}
                    <div className={`p-4 md:p-6 ${grinder.imageUrl ? 'col-span-1 lg:col-span-2' : 'col-span-1 lg:col-span-3'}`}>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
                            <Coffee className="mr-2" />
                            {grinder.name_ko || grinder.name}
                            {grinder.name_ko && grinder.name_ko !== grinder.name && (
                                <span className="text-muted-foreground text-sm ml-2">({grinder.name})</span>
                            )}
                        </h1>

                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xl text-primary font-medium">{grinder.brand}</p>

                            {isOwner && (
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/grinders/${grinder.id}/edit`}
                                        className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                                    >
                                        <Pencil size={16} />
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteGrinder(grinder.id);
                                    }}>
                                        <DeleteGrinderButton grinderId={grinder.id} />
                                    </form>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-semibold mb-1">브랜드</h3>
                                <p>{grinder.brand}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">타입</h3>
                                <p>{grinderTypeNames[grinder.type as keyof typeof grinderTypeNames]}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">버</h3>
                                <p>{grinder.burr || '정보 없음'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">버 크기</h3>
                                <p>{grinder.burrSize || '정보 없음'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold mb-1">조절 방식</h3>
                                <p>{adjustmentTypeNames[grinder.adjustmentType as keyof typeof adjustmentTypeNames]}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-semibold mb-1">설명</h3>
                            <p className="text-muted-foreground">{grinder.description_ko || grinder.description}</p>
                        </div>
                    </div>
                </div>

                {/* 그라인더 설정 목록 */}
                <div className="p-4 md:p-6 border-t">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Settings className="mr-2" size={20} />
                        분쇄도 설정 가이드
                    </h2>

                    {grinder.settings.length === 0 ? (
                        <p className="text-muted-foreground">등록된 설정 정보가 없습니다.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-secondary/50">
                                        <th className="p-3 text-left whitespace-nowrap">추출 방식</th>
                                        <th className="p-3 text-left whitespace-nowrap">설정 이름</th>
                                        <th className="p-3 text-left whitespace-nowrap">설정 값</th>
                                        <th className="p-3 text-left whitespace-nowrap">설명</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grinder.settings
                                        .sort((a, b) => a.brewingMethod.localeCompare(b.brewingMethod))
                                        .map((setting) => (
                                            <tr key={setting.id} className="border-b border-secondary/20 hover:bg-secondary/10">
                                                <td className="p-3 whitespace-nowrap">{setting.brewingMethod}</td>
                                                <td className="p-3 whitespace-nowrap">{setting.name_ko || setting.name}</td>
                                                <td className="p-3 whitespace-nowrap font-medium">{setting.value}</td>
                                                <td className="p-3">{setting.description_ko || setting.description}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 이 그라인더를 사용하는 레시피 */}
                {grinder.recipes && grinder.recipes.length > 0 && (
                    <div className="p-4 md:p-6 border-t">
                        <h2 className="text-xl font-semibold mb-4">이 그라인더를 사용한 레시피</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {grinder.recipes.map((recipe) => (
                                <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
                                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <h3 className="font-medium">{recipe.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                            {recipe.description}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-muted-foreground">
                                                {recipe.brewingMethod}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {recipe.user?.name || '익명'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {grinder.recipes.length >= 5 && (
                            <div className="mt-4 text-center">
                                <Link href={`/recipes?grinder=${grinder.id}`} className="text-primary hover:underline">
                                    더 많은 레시피 보기
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
} 