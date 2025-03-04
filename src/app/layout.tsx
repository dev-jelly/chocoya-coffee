import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "초코야 커피 - 커피 레시피 공유 플랫폼",
  description: "나만의 커피 레시피를 기록하고 공유하는 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
