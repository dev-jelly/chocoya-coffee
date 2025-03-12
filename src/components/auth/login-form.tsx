"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { loginSchema } from "@/lib/validations/auth";
import { signInWithEmail, signInWithOAuth } from "@/lib/auth/supabase-auth";
import { Icons } from "@/components/ui/icons";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);

    try {
      const result = await signInWithEmail(data.email, data.password);
      
      if (result.success) {
        router.push("/");
        router.refresh();
        toast.success("로그인되었습니다.");
      } else {
        toast.error(result.error || "로그인에 실패했습니다.");
        
        if (result.error?.includes('이메일 또는 비밀번호가 올바르지 않습니다')) {
          form.setError('email', { message: '이메일 또는 비밀번호를 확인해주세요' });
          form.setError('password', { message: '이메일 또는 비밀번호를 확인해주세요' });
        }
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error("로그인 중 예상치 못한 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: 'kakao' | 'google') {
    setIsLoading(true);

    try {
      const result = await signInWithOAuth(provider);
      
      if (result.success && result.data) {
        if (result.data.url) {
          window.location.href = result.data.url;
        } else {
          toast.error(`${provider} 로그인 URL을 가져오는데 실패했습니다.`);
          setIsLoading(false);
        }
      } else {
        toast.error(result.error || `${provider} 로그인에 실패했습니다.`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(`${provider} 로그인 오류:`, error);
      toast.error(`${provider} 로그인 중 예상치 못한 오류가 발생했습니다. 다시 시도해주세요.`);
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            또는 소셜 로그인
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("kakao")}
          className="bg-[#FEE500] text-black hover:bg-[#FDD835] hover:text-black"
        >
          <Icons.kakao className="mr-2 h-4 w-4" />
          카카오
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuthSignIn("google")}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <div className="text-center text-sm">
        계정이 없으신가요?{" "}
        <Link href="/auth/register" className="underline">
          회원가입
        </Link>
      </div>
    </div>
  );
} 