import { fetchArticles } from '@/services/newsApi';
import Layout from '@/components/Layout';
import ArticleGrid from '@/components/ArticleGrid';
import EmptyState from '@/components/EmptyState';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

const CATEGORY_MAP: Record<string, string> = {
    tech: 'technology',
    politics: 'politics', // NewsAPI doesn't strictly have politics, maps to general usually or needs specific query
    sports: 'sports',
    business: 'business',
    entertainment: 'entertainment',
    health: 'health',
    science: 'science'
};

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const apiCategory = CATEGORY_MAP[slug] || 'general';

    // Capitalize for display
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);

    const articles = await fetchArticles(20, apiCategory);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                        {title} News
                    </h1>
                    <p className="text-gray-500 mt-2">Latest updates and stories from the world of {title}</p>
                </div>

                {articles.length > 0 ? (
                    <ArticleGrid articles={articles} />
                ) : (
                    <EmptyState message={`No articles found in ${title}.`} />
                )}
            </div>
        </Layout>
    );
}
