'use client';

import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';

interface LikeButtonProps {
    recipeId: string;
    initialLikes: number;
    userId?: string;
}

export function LikeButton({ recipeId, initialLikes, userId }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 컴포넌트 마운트 시 좋아요 상태 확인
    useEffect(() => {
        if (userId) {
            checkLikeStatus();
        }
        // 좋아요 수 가져오기
        fetchLikeCount();
    }, [userId, recipeId]);

    const checkLikeStatus = async () => {
        try {
            const response = await fetch(`/api/recipes/${recipeId}/like/check`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);
            }
        } catch (error) {
            console.error('좋아요 상태 확인 중 오류 발생:', error);
        }
    };

    // 좋아요 수 가져오기
    const fetchLikeCount = async () => {
        try {
            const response = await fetch(`/api/recipes/${recipeId}/likes/count`);
            if (response.ok) {
                const data = await response.json();
                setLikes(data.count);
            }
        } catch (error) {
            console.error('좋아요 수 조회 중 오류 발생:', error);
        }
    };

    const handleLikeToggle = async () => {
        if (!userId) {
            toast.error('좋아요를 누르려면 로그인이 필요합니다');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/recipes/${recipeId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsLiked(data.isLiked);

                // 좋아요 상태에 따라 좋아요 수 직접 업데이트
                if (data.isLiked) {
                    setLikes(prev => prev + 1);
                    toast.success('좋아요를 눌렀습니다');
                } else {
                    setLikes(prev => Math.max(0, prev - 1));
                    toast.success('좋아요를 취소했습니다');
                }
            } else {
                toast.error('처리 중 오류가 발생했습니다');
            }
        } catch (error) {
            console.error('좋아요 처리 중 오류 발생:', error);
            toast.error('요청 처리 중 오류가 발생했습니다');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={`inline-flex items-center text-sm ${isLiked
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
                } transition-colors cursor-pointer ${isLoading ? 'opacity-70' : ''}`}
            onClick={handleLikeToggle}
            disabled={isLoading}
        >
            <ThumbsUp
                size={16}
                className={`mr-1 ${isLiked ? 'fill-primary' : ''}`}
            />
            좋아요 {likes}
        </button>
    );
} 