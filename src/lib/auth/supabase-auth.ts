import { supabase } from '../supabase';
import type { User, Session, Provider } from '@supabase/supabase-js';

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 현재 세션 정보 가져오기
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// 이메일/비밀번호로 회원가입
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// 이메일/비밀번호로 로그인
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// OAuth 공급자로 로그인
export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 인증 상태 변경 리스너 설정
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}

// 비밀번호 재설정 이메일 전송
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  
  if (error) throw error;
}

// 비밀번호 변경
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
}

// 사용자 프로필 업데이트
export async function updateUserProfile(profile: { name?: string, avatar_url?: string }) {
  const { error } = await supabase.auth.updateUser({
    data: profile,
  });
  
  if (error) throw error;
}

// 세션 상태 확인하는 유틸리티 함수
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return session !== null;
}

// 사용자 ID 가져오기
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
} 