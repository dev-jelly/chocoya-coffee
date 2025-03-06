'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/lib/auth';

// 레시피 스키마 정의
const recipeSchema = z.object({
  title: z.string().min(1, '레시피 이름은 필수입니다'),
  method: z.string().min(1, '추출 방식은 필수입니다'),
  difficulty: z.string().optional(),
  preparationTime: z.string().min(1, '소요 시간은 필수입니다'),
  beanAmount: z.string().min(1, '원두량은 필수입니다'),
  waterAmount: z.string().min(1, '물 용량은 필수입니다'),
  grindSize: z.string().min(1, '분쇄도는 필수입니다'),
  description: z.string().optional(),
  equipment: z.string().optional(),
  notes: z.string().optional(),
  steps: z.string().optional(),
});

export type RecipeFormState = {
  errors?: {
    title?: string[];
    method?: string[];
    difficulty?: string[];
    preparationTime?: string[];
    beanAmount?: string[];
    waterAmount?: string[];
    grindSize?: string[];
    tools?: string[];
    acidity?: string[];
    sweetness?: string[];
    body?: string[];
    recommendedBeans?: string[];
    isPublic?: string[];
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
  // 폼 데이터 파싱
  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    brewingMethod: formData.get('brewingMethod'),
    difficulty: formData.get('difficulty'),
    preparationTime: formData.get('preparationTime'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp'),
    grindSize: formData.get('grindSize'),
    tools: formData.get('tools'),
    acidity: formData.get('acidity'),
    sweetness: formData.get('sweetness'),
    body: formData.get('body'),
    recommendedBeans: formData.get('recommendedBeans'),
    isPublic: formData.get('isPublic') === 'true',
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
    acidity, sweetness, body, recommendedBeans, isPublic
  } = validatedFields.data;

  try {
    // 레시피 생성
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
        isPublic,
        userId,
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

    // 단계 추가
    const stepsCount = parseInt(formData.get('stepsCount') as string) || 0;
    for (let i = 0; i < stepsCount; i++) {
      const description = formData.get(`step-${i}`) as string;
      if (description) {
        await prisma.step.create({
          data: {
            order: i + 1,
            description,
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
  // 폼 데이터 파싱
  const validatedFields = recipeSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    brewingMethod: formData.get('brewingMethod'),
    difficulty: formData.get('difficulty'),
    preparationTime: formData.get('preparationTime'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp'),
    grindSize: formData.get('grindSize'),
    tools: formData.get('tools'),
    acidity: formData.get('acidity'),
    sweetness: formData.get('sweetness'),
    body: formData.get('body'),
    recommendedBeans: formData.get('recommendedBeans'),
    isPublic: formData.get('isPublic') === 'true',
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  // 레시피 소유자 확인
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!recipe || recipe.userId !== userId) {
    return {
      errors: {
        _form: ['레시피를 수정할 권한이 없습니다.'],
      },
    };
  }

  const { 
    title, description, brewingMethod, difficulty, preparationTime,
    beanAmount, waterAmount, waterTemp, grindSize, tools,
    acidity, sweetness, body, recommendedBeans, isPublic
  } = validatedFields.data;

  try {
    // 레시피 업데이트
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
        isPublic,
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

    // 기존 단계 삭제
    await prisma.step.deleteMany({
      where: { recipeId: id },
    });

    // 단계 추가
    const stepsCount = parseInt(formData.get('stepsCount') as string) || 0;
    for (let i = 0; i < stepsCount; i++) {
      const description = formData.get(`step-${i}`) as string;
      if (description) {
        await prisma.step.create({
          data: {
            order: i + 1,
            description,
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