import React from 'react';

const RoadmapsLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-zinc-200/80 rounded-[24px] p-8 flex flex-col justify-between h-[340px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                <div>
                    {/* Header Info */}
                    <div className="flex justify-between items-center gap-3 mb-6 pb-4 border-b border-zinc-100/60">
                        <div className="h-5 w-24 bg-zinc-200/80 rounded-full"></div>
                        <div className="flex gap-2">
                            <div className="h-5 w-20 bg-zinc-200/80 rounded-full"></div>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2.5 mb-6">
                        <div className="h-5 w-3/4 bg-zinc-200 rounded"></div>
                        <div className="h-3 w-full bg-zinc-200/70 rounded"></div>
                        <div className="h-3 w-5/6 bg-zinc-200/70 rounded"></div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-1.5 mb-6">
                        <div className="h-5 w-14 bg-zinc-200/60 rounded-[4px]"></div>
                        <div className="h-5 w-16 bg-zinc-200/60 rounded-[4px]"></div>
                        <div className="h-5 w-12 bg-zinc-200/60 rounded-[4px]"></div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="pt-5 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-200"></div>
                        <div className="space-y-1.5">
                            <div className="h-2 w-12 bg-zinc-200/60 rounded"></div>
                            <div className="h-3 w-20 bg-zinc-200 rounded"></div>
                        </div>
                    </div>
                    <div className="h-8 w-24 bg-zinc-200 rounded-2xl"></div>
                </div>
            </div>
        ))}
    </div>
);

export default RoadmapsLoader;
