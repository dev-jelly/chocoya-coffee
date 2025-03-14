import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CatCoffeeLogo } from "@/components/ui/cat-coffee-logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <div className="flex flex-col items-center justify-center mb-6 relative">
          <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl z-0"></div>
          <CatCoffeeLogo size={180} className="text-primary mb-4 relative z-10" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          초코야 커피
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          나만의 커피 레시피를 기록하고 공유하는 플랫폼
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/recipes">
              레시피 둘러보기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">
              시작하기
            </Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">레시피 공유</h2>
            <p>나만의 커피 레시피를 기록하고 다른 사람들과 공유해보세요.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">맛 기록</h2>
            <p>SCA 기준으로 커피의 맛을 평가하고 기록할 수 있습니다.</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">브루잉 가이드</h2>
            <p>정확한 시간과 물 양으로 완벽한 커피를 추출해보세요.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
