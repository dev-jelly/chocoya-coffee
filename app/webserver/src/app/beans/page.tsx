import React from 'react';
import Link from 'next/link';
import { Bean, Plus, Search } from 'lucide-react';
import { getBeans } from '@/lib/actions/bean';
import { createClient } from '@/lib/supabase-server';
import { getOriginNameById } from '@/data/origins';
import { formatKoreanDate } from '@/lib/utils';

export const metadata = {
  title: '원두 라이브러리 | 초코야 커피',
  description: '다양한 원두 정보를 찾아보고, 나만의 원두 정보를 공유하세요',
};

export default async function BeansPage(props: any) {
  const searchParams = props.searchParams || {};

  // Supabase 클라이언트 생성
  const supabase = await createClient();

  // 사용자 정보 가져오기
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // 검색어 가져오기 - 객체 복사하여 사용
  const params = { ...searchParams };
  const search = params.search || '';

  // 원두 목록 가져오기
  const beans = await getBeans(search);

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center">
          <Bean className="mr-2" />
          원두 라이브러리
        </h1>

        {userId && (
          <Link
            href="/beans/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            원두 등록하기
          </Link>
        )}
      </div>

      {/* 검색바 */}
      <div className="mb-6">
        <form action="/beans" method="GET" className="flex gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="원두 이름, 원산지, 로스터리 등으로 검색"
              className="w-full p-3 pl-10 rounded-md border border-input bg-background"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            검색
          </button>
        </form>
      </div>

      {/* 원두 목록 */}
      {beans.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">등록된 원두가 없습니다</h2>
          <p className="text-muted-foreground mb-4">
            {search ? `'${search}' 검색 결과가 없습니다.` : '아직 등록된 원두 정보가 없습니다.'}
          </p>
          {userId && (
            <Link
              href="/beans/create"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              첫 번째 원두 등록하기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {beans.map((bean) => (
            <Link key={bean.id} href={`/beans/${bean.id}`} passHref>
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-card">
                <div className="p-4 md:p-6">
                  <h2 className="text-xl font-semibold mb-2 flex items-center">
                    <Bean className="mr-2 h-5 w-5" />
                    {bean.name}
                  </h2>

                  <div className="flex flex-col space-y-1 text-sm text-muted-foreground mb-4">
                    {bean.origin && <span>원산지: {getOriginNameById(bean.origin)}</span>}
                    {bean.roastLevel && <span>로스팅: {bean.roastLevel}</span>}
                    {bean.roaster && <span>로스터리: {bean.roaster}</span>}
                    {bean.process && <span>프로세스: {bean.process}</span>}
                  </div>

                  {bean.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {bean.description}
                    </p>
                  )}

                  <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                    <span>작성자: {bean.user?.name || '익명'}</span>
                    <div className="text-xs text-muted-foreground mt-2">
                      {formatKoreanDate(bean.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 