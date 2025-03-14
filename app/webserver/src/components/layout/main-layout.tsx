import { Header } from "./header";
import { formatKoreanDate } from "@/lib/utils";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex justify-center flex-1">{children}</main>
      <footer className="border-t py-4 md:py-6">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center text-xs md:text-sm text-muted-foreground">
            &copy; {formatKoreanDate(new Date(), { showMonth: false, showDay: false })} 초코야 커피
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/dev-jelly/chocoya-coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://octol.ing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              aria-label="초코야 홈페이지"
            >
              <span className="text-xs md:text-sm">octol.ing</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}