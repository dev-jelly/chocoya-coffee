"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Coffee, BookOpen, Droplet, FileText, Home, User, LogIn } from "lucide-react";

interface MobileNavProps {
  isLoggedIn: boolean;
}

export function MobileNav({ isLoggedIn }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
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
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Home size={20} />
              <span>홈</span>
            </Link>
            <Link 
              href="/recipes" 
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <FileText size={20} />
              <span>레시피</span>
            </Link>
            <Link 
              href="/brewing-guide" 
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Droplet size={20} />
              <span>브루잉 가이드</span>
            </Link>
            <Link 
              href="/taste-notes/create" 
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <BookOpen size={20} />
              <span>맛 노트</span>
            </Link>
            <Link 
              href="/recipes/create" 
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
              onClick={() => setIsOpen(false)}
            >
              <Coffee size={20} />
              <span>레시피 등록</span>
            </Link>
          </nav>
          <div className="mt-auto">
            {isLoggedIn ? (
              <Link 
                href="/auth/profile" 
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} />
                <span>내 프로필</span>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  href="/auth/login" 
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={20} />
                  <span>로그인</span>
                </Link>
                <Button asChild className="w-full">
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