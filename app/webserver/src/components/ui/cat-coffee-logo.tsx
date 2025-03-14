import React from 'react';

interface CatCoffeeLogoProps {
  className?: string;
  size?: number;
}

export function CatCoffeeLogo({ className, size = 24 }: CatCoffeeLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 커피 컵 */}
      <path d="M30 40L35 80H65L70 40" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
      
      {/* 커피 표면 */}
      <path d="M35 50H65" stroke="currentColor" strokeWidth="1.5" />
      
      {/* 고양이 꼬리 손잡이 */}
      <path d="M70 50C75 50 82 45 85 50C88 55 82 65 85 70" stroke="currentColor" strokeWidth="2" />
      
      {/* 커피 스팀 */}
      <path d="M45 35C45 30 40 30 40 25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M55 35C55 30 60 30 60 25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
} 