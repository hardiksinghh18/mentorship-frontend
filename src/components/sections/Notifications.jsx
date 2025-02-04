import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Notifications = ({ pendingRequests, handleRequest }) => {
    return (
        <div className="bg-[#0d0d0d] rounded-xl shadow-lg border border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Connection Requests</h2>
                <span className="text-gray-400 text-sm">
                    {pendingRequests.length} pending
                </span>
            </div>

            {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                    {pendingRequests.map((request) => (
                        <div
                            key={request.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] transition-colors"
                        >
                            <Link 
                                to={`/profile/${request.sender.username}`}
                                className="flex items-center gap-4 flex-1"
                            >
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                    {request.sender.username?.[0]?.toUpperCase() || 
                                    <FaUserCircle className="text-gray-300 text-xl" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white hover:text-blue-400 transition-colors">
                                        {request.sender.fullName || request.sender.username}
                                    </h3>
                                    <p className="text-gray-400 text-sm">{request.sender.role}</p>
                                </div>
                            </Link>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleRequest(request.receiverId, request.sender.id, "accepted")}
                                    className="px-2 py-2 rounded-full border border-green-500 text-green-500 hover:bg-green-500/10 transition-colors text-xs font-semibold"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleRequest(request.receiverId, request.sender.id, "declined")}
                                    className="px-2 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors text-xs font-semibold"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No pending requests</p>
                    <Link
                        to="/discover"
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                        Discover new connections
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Notifications;