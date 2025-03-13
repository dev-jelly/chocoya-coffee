import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { prisma, checkDatabaseConnection } from '@/lib/db';
import {
  User, Edit, Bookmark, Coffee, FileText,
  ChevronRight, Settings, AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase-server';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: '내 프로필 | 초코야 커피',
  description: '내 계정 정보와 활동 내역',
};

export default async function ProfilePage() {
  // Supabase 클라이언트 생성 및 사용자 정보 가져오기
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    redirect('/auth/login?callbackUrl=/profile');
  }

  // 데이터베이스 연결 확인
  const dbConnection = await checkDatabaseConnection();
  let userData = null;
  let dbError = null;

  if (dbConnection.connected) {
    try {
      // 사용자 정보 가져오기
      userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        include: {
          recipes: {
            where: {
              userId: user.id,
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
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error);
      dbError = '사용자 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  } else {
    dbError = '데이터베이스 연결에 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.';
    console.error('데이터베이스 연결 오류:', dbConnection.error);
  }

  // 데이터베이스 연결 오류가 있거나 사용자 정보가 없는 경우 기본 정보 사용
  if (!userData) {
    userData = {
      id: user.id,
      name: user.user_metadata?.name || '사용자',
      email: user.email,
      image: user.user_metadata?.avatar_url,
      recipes: [],
      favorites: [],
      tasteNotes: []
    };
  }

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col gap-8">
        {/* 데이터베이스 연결 오류 메시지 */}
        {dbError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
            <AlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
            <div className="flex-1">
              <p className="text-red-700 font-medium">데이터베이스 연결 오류</p>
              <p className="text-red-600 text-sm mt-1">{dbError}</p>
              <div className="mt-3">
                <Link
                  href="/profile"
                  className="inline-flex items-center text-sm text-red-700 hover:text-red-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  새로고침
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 프로필 정보 */}
        <div className="w-full">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex flex-col items-center mb-6">
              {userData.image ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                  <Image
                    src={userData.image}
                    alt={userData.name || '프로필 이미지'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <User size={32} />
                </div>
              )}
              <h1 className="text-2xl font-bold">{userData.name || '사용자'}</h1>
              <p className="text-muted-foreground">{userData.email}</p>
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

            {userData.recipes.length === 0 ? (
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
                {userData.recipes.map((recipe: any) => (
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

                {userData.recipes.length > 3 && (
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

            {userData.tasteNotes.length === 0 ? (
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
                {userData.tasteNotes.map((note: any) => (
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

                {userData.tasteNotes.length > 3 && (
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

            {userData.favorites.length === 0 ? (
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
                {userData.favorites.map((favorite: any) => (
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