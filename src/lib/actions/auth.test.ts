// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, register } from './auth';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// 모듈 모킹
vi.mock('../db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('인증 액션', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('로그인 성공 시 리다이렉트해야 합니다', async () => {
      // Mock setup
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      
      await login({}, formData);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('잘못된 이메일로 로그인 시 에러를 반환해야 합니다', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      
      (prisma.user.findUnique as any).mockResolvedValue(null);
      
      const result = await login({}, formData);
      
      expect(result.errors?._form).toContain('이메일 또는 비밀번호가 일치하지 않습니다.');
    });

    it('잘못된 비밀번호로 로그인 시 에러를 반환해야 합니다', async () => {
      const formData = new FormData();
      formData.append('email', 'test@example.com');
      formData.append('password', 'wrongpassword');
      
      const mockUser = {
        id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);
      
      const result = await login({}, formData);
      
      expect(result.errors?._form).toContain('이메일 또는 비밀번호가 일치하지 않습니다.');
    });

    it('유효하지 않은 데이터로 로그인 시 유효성 검증 에러를 반환해야 합니다', async () => {
      const formData = new FormData();
      formData.append('email', 'invalid-email');
      formData.append('password', 'pass'); // 짧은 비밀번호
      
      const result = await login({}, formData);
      
      expect(result.errors?.email).toBeDefined();
      expect(result.errors?.password).toBeDefined();
    });
  });

  describe('register', () => {
    it('회원가입 성공 시 리다이렉트해야 합니다', async () => {
      const formData = new FormData();
      formData.append('name', '홍길동');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');
      
      (prisma.user.findUnique as any).mockResolvedValue(null); // 이메일이 사용 가능함
      (bcrypt.hash as any).mockResolvedValue('hashedPassword');
      (prisma.user.create as any).mockResolvedValue({
        id: 'newuser123',
        name: '홍길동',
        email: 'test@example.com',
      });
      
      await register({}, formData);
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/login?registered=true');
    });

    it('이미 사용 중인 이메일로 회원가입 시 에러를 반환해야 합니다', async () => {
      const formData = new FormData();
      formData.append('name', '홍길동');
      formData.append('email', 'existing@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'password123');
      
      const existingUser = {
        id: 'user123',
        email: 'existing@example.com',
      };
      
      (prisma.user.findUnique as any).mockResolvedValue(existingUser);
      
      const result = await register({}, formData);
      
      expect(result.errors?.email).toContain('이미 사용 중인 이메일입니다.');
    });

    it('비밀번호 불일치 시 에러를 반환해야 합니다', async () => {
      const formData = new FormData();
      formData.append('name', '홍길동');
      formData.append('email', 'test@example.com');
      formData.append('password', 'password123');
      formData.append('confirmPassword', 'different123');
      
      const result = await register({}, formData);
      
      expect(result.errors?.confirmPassword).toContain('비밀번호가 일치하지 않습니다.');
    });
  });
}); 