"use client";

import { CreateBeanButton } from "./create-bean-button";

interface CreateBeanButtonClientProps {
    className?: string;
    variant?: "default" | "outline" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export function CreateBeanButtonClient(props: CreateBeanButtonClientProps) {
    return <CreateBeanButton {...props} />;
} 