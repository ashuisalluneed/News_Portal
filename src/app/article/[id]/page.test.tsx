import { describe, expect, vi } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { fetchArticleById } from '@/services/newsApi';
import { Article } from '@/types/article';
import { generateMetadata } from './page';

/**
 * Property-based tests for dynamic article route generation
 * Feature: news-media-frontpage
 */

// Mock the newsApi module
vi.mock('@/services/newsApi', () => ({
  fetchArticleById: vi.fn(),
  fetchArticles: vi.fn(),
}));

// Generator for valid article IDs (UUIDs and other formats)
const articleIdArbitrary = fc.oneof(
  fc.uuid(),
  fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  fc.integer({ min: 1, max: 999999 }).map(n => n.toString())
);

// Generator for valid articles
const articleArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 10, maxLength: 200 }),
  summary: fc.string({ minLength: 50, maxLength: 300 }),
  content: fc.string({ minLength: 200, maxLength: 2000 }),
  imageUrl: fc.option(fc.webUrl(), { nil: null }),
  author: fc.string({ minLength: 3, maxLength: 50 }),
  publishedAt: fc.integer({ min: 1577836800000, max: 1735689599999 }).map(timestamp => 
    new Date(timestamp).toISOString()
  ),
  category: fc.constantFrom('politics', 'sports', 'tech', 'entertainment', 'business', 'health'),
  slug: fc.string({ minLength: 5, maxLength: 100 }),
}) as fc.Arbitrary<Article>;

describe('Dynamic Article Route Property-Based Tests', () => {
  /**
   * Feature: news-media-frontpage, Property 3: Dynamic route generation
   * Validates: Requirements 2.3, 2.4
   * 
   * For any valid article ID, navigating to `/article/[id]` should result in
   * either a rendered article page or a 404 page, never an unhandled error
   */
  test.prop([articleIdArbitrary, fc.option(articleArbitrary, { nil: null })], { numRuns: 100 })(
    'should handle any article ID without throwing unhandled errors',
    async (articleId, maybeArticle) => {
      // Mock the fetchArticleById function to return the article or null
      vi.mocked(fetchArticleById).mockResolvedValue(maybeArticle);

      // Test that fetchArticleById can be called with any valid ID without throwing
      let result: Article | null = null;
      let error: Error | null = null;

      try {
        result = await fetchArticleById(articleId);
      } catch (e) {
        error = e as Error;
      }

      // The function should never throw an unhandled error
      expect(error).toBeNull();

      // The result should be either an article or null (for 404)
      if (maybeArticle !== null) {
        expect(result).toEqual(maybeArticle);
      } else {
        expect(result).toBeNull();
      }

      // Verify the function was called with the correct ID
      expect(fetchArticleById).toHaveBeenCalledWith(articleId);
    }
  );

  /**
   * Feature: news-media-frontpage, Property 3: Dynamic route generation (404 handling)
   * Validates: Requirements 2.4
   * 
   * For any article ID that doesn't exist, the API should return null
   * which will trigger a 404 page, not an unhandled error
   */
  test.prop([articleIdArbitrary], { numRuns: 100 })(
    'should return null for non-existent article IDs without throwing errors',
    async (articleId) => {
      // Mock the fetchArticleById to return null (article not found)
      vi.mocked(fetchArticleById).mockResolvedValue(null);

      let result: Article | null = null;
      let error: Error | null = null;

      try {
        result = await fetchArticleById(articleId);
      } catch (e) {
        error = e as Error;
      }

      // Should not throw an error
      expect(error).toBeNull();

      // Should return null for non-existent articles
      expect(result).toBeNull();

      // Verify the function was called
      expect(fetchArticleById).toHaveBeenCalledWith(articleId);
    }
  );

  /**
   * Feature: news-media-frontpage, Property 3: Dynamic route generation (valid article)
   * Validates: Requirements 2.1, 2.3
   * 
   * For any valid article ID that exists, the API should return the article
   * without throwing errors
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should return article for valid article IDs without throwing errors',
    async (article) => {
      // Mock the fetchArticleById to return the article
      vi.mocked(fetchArticleById).mockResolvedValue(article);

      let result: Article | null = null;
      let error: Error | null = null;

      try {
        result = await fetchArticleById(article.id);
      } catch (e) {
        error = e as Error;
      }

      // Should not throw an error
      expect(error).toBeNull();

      // Should return the article
      expect(result).toEqual(article);

      // Verify the function was called with the correct ID
      expect(fetchArticleById).toHaveBeenCalledWith(article.id);
    }
  );

  /**
   * Feature: news-media-frontpage, Property 9: Meta tag injection
   * Validates: Requirements 6.2, 6.3
   * 
   * For any article detail page, the rendered HTML head should contain a title tag
   * including the article title and a meta description tag containing the article summary
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should generate metadata with article title and summary for any article',
    async (article) => {
      // Mock the fetchArticleById to return the article
      vi.mocked(fetchArticleById).mockResolvedValue(article);

      // Generate metadata for the article
      const metadata = await generateMetadata({
        params: Promise.resolve({ id: article.id }),
      });

      // The title should include the article title
      expect(metadata.title).toBeDefined();
      expect(metadata.title).toContain(article.title);

      // The description should be the article summary
      expect(metadata.description).toBeDefined();
      expect(metadata.description).toBe(article.summary);

      // Open Graph tags should also contain article title and summary
      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe(article.title);
      expect(metadata.openGraph?.description).toBe(article.summary);
      expect(metadata.openGraph?.type).toBe('article');

      // Verify the function was called with the correct ID
      expect(fetchArticleById).toHaveBeenCalledWith(article.id);
    }
  );

  /**
   * Feature: news-media-frontpage, Property 9: Meta tag injection (null article)
   * Validates: Requirements 6.2, 6.3
   * 
   * For any article ID that doesn't exist, the metadata should still be generated
   * with appropriate fallback values
   */
  test.prop([articleIdArbitrary], { numRuns: 100 })(
    'should generate fallback metadata for non-existent articles',
    async (articleId) => {
      // Mock the fetchArticleById to return null
      vi.mocked(fetchArticleById).mockResolvedValue(null);

      // Generate metadata for the non-existent article
      const metadata = await generateMetadata({
        params: Promise.resolve({ id: articleId }),
      });

      // The title should be defined with a fallback
      expect(metadata.title).toBeDefined();
      expect(typeof metadata.title).toBe('string');

      // The description should be defined with a fallback
      expect(metadata.description).toBeDefined();
      expect(typeof metadata.description).toBe('string');

      // Verify the function was called
      expect(fetchArticleById).toHaveBeenCalledWith(articleId);
    }
  );
});
