import { Link } from "react-router-dom";

const Notifications = ({ pendingRequests, handleRequest }) => {
    return (
        <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 shadow-sm">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 block mb-2">Notifications</h2>
                    <p className="text-xl font-black text-zinc-900 tracking-tighter">Pending Requests</p>
                </div>
                <span className="px-2 py-1 bg-zinc-200 text-zinc-700 text-[10px] font-black uppercase tracking-widest rounded whitespace-nowrap">
                    {pendingRequests.length} Pending
                </span>
            </div>

            {pendingRequests?.length > 0 ? (
                <div className="space-y-4">
                    {pendingRequests?.map((request) => (
                        <div
                            key={request.id}
                            className="group flex flex-col gap-6 p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all shadow-xs"
                        >
                            <Link 
                                to={`/profile/${request.sender.username}`}
                                className="flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-800 font-black text-lg group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                    {request.sender.username?.[0]?.toUpperCase() || "!"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-sm tracking-tight leading-none mb-1">
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
                                    className="flex-1 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRequest(request.receiverId, request.sender.id, "declined")}
                                    className="flex-1 py-3 bg-zinc-200 text-zinc-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:text-zinc-900 hover:bg-zinc-300 transition-all"
                                >
                                    Ignore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl">
                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mb-6">No pending invitations</p>
                    <Link
                        to="/explore"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:underline"
                    >
                        Find People
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Notifications;