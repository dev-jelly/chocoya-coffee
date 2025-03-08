'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// 레시피 스키마 정의
const recipeSchema = z.object({
  title: z.string().min(1, '레시피 이름은 필수입니다'),
  brewingMethod: z.string().min(1, '추출 방식은 필수입니다'),
  difficulty: z.string().optional(),
  preparationTime: z.string().min(1, '소요 시간은 필수입니다'),
  beanAmount: z.string().min(1, '원두량은 필수입니다'),
  waterAmount: z.string().min(1, '물 용량은 필수입니다'),
  waterTemp: z.string().optional(),
  grindSize: z.string().min(1, '분쇄도는 필수입니다'),
  tools: z.string().optional(),
  acidity: z.string().optional(),
  sweetness: z.string().optional(),
  body: z.string().optional(),
  recommendedBeans: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  steps: z.string().optional(),
  isPublic: z.boolean().default(true),
  beanId: z.string().optional().nullable(),
  grinderId: z.string().optional().nullable(),
  grinderSetting: z.string().optional().nullable(),
});

export type RecipeFormState = {
  errors?: {
    title?: string[];
    brewingMethod?: string[];
    difficulty?: string[];
    preparationTime?: string[];
    beanAmount?: string[];
    waterAmount?: string[];
    waterTemp?: string[];
    grindSize?: string[];
    tools?: string[];
    acidity?: string[];
    sweetness?: string[];
    body?: string[];
    recommendedBeans?: string[];
    isPublic?: string[];
    beanId?: string[];
    _form?: string[];
  };
  message?: string | null;
};

