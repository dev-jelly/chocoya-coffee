import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import { Coffee, BookOpen, Droplet, FileText, Home, Bean } from "lucide-react";
import { MobileNavClient } from "./mobile-nav-client";
import { CatCoffeeLogo } from "@/components/ui/cat-coffee-logo";
import { CreateBeanButtonClient } from "@/components/bean/create-bean-button-client";
import { createClient } from '@/lib/supabase-server';
import { prisma, withDatabase } from "@/lib/db";

export async function Header() {
  // 서버 컴포넌트에서 Supabase 클라이언트 생성 (Next.js 15 비동기 API 지원)
  const supabase = await createClient();

  // 인증된 사용자 정보 가져오기 (권장되는 방식)
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // 사용자 정보 가져오기
  let userProfile = null;
  if (user) {
    // 기본 사용자 정보 설정 (데이터베이스 연결 실패 시 사용)
    const defaultUserProfile = {
      id: user.id,
      name: user.user_metadata?.name || '사용자',
      email: user.email,
      image: user.user_metadata?.avatar_url
    };

    // 데이터베이스에서 사용자 정보 가져오기 (오류 처리 포함)
    userProfile = await withDatabase(
      async () => {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, name: true, email: true, image: true }
        });

        return dbUser || defaultUserProfile;
      },
      defaultUserProfile,
      (error) => {
        console.error('사용자 정보 조회 오류:', error);
      }
    );
  }

  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8 justify-between">
        <div className="flex items-center gap-4 md:gap-6">
          <MobileNavClient isLoggedIn={isLoggedIn} />

          <Link href="/" className="text-xl font-bold flex items-center cursor-pointer">
            <CatCoffeeLogo className="mr-2 text-primary" size={28} />
            <span>초코야 커피</span>
          </Link>
          <nav className="hidden md:flex gap-4 md:gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <Home size={16} />
              <span>홈</span>
            </Link>
            <Link
              href="/recipes"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <FileText size={16} />
              <span>레시피</span>
            </Link>
            <Link
              href="/beans"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <Bean size={16} />
              <span>원두 라이브러리</span>
            </Link>
            <Link
              href="/brewing-guide"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <Droplet size={16} />
              <span>브루잉 가이드</span>
            </Link>
            <Link
              href="/taste-notes/create"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 cursor-pointer"
            >
              <BookOpen size={16} />
              <span>맛 노트</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <div className="flex gap-2 md:gap-4 items-center">
              <Button asChild variant="outline" size="sm" className="hidden md:flex">
                <Link href="/recipes/create" className="flex items-center">
                  <Coffee className="mr-2" size={16} />
                  <span>레시피 등록</span>
                </Link>
              </Button>
              <div className="hidden md:block">
                <CreateBeanButtonClient variant="outline" size="sm" />
              </div>
              {userProfile && <UserNav user={userProfile} />}
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login" className="cursor-pointer">로그인</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register" className="cursor-pointer">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 