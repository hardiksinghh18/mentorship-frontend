import React from 'react';
import heropng from '../../assets/heropng.webp'
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-b from-[#000104] to-slate-800 text-white min-h-screen flex items-center">
            <div className="container mx-auto mt-12 px-6 md:px-12 lg:px-20 flex flex-col-reverse lg:flex-row items-center gap-10">
                {/* Text Content */}
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
                        Unlock the Power of <span className="text-blue-500">Mentorship</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8">
                        Connect with skilled mentors and passionate mentees to achieve your personal and professional goals.
                        Join a community where growth and learning go hand in hand.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center lg:justify-start">
                        <Link 
                            to={"/register"}
                            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Get Started
                        </Link>
                        <Link 
                            to={"/about"}
                            className="px-6 py-3 rounded-lg border border-gray-500 text-gray-300 hover:text-white hover:border-white font-semibold transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Image/Illustration */}
                <div className="flex-1">
                    <img 
                        src={heropng} 
                        alt="Mentorship Platform Illustration" 
                        className="rounded-lg mx-auto lg:mx-0"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
