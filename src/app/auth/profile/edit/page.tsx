import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: '프로필 수정 | 초코야 커피',
  description: '프로필 정보 수정 페이지',
};

export default function EditProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <Link href="/auth/profile" className="text-primary hover:underline flex items-center mb-6">
        <ArrowLeft className="mr-2" size={16} />
        프로필로 돌아가기
      </Link>
      
      <div className="bg-card p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">프로필 수정</h1>
        
        <form>
          <div className="space-y-6">
            {/* 프로필 사진 업로드 */}
            <div>
              <label className="block text-sm font-medium mb-2">프로필 사진</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  {/* Avatar placeholder - 실제로는 이미지 표시 */}
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
                  >
                    사진 업로드
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG 파일. 최대 크기 2MB.
                  </p>
                </div>
              </div>
            </div>
            
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue="김초코"
                className="w-full p-3 rounded-md border border-input bg-background"
              />
            </div>
            
            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue="choco@example.com"
                className="w-full p-3 rounded-md border border-input bg-background"
              />
            </div>
            
            {/* 자기소개 */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">자기소개</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue="커피를 좋아하는 프로그래머입니다."
                className="w-full p-3 rounded-md border border-input bg-background resize-none"
              />
            </div>
            
            {/* 알림 설정 */}
            <div>
              <h3 className="text-sm font-medium mb-2">알림 설정</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>새로운 레시피 알림</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span>댓글 알림</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>프로모션 이메일</span>
                </label>
              </div>
            </div>
            
            {/* 버튼 그룹 */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/auth/profile"
                className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                저장하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 