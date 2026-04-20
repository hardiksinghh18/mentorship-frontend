import React from 'react';

const ChatLoader = () => {
    return (
        <div className="max-w-7xl mx-auto w-full flex h-screen bg-black overflow-hidden pt-28 md:border-x md:border-white/5">
            {/* Sidebar Skeleton */}
            <div className="w-full md:w-[380px] flex-shrink-0 bg-black border-r border-white/5 flex flex-col">
                <div className="p-8 md:p-10 space-y-10 flex-col h-full overflow-hidden">
                    <div className="space-y-3">
                        <div className="h-2 w-12 bg-white/[0.02] rounded-full animate-pulse"></div>
                        <div className="h-8 w-32 bg-white/[0.02] rounded-xl animate-pulse"></div>
                    </div>

                    <div className="h-14 bg-white/[0.02] rounded-2xl border border-white/5 animate-pulse"></div>

                    <div className="space-y-6">
                        <div className="h-2 w-20 bg-white/[0.02] rounded-full animate-pulse ml-1"></div>
                        <div className="space-y-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4 p-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-24 bg-white/[0.02] rounded-full animate-pulse"></div>
                                        <div className="h-2 w-16 bg-white/[0.02] rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area Skeleton */}
            <div className="hidden md:flex flex-1 flex-col bg-black overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/[0.02] rounded-xl animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-white/[0.02] rounded-full animate-pulse"></div>
                            <div className="h-2 w-20 bg-white/[0.02] rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-12 space-y-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                            <div className={`h-16 w-1/3 bg-white/[0.02] rounded-3xl animate-pulse ${i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`}></div>
                        </div>
                    ))}
                </div>

                <div className="p-10">
                    <div className="h-16 w-full bg-white/[0.02] rounded-[2rem] border border-white/5 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default ChatLoader;
