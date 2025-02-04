import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Connections = ({ acceptedRequests, isOwnProfile, handleRemoveConnection }) => {
    return (
        <div className="bg-[#0d0d0d] rounded-xl shadow-lg border border-gray-800 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Connections</h2>
                <span className="text-gray-400 text-sm">
                    {acceptedRequests.length} connections
                </span>
            </div>

            {acceptedRequests.length > 0 ? (
                <div className="space-y-4">
                    {acceptedRequests.map((connection) => (
                        <div
                            key={connection.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] transition-colors"
                        >
                            <Link
                                to={`/profile/${connection.sender.username}`}
                                className="flex items-center gap-4 flex-1"
                            >
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                    {connection.sender.username?.[0]?.toUpperCase() || 
                                    <FaUserCircle className="text-gray-300 text-xl" />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white hover:text-blue-400 transition-colors">
                                        {connection.sender.fullName || connection.sender.username}
                                    </h3>
                                    <p className="text-gray-400 text-sm">Connected</p>
                                </div>
                            </Link>
                            {isOwnProfile && (
                                <button
                                    onClick={() => handleRemoveConnection(connection)}
                                    className="text-red-500 hover:text-red-400 px-4 py-2 border border-red-500 hover:border-red-400 rounded-full text-sm transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No connections yet</p>
                    <Link
                        to="/discover"
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                        Discover mentors and mentees
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Connections;