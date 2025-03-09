import React from 'react';
import Link from 'next/link';
import { getGrinders, deleteGrinder } from '@/lib/actions/grinder';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { DeleteGrinderButton } from '@/components/grinder/delete-grinder-button';

export const metadata = {
    title: '그라인더 관리 | 초코야 커피',
    description: '그라인더 정보를 관리합니다',
};

export default async function AdminGrindersPage() {
    const grinders = await getGrinders();

    async function handleDelete(id: string) {
        'use server';
        await deleteGrinder(id);
        revalidatePath('/admin/grinders');
    }

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Link
                        href="/admin"
                        className="text-sm text-muted-foreground hover:text-foreground mb-2 flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-1" /> 관리자 페이지로 돌아가기
                    </Link>
                    <h1 className="text-3xl font-bold">그라인더 관리</h1>
                </div>
                <Link
                    href="/admin/grinders/create"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center"
                >
                    <Plus size={16} className="mr-1" /> 새 그라인더 추가
                </Link>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="px-4 py-3 text-left">이름</th>
                                <th className="px-4 py-3 text-left">브랜드</th>
                                <th className="px-4 py-3 text-left">타입</th>
                                <th className="px-4 py-3 text-left">조절 방식</th>
                                <th className="px-4 py-3 text-left">설정 수</th>
                                <th className="px-4 py-3 text-center">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grinders.map((grinder) => (
                                <tr key={grinder.id} className="border-t border-border hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <div>
                                            <div>{grinder.name_ko || grinder.name}</div>
                                            {grinder.name_ko && grinder.name_ko !== grinder.name && (
                                                <div className="text-xs text-muted-foreground">{grinder.name}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{grinder.brand}</td>
                                    <td className="px-4 py-3">{grinder.type}</td>
                                    <td className="px-4 py-3">{grinder.adjustmentType}</td>
                                    <td className="px-4 py-3">{grinder.settings?.length || 0}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link
                                                href={`/admin/grinders/${grinder.id}/edit`}
                                                className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors inline-flex items-center justify-center"
                                            >
                                                <Edit size={16} />
                                            </Link>
                                            <DeleteGrinderButton
                                                grinderId={grinder.id}
                                                onDelete={handleDelete}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 