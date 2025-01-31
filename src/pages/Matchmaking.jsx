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
        skills: user?.skills ? user?.skills.split(",").map((skill) => skill.trim()).slice(0, 6) : [],
        interests: user?.interests ? user?.interests.split(",").map((interest) => interest.trim()).slice(0, 6) : [],
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
    console.log(users)
    const matches = users?.filter((otherUser) => otherUser.id !== user?.id) // Exclude the logged-in user from suggestions
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

  const bestMatches = getBestMatches();

  return (
    <div className="min-h-screen bg-gradient-to-t flex items-center justify-center from-slate-800 to-[#000104] text-white py-12 px-6 md:px-20">
      <div className="flex items-center justify-center flex-col">


        {/* Display Best Matches */}
        <div className="mt-12 w-full">
          {bestMatches.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold mb-4 text-center">Your Best Matches</h2>
              {bestMatches.map((item) => (
                item.matchScore > 0 ? (
                  <ProfileCard
                    key={item.id}
                    profile={item}
                    currentUserId={user?.id}
                    matchScore={item.matchScore}
                  // onSendRequest={handleSendRequest}
                  />
                ) : null
              ))}
            </div>

          ) : (
            <p className="text-center text-slate-400">No matches found yet. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matchmaking;
