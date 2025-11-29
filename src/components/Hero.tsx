'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';
import { useState } from 'react';

/**
 * Hero component displays featured articles section
 * Requirements: 1.4
 * 
 * Displays 1-3 featured articles with larger cards and distinct styling
 * to differentiate from regular article grid
 */
interface HeroProps {
  featuredArticles: Article[];
}

export default function Hero({ featuredArticles }: HeroProps) {
  // Limit to maximum 3 featured articles
  const articles = featuredArticles.slice(0, 3);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Stories</h2>
        
        <div className={`grid gap-6 ${
          articles.length === 1 
            ? 'grid-cols-1' 
            : articles.length === 2 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'grid-cols-1 lg:grid-cols-3'
        }`}>
          {articles.map((article, index) => (
            <FeaturedArticleCard 
              key={article.id} 
              article={article} 
              priority={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * FeaturedArticleCard - Larger card component for featured articles
 */
interface FeaturedArticleCardProps {
  article: Article;
  priority?: boolean;
}

function FeaturedArticleCard({ article, priority = false }: FeaturedArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link
      href={`/article/${article.id}`}
      className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      <article className="flex flex-col h-full">
        {/* Larger Image Section for Featured Articles */}
        <div className="relative w-full h-64 md:h-80 bg-gray-200">
          {article.imageUrl && !imageError ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority={priority}
              onError={() => setImageError(true)}
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
              <svg
                className="w-20 h-20 text-white opacity-75"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
            Featured
          </div>
        </div>

        {/* Content Section with Enhanced Styling */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category Badge */}
          <span className="text-sm font-bold text-blue-600 uppercase mb-3 tracking-wide">
            {article.category}
          </span>

          {/* Title - Larger for featured articles */}
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h3>

          {/* Summary - More lines visible */}
          <p className="text-gray-700 text-base mb-4 line-clamp-4 flex-grow leading-relaxed">
            {article.summary}
          </p>

          {/* Metadata with enhanced styling */}
          <div className="flex items-center justify-between text-sm text-gray-600 mt-auto pt-4 border-t border-gray-200">
            <span className="font-semibold">{article.author}</span>
            <time dateTime={article.publishedAt} className="text-gray-500">
              {formatDate(article.publishedAt)}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
