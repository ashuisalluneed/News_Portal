'use client';

import { useState } from 'react';

interface VideoPlayerProps {
    thumbnail: string;
    title: string;
    duration: string;
}

export default function VideoPlayer({ thumbnail, title, duration }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="relative rounded-xl overflow-hidden shadow-lg bg-black aspect-video group mb-8">
            {!isPlaying ? (
                <div className="absolute inset-0 cursor-pointer" onClick={() => setIsPlaying(true)}>
                    {/* Thumbnail Image (Placeholder color if no image) */}
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                        {/* In production, use next/image here */}
                        <div className="text-gray-600 font-medium">Video Thumbnail: {title}</div>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-xl transform group-hover:scale-110 transition-all duration-300">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                        {duration}
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <h3 className="text-white font-bold text-lg line-clamp-1">{title}</h3>
                    </div>
                </div>
            ) : (
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(title + " news")}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                ></iframe>
            )}
        </div>
    );
}
