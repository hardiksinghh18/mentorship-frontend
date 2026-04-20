import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiMessageSquare, FiUser } from 'react-icons/fi';
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
    const location = useLocation();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { hideMobileNav } = useSelector((state) => state.ui);

    // Desktop Navigation Items
    const DesktopNavItem = ({ to, children }) => (
        <Link
            to={to}
            className={`px-4 py-2 hover:text-white font-medium transition-colors text-sm ${location.pathname === to ? 'text-white' : 'text-muted'
                }`}
        >
            {children}
        </Link>
    );

    // Mobile Navigation Icon
    const MobileNavIcon = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className={`flex flex-col items-center transition-colors ${location.pathname === to ? 'text-white' : 'text-muted'}`}
        >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
        </Link>
    );

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
                <div className="mx-auto px-2 md:px-16 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center group">
                        <img 
                            src={require('../../assets/skillsyncLogo.png')} 
                            alt="SkillSync Logo" 
                            className="h-8 md:h-10 w-auto"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2">
                        <DesktopNavItem to="/">Home</DesktopNavItem>
                        {isLoggedIn && (
                            <>
                                <DesktopNavItem to="/explore">Explore</DesktopNavItem>
                                <DesktopNavItem to="/messages">Chats</DesktopNavItem>
                            </>
                        )}
                        <DesktopNavItem to="/features">Features</DesktopNavItem>

                        
                        <div className="flex items-center pl-4 ml-4 border-l border-white/10">
                            {isLoggedIn ? (
                                <Link
                                    to={`/profile/${user.username}`}
                                    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
                                >
                                    <FaRegUser className="h-4 w-4 text-white" />
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {isLoggedIn && !hideMobileNav && (
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300">
                    <div className="flex justify-around items-center py-4">
                        <MobileNavIcon to="/" icon={FiHome} label="Home" />
                        <MobileNavIcon to="/explore" icon={FiSearch} label="Explore" />
                        <MobileNavIcon to="/messages" icon={FiMessageSquare} label="Chats" />
                        <MobileNavIcon
                            to={`/profile/${user.username}`}
                            icon={FiUser}
                            label="Profile"
                        />
                    </div>
                </div>
            )}

        </>
    );
};

export default Navbar;
