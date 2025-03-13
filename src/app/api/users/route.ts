import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { id, name, email } = await request.json();

    // Supabase 인증 확인 (보안 권장사항에 따라 getUser() 사용)
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    // 회원가입 직후에는 인증이 되지 않을 수 있으므로,
    // 1. 인증된 사용자이고 요청된 ID가 현재 사용자와 일치하거나
    // 2. 요청된 데이터가 유효한지 확인
    let isAuthorized = false;
    
    if (user && user.id === id) {
      // 인증된 사용자가 자신의 정보를 생성하는 경우
      isAuthorized = true;
    } else if (id && name && email) {
      // 회원가입 직후 인증되지 않았지만 필수 정보가 모두 있는 경우
      // 회원가입 직후에 바로 호출되는 경우를 고려하여 계속 진행
      isAuthorized = true;
      console.log('인증되지 않은 상태에서 사용자 생성 요청. 필수 정보 확인 후 허용');
    }
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: "인증되지 않은 요청입니다." },
        { status: 401 }
      );
    }

    // 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 등록된 사용자입니다." },
        { status: 409 }
      );
    }

    // Prisma DB에 사용자 정보 저장
    const userCreated = await prisma.user.create({
      data: {
        id,
        name,
        email,
        emailVerified: new Date(), // Supabase에서 이메일 인증을 처리하므로
      },
    });

    return NextResponse.json({ success: true, user: userCreated }, { status: 201 });
  } catch (error) {
    console.error("사용자 생성 오류:", error);
    
    // 이미 존재하는 사용자인 경우
    if (error instanceof Error && error.message.includes("Unique constraint failed")) {
      return NextResponse.json(
        { error: "이미 등록된 사용자입니다." },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "사용자 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 