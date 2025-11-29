'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Save Article Button
 * Bookmark articles for later reading
 */
interface SaveArticleButtonProps {
    articleId: string;
    articleTitle: string;
}

export default function SaveArticleButton({
    articleId,
    articleTitle,
}: SaveArticleButtonProps) {
    const { data: session } = useSession();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if article is already saved
    useEffect(() => {
        if (session) {
            const savedArticles = JSON.parse(
                localStorage.getItem('savedArticles') || '[]'
            );
            setIsSaved(savedArticles.includes(articleId));
        }
    }, [session, articleId]);

    const toggleSave = async () => {
        if (!session) {
            // Redirect to login
            window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        setIsLoading(true);

        try {
            const savedArticles = JSON.parse(
                localStorage.getItem('savedArticles') || '[]'
            );

            if (isSaved) {
                // Remove from saved
                const updated = savedArticles.filter((id: string) => id !== articleId);
                localStorage.setItem('savedArticles', JSON.stringify(updated));
                setIsSaved(false);
            } else {
                // Add to saved
                savedArticles.push(articleId);
                localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
                setIsSaved(true);

                // Show toast notification (optional)
                showToast(`"${articleTitle}" saved to your reading list`);
            }
        } catch (error) {
            console.error('Error saving article:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message: string) => {
        // Simple toast implementation
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    return (
        <button
            onClick={toggleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isSaved
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{ minHeight: '44px' }}
            aria-label={isSaved ? 'Remove from saved articles' : 'Save article'}
        >
            <svg
                className={`w-5 h-5 transition-transform ${isSaved ? 'scale-110' : ''}`}
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>
            <span className="hidden sm:inline">
                {isSaved ? 'Saved' : 'Save for later'}
            </span>
        </button>
    );
}
