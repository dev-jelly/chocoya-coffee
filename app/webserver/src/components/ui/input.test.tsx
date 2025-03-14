// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi } from 'vitest';
// @ts-ignore testing-library 타입 에러 무시
import { render, screen } from '../../test/utils';
import { Input } from './input';

describe('Input 컴포넌트', () => {
  it('기본 입력 필드가 렌더링되어야 합니다', () => {
    render(<Input data-testid="test-input" />);
    const input = screen.getByTestId('test-input');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('placeholder가 올바르게 표시되어야 합니다', () => {
    render(<Input placeholder="이메일 입력" />);
    expect(screen.getByPlaceholderText('이메일 입력')).toBeInTheDocument();
  });

  it('value가 올바르게 설정되어야 합니다', () => {
    render(<Input value="test@example.com" readOnly />);
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('disabled 속성이 올바르게, 적용되어야 합니다', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('필수 속성이 올바르게 적용되어야 합니다', () => {
    render(<Input required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('type 속성이 올바르게 적용되어야 합니다', () => {
    render(<Input type="password" data-testid="password-input" />);
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');
  });

  it('onChange 이벤트가 호출되어야 합니다', async () => {
    const handleChange = vi.fn();
    const { user } = render(<Input onChange={handleChange} data-testid="test-input" />);
    
    const input = screen.getByTestId('test-input');
    await user.type(input, 'hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // 각 문자마다 한 번씩 호출
  });

  it('커스텀 클래스가 적용되어야 합니다', () => {
    render(<Input className="custom-class" data-testid="test-input" />);
    expect(screen.getByTestId('test-input')).toHaveClass('custom-class');
  });
}); 