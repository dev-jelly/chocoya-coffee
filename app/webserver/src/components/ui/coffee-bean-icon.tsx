"use client";

import React from "react";

interface CoffeeBeanIconProps {
    className?: string;
    size?: number;
    color?: string;
}

export function CoffeeBeanIcon({
    className = "",
    size = 16,
    color = "currentColor"
}: CoffeeBeanIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M6 13c0-2.5 1.4-4.9 4-6.3C12.6 5.3 14 7.8 14 10.3c0 3-3 5.2-6 6.3a5.8 5.8 0 0 1-2-3.6z" />
            <path d="M17 10a3.5 3.5 0 0 1 0 4 4 4 0 0 1-6.1 0 3.4 3.4 0 0 1 0-4 4 4 0 0 1 6.1 0z" />
            <path d="M10 18.2c-1 .8-2.7 1-4.6-.7A5.7 5.7 0 0 1 4 13c0-3 3-5.6 6-6.8 4.2-1.6 7.5 1 8 3.8.5 3.6-2.5 4.9-5 6.2" />
        </svg>
    );
} 