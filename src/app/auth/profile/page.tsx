import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Settings, Coffee, Heart, History, Mail, Edit } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getFavoriteRecipesByUser } from '@/lib/actions/favorite';
import { getRecipesByAuthor } from '@/lib/actions/recipe';
import { prisma } from '@/lib/db';

export const metadata = {
  title: '내 프로필 | 초코야 커피',
  description: '나의 프로필 관리 페이지',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // 사용자 상세 정보 가져오기 (createdAt 포함)
  const userDetails = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true }
  });

  // 사용자 관련 데이터 가져오기
  const [favoriteRecipes, createdRecipes] = await Promise.all([
    getFavoriteRecipesByUser(session.user.id),
    getRecipesByAuthor(session.user.id)
  ]);

  // 가입일 포맷팅 (실제 createdAt 필드 사용)
  const memberSince = userDetails?.createdAt
    ? new Date(userDetails.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
    : '정보 없음';

  return (
    <div className="container mx-auto py-10">
      <Link href="/" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        홈으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 프로필 카드 */}
        <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || '프로필 이미지'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} />
            )}
          </div>

          <h1 className="text-2xl font-bold mb-1">{session.user.name || '이름 없음'}</h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <Mail size={14} className="mr-1" />
            <span>{session.user.email}</span>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            가입일: {memberSince}
          </p>

          <div className="flex flex-col w-full gap-2 mt-2">
            <Link
              href="/auth/profile/edit"
              className="flex items-center justify-center p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Edit size={16} className="mr-2" />
              프로필 수정
            </Link>

            <Link
              href="/auth/settings"
              className="flex items-center justify-center p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              <Settings size={16} className="mr-2" />
              계정 설정
            </Link>
          </div>
        </div>

        {/* 통계 및 활동 */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">내 활동</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                <Heart size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold">{favoriteRecipes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">좋아요한 레시피</p>
              </div>

              <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                <Coffee size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold">{createdRecipes?.length || 0}</p>
                <p className="text-sm text-muted-foreground">작성한 레시피</p>
              </div>

              <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                <History size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold">{(favoriteRecipes?.length || 0) + (createdRecipes?.length || 0)}</p>
                <p className="text-sm text-muted-foreground">총 활동</p>
              </div>
            </div>
          </div>

          {/* 최근 좋아요한 레시피 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">최근 좋아요한 레시피</h2>

            <div className="space-y-2">
              {favoriteRecipes && favoriteRecipes.length > 0 ? (
                favoriteRecipes.slice(0, 3).map((recipe, i) => (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="block p-3 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Coffee size={18} className="mr-2 text-primary" />
                        <span className="font-medium">{recipe.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  아직 좋아요한 레시피가 없습니다.
                </p>
              )}

              <Link href="/recipes" className="text-primary hover:underline text-sm block text-center mt-4">
                더 많은 레시피 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 