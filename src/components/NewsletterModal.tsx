'use client';

import { useState, useEffect } from 'react';

/**
 * Newsletter Popup Modal
 * Collects email subscriptions with beautiful design
 */
export default function NewsletterModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    // Show modal after 10 seconds (only once per session)
    useEffect(() => {
        // Check if running in browser
        if (typeof window !== 'undefined') {
            const hasSeenNewsletter = sessionStorage.getItem('hasSeenNewsletter');
            if (!hasSeenNewsletter) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                    sessionStorage.setItem('hasSeenNewsletter', 'true');
                }, 10000); // 10 seconds

                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setSubscribed(true);
        setLoading(false);

        // Close after 2 seconds
        setTimeout(() => {
            setIsOpen(false);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {subscribed ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h3>
                        <p className="text-gray-600">
                            Thank you for subscribing. Check your inbox for confirmation.
                        </p>
                    </div>
                ) : (
                    /* Subscription Form */
                    <>
                        {/* Header with Gradient */}
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
                            <div className="text-5xl mb-4">📬</div>
                            <h2 className="text-2xl font-bold mb-2">Stay in the Loop!</h2>
                            <p className="text-blue-100">
                                Get the latest news delivered straight to your inbox
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="newsletter-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            Subscribe Now
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="mt-4 text-xs text-gray-500 text-center">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </form>
                    </>
                )}
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
