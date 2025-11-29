import { Article } from '@/types/article';

/**
 * Mock article data for fallback when API is unavailable
 * NOTE: These are clearly labeled as placeholders to avoid spreading misinformation.
 */
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'News Service Unavailable (Demo Mode)',
    summary: 'We are currently unable to fetch the latest headlines. This is a placeholder article to demonstrate the layout.',
    content: 'The application is currently running in demo mode because the news API service is unavailable or the daily quota has been exceeded. To view real news, please ensure a valid API key is configured in the environment variables. In the meantime, feel free to explore the application\'s features and responsive design using these placeholder articles.',
    imageUrl: null,
    author: 'System Admin',
    publishedAt: new Date().toISOString(),
    category: 'general',
    slug: 'system-status-demo-mode',
    url: '#',
    source: { id: 'system', name: 'System Message' }
  },
  {
    id: '2',
    title: 'Welcome to NewsPortal',
    summary: 'Experience the latest in news aggregation technology. Fast, reliable, and user-friendly.',
    content: 'NewsPortal is designed to bring you the latest stories from around the world (or specifically India, based on your settings). This project showcases modern web development practices using Next.js, Tailwind CSS, and TypeScript. Features include server-side rendering, responsive layouts, and dynamic routing.',
    imageUrl: null,
    author: 'Dev Team',
    publishedAt: new Date().toISOString(),
    category: 'tech',
    slug: 'welcome-to-newsportal',
    url: '#',
    source: { id: 'news-portal', name: 'NewsPortal' }
  },
  {
    id: '3',
    title: 'Feature Showcase: Responsive Design',
    summary: 'This website adapts seamlessly to any screen size, ensuring a great reading experience on mobile, tablet, and desktop.',
    content: 'Try resizing your browser window or viewing this site on a mobile device. You will notice how the grid layout adjusts, the navigation menu transforms, and the typography scales for optimal readability. This responsiveness is core to our user experience philosophy.',
    imageUrl: null,
    author: 'Design Team',
    publishedAt: new Date().toISOString(),
    category: 'tech',
    slug: 'feature-showcase-responsive',
    url: '#',
    source: { id: 'design', name: 'Design Blog' }
  },
  {
    id: '4',
    title: 'Please Configure API Keys',
    summary: 'To see real news content, the administrator needs to add valid API keys to the hosting platform.',
    content: 'If you are the developer, please check your .env.local file or your deployment settings (e.g., Vercel Environment Variables). You need a valid key for NewsAPI.org or GNews.io. Once configured, this placeholder content will automatically be replaced by live headlines.',
    imageUrl: null,
    author: 'Setup Guide',
    publishedAt: new Date().toISOString(),
    category: 'business',
    slug: 'configure-api-keys',
    url: '#',
    source: { id: 'docs', name: 'Documentation' }
  },
  {
    id: '5',
    title: 'Sample Article: Sports Category',
    summary: 'This is a placeholder to show how sports news would appear in the grid layout.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    imageUrl: null,
    author: 'Demo User',
    publishedAt: new Date().toISOString(),
    category: 'sports',
    slug: 'sample-sports-article',
    url: '#',
    source: { id: 'demo', name: 'Demo Source' }
  },
  {
    id: '6',
    title: 'Sample Article: Entertainment',
    summary: 'This is a placeholder to show how entertainment news would appear in the grid layout.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    imageUrl: null,
    author: 'Demo User',
    publishedAt: new Date().toISOString(),
    category: 'entertainment',
    slug: 'sample-entertainment-article',
    url: '#',
    source: { id: 'demo', name: 'Demo Source' }
  }
];
