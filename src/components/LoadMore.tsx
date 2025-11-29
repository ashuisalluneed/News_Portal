'use client';

import { useState } from 'react';

export default function LoadMore() {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const handleLoadMore = async () => {
        setLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setPage(page + 1);
        setLoading(false);

        // In a real app, this would fetch more articles and append them to the list
        // For now, we'll just show a success message or trigger a callback
    };

    return (
        <div className="mt-12 text-center">
            <button
                onClick={handleLoadMore}
                disabled={loading}
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ minWidth: '200px' }}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading Content...
                    </>
                ) : (
                    <>
                        Load More Articles
                        <svg
                            className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </>
                )}
            </button>

            {page > 1 && (
                <p className="mt-4 text-sm text-gray-500 animate-fade-in">
                    Showing page {page} of content
                </p>
            )}
        </div>
    );
}
