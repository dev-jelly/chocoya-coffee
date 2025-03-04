import { z } from "zod";

// 로그인 스키마
export const loginSchema = z.object({
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

// 회원가입 스키마
export const registerSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  confirmPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

// 비밀번호 변경 스키마
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  newPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  confirmNewPassword: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "새 비밀번호가 일치하지 않습니다.",
  path: ["confirmNewPassword"],
}); 