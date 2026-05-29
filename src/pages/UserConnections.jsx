import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiUser, FiMapPin } from 'react-icons/fi';
import ProfileLoader from '../components/loaders/ProfileLoader';

const UserConnections = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConnections = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/${username}`);
            const accepted = response?.data.requests.filter(r => r.status === 'accepted');
            setConnections(accepted);
        } catch (error) {
            console.error('Error fetching connections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, [username]);

    if (loading) return <ProfileLoader />;

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-12">
            <div className="max-w-3xl mx-auto px-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Back to Profile</span>
                </button>

                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Network</h1>
                        <p className="text-zinc-500 font-medium tracking-tight">Connections for @{username}</p>
                    </div>
                    <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        {connections.length} Total
                    </span>
                </div>

                <div className="grid gap-4">
                    {connections.length > 0 ? (
                        connections.map((conn) => (
                            <Link
                                key={conn.id}
                                to={`/profile/${conn.sender.username}`}
                                className="group flex items-center justify-between p-6 rounded-lg bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-600 text-2xl font-black group-hover:bg-white group-hover:text-black transition-all duration-500">
                                        {conn.sender.username?.[0]?.toUpperCase()}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-black text-white tracking-tight leading-none group-hover:text-white">
                                            {conn.sender.fullName || conn.sender.username}
                                        </h3>
                                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                            {conn.sender.role}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 border border-dashed border-white/5 rounded-[2.5rem]">
                            <FiUser size={48} className="mx-auto mb-6 text-zinc-800" />
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">No connections found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserConnections;
