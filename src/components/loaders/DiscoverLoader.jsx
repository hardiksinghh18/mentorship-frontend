import React from "react";

const DiscoverLoader = () => {
    return (
        <div className="min-h-screen bg-black overflow-hidden animate-pulse pt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative">
                
                {/* Sidebar Filter Skeleton */}
                <div className="hidden md:block w-80 h-screen border-r border-white/[0.03] p-8 space-y-12">
                    <div className="space-y-2">
                        <div className="h-2 w-16 bg-white/[0.02] rounded"></div>
                        <div className="h-px w-8 bg-white/10"></div>
                    </div>
                    
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-2 w-20 bg-white/[0.02] rounded mx-1"></div>
                            <div className="h-14 w-full bg-white/[0.03] rounded-2xl border border-white/[0.05]"></div>
                        </div>
                    ))}
                </div>

                {/* Main Feed Skeleton */}
                <div className="flex-1 p-6 md:p-16 space-y-16">
                    {/* Header Skeleton */}
                    <div className="space-y-6 max-w-3xl">
                        <div className="space-y-3">
                            <div className="h-16 w-3/4 bg-white/[0.05] rounded-3xl"></div>
                            <div className="h-16 w-1/2 bg-white/[0.02] rounded-3xl"></div>
                        </div>
                        <div className="h-4 w-96 bg-white/[0.02] rounded-lg"></div>
                    </div>

                    {/* Grid Skeleton */}
                    <div className="grid grid-cols-1 gap-12">
                        {[1, 2, 3].map((_, index) => (
                            <div key={index} className="h-72 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-8 flex gap-8">
                                <div className="w-20 h-20 bg-white/[0.05] rounded-2xl shrink-0"></div>
                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3">
                                            <div className="h-6 w-48 bg-white/[0.05] rounded-lg"></div>
                                            <div className="h-3 w-32 bg-white/[0.02] rounded-md"></div>
                                        </div>
                                        <div className="h-10 w-32 bg-white/[0.05] rounded-full"></div>
                                    </div>
                                    <div className="h-4 w-full bg-white/[0.02] rounded-lg"></div>
                                    <div className="flex gap-2 pt-2">
                                        <div className="h-6 w-16 bg-white/[0.03] rounded-lg"></div>
                                        <div className="h-6 w-20 bg-white/[0.03] rounded-lg"></div>
                                        <div className="h-6 w-14 bg-white/[0.03] rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscoverLoader;