import { create } from "zustand";
import { tasteNoteSchema } from "../validations/recipe";
import { z } from "zod";

// 맛 노트 타입
type TasteNote = z.infer<typeof tasteNoteSchema>;

// 맛 노트 스토어 상태 타입
interface TasteNoteState {
  // 맛 평가
  acidity: number | null;
  sweetness: number | null;
  body: number | null;
  bitterness: number | null;
  balance: number | null;
  aftertaste: number | null;
  flavorNotes: string;
  overallImpression: number | null;
  comments: string;
  
  // 액션
  setAcidity: (value: number | null) => void;
  setSweetness: (value: number | null) => void;
  setBody: (value: number | null) => void;
  setBitterness: (value: number | null) => void;
  setBalance: (value: number | null) => void;
  setAftertaste: (value: number | null) => void;
  setFlavorNotes: (value: string) => void;
  setOverallImpression: (value: number | null) => void;
  setComments: (value: string) => void;
  
  // 플레이버 노트 관리
  addFlavorNote: (note: string) => void;
  removeFlavorNote: (note: string) => void;
  
  reset: () => void;
}

// 초기 상태
const initialState = {
  acidity: null,
  sweetness: null,
  body: null,
  bitterness: null,
  balance: null,
  aftertaste: null,
  flavorNotes: "",
  overallImpression: null,
  comments: "",
};

// 맛 노트 스토어
export const useTasteNoteStore = create<TasteNoteState>((set) => ({
  ...initialState,
  
  // 맛 평가 설정 액션
  setAcidity: (acidity) => set({ acidity }),
  setSweetness: (sweetness) => set({ sweetness }),
  setBody: (body) => set({ body }),
  setBitterness: (bitterness) => set({ bitterness }),
  setBalance: (balance) => set({ balance }),
  setAftertaste: (aftertaste) => set({ aftertaste }),
  setFlavorNotes: (flavorNotes) => set({ flavorNotes }),
  setOverallImpression: (overallImpression) => set({ overallImpression }),
  setComments: (comments) => set({ comments }),
  
  // 플레이버 노트 관리
  addFlavorNote: (note) => set((state) => {
    const notes = state.flavorNotes ? state.flavorNotes.split(",").map(n => n.trim()) : [];
    if (!notes.includes(note)) {
      notes.push(note);
    }
    return { flavorNotes: notes.join(", ") };
  }),
  
  removeFlavorNote: (note) => set((state) => {
    const notes = state.flavorNotes.split(",").map(n => n.trim()).filter(n => n !== note);
    return { flavorNotes: notes.join(", ") };
  }),
  
  // 초기화
  reset: () => set(initialState),
})); 