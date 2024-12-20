import { Link } from "react-router-dom";

const Notifications = ({ pendingRequests, handleRequest }) => {
    return (
        <div className="bg-[#0d0d0d] p-6 flex flex-col gap-2 rounded-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Requests </h2>
            {pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                    <div
                        key={request.id}
                        className="flex items-center justify-between  p-4 rounded-md shadow-md"
                    >
                        <Link to={`/profile/${request.sender.username}`} className="flex items-center gap-4">
                            <h3 className="text-lg hover:text-blue-500 font-semibold">
                                {request.sender.username  || request.sender.fullName}
                            </h3>
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleRequest(request.receiverId, request.sender.id, "accepted")}
                                className="bg-green-600 text-white px-4 py-1 rounded-md text-sm shadow-md hover:bg-green-700"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleRequest(request.receiverId, request.sender.id, "declined")}
                                className="bg-red-600 text-white px-4  rounded-md text-sm shadow-md hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-slate-400">No pending requests.</p>
            )}
        </div>
    );
};


export default Notifications