import React from 'react';
import { Link } from 'react-router-dom';
import InteractiveDemo from '../demo/InteractiveDemo';
import logoIcon from '../../assets/synckroIcon.png';

const HeroSection = () => {
    return (
        <div className="w-full min-h-screen bg-white text-zinc-900 flex flex-col">
            {/* Header */}
            <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between" style={{ height: '72px' }}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
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
                    <div className="flex items-center gap-2">
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

            {/* Demo Showcase */}
            <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden pt-4 pb-16">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/20 blur-[130px] rounded-full pointer-events-none animate-glow opacity-50" />

                <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
                    <InteractiveDemo />
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
