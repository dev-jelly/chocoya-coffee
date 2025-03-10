import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 소셜 로그인 콜백을 처리
    await supabase.auth.exchangeCodeForSession(code);
    
    // 성공적으로 로그인되면 홈페이지로 리디렉션
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }
  
  // 오류가 있다면 로그인 페이지로 리디렉션
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin));
} 