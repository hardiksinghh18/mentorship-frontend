import React from 'react';

const GlobalLoader = () => {
    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            {/* Sidebar Skeleton (Matching Sidebar.jsx dimensions & layout) */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-24 flex-col items-center py-8 z-[100] bg-zinc-50 border-r border-zinc-200 animate-pulse">
                {/* Logo Placeholder */}
                <div className="w-12 h-12 rounded-2xl bg-zinc-200 mb-12"></div>

                {/* Primary Nav Placeholders */}
                <nav className="flex-1 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/80"></div>
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/80"></div>
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/80"></div>
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/80"></div>
                </nav>

                {/* Bottom Profile Placeholder */}
                <div className="flex flex-col gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-200/80"></div>
                </div>
            </aside>

            {/* Main Content Area (Matching Dashboard.jsx grid & offsets) */}
            <main className="flex-1 md:pl-24 transition-all duration-500 bg-white min-h-screen text-zinc-900 pt-12 pb-16 px-6 md:px-12 lg:px-24 overflow-y-hidden">
                <div className="max-w-7xl mx-auto space-y-12">
                    
                    {/* Header Section Skeleton */}
                    <div className="space-y-4 animate-pulse">
                        <div className="h-10 md:h-12 w-80 md:w-[420px] bg-zinc-200 rounded-2xl"></div>
                        <div className="h-4 w-64 md:w-[480px] bg-zinc-100 rounded-lg"></div>
                    </div>

                    {/* Profile Completion Banner Skeleton */}
                    <div className="h-28 w-full bg-zinc-50 border border-zinc-200 rounded-[2rem] animate-pulse"></div>

                    {/* Suggested Profiles Section Skeleton */}
                    <div className="space-y-6">
                        {/* Carousel Header Skeleton */}
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-zinc-200"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-zinc-200 rounded"></div>
                                    <div className="h-2.5 w-64 bg-zinc-100 rounded"></div>
                                </div>
                            </div>
                        </div>

                        {/* Carousel Cards Row Skeleton (matching CarouselLoader.jsx) */}
                        <div className="flex gap-6 overflow-x-hidden pb-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-[300px] shrink-0 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 animate-pulse flex flex-col justify-between h-[250px] shadow-sm">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-200"></div>
                                            <div className="space-y-2">
                                                <div className="h-2.5 w-24 bg-zinc-200 rounded"></div>
                                                <div className="h-2 w-12 bg-zinc-200 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2.5 w-full bg-zinc-200/80 rounded"></div>
                                            <div className="h-2.5 w-4/5 bg-zinc-200/80 rounded"></div>
                                        </div>
                                        <div className="flex gap-1.5 pt-1">
                                            <div className="h-4 w-14 bg-zinc-200/60 rounded"></div>
                                            <div className="h-4 w-16 bg-zinc-200/60 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-zinc-200 flex justify-end">
                                        <div className="h-2.5 w-16 bg-zinc-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GlobalLoader;
