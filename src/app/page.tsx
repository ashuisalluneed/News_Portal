import { fetchArticles } from '@/services/newsApi';
import Hero from '@/components/Hero';
import ArticleGrid from '@/components/ArticleGrid';
import EmptyState from '@/components/EmptyState';
import Layout from '@/components/Layout';
import Sidebar from '@/components/Sidebar';
import LocalNewsSection from '@/components/LocalNewsSection';
import type { Metadata } from 'next';

/**
 * Homepage with ISR data fetching and sidebar
 * Requirements: 1.1, 1.4, 1.5, 4.2, 4.3, 4.4, 4.5, 6.1, 6.4
 * 
 * Uses Incremental Static Regeneration (ISR) with 60 second revalidation
 * Fetches articles from API service with fallback to mock data
 * Separates featured articles (first 3) from regular articles
 * Displays sidebar with trending articles and categories
 */

// SEO metadata for homepage (Requirements: 6.1, 6.4)
export const metadata: Metadata = {
  title: 'News Portal - Latest News & Updates',
  description: 'Stay updated with the latest news and stories from around the world. Your trusted source for breaking news, analysis, and in-depth coverage.',
  openGraph: {
    title: 'News Portal - Latest News & Updates',
    description: 'Stay updated with the latest news and stories from around the world. Your trusted source for breaking news, analysis, and in-depth coverage.',
    type: 'website',
    locale: 'en_US',
    siteName: 'News Portal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'News Portal - Latest News & Updates',
    description: 'Stay updated with the latest news and stories from around the world. Your trusted source for breaking news, analysis, and in-depth coverage.',
  },
};

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function Home() {
  // Fetch articles from API service
  // The fetchArticles function has built-in error handling and fallback to mock data
  const articles = await fetchArticles(20);

  // Handle empty data case (Requirement 4.4)
  if (articles.length === 0) {
    return (
      <Layout>
        <EmptyState message="No news available at the moment. Please check back later." />
      </Layout>
    );
  }

  // Separate featured articles (first 3) from regular articles
  const featuredArticles = articles.slice(0, 3);
  const regularArticles = articles.slice(3);

  // Get trending articles (first 8 for sidebar)
  const trendingArticles = articles.slice(0, 8);

  return (
    <Layout>
      {/* Hero section with featured articles (Requirement 1.4) */}
      <Hero featuredArticles={featuredArticles} />

      {/* Local News Section (Client-side fetched based on location) */}
      <LocalNewsSection />

      {/* Main content area with sidebar layout */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content - Latest news */}
          <div className="lg:col-span-8">
            {regularArticles.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
                <ArticleGrid articles={regularArticles} />
              </>
            )}
          </div>

          {/* Sidebar - Trending and categories */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-4">
              <Sidebar trendingArticles={trendingArticles} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
