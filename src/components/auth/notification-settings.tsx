'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettingsProps {
    userId: string;
}

interface NotificationPreferences {
    emailNotifications: boolean;
    newRecipeNotifications: boolean;
    marketingNotifications: boolean;
    securityNotifications: boolean;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        emailNotifications: true,
        newRecipeNotifications: true,
        marketingNotifications: false,
        securityNotifications: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 사용자의 알림 설정 불러오기
    useEffect(() => {
        const fetchNotificationPreferences = async () => {
            try {
                const response = await fetch(`/api/users/${userId}/notifications`);

                if (response.ok) {
                    const data = await response.json();
                    setPreferences(data.preferences || {
                        emailNotifications: true,
                        newRecipeNotifications: true,
                        marketingNotifications: false,
                        securityNotifications: true,
                    });
                }
            } catch (error) {
                console.error('알림 설정 불러오기 오류:', error);
                // 오류 발생 시 기본값 사용
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotificationPreferences();
    }, [userId]);

    // 체크박스 상태 변경 처리
    const handleCheckboxChange = (setting: keyof NotificationPreferences) => {
        setPreferences((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }));
    };

    // 설정 저장
    const saveSettings = async () => {
        setIsSaving(true);

        try {
            const response = await fetch(`/api/users/${userId}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ preferences }),
            });

            if (response.ok) {
                toast.success('알림 설정이 저장되었습니다');
            } else {
                const data = await response.json();
                toast.error(data.error || '알림 설정 저장 중 오류가 발생했습니다');
            }
        } catch (error) {
            console.error('알림 설정 저장 오류:', error);
            toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                    <Bell className="mr-2 text-primary" size={20} />
                    <h2 className="text-xl font-semibold">알림 설정</h2>
                </div>
                <div className="flex justify-center p-4">
                    <span className="text-muted-foreground">로딩 중...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <Bell className="mr-2 text-primary" size={20} />
                <h2 className="text-xl font-semibold">알림 설정</h2>
            </div>

            <div className="space-y-3">
                <label className="flex items-center justify-between">
                    <span>이메일 알림</span>
                    <input
                        type="checkbox"
                        checked={preferences.emailNotifications}
                        onChange={() => handleCheckboxChange('emailNotifications')}
                    />
                </label>
                <label className="flex items-center justify-between">
                    <span>새 레시피 알림</span>
                    <input
                        type="checkbox"
                        checked={preferences.newRecipeNotifications}
                        onChange={() => handleCheckboxChange('newRecipeNotifications')}
                    />
                </label>
                <label className="flex items-center justify-between">
                    <span>마케팅 알림</span>
                    <input
                        type="checkbox"
                        checked={preferences.marketingNotifications}
                        onChange={() => handleCheckboxChange('marketingNotifications')}
                    />
                </label>
                <label className="flex items-center justify-between">
                    <span>보안 알림</span>
                    <input
                        type="checkbox"
                        checked={preferences.securityNotifications}
                        onChange={() => handleCheckboxChange('securityNotifications')}
                    />
                </label>
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    onClick={saveSettings}
                    disabled={isSaving}
                >
                    {isSaving ? '저장 중...' : '설정 저장'}
                </button>
            </div>
        </div>
    );
} 