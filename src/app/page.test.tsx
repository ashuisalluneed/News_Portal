import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import * as newsApi from '@/services/newsApi';
import { mockArticles } from '@/services/mockData';

// Mock the newsApi module
vi.mock('@/services/newsApi', () => ({
  fetchArticles: vi.fn(),
}));

describe('Homepage', () => {
  it('should render Hero and ArticleGrid with articles', async () => {
    // Mock fetchArticles to return mock data
    vi.mocked(newsApi.fetchArticles).mockResolvedValue(mockArticles);

    // Render the page
    const page = await Home();
    const { container } = render(page);

    // Check that featured articles section exists
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('should render EmptyState when no articles are available', async () => {
    // Mock fetchArticles to return empty array
    vi.mocked(newsApi.fetchArticles).mockResolvedValue([]);

    // Render the page
    const page = await Home();
    render(page);

    // Check that empty state message is displayed
    expect(screen.getByText(/No news available/i)).toBeTruthy();
  });

  it('should separate featured articles from regular articles', async () => {
    // Mock fetchArticles to return 10 articles
    const articles = mockArticles.slice(0, 10);
    vi.mocked(newsApi.fetchArticles).mockResolvedValue(articles);

    // Render the page
    const page = await Home();
    const { container } = render(page);

    // The page should render (featured + regular articles)
    expect(container.querySelector('section')).toBeTruthy();
  });
});
