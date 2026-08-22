import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="relative bg-white text-zinc-900 min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-40 md:pb-20">
            {/* Background Spotlights */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/20 blur-[130px] rounded-full pointer-events-none animate-glow opacity-50" />

            <div className="container mx-auto px-6 lg:px-24 relative z-10 flex flex-col items-center text-center max-w-5xl">


                {/* Text Content */}
                <div className="flex flex-col items-center space-y-10 animate-in fade-in slide-in-from-bottom duration-1000">
                    {/* Badge */}


                    <div className="space-y-8">
                        <h1 className="text-xl lg:text-3xl font-bold tracking-tight leading-[0.9] text-zinc-900">
                            Transform Your Career <br />
                            <span className="text-zinc-400 lowercase italic font-serif">with</span>{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-[#00b4d8] via-[#7b2cbf] to-[#00b4d8] bg-[length:200%_auto] bg-clip-text text-transparent font-black tracking-tighter">
                                    SkillSync
                                </span>
                            </span>
                        </h1>

                        <p className="text-zinc-600 text-sm lg:text-base max-w-3xl mx-auto leading-relaxed font-medium">
                            Unlock your full potential with personalized mentorship from industry leaders.
                            SkillSync connects you with expert mentors to guide your professional growth
                            at every stage of your journey.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-6">
                        <Link
                            to="/register"
                            className="px-10 py-3 bg-zinc-900 text-white rounded-full font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center space-x-2 shadow-md group"
                        >
                            <span>Get Started</span>
                            <span className="text-xl font-light group-hover:translate-x-1 transition-transform">›</span>
                        </Link>

                        <Link
                            to="/features"
                            className="relative group p-[2px] rounded-full overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-emerald-500/50 opacity-100 group-hover:opacity-100 transition-opacity" />
                            <div className="relative px-8 py-2 bg-zinc-900 text-white rounded-full flex items-center space-x-2 transition-colors hover:bg-zinc-800">
                                <span className="text-sm font-bold tracking-tight text-white/80 group-hover:text-white transition-colors">Features</span>
                                <span className="text-lg text-white/40 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all italic">›</span>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

