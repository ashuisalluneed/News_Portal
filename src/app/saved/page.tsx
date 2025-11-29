'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function SavedArticlesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [savedArticleIds, setSavedArticleIds] = useState<string[]>([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
            return;
        }

        if (status === 'authenticated') {
            const saved = JSON.parse(localStorage.getItem('savedArticles') || '[]');
            setSavedArticleIds(saved);
        }
    }, [status, router]);

    const removeSavedArticle = (articleId: string) => {
        const updated = savedArticleIds.filter((id) => id !== articleId);
        localStorage.setItem('savedArticles', JSON.stringify(updated));
        setSavedArticleIds(updated);
    };

    const clearAll = () => {
        if (confirm('Remove all saved articles?')) {
            localStorage.setItem('savedArticles', '[]');
            setSavedArticleIds([]);
        }
    };

    if (status === 'loading') {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Saved Articles
                        </h1>
                        <p className="text-gray-600">
                            {savedArticleIds.length} {savedArticleIds.length === 1 ? 'article' : 'articles'} saved
                        </p>
                    </div>

                    {savedArticleIds.length > 0 && (
                        <button
                            onClick={clearAll}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {/* Content */}
                {savedArticleIds.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            No saved articles yet
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Start saving articles you want to read later. Click the bookmark icon on any article to save it here.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Browse Articles
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {savedArticleIds.map((articleId) => (
                            <div
                                key={articleId}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <Link
                                            href={`/article/${articleId}`}
                                            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 block"
                                        >
                                            Article ID: {articleId}
                                        </Link>
                                        <p className="text-gray-600 mb-4">
                                            Saved article - click to read
                                        </p>
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/article/${articleId}`}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                            >
                                                Read Article
                                            </Link>
                                            <button
                                                onClick={() => removeSavedArticle(articleId)}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
