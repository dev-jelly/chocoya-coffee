'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/lib/auth';

// 원두 스키마 정의
const beanSchema = z.object({
  name: z.string().min(1, '원두 이름은 필수입니다'),
  origin: z.string().optional(),
  region: z.string().optional(),
  farm: z.string().optional(),
  altitude: z.string().optional(),
  process: z.string().optional(),
  variety: z.string().optional(),
  roastLevel: z.string().optional(),
  roaster: z.string().optional(),
  roastDate: z.string().optional(),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

export type BeanFormState = {
  errors?: {
    name?: string[];
    origin?: string[];
    region?: string[];
    farm?: string[];
    altitude?: string[];
    process?: string[];
    variety?: string[];
    roastLevel?: string[];
    roaster?: string[];
    roastDate?: string[];
    description?: string[];
    isPublic?: string[];
    _form?: string[];
  };
  message?: string | null;
};

// 원두 생성 액션
export async function createBean(
  userId: string,
  prevState: BeanFormState,
  formData: FormData
): Promise<BeanFormState> {
  // 폼 데이터 파싱
  const validatedFields = beanSchema.safeParse({
    name: formData.get('name'),
    origin: formData.get('origin'),
    region: formData.get('region'),
    farm: formData.get('farm'),
    altitude: formData.get('altitude'),
    process: formData.get('process'),
    variety: formData.get('variety'),
    roastLevel: formData.get('roastLevel'),
    roaster: formData.get('roaster'),
    roastDate: formData.get('roastDate'),
    description: formData.get('description'),
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
    name, origin, region, farm, altitude, process, 
    variety, roastLevel, roaster, roastDate, description, isPublic
  } = validatedFields.data;

  try {
    // 원두 생성
    const bean = await prisma.bean.create({
      data: {
        name,
        origin,
        region,
        farm,
        altitude,
        process,
        variety,
        roastLevel,
        roaster,
        roastDate: roastDate ? new Date(roastDate) : null,
        description,
        isPublic,
        userId,
      },
    });

    // 캐시 갱신
    revalidatePath('/beans');
    
    return {
      message: '원두 정보가 성공적으로 등록되었습니다.',
    };
  } catch (error) {
    console.error('원두 등록 오류:', error);
    return {
      errors: {
        _form: ['원두 등록 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 원두 목록 조회 액션
export async function getBeans(search?: string) {
  try {
    const beans = await prisma.bean.findMany({
      where: {
        isPublic: true,
        ...(search ? {
          OR: [
            { name: { contains: search } },
            { origin: { contains: search } },
            { roaster: { contains: search } },
          ],
        } : {}),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return beans;
  } catch (error) {
    console.error('원두 목록 조회 오류:', error);
    return [];
  }
}

// 사용자 원두 목록 조회 액션
export async function getUserBeans(userId: string) {
  try {
    const beans = await prisma.bean.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return beans;
  } catch (error) {
    console.error('사용자 원두 목록 조회 오류:', error);
    return [];
  }
}

// 원두 상세 조회 액션
export async function getBeanById(id: string) {
  try {
    const bean = await prisma.bean.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        recipes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        tasteNotes: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });
    
    return bean;
  } catch (error) {
    console.error('원두 상세 조회 오류:', error);
    return null;
  }
}

// 원두 수정 액션
export async function updateBean(
  id: string,
  userId: string,
  prevState: BeanFormState,
  formData: FormData
): Promise<BeanFormState> {
  // 폼 데이터 파싱
  const validatedFields = beanSchema.safeParse({
    name: formData.get('name'),
    origin: formData.get('origin'),
    region: formData.get('region'),
    farm: formData.get('farm'),
    altitude: formData.get('altitude'),
    process: formData.get('process'),
    variety: formData.get('variety'),
    roastLevel: formData.get('roastLevel'),
    roaster: formData.get('roaster'),
    roastDate: formData.get('roastDate'),
    description: formData.get('description'),
    isPublic: formData.get('isPublic') === 'true',
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  // 원두 소유자 확인
  const bean = await prisma.bean.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!bean || bean.userId !== userId) {
    return {
      errors: {
        _form: ['원두 정보를 수정할 권한이 없습니다.'],
      },
    };
  }

  const { 
    name, origin, region, farm, altitude, process, 
    variety, roastLevel, roaster, roastDate, description, isPublic
  } = validatedFields.data;

  try {
    // 원두 업데이트
    await prisma.bean.update({
      where: { id },
      data: {
        name,
        origin,
        region,
        farm,
        altitude,
        process,
        variety,
        roastLevel,
        roaster,
        roastDate: roastDate ? new Date(roastDate) : null,
        description,
        isPublic,
      },
    });

    // 캐시 갱신
    revalidatePath(`/beans/${id}`);
    
    return {
      message: '원두 정보가 성공적으로 수정되었습니다.',
    };
  } catch (error) {
    console.error('원두 수정 오류:', error);
    return {
      errors: {
        _form: ['원두 수정 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }
}

// 원두 삭제 액션
export async function deleteBean(id: string, userId: string) {
  try {
    // 원두 소유자 확인
    const bean = await prisma.bean.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!bean || bean.userId !== userId) {
      return {
        success: false,
        message: '원두 정보를 삭제할 권한이 없습니다.',
      };
    }

    // 원두 삭제
    await prisma.bean.delete({
      where: { id },
    });

    // 캐시 갱신
    revalidatePath('/beans');
    
    return {
      success: true,
      message: '원두 정보가 성공적으로 삭제되었습니다.',
    };
  } catch (error) {
    console.error('원두 삭제 오류:', error);
    return {
      success: false,
      message: '원두 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
} 