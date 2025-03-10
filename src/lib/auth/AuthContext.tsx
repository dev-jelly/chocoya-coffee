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
    const { data: authListener } = onAuthStateChange((user) => {
      setUser(user);
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