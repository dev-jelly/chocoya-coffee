import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// 회원가입 스키마 정의
const registerSchema = z.object({
  name: z.string().min(2, {
    message: "이름은 2자 이상이어야 합니다.",
  }),
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(8, {
    message: "비밀번호는 8자 이상이어야 합니다.",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 입력 데이터 유효성 검사
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "유효하지 않은 입력입니다.",
          issues: result.error.flatten().fieldErrors
        }, 
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // 이미 등록된 이메일 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log(`회원가입 충돌: 이메일 '${email}'은 이미 사용 중입니다.`);
      return NextResponse.json(
        { success: false, error: "이미 등록된 이메일입니다." },
        { status: 409 }
      );
    }
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // 민감한 정보 제외
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true, 
      message: "회원가입이 완료되었습니다.",
      user: userWithoutPassword
    });
    
  } catch (error: any) {
    console.error('회원가입 오류:', error.message || error);
    return NextResponse.json(
      { 
        success: false, 
        error: "회원가입 처리 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 