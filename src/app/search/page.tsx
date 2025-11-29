import { searchArticles } from '@/services/newsApi';
import Layout from '@/components/Layout';
import ArticleGrid from '@/components/ArticleGrid';
import EmptyState from '@/components/EmptyState';

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q || '';

    if (!query) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-12 px-4">
                    <EmptyState message="Please enter a search term to find articles." />
                </div>
            </Layout>
        );
    }

    const articles = await searchArticles(query);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Search Results for <span className="text-blue-600">"{query}"</span>
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Found {articles.length} result{articles.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {articles.length > 0 ? (
                    <ArticleGrid articles={articles} />
                ) : (
                    <EmptyState message={`No articles found matching "${query}". Try different keywords.`} />
                )}
            </div>
        </Layout>
    );
}
