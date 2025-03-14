import { supabase } from '../supabase';
import type { User, Session, Provider } from '@supabase/supabase-js';

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('사용자 정보 가져오기 오류:', error);
    return null;
  }
  return user;
}

// 현재 세션 정보 가져오기 - 주의: 보안상 권장되지 않음
// 대신 getCurrentUser()를 사용하는 것이 권장됩니다
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('세션 정보 가져오기 오류:', error);
    return null;
  }
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
  
  if (error) {
    // 에러 코드별 세분화된 에러 메시지 리턴
    if (error.message.includes('Invalid login credentials')) {
      return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    } else if (error.message.includes('Email not confirmed')) {
      return { success: false, error: '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.' };
    } else if (error.message.includes('rate limit')) {
      return { success: false, error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.' };
    } else {
      return { success: false, error: '로그인 중 오류가 발생했습니다: ' + error.message };
    }
  }
  
  return { success: true, data };
}

// OAuth 공급자로 로그인
export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) {
    // OAuth 로그인 에러 메시지 세분화
    if (error.message.includes('popup blocked')) {
      return { success: false, error: '팝업이 차단되었습니다. 팝업 차단을 해제해주세요.' };
    } else if (error.message.includes('canceled')) {
      return { success: false, error: '로그인이 취소되었습니다.' };
    } else {
      return { success: false, error: `${provider} 로그인 중 오류가 발생했습니다: ` + error.message };
    }
  }
  
  return { success: true, data };
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// 인증 상태 변경 리스너 설정
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    // 클라이언트 측 상태 변경은 UI 업데이트에만 사용하고,
    // 중요한 인증 결정에는 getUser()를 다시 호출해야 합니다
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
  const user = await getCurrentUser();
  return user !== null;
}

// 사용자 ID 가져오기
export async function getUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
} 