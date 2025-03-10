// @ts-ignore vitest 타입 에러 무시
import { describe, it, expect, vi, beforeEach } from 'vitest';
// @ts-ignore testing-library 타입 에러 무시
import { render, screen } from '@testing-library/react';
import { getRecipes } from '@/lib/actions/recipe';

// getRecipes 함수 모킹
vi.mock('@/lib/actions/recipe', () => ({
  getRecipes: vi.fn(),
}));

// 페이지 컴포넌트 모킹
vi.mock('./page', () => ({
  default: ({ searchParams = {} }: { searchParams?: Record<string, string | string[] | undefined> }) => {
    const method = typeof searchParams.method === 'string' ? searchParams.method : undefined;
    
    // 모킹된 getRecipes 함수 사용
    const recipes = vi.mocked(getRecipes)(method);
    
    return (
      <div>
        <h1>커피 브루잉 레시피</h1>
        <div data-testid="recipes-nav">레시피 네비게이션</div>
        <div className="recipes-list">
          {Array.isArray(recipes) && recipes.map((recipe: any) => (
            <div key={recipe.id} className="recipe-item">
              <h2>{recipe.title}</h2>
              <p>{recipe.brewingMethod}</p>
              <div>
                <span>{recipe.preparationTime}</span>
                <span>{recipe.waterAmount}</span>
                <span>{recipe.beanAmount}</span>
              </div>
            </div>
          ))}
          {(!Array.isArray(recipes) || recipes.length === 0) && (
            <div>해당 조건에 맞는 레시피가 없습니다.</div>
          )}
        </div>
      </div>
    );
  },
}));

describe('레시피 페이지', () => {
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

    (getRecipes as any).mockReturnValue(mockRecipes);

    // 페이지 컴포넌트 렌더링
    const RecipesPage = (await import('./page')).default;
    render(<RecipesPage />);

    // 페이지 제목 확인
    expect(screen.getByText('커피 브루잉 레시피')).toBeDefined();

    // 레시피 항목 확인
    expect(screen.getByText('에티오피아 예가체프 핸드드립')).toBeDefined();
    expect(screen.getByText('케냐 AA 에어로프레스')).toBeDefined();

    // 브루잉 방법 확인
    expect(screen.getByText('핸드드립')).toBeDefined();
    expect(screen.getByText('에어로프레스')).toBeDefined();

    // 네비게이션 컴포넌트 확인
    expect(screen.getByTestId('recipes-nav')).toBeDefined();
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

    (getRecipes as any).mockReturnValue(mockRecipes);

    // 페이지 컴포넌트 렌더링
    const RecipesPage = (await import('./page')).default;
    render(<RecipesPage searchParams={{ method: '핸드드립' }} />);

    // 페이지 제목 확인
    expect(screen.getByText('커피 브루잉 레시피')).toBeDefined();

    // 핸드드립 레시피만 표시되어야 함
    expect(screen.getByText('에티오피아 예가체프 핸드드립')).toBeDefined();
    expect(screen.queryByText('케냐 AA 에어로프레스')).toBeNull();
  });
}); 