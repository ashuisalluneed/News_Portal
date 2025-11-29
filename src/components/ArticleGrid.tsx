import { Article } from '@/types/article';
import ArticleCard from './ArticleCard';

/**
 * ArticleGrid component displays articles in a responsive grid layout
 * Requirements: 1.1, 1.3, 5.1, 5.2, 5.3
 * 
 * Responsive breakpoints:
 * - Mobile (< 768px): 1 column
 * - Tablet (768px+): 2 columns
 * - Desktop with sidebar: auto-adjusts to container
 */
interface ArticleGridProps {
  articles: Article[];
  columns?: number;
}

export default function ArticleGrid({ articles, columns }: ArticleGridProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      data-testid="article-grid"
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
