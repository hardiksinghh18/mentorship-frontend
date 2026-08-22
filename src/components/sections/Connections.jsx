import React from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const Connections = ({ acceptedRequests, isOwnProfile, handleRemoveConnection }) => {
    return (
        <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 shadow-sm">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-2">Network</h2>
                    <p className="text-xl font-black text-zinc-900 tracking-tighter">My Connections</p>
                </div>
                <span className="px-2 py-1 bg-zinc-200 text-zinc-700 text-[10px] font-black uppercase tracking-widest rounded">
                    {acceptedRequests.length} Total
                </span>
            </div>

            {acceptedRequests.length > 0 ? (
                <div className="space-y-4">
                    {acceptedRequests.map((connection) => (
                        <div
                            key={connection.id}
                            className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all shadow-xs"
                        >
                            <Link
                                to={`/profile/${connection.sender.username}`}
                                className="flex items-center gap-4 flex-1"
                            >
                                <div className="w-10 h-10 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-800 font-bold group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                    {connection.sender.username?.[0]?.toUpperCase() || "!"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-sm tracking-tight leading-none mb-1">
                                        {connection.sender.fullName || connection.sender.username}
                                    </h3>
                                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest leading-none">
                                        Connected
                                    </p>
                                </div>
                            </Link>
                            {isOwnProfile && (
                                <button
                                    onClick={() => handleRemoveConnection(connection)}
                                    className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                                    title="Remove Connection"
                                >
                                    <FaTimes size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-6">No connections yet</p>
                    <Link
                        to="/explore"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:underline"
                    >
                        Start Networking
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Connections;