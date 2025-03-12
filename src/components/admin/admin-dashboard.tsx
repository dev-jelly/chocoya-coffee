'use client';

import Link from 'next/link';
import { CoffeeIcon, Settings, PackageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminDashboard() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">관리자 대시보드</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/grinders">
          <Card className="h-full cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                그라인더 관리
              </CardTitle>
              <CardDescription>
                그라인더 및 분쇄도 설정 관리
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                그라인더 추가, 수정, 삭제 및 관련 분쇄도 설정을 관리합니다.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/beans">
          <Card className="h-full cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CoffeeIcon className="mr-2 h-5 w-5" />
                원두 관리
              </CardTitle>
              <CardDescription>
                원두 정보 및 로스팅 관리
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                원두 정보, 로스팅 프로필, 원산지 등 원두 관련 정보를 관리합니다.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/products">
          <Card className="h-full cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PackageIcon className="mr-2 h-5 w-5" />
                제품 관리
              </CardTitle>
              <CardDescription>
                장비 및 제품 카탈로그 관리
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                커피 장비, 소모품 등의 제품 정보를 관리합니다.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 