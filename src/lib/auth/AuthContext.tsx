'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange, getCurrentUser } from './supabase-auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 초기 사용자 상태 확인
    async function loadUser() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    }

    // 인증 상태 변경 구독
    const { data: authListener } = onAuthStateChange(async (userFromEvent) => {
      // 상태 변경 이벤트 발생 시 UI 업데이트를 위해 일단 값 설정
      setUser(userFromEvent);
      
      if (userFromEvent) {
        // 중요: 추가 확인을 위해 권장되는 방식으로 사용자 정보 재확인
        try {
          const confirmedUser = await getCurrentUser();
          // 인증된 사용자 정보로 업데이트
          setUser(confirmedUser);
        } catch (err) {
          console.error('사용자 인증 확인 오류:', err);
          setUser(null);
          setError(err instanceof Error ? err : new Error('인증 확인 오류'));
        }
      }
      
      setLoading(false);
    });

    loadUser();

    // cleanup
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 