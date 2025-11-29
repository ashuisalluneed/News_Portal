import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';

/**
 * Related Articles Component
 * Shows similar articles based on category
 */
interface RelatedArticlesProps {
    currentArticleId: string;
    category: string;
    articles: Article[];
    limit?: number;
}

export default function RelatedArticles({
    currentArticleId,
    category,
    articles,
    limit = 3,
}: RelatedArticlesProps) {
    // Filter articles: same category, exclude current article
    const relatedArticles = articles
        .filter(
            (article) =>
                article.id !== currentArticleId && article.category === category
        )
        .slice(0, limit);

    if (relatedArticles.length === 0) {
        return null;
    }

    return (
        <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Related Articles
                </h2>
                <p className="text-gray-600">
                    More from {category.charAt(0).toUpperCase() + category.slice(1)}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}
