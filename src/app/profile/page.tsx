import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Layout from '@/components/Layout';
import Link from 'next/link';

export const metadata = {
    title: 'My Profile',
    description: 'Manage your news portal profile and preferences',
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session) {
        redirect('/auth/login');
    }

    // In production, fetch user stats from database
    const userStats = {
        articlesRead: 47,
        articlesSaved: 12,
        readingStreak: 5,
        totalReadingTime: 320, // minutes
        joinedDate: '2024-01-15',
        favoriteCategory: 'Technology',
    };

    const savedArticles = [
        {
            id: '1',
            title: 'Breaking: Major Technology Breakthrough Announced',
            category: 'tech',
            savedAt: '2024-01-20',
        },
        // More saved articles would come from database
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg">
                            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-2">
                                {session.user?.name || 'User'}
                            </h1>
                            <p className="text-blue-100 mb-4">{session.user?.email || ''}</p>
                            <p className="text-sm text-blue-200">
                                Member since {new Date(userStats.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        {/* Edit Button */}
                        <Link
                            href="/profile/edit"
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Articles Read */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{userStats.articlesRead}</p>
                                <p className="text-sm text-gray-600">Articles Read</p>
                            </div>
                        </div>
                    </div>

                    {/* Articles Saved */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{userStats.articlesSaved}</p>
                                <p className="text-sm text-gray-600">Saved Articles</p>
                            </div>
                        </div>
                    </div>

                    {/* Reading Streak */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{userStats.readingStreak}</p>
                                <p className="text-sm text-gray-600">Day Streak 🔥</p>
                            </div>
                        </div>
                    </div>

                    {/* Reading Time */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{Math.floor(userStats.totalReadingTime / 60)}h</p>
                                <p className="text-sm text-gray-600">Reading Time</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Favorite Category */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Reading Habits</h2>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <span className="text-3xl">💻</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900">Favorite Category</p>
                            <p className="text-gray-600">{userStats.favoriteCategory}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link
                        href="/saved"
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Saved Articles</p>
                                <p className="text-sm text-gray-600">View your reading list</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/settings"
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Settings</p>
                                <p className="text-sm text-gray-600">Manage preferences</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-lg p-6 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Home</p>
                                <p className="text-sm text-gray-600">Back to news feed</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
