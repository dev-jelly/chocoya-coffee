import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MainLayout } from '@/components/layout/main-layout'
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '초코야 커피',
  description: '커피 브루잉 레시피와 맛 노트를 공유하는 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  )
}
