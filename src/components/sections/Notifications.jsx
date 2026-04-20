import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Notifications = ({ pendingRequests, handleRequest }) => {
    return (
        <div className="bg-black rounded-[2rem] border border-white/[0.03] p-8">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-2">Inbound</h2>
                    <p className="text-xl font-black text-white tracking-tighter">Connection Requests</p>
                </div>
                <span className="px-2 py-1 bg-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded whitespace-nowrap">
                    {pendingRequests.length} Waiting
                </span>
            </div>

            {pendingRequests?.length > 0 ? (
                <div className="space-y-4">
                    {pendingRequests?.map((request) => (
                        <div
                            key={request.id}
                            className="group flex flex-col gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:border-white/10 transition-all"
                        >
                            <Link 
                                to={`/profile/${request.sender.username}`}
                                className="flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 font-black text-lg group-hover:bg-white group-hover:text-black transition-all">
                                    {request.sender.username?.[0]?.toUpperCase() || "!"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm tracking-tight leading-none mb-1">
                                        {request.sender.fullName || request.sender.username}
                                    </h3>
                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-none">
                                        {request.sender.role}
                                    </p>
                                </div>
                            </Link>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleRequest(request.receiverId, request.sender.id, "accepted")}
                                    className="flex-1 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRequest(request.receiverId, request.sender.id, "declined")}
                                    className="flex-1 py-3 bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:text-white hover:bg-zinc-800 transition-all"
                                >
                                    Ignore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-6">No pending invitations</p>
                    <Link
                        to="/discover"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:underline"
                    >
                        Explore the Directory
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Notifications;