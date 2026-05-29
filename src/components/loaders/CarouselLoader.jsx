import React from 'react';

const CarouselLoader = () => (
    <div className="flex gap-6 overflow-x-hidden pb-6">
        {[1, 2, 3].map((i) => (
            <div key={i} className="w-[300px] shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-5 animate-pulse flex flex-col justify-between h-[250px]">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5"></div>
                        <div className="space-y-2">
                            <div className="h-2.5 w-24 bg-white/5 rounded"></div>
                            <div className="h-2 w-12 bg-white/5 rounded"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2.5 w-full bg-white/5 rounded"></div>
                        <div className="h-2.5 w-4/5 bg-white/5 rounded"></div>
                    </div>
                    {/* Tags Area Skeletons (Distinct Rows) */}
                    <div className="space-y-1.5 pt-1">
                        {/* Row 1 AI Skeletons */}
                        <div className="flex gap-1.5">
                            <div className="h-3.5 w-16 bg-white/5 rounded"></div>
                            <div className="h-3.5 w-20 bg-white/5 rounded"></div>
                        </div>
                        {/* Row 2 Skill Skeletons */}
                        <div className="flex gap-1.5">
                            <div className="h-3.5 w-12 bg-white/5 rounded"></div>
                            <div className="h-3.5 w-14 bg-white/5 rounded"></div>
                            <div className="h-3.5 w-10 bg-white/5 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="pt-3 border-t border-white/5 flex justify-end">
                    <div className="h-2.5 w-16 bg-white/5 rounded"></div>
                </div>
            </div>
        ))}
    </div>
);

export default CarouselLoader;
