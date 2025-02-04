import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setLoggedOut } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiBriefcase, FiMail } from "react-icons/fi";

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
    <div className="max-w-4xl mx-auto bg-[#0d0d0d] rounded-xl overflow-hidden shadow-xl border border-gray-800">
    {/* Cover Photo Section */}
    <div className="h-32 bg-gradient-to-r from-blue-800 to-purple-800 relative">
      <div className="absolute -bottom-16 left-6">
        <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-[#0d0d0d] flex items-center justify-center shadow-xl">
          <FaUserCircle className="text-gray-300 text-7xl" />
        </div>
      </div>
    </div>

    {/* Profile Header */}
    <div className="pt-20 px-6 pb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">{profile?.fullName || profile?.username}</h1>
          <p className="text-gray-400 mt-1">@{profile?.username}</p>
          <div className="flex items-center gap-2 mt-2">
            <FiBriefcase className="text-gray-400" />
            <span className="text-gray-400">{profile?.role}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <FiMail className="text-gray-400" />
            <span className="text-gray-400">{profile?.email}</span>
          </div>
        </div>
        
        {/* Social Icons */}
        <div className="flex gap-3">
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
            <FaLinkedin className="text-blue-500 text-xl" />
          </button>
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
            <FaTwitter className="text-blue-400 text-xl" />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-6 mt-4 border-y border-gray-800 py-4">
        <div className="text-center">
          <span className="text-white font-semibold">0</span>
          <p className="text-gray-400 text-sm">Connections</p>
        </div>
        <div className="text-center">
          <span className="text-white font-semibold">{profile?.skills?.length || 0}</span>
          <p className="text-gray-400 text-sm">Skills</p>
        </div>
      </div>
    </div>

    {/* Bio Section */}
    <div className="px-6 pb-6">
      <h2 className="text-xl font-semibold text-white mb-2">About</h2>
      <p className="text-gray-300 leading-relaxed">
        {profile?.bio || "No bio available"}
      </p>
    </div>

    {/* Skills Section */}
    <div className="px-6 pb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Featured Skills</h2>
      <div className="flex flex-wrap gap-3">
        {profile?.skills?.map((skill, index) => (
          <div key={index} className="bg-gray-800 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-white text-sm">{skill}</span>
            {/* <span className="text-blue-400 text-xs">• 0 endorsements</span> */}
          </div>
        ))}
        {!profile?.skills?.length && <p className="text-gray-400">No skills added yet</p>}
      </div>
    </div>

    {/* Interests Section */}
    <div className="px-6 pb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Interests</h2>
      <div className="flex flex-wrap gap-3">
        {profile?.interests?.map((interest, index) => (
          <div key={index} className="bg-gray-800 px-4 py-2 rounded-full">
            <span className="text-white text-sm">{interest}</span>
          </div>
        ))}
        {!profile?.interests?.length && <p className="text-gray-400">No interests added yet</p>}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="px-6 pb-6">
      {!isOwnProfile ? (
        <button
          onClick={handleButtonClick}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${
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
      ) : (
        <div className="flex gap-4">
          <Link
            to="/profile/setup"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg text-white text-center hover:opacity-90 transition-all"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 bg-red-600 px-6 py-3 rounded-lg text-white hover:bg-red-700 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
  );
};

export default ProfileInfo;