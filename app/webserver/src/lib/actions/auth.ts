'use server';

import { prisma } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// 로그인 스키마
const loginSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
});

// 회원가입 스키마
const registerSchema = z.object({
  name: z.string().min(2, { message: '이름은 최소 2자 이상이어야 합니다.' }),
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
  password: z.string().min(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

export type AuthFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
  message?: string | null;
};

// 로그인 액션
export async function login(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // 폼 데이터 파싱
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 사용자가 없거나 비밀번호가 일치하지 않는 경우
    if (!user || !user.password) {
      return {
        errors: {
          _form: ['이메일 또는 비밀번호가 올바르지 않습니다.'],
        },
      };
    }

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        errors: {
          _form: ['이메일 또는 비밀번호가 올바르지 않습니다.'],
        },
      };
    }

    // 로그인 성공 시 리다이렉트
    redirect('/');
  } catch (error) {
    console.error('로그인 오류:', error);
    return {
      errors: {
        _form: ['로그인 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }

  return {
    message: '로그인 성공!',
  };
}

// 회원가입 액션
export async function register(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  // 폼 데이터 파싱
  const validatedFields = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  // 유효성 검사 실패 시
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: '입력 정보를 확인해주세요.',
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: {
          email: ['이미 사용 중인 이메일입니다.'],
        },
      };
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 회원가입 성공 시 로그인 페이지로 리다이렉트
    redirect('/auth/login');
  } catch (error) {
    console.error('회원가입 오류:', error);
    return {
      errors: {
        _form: ['회원가입 중 오류가 발생했습니다. 다시 시도해주세요.'],
      },
    };
  }

  return {
    message: '회원가입 성공! 로그인해주세요.',
  };
} 