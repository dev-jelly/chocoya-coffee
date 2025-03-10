// @ts-ignore vitest 타입 에러 무시
import '@testing-library/jest-dom';
// @ts-ignore vitest 타입 에러 무시
import { expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// window.matchMedia 모킹 설정
beforeAll(() => {
  // matchMedia 모킹
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // localStorage 모킹
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

// 테스트 라이브러리의 매처 확장
// matchers가 올바르게 가져와지지 않아 예외 처리
try {
  // @ts-ignore
  expect.extend(require('@testing-library/jest-dom').matchers);
} catch (e) {
  console.error('Failed to extend matchers:', e);
}

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
}); 