import { Article } from '@/types/article';
import { mockArticles } from './mockData';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

// Helper to generate a consistent ID from article URL
const generateId = (url: string) => {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString();
};

// Transform NewsAPI article
const transformNewsAPIArticle = (item: any): Article => {
  return {
    id: generateId(item.url),
    title: item.title || 'Untitled Article',
    summary: item.description || 'No description available.',
    content: item.content || item.description || 'Read more at the source.',
    author: item.author || item.source?.name || 'Unknown Author',
    publishedAt: item.publishedAt || new Date().toISOString(),
    category: 'general',
    imageUrl: item.urlToImage || null,
    source: {
      id: item.source?.id || 'unknown',
      name: item.source?.name || 'Unknown Source',
    },
    url: item.url,
  };
};

// Transform GNews article
const transformGNewsArticle = (item: any): Article => {
  return {
    id: generateId(item.url),
    title: item.title,
    summary: item.description,
    content: item.content,
    author: item.source?.name || 'Unknown Author',
    publishedAt: item.publishedAt,
    category: 'general',
    imageUrl: item.image,
    source: {
      id: 'gnews',
      name: item.source?.name || 'GNews Source',
    },
    url: item.url,
  };
};

export async function fetchArticles(limit: number = 10, category?: string, country: string = 'in'): Promise<Article[]> {
  // 1. Try GNews first (Works on Vercel Free)
  if (GNEWS_API_KEY) {
    try {
      const endpoint = category
        ? `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=${country}&max=${limit}&apikey=${GNEWS_API_KEY}`
        : `https://gnews.io/api/v4/top-headlines?lang=en&country=${country}&max=${limit}&apikey=${GNEWS_API_KEY}`;

      const res = await fetch(endpoint, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles.map(transformGNewsArticle);
        }
      }
    } catch (e) {
      console.warn('GNews fetch failed:', e);
    }
  }

  // 2. Try NewsAPI (Works on Localhost, fails on Vercel Free)
  if (NEWS_API_KEY) {
    try {
      const endpoint = category
        ? `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${limit}&apiKey=${NEWS_API_KEY}`
        : `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=${limit}&apiKey=${NEWS_API_KEY}`;

      const res = await fetch(endpoint, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          return data.articles
            .filter((item: any) => item.title !== '[Removed]')
            .map(transformNewsAPIArticle);
        }
      }
    } catch (e) {
      console.warn('NewsAPI fetch failed:', e);
    }
  }

  // 3. Fallback to Mock Data
  console.log('Using mock data fallback');
  return mockArticles.slice(0, limit);
}

export async function fetchArticleById(id: string): Promise<Article | undefined> {
  // Try to find in mock data first
  const mockArticle = mockArticles.find(a => a.id === id);
  if (mockArticle) return mockArticle;

  // Otherwise fetch fresh (this is inefficient but necessary without a DB)
  const articles = await fetchArticles(100);
  return articles.find(a => a.id === id);
}

export async function searchArticles(query: string): Promise<Article[]> {
  // Search implementation similar to fetchArticles...
  // For brevity, defaulting to mock search if no API
  if (GNEWS_API_KEY) {
    try {
      const res = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        return data.articles.map(transformGNewsArticle);
      }
    } catch (e) { console.error(e); }
  }

  if (NEWS_API_KEY) {
    try {
      const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=20&apiKey=${NEWS_API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        return data.articles
          .filter((item: any) => item.title !== '[Removed]')
          .map(transformNewsAPIArticle);
      }
    } catch (e) { console.error(e); }
  }

  return [];
}
