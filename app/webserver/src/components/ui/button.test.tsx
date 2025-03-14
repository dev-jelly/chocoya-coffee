// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi } from 'vitest';
// @ts-ignore testing-library 타입 에러 무시
import { render, screen } from '../../test/utils';
import { Button } from './button';

describe('Button 컴포넌트', () => {
  it('버튼이 올바르게 렌더링되어야 합니다', () => {
    render(<Button>테스트 버튼</Button>);
    expect(screen.getByRole('button', { name: '테스트 버튼' })).toBeInTheDocument();
  });

  it('버튼에 클래스가 올바르게 적용되어야 합니다', () => {
    render(<Button variant="destructive">위험 버튼</Button>);
    const button = screen.getByRole('button', { name: '위험 버튼' });
    expect(button).toHaveClass('bg-destructive');
  });

  it('버튼이 비활성화되면 disabled 속성이 적용되어야 합니다', () => {
    render(<Button disabled>비활성화 버튼</Button>);
    expect(screen.getByRole('button', { name: '비활성화 버튼' })).toBeDisabled();
  });

  it('버튼 크기가 올바르게 적용되어야 합니다', () => {
    render(<Button size="lg">큰 버튼</Button>);
    const button = screen.getByRole('button', { name: '큰 버튼' });
    expect(button).toHaveClass('h-11');
  });

  it('onClick 핸들러가 호출되어야 합니다', async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>클릭 버튼</Button>);
    
    await user.click(screen.getByRole('button', { name: '클릭 버튼' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 