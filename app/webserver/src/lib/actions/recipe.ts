'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { getAuthenticatedUserId } from '@/lib/auth/utils/server-auth';

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
  const actualUserId = await getAuthenticatedUserId();
  if (!actualUserId) {
    return {
      errors: {
        _form: ['로그인이 필요합니다.'],
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
    acidity: formData.get('acidity') || '중간',
    sweetness: formData.get('sweetness') || '중간',
    body: formData.get('body') || '중간',
    recommendedBeans: formData.get('recommendedBeans') || '',
    isPublic: formData.get('isPublic') === 'true',
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

    let stepsArray = [];
    if (stepsCount > 0) {
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
        steps: {
          create: stepsArray.map((description, index) => ({
            order: index + 1,
            description
          }))
        },
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
    // Prisma의 Recipe 모델에 맞는 where 조건 타입 정의
    let whereClause: {
      isPublic: boolean;
      brewingMethod?: string;
    } = {
      isPublic: true,
    };

    if (method) {
      whereClause = {
        ...whereClause,
        brewingMethod: method,
      };
    }

    // 쿼리 최적화: 필요한 필드만 선택하고 관계 데이터는 제외
    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        description: true,
        preparationTime: true,
        beanAmount: true,
        waterAmount: true,
        difficulty: true,
        grindSize: true,
        brewingMethod: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return recipes;
  } catch (error) {
    console.error('레시피 조회 오류:', error);
    // 오류 메시지 개선
    if (error instanceof Error) {
      if (error.message.includes('P5010') || error.message.includes('fetch failed')) {
        throw new Error('데이터베이스 연결에 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.');
      }
    }
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

// 레시피 업데이트 액션
export async function updateRecipe(
  id: string,
  userId: string,
  prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  // 현재 로그인한 사용자 확인
  const actualUserId = await getAuthenticatedUserId();
  if (!actualUserId) {
    return {
      errors: {
        _form: ['로그인이 필요합니다.'],
      },
    };
  }

  // 레시피 존재 및 작성자 확인
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return {
      errors: {
        _form: ['존재하지 않는 레시피입니다.'],
      },
    };
  }

  if (recipe.userId !== actualUserId) {
    return {
      errors: {
        _form: ['본인이 작성한 레시피만 수정할 수 있습니다.'],
      },
    };
  }

  // 폼 데이터 파싱
  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    brewingMethod: formData.get('method') || formData.get('brewingMethod'),
    difficulty: formData.get('difficulty'),
    preparationTime: formData.get('preparationTime'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp') || formData.get('temperature'),
    grindSize: formData.get('grindSize'),
    tools: formData.get('equipment') || formData.get('tools'),
    acidity: formData.get('acidity') || '중간',
    sweetness: formData.get('sweetness') || '중간',
    body: formData.get('body') || '중간',
    recommendedBeans: formData.get('recommendedBeans') || '',
    isPublic: formData.get('isPublic') === 'true',
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

    // DB에 레시피 업데이트
    await prisma.recipe.update({
      where: { id },
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
        grinderId,
        grinderSetting,
        beanId: beanId || undefined,
      },
    });

    // 기존 재료 삭제
    await prisma.ingredient.deleteMany({
      where: { recipeId: id },
    });

    // 새 재료 추가
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

    // 기존 팁 삭제
    await prisma.brewingTip.deleteMany({
      where: { recipeId: id },
    });

    // 새 팁 추가
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
    revalidatePath('/recipes');
    revalidatePath(`/recipes/${id}`);

    return {
      message: '레시피가 성공적으로 업데이트되었습니다.',
    };
  } catch (error) {
    console.error('레시피 업데이트 오류:', error);
    return {
      errors: {
        _form: ['레시피 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 레시피 삭제 액션
export async function deleteRecipe(id: string, userId: string) {
  try {
    // 현재 로그인한 사용자 확인
    const actualUserId = await getAuthenticatedUserId();
    if (!actualUserId) {
      throw new Error('로그인이 필요합니다.');
    }

    // 레시피 존재 및 작성자 확인
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new Error('존재하지 않는 레시피입니다.');
    }

    // 관리자 여부 확인 (관리자는 모든 레시피 삭제 가능)
    const isAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL === actualUserId;

    if (recipe.userId !== actualUserId && !isAdmin) {
      throw new Error('본인이 작성한 레시피만 삭제할 수 있습니다.');
    }

    // 연관된 데이터 삭제
    await prisma.$transaction([
      prisma.ingredient.deleteMany({ where: { recipeId: id } }),
      prisma.brewingTip.deleteMany({ where: { recipeId: id } }),
      prisma.recipe.delete({ where: { id } }),
    ]);

    // 캐시 갱신
    revalidatePath('/recipes');

    return { success: true, message: '레시피가 성공적으로 삭제되었습니다.' };
  } catch (error) {
    console.error('레시피 삭제 오류:', error);
    return { success: false, message: '레시피 삭제 중 오류가 발생했습니다.' };
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