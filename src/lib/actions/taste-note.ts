'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// 맛 노트 스키마 정의
const tasteNoteSchema = z.object({
  coffeeName: z.string().min(1, { message: '원두 이름을 입력해주세요.' }),
  origin: z.string().optional(),
  roastLevel: z.string().optional(),
  roaster: z.string().optional(),
  brewingMethod: z.string().min(1, { message: '추출 방식을 선택해주세요.' }),
  grindSize: z.string().optional(),
  beanAmount: z.string().optional(),
  waterAmount: z.string().optional(),
  waterTemp: z.string().optional(),
  brewTime: z.string().optional(),
  ratio: z.string().optional(),
  overallRating: z.coerce.number().min(1).max(5).optional(),
  acidity: z.coerce.number().min(1).max(10).optional(),
  sweetness: z.coerce.number().min(1).max(10).optional(),
  body: z.coerce.number().min(1).max(10).optional(),
  bitterness: z.coerce.number().min(1).max(10).optional(),
  flavorNotes: z.string().optional(),
  notes: z.string().optional(),
  recipeId: z.string().optional(),
});

export type TasteNoteFormState = {
  errors?: {
    coffeeName?: string[];
    origin?: string[];
    roastLevel?: string[];
    roaster?: string[];
    brewingMethod?: string[];
    grindSize?: string[];
    beanAmount?: string[];
    waterAmount?: string[];
    waterTemp?: string[];
    brewTime?: string[];
    ratio?: string[];
    overallRating?: string[];
    acidity?: string[];
    sweetness?: string[];
    body?: string[];
    bitterness?: string[];
    flavorNotes?: string[];
    notes?: string[];
    recipeId?: string[];
    _form?: string[];
  };
  message?: string | null;
};

