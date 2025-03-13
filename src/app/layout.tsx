import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MainLayout } from '@/components/layout/main-layout'
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import AuthSessionProvider from '@/providers/session-provider'

const inter = Inter({ subsets: ['latin'] })

// 동적 렌더링 설정 (항상 서버에서 렌더링)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: '초코야 커피',
  description: '커피 브루잉 레시피와 맛 노트를 공유하는 플랫폼',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background")}>
        <AuthSessionProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  )
}
