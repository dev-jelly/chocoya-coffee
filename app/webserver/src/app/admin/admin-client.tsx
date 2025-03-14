'use client';

import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { useAuth } from '@/lib/auth/AuthContext';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminClient() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading) {
      // 관리자 이메일 체크
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chocoya.coffee';
      
      if (!user || user.email !== adminEmail) {
        redirect('/');
      } else {
        setIsAdmin(true);
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="container py-10">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // 리다이렉트 처리 중
  }

  return <AdminDashboard />;
} 