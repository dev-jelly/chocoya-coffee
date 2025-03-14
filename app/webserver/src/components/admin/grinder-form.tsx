'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { createGrinder, updateGrinder } from '@/lib/actions/grinder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

const grinderSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, '이름을 입력해주세요'),
    name_ko: z.string().min(1, '한글 이름을 입력해주세요'),
    brand: z.string().min(1, '브랜드를 입력해주세요'),
    type: z.string().min(1, '타입을 선택해주세요'),
    burr: z.string().optional(),
    burrSize: z.string().optional(),
    adjustmentType: z.string().min(1, '조절 방식을 선택해주세요'),
    description: z.string().optional(),
    description_ko: z.string().optional(),
    imageUrl: z.string().optional(),
    settings: z.array(
        z.object({
            id: z.string().optional(),
            name: z.string().min(1, '설정 이름을 입력해주세요'),
            name_ko: z.string().min(1, '설정 한글 이름을 입력해주세요'),
            value: z.string().min(1, '설정 값을 입력해주세요'),
            brewingMethod: z.string().min(1, '브루잉 방식을 선택해주세요'),
            description: z.string().optional(),
            description_ko: z.string().optional(),
        })
    ).optional(),
});

type GrinderFormData = z.infer<typeof grinderSchema>;

type GrinderFormProps = {
    grinder?: any;
};

