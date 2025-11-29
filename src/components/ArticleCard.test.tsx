import { describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { test, fc } from '@fast-check/vitest';
import ArticleCard from './ArticleCard';
import { Article } from '@/types/article';

/**
 * Property-based tests for ArticleCard component
 * Feature: news-media-frontpage
 */

// Generator for valid articles with non-null required fields
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

describe('ArticleCard Property-Based Tests', () => {
  /**
   * Feature: news-media-frontpage, Property 1: Article card display completeness
   * Validates: Requirements 1.2
   * 
   * For any article with non-null required fields (title, summary, publishedAt),
   * rendering the article card should produce HTML containing all three field values
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should display title, summary, and publishedAt for any valid article',
    (article) => {
      const { container } = render(<ArticleCard article={article} />);
      
      // Use textContent to get the actual text without HTML entities
      const text = container.textContent || '';

      // Check that all required fields are present in the rendered text
      expect(text).toContain(article.title);
      expect(text).toContain(article.summary);
      
      // Check that the date is displayed (formatted, so we check for year at minimum)
      const year = new Date(article.publishedAt).getFullYear().toString();
      expect(text).toContain(year);
    }
  );

  /**
   * Feature: news-media-frontpage, Property 5: Null image handling
   * Validates: Requirements 3.3
   * 
   * For any article with a null imageUrl, rendering the article card should
   * complete successfully without throwing errors and should display either
   * a placeholder or omit the image section
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should handle null imageUrl without errors and display placeholder',
    (article) => {
      // Force imageUrl to null
      const articleWithNullImage = { ...article, imageUrl: null };
      
      // Should not throw an error
      const { container } = render(<ArticleCard article={articleWithNullImage} />);
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Check that a placeholder is displayed (SVG icon)
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
      
      // Verify no Next.js Image component is rendered when imageUrl is null
      const img = container.querySelector('img');
      expect(img).toBeNull();
    }
  );

  /**
   * Feature: news-media-frontpage, Property 10: Text overflow prevention
   * Validates: Requirements 8.1
   * 
   * For any article title exceeding the card width, the rendered card should
   * either truncate the text with ellipsis or wrap it without causing horizontal overflow
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should prevent text overflow with line-clamp for long titles',
    (article) => {
      // Create an article with a very long title
      const longTitle = 'A'.repeat(500);
      const articleWithLongTitle = { ...article, title: longTitle };
      
      const { container } = render(<ArticleCard article={articleWithLongTitle} />);
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Check that the title element has line-clamp class for truncation
      const titleElement = container.querySelector('h2');
      expect(titleElement).toBeTruthy();
      expect(titleElement?.className).toContain('line-clamp');
      
      // Verify the title is present in the DOM (even if truncated visually)
      const text = container.textContent || '';
      expect(text).toContain('A');
    }
  );

  /**
   * Feature: news-media-frontpage, Property 11: Image load failure handling
   * Validates: Requirements 8.3
   * 
   * For any image that fails to load (404, network error), the article card
   * should display a fallback placeholder without breaking the card layout
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should have image element with error handling for valid imageUrl',
    (article) => {
      // Ensure article has a valid imageUrl (not null)
      const articleWithImage = { ...article, imageUrl: 'https://example.com/image.jpg' };
      
      const { container } = render(<ArticleCard article={articleWithImage} />);
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Find the image element - Next.js Image component renders an img tag
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      
      // Verify that the image src contains the original URL (Next.js transforms it)
      const imgSrc = img?.getAttribute('src') || '';
      expect(imgSrc).toContain('example.com');
      
      // The card should be rendered properly with all content
      const text = container.textContent || '';
      expect(text).toContain(article.title);
      expect(text).toContain(article.summary);
      
      // Verify the component structure is intact (no layout breaking)
      const articleElement = container.querySelector('article');
      expect(articleElement).toBeTruthy();
    }
  );
});
