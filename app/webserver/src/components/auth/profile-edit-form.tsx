'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// 프로필 수정 스키마
const profileSchema = z.object({
    name: z.string().min(1, '이름을 입력해주세요'),
    email: z.string().email('유효한 이메일 주소를 입력해주세요'),
    bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfile {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
}

interface ProfileEditFormProps {
    user: UserProfile;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(user.image);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name || '',
            email: user.email || '',
            bio: user.bio || '',
        },
    });

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 파일 크기 제한 (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('이미지 크기는 2MB 이하여야 합니다');
            return;
        }

        // 파일 유형 확인
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 업로드 가능합니다');
            return;
        }

        // 이미지 미리보기
        const reader = new FileReader();
        reader.onload = (event) => {
            setProfileImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsSubmitting(true);

        try {
            // FormData 생성
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('bio', data.bio || '');

            // 파일이 선택되었다면 추가
            if (fileInputRef.current?.files?.[0]) {
                formData.append('profileImage', fileInputRef.current.files[0]);
            }

            // API 호출
            const response = await fetch(`/api/users/${user.id}/profile`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                toast.success('프로필이 성공적으로 업데이트되었습니다');
                router.push('/auth/profile');
                router.refresh();
            } else {
                const data = await response.json();
                toast.error(data.error || '프로필 업데이트 중 오류가 발생했습니다');
            }
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
                {/* 프로필 사진 업로드 */}
                <div>
                    <label className="block text-sm font-medium mb-2">프로필 사진</label>
                    <div className="flex items-center gap-4">
                        <div
                            className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer"
                            onClick={handleImageClick}
                        >
                            {profileImage ? (
                                <Image
                                    src={profileImage}
                                    alt="프로필 이미지"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User size={40} className="text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/gif"
                                className="hidden"
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm cursor-pointer"
                                onClick={handleImageClick}
                            >
                                사진 업로드
                            </button>
                            <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG 파일. 최대 크기 2MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 이름 */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">이름</label>
                    <input
                        type="text"
                        id="name"
                        {...register('name')}
                        className="w-full p-3 rounded-md border border-input bg-background"
                    />
                    {errors.name && (
                        <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* 이메일 */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">이메일</label>
                    <input
                        type="email"
                        id="email"
                        {...register('email')}
                        className="w-full p-3 rounded-md border border-input bg-background"
                    />
                    {errors.email && (
                        <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* 자기소개 */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">자기소개</label>
                    <textarea
                        id="bio"
                        {...register('bio')}
                        rows={4}
                        className="w-full p-3 rounded-md border border-input bg-background resize-none"
                    />
                </div>

                {/* 버튼 그룹 */}
                <div className="flex justify-end gap-3 pt-4">
                    <Link
                        href="/auth/profile"
                        className="px-4 py-2 border border-input rounded-md hover:bg-accent transition-colors cursor-pointer"
                    >
                        취소
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSubmitting ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>
        </form>
    );
} 