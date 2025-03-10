// @ts-ignore React 타입 에러 무시
import React, { ReactElement } from 'react';
// @ts-ignore testing-library 타입 에러 무시
import { render, RenderOptions } from '@testing-library/react';
// @ts-ignore user-event 타입 에러 무시
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';

// 테스트에 필요한 프로바이더들을 포함하는 래퍼
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};

// 커스텀 렌더 함수
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
};

// 테스트 유틸리티 함수들 재내보내기
// @ts-ignore testing-library export 에러 무시
export * from '@testing-library/react';
export { customRender as render, screen } from '@testing-library/react'; 