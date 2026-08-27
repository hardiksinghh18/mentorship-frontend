import React from 'react';
import { Link } from 'react-router-dom';
import InteractiveDemo from '../demo/InteractiveDemo';
import logoIcon from '../../assets/synckroIcon.png';

const HeroSection = () => {
    return (
        <div className="w-full bg-white text-zinc-900 relative overflow-x-hidden">
            {/* Premium Dotted Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)] pointer-events-none z-0" />

            {/* Header */}
            <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100/80">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between" style={{ height: '72px' }}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group relative z-10">
                        <img
                            src={logoIcon}
                            alt="SyncKro"
                            className="w-7 h-7 object-contain filter invert shrink-0 group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="text-base font-extrabold tracking-tight text-zinc-900">
                            SyncKro
                        </span>
                    </Link>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2 relative z-10">
                        <Link
                            to="/login"
                            className="px-5 py-2 rounded-full text-sm font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2 rounded-full text-sm font-semibold bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 active:scale-95"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Content */}
            <section className="relative w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-12 pb-4 text-center flex flex-col items-center z-10">
                {/* Visual badge/chip */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200/60 text-zinc-800 text-xs font-semibold mb-5 shadow-sm hover:border-zinc-300/80 transition-all duration-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    <span className="tracking-tight text-zinc-650">Now in Beta — Join as a founding mentor or student</span>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-950 max-w-3xl leading-[1.1] mb-4">
                    Bridge the Gap Between <br className="hidden md:block"/>
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">Learning & Mastery</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-zinc-650 text-sm md:text-base max-w-2xl leading-relaxed mb-6">
                    SyncKro connects eager students with industry experts. Co-create interactive roadmaps, schedule milestone check-ins, and track career progress in one shared workspace.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-16">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-bold bg-zinc-950 text-white hover:bg-zinc-800 transition-all duration-300 shadow-lg shadow-zinc-950/10 hover:shadow-zinc-950/20 hover:-translate-y-0.5 active:scale-95 text-center flex items-center justify-center gap-2 group"
                    >
                        Get Started for Free
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                    <a
                        href="#demo"
                        className="w-full sm:w-auto px-7 py-3 rounded-full text-sm font-bold border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-center"
                    >
                        See Live Demo
                    </a>
                </div>

                {/* Micro Scroll Indicator */}
                <div className="flex flex-col items-center gap-1 text-[11px] font-semibold text-zinc-400 animate-bounce cursor-pointer mt-4" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
                    <span>Explore Workspace</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </section>

            {/* Demo Showcase */}
            <section id="demo" className="relative w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-6 pb-16 z-10">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/20 blur-[130px] rounded-full pointer-events-none animate-glow opacity-50" />
                <InteractiveDemo />
            </section>
        </div>
    );
};

export default HeroSection;
