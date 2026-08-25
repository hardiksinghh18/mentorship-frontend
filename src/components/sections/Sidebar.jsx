import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RiHomeLine, RiHomeFill, RiSearchLine, RiSearchFill, RiMessage3Line, RiMessage3Fill, RiBook3Line, RiBook3Fill } from 'react-icons/ri';
import { FiLogOut } from 'react-icons/fi';
import { FaRegUser, FaUser } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Tooltip, Zoom } from '@mui/material';
import { setLoggedOut } from '../../redux/actions/authActions';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { hideMobileNav } = useSelector((state) => state.ui);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogoutClick = () => setLogoutDialogOpen(true);
    const handleLogoutClose = () => setLogoutDialogOpen(false);
    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false);
        dispatch(setLoggedOut());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const NavItem = ({ to, icon: Icon, filledIcon: FilledIcon, label, active }) => (
        <Tooltip 
            title={label} 
            placement="right" 
            TransitionComponent={Zoom} 
            arrow
            enterDelay={200}
            leaveDelay={0}
        >
            <Link
                to={to}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group relative
                    ${active 
                        ? 'text-zinc-900 bg-zinc-200/80 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'}`}
            >
                {active ? (
                    <FilledIcon size={22} className="scale-110 transition-transform duration-300" />
                ) : (
                    <Icon size={22} className="group-hover:scale-110 transition-transform duration-300" />
                )}
                {active && (
                    <div className="absolute -left-4 w-1 h-6 bg-zinc-900 rounded-r-full shadow-[4px_0_15px_rgba(0,0,0,0.3)]" />
                )}
            </Link>
        </Tooltip>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-24 flex-col items-center py-8 z-[100] bg-white/80 backdrop-blur-2xl border-r border-zinc-200">
                {/* Logo */}
                <Link to="/" className="mb-12 group">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-all duration-500">
                        <img 
                            src={require('../../assets/synckroIcon.png')} 
                            alt="SyncKro Logo" 
                            className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.1)] filter invert"
                        />
                    </div>
                </Link>

                {/* Primary Navigation */}
                <nav className="flex-1 flex flex-col gap-4">
                    <NavItem to="/" icon={RiHomeLine} filledIcon={RiHomeFill} label="Home" active={location.pathname === "/"} />
                    {isLoggedIn && (
                        <>
                            <NavItem to="/roadmaps" icon={RiBook3Line} filledIcon={RiBook3Fill} label="Roadmaps" active={location.pathname.startsWith("/roadmaps")} />
                            <NavItem to="/explore" icon={RiSearchLine} filledIcon={RiSearchFill} label="Explore" active={location.pathname === "/explore"} />
                            <NavItem to="/messages" icon={RiMessage3Line} filledIcon={RiMessage3Fill} label="Chats" active={location.pathname.startsWith("/messages")} />
                        </>
                    )}
                </nav>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-4 mt-auto">
                    {isLoggedIn ? (
                        <>
                            <NavItem 
                                to={`/profile/${user.username}`} 
                                icon={FaRegUser} 
                                filledIcon={FaUser}
                                label="Profile" 
                                active={location.pathname === `/profile/${user.username}`} 
                            />
                            <Tooltip title="Logout" placement="right" TransitionComponent={Zoom} arrow>
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-300 group"
                                >
                                    <FiLogOut size={22} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </Tooltip>
                        </>
                    ) : (
                        <NavItem to="/login" icon={FaRegUser} filledIcon={FaUser} label="Login" active={location.pathname === "/login"} />
                    )}
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            {isLoggedIn && !hideMobileNav && (
                <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-[100] bg-white/95 backdrop-blur-2xl border border-zinc-200 rounded-2xl shadow-2xl transition-all duration-300">
                    <div className="flex justify-around items-center py-4">
                        <Link to="/" className={`p-2 ${location.pathname === "/" ? 'text-zinc-900' : 'text-zinc-500'}`}><RiHomeFill size={20} /></Link>
                        <Link to="/roadmaps" className={`p-2 ${location.pathname.startsWith("/roadmaps") ? 'text-zinc-900' : 'text-zinc-500'}`}><RiBook3Fill size={20} /></Link>
                        <Link to="/explore" className={`p-2 ${location.pathname === "/explore" ? 'text-zinc-900' : 'text-zinc-500'}`}><RiSearchFill size={20} /></Link>
                        <Link to="/messages" className={`p-2 ${location.pathname.startsWith("/messages") ? 'text-zinc-900' : 'text-zinc-500'}`}><RiMessage3Fill size={20} /></Link>
                        <Link to={`/profile/${user.username}`} className={`p-2 ${location.pathname.startsWith("/profile") ? 'text-zinc-900' : 'text-zinc-500'}`}><FaUser size={20} /></Link>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutClose}
                PaperProps={{
                    sx: {
                        bgcolor: '#ffffff',
                        backgroundImage: 'none',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '20px',
                        padding: '12px',
                        maxWidth: '360px'
                    }
                }}
            >
                <DialogTitle sx={{ color: 'black', fontWeight: 900, fontSize: '1.1rem', tracking: '-0.02em', px: 3, pt: 3 }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent sx={{ px: 3, pb: 1 }}>
                    <DialogContentText sx={{ color: 'rgba(0, 0, 0, 0.6)', fontWeight: 500, fontSize: '0.85rem' }}>
                        Are you sure you want to log out of your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
                    <Button 
                        onClick={handleLogoutClose}
                        variant="outlined"
                        sx={{ 
                            color: 'rgba(0, 0, 0, 0.7)', 
                            borderColor: 'rgba(0, 0, 0, 0.15)',
                            fontWeight: 600, 
                            fontSize: '12px', 
                            letterSpacing: 'normal', 
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 3,
                            py: 1,
                            '&:hover': { 
                                borderColor: 'rgba(0, 0, 0, 0.3)',
                                color: 'black', 
                                bgcolor: 'rgba(0, 0, 0, 0.05)' 
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleLogoutConfirm}
                        autoFocus
                        variant="contained"
                        sx={{ 
                            bgcolor: 'black', 
                            color: 'white', 
                            fontWeight: 600, 
                            fontSize: '12px', 
                            letterSpacing: 'normal', 
                            textTransform: 'none',
                            borderRadius: '10px',
                            px: 3,
                            py: 1,
                            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.9)' }
                        }}
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sidebar;
