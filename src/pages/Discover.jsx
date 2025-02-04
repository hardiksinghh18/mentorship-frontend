import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileCard from "../components/common/ProfileCard";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: "", skills: "", interests: "", name: '' });
  const [showFilters, setShowFilters] = useState(false);

  const { user, isLoggedIn } = useSelector((state) => state.auth);
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
        bio: user?.bio,
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
      setFilteredUsers(normalizedUsers);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError("Failed to load user profiles. Please try again later.");
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleSendRequest = async (receiverId, senderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
      console.error(error.response?.data?.message);
    }
  };

  const applyFilters = () => {
    const { role, skills, interests, name } = filters;

    const skillsArray = skills ? skills.split(',').map((skill) => skill.trim().toLowerCase()) : [];
    const interestsArray = interests ? interests.split(',').map((interest) => interest.trim().toLowerCase()) : [];

    const filtered = users.filter((user) => {
      const matchesRole = role ? user.role?.toLowerCase().includes(role.toLowerCase()) : true;
      const matchesName = name ? user?.name?.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesUserName = name ? user?.username?.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesSkills = skillsArray.length
        ? skillsArray.some((skill) => user.skills.some((userSkill) => userSkill.toLowerCase().includes(skill)))
        : true;
      const matchesInterests = interestsArray.length
        ? interestsArray.some((interest) => user.interests.some((userInterest) => userInterest.toLowerCase().includes(interest)))
        : true;

      return matchesRole && matchesSkills && matchesInterests && matchesUserName;
    });

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  useEffect(() => {
    if (isLoggedIn === true) {
      fetchUsers();
    }
  }, [isLoggedIn]);

  if (loadingProfiles) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0d0d]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Loading profiles...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0d0d]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      

      <div className="flex flex-col md:flex-row  px-4 md:px-8 gap-8 max-w-7xl mx-auto">

        {/* Mobile Filter Toggle Button */}
        <div className="md:hidden">
          <button
            onClick={toggleFilters}
            className="w-full bg-[#262626] text-gray-300 text-sm font-semibold px-4 py-3 rounded-md hover:bg-[#333333] transition"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        
        {/* Filter Section (Mobile & Desktop) */}
        <div
          className={`w-full md:w-64 bg-[#1a1a1a] rounded-lg shadow-lg p-4 border border-gray-800 md:fixed md:top-24 md:left-8 md:h-[calc(100vh-10rem)] md:overflow-y-auto transition-all duration-300 ease-in-out ${showFilters || window.innerWidth >= 768
              ? "max-h-[1000px] opacity-100" // Expanded state
              : "max-h-0 opacity-0 overflow-hidden" // Collapsed state
            }`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Select Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="bg-[#262626] text-gray-300 text-sm px-4 py-2 rounded-md border border-gray-700 w-full cursor-pointer"
              >
                <option value="" disabled className="text-gray-400">Select Role</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Search by Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter name..."
                value={filters.name}
                onChange={handleFilterChange}
                className="bg-[#262626] text-gray-300 text-sm px-4 py-2 rounded-md border border-gray-700 w-full"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Filter by Skills</label>
              <input
                type="text"
                name="skills"
                placeholder="Enter skills..."
                value={filters.skills}
                onChange={handleFilterChange}
                className="bg-[#262626] text-gray-300 text-sm px-4 py-2 rounded-md border border-gray-700 w-full"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Filter by Interests</label>
              <input
                type="text"
                name="interests"
                placeholder="Enter interests..."
                value={filters.interests}
                onChange={handleFilterChange}
                className="bg-[#262626] text-gray-300 text-sm px-4 py-2 rounded-md border border-gray-700 w-full"
              />
            </div>

            <button
              onClick={() => setFilters({ role: "", name: "", skills: "", interests: "" })}
              className="bg-gradient-to-r from-blue-700 to-purple-700 text-white text-sm py-2 rounded-md font-semibold transition w-full mt-2"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Scrollable Profile Section */}
        <div className="flex-1 overflow-y-auto h-[100vh] md:ml-72 md:px-4 ">
          <div className="max-w-7xl mx-auto px-4 py-3 my-4">
            <h1 className="text-lg md:text-2xl font-bold text-white text-center ">Discover Mentors and Mentees</h1>
          </div>
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((item) =>
              item.id !== user?.id ? (
                <ProfileCard
                  key={item.id}
                  profile={item}
                  currentUserId={user?.id}
                  onSendRequest={handleSendRequest}
                />
              ) : null
            )
          ) : (
            <p className="text-center text-gray-400">No profiles found matching filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;