// 레시피 생성 액션
export async function createRecipe(
  userId: string,
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  // 현재 로그인한 사용자 확인
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      errors: {
        _form: ['로그인이 필요합니다.'],
      },
    };
  }

  // 실제 사용자 ID 사용
  const actualUserId = session.user.id;

  // 폼 데이터 파싱
  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    brewingMethod: formData.get('method'), // 필드명 수정
    difficulty: formData.get('difficulty'),
    preparationTime: formData.get('preparationTime'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp') || formData.get('temperature'), // 필드명 대체 가능성
    grindSize: formData.get('grindSize'),
    tools: formData.get('equipment'), // 필드명 수정
    acidity: formData.get('acidity') || '중간',
    sweetness: formData.get('sweetness') || '중간',
    body: formData.get('body') || '중간',
    recommendedBeans: formData.get('recommendedBeans') || '',
    isPublic: formData.get('isPublic') === 'true' || true,
    beanId: formData.get('beanId') || null,
    grinderId: formData.get('grinderId') || null,
    grinderSetting: formData.get('grinderSetting') || null,
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  const {
    title, description, brewingMethod, difficulty, preparationTime,
    beanAmount, waterAmount, waterTemp, grindSize, tools,
    acidity, sweetness, body, recommendedBeans, isPublic, beanId,
    grinderId, grinderSetting
  } = validatedFields.data;

  try {
    // 단계 포맷팅
    let stepsText = '';
    const stepsCount = parseInt(formData.get('stepsCount')?.toString() || '0', 10);

    if (stepsCount > 0) {
      const stepsArray = [];
      for (let i = 0; i < stepsCount; i++) {
        const step = formData.get(`step-${i}`)?.toString();
        if (step?.trim()) {
          stepsArray.push(step);
        }
      }
      stepsText = stepsArray.join('\n');
    }

    // DB에 레시피 저장
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        brewingMethod,
        difficulty,
        preparationTime,
        beanAmount,
        waterAmount,
        waterTemp,
        grindSize,
        tools,
        acidity,
        sweetness,
        body,
        recommendedBeans,
        steps: stepsText,
        isPublic,
        userId: actualUserId,
        grinderId,
        grinderSetting,
        beanId: beanId || undefined,
      },
    });

    // 재료 추가 (쉼표로 구분된 문자열을 배열로 변환)
    const ingredientsStr = formData.get('ingredients') as string;
    if (ingredientsStr) {
      const ingredients = ingredientsStr.split(',').map(item => item.trim());

      for (const ingredient of ingredients) {
        await prisma.ingredient.create({
          data: {
            name: ingredient,
            recipeId: recipe.id,
          },
        });
      }
    }

    // 브루잉 팁 추가
    const tipsStr = formData.get('brewingTips') as string;
    if (tipsStr) {
      const tips = tipsStr.split('\n').filter(tip => tip.trim() !== '');

      for (const tip of tips) {
        await prisma.brewingTip.create({
          data: {
            content: tip.trim(),
            recipeId: recipe.id,
          },
        });
      }
    }

    // 캐시 갱신
    revalidatePath('/recipes');

    return {
      message: '레시피가 성공적으로 생성되었습니다.',
    };
  } catch (error) {
    console.error('레시피 생성 오류:', error);
    return {
      errors: {
        _form: ['레시피 생성 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 레시피 목록 조회 액션
export async function getRecipes(method?: string) {
  try {
    let recipes;

    if (method) {
      recipes = await prisma.recipe.findMany({
        where: {
          brewingMethod: method,
          isPublic: true,
        },
        include: {
          ingredients: true,
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
          brewingTips: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      recipes = await prisma.recipe.findMany({
        where: {
          isPublic: true,
        },
        include: {
          ingredients: true,
          steps: {
            orderBy: {
              order: 'asc',
            },
          },
          brewingTips: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return recipes;
  } catch (error) {
    console.error('레시피 조회 오류:', error);
    throw new Error('레시피를 불러오는 중 오류가 발생했습니다.');
  }
}

// 레시피 상세 조회 액션
export async function getRecipeById(id: string) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        ingredients: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        brewingTips: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return recipe;
  } catch (error) {
    console.error('레시피 상세 조회 오류:', error);
    throw new Error('레시피를 불러오는 중 오류가 발생했습니다.');
  }
}

// 레시피 수정 액션
export async function updateRecipe(
  id: string,
  userId: string,
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  // 현재 로그인한 사용자 확인
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      errors: {
        _form: ['로그인이 필요합니다.'],
      },
    };
  }

  // 실제 사용자 ID 사용
  const actualUserId = session.user.id;

  // 레시피 존재 및 작성자 확인
  const existingRecipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existingRecipe) {
    return {
      errors: {
        _form: ['해당 레시피를 찾을 수 없습니다.'],
      },
    };
  }

  if (existingRecipe.userId !== actualUserId) {
    return {
      errors: {
        _form: ['이 레시피를 수정할 권한이 없습니다.'],
      },
    };
  }

  // 폼 데이터 파싱
  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    brewingMethod: formData.get('method'), // 필드명 수정
    difficulty: formData.get('difficulty'),
    preparationTime: formData.get('preparationTime'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp') || formData.get('temperature'), // 필드명 대체 가능성
    grindSize: formData.get('grindSize'),
    tools: formData.get('equipment'), // 필드명 수정
    acidity: formData.get('acidity') || '',
    sweetness: formData.get('sweetness') || '',
    body: formData.get('body') || '',
    recommendedBeans: formData.get('recommendedBeans') || '',
    isPublic: formData.get('isPublic') === 'true' || true,
    beanId: formData.get('beanId') || null,
    grinderId: formData.get('grinderId') || null,
    grinderSetting: formData.get('grinderSetting') || null,
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  // 단계 포맷팅
  let stepsText = '';
  const stepsCount = parseInt(formData.get('stepsCount')?.toString() || '0', 10);

  if (stepsCount > 0) {
    const stepsArray = [];
    for (let i = 0; i < stepsCount; i++) {
      const step = formData.get(`step-${i}`)?.toString();
      if (step?.trim()) {
        stepsArray.push(step);
      }
    }
    stepsText = stepsArray.join('\n');
  }

  try {
    // DB에 레시피 업데이트
    await prisma.recipe.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description || '',
        brewingMethod: validatedFields.data.brewingMethod,
        difficulty: validatedFields.data.difficulty || '',
        preparationTime: validatedFields.data.preparationTime,
        beanAmount: validatedFields.data.beanAmount,
        waterAmount: validatedFields.data.waterAmount,
        waterTemp: validatedFields.data.waterTemp || '',
        grindSize: validatedFields.data.grindSize,
        tools: validatedFields.data.tools || '',
        acidity: validatedFields.data.acidity || '',
        sweetness: validatedFields.data.sweetness || '',
        body: validatedFields.data.body || '',
        recommendedBeans: validatedFields.data.recommendedBeans || '',
        steps: stepsText,
        isPublic: validatedFields.data.isPublic,
        grinderId: validatedFields.data.grinderId,
        grinderSetting: validatedFields.data.grinderSetting,
        beanId: validatedFields.data.beanId,
      },
    });

    // 기존 재료 삭제
    await prisma.ingredient.deleteMany({
      where: { recipeId: id },
    });

    // 재료 추가
    const ingredientsStr = formData.get('ingredients') as string;
    if (ingredientsStr) {
      const ingredients = ingredientsStr.split(',').map(item => item.trim());

      for (const ingredient of ingredients) {
        await prisma.ingredient.create({
          data: {
            name: ingredient,
            recipeId: id,
          },
        });
      }
    }

    // 기존 브루잉 팁 삭제
    await prisma.brewingTip.deleteMany({
      where: { recipeId: id },
    });

    // 브루잉 팁 추가
    const tipsStr = formData.get('brewingTips') as string;
    if (tipsStr) {
      const tips = tipsStr.split('\n').filter(tip => tip.trim() !== '');

      for (const tip of tips) {
        await prisma.brewingTip.create({
          data: {
            content: tip.trim(),
            recipeId: id,
          },
        });
      }
    }

    // 캐시 갱신
    revalidatePath(`/recipes/${id}`);
    revalidatePath('/recipes');

    return {
      message: '레시피가 성공적으로 수정되었습니다.',
    };
  } catch (error) {
    console.error('레시피 수정 오류:', error);
    return {
      errors: {
        _form: ['레시피 수정 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 레시피 삭제 액션
export async function deleteRecipe(id: string, userId: string) {
  try {
    // 레시피 소유자 확인
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!recipe || recipe.userId !== userId) {
      return {
        success: false,
        message: '레시피를 삭제할 권한이 없습니다.',
      };
    }

    // 관련 데이터 삭제 (Prisma의 cascade 기능으로 자동 삭제됨)
    await prisma.recipe.delete({
      where: { id },
    });

    // 캐시 갱신
    revalidatePath('/recipes');

    return {
      success: true,
      message: '레시피가 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('레시피 삭제 오류:', error);
    return {
      success: false,
      message: '레시피 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
}

// 작성자별 레시피 목록 조회 액션
export async function getRecipesByAuthor(userId: string) {
  try {
    const recipes = await prisma.recipe.findMany({
      where: {
        userId: userId,
      },
      include: {
        ingredients: true,
        steps: {
          orderBy: {
            order: 'asc',
          },
        },
        brewingTips: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recipes;
  } catch (error) {
    console.error('작성자별 레시피 조회 오류:', error);
    return [];
  }
} 