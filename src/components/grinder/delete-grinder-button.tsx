'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteGrinderButtonProps {
    grinderId: string;
    onDelete: (id: string) => Promise<void>;
}

export function DeleteGrinderButton({ grinderId, onDelete }: DeleteGrinderButtonProps) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm('정말로 이 그라인더를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        setDeleting(true);
        try {
            await onDelete(grinderId);
        } catch (error) {
            console.error('Error deleting grinder:', error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors inline-flex items-center justify-center"
        >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
    );
} 