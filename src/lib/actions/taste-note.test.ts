// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasteNotes, getTasteNoteById, createTasteNote, updateTasteNote, deleteTasteNote } from './taste-note';
import { prisma } from '../db';
import { revalidatePath } from 'next/cache';

// Next.js 모듈 모킹
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Prisma 클라이언트 모킹
vi.mock('../db', () => ({
  prisma: {
    tasteNote: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe('맛 노트 액션', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getTasteNotes', () => {
    it('사용자의 모든 맛 노트를 반환해야 합니다', async () => {
      const userId = 'user123';
      const mockTasteNotes = [
        { id: '1', coffeeName: '에티오피아 예가체프', userId },
        { id: '2', coffeeName: '케냐 AA', userId },
      ];
      
      (prisma.tasteNote.findMany as any).mockResolvedValue(mockTasteNotes);
      
      const result = await getTasteNotes(userId);
      
      expect(prisma.tasteNote.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId },
      }));
      expect(result).toEqual(mockTasteNotes);
    });
  });

  describe('getTasteNoteById', () => {
    it('ID로 맛 노트를 찾아야 합니다', async () => {
      const noteId = 'note123';
      const userId = 'user123';
      const mockTasteNote = { 
        id: noteId, 
        coffeeName: '에티오피아 예가체프', 
        userId,
        acidity: 7,
        sweetness: 8,
        body: 6,
        bitterness: 4,
      };
      
      (prisma.tasteNote.findUnique as any).mockResolvedValue(mockTasteNote);
      
      const result = await getTasteNoteById(noteId, userId);
      
      expect(prisma.tasteNote.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: noteId, userId },
      }));
      expect(result).toEqual(mockTasteNote);
    });

    it('존재하지 않는 맛 노트에 대해 null을 반환해야 합니다', async () => {
      const noteId = 'nonexistent';
      const userId = 'user123';
      
      (prisma.tasteNote.findUnique as any).mockResolvedValue(null);
      
      const result = await getTasteNoteById(noteId, userId);
      
      expect(result).toBeNull();
    });
  });

  describe('createTasteNote', () => {
    it('새 맛 노트를 생성해야 합니다', async () => {
      const userId = 'user123';
      const formData = new FormData();
      formData.append('coffeeName', '에티오피아 예가체프');
      formData.append('brewingMethod', '핸드드립');
      formData.append('acidity', '7');
      formData.append('sweetness', '8');
      
      const mockCreatedNote = {
        id: 'new123',
        coffeeName: '에티오피아 예가체프',
        brewingMethod: '핸드드립',
        acidity: 7,
        sweetness: 8,
        userId,
      };
      
      (prisma.tasteNote.create as any).mockResolvedValue(mockCreatedNote);
      
      const result = await createTasteNote(userId, {}, formData);
      
      expect(prisma.tasteNote.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/taste-notes');
      expect(result).toEqual({
        message: '맛 노트가 성공적으로 저장되었습니다.',
        errors: {},
      });
    });

    it('유효성 검증 실패 시 에러를 반환해야 합니다', async () => {
      const userId = 'user123';
      const formData = new FormData();
      // coffeeName과 brewingMethod가 없음 (필수 필드)
      
      const result = await createTasteNote(userId, {}, formData);
      
      expect(prisma.tasteNote.create).not.toHaveBeenCalled();
      expect(result.errors).toBeDefined();
      expect(result.errors?.coffeeName).toBeDefined();
      expect(result.errors?.brewingMethod).toBeDefined();
    });
  });

  describe('deleteTasteNote', () => {
    it('맛 노트를 삭제해야 합니다', async () => {
      const noteId = 'note123';
      const userId = 'user123';
      
      await deleteTasteNote(noteId, userId);
      
      expect(prisma.tasteNote.delete).toHaveBeenCalledWith({
        where: { id: noteId, userId },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/taste-notes');
    });
  });
}); 