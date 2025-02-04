import React from 'react';
import heropng from '../../assets/heropng.webp';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="bg-[#0d0d0d] text-white flex h-auto lg:h-screen pt-8 lg:pt-16 items-center">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left">
                    <div className="max-w-2xl mx-auto lg:mx-0">
                        <h1 className="text-2xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4 md:mb-6">
                            Transform Your Career with{' '}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Smart Mentorship
                            </span>
                        </h1>
                        <p className="text-sm md:text-lg lg:text-xl text-gray-400 mb-6 md:mb-10 leading-relaxed">
                            Connect with industry experts and ambitious peers in a professional network designed for
                            meaningful growth. Exchange knowledge, build relationships, and accelerate your career.
                        </p>
                        <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center lg:justify-start">
                            <Link
                                to="/discover"
                                className="px-6 py-3 md:px-8 md:py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold 
                                       shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm md:text-base"
                            >
                                Explore Mentors
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Image/Illustration */}
                <div className="flex-1 flex justify-center w-full mt-8 lg:mt-0">
                    <div className="relative max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
                        <img
                            src={heropng}
                            alt="Professional network illustration"
                            className="rounded-lg mx-auto lg:mx-0 w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;