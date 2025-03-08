import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import {
  User, Edit, Bookmark, Coffee, FileText,
  ChevronRight, Settings
} from 'lucide-react';

export const metadata = {
  title: '내 프로필 | 초코야 커피',
  description: '내 계정 정보와 활동 내역',
};

export default async function ProfilePage() {
  // 로그인 확인
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  // 사용자 정보 가져오기
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      recipes: {
        where: {
          userId: session.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      },
      favorites: {
        include: {
          recipe: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      },
      tasteNotes: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 3,
      },
    },
  });

  if (!user) {
    return <div className="container py-8">사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col gap-8">
        {/* 프로필 정보 */}
        <div className="w-full">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex flex-col items-center mb-6">
              {user.image ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src={user.image}
                    alt={user.name || '프로필 이미지'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <User size={32} />
                </div>
              )}
              <h1 className="text-2xl font-bold">{user.name || '사용자'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Link
                href="/profile/edit"
                className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition"
              >
                <div className="flex items-center">
                  <Edit size={18} className="mr-2" />
                  <span>프로필 수정</span>
                </div>
                <ChevronRight size={16} className="ml-2" />
              </Link>

              <Link
                href="/profile/favorites"
                className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition"
              >
                <div className="flex items-center">
                  <Bookmark size={18} className="mr-2" />
                  <span>즐겨찾기</span>
                </div>
                <ChevronRight size={16} className="ml-2" />
              </Link>

              <Link
                href="/profile/settings"
                className="flex items-center justify-between p-3 hover:bg-muted rounded-md transition"
              >
                <div className="flex items-center">
                  <Settings size={18} className="mr-2" />
                  <span>계정 설정</span>
                </div>
                <ChevronRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* 활동 내역 */}
        <div className="w-full">
          {/* 내 레시피 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">내 레시피</h2>
              <Link href="/recipes/create" className="text-sm text-primary hover:underline">
                새 레시피 작성
              </Link>
            </div>

            {user.recipes.length === 0 ? (
              <div className="bg-card border rounded-lg p-4 text-center">
                <p className="text-muted-foreground">아직 작성한 레시피가 없습니다.</p>
                <Link
                  href="/recipes/create"
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  첫 번째 레시피 작성하기
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {user.recipes.map((recipe: any) => (
                  <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
                    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start">
                        <Coffee className="mr-3 mt-1" />
                        <div>
                          <h3 className="font-medium">{recipe.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {recipe.description || '설명 없음'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {user.recipes.length > 3 && (
                  <Link
                    href="/profile/recipes"
                    className="text-center text-primary hover:underline py-2"
                  >
                    모든 레시피 보기
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* 내 맛 노트 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">내 맛 노트</h2>
              <Link href="/taste-notes/create" className="text-sm text-primary hover:underline">
                새 맛 노트 작성
              </Link>
            </div>

            {user.tasteNotes.length === 0 ? (
              <div className="bg-card border rounded-lg p-4 text-center">
                <p className="text-muted-foreground">아직 작성한 맛 노트가 없습니다.</p>
                <Link
                  href="/taste-notes/create"
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  첫 번째 맛 노트 작성하기
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {user.tasteNotes.map((note: any) => (
                  <Link key={note.id} href={`/taste-notes/${note.id}`} passHref>
                    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start">
                        <FileText className="mr-3 mt-1" />
                        <div>
                          <h3 className="font-medium">{note.coffeeName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {note.origin ? `${note.origin}, ` : ''}
                            {note.roaster || '로스터리 정보 없음'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {user.tasteNotes.length > 3 && (
                  <Link
                    href="/profile/taste-notes"
                    className="text-center text-primary hover:underline py-2"
                  >
                    모든 맛 노트 보기
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* 즐겨찾기 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">즐겨찾기</h2>
              <Link href="/profile/favorites" className="text-sm text-primary hover:underline">
                모든 즐겨찾기 보기
              </Link>
            </div>

            {user.favorites.length === 0 ? (
              <div className="bg-card border rounded-lg p-4 text-center">
                <p className="text-muted-foreground">아직 즐겨찾기한 레시피가 없습니다.</p>
                <Link
                  href="/recipes"
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  레시피 둘러보기
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {user.favorites.map((favorite: any) => (
                  <Link key={favorite.recipeId} href={`/recipes/${favorite.recipeId}`} passHref>
                    <div className="bg-card border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start">
                        <Coffee className="mr-3 mt-1" />
                        <div>
                          <h3 className="font-medium">{favorite.recipe?.title || '삭제된 레시피'}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {favorite.recipe?.description || '설명 없음'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 