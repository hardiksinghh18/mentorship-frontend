import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileCard = ({ profile, currentUserId,matchScore }) => {
    const { id, name, role, skills, username, interests, receivedRequests, sentRequests } = profile;
console.log(typeof skills)
    const [buttonStatus, setButtonStatus] = useState("connect");

    const determineButtonStatus = () => {
        const receivedRequest = receivedRequests?.find(
            (req) => req.senderId === currentUserId && req.receiverId === id
        );
        const sentRequest = sentRequests?.find(
            (req) => req.receiverId === currentUserId && req.senderId === id
        );

        if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
            return "connected";
        }
        if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
            return "pending";
        }
        return "connect";
    };
    const onSendRequest = async (receiverId, senderId) => {
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
          toast.success(response.data.message);
        } catch (error) {
          toast.error(error.response?.data?.message || "Error sending request");
          console.error(error.response?.data?.message);
        }
      };


    useEffect(() => {
        setButtonStatus(determineButtonStatus());
    }, [receivedRequests, sentRequests, currentUserId, id]);

    const handleButtonClick = async () => {
        if (buttonStatus === "connect") {
            await onSendRequest(id, currentUserId);
            setButtonStatus("pending");
        }
    };

    const buttonText =
        buttonStatus === "pending"
            ? "Pending"
            : buttonStatus === "connected"
                ? "Connected"
                : "Connect";

    const buttonStyle =
        buttonStatus === "pending"
            ? "bg-green-500 hover:bg-green-600"
            : buttonStatus === "connected"
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90";

    return (
        <div className="bg-[#0d0d0d] w-screen md:w-[45rem] relative px-4 py-6 rounded-2xl shadow-xl flex md:flex-row  gap-8">
           
           {matchScore&&  <span className="bg-gradient-to-r  from-blue-700 to-purple-700 absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                    Match-score :  {matchScore}
                        </span>}
            {/* Left Section: Name and Role */}
            <div>
                <Link to={`/profile/${username}`} className="  flex-shrink-0 w-10 h-10 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {username[0]?.toUpperCase()}
                </Link>
            </div>


            {/* Middle Section: Profile Details */}
            <div className="flex-grow flex flex-col gap-2">
                <div className="flex items-center gap-4 relative">
                    <Link to={`/profile/${username}`} className="text-lg font-bold text-white hover:text-blue-500">{username}</Link>
                    {role && (
                        <span className="bg-gradient-to-r  from-blue-700 to-purple-700 relative bottom-2 right-2 text-white text-[.6rem] font-bold px-2 py-1 rounded-lg shadow-md">
                            {role}
                        </span>
                    )}

                 
                   
                </div>

                <div className="w-full bg-slate-800 h-[.1rem]" />
                <div className="mt-2">
                    <h3 className="text-sm font-semibold text-white mb-2">Skills:</h3>
                    {skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {skills?.map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                                    style={{
                                        background: "linear-gradient(to right, rgba(29, 78, 216, 0.15), rgba(126, 34, 206, 0.15)), #1f2937",
                                    }}
                                >
                                    {skill}
                                </span>


                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No skills listed.</p>
                    )}
                </div>



                <div className="mt-2 hidden  md:block">
                    <h3 className="text-sm font-semibold text-white mb-2">Interests:</h3>
                    {interests?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {interests?.map((interest, index) => (
                                <span
                                    key={index}
                                    className="text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
                                    style={{
                                        background: "linear-gradient(to right, rgba(29, 78, 216, 0.15), rgba(126, 34, 206, 0.15)), #1f2937",
                                    }}
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

            {/* Right Section: Actions */}
            <div className="md:flex flex-col hidden md:h-40 items-center justify-end gap-2">
               
                <button
                    onClick={handleButtonClick}
                    className={`${buttonStyle} text-white px-4 py-2 rounded-md text-sm font-semibold transition-opacity w-full`}
                    disabled={buttonStatus !== "connect"}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;
