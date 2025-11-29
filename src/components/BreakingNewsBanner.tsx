'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchArticles } from '@/services/newsApi';

/**
 * Breaking News Banner
 * Sticky banner for urgent/breaking news
 */
interface BreakingNewsProps {
    news?: {
        id: string;
        title: string;
        url: string;
    };
}

export default function BreakingNewsBanner({ news: initialNews }: BreakingNewsProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [breakingNews, setBreakingNews] = useState(initialNews || null);

    useEffect(() => {
        if (!initialNews) {
            const loadBreakingNews = async () => {
                try {
                    const articles = await fetchArticles(1);
                    if (articles && articles.length > 0) {
                        setBreakingNews({
                            id: articles[0].id,
                            title: `🚨 BREAKING: ${articles[0].title}`,
                            url: `/article/${articles[0].id}`
                        });
                    }
                } catch (error) {
                    console.error('Failed to load breaking news');
                }
            };
            loadBreakingNews();
        }
    }, [initialNews]);

    if (!isVisible || !breakingNews) return null;

    return (
        <div className="fixed top-[72px] lg:top-[112px] left-0 right-0 z-40 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Breaking News Content */}
                    <Link
                        href={breakingNews.url}
                        className="flex-1 flex items-center gap-3 hover:opacity-90 transition-opacity"
                    >
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-white text-red-600 text-xs font-bold rounded uppercase">
                                Breaking
                            </span>
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                            </div>
                        </div>
                        <p className="font-medium text-sm md:text-base line-clamp-1">
                            {breakingNews.title}
                        </p>
                    </Link>

                    {/* Close Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                        aria-label="Close breaking news"
                        style={{ minWidth: '40px', minHeight: '40px' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
