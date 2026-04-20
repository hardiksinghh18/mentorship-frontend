import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Connections = ({ acceptedRequests, isOwnProfile, handleRemoveConnection }) => {
    return (
        <div className="bg-black rounded-[2rem] border border-white/[0.03] p-8">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-2">Network</h2>
                    <p className="text-xl font-black text-white tracking-tighter">Established Connections</p>
                </div>
                <span className="px-2 py-1 bg-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded">
                    {acceptedRequests.length} Active
                </span>
            </div>

            {acceptedRequests.length > 0 ? (
                <div className="space-y-4">
                    {acceptedRequests.map((connection) => (
                        <div
                            key={connection.id}
                            className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-all"
                        >
                            <Link
                                to={`/profile/${connection.sender.username}`}
                                className="flex items-center gap-4 flex-1"
                            >
                                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-400 font-bold group-hover:bg-white group-hover:text-black transition-all">
                                    {connection.sender.username?.[0]?.toUpperCase() || "!"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm tracking-tight leading-none mb-1">
                                        {connection.sender.fullName || connection.sender.username}
                                    </h3>
                                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest leading-none">
                                        Synchronized
                                    </p>
                                </div>
                            </Link>
                            {isOwnProfile && (
                                <button
                                    onClick={() => handleRemoveConnection(connection)}
                                    className="p-2 text-zinc-700 hover:text-white transition-colors"
                                    title="Sever Connection"
                                >
                                    <FaTimes size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-6">No active synchronization</p>
                    <Link
                        to="/discover"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:underline"
                    >
                        Initiate First Connection
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Connections;