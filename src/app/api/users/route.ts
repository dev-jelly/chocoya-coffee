import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { id, name, email } = await request.json();

    // Supabase 인증 확인 (보안 권장사항에 따라 getUser() 사용)
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    // 인증된 사용자만 허용 또는 요청된 ID가 현재 사용자와 일치하는지 확인
    if (!user || (user.id !== id)) {
      return NextResponse.json(
        { error: "인증되지 않은 요청입니다." },
        { status: 401 }
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