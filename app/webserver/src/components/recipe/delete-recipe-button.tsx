'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteRecipeButtonProps {
    recipeId: string;
}

export function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!confirm('정말로 이 레시피를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            e.preventDefault();
        }
    };

    return (
        <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors flex items-center"
            onClick={handleClick}
        >
            <Trash2 size={14} className="mr-1" /> 삭제하기
        </button>
    );
} 