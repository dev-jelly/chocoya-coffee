'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteTasteNoteButtonProps {
    tasteNoteId: string;
}

export function DeleteTasteNoteButton({ tasteNoteId }: DeleteTasteNoteButtonProps) {
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm('정말로 이 맛 노트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            e.preventDefault();
        }
    };

    return (
        <button
            type="submit"
            className="p-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            onClick={handleClick}
            title="맛 노트 삭제"
        >
            <Trash2 size={16} />
        </button>
    );
} 