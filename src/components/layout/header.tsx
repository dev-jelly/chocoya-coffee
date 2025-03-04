import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function Header() {
  const session = await getServerSession(authOptions);
  
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            초코야 커피
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/recipes" className="text-sm font-medium transition-colors hover:text-primary">
              레시피
            </Link>
            <Link href="/recipes/create" className="text-sm font-medium transition-colors hover:text-primary">
              레시피 등록
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <div className="flex gap-2">
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