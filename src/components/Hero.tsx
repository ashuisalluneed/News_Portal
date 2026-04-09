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
    <section className="bg-background-dark py-12 px-4 border-b border-outline/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-foreground mb-8 tracking-tight uppercase" style={{ fontFamily: 'var(--font-heading), serif' }}>Featured Stories</h2>
        
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
      className="group block bg-surface rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:shadow-[0_8px_40px_rgba(242,202,80,0.15)] transition-all duration-500 overflow-hidden hover:-translate-y-2 border border-outline/30 hover:border-primary/50"
    >
      <article className="flex flex-col h-full">
        {/* Larger Image Section for Featured Articles */}
        <div className="relative w-full h-64 md:h-80 bg-surface-dim overflow-hidden">
          {article.imageUrl && !imageError ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
              onError={() => setImageError(true)}
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface-low">
              <svg
                className="w-20 h-20 text-outline opacity-75"
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
          <div className="absolute top-4 left-4 bg-primary text-background-dark px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_2px_10px_rgba(242,202,80,0.5)]">
            Featured
          </div>
        </div>

        {/* Content Section with Enhanced Styling */}
        <div className="p-6 md:p-8 flex flex-col flex-grow">
          {/* Category Badge */}
          <span className="text-xs font-bold text-primary uppercase mb-4 tracking-widest text-shadow-sm">
            {article.category}
          </span>

          {/* Title - Larger for featured articles */}
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300" style={{ fontFamily: 'var(--font-heading), serif' }}>
            {article.title}
          </h3>

          {/* Summary - More lines visible */}
          <p className="text-foreground-muted text-base md:text-lg mb-6 line-clamp-3 md:line-clamp-4 flex-grow leading-relaxed">
            {article.summary}
          </p>

          {/* Metadata with enhanced styling */}
          <div className="flex items-center justify-between text-sm text-foreground-muted/70 mt-auto pt-5 border-t border-outline/20">
            <span className="font-semibold tracking-wide">{article.author}</span>
            <time dateTime={article.publishedAt} className="tracking-wide">
              {formatDate(article.publishedAt)}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
