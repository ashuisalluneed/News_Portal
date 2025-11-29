'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';
import { useState } from 'react';
import ReadingControls from './ReadingControls';
import SaveArticleButton from './SaveArticleButton';
import PrintButton from './PrintButton';
import SocialShare from './SocialShare';
import VideoPlayer from './VideoPlayer';
import ReactionButtons from './ReactionButtons';
import CommentsSection from './CommentsSection';
import RelatedArticles from './RelatedArticles';
import WeatherWidget from './WeatherWidget';

/**
 * ArticleDetail component displays the full article view
 * Requirements: 2.2, 2.5, 3.1
 */
interface ArticleDetailProps {
  article: Article;
  allArticles: Article[];
}

export default function ArticleDetail({ article, allArticles }: ArticleDetailProps) {
  const [imageError, setImageError] = useState(false);

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Reading Controls */}
      <div className="mb-6">
        <ReadingControls wordCount={article.content.split(' ').length} />
      </div>

      {/* Article header - Requirement 2.2 */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        {/* Metadata - Requirement 2.2 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
            <span className="font-medium">{article.author}</span>
            <span className="hidden sm:inline">•</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            <span className="hidden sm:inline">•</span>
            <span className="capitalize text-blue-600 font-medium">{article.category}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <SaveArticleButton articleId={article.id} articleTitle={article.title} />
            <PrintButton />
          </div>
        </div>

        {/* Summary - Requirement 2.2 */}
        <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
          {article.summary}
        </p>
      </header>

      {/* Article image - Requirements: 3.1 (Next.js Image with priority loading) */}
      {article.imageUrl && !imageError && (
        <div className="mb-8 relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 896px"
          />
        </div>
      )}

      {/* Video Player Integration (Demo) */}
      <VideoPlayer
        thumbnail={article.imageUrl || ''}
        title={`Watch: ${article.title}`}
        duration="3:45"
      />

      {/* Article content - Requirement 2.2 */}
      <div className="prose prose-base sm:prose-lg max-w-none mb-12">
        <div className="article-content text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>

      {/* Social Share */}
      <div className="mb-12">
        <SocialShare
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={article.title}
          description={article.summary}
        />
      </div>

      {/* Reaction Buttons */}
      <ReactionButtons />

      {/* Weather Widget (Bonus) */}
      <div className="my-12">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Local Updates</h3>
        <WeatherWidget />
      </div>

      {/* Comments Section */}
      <CommentsSection />

      {/* Related Articles */}
      <RelatedArticles
        currentArticleId={article.id}
        category={article.category}
        articles={allArticles}
      />

      {/* Back to home navigation - Requirement 2.5, 5.4 */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors text-base sm:text-lg py-2"
          style={{ minHeight: '44px' }}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </article>
  );
}
