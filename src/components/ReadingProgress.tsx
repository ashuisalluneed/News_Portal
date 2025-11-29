'use client';

import { useState, useEffect } from 'react';

/**
 * Reading Progress Bar
 * Shows scroll progress at top of page
 */
export default function ReadingProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;

            setProgress(scrollProgress);
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial check

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
            <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
