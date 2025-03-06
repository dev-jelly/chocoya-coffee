'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  recipeId: string;
  initialIsFavorite: boolean;
  userId?: string;
}

export function FavoriteButton({ recipeId, initialIsFavorite, userId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleFavorite = async () => {
    if (!userId) {
      toast.error('즐겨찾기를 추가하려면 로그인이 필요합니다.');
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeId }),
      });

      if (!response.ok) {
        throw new Error('즐겨찾기 처리 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      setIsFavorite(data.isFavorite);
      
      toast.success(
        data.isFavorite 
          ? '즐겨찾기에 추가되었습니다.' 
          : '즐겨찾기에서 제거되었습니다.'
      );
      
      router.refresh();
    } catch (error) {
      toast.error('즐겨찾기 처리 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`flex items-center gap-1 ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}
    >
      <Bookmark size={16} className={isFavorite ? 'fill-yellow-500' : ''} />
      {isFavorite ? '즐겨찾기 추가됨' : '즐겨찾기'}
    </Button>
  );
} 