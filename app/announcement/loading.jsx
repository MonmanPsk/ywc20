"use client"

import React, { useEffect, useState } from 'react';

export default function Loading() {
    const [loadingDots, setLoadingDots] = useState(3);
    const baseText = "กำลังโหลดข้อมูล";
    const dots = '.'.repeat(loadingDots);

    // Loading dots animation
    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingDots((prev) => (prev + 1) % 4);
        }, 200);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-2xl">{baseText}{dots}</div>
        </div>
    )
}
