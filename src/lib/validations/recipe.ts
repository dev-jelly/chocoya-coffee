import { z } from "zod";

// 레시피 단계 스키마
export const recipeStepSchema = z.object({
  order: z.number().int().min(1, "순서는 1 이상이어야 합니다."),
  time: z.number().int().min(0, "시간은 0초 이상이어야 합니다."),
  waterAmount: z.number().int().min(0, "물의 양은 0ml 이상이어야 합니다."),
  description: z.string().optional(),
  isSwitch: z.boolean().default(false),
});

// 레시피 생성 스키마
export const recipeCreateSchema = z.object({
  title: z.string().min(2, "제목은 최소 2자 이상이어야 합니다."),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  coffeeType: z.string().optional(),
  roastLevel: z.string().optional(),
  grindSize: z.string().optional(),
  waterTemp: z.number().int().min(0).max(100).optional(),
  steps: z.array(recipeStepSchema).min(1, "최소 1개 이상의 단계가 필요합니다."),
});

// 레시피 업데이트 스키마
export const recipeUpdateSchema = recipeCreateSchema.partial();

// 맛 노트 스키마
export const tasteNoteSchema = z.object({
  acidity: z.number().int().min(1).max(10).optional(),
  sweetness: z.number().int().min(1).max(10).optional(),
  body: z.number().int().min(1).max(10).optional(),
  bitterness: z.number().int().min(1).max(10).optional(),
  balance: z.number().int().min(1).max(10).optional(),
  aftertaste: z.number().int().min(1).max(10).optional(),
  flavorNotes: z.string().optional(),
  overallImpression: z.number().int().min(1).max(10).optional(),
  comments: z.string().optional(),
});

// 댓글 스키마
export const commentSchema = z.object({
  content: z.string().min(1, "댓글 내용을 입력해주세요."),
});

// 신고 스키마
export const reportSchema = z.object({
  reason: z.string().min(1, "신고 사유를 입력해주세요."),
}); 