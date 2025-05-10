"use client"

import React, { useEffect, useState } from 'react';

export default function Loading() {
    const [loadingDots, setLoadingDots] = useState(0);
    const baseText = "กำลังโหลดข้อมูล";

    // Loading dots animation
    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingDots((prev) => (prev + 1) % 4);
        }, 200);

        return () => clearInterval(interval);
    }, []);

    const dots = '.'.repeat(loadingDots);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-2xl">{baseText}{dots}</div>
        </div>
    )
}
