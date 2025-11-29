import { describe, expect } from 'vitest';
import { render } from '@testing-library/react';
import { test, fc } from '@fast-check/vitest';
import ArticleGrid from './ArticleGrid';
import { Article } from '@/types/article';

/**
 * Property-based tests for ArticleGrid component
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

// Generator for arrays of articles
const articlesArrayArbitrary = fc.array(articleArbitrary, { minLength: 1, maxLength: 20 });

describe('ArticleGrid Property-Based Tests', () => {
  /**
   * Feature: news-media-frontpage, Property 2: Responsive column adjustment
   * Validates: Requirements 5.1, 5.2, 5.3
   * 
   * For any viewport width, the grid layout should display exactly the expected
   * number of columns: 1 column for width < 768px, 2 columns for 768px ≤ width < 1024px,
   * and 3+ columns for width ≥ 1024px
   */
  test.prop([articlesArrayArbitrary], { numRuns: 100 })(
    'should apply correct responsive grid classes for any article array',
    (articles) => {
      const { container } = render(<ArticleGrid articles={articles} />);
      
      // Find the grid container
      const gridElement = container.querySelector('[data-testid="article-grid"]');
      expect(gridElement).toBeTruthy();
      
      // Verify the grid has the correct Tailwind CSS classes for responsive columns
      const className = gridElement?.className || '';
      
      // Check for base mobile class (1 column)
      expect(className).toContain('grid-cols-1');
      
      // Check for tablet breakpoint class (2 columns at md breakpoint: 768px)
      expect(className).toContain('md:grid-cols-2');
      
      // Check for desktop breakpoint class (3 columns at lg breakpoint: 1024px)
      expect(className).toContain('lg:grid-cols-3');
      
      // Verify the grid element is actually a grid
      expect(className).toContain('grid');
      
      // Verify all articles are rendered
      const articleCards = container.querySelectorAll('article');
      expect(articleCards.length).toBe(articles.length);
    }
  );
});
