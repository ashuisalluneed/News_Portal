import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { Article } from '@/types/article';

/**
 * Unit tests for Sidebar component
 */

const mockArticles: Article[] = [
    {
        id: '1',
        title: 'Trending Article 1',
        summary: 'This is a summary of trending article 1',
        content: 'Full content here',
        imageUrl: 'https://example.com/image1.jpg',
        author: 'John Doe',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        category: 'tech',
        slug: 'trending-article-1',
    },
    {
        id: '2',
        title: 'Trending Article 2',
        summary: 'This is a summary of trending article 2',
        content: 'Full content here',
        imageUrl: null,
        author: 'Jane Smith',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        category: 'politics',
        slug: 'trending-article-2',
    },
    {
        id: '3',
        title: 'Trending Article 3',
        summary: 'This is a summary of trending article 3',
        content: 'Full content here',
        imageUrl: 'https://example.com/image3.jpg',
        author: 'Bob Johnson',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        category: 'sports',
        slug: 'trending-article-3',
    },
];

describe('Sidebar Component', () => {
    it('should render without crashing', () => {
        const { container } = render(<Sidebar />);
        expect(container).toBeTruthy();
    });

    it('should display trending articles when provided', () => {
        render(<Sidebar trendingArticles={mockArticles} />);

        // Check for "Trending Now" heading
        expect(screen.getByText('Trending Now')).toBeTruthy();

        // Check that trending articles are displayed
        expect(screen.getByText('Trending Article 1')).toBeTruthy();
        expect(screen.getByText('Trending Article 2')).toBeTruthy();
        expect(screen.getByText('Trending Article 3')).toBeTruthy();
    });

    it('should display categories section', () => {
        render(<Sidebar />);

        // Check for "Categories" heading
        expect(screen.getByText('Categories')).toBeTruthy();

        // Check for category items
        expect(screen.getByText('Technology')).toBeTruthy();
        expect(screen.getByText('Politics')).toBeTruthy();
        expect(screen.getByText('Sports')).toBeTruthy();
        expect(screen.getByText('Business')).toBeTruthy();
        expect(screen.getByText('Entertainment')).toBeTruthy();
        expect(screen.getByText('Health')).toBeTruthy();
    });

    it('should display newsletter signup section', () => {
        render(<Sidebar />);

        expect(screen.getByText('Stay Updated')).toBeTruthy();
        expect(screen.getByText(/Get the latest news/i)).toBeTruthy();
        expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
        expect(screen.getByText('Subscribe')).toBeTruthy();
    });

    it('should display social media links', () => {
        render(<Sidebar />);

        expect(screen.getByText('Follow Us')).toBeTruthy();
        expect(screen.getByText('Twitter')).toBeTruthy();
        expect(screen.getByText('Facebook')).toBeTruthy();
        expect(screen.getByText('Instagram')).toBeTruthy();
        expect(screen.getByText('YouTube')).toBeTruthy();
    });

    it('should display stats section', () => {
        render(<Sidebar />);

        expect(screen.getByText('News Portal Stats')).toBeTruthy();
        expect(screen.getByText('Total Articles')).toBeTruthy();
        expect(screen.getByText('Active Readers')).toBeTruthy();
        expect(screen.getByText('Published Today')).toBeTruthy();
    });

    it('should format time correctly for recent articles', () => {
        render(<Sidebar trendingArticles={mockArticles} />);

        // Should show hours ago for recent articles
        const container = screen.getByText('Trending Article 1').closest('a');
        expect(container?.textContent).toContain('h ago');
    });

    it('should limit trending articles to 5 maximum', () => {
        const manyArticles = Array.from({ length: 10 }, (_, i) => ({
            id: `${i}`,
            title: `Article ${i}`,
            summary: `Summary ${i}`,
            content: 'Content',
            imageUrl: null,
            author: 'Author',
            publishedAt: new Date().toISOString(),
            category: 'tech',
            slug: `article-${i}`,
        }));

        render(<Sidebar trendingArticles={manyArticles} />);

        // Should show only first 5
        expect(screen.getByText('Article 0')).toBeTruthy();
        expect(screen.getByText('Article 4')).toBeTruthy();
        expect(screen.queryByText('Article 5')).toBeNull();
    });

    it('should render ranking numbers for trending articles', () => {
        render(<Sidebar trendingArticles={mockArticles} />);

        const container = render(<Sidebar trendingArticles={mockArticles} />).container;

        // Check for ranking numbers 1, 2, 3
        expect(container.textContent).toContain('1');
        expect(container.textContent).toContain('2');
        expect(container.textContent).toContain('3');
    });

    it('should have proper link navigation for trending articles', () => {
        render(<Sidebar trendingArticles={mockArticles} />);

        const link = screen.getByText('Trending Article 1').closest('a');
        expect(link?.getAttribute('href')).toBe('/article/1');
    });

    it('should have proper link navigation for categories', () => {
        render(<Sidebar />);

        const techLink = screen.getByText('Technology').closest('a');
        expect(techLink?.getAttribute('href')).toBe('/category/tech');
    });
});
