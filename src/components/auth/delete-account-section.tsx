'use client';

import React, { useState } from 'react';
import { Trash, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOut } from 'next-auth/react';

interface DeleteAccountSectionProps {
    userId: string;
}

export default function DeleteAccountSection({ userId }: DeleteAccountSectionProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDeleteRequest = () => {
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setConfirmText('');
    };

    const handleDelete = async () => {
        if (confirmText !== '계정삭제') {
            toast.error('확인 텍스트가 일치하지 않습니다');
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success('계정이 성공적으로 삭제되었습니다');
                // 로그아웃 후 홈으로 리디렉션
                await signOut({ redirect: false });
                router.push('/');
            } else {
                const data = await response.json();
                toast.error(data.error || '계정 삭제 중 오류가 발생했습니다');
                setIsDeleting(false);
            }
        } catch (error) {
            console.error('계정 삭제 오류:', error);
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-destructive/5 p-6 rounded-lg border border-destructive/30">
            <div className="flex items-center mb-4">
                <Trash className="mr-2 text-destructive" size={20} />
                <h2 className="text-xl font-semibold text-destructive">계정 삭제</h2>
            </div>

            {!showConfirmation ? (
                <>
                    <p className="text-sm mb-4">
                        계정을 삭제하면 모든 개인정보와 레시피, 활동 내역이 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.
                    </p>

                    <button
                        type="button"
                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors cursor-pointer"
                        onClick={handleDeleteRequest}
                    >
                        계정 삭제
                    </button>
                </>
            ) : (
                <div className="space-y-4">
                    <div className="bg-destructive/10 p-4 rounded-md border border-destructive flex items-start">
                        <AlertCircle className="text-destructive mr-2 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="font-medium text-destructive">주의: 이 작업은 취소할 수 없습니다</p>
                            <p className="text-sm mt-1">
                                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
                            </p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-destructive">
                            확인을 위해 &quot;계정삭제&quot;를 입력하세요
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full p-3 rounded-md border border-destructive/30 bg-destructive/5"
                            placeholder="계정삭제"
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={handleDelete}
                            disabled={isDeleting || confirmText !== '계정삭제'}
                        >
                            {isDeleting ? '삭제 중...' : '계정 영구 삭제'}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors cursor-pointer"
                            onClick={handleCancel}
                            disabled={isDeleting}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 