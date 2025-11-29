'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Comment {
    id: string;
    author: string;
    avatar: string;
    content: string;
    date: string;
    likes: number;
    replies: Comment[];
}

export default function CommentsSection() {
    const { data: session } = useSession();
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([
        {
            id: '1',
            author: 'Sarah Jenkins',
            avatar: 'S',
            content: 'This is such an insightful article! I really appreciated the detailed analysis of the market trends.',
            date: '2 hours ago',
            likes: 12,
            replies: [
                {
                    id: '2',
                    author: 'Mike Ross',
                    avatar: 'M',
                    content: 'Totally agree, Sarah. The second point was particularly interesting.',
                    date: '1 hour ago',
                    likes: 3,
                    replies: [],
                },
            ],
        },
        {
            id: '3',
            author: 'David Chen',
            avatar: 'D',
            content: 'Great reporting as always. Would love to see a follow-up piece on the international impact.',
            date: '3 hours ago',
            likes: 8,
            replies: [],
        },
    ]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment: Comment = {
            id: Date.now().toString(),
            author: session?.user?.name || 'Guest User',
            avatar: session?.user?.name?.charAt(0).toUpperCase() || 'G',
            content: commentText,
            date: 'Just now',
            likes: 0,
            replies: [],
        };

        setComments([newComment, ...comments]);
        setCommentText('');
    };

    return (
        <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Comments ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
            </h3>

            {/* Comment Input */}
            {session ? (
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {session.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Join the discussion..."
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y transition-all bg-white text-gray-900 placeholder-gray-500"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center mb-10">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Join the conversation</h4>
                    <p className="text-gray-600 mb-4">Sign in to post comments and reply to others.</p>
                    <Link
                        href="/auth/login"
                        className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="animate-fade-in">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                {comment.avatar}
                            </div>
                            <div className="flex-grow">
                                <div className="bg-gray-50 rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-bold text-gray-900">{comment.author}</h4>
                                        <span className="text-sm text-gray-500">{comment.date}</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                                </div>

                                <div className="flex items-center gap-4 mt-2 ml-2">
                                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        {comment.likes} Likes
                                    </button>
                                    <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                                        Reply
                                    </button>
                                </div>

                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                    <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-100 space-y-4">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-3">
                                                <div className="flex-shrink-0 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                    {reply.avatar}
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="bg-gray-50 rounded-2xl p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h5 className="font-bold text-gray-900 text-sm">{reply.author}</h5>
                                                            <span className="text-xs text-gray-500">{reply.date}</span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm">{reply.content}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 ml-2">
                                                        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 transition-colors">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                                            </svg>
                                                            {reply.likes}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
