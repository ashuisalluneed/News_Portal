'use client';

import { useState } from 'react';

/**
 * Reading Controls Component
 * Font size adjustment and reading time display
 */
interface ReadingControlsProps {
    wordCount: number;
}

export default function ReadingControls({ wordCount }: ReadingControlsProps) {
    const [fontSize, setFontSize] = useState(16); // Default 16px
    const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    const increaseFontSize = () => {
        if (fontSize < 24) {
            setFontSize(fontSize + 2);
            updateArticleFontSize(fontSize + 2);
        }
    };

    const decreaseFontSize = () => {
        if (fontSize > 12) {
            setFontSize(fontSize - 2);
            updateArticleFontSize(fontSize - 2);
        }
    };

    const resetFontSize = () => {
        setFontSize(16);
        updateArticleFontSize(16);
    };

    const toggleFontFamily = () => {
        const newFont = fontFamily === 'sans' ? 'serif' : 'sans';
        setFontFamily(newFont);
        updateArticleFontFamily(newFont);
    };

    const updateArticleFontSize = (size: number) => {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            (articleContent as HTMLElement).style.fontSize = `${size}px`;
        }
    };

    const updateArticleFontFamily = (family: 'sans' | 'serif') => {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            (articleContent as HTMLElement).style.fontFamily =
                family === 'serif' ? 'Georgia, serif' : 'system-ui, sans-serif';
        }
    };

    return (
        <div className="sticky top-20 bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Reading Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span className="font-medium">{readingTime} min read</span>
                    <span className="text-gray-400">•</span>
                    <span>{wordCount} words</span>
                </div>

                {/* Font Controls */}
                <div className="flex items-center gap-2">
                    {/* Decrease Font */}
                    <button
                        onClick={decreaseFontSize}
                        disabled={fontSize <= 12}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease font size"
                        title="Decrease font size"
                        style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                        <span className="text-sm font-bold">A-</span>
                    </button>

                    {/* Reset Font */}
                    <button
                        onClick={resetFontSize}
                        className="px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        aria-label="Reset font size"
                        title="Reset font size"
                        style={{ minHeight: '40px' }}
                    >
                        {fontSize}px
                    </button>

                    {/* Increase Font */}
                    <button
                        onClick={increaseFontSize}
                        disabled={fontSize >= 24}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Increase font size"
                        title="Increase font size"
                        style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                        <span className="text-lg font-bold">A+</span>
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                    {/* Font Family Toggle */}
                    <button
                        onClick={toggleFontFamily}
                        className="px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                        aria-label="Toggle font family"
                        title="Toggle font family"
                        style={{ minHeight: '40px' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                            />
                        </svg>
                        <span className="text-sm font-medium hidden sm:inline">
                            {fontFamily === 'sans' ? 'Sans' : 'Serif'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
