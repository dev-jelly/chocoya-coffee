import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Bean, MapPin, Mountain, Building, Droplets,
  Coffee, Calendar, Pencil, Trash2
} from 'lucide-react';
import { getBeanById } from '@/lib/actions/bean';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DeleteBeanButton from '@/components/bean/delete-bean-button';
import { getOriginNameById } from '@/data/origins';

export default async function BeanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 원두 상세 정보 가져오기
  const bean = await getBeanById(params.id);

  if (!bean) {
    notFound();
  }

  // 세션에서 사용자 정보 가져오기
  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.id === bean.userId;

  return (
    <div className="container px-4 md:px-6 py-6 md:py-10">
      <Link
        href="/beans"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 md:mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> 원두 목록으로 돌아가기
      </Link>

      <div className="bg-card border rounded-lg p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
            <Bean className="mr-2" /> {bean.name}
          </h1>

          {isOwner && (
            <div className="flex space-x-2">
              <Link
                href={`/beans/${bean.id}/edit`}
                className="p-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
              >
                <Pencil size={16} />
              </Link>
              <DeleteBeanButton beanId={bean.id} userId={session.user.id} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">원두 정보</h2>
            <div className="space-y-2">
              {bean.origin && (
                <div className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">원산지</p>
                    <p className="text-muted-foreground">{getOriginNameById(bean.origin)}</p>
                  </div>
                </div>
              )}

              {bean.region && (
                <div className="flex items-start">
                  <MapPin size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">지역</p>
                    <p className="text-muted-foreground">{bean.region}</p>
                  </div>
                </div>
              )}

              {bean.farm && (
                <div className="flex items-start">
                  <Building size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">농장</p>
                    <p className="text-muted-foreground">{bean.farm}</p>
                  </div>
                </div>
              )}

              {bean.altitude && (
                <div className="flex items-start">
                  <Mountain size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">고도</p>
                    <p className="text-muted-foreground">{bean.altitude}</p>
                  </div>
                </div>
              )}

              {bean.variety && (
                <div className="flex items-start">
                  <Coffee size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">품종</p>
                    <p className="text-muted-foreground">{bean.variety}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">가공 정보</h2>
            <div className="space-y-2">
              {bean.process && (
                <div className="flex items-start">
                  <Droplets size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">프로세스</p>
                    <p className="text-muted-foreground">{bean.process}</p>
                  </div>
                </div>
              )}

              {bean.roastLevel && (
                <div className="flex items-start">
                  <Coffee size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">로스팅 단계</p>
                    <p className="text-muted-foreground">{bean.roastLevel}</p>
                  </div>
                </div>
              )}

              {bean.roaster && (
                <div className="flex items-start">
                  <Building size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">로스터리</p>
                    <p className="text-muted-foreground">{bean.roaster}</p>
                  </div>
                </div>
              )}

              {bean.roastDate && (
                <div className="flex items-start">
                  <Calendar size={18} className="mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">로스팅 날짜</p>
                    <p className="text-muted-foreground">
                      {new Date(bean.roastDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {bean.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">설명</h2>
            <p className="text-muted-foreground whitespace-pre-line">{bean.description}</p>
          </div>
        )}

        {/* 관련 레시피 */}
        {bean.recipes && bean.recipes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">이 원두를 사용한 레시피</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bean.recipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.id}`} passHref>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <h3 className="font-medium">{recipe.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{recipe.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      작성자: {recipe.user?.name || '익명'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {bean.recipes.length > 5 && (
              <div className="mt-4 text-center">
                <Link href={`/recipes?bean=${bean.id}`} className="text-primary hover:underline">
                  더 많은 레시피 보기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 관련 맛 노트 */}
        {bean.tasteNotes && bean.tasteNotes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">이 원두의 맛 노트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bean.tasteNotes.map((note) => (
                <Link key={note.id} href={`/taste-notes/${note.id}`} passHref>
                  <div
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    style={{
                      borderLeft: note.primaryColor ? `4px solid ${note.primaryColor}` : undefined
                    }}
                  >
                    <h3 className="font-medium">{note.brewingMethod}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>산미: {note.acidity}/10</span>
                      <span className="mx-2">•</span>
                      <span>단맛: {note.sweetness}/10</span>
                      <span className="mx-2">•</span>
                      <span>바디: {note.body}/10</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      작성자: {note.user?.name || '익명'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {bean.tasteNotes.length > 5 && (
              <div className="mt-4 text-center">
                <Link href={`/taste-notes?bean=${bean.id}`} className="text-primary hover:underline">
                  더 많은 맛 노트 보기
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 