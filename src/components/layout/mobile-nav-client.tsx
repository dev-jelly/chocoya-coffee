"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, X, Coffee, BookText, Droplet, FileText, Home, User, LogIn, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface MobileNavClientProps {
  isLoggedIn: boolean;
}

export function MobileNavClient({ isLoggedIn }: MobileNavClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // 관리자 이메일 체크 (환경 변수에서 가져오거나 기본값 사용)
  const isAdmin = user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chocoya.coffee');

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
        <SheetTitle className="sr-only">초코야 커피 메뉴</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href="/"
              className="text-xl font-bold flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <Coffee className="mr-2" size={24} />
              <span>초코야 커피</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X size={24} />
              <span className="sr-only">메뉴 닫기</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Home size={18} />
              <span>홈</span>
            </Link>
            <Link
              href="/recipes"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={18} />
              <span>레시피</span>
            </Link>
            <Link
              href="/beans"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Coffee size={18} />
              <span>원두 라이브러리</span>
            </Link>
            <Link
              href="/brewing-guide"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Droplet size={18} />
              <span>브루잉 가이드</span>
            </Link>
            <Link
              href="/taste-notes/create"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <BookText size={18} />
              <span>맛 노트</span>
            </Link>
            <Link
              href="/recipes/create"
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Coffee size={18} />
              <span>레시피 등록</span>
            </Link>
            {isLoggedIn && (
              <Link
                href="/beans/create"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                <Coffee size={18} />
                <span>원두 등록</span>
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} />
                <span>관리자 대시보드</span>
              </Link>
            )}
          </nav>
          <div className="border-t p-4">
            {isLoggedIn ? (
              <Link
                href="/auth/profile"
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                <span>내 프로필</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={18} />
                  <span>로그인</span>
                </Link>
                <Button asChild className="w-full mt-2">
                  <Link
                    href="/auth/register"
                    onClick={() => setIsOpen(false)}
                  >
                    회원가입
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 