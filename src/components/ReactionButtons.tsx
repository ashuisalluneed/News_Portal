'use client';

import { useState } from 'react';

export default function ReactionButtons() {
    const [reactions, setReactions] = useState({
        like: { count: 45, active: false, icon: '👍', label: 'Like' },
        love: { count: 23, active: false, icon: '❤️', label: 'Love' },
        wow: { count: 12, active: false, icon: '😮', label: 'Wow' },
        sad: { count: 2, active: false, icon: '😢', label: 'Sad' },
        angry: { count: 0, active: false, icon: '😡', label: 'Angry' },
    });

    const handleReaction = (type: keyof typeof reactions) => {
        setReactions((prev) => {
            const current = prev[type];
            return {
                ...prev,
                [type]: {
                    ...current,
                    count: current.active ? current.count - 1 : current.count + 1,
                    active: !current.active,
                },
            };
        });
    };

    return (
        <div className="py-8 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                What do you think?
            </h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {(Object.keys(reactions) as Array<keyof typeof reactions>).map((type) => {
                    const reaction = reactions[type];
                    return (
                        <button
                            key={type}
                            onClick={() => handleReaction(type)}
                            className={`group flex flex-col items-center gap-2 transition-all duration-200 ${reaction.active ? 'scale-110' : 'hover:scale-110'
                                }`}
                        >
                            <div
                                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-sm border transition-all duration-200 ${reaction.active
                                        ? 'bg-blue-50 border-blue-200 shadow-md transform -translate-y-1'
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`transform transition-transform duration-200 ${reaction.active ? 'scale-125' : 'group-hover:scale-125'}`}>
                                    {reaction.icon}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`text-xs font-semibold ${reaction.active ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {reaction.label}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {reaction.count}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
