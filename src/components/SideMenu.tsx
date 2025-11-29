'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';

/**
 * Enhanced SideMenu component with swipe gestures, search, dark mode, and more
 */
interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
    notificationCount?: number;
}

export default function SideMenu({ isOpen, onClose, notificationCount = 0 }: SideMenuProps) {
    const { data: session, status } = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState('en');
    const menuRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    // Load saved language
    useEffect(() => {
        const savedLang = localStorage.getItem('app-language');
        if (savedLang) setLanguage(savedLang);
    }, []);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    ];

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        localStorage.setItem('app-language', newLang);

        // Simulate language change with a toast (in a real app, this would trigger i18n)
        const langName = languages.find(l => l.code === newLang)?.name;
        alert(`Language changed to ${langName}`); // Simple feedback for now
    };

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close menu on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Swipe gesture handling
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            touchEndX.current = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            if (isOpen) {
                // Swipe left to close (user swipes from right to left)
                if (touchStartX.current - touchEndX.current > 50) {
                    onClose();
                }
            } else {
                // Swipe right from edge to open (user swipes from left to right)
                if (touchStartX.current < 30 && touchEndX.current - touchStartX.current > 50) {
                    // This would open, but we'll handle this in a parent component
                }
            }

            touchStartX.current = 0;
            touchEndX.current = 0;
        };

        if (menuRef.current) {
            menuRef.current.addEventListener('touchstart', handleTouchStart);
            menuRef.current.addEventListener('touchmove', handleTouchMove);
            menuRef.current.addEventListener('touchend', handleTouchEnd);
        }

        const currentRef = menuRef.current;
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('touchstart', handleTouchStart);
                currentRef.removeEventListener('touchmove', handleTouchMove);
                currentRef.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [isOpen, onClose]);

    const handleSignOut = async () => {
        onClose();
        await signOut({ callbackUrl: '/' });
    };

    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            onClose();
        }
    };

    const navLinks = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/#latest', label: 'Latest News', icon: '📰' },
        { href: '/category/tech', label: 'Technology', icon: '💻' },
        { href: '/category/politics', label: 'Politics', icon: '🏛️' },
        { href: '/category/sports', label: 'Sports', icon: '⚽' },
        { href: '/category/business', label: 'Business', icon: '💼' },
        { href: '/category/entertainment', label: 'Entertainment', icon: '🎬' },
        { href: '/category/health', label: 'Health', icon: '🏥' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-[60] ${isOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Side Drawer */}
            <div
                ref={menuRef}
                className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[70] overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl">📰</div>
                        <h2 className="text-xl font-bold text-white">News Portal</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                        aria-label="Close menu"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search news..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white text-gray-900 placeholder-gray-500"
                            style={{ minHeight: '44px' }}
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>
                </div>

                {/* User Section */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    {status === 'loading' ? (
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
                            <div className="flex-1">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 animate-pulse" />
                                <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                    ) : session ? (
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {session.user?.name || 'User'}
                                </h3>
                                <p className="text-sm text-gray-500 truncate">
                                    {session.user?.email || ''}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Link
                                href="/auth/login"
                                onClick={onClose}
                                className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                                style={{ minHeight: '44px' }}
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/signup"
                                onClick={onClose}
                                className="block w-full text-center px-4 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                                style={{ minHeight: '44px' }}
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>

                {/* Settings: Language */}
                <div className="px-6 py-4 border-b border-gray-200">
                    {/* Language Selector */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">🌐</span>
                            <span className="font-medium text-gray-700">Language</span>
                        </div>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium bg-white text-gray-900"
                            style={{ minHeight: '44px' }}
                        >
                            {languages.map((lang) => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="px-4 py-4">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                            Navigation
                        </p>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors group"
                                style={{ minHeight: '44px' }}
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                    {link.icon}
                                </span>
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* User Menu Items (if logged in) */}
                {session && (
                    <div className="px-4 py-4 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                            Account
                        </p>
                        <div className="space-y-1">
                            <Link
                                href="/profile"
                                onClick={onClose}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                style={{ minHeight: '44px' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-medium">My Profile</span>
                            </Link>

                            <Link
                                href="/saved"
                                onClick={onClose}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                style={{ minHeight: '44px' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span className="font-medium">Saved Articles</span>
                            </Link>

                            <Link
                                href="/settings"
                                onClick={onClose}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                                style={{ minHeight: '44px' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium">Settings</span>
                            </Link>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                style={{ minHeight: '44px' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Social Links */}
                <div className="px-4 py-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                        Follow Us
                    </p>
                    <div className="grid grid-cols-4 gap-2 px-3">
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                            aria-label="Twitter"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                            </svg>
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            aria-label="Facebook"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                            aria-label="Instagram"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="white" strokeWidth="2" fill="none" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" strokeWidth="2" />
                            </svg>
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            aria-label="YouTube"
                            style={{ minWidth: '44px', minHeight: '44px' }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">
                        © 2024 News Portal. All rights reserved.
                    </p>
                    <div className="flex justify-center space-x-4 mt-2">
                        <Link href="/privacy" onClick={onClose} className="text-xs text-blue-600 hover:text-blue-700">
                            Privacy
                        </Link>
                        <Link href="/terms" onClick={onClose} className="text-xs text-blue-600 hover:text-blue-700">
                            Terms
                        </Link>
                        <Link href="/contact" onClick={onClose} className="text-xs text-blue-600 hover:text-blue-700">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
