import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // 관리자 계정 생성 (이미 존재하는 경우 업데이트)
    const adminEmail = 'admin@chocoya.coffee';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    let adminId;

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin1234', 10);

      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: '초코야 관리자',
          password: hashedPassword,
        },
      });

      adminId = admin.id;
    } else {
      adminId = existingAdmin.id;
    }

    // 기본 푸어오버 레시피 추가
    const recipeId = 'basic-hand-drip-recipe';

    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!existingRecipe) {
      const recipe = await prisma.recipe.create({
        data: {
          id: recipeId,
          title: '기본 푸어오버 레시피',
          description: '초보자도 쉽게 따라할 수 있는 기본 푸어오버 레시피입니다. 균형 잡힌 맛을 추출하는 것을 목표로 합니다.',
          isPublic: true,
          brewingMethod: '푸어오버',
          difficulty: '초급',
          preparationTime: '3~4분',
          beanAmount: '15g',
          waterAmount: '250ml',
          waterTemp: '90-92°C',
          grindSize: '중간',
          tools: '드리퍼, 필터, 서버, 주전자, 저울',
          acidity: '중간',
          sweetness: '중간-높음',
          body: '중간',
          recommendedBeans: '에티오피아 예가체프, 과테말라 안티구아',
          userId: adminId,
        },
      });

      // 레시피 단계 추가
      const steps = [
        {
          recipeId: recipe.id,
          order: 1,
          description: '필터를 드리퍼에 세팅하고 뜨거운 물로 필터를 적셔줍니다.',
          time: '30초',
        },
        {
          recipeId: recipe.id,
          order: 2,
          description: '분쇄된 원두 15g을 드리퍼에 넣고 평평하게 만듭니다.',
          time: '10초',
        },
        {
          recipeId: recipe.id,
          order: 3,
          description: '원두 중앙에 30ml의 물을 부어 블루밍을 시작합니다.',
          time: '30초',
          waterAmount: '30ml',
        },
        {
          recipeId: recipe.id,
          order: 4,
          description: '원을 그리며 천천히 100ml까지 물을 부어줍니다.',
          time: '30초',
          waterAmount: '70ml',
        },
        {
          recipeId: recipe.id,
          order: 5,
          description: '물이 절반 정도 내려가면 다시 180ml까지 물을 부어줍니다.',
          time: '30초',
          waterAmount: '80ml',
        },
        {
          recipeId: recipe.id,
          order: 6,
          description: '마지막으로 250ml까지 물을 부어 추출을 완료합니다.',
          time: '60초',
          waterAmount: '70ml',
        },
      ];

      for (const step of steps) {
        await prisma.step.create({
          data: step,
        });
      }

      // 브루잉 팁 추가
      const tips = [
        {
          recipeId: recipe.id,
          content: '물을 부을 때는 원두 위에서 너무 높지 않게 조절하여 부어주세요.',
        },
        {
          recipeId: recipe.id,
          content: '블루밍 시간은 원두의 신선도에 따라 조절할 수 있습니다. 로스팅 후 일주일 이내의 원두는 30-45초, 오래된 원두는 20-30초 정도가 적당합니다.',
        },
        {
          recipeId: recipe.id,
          content: '전체 추출 시간은 2분 30초에서 3분 사이가 이상적입니다.',
        },
      ];

      for (const tip of tips) {
        await prisma.brewingTip.create({
          data: tip,
        });
      }

      return NextResponse.json({
        success: true,
        message: '기본 레시피가 성공적으로 추가되었습니다.',
        recipe: recipe.id
      });
    }

    return NextResponse.json({
      success: true,
      message: '기본 레시피가 이미 존재합니다.',
      recipe: recipeId
    });

  } catch (error: any) {
    console.error('시드 오류:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 