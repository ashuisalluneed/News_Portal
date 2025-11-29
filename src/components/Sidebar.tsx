'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Article } from '@/types/article';

/**
 * Sidebar component for news portal
 * Displays trending articles, categories, and additional navigation
 */
interface SidebarProps {
    trendingArticles?: Article[];
}

export default function Sidebar({ trendingArticles = [] }: SidebarProps) {
    const [mounted, setMounted] = useState(false);

    // Fix hydration mismatch by only rendering time-sensitive content on client
    useEffect(() => {
        setMounted(true);
    }, []);

    const categories = [
        { name: 'Technology', slug: 'tech', icon: '💻', count: 24 },
        { name: 'Politics', slug: 'politics', icon: '🏛️', count: 18 },
        { name: 'Sports', slug: 'sports', icon: '⚽', count: 32 },
        { name: 'Business', slug: 'business', icon: '💼', count: 15 },
        { name: 'Entertainment', slug: 'entertainment', icon: '🎬', count: 21 },
        { name: 'Health', slug: 'health', icon: '🏥', count: 12 },
    ];

    const formatDate = (dateString: string) => {
        if (!mounted) {
            // Return static date on server to avoid hydration mismatch
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        // Client-side: calculate relative time
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <aside className="w-full space-y-6">
            {/* Trending Articles Section */}
            {trendingArticles.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3">
                        <h2 className="text-white font-bold text-lg flex items-center gap-2">
                            <span className="text-xl">🔥</span>
                            Trending Now
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {trendingArticles.slice(0, 5).map((article, index) => (
                            <Link
                                key={article.id}
                                href={`/article/${article.id}`}
                                className="block p-4 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex gap-3">
                                    <span className="text-2xl font-bold text-red-600 flex-shrink-0 w-8">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            <span className="capitalize">{article.category}</span>
                                            <span>•</span>
                                            <time>{formatDate(article.publishedAt)}</time>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Categories Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                    <h2 className="text-white font-bold text-lg flex items-center gap-2">
                        <span className="text-xl">📑</span>
                        Categories
                    </h2>
                </div>
                <div className="p-2">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/category/${category.slug}`}
                            className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{category.icon}</span>
                                <span className="font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </span>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                {category.count}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-md overflow-hidden p-6 text-white">
                <div className="text-center">
                    <div className="text-3xl mb-3">📧</div>
                    <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                    <p className="text-purple-100 text-sm mb-4">
                        Get the latest news delivered directly to your inbox
                    </p>
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                            style={{ minHeight: '44px' }}
                        />
                        <button
                            type="submit"
                            className="w-full bg-white text-purple-700 font-semibold px-4 py-2 rounded-md hover:bg-purple-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                            style={{ minHeight: '44px' }}
                        >
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-purple-200 mt-3">
                        We respect your privacy. Unsubscribe anytime.
                    </p>
                </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">🌐</span>
                    Follow Us
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                        Twitter
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                        Facebook
                    </a>
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-colors font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="white" strokeWidth="2" fill="none" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" />
                        </svg>
                        Instagram
                    </a>
                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                        </svg>
                        YouTube
                    </a>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden p-6 text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    News Portal Stats
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Articles</span>
                        <span className="font-bold text-xl">2,847</span>
                    </div>
                    <div className="h-px bg-gray-700"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Active Readers</span>
                        <span className="font-bold text-xl">12.5K</span>
                    </div>
                    <div className="h-px bg-gray-700"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300">Published Today</span>
                        <span className="font-bold text-xl text-green-400">47</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
