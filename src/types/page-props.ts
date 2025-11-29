import { Article } from './article';

/**
 * Page props interfaces for Next.js pages
 * Requirements: 1.2, 2.2
 */

/**
 * Props for the homepage
 */
export interface HomePageProps {
  articles: Article[];
  featuredArticles: Article[];
}

/**
 * Props for individual article pages
 */
export interface ArticlePageProps {
  article: Article;
}
