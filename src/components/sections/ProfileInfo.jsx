import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProfileInfo = ({ profile, isOwnProfile, currentUserId, onSendRequest }) => {
    // Find if the current user has already sent a request to the profile
   
    const {  receivedRequests, sentRequests } = profile;

     // State to manage button status (connect -> pending -> connected)
     const [buttonStatus, setButtonStatus] = useState("connect");
    const determineButtonStatus = () => {
          const receivedRequest = profile?.receivedRequests?.find(
              (req) => req.senderId === currentUserId && req.receiverId === profile?.id
          );
          const sentRequest = profile?.sentRequests?.find(
              (req) => req.receiverId === currentUserId && req.senderId === profile?.id
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
      }, [receivedRequests, sentRequests, currentUserId, profile?.id]);


      
    const handleButtonClick = async () => {
        if (buttonStatus === 'connect') {
            // Send request when "Connect" button is clicked
            await onSendRequest(profile?.id, currentUserId);

            // After sending the request, set the status to "pending"
            setButtonStatus('pending');
        }
    };

    // Determine the button text and style based on the status
    const buttonText = buttonStatus === 'pending'
        ? 'Pending'
        : buttonStatus === 'accepted'
        ? 'Connected'
        : 'Connect';

    const buttonStyle = buttonStatus === 'pending'
        ? 'bg-green-500 hover:bg-green-600' // Green for pending
        : buttonStatus === 'accepted'
        ? 'bg-gray-500 cursor-not-allowed' // Gray for connected
        : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90'; // Default connect color

    return (
        <div className="bg-[#0d0d0d] p-8 rounded-lg shadow-2xl max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col gap-4 md:flex-row md:gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-white">{profile?.fullName || profile?.username}</h1>
            <p className="text-slate-400 text-lg">@{profile?.username}</p>
            <p className="text-slate-500 mt-2">{profile?.email}</p>
            <p className="text-slate-400 text-sm mt-1">Role : {profile?.role}</p>
          </div>
        </div>
      
        {/* Bio Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Bio</h2>
          <p className="text-slate-300">{profile?.bio || "No bio available"}</p>
        </div>
      
        {/* Skills Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Skills</h2>
          {profile?.skills?.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No skills added yet.</p>
          )}
        </div>
      
        {/* Interests Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-white mb-2">Interests</h2>
          {profile?.interests?.length ? (
            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No interests added yet.</p>
          )}
        </div>
      
        {/* Conditionally Render Connect/Cancel Button */}
        {!isOwnProfile && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleButtonClick}
              className={`${buttonStyle} text-white px-8 py-3 w-full md:w-auto rounded-md text-lg font-semibold transition-opacity`}
              disabled={buttonStatus === 'pending' || buttonStatus === 'accepted'} // Disable button when pending or connected
            >
              {buttonText}
            </button>
          </div>
        )}
      
        {/* Edit Profile Option */}
        {isOwnProfile && (
          <div className="mt-8">
            <Link
              to="/profile/setup"
              className="block bg-blue-600 w-full text-center hover:bg-blue-700 px-8 py-3 rounded-md text-white shadow-md hover:shadow-lg transition-all"
            >
              Edit Profile
            </Link>
          </div>
        )}
      </div>
      
    );
};

export default ProfileInfo;
