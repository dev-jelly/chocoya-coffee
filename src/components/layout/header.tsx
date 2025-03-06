import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Coffee, BookOpen, Droplet, FileText, Home } from "lucide-react";
import { MobileNavClient } from "./mobile-nav-client";

export async function Header() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;
  
  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-6">
          <MobileNavClient isLoggedIn={isLoggedIn} />
          
          <Link href="/" className="text-xl font-bold flex items-center">
            <Coffee className="mr-2" size={24} />
            <span>초코야 커피</span>
          </Link>
          <nav className="hidden md:flex gap-4 md:gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Home size={16} />
              <span>홈</span>
            </Link>
            <Link 
              href="/recipes" 
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <FileText size={16} />
              <span>레시피</span>
            </Link>
            <Link 
              href="/brewing-guide" 
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <Droplet size={16} />
              <span>브루잉 가이드</span>
            </Link>
            <Link 
              href="/taste-notes/create" 
              className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
            >
              <BookOpen size={16} />
              <span>맛 노트</span>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {session ? (
            <div className="flex gap-2 md:gap-4 items-center">
              <Button asChild variant="outline" size="sm" className="hidden md:flex">
                <Link href="/recipes/create">
                  <Coffee className="mr-2" size={16} />
                  레시피 등록
                </Link>
              </Button>
              <UserNav user={session.user} />
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">회원가입</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 