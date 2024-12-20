import { Link } from "react-router-dom";

const Connections = ({ acceptedRequests, isOwnProfile, handleRemoveConnection }) => {
    
    return (
        <div className="p-6 bg-[#0d0d0d] rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Connections</h2>
            {acceptedRequests.length > 0 ? (
                acceptedRequests.map((connection) => (
                    <div
                        key={connection.id}
                        className="flex items-center justify-between p-3 rounded-md mb-2"
                    >
                        <Link
                            to={`/profile/${connection.sender.username}`}
                            className="font-bold hover:underline text-md hover:text-blue-400"
                        >
                            {connection.sender.username || connection.sender.fullName}
                        </Link>
                       {isOwnProfile && <button
                            onClick={() => handleRemoveConnection(connection)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md"
                        >
                            Remove
                        </button>}
                    </div>
                ))
            ) : (
                <p>No connections available.</p>
            )}
        </div>
    );
};


export default Connections;