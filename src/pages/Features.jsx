import React from 'react';
import { coreFeatures } from '../utils/featuresData';

const Features = () => {

    return (
        <div className="bg-white min-h-screen text-zinc-900 pt-12 px-6 lg:px-24 overflow-hidden relative">

            {/* Background Details */}
            <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />


            <div className="max-w-7xl mx-auto relative z-10 pb-32">
                <header className="mb-24 text-center">
                    <h1 className="text-xl lg:text-3xl font-bold tracking-tighter mb-6 text-zinc-900">
                        Engineered for <br />
                        <span className="text-zinc-500 italic font-serif lowercase">Connection</span>
                    </h1>
                    <p className="text-zinc-500 text-xs md:text-sm max-w-2xl mx-auto font-medium">
                        SkillSync is a full-stack mentorship matching platform built on a foundation of modern technologies, speed, and reliability.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 [perspective:2000px]">
                    {coreFeatures.map((feature, i) => (
                        <div
                            key={i}
                            className={`group relative p-10 rounded-[3rem] bg-zinc-50 border border-zinc-200 hover:border-zinc-400 transition-all duration-700 hover:scale-105 hover:rotate-0 hover:z-20 shadow-sm hover:shadow-md ${feature.tilt} ${feature.offset}`}
                        >
                            <div className="flex flex-col h-full justify-between space-y-8">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 mb-8 flex items-center justify-center shadow-inner group-hover:bg-zinc-200 transition-colors">
                                        <span className="text-zinc-700 font-black italic text-lg">0{i + 1}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-4 tracking-tighter text-zinc-900 transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-zinc-500 leading-relaxed font-medium text-[10px] md:text-xs">
                                        {feature.desc}
                                    </p>
                                </div>

                                {/* Bottom Accent Ornament */}
                                <div className="mt-4 flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-all">
                                    <div className={`w-8 h-[2px] bg-gradient-to-r ${feature.color} to-transparent`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{feature.utility}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
