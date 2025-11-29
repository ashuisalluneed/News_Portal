import { fetchArticleById, fetchArticles } from '@/services/newsApi';
import Layout from '@/components/Layout';
import ArticleDetail from '@/components/ArticleDetail';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

/**
 * Dynamic article detail page with ISR
 * Requirements: 2.1, 2.3, 2.4, 4.2
 * 
 * Uses Incremental Static Regeneration (ISR) with 300 second revalidation
 * Fetches article by ID from API service with fallback to mock data
 * Handles 404 for invalid article IDs
 */

// Enable ISR with 300 second (5 minute) revalidation
export const revalidate = 300;

// Generate static paths for all articles at build time
// Using fallback: 'blocking' to generate new pages on-demand
export async function generateStaticParams() {
  try {
    const articles = await fetchArticles(100);
    return articles.map((article) => ({
      id: article.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate dynamic metadata for SEO (Requirements: 6.2, 6.3, 6.4)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchArticleById(id);

  if (!article) {
    return {
      title: 'Article Not Found - News Portal',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} - News Portal`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: article.imageUrl ? [article.imageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch article by ID (Requirement 2.1)
  const article = await fetchArticleById(id);

  // Handle 404 for invalid article IDs (Requirement 2.4)
  if (!article) {
    notFound();
  }

  // JSON-LD structured data for NewsArticle schema (Requirement 6.5)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: article.imageUrl || undefined,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    description: article.summary,
    articleBody: article.content,
  };

  return (
    <Layout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetail article={article} allArticles={await fetchArticles()} />
    </Layout>
  );
}
