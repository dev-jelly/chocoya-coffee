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

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    try {
      // 여기에 회원가입 API 호출 로직 추가
      // 예: const response = await fetch("/api/auth/register", { ... })
      
      // 성공 시 토스트 메시지 표시
      toast({
        title: "회원가입 성공!",
        description: "로그인 페이지로 이동합니다.",
      });
      
      // 로그인 페이지로 리다이렉트 (실제 구현 시 추가)
      // router.push("/auth/login");
    } catch (error) {
      // 에러 처리
      toast({
        title: "회원가입 실패",
        description: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

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
        <Button variant="outline" type="button" disabled={isLoading}>
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
    </div>
  );
} 