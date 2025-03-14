'use client';

import { api } from './api-client';

/**
 * 사용자 로그인 함수 예제
 */
export async function loginUser(email: string, password: string) {
  return await api.post('/api/auth/login', { email, password }, {
    showSuccessToast: false,
    errorMessageOverride: {
      401: '이메일 또는 비밀번호가 올바르지 않습니다.',
      403: '계정이 잠겨 있습니다. 관리자에게 문의하세요.',
    },
  });
}

/**
 * 사용자 프로필 조회 함수 예제
 */
export async function getUserProfile(userId: string) {
  return await api.get(`/api/users/${userId}`, {
    showErrorToast: true,
    errorMessageOverride: {
      404: '사용자 프로필을 찾을 수 없습니다.',
    },
  });
}

/**
 * 레시피 생성 함수 예제
 */
export async function createRecipe(recipeData: any) {
  return await api.post('/api/recipes', recipeData, {
    showSuccessToast: true,
    successMessage: '레시피가 성공적으로 생성되었습니다!',
    errorMessageOverride: {
      400: '레시피 정보가 유효하지 않습니다. 필수 필드를 모두 입력해주세요.',
      401: '레시피를 생성하려면 로그인이 필요합니다.',
    },
  });
}

/**
 * 레시피 삭제 함수 예제
 */
export async function deleteRecipe(recipeId: string) {
  return await api.delete(`/api/recipes/${recipeId}`, {
    showSuccessToast: true,
    successMessage: '레시피가 성공적으로 삭제되었습니다.',
    errorMessageOverride: {
      403: '이 레시피를 삭제할 권한이 없습니다.',
      404: '삭제하려는 레시피를 찾을 수 없습니다.',
    },
  });
}

/**
 * 파일 업로드 함수 예제
 */
export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return await api.post('/api/upload', formData, {
    showSuccessToast: true,
    successMessage: '이미지가 성공적으로 업로드되었습니다.',
    errorMessageOverride: {
      400: '지원되지 않는 파일 형식입니다. JPG, PNG 또는 GIF 파일만 업로드할 수 있습니다.',
      413: '파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드할 수 있습니다.',
    },
  });
} 