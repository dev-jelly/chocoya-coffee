import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Settings, Coffee, Heart, History, Mail, Edit } from 'lucide-react';

export const metadata = {
  title: '내 프로필 | 초코야 커피',
  description: '나의 프로필 관리 페이지',
};

export default function ProfilePage() {
  // 실제 구현에서는 서버 컴포넌트에서 사용자 정보를 가져오거나, 
  // 클라이언트 컴포넌트에서 세션/상태 관리를 통해 사용자 정보를 가져와야 합니다.
  const mockUser = {
    name: '김초코',
    email: 'choco@example.com',
    memberSince: '2023년 12월',
    favoriteRecipes: 5,
    createdRecipes: 2,
  };

  return (
    <div className="container mx-auto py-10">
      <Link href="/" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        홈으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 프로필 카드 */}
        <div className="bg-card p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <User size={48} />
          </div>
          
          <h1 className="text-2xl font-bold mb-1">{mockUser.name}</h1>
          <div className="flex items-center text-muted-foreground mb-4">
            <Mail size={14} className="mr-1" />
            <span>{mockUser.email}</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            가입일: {mockUser.memberSince}
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
                <p className="text-2xl font-bold">{mockUser.favoriteRecipes}</p>
                <p className="text-sm text-muted-foreground">좋아요한 레시피</p>
              </div>
              
              <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                <Coffee size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold">{mockUser.createdRecipes}</p>
                <p className="text-sm text-muted-foreground">작성한 레시피</p>
              </div>
              
              <div className="bg-muted p-4 rounded-md flex flex-col items-center">
                <History size={24} className="text-primary mb-2" />
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">최근 활동</p>
              </div>
            </div>
          </div>

          {/* 최근 좋아요한 레시피 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">최근 좋아요한 레시피</h2>
            
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Link 
                  key={i} 
                  href={`/recipes/${i + 1}`}
                  className="block p-3 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Coffee size={18} className="mr-2 text-primary" />
                      <span className="font-medium">
                        {['카페라떼', '아메리카노', '카푸치노'][i]}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {['3일 전', '1주일 전', '2주일 전'][i]}
                    </span>
                  </div>
                </Link>
              ))}
              
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