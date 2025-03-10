// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi, beforeEach } from 'vitest';
// @ts-ignore testing-library 타입 에러 무시
import { render, screen } from '@testing-library/react';
import RecipesPage from './page';
import { getRecipes } from '@/lib/actions/recipe';

// getRecipes 함수 모킹
vi.mock('@/lib/actions/recipe', () => ({
  getRecipes: vi.fn(),
}));

// Next.js 컴포넌트 모킹
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('lucide-react', () => ({
  Coffee: () => <span data-testid="coffee-icon" />,
  Clock: () => <span data-testid="clock-icon" />,
  Droplet: () => <span data-testid="droplet-icon" />,
  Scale: () => <span data-testid="scale-icon" />,
}));

vi.mock('@/components/layout/recipes-nav', () => ({
  RecipesNav: () => <div data-testid="recipes-nav">레시피 네비게이션</div>,
}));

describe('RecipesPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('레시피 목록을 렌더링해야 합니다', async () => {
    const mockRecipes = [
      {
        id: '1',
        title: '에티오피아 예가체프 핸드드립',
        brewingMethod: '핸드드립',
        preparationTime: 10,
        waterAmount: 250,
        beanAmount: 15,
        difficulty: '중급',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1',
      },
      {
        id: '2',
        title: '케냐 AA 에어로프레스',
        brewingMethod: '에어로프레스',
        preparationTime: 5,
        waterAmount: 200,
        beanAmount: 18,
        difficulty: '초급',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user2',
      },
    ];

    (getRecipes as any).mockResolvedValue(mockRecipes);

    const Component = () => <RecipesPage />;
    render(<Component />);

    // 페이지 제목 확인
    expect(await screen.findByText('커피 브루잉 레시피')).toBeInTheDocument();

    // 레시피 항목 확인
    expect(await screen.findByText('에티오피아 예가체프 핸드드립')).toBeInTheDocument();
    expect(await screen.findByText('케냐 AA 에어로프레스')).toBeInTheDocument();

    // 브루잉 방법 확인
    expect(await screen.findByText('핸드드립')).toBeInTheDocument();
    expect(await screen.findByText('에어로프레스')).toBeInTheDocument();

    // 네비게이션 컴포넌트 확인
    expect(screen.getByTestId('recipes-nav')).toBeInTheDocument();
  });

  it('필터링된 레시피 목록을 렌더링해야 합니다', async () => {
    const mockRecipes = [
      {
        id: '1',
        title: '에티오피아 예가체프 핸드드립',
        brewingMethod: '핸드드립',
        preparationTime: 10,
        waterAmount: 250,
        beanAmount: 15,
        difficulty: '중급',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1',
      },
    ];

    (getRecipes as any).mockResolvedValue(mockRecipes);

    const Component = () => <RecipesPage searchParams={{ method: '핸드드립' }} />;
    render(<Component />);

    // 페이지 제목 확인
    expect(await screen.findByText('커피 브루잉 레시피')).toBeInTheDocument();

    // 핸드드립 레시피만 표시되어야 함
    expect(await screen.findByText('에티오피아 예가체프 핸드드립')).toBeInTheDocument();
    expect(screen.queryByText('케냐 AA 에어로프레스')).not.toBeInTheDocument();
  });
}); 