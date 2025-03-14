import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    // Supabase 클라이언트 생성 및 사용자 정보 가져오기
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }
    
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    
    if (!dbUser) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const { recipeId } = await request.json();
    
    if (!recipeId) {
      return NextResponse.json(
        { error: '레시피 ID가 필요합니다.' },
        { status: 400 }
      );
    }
    
    // 레시피가 존재하는지 확인
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    
    if (!recipe) {
      return NextResponse.json(
        { error: '레시피를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 이미 즐겨찾기에 추가했는지 확인
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        recipeId_userId: {
          recipeId,
          userId: dbUser.id,
        },
      },
    });
    
    let isFavorite;
    
    if (existingFavorite) {
      // 즐겨찾기 제거
      await prisma.favorite.delete({
        where: {
          recipeId_userId: {
            recipeId,
            userId: dbUser.id,
          },
        },
      });
      isFavorite = false;
    } else {
      // 즐겨찾기 추가
      await prisma.favorite.create({
        data: {
          recipeId,
          userId: dbUser.id,
        },
      });
      isFavorite = true;
    }
    
    return NextResponse.json({ success: true, isFavorite });
  } catch (error: any) {
    console.error('즐겨찾기 처리 중 오류:', error);
    return NextResponse.json(
      { error: '즐겨찾기 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 