import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GrinderForm } from '@/components/admin/grinder-form';
import { getGrinderById } from '@/lib/actions/grinder';

export const metadata = {
    title: '그라인더 수정 | 초코야 커피',
    description: '그라인더 정보를 수정합니다',
};

type Props = {
    params: {
        id: string;
    };
}

export default async function EditGrinderPage({ params }: Props) {
    const grinder = await getGrinderById(params.id);

    if (!grinder) {
        notFound();
    }

    return (
        <div className="container py-10">
            <div className="mb-6">
                <Link
                    href="/admin/grinders"
                    className="text-sm text-muted-foreground hover:text-foreground mb-2 flex items-center"
                >
                    <ArrowLeft size={16} className="mr-1" /> 그라인더 목록으로 돌아가기
                </Link>
                <h1 className="text-3xl font-bold">그라인더 수정</h1>
                <p className="text-muted-foreground">{grinder.name_ko || grinder.name}</p>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <GrinderForm grinder={grinder} />
            </div>
        </div>
    );
} 