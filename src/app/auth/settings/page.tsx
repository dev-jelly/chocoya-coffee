import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Bell, Trash, Eye, EyeOff } from 'lucide-react';

export const metadata = {
  title: '계정 설정 | 초코야 커피',
  description: '계정 설정 및 관리 페이지',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <Link href="/auth/profile" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        프로필로 돌아가기
      </Link>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">계정 설정</h1>
        
        <div className="space-y-6">
          {/* 비밀번호 변경 섹션 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Lock className="mr-2 text-primary" size={20} />
              <h2 className="text-xl font-semibold">비밀번호 변경</h2>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="currentPassword"
                    className="w-full p-3 rounded-md border border-input bg-background pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  새 비밀번호
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full p-3 rounded-md border border-input bg-background pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    <EyeOff size={18} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.
                </p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  새 비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-3 rounded-md border border-input bg-background pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >
                    <EyeOff size={18} />
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  비밀번호 변경
                </button>
              </div>
            </form>
          </div>
          
          {/* 알림 설정 섹션 */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Bell className="mr-2 text-primary" size={20} />
              <h2 className="text-xl font-semibold">알림 설정</h2>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span>이메일 알림</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>새 레시피 알림</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span>마케팅 알림</span>
                <input type="checkbox" />
              </label>
              <label className="flex items-center justify-between">
                <span>보안 알림</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                설정 저장
              </button>
            </div>
          </div>
          
          {/* 계정 삭제 섹션 */}
          <div className="bg-destructive/5 p-6 rounded-lg border border-destructive/30">
            <div className="flex items-center mb-4">
              <Trash className="mr-2 text-destructive" size={20} />
              <h2 className="text-xl font-semibold text-destructive">계정 삭제</h2>
            </div>
            
            <p className="text-sm mb-4">
              계정을 삭제하면 모든 개인정보와 레시피, 활동 내역이 영구적으로 삭제됩니다. 이 작업은 취소할 수 없습니다.
            </p>
            
            <button
              type="button"
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
            >
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 