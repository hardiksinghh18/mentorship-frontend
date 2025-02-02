import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setLoggedOut } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const ProfileInfo = ({ profile, isOwnProfile, currentUserId, onSendRequest }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receivedRequests, sentRequests } = profile;

  const [buttonStatus, setButtonStatus] = useState("connect");
  
  const determineButtonStatus = () => {
    const receivedRequest = profile?.receivedRequests?.find(
      (req) => req.senderId === currentUserId && req.receiverId === profile?.id
    );
    const sentRequest = profile?.sentRequests?.find(
      (req) => req.receiverId === currentUserId && req.senderId === profile?.id
    );

    if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
      return "connected";
    }
    if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
      return "pending";
    }
    return "connect";
  };

  const handleLogout = () => {
    dispatch(setLoggedOut());
    navigate("/login");
  };

  useEffect(() => {
    setButtonStatus(determineButtonStatus());
  }, [receivedRequests, sentRequests, currentUserId, profile?.id]);

  const handleButtonClick = async () => {
    if (buttonStatus === "connect") {
      await onSendRequest(profile?.id, currentUserId);
      setButtonStatus("pending");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6  bg-[#0d0d0d] rounded-xl shadow-xl ">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
          <FaUserCircle className="text-gray-300 text-6xl" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{profile?.fullName || profile?.username}</h1>
          <p className="text-gray-400 text-lg">@{profile?.username}</p>
          <p className="text-gray-500">{profile?.email}</p>
        </div>
        <p className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full">Role: {profile?.role}</p>
      </div>

      <div className="mt-6 text-white space-y-4">
        <h2 className="text-xl font-semibold">Bio</h2>
        <p className="text-gray-300 bg-gray-800 p-4 rounded-lg">{profile?.bio || "No bio available"}</p>
      </div>

      <div className="mt-6 text-white space-y-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        {profile?.skills?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
            <span
            key={index}
            className="text-white text-sm font-semibold px-4 py-1 rounded-full border border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            style={{
              background: "linear-gradient(to right, rgba(29, 78, 216, 0.15), rgba(126, 34, 206, 0.15)), #1f2937",
            }}
          >
            {skill}
          </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No skills added yet.</p>
        )}
      </div>

      <div className="mt-6 text-white space-y-4">
        <h2 className="text-xl font-semibold">Interests</h2>
        {profile?.interests?.length ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span
              key={index}
              className="text-white text-sm font-semibold px-3 py-1 rounded-full border border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
              style={{
                background: "linear-gradient(to right, rgba(29, 78, 216, 0.15), rgba(126, 34, 206, 0.15)), #1f2937",
              }}
            >
              {interest}
            </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No interests added yet.</p>
        )}
      </div>

      {!isOwnProfile && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleButtonClick}
            className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg w-full ${
              buttonStatus === "pending"
                ? "bg-yellow-500 text-white cursor-not-allowed"
                : buttonStatus === "connected"
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white"
            }`}
            disabled={buttonStatus !== "connect"}
          >
            {buttonStatus === "pending" ? "Pending" : buttonStatus === "connected" ? "Connected" : "Connect"}
          </button>
        </div>
      )}

      {isOwnProfile && (
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <Link
            to="/profile/setup"
            className="flex-1 text-center bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg text-white shadow-lg hover:opacity-90 transition-all"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600 px-6 py-3 rounded-lg text-white shadow-lg hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;