// 맛 노트 생성 액션
export async function createTasteNote(
  userId: string,
  prevState: TasteNoteFormState,
  formData: FormData
): Promise<TasteNoteFormState> {
  // 폼 데이터 파싱
  const validatedFields = tasteNoteSchema.safeParse({
    coffeeName: formData.get('coffeeName'),
    origin: formData.get('origin'),
    roastLevel: formData.get('roastLevel'),
    roaster: formData.get('roaster'),
    brewingMethod: formData.get('brewingMethod'),
    grindSize: formData.get('grindSize'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp'),
    brewTime: formData.get('brewTime'),
    ratio: formData.get('ratio'),
    overallRating: formData.get('overallRating'),
    acidity: formData.get('acidity'),
    sweetness: formData.get('sweetness'),
    body: formData.get('body'),
    bitterness: formData.get('bitterness'),
    flavorNotes: formData.get('flavorNotes'),
    notes: formData.get('notes'),
    recipeId: formData.get('recipeId'),
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  const { 
    coffeeName, origin, roastLevel, roaster, brewingMethod,
    grindSize, beanAmount, waterAmount, waterTemp, brewTime, ratio,
    overallRating, acidity, sweetness, body, bitterness,
    flavorNotes, notes, recipeId
  } = validatedFields.data;

  try {
    // 맛 노트 생성
    await prisma.tasteNote.create({
      data: {
        coffeeName,
        origin,
        roastLevel,
        roaster,
        brewingMethod,
        grindSize,
        beanAmount,
        waterAmount,
        waterTemp,
        brewTime,
        ratio,
        overallRating,
        acidity,
        sweetness,
        body,
        bitterness,
        flavorNotes,
        notes,
        recipeId,
        userId,
      },
    });

    // 캐시 갱신
    if (recipeId) {
      revalidatePath(`/recipes/${recipeId}`);
    }
    revalidatePath('/taste-notes');
    
    return {
      message: '맛 노트가 성공적으로 저장되었습니다.',
    };
  } catch (error) {
    console.error('맛 노트 생성 오류:', error);
    return {
      errors: {
        _form: ['맛 노트 저장 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 맛 노트 목록 조회 액션
export async function getTasteNotes(userId: string) {
  try {
    const tasteNotes = await prisma.tasteNote.findMany({
      where: {
        userId,
      },
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return tasteNotes;
  } catch (error) {
    console.error('맛 노트 조회 오류:', error);
    throw new Error('맛 노트를 불러오는 중 오류가 발생했습니다.');
  }
}

// 맛 노트 상세 조회 액션
export async function getTasteNoteById(id: string, userId: string) {
  try {
    const tasteNote = await prisma.tasteNote.findUnique({
      where: {
        id,
        userId, // 자신의 맛 노트만 조회 가능
      },
      include: {
        recipe: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    
    return tasteNote;
  } catch (error) {
    console.error('맛 노트 상세 조회 오류:', error);
    throw new Error('맛 노트를 불러오는 중 오류가 발생했습니다.');
  }
}

// 맛 노트 수정 액션
export async function updateTasteNote(
  id: string,
  userId: string,
  prevState: TasteNoteFormState,
  formData: FormData
): Promise<TasteNoteFormState> {
  // 폼 데이터 파싱
  const validatedFields = tasteNoteSchema.safeParse({
    coffeeName: formData.get('coffeeName'),
    origin: formData.get('origin'),
    roastLevel: formData.get('roastLevel'),
    roaster: formData.get('roaster'),
    brewingMethod: formData.get('brewingMethod'),
    grindSize: formData.get('grindSize'),
    beanAmount: formData.get('beanAmount'),
    waterAmount: formData.get('waterAmount'),
    waterTemp: formData.get('waterTemp'),
    brewTime: formData.get('brewTime'),
    ratio: formData.get('ratio'),
    overallRating: formData.get('overallRating'),
    acidity: formData.get('acidity'),
    sweetness: formData.get('sweetness'),
    body: formData.get('body'),
    bitterness: formData.get('bitterness'),
    flavorNotes: formData.get('flavorNotes'),
    notes: formData.get('notes'),
    recipeId: formData.get('recipeId'),
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  // 맛 노트 소유자 확인
  const tasteNote = await prisma.tasteNote.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!tasteNote || tasteNote.userId !== userId) {
    return {
      errors: {
        _form: ['맛 노트를 수정할 권한이 없습니다.'],
      },
    };
  }

  const { 
    coffeeName, origin, roastLevel, roaster, brewingMethod,
    grindSize, beanAmount, waterAmount, waterTemp, brewTime, ratio,
    overallRating, acidity, sweetness, body, bitterness,
    flavorNotes, notes, recipeId
  } = validatedFields.data;

  try {
    // 맛 노트 업데이트
    await prisma.tasteNote.update({
      where: { id },
      data: {
        coffeeName,
        origin,
        roastLevel,
        roaster,
        brewingMethod,
        grindSize,
        beanAmount,
        waterAmount,
        waterTemp,
        brewTime,
        ratio,
        overallRating,
        acidity,
        sweetness,
        body,
        bitterness,
        flavorNotes,
        notes,
        recipeId,
      },
    });

    // 캐시 갱신
    if (recipeId) {
      revalidatePath(`/recipes/${recipeId}`);
    }
    revalidatePath('/taste-notes');
    revalidatePath(`/taste-notes/${id}`);
    
    return {
      message: '맛 노트가 성공적으로 수정되었습니다.',
    };
  } catch (error) {
    console.error('맛 노트 수정 오류:', error);
    return {
      errors: {
        _form: ['맛 노트 수정 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 맛 노트 삭제 액션
export async function deleteTasteNote(id: string, userId: string) {
  try {
    // 맛 노트 소유자 확인
    const tasteNote = await prisma.tasteNote.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!tasteNote || tasteNote.userId !== userId) {
      return {
        success: false,
        message: '맛 노트를 삭제할 권한이 없습니다.',
      };
    }

    // 맛 노트 삭제
    await prisma.tasteNote.delete({
      where: { id },
    });

    // 캐시 갱신
    revalidatePath('/taste-notes');
    
    return {
      success: true,
      message: '맛 노트가 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('맛 노트 삭제 오류:', error);
    return {
      success: false,
      message: '맛 노트 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
} 