export function GrinderForm({ grinder }: GrinderFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);

    const defaultValues: GrinderFormData = grinder ? {
        id: grinder.id,
        name: grinder.name || '',
        name_ko: grinder.name_ko || '',
        brand: grinder.brand || '',
        type: grinder.type || '',
        burr: grinder.burr || '',
        burrSize: grinder.burrSize || '',
        adjustmentType: grinder.adjustmentType || '',
        description: grinder.description || '',
        description_ko: grinder.description_ko || '',
        imageUrl: grinder.imageUrl || '',
        settings: grinder.settings?.map((setting: any) => ({
            id: setting.id,
            name: setting.name,
            name_ko: setting.name_ko || '',
            value: setting.value,
            brewingMethod: setting.brewingMethod,
            description: setting.description || '',
            description_ko: setting.description_ko || '',
        })) || [],
    } : {
        name: '',
        name_ko: '',
        brand: '',
        type: '',
        burr: '',
        burrSize: '',
        adjustmentType: '',
        description: '',
        description_ko: '',
        imageUrl: '',
        settings: [],
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<GrinderFormData>({
        resolver: zodResolver(grinderSchema),
        defaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'settings',
    });

    const onSubmit = async (data: GrinderFormData) => {
        setSubmitting(true);
        try {
            // 설정 값이 배열이지만 비어있으면 빈 배열로 설정
            const formData = {
                ...data,
                settings: data.settings || [],
            };

            // ID가 있으면 업데이트, 없으면 생성
            const result = grinder?.id
                ? await updateGrinder(grinder.id, formData)
                : await createGrinder(formData);

            if (result.success) {
                toast({
                    title: '성공',
                    description: grinder ? '그라인더가 수정되었습니다.' : '새 그라인더가 추가되었습니다.',
                });
                router.push('/admin/grinders');
            } else {
                toast({
                    title: '오류',
                    description: result.error || '작업 중 오류가 발생했습니다.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast({
                title: '오류',
                description: '요청 처리 중 오류가 발생했습니다.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 기본 정보 */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">기본 정보</h2>

                    <div className="space-y-2">
                        <Label htmlFor="name">이름 (영문)</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            error={errors.name?.message}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name_ko">이름 (한글)</Label>
                        <Input
                            id="name_ko"
                            {...register('name_ko')}
                            error={errors.name_ko?.message}
                        />
                        {errors.name_ko && <p className="text-sm text-red-500">{errors.name_ko.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand">브랜드</Label>
                        <Input
                            id="brand"
                            {...register('brand')}
                            error={errors.brand?.message}
                        />
                        {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">타입</Label>
                        <Select
                            {...register('type')}
                            defaultValue={defaultValues.type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="타입 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manual">수동</SelectItem>
                                <SelectItem value="electric">전동</SelectItem>
                                <SelectItem value="commercial">상업용</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="adjustmentType">조절 방식</Label>
                        <Select
                            {...register('adjustmentType')}
                            defaultValue={defaultValues.adjustmentType}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="조절 방식 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="stepped">스텝형</SelectItem>
                                <SelectItem value="stepless">무단계형</SelectItem>
                                <SelectItem value="hybrid">하이브리드</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.adjustmentType && <p className="text-sm text-red-500">{errors.adjustmentType.message}</p>}
                    </div>
                </div>

                {/* 추가 정보 */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">추가 정보</h2>

                    <div className="space-y-2">
                        <Label htmlFor="burr">날 종류</Label>
                        <Input
                            id="burr"
                            {...register('burr')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="burrSize">날 크기</Label>
                        <Input
                            id="burrSize"
                            {...register('burrSize')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">이미지 URL</Label>
                        <Input
                            id="imageUrl"
                            {...register('imageUrl')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">설명 (영문)</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description_ko">설명 (한글)</Label>
                        <Textarea
                            id="description_ko"
                            {...register('description_ko')}
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* 그라인더 설정 */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">그라인더 설정</h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({
                            name: '',
                            name_ko: '',
                            value: '',
                            brewingMethod: '',
                            description: '',
                            description_ko: '',
                        })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        설정 추가
                    </Button>
                </div>

                {fields.length === 0 && (
                    <p className="text-sm text-muted-foreground">그라인더 설정을 추가하세요.</p>
                )}

                {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`settings.${index}.name`}>설정 이름 (영문)</Label>
                                    <Input
                                        id={`settings.${index}.name`}
                                        {...register(`settings.${index}.name` as const)}
                                        error={errors.settings?.[index]?.name?.message}
                                    />
                                    {errors.settings?.[index]?.name && (
                                        <p className="text-sm text-red-500">{errors.settings[index]?.name?.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`settings.${index}.name_ko`}>설정 이름 (한글)</Label>
                                    <Input
                                        id={`settings.${index}.name_ko`}
                                        {...register(`settings.${index}.name_ko` as const)}
                                        error={errors.settings?.[index]?.name_ko?.message}
                                    />
                                    {errors.settings?.[index]?.name_ko && (
                                        <p className="text-sm text-red-500">{errors.settings[index]?.name_ko?.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`settings.${index}.value`}>설정 값</Label>
                                    <Input
                                        id={`settings.${index}.value`}
                                        {...register(`settings.${index}.value` as const)}
                                        error={errors.settings?.[index]?.value?.message}
                                    />
                                    {errors.settings?.[index]?.value && (
                                        <p className="text-sm text-red-500">{errors.settings[index]?.value?.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`settings.${index}.brewingMethod`}>브루잉 방식</Label>
                                    <Select
                                        {...register(`settings.${index}.brewingMethod` as const)}
                                        defaultValue={field.brewingMethod}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="브루잉 방식 선택" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="푸어오버">푸어오버</SelectItem>
                                            <SelectItem value="에스프레소">에스프레소</SelectItem>
                                            <SelectItem value="프렌치프레스">프렌치프레스</SelectItem>
                                            <SelectItem value="에어로프레스">에어로프레스</SelectItem>
                                            <SelectItem value="모카포트">모카포트</SelectItem>
                                            <SelectItem value="콜드브루">콜드브루</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.settings?.[index]?.brewingMethod && (
                                        <p className="text-sm text-red-500">{errors.settings[index]?.brewingMethod?.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`settings.${index}.description`}>설명 (영문)</Label>
                                    <Textarea
                                        id={`settings.${index}.description`}
                                        {...register(`settings.${index}.description` as const)}
                                        rows={2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`settings.${index}.description_ko`}>설명 (한글)</Label>
                                    <Textarea
                                        id={`settings.${index}.description_ko`}
                                        {...register(`settings.${index}.description_ko` as const)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                삭제
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/grinders')}
                >
                    취소
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {grinder ? '수정하기' : '추가하기'}
                </Button>
            </div>
        </form>
    );
} 