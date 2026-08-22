import React from 'react';

const CarouselLoader = () => (
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
                    {/* Tags Area Skeletons (Distinct Rows) */}
                    <div className="space-y-1.5 pt-1">
                        {/* Row 1 AI Skeletons */}
                        <div className="flex gap-1.5">
                            <div className="h-4 w-16 bg-zinc-200/60 rounded"></div>
                            <div className="h-4 w-20 bg-zinc-200/60 rounded"></div>
                        </div>
                        {/* Row 2 Skill Skeletons */}
                        <div className="flex gap-1.5">
                            <div className="h-4 w-12 bg-zinc-200/60 rounded"></div>
                            <div className="h-4 w-14 bg-zinc-200/60 rounded"></div>
                            <div className="h-4 w-10 bg-zinc-200/60 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="pt-3 border-t border-zinc-200 flex justify-end">
                    <div className="h-2.5 w-16 bg-zinc-200 rounded"></div>
                </div>
            </div>
        ))}
    </div>
);

export default CarouselLoader;
