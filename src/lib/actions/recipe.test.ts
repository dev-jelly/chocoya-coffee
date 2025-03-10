import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe } from './recipe';
import { prisma } from '../db';

// Prisma 클라이언트 모킹
vi.mock('../db', () => ({
  prisma: {
    recipe: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('레시피 액션', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getRecipes', () => {
    it('모든 공개 레시피를 반환해야 합니다', async () => {
      const mockRecipes = [
        { id: '1', title: '레시피 1', isPublic: true },
        { id: '2', title: '레시피 2', isPublic: true },
      ];
      
      (prisma.recipe.findMany as any).mockResolvedValue(mockRecipes);
      
      const result = await getRecipes();
      
      expect(prisma.recipe.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { isPublic: true },
      }));
      expect(result).toEqual(mockRecipes);
    });

    it('특정 브루잉 방법의 레시피를 반환해야 합니다', async () => {
      const mockRecipes = [
        { id: '1', title: '레시피 1', isPublic: true, brewingMethod: '핸드드립' },
      ];
      
      (prisma.recipe.findMany as any).mockResolvedValue(mockRecipes);
      
      const result = await getRecipes('핸드드립');
      
      expect(prisma.recipe.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { 
          isPublic: true,
          brewingMethod: '핸드드립',
        },
      }));
      expect(result).toEqual(mockRecipes);
    });

    it('에러가 발생하면 적절한 에러를 던져야 합니다', async () => {
      (prisma.recipe.findMany as any).mockRejectedValue(new Error('DB 에러'));
      
      await expect(getRecipes()).rejects.toThrow('레시피를 불러오는 중 오류가 발생했습니다.');
    });
  });

  describe('getRecipeById', () => {
    it('ID로 레시피를 찾아야 합니다', async () => {
      const mockRecipe = { id: '1', title: '레시피 1', isPublic: true };
      
      (prisma.recipe.findUnique as any).mockResolvedValue(mockRecipe);
      
      const result = await getRecipeById('1');
      
      expect(prisma.recipe.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
      }));
      expect(result).toEqual(mockRecipe);
    });

    it('존재하지 않는 레시피에 대해 null을 반환해야 합니다', async () => {
      (prisma.recipe.findUnique as any).mockResolvedValue(null);
      
      const result = await getRecipeById('999');
      
      expect(result).toBeNull();
    });
  });

  // 추가 테스트 케이스는 createRecipe, updateRecipe, deleteRecipe 등에 대해 작성할 수 있습니다
}); 