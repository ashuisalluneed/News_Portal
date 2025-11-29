import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ReadingProgress from './ReadingProgress';
import BackToTop from './BackToTop';
import ErrorBoundary from './ErrorBoundary';
import BreakingNewsBanner from './BreakingNewsBanner';
import NewsletterModal from './NewsletterModal';
import FloatingWeather from './FloatingWeather';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Force light mode cleanup
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
  }

  return (
    <ErrorBoundary>
      <ReadingProgress />
      <BreakingNewsBanner />
      <NewsletterModal />
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <FloatingWeather />
        {/* Add padding-top to account for fixed header (Mobile: ~72px, Desktop: ~112px) */}
        <main className="flex-grow pt-[72px] lg:pt-[112px]">
          {children}
        </main>
        <Footer />
      </div>
      <BackToTop />
    </ErrorBoundary>
  );
}
