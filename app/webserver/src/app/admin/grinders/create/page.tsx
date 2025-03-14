import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GrinderForm } from '@/components/admin/grinder-form';

export const metadata = {
    title: '새 그라인더 추가 | 초코야 커피',
    description: '새로운 그라인더 정보를 추가합니다',
};

export default function CreateGrinderPage() {
    return (
        <div className="container py-10">
            <div className="mb-6">
                <Link
                    href="/admin/grinders"
                    className="text-sm text-muted-foreground hover:text-foreground mb-2 flex items-center"
                >
                    <ArrowLeft size={16} className="mr-1" /> 그라인더 목록으로 돌아가기
                </Link>
                <h1 className="text-3xl font-bold">새 그라인더 추가</h1>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <GrinderForm />
            </div>
        </div>
    );
} 