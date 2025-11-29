import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Hero from './Hero';
import { Article } from '@/types/article';

/**
 * Basic tests for Hero component
 * Feature: news-media-frontpage
 * Requirements: 1.4
 */

const mockArticle: Article = {
  id: '1',
  title: 'Test Article',
  summary: 'This is a test summary for the article',
  content: 'Full article content goes here',
  imageUrl: 'https://example.com/image.jpg',
  author: 'Test Author',
  publishedAt: '2024-01-01T00:00:00Z',
  category: 'tech',
  slug: 'test-article',
};

describe('Hero Component', () => {
  it('should render with 1 featured article', () => {
    const { getByText } = render(<Hero featuredArticles={[mockArticle]} />);
    
    expect(getByText('Featured Stories')).toBeTruthy();
    expect(getByText('Test Article')).toBeTruthy();
  });

  it('should render with 2 featured articles', () => {
    const articles = [mockArticle, { ...mockArticle, id: '2', title: 'Second Article' }];
    const { getByText } = render(<Hero featuredArticles={articles} />);
    
    expect(getByText('Featured Stories')).toBeTruthy();
    expect(getByText('Test Article')).toBeTruthy();
    expect(getByText('Second Article')).toBeTruthy();
  });

  it('should render with 3 featured articles', () => {
    const articles = [
      mockArticle,
      { ...mockArticle, id: '2', title: 'Second Article' },
      { ...mockArticle, id: '3', title: 'Third Article' },
    ];
    const { getByText } = render(<Hero featuredArticles={articles} />);
    
    expect(getByText('Featured Stories')).toBeTruthy();
    expect(getByText('Test Article')).toBeTruthy();
    expect(getByText('Second Article')).toBeTruthy();
    expect(getByText('Third Article')).toBeTruthy();
  });

  it('should limit to maximum 3 featured articles', () => {
    const articles = [
      mockArticle,
      { ...mockArticle, id: '2', title: 'Second Article' },
      { ...mockArticle, id: '3', title: 'Third Article' },
      { ...mockArticle, id: '4', title: 'Fourth Article' },
    ];
    const { getByText, queryByText } = render(<Hero featuredArticles={articles} />);
    
    expect(getByText('Test Article')).toBeTruthy();
    expect(getByText('Second Article')).toBeTruthy();
    expect(getByText('Third Article')).toBeTruthy();
    expect(queryByText('Fourth Article')).toBeNull();
  });

  it('should render nothing when no articles provided', () => {
    const { container } = render(<Hero featuredArticles={[]} />);
    
    expect(container.textContent).toBe('');
  });

  it('should display featured badge on articles', () => {
    const { getAllByText } = render(<Hero featuredArticles={[mockArticle]} />);
    
    const badges = getAllByText('Featured');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should handle articles with null imageUrl', () => {
    const articleWithoutImage = { ...mockArticle, imageUrl: null };
    const { container, getByText } = render(<Hero featuredArticles={[articleWithoutImage]} />);
    
    expect(getByText('Test Article')).toBeTruthy();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
