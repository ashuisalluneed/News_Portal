'use client';

import { useEffect } from 'react';
import ErrorMessage from '@/components/ErrorMessage';
import Layout from '@/components/Layout';

/**
 * Error boundary for homepage
 * Requirements: 8.2
 * 
 * Catches errors during data fetching and provides retry functionality
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
        console.error('Homepage error:', error);
    }, [error]);

    return (
        <Layout>
            <ErrorMessage
                message={
                    error.message ||
                    'Failed to load news articles. Please check your connection and try again.'
                }
                onRetry={reset}
            />
        </Layout>
    );
}
