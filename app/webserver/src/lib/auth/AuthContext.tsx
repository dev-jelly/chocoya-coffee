'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { onAuthStateChange, getCurrentUser, getCurrentSession } from './supabase-auth';
import { supabase } from '../supabase';

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
        
        // 세션 확인 및 사용자 정보 가져오기 (간소화된 방식)
        const { data, error: userError } = await supabase.auth.getUser();
        
        if (!userError && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setUser(null);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    // 인증 상태 변경 구독
    const { data: authListener } = onAuthStateChange((userFromEvent) => {
      // 상태 변경 이벤트 발생 시 UI 업데이트
      setUser(userFromEvent);
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