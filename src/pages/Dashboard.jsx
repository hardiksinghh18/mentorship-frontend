import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiSearch, FiActivity } from 'react-icons/fi';
import { StatCard, getGreeting } from './renderer';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-40 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                            {getGreeting()}, <span className="text-muted/40">{user?.fullName ? user.fullName.split(' ')[0] : user?.username}</span>
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-lg max-w-xl font-medium tracking-tight">
                            Manage your mentorships, chat with connections, and explore new opportunities.
                        </p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    <StatCard 
                        icon={FiMessageSquare} 
                        label="Messages" 
                        value="Chats" 
                        description="Stay connected with your mentors and mentees."
                    />
                    <StatCard 
                        icon={FiSearch} 
                        label="Discovery" 
                        value="Search" 
                        description="Find and connect with industry experts."
                    />
                    <StatCard 
                        icon={FiActivity} 
                        label="Overview" 
                        value="Activity" 
                        description="Track your progress and stay updated with your network."
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
                    <Link to="/discover" className="group relative bg-white text-black p-10 rounded-[3rem] overflow-hidden transition-all hover:bg-zinc-200 active:scale-[0.98]">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-12">
                            <h2 className="text-3xl font-black tracking-tighter leading-tight">Find New <br/>Mentors</h2>
                            <div className="flex items-center space-x-2 font-black uppercase tracking-widest text-[10px]">
                                <span>Browse Now</span>
                                <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <FiSearch size={140} />
                        </div>
                    </Link>

                    <Link to="/messages" className="group relative bg-white/[0.03] border border-white/5 p-10 rounded-[3rem] overflow-hidden transition-all hover:bg-white/[0.05] active:scale-[0.98]">
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-12 text-white">
                            <h2 className="text-3xl font-black tracking-tighter leading-tight text-white">Your <br/>Chats</h2>
                            <div className="flex items-center space-x-2 font-black uppercase tracking-widest text-[10px] text-zinc-400 group-hover:text-white">
                                <span>Open Messages</span>
                                <span className="text-lg group-hover:translate-x-1 transition-transform">›</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <FiMessageSquare size={140} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
