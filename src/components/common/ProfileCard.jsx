import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ profile, currentUserId, onSendRequest }) => {
    const { id, name, role, skills, username, interests, receivedRequests, sentRequests } = profile;

    // State to manage button status
    const [buttonStatus, setButtonStatus] = useState("connect");

    // Function to determine button status
    const determineButtonStatus = () => {
        const receivedRequest = receivedRequests?.find(
            (req) => req.senderId === currentUserId && req.receiverId === id
        );
        const sentRequest = sentRequests?.find(
            (req) => req.receiverId === currentUserId && req.senderId === id
        );

        if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
            return "connected"; // Already connected
        }
        if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
            return "pending"; // Request is in progress
        }
        return "connect"; // Default state
    };

    // Sync button status on reload or when requests change
    useEffect(() => {
        setButtonStatus(determineButtonStatus());
    }, [receivedRequests, sentRequests, currentUserId, id]);

    const handleButtonClick = async () => {
        if (buttonStatus === "connect") {
            // Call the function to send the request
            await onSendRequest(id, currentUserId);

            // After sending the request, update the button state to pending
            setButtonStatus("pending");
        }
    };

    // Determine button text and style based on status
    const buttonText =
        buttonStatus === "pending"
            ? "Pending"
            : buttonStatus === "connected"
            ? "Connected"
            : "Connect";

    const buttonStyle =
        buttonStatus === "pending"
            ? "bg-green-500 hover:bg-green-600" // Green for pending
            : buttonStatus === "connected"
            ? "bg-gray-500 cursor-not-allowed" // Gray for connected
            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90"; // Default connect color

    return (
        <div className="bg-[#171717] p-6 rounded-lg shadow-lg flex flex-col justify-between">
            <div>
                <div className="flex gap-4 items-center">
                    <h2 className="text-xl font-bold">{name}</h2>
                    {role && (
                        <p className="inline-block bg-blue-200 text-black text-xs font-bold px-3 py-1 rounded-full">
                            {role}
                        </p>
                    )}
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Skills:</h3>
                    {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-300 text-black font-bold text-xs px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No skills listed.</p>
                    )}
                </div>

                <div className="mt-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Interests:</h3>
                    {interests?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest, index) => (
                                <span
                                    key={index}
                                    className="bg-green-300 text-black font-bold text-xs px-3 py-1 rounded-full"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No interests listed.</p>
                    )}
                </div>
            </div>
            <div className="mt-8 flex items-center justify-between">
                <Link
                    to={`/profile/${username}`}
                    className="text-blue-300 hover:underline text-sm"
                >
                    View Profile
                </Link>
                <button
                    onClick={handleButtonClick}
                    className={`${buttonStyle} text-white px-4 py-2 rounded-md text-sm font-semibold transition-opacity`}
                    disabled={buttonStatus !== "connect"} // Disable button for non-connect states
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
