import React from "react";

const ProfileLoader = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-12 pb-20 md:pb-12 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Profile Info Skeleton */}
                <div className="lg:col-span-2">
                    <div className="bg-white/[0.02] rounded-[2.5rem] border border-white/[0.03] overflow-hidden">
                        {/* Banner */}
                        <div className="h-40 bg-white/[0.02]" />
                        
                        <div className="relative px-8 pb-10">
                            {/* Avatar */}
                            <div className="absolute -top-16 left-8 w-32 h-32 bg-zinc-900 rounded-[2rem] border-4 border-black" />
                            
                            <div className="pt-20 space-y-6">
                                <div className="space-y-4">
                                    <div className="h-10 w-64 bg-white/5 rounded-lg" />
                                    <div className="h-4 w-32 bg-white/5 rounded-lg" />
                                    <div className="flex gap-6 pt-4">
                                        <div className="h-4 w-40 bg-white/5 rounded-lg" />
                                        <div className="h-4 w-24 bg-white/5 rounded-lg" />
                                    </div>
                                </div>

                                <div className="flex gap-12 pt-8 border-t border-white/[0.03]">
                                    <div className="space-y-2">
                                        <div className="h-8 w-12 bg-white/5 rounded-lg" />
                                        <div className="h-3 w-20 bg-white/5 rounded-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-8 w-12 bg-white/5 rounded-lg" />
                                        <div className="h-3 w-24 bg-white/5 rounded-lg" />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-12">
                                    <div className="h-3 w-32 bg-white/5 rounded-lg" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-white/5 rounded-lg" />
                                        <div className="h-4 w-[90%] bg-white/5 rounded-lg" />
                                        <div className="h-4 w-[75%] bg-white/5 rounded-lg" />
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8">
                                    <div className="h-3 w-32 bg-white/5 rounded-lg" />
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div key={i} className="h-8 w-24 bg-white/5 rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeletons */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Requests Skeleton */}
                    <div className="bg-white/[0.02] rounded-[2rem] border border-white/[0.03] p-8 space-y-8">
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-white/5 rounded-lg" />
                            <div className="h-6 w-48 bg-white/5 rounded-lg" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 rounded-xl border border-white/5 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 rounded-lg" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-white/5 rounded-lg" />
                                            <div className="h-3 w-20 bg-white/5 rounded-lg" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-10 bg-white/5 rounded-lg" />
                                        <div className="w-12 h-10 bg-white/5 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Network Skeleton */}
                    <div className="bg-white/[0.02] rounded-[2rem] border border-white/[0.03] p-8 space-y-8">
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-white/5 rounded-lg" />
                            <div className="h-6 w-48 bg-white/5 rounded-lg" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/5 rounded-lg" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-32 bg-white/5 rounded-lg" />
                                        <div className="h-2 w-20 bg-white/5 rounded-lg" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLoader;
