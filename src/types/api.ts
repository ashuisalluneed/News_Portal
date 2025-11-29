import { Article } from './article';

/**
 * API response interface for news API
 * Requirements: 4.1
 */
export interface NewsApiResponse {
  articles: Article[];
  totalResults: number;
  status: 'ok' | 'error';
}
