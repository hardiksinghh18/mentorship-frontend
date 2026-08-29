import React from 'react';

const CarouselLoader = () => (
    <div className="flex gap-6 overflow-x-hidden pb-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="w-[300px] shrink-0 bg-zinc-50 border border-zinc-200 rounded-2xl p-5 animate-pulse flex flex-col h-[250px] shadow-sm">
                <div className="space-y-3">
                    {/* Header: Avatar + Name + Role badge */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200"></div>
                        <div className="space-y-1.5">
                            <div className="h-3 w-24 bg-zinc-200 rounded"></div>
                            <div className="h-2.5 w-12 bg-zinc-200/70 rounded"></div>
                        </div>
                    </div>

                    {/* Bio: 2 lines */}
                    <div className="space-y-1.5">
                        <div className="h-2.5 w-full bg-zinc-200/70 rounded"></div>
                        <div className="h-2.5 w-4/5 bg-zinc-200/70 rounded"></div>
                    </div>

                    {/* Experience row */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 bg-zinc-200/60 rounded"></div>
                        <div className="h-2.5 w-36 bg-zinc-200/60 rounded"></div>
                    </div>

                    {/* Skills row (icon + chips) */}
                    <div className="flex gap-2 items-start pt-1">
                        <div className="w-3.5 h-3.5 bg-zinc-200/60 rounded shrink-0 mt-0.5"></div>
                        <div className="flex flex-wrap gap-1.5">
                            <div className="h-4 w-14 bg-zinc-200/50 rounded-[4px]"></div>
                            <div className="h-4 w-16 bg-zinc-200/50 rounded-[4px]"></div>
                            <div className="h-4 w-11 bg-zinc-200/50 rounded-[4px]"></div>
                        </div>
                    </div>

                    {/* AI Insights row (icon + chips) */}
                    <div className="flex gap-2 items-start">
                        <div className="w-3.5 h-3.5 bg-violet-200/40 rounded shrink-0 mt-0.5"></div>
                        <div className="flex flex-wrap gap-1.5">
                            <div className="h-4 w-16 bg-violet-100/50 rounded-[4px]"></div>
                            <div className="h-4 w-20 bg-violet-100/50 rounded-[4px]"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default CarouselLoader;
