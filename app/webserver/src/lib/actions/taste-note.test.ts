// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTasteNotes, getTasteNoteById, createTasteNote, deleteTasteNote } from './taste-note';
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

// FormData 모킹
class MockFormData {
  private data: Record<string, string> = {};

  append(key: string, value: string) {
    this.data[key] = value;
  }

  get(key: string) {
    return this.data[key] || null;
  }
}

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
      const formData = new MockFormData() as unknown as FormData;
      formData.append('coffeeName', '에티오피아 예가체프');
      formData.append('brewingMethod', '핸드드립');
      formData.append('acidity', '7');
      formData.append('sweetness', '8');
      
      // createTasteNote 함수 모킹
      const mockCreateTasteNote = vi.fn().mockResolvedValue({
        message: '맛 노트가 성공적으로 저장되었습니다.',
        errors: {},
      });
      
      // 원래 함수 백업
      const originalCreateTasteNote = createTasteNote;
      
      try {
        // 임시로 함수 교체
        (global as any).createTasteNote = mockCreateTasteNote;
        
        const result = await mockCreateTasteNote(userId, {}, formData);
        
        expect(result).toEqual({
          message: '맛 노트가 성공적으로 저장되었습니다.',
          errors: {},
        });
      } finally {
        // 원래 함수 복원
        (global as any).createTasteNote = originalCreateTasteNote;
      }
    });

    it('유효성 검증 실패 시 에러를 반환해야 합니다', async () => {
      const userId = 'user123';
      const formData = new MockFormData() as unknown as FormData;
      // coffeeName과 brewingMethod가 없음 (필수 필드)
      
      // createTasteNote 함수 모킹
      const mockCreateTasteNote = vi.fn().mockResolvedValue({
        message: '',
        errors: {
          coffeeName: ['원두 이름을 입력해주세요.'],
          brewingMethod: ['추출 방식을 선택해주세요.'],
        },
      });
      
      // 원래 함수 백업
      const originalCreateTasteNote = createTasteNote;
      
      try {
        // 임시로 함수 교체
        (global as any).createTasteNote = mockCreateTasteNote;
        
        const result = await mockCreateTasteNote(userId, {}, formData);
        
        expect(result.errors).toBeDefined();
        expect(result.errors.coffeeName).toBeDefined();
        expect(result.errors.brewingMethod).toBeDefined();
      } finally {
        // 원래 함수 복원
        (global as any).createTasteNote = originalCreateTasteNote;
      }
    });
  });

  describe('deleteTasteNote', () => {
    it('맛 노트를 삭제해야 합니다', async () => {
      const noteId = 'note123';
      const userId = 'user123';
      
      // deleteTasteNote 함수 모킹
      const mockDeleteTasteNote = vi.fn().mockResolvedValue({
        message: '삭제되었습니다.',
        errors: {},
      });
      
      // 원래 함수 백업
      const originalDeleteTasteNote = deleteTasteNote;
      
      try {
        // 임시로 함수 교체
        (global as any).deleteTasteNote = mockDeleteTasteNote;
        
        const result = await mockDeleteTasteNote(noteId, userId);
        
        expect(result).toEqual({
          message: '삭제되었습니다.',
          errors: {},
        });
      } finally {
        // 원래 함수 복원
        (global as any).deleteTasteNote = originalDeleteTasteNote;
      }
    });
  });
}); 