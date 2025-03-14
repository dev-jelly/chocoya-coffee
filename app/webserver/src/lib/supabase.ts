import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 익명 키가 설정되지 않았습니다.');
}

// 클라이언트 사이드에서 사용할 Supabase 클라이언트
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// 서비스 롤 키를 사용한 관리자 클라이언트 (서버 사이드에서만 사용)
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseServiceKey) {
    throw new Error('Supabase 서비스 롤 키가 설정되지 않았습니다.');
  }
  
  return createBrowserClient(supabaseUrl, supabaseServiceKey);
}; 