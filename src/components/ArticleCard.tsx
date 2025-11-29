'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';
import { useState } from 'react';

/**
 * ArticleCard component displays a preview of an article
 * Requirements: 1.2, 3.1, 3.2, 3.3, 7.2, 8.1
 */
interface ArticleCardProps {
  article: Article;
  priority?: boolean;
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link
      href={`/article/${article.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full"
      style={{ minHeight: '44px' }}
    >
      <article className="flex flex-col h-full">
        {/* Image Section - Requirements: 3.1, 3.2, 3.3, 8.3 */}
        <div className="relative w-full h-48 bg-gray-200">
          {article.imageUrl && !imageError ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority={priority}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <svg
                className="w-16 h-16 text-gray-500"
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
        </div>

        {/* Content Section - Requirements: 1.2, 7.2, 8.1 */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category Badge */}
          <span className="text-xs font-semibold text-blue-600 uppercase mb-2">
            {article.category}
          </span>

          {/* Title - Requirements: 8.1 (text truncation) */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h2>

          {/* Summary */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
            {article.summary}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <span className="font-medium">{article.author}</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </article>
    </Link>
  );
}
