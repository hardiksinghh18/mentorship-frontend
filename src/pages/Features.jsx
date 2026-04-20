import React from 'react';
import { coreFeatures } from '../utils/featuresData';

const Features = () => {

    return (
        <div className="bg-black min-h-screen text-white pt-32 px-6 lg:px-24 overflow-hidden relative">

            {/* Background Details */}
            <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />


            <div className="max-w-7xl mx-auto relative z-10 pb-32">
                <header className="mb-24 text-center">
                    <h1 className="text-4xl lg:text-7xl font-bold tracking-tighter mb-6">
                        Engineered for <br />
                        <span className="text-muted italic font-serif lowercase">Connection</span>
                    </h1>
                    <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        SkillSync is a full-stack mentorship matching platform built on a foundation of modern technologies, speed, and reliability.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 [perspective:2000px]">
                    {coreFeatures.map((feature, i) => (
                        <div
                            key={i}
                            className={`group relative p-10 rounded-[3rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:border-white/20 transition-all duration-700 hover:scale-110 hover:rotate-0 hover:z-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] hover:shadow-white/5 [transform-style:preserve-3d] ${feature.tilt} ${feature.offset}`}
                        >
                            {/* Inner 3D depth elements */}
                            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div className="flex flex-col h-full justify-between space-y-8 [transform:translateZ(50px)]">
                                <div>
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-8 flex items-center justify-center shadow-inner group-hover:bg-white/10 transition-colors">
                                        <span className="text-white/40 font-black italic text-lg">0{i + 1}</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4 tracking-tighter text-white/90 group-hover:text-white transition-all transform group-hover:translate-x-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted leading-relaxed font-medium text-base md:text-lg opacity-80 group-hover:opacity-100 transition-opacity">
                                        {feature.desc}
                                    </p>
                                </div>

                                {/* Bottom Accent Ornament */}
                                <div className="mt-4 flex items-center space-x-2 opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                    <div className={`w-8 h-[2px] bg-gradient-to-r ${feature.color} to-transparent`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{feature.utility}</span>
                                </div>
                            </div>

                            {/* Back Glow */}
                            <div className={`absolute -inset-2 bg-gradient-to-r ${feature.color} to-transparent blur-3xl opacity-0 group-hover:opacity-10 transition-opacity rounded-[3rem] pointer-events-none`} />
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
};

export default Features;
