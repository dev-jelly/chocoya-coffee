import { create } from "zustand";
import { recipeStepSchema } from "../validations/recipe";
import { z } from "zod";

// 레시피 단계 타입
type RecipeStep = z.infer<typeof recipeStepSchema>;

// 레시피 생성 스토어 상태 타입
interface RecipeFormState {
  // 기본 정보
  title: string;
  description: string;
  isPublic: boolean;
  coffeeType: string;
  roastLevel: string;
  grindSize: string;
  waterTemp: number | null;
  
  // 단계
  steps: RecipeStep[];
  
  // 액션
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIsPublic: (isPublic: boolean) => void;
  setCoffeeType: (coffeeType: string) => void;
  setRoastLevel: (roastLevel: string) => void;
  setGrindSize: (grindSize: string) => void;
  setWaterTemp: (waterTemp: number | null) => void;
  
  addStep: (step: RecipeStep) => void;
  updateStep: (index: number, step: Partial<RecipeStep>) => void;
  removeStep: (index: number) => void;
  reorderSteps: () => void;
  
  reset: () => void;
}

// 초기 상태
const initialState = {
  title: "",
  description: "",
  isPublic: false,
  coffeeType: "",
  roastLevel: "",
  grindSize: "",
  waterTemp: null,
  steps: [],
};

// 레시피 생성 스토어
export const useRecipeFormStore = create<RecipeFormState>((set) => ({
  ...initialState,
  
  // 기본 정보 설정 액션
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setIsPublic: (isPublic) => set({ isPublic }),
  setCoffeeType: (coffeeType) => set({ coffeeType }),
  setRoastLevel: (roastLevel) => set({ roastLevel }),
  setGrindSize: (grindSize) => set({ grindSize }),
  setWaterTemp: (waterTemp) => set({ waterTemp }),
  
  // 단계 관련 액션
  addStep: (step) => set((state) => ({ 
    steps: [...state.steps, { ...step, order: state.steps.length + 1 }] 
  })),
  
  updateStep: (index, updatedStep) => set((state) => ({
    steps: state.steps.map((step, i) => 
      i === index ? { ...step, ...updatedStep } : step
    )
  })),
  
  removeStep: (index) => set((state) => ({
    steps: state.steps.filter((_, i) => i !== index)
  })),
  
  reorderSteps: () => set((state) => ({
    steps: state.steps.map((step, index) => ({
      ...step,
      order: index + 1
    }))
  })),
  
  // 초기화
  reset: () => set(initialState),
})); 