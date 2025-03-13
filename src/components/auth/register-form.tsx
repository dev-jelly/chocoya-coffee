"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithOAuth } from "@/lib/auth/supabase-auth";
import { prisma } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "이름은 2자 이상이어야 합니다.",
  }),
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(8, {
    message: "비밀번호는 8자 이상이어야 합니다.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    try {
      // Supabase 회원가입
      const { user } = await signUpWithEmail(values.email, values.password);
      
      if (user) {
        // 사용자 프로필 정보 추가
        // 참고: 사용자 메타데이터는 Supabase Auth에서 관리하지만
        // Prisma 데이터베이스에도 사용자 정보를 저장합니다.
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user.id,
              name: values.name,
              email: values.email,
            }),
          });
          
          if (!response.ok) {
            // API 호출이 실패했을 때
            const data = await response.json();
            
            if (response.status === 401) {
              // 401 오류는 회원가입 직후 발생할 수 있으므로, 로그만 남기고 회원가입 성공으로 처리합니다
              console.warn('사용자 프로필 저장 401 오류: 회원가입은 성공했으나 프로필 저장에 실패했습니다');
            } else if (response.status === 409) {
              // 이미 존재하는 사용자인 경우 - 회원가입은 성공한 것으로 판단
              console.warn('사용자 프로필 저장 409 오류: 이미 존재하는 사용자입니다');
            } else {
              console.error('사용자 프로필 저장 오류:', data.error);
            }
          }
        } catch (error) {
          // 네트워크 오류 등으로 API 호출 자체가 실패한 경우
          console.error('사용자 프로필 저장 오류:', error);
          // 회원가입 자체는 성공했으므로 오류를 표시하지 않고 계속 진행
        }

        toast({
          title: "성공",
          description: "회원가입이 완료되었습니다! 이메일 인증을 확인해주세요.",
        });
        
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Register error:', error);
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('email already exists')) {
          errorMessage = '이미 등록된 이메일입니다. 다른 이메일을 사용하거나 로그인해 주세요.';
        }
      }
      
      toast({
        title: "오류",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignUp = async (provider: 'kakao' | 'google') => {
    setIsLoading(true);
    try {
      await signInWithOAuth(provider);
      // OAuth 인증은 리디렉션되므로 여기서 추가 작업이 필요 없습니다.
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      toast({
        title: "오류",
        description: `${provider} 로그인에 실패했습니다. 다시 시도해주세요.`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              placeholder="홍길동"
              type="text"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("name")}
            />
            {errors?.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              placeholder="********"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            회원가입
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            또는 소셜 계정으로 계속하기
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleOAuthSignUp('kakao')}
          className="bg-[#FEE500] text-black hover:bg-[#FDD835] hover:text-black"
        >
          <Icons.kakao className="mr-2 h-4 w-4" />
          카카오
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          disabled={isLoading}
          onClick={() => handleOAuthSignUp('google')}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
} 