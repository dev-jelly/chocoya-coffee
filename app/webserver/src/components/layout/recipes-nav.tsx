"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Coffee, Droplet, Beaker, Thermometer, Leaf } from 'lucide-react';

export function RecipesNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentMethod = searchParams.get('method');

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const isActive = (method: string | null) => {
    return currentMethod === method;
  };

  return (
    <div className="mb-6 md:mb-8">
      <nav className="flex flex-wrap gap-2 md:gap-3">
        <Link
          href="/recipes"
          className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-md flex items-center transition-colors ${!currentMethod
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
            }`}
        >
          <Coffee size={16} className="mr-1.5" />
          전체
        </Link>
        <Link
          href={`/recipes?${createQueryString('method', 'pourOver')}`}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-md flex items-center transition-colors ${isActive('pourOver')
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
            }`}
        >
          <Droplet size={16} className="mr-1.5" />
          푸어오버
        </Link>
        <Link
          href={`/recipes?${createQueryString('method', 'aeropress')}`}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-md flex items-center transition-colors ${isActive('aeropress')
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
            }`}
        >
          <Beaker size={16} className="mr-1.5" />
          에어로프레스
        </Link>
        <Link
          href={`/recipes?${createQueryString('method', 'frenchPress')}`}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-md flex items-center transition-colors ${isActive('frenchPress')
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
            }`}
        >
          <Thermometer size={16} className="mr-1.5" />
          프렌치프레스
        </Link>
        <Link
          href={`/recipes?${createQueryString('method', 'coldBrew')}`}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-sm rounded-md flex items-center transition-colors ${isActive('coldBrew')
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
            }`}
        >
          <Leaf size={16} className="mr-1.5" />
          콜드브루
        </Link>
      </nav>
    </div>
  );
} 