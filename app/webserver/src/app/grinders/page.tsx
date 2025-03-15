import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Coffee, Search, Filter } from 'lucide-react';
import { getGrinders } from '@/lib/actions/grinder';
import { grinderTypeNames, adjustmentTypeNames } from '@/data/grinders';

export const metadata = {
    title: '그라인더 라이브러리 | 초코야 커피',
    description: '다양한 그라인더 정보를 찾아보고 분쇄도 설정을 확인하세요',
};

export default async function GrindersPage(props: any) {
    // 검색어 가져오기
    const searchParams = props.searchParams || {};
    const search = searchParams.search || '';

    // 그라인더 목록 가져오기
    const grinders = await getGrinders(search);

    return (
        <div className="container px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                    <Coffee className="mr-2" />
                    그라인더 라이브러리
                </h1>
            </div>

            {/* 검색바 */}
            <div className="mb-6">
                <form action="/grinders" method="GET" className="flex gap-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            defaultValue={search}
                            placeholder="그라인더 이름, 브랜드, 종류 등으로 검색"
                            className="w-full p-3 pl-10 rounded-md border border-input bg-background"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                    >
                        검색
                    </button>
                </form>
            </div>

            {/* 그라인더 타입별 필터 */}
            <div className="mb-6 flex flex-wrap gap-2">
                <Link
                    href="/grinders"
                    className={`px-3 py-1 rounded-full text-sm ${!searchParams?.type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                >
                    전체
                </Link>
                {Object.entries(grinderTypeNames).map(([type, name]) => (
                    <Link
                        key={type}
                        href={`/grinders?type=${type}`}
                        className={`px-3 py-1 rounded-full text-sm ${searchParams?.type === type ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
                    >
                        {name}
                    </Link>
                ))}
            </div>

            {/* 그라인더 목록 */}
            {grinders.length === 0 ? (
                <div className="bg-card border rounded-lg p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">등록된 그라인더가 없습니다</h2>
                    <p className="text-muted-foreground mb-4">
                        {search ? `'${search}' 검색 결과가 없습니다.` : '아직 등록된 그라인더 정보가 없습니다.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grinders.map((grinder) => (
                        <Link
                            href={`/grinders/${grinder.id}`}
                            key={grinder.id}
                            className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                            {grinder.imageUrl && (
                                <div className="relative w-full h-48">
                                    <Image
                                        src={grinder.imageUrl}
                                        alt={grinder.name_ko || grinder.name}
                                        fill
                                        className="object-contain p-6"
                                    />
                                </div>
                            )}

                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-1">{grinder.name_ko || grinder.name}</h2>
                                <p className="text-primary mb-2">{grinder.brand}</p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-xs bg-secondary/30 px-2 py-1 rounded-full">
                                        {grinderTypeNames[grinder.type as keyof typeof grinderTypeNames]}
                                    </span>
                                    <span className="text-xs bg-secondary/30 px-2 py-1 rounded-full">
                                        {adjustmentTypeNames[grinder.adjustmentType as keyof typeof adjustmentTypeNames]} 방식
                                    </span>
                                    {grinder.burr && (
                                        <span className="text-xs bg-secondary/30 px-2 py-1 rounded-full">
                                            {grinder.burr}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {grinder.description_ko || grinder.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 