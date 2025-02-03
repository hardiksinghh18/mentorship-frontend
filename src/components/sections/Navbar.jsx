import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLoggedOut } from '../../redux/actions/authActions';
import { FaRegUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { RiChatSmile3Line } from "react-icons/ri";

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const menuClass = "text-xs md:text-sm lg:text-sm font-semibold text-center relative bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white hover:scale-105 transition-all duration-500";

    const handleLogout = () => {
        dispatch(setLoggedOut());
        navigate('/login');
    };

    const handleScroll = () => {
        if (window.scrollY <= 0) {
            setShowNavbar(true); // Always show navbar at the top
        } else if (window.scrollY > lastScrollY) {
            setShowNavbar(false); // Hide navbar when scrolling down
        } else {
            setShowNavbar(true); // Show navbar when scrolling up
        }
        setLastScrollY(window.scrollY);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className={` text-white  w-full transition-transform duration-500 z-50 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl flex items-center justify-between transition-all duration-500 py-4 px-4 md:px-8 shadow-sm bg-gradient-to-t from-[#000104] to-slate-800 mx-auto">
                {/* Logo */}
                <Link to="/">
                    <img
                        src="https://via.placeholder.com/100x50.png?text=Mentorship+Platform"
                        alt="Mentorship Platform"
                        className="md:w-16 w-14"
                    />
                </Link>

                {/* Hamburger Icon for mobile */}
                <button className="md:hidden z-40 focus:outline-none" onClick={toggleMenu}>
                    {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>

                {/* Menu for larger screens */}
                <div className="hidden md:flex items-center gap-5">
                    <Link to="/" className={menuClass}>Home</Link>
                    <Link to="/discover" className={menuClass}>Discover</Link>
                    {isLoggedIn && <Link to="/matchmaking" className={menuClass}>Matchmaking</Link>}
                    {isLoggedIn && <Link to="/messages" className={menuClass}>Chats</Link>}

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <Link to={`/profile/${user.username}`} title="View Profile">
                                <FaRegUser className='text-white hover:text-blue-600 font-bold' />
                            </Link>
                            <button className="text-red-500 hover:text-red-700 transition" onClick={handleLogout}>
                                <IoIosLogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className='bg-blue-500 text-white text-xs py-1 px-3 rounded-md hover:bg-blue-700 transition duration-300'
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu (Sliding Drawer) */}
                <div className={`md:hidden absolute top-0 left-0 h-screen w-full bg-black bg-opacity-90 transform transition-all duration-300 ${isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        <Link to="/" className="text-xl font-semibold text-white" onClick={toggleMenu}>Home</Link>
                        <Link to="/discover" className="text-xl font-semibold text-white" onClick={toggleMenu}>Discover</Link>
                        {isLoggedIn && <Link to="/matchmaking" className="text-xl font-semibold text-white" onClick={toggleMenu}>Matchmaking</Link>}
                        {isLoggedIn && <Link to="/messages" className="text-xl font-semibold text-white" onClick={toggleMenu}>Chats</Link>}
                        
                        {isLoggedIn ? (
                            <>
                                <Link to={`/profile/${user.username}`} className="text-xl font-semibold text-white" onClick={toggleMenu}>Profile</Link>
                                <button className="text-xl font-semibold text-red-500" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="text-xl font-semibold text-white" onClick={toggleMenu}>Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
