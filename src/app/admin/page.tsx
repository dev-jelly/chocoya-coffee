'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart3, Coffee, Database, RefreshCw, Settings, Edit, List, PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // 로딩 중이거나 인증되지 않은 경우
    if (status === 'loading') {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    if (status === 'unauthenticated' || !session) {
        router.push('/auth/signin');
        return null;
    }

    // 관리자 계정인지 확인 (간단한 검증)
    const isAdmin = session?.user?.email === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@chocoya.coffee');

    if (!isAdmin) {
        return (
            <div className="container px-4 py-10">
                <Alert variant="destructive">
                    <AlertTitle>접근 권한 없음</AlertTitle>
                    <AlertDescription>
                        관리자만 접근할 수 있는 페이지입니다.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // 그라인더 데이터 시드 함수
    const seedGrinders = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/grinders/seed');
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || '그라인더 데이터가 성공적으로 추가되었습니다.');
            } else {
                setError(data.error || '그라인더 데이터 추가 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 새 그라인더 데이터 추가 함수
    const addNewGrinders = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/grinders/add-new');
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || '새 그라인더 데이터가 성공적으로 추가되었습니다.');
            } else {
                setError(data.error || '새 그라인더 데이터 추가 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 1Zpresso 그라인더 데이터 추가 함수
    const add1ZpressoGrinders = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/grinders/add-1zpresso');
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || '1Zpresso 그라인더 데이터가 성공적으로 추가되었습니다.');
            } else {
                setError(data.error || '1Zpresso 그라인더 데이터 추가 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 말코닉 그라인더 데이터 업데이트 함수
    const updateMahlkonigGrinders = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/grinders/update-mahlkonig');
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || '말코닉 그라인더 데이터가 성공적으로 업데이트되었습니다.');
            } else {
                setError(data.error || '말코닉 그라인더 데이터 업데이트 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 코만단테 그라인더 데이터 업데이트 함수
    const updateComandanteGrinders = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const response = await fetch('/api/grinders/update-comandante');
            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || '코만단테 그라인더 데이터가 성공적으로 업데이트되었습니다.');
            } else {
                setError(data.error || '코만단테 그라인더 데이터 업데이트 중 오류가 발생했습니다.');
            }
        } catch (err) {
            setError('요청 처리 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container px-4 py-10">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Settings className="mr-2" /> 관리자 대시보드
            </h1>

            <Tabs defaultValue="data">
                <TabsList className="mb-4">
                    <TabsTrigger value="data">데이터 관리</TabsTrigger>
                    <TabsTrigger value="stats">통계</TabsTrigger>
                </TabsList>

                <TabsContent value="data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Coffee className="mr-2" /> 그라인더 데이터
                                </CardTitle>
                                <CardDescription>
                                    그라인더 기본 데이터를 데이터베이스에 추가합니다.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-4">
                                    주요 그라인더 정보와 설정 값을 데이터베이스에 추가합니다. 이미 그라인더 데이터가 있는 경우 중복 추가되지 않습니다.
                                </p>
                                {message && (
                                    <Alert className="mb-4">
                                        <AlertTitle>알림</AlertTitle>
                                        <AlertDescription>{message}</AlertDescription>
                                    </Alert>
                                )}
                                {error && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertTitle>오류</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-2">
                                <Button
                                    onClick={seedGrinders}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <Database className="mr-2 h-4 w-4" />
                                            그라인더 데이터 추가
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={addNewGrinders}
                                    disabled={loading}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            새 그라인더 데이터 추가
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={add1ZpressoGrinders}
                                    disabled={loading}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            1Zpresso 그라인더 추가
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={updateMahlkonigGrinders}
                                    disabled={loading}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="mr-2 h-4 w-4" />
                                            말코닉 그라인더 업데이트
                                        </>
                                    )}
                                </Button>
                                <Button
                                    onClick={updateComandanteGrinders}
                                    disabled={loading}
                                    className="w-full"
                                    variant="secondary"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            처리 중...
                                        </>
                                    ) : (
                                        <>
                                            <Edit className="mr-2 h-4 w-4" />
                                            코만단테 그라인더 업데이트
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link href="/admin/grinders">
                                        <Edit className="mr-2 h-4 w-4" />
                                        그라인더 관리
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BarChart3 className="mr-2" /> 시스템 상태
                                </CardTitle>
                                <CardDescription>
                                    시스템 정보 및 데이터베이스 상태
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm mb-2">
                                    현재 버전: <span className="font-semibold">1.0.0</span>
                                </p>
                                <p className="text-sm mb-2">
                                    데이터베이스: <span className="font-semibold text-green-500">연결됨</span>
                                </p>
                                <p className="text-sm">
                                    마지막 업데이트: <span className="font-semibold">{new Date().toLocaleDateString('ko-KR')}</span>
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="stats">
                    <Card>
                        <CardHeader>
                            <CardTitle>통계</CardTitle>
                            <CardDescription>
                                시스템 사용 통계 정보
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                통계 정보는 현재 준비 중입니다.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 