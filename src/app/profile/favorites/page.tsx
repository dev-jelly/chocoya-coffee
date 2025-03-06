import React from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ArrowLeft, Coffee, Clock, Droplet, Scale } from 'lucide-react';

export const metadata = {
  title: '내 즐겨찾기 | 초코야 커피',
  description: '즐겨찾기한 레시피 목록',
};

export default async function FavoritesPage() {
  // 로그인 확인
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/profile/favorites');
  }
  
  // 즐겨찾기한 레시피 가져오기
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      recipe: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">내 즐겨찾기</h1>
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" /> 프로필로 돌아가기
        </Link>
      </div>
      
      {favorites.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">즐겨찾기한 레시피가 없습니다</h2>
          <p className="text-muted-foreground mb-4">
            마음에 드는 레시피를 즐겨찾기에 추가해보세요!
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            레시피 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {favorites.map((favorite: any) => (
            <Link key={favorite.recipeId} href={`/recipes/${favorite.recipeId}`} passHref>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-card">
                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <Coffee className="mr-2 h-5 w-5" />
                    {favorite.recipe.title}
                  </h2>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {favorite.recipe.description || '설명 없음'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center">
                      <Clock size={12} className="mr-1" /> 
                      {favorite.recipe.preparationTime || '시간 정보 없음'}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center">
                      <Scale size={12} className="mr-1" /> 
                      {favorite.recipe.beanAmount || '원두량 정보 없음'}
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center">
                      <Droplet size={12} className="mr-1" /> 
                      {favorite.recipe.waterAmount || '물 정보 없음'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 