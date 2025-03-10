"use client";

import { Button } from "@/components/ui/button";
import { Bean } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();

    const handleClick = () => {
        if (!session) {
            toast.error("로그인이 필요합니다", {
                description: "원두 등록을 위해 먼저 로그인해주세요.",
            });
            return;
        }
    };

    return (
        <>
            {session ? (
                <Link href="/beans/create">
                    <Button
                        variant={variant}
                        size={size}
                        className={`${className} cursor-pointer`}
                    >
                        <Bean className="mr-2 h-4 w-4" />
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
                    <Bean className="mr-2 h-4 w-4" />
                    원두 등록
                </Button>
            )}
        </>
    );
} 