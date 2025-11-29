/**
 * Article interface representing a news article
 * Requirements: 1.2, 2.2, 4.1
 */
export interface Article {
  id: string;                    // Unique identifier
  title: string;                 // Article headline
  summary: string;               // Brief description (150-200 chars)
  content: string;               // Full article body
  imageUrl: string | null;       // Article image URL (nullable)
  author: string;                // Article author name
  publishedAt: string;           // ISO 8601 date string
  category: string;              // Article category (e.g., "politics", "sports")
  slug?: string;                 // URL-friendly identifier (optional)
  url?: string;                  // Original article URL (from NewsAPI)
  source?: {                     // Source information
    id: string | null;
    name: string;
  };
}
