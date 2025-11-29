'use client';

import { useEffect } from 'react';
import ErrorMessage from '@/components/ErrorMessage';
import Layout from '@/components/Layout';

/**
 * Error boundary for article detail page
 * Requirements: 8.2
 * 
 * Catches errors during article data fetching and provides retry functionality
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Article page error:', error);
    }, [error]);

    return (
        <Layout>
            <ErrorMessage
                message={
                    error.message ||
                    'Failed to load article. Please check your connection and try again.'
                }
                onRetry={reset}
            />
        </Layout>
    );
}
