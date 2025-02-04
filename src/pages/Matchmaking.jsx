import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProfileCard from '../components/common/ProfileCard';

const Matchmaking = () => {
  const [users, setUsers] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const { user, isLoggedIn } = useSelector((state) => state.auth); // Get isLoggedIn from Redux state
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoadingProfiles(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/users`, {
        withCredentials: true,
      });
      const fetchedUsers = response.data.users || [];

      const normalizedUsers = fetchedUsers.map((user) => ({
        id: user?.id || "Unknown ID",
        username: user?.username,
        name: user?.fullName || user?.username || "Anonymous",
        role: user?.role,
        skills: user?.skills
          ? user?.skills.split(",").map((skill) => skill.trim()).slice(0, 6)
          : [],
        interests: user?.interests
          ? user?.interests.split(",").map((interest) => interest.trim()).slice(0, 6)
          : [],
        receivedRequests: user?.receivedRequests,
        sentRequests: user?.sentRequests,
      }));
      setUsers(normalizedUsers);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Calculate the match score
  const calculateMatch = (user1, user2) => {
    const matchingSkills = user1?.skills ? user1?.skills.split(",").map(item => item.trim()).filter(skill => user2?.skills?.includes(skill)).length : [];
    const matchingInterests = user1?.interests ? user1?.interests.split(",").map(item => item.trim()).filter(interest => user2?.interests?.includes(interest)).length : [];
    return matchingSkills + matchingInterests; // You can tweak this based on weightage you want for skills vs interests
  };

  // Suggest matches based on the logged-in user
  const getBestMatches = () => {
    const matches = users
      ?.filter((otherUser) => otherUser.id !== user?.id) // Exclude the logged-in user from suggestions
      .map((otherUser) => {
        const matchScore = calculateMatch(user, otherUser);
        return { ...otherUser, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore); // Sort by match score in descending order

    return matches;
  };

  useEffect(() => {
    if (isLoggedIn === true) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    navigate("/login");
  }

  if (loadingProfiles) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading profiles...</h2>
        </div>
      </div>
    );
  }

  const bestMatches = getBestMatches();

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Main Content */}
      <div className="flex flex-col px-4 md:px-8 gap-8 max-w-7xl mx-auto">
        {/* Scrollable Profile Section */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-6rem)] md:px-4 pb-10">
          <div className="max-w-7xl mx-auto px-4 py-3 my-4">
            <h1 className="text-lg md:text-2xl font-bold text-white text-center">Your Best Matches</h1>
          </div>
          {bestMatches.length > 0 ? (
            <div className="space-y-4">
              {bestMatches.map((item) =>
                item.matchScore > 0 ? (
                  <ProfileCard
                    key={item.id}
                    profile={item}
                    currentUserId={user?.id}
                    matchScore={item.matchScore}
                  />
                ) : null
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400">No matches found yet. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;