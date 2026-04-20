import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="min-h-screen bg-black overflow-hidden selection:bg-white selection:text-black">
            {/* Nav Skeleton */}
            <div className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
                <div className="mx-auto px-6 md:px-16 py-5 flex items-center justify-between">
                    <div className="w-32 h-6 bg-white/[0.05] rounded-lg animate-pulse"></div>
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="w-16 h-4 bg-white/[0.02] rounded-full animate-pulse"></div>
                        <div className="w-16 h-4 bg-white/[0.02] rounded-full animate-pulse"></div>
                        <div className="w-16 h-4 bg-white/[0.02] rounded-full animate-pulse"></div>
                        <div className="w-10 h-10 bg-white/[0.05] rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="mx-auto px-6 md:px-16 pt-40 space-y-20">
                {/* Header Skeleton */}
                <div className="space-y-6 max-w-3xl">
                    <div className="space-y-3">
                        <div className="h-16 md:h-20 w-3/4 bg-white/[0.05] rounded-3xl animate-pulse"></div>
                        <div className="h-16 md:h-20 w-1/2 bg-white/[0.02] rounded-3xl animate-pulse"></div>
                    </div>
                    <div className="h-4 w-96 max-w-full bg-white/[0.02] rounded-lg animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 space-y-6 animate-pulse">
                            <div className="w-12 h-12 bg-white/[0.05] rounded-2xl"></div>
                            <div className="space-y-3">
                                <div className="h-2 w-20 bg-white/[0.05] rounded-full"></div>
                                <div className="h-8 w-32 bg-white/[0.05] rounded-xl"></div>
                                <div className="h-4 w-full bg-white/[0.02] rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
