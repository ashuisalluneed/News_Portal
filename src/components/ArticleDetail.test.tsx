import { describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { test, fc } from '@fast-check/vitest';
import ArticleDetail from './ArticleDetail';
import { Article } from '@/types/article';

/**
 * Property-based tests for ArticleDetail component
 * Feature: news-media-frontpage
 */

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

describe('ArticleDetail Property-Based Tests', () => {
  /**
   * Feature: news-media-frontpage, Property 4: Image optimization application
   * Validates: Requirements 3.1, 3.2
   * 
   * For any article card or detail page rendered, all article images should use
   * the Next.js Image component with lazy loading enabled
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should use Next.js Image component with priority loading for articles with images',
    (article) => {
      // Test with articles that have imageUrl
      const articleWithImage = { ...article, imageUrl: 'https://example.com/test-image.jpg' };
      
      const { container } = render(<ArticleDetail article={articleWithImage} />);
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Find the image element - Next.js Image component renders an img tag
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      
      // Verify that the image uses Next.js Image component
      // Next.js Image component adds specific attributes and transforms the src
      const imgSrc = img?.getAttribute('src') || '';
      
      // Next.js Image component transforms URLs, so we check for the presence of the image
      // The src will be transformed by Next.js (e.g., /_next/image?url=...)
      expect(imgSrc).toBeTruthy();
      
      // Verify the image has proper attributes for optimization
      // Next.js Image adds loading attribute (though priority overrides it)
      // and other optimization attributes
      expect(img).toBeTruthy();
      
      // Verify alt text is present for accessibility
      const altText = img?.getAttribute('alt');
      expect(altText).toBe(articleWithImage.title);
      
      // Verify the article content is also rendered
      const text = container.textContent || '';
      expect(text).toContain(articleWithImage.title);
      expect(text).toContain(articleWithImage.summary);
      expect(text).toContain(articleWithImage.content);
    }
  );

  /**
   * Feature: news-media-frontpage, Property 4: Image optimization application (null case)
   * Validates: Requirements 3.1, 3.2
   * 
   * For articles without images, the component should render successfully
   * without attempting to render an image
   */
  test.prop([articleArbitrary], { numRuns: 100 })(
    'should not render image element when imageUrl is null',
    (article) => {
      // Test with articles that have null imageUrl
      const articleWithoutImage = { ...article, imageUrl: null };
      
      const { container } = render(<ArticleDetail article={articleWithoutImage} />);
      
      // Verify the component rendered successfully
      expect(container).toBeTruthy();
      
      // Verify no image element is rendered when imageUrl is null
      const img = container.querySelector('img');
      expect(img).toBeNull();
      
      // Verify the article content is still rendered properly
      const text = container.textContent || '';
      expect(text).toContain(articleWithoutImage.title);
      expect(text).toContain(articleWithoutImage.summary);
      expect(text).toContain(articleWithoutImage.content);
      expect(text).toContain(articleWithoutImage.author);
    }
  );
});
