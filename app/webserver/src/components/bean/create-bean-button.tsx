"use client";

import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "sonner";

interface CreateBeanButtonProps {
    className?: string;
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export function CreateBeanButton({
    className = "",
    variant = "default",
    size = "default",
}: CreateBeanButtonProps) {
    const { user } = useAuth();

    const handleClick = () => {
        if (!user) {
            toast.error("로그인이 필요합니다", {
                description: "원두 등록을 위해 먼저 로그인해주세요.",
            });
            return;
        }
    };

    return (
        <>
            {user ? (
                <Link href="/beans/create">
                    <Button
                        variant={variant}
                        size={size}
                        className={`${className} cursor-pointer`}
                    >
                        <Coffee className="mr-2 h-4 w-4" />
                        원두 등록
                    </Button>
                </Link>
            ) : (
                <Button
                    variant={variant}
                    size={size}
                    className={`${className} cursor-pointer`}
                    onClick={handleClick}
                >
                    <Coffee className="mr-2 h-4 w-4" />
                    원두 등록
                </Button>
            )}
        </>
    );
} 