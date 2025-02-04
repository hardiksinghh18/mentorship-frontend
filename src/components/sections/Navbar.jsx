import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setLoggedOut } from '../../redux/actions/authActions';
import { FiHome, FiSearch, FiMessageSquare, FiUser, FiLogOut } from 'react-icons/fi';
import { FaRegUser } from "react-icons/fa";

const Navbar = () => {
    const [lastScrollY, setLastScrollY] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(setLoggedOut());
        navigate('/login');
    };



    // Desktop Navigation Items
    const DesktopNavItem = ({ to, children }) => (
        <Link
            to={to}
            className={`px-4 py-2 hover:text-blue-400 font-semibold transition-colors ${location.pathname === to ? 'text-blue-400' : 'text-gray-300'
                }`}
        >
            {children}
        </Link>
    );

    // Mobile Navigation Icon
    const MobileNavIcon = ({ to, icon: Icon, label }) => (
        <Link
            to={to}
            className="flex flex-col items-center text-gray-300 hover:text-blue-400 transition-colors"
        >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs">{label}</span>
        </Link>
    );

    return (
        <>
            {/* Desktop Navigation */}
            <div className="hidden md:block fixed top-0 w-full z-50 bg-[#0d0d0d] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Mentorship
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center text-sm space-x-2">
                        <DesktopNavItem to="/">Home</DesktopNavItem>
                        <DesktopNavItem to="/discover">Discover</DesktopNavItem>
                        {isLoggedIn && <DesktopNavItem to="/matchmaking">Matchmaking</DesktopNavItem>}
                        {isLoggedIn && <DesktopNavItem to="/messages">Chats</DesktopNavItem>}
                        {/* User Section */}
                        <div className="flex items-center space-x-4">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        to={`/profile/${user.username}`}
                                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                                    >
                                        <FaRegUser className="h-5 w-5 text-gray-300" />
                                    </Link>

                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>


                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            {isLoggedIn && (
                <div className="md:hidden fixed bottom-0 w-full z-50 bg-[#0d0d0d] border-t border-gray-800">
                    <div className="flex justify-around items-center py-3">
                        <MobileNavIcon to="/" icon={FiHome} label="Home" />
                        <MobileNavIcon to="/discover" icon={FiSearch} label="Discover" />
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