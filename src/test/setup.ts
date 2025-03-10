// @ts-ignore vitest 타입 에러 무시
import '@testing-library/jest-dom';
// @ts-ignore vitest 타입 에러 무시
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// @ts-ignore jest-dom 타입 에러 무시
import matchers from '@testing-library/jest-dom/matchers';

// 테스트 라이브러리의 매처 확장
expect.extend(matchers);

// 각 테스트 후 정리
afterEach(() => {
  cleanup();
}); 