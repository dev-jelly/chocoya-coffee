'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// 비밀번호 변경 스키마
const passwordSchema = z.object({
    currentPassword: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    newPassword: z
        .string()
        .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
        .regex(
            /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
            '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다'
        ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordChangeFormProps {
    userId: string;
    userEmail?: string | null;
}

export default function PasswordChangeForm({ userId, userEmail }: PasswordChangeFormProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (formData: PasswordFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/auth/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('비밀번호가 성공적으로 변경되었습니다');
                reset();
            } else {
                toast.error(data.error || '비밀번호 변경 중 오류가 발생했습니다');
            }
        } catch (error) {
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
            console.error('비밀번호 변경 오류:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <Lock className="mr-2 text-primary" size={20} />
                <h2 className="text-xl font-semibold">비밀번호 변경</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                        현재 비밀번호
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            id="currentPassword"
                            {...register('currentPassword')}
                            className="w-full p-3 rounded-md border border-input bg-background pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-destructive text-xs mt-1">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                        새 비밀번호
                    </label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            {...register('newPassword')}
                            className="w-full p-3 rounded-md border border-input bg-background pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        비밀번호는 최소 8자 이상, 영문/숫자/특수문자를 포함해야 합니다.
                    </p>
                    {errors.newPassword && (
                        <p className="text-destructive text-xs mt-1">{errors.newPassword.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                        새 비밀번호 확인
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            className="w-full p-3 rounded-md border border-input bg-background pr-10"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </div>
            </form>
        </div>
    );
} 