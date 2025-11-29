'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';

export default function LocalNewsSection() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<{ city: string; country: string; countryCode: string } | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Detect Location
                const locRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
                if (!locRes.ok) throw new Error('Location check failed');

                const locData = await locRes.json();
                const countryCode = locData.country_code ? locData.country_code.toLowerCase() : 'us';

                setLocation({
                    city: locData.city,
                    country: locData.country,
                    countryCode: countryCode
                });

                // 2. Fetch Local News
                const newsRes = await fetch(`/api/news?country=${countryCode}&limit=4`);
                const newsData = await newsRes.json();

                if (newsData.articles) {
                    setArticles(newsData.articles);
                }
            } catch (error) {
                console.error('Local news error:', error);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    if (loading) {
        return (
            <div className="mb-12">
                <div className="h-8 w-64 bg-gray-200 rounded mb-6 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden h-80 animate-pulse">
                            <div className="h-48 bg-gray-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!articles.length) return null;

    return (
        <section className="mb-12 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Top Stories in {location?.country || 'Your Area'}
                    </h2>
                </div>
                <span className="text-sm text-gray-500 font-medium bg-blue-50 px-3 py-1 rounded-full">
                    {location?.city}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <Link
                        key={article.id}
                        href={`/article/${article.id}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 flex flex-col h-full"
                    >
                        <div className="relative h-48 overflow-hidden">
                            {article.imageUrl ? (
                                <img
                                    src={article.imageUrl}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                                    <span className="text-4xl">📰</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                Local
                            </div>
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                    {article.source?.name || 'News'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(article.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {article.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 flex-grow">
                                {article.summary}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
