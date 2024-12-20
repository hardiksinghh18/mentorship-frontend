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
  const [filters, setFilters] = useState({ role: "", skills: "", interests: "" }); // Add state for filters
  const { user ,isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize the navigate hook
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
          receivedRequests:user?.receivedRequests,
          sentRequests:user?.sentRequests,
      }));

      setUsers(normalizedUsers);
      setFilteredUsers(normalizedUsers); // Initialize filtered users
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
    const { role, skills, interests } = filters;

    // Split skills and interests by comma and trim extra spaces
    const skillsArray = skills ? skills.split(',').map((skill) => skill.trim().toLowerCase()) : [];
    const interestsArray = interests ? interests.split(',').map((interest) => interest.trim().toLowerCase()) : [];

    const filtered = users.filter((user) => {
        const matchesRole = role ? user.role?.toLowerCase().includes(role.toLowerCase()) : true;

        const matchesSkills = skillsArray.length
            ? skillsArray.some((skill) => user.skills.some((userSkill) => userSkill.toLowerCase().includes(skill)))
            : true;

        const matchesInterests = interestsArray.length
            ? interestsArray.some((interest) => user.interests.some((userInterest) => userInterest.toLowerCase().includes(interest)))
            : true;

        return matchesRole && matchesSkills && matchesInterests;
    });

    setFilteredUsers(filtered);
};


const handleFilterChange = (e) => {
  setFilters({ ...filters, [e.target.name]: e.target.value });
};


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]); // Re-apply filters whenever the filter state changes

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if user is not logged in
    } else {
      fetchUsers();
    }
  }, [isLoggedIn, navigate]); // Trigger effect when isLoggedIn state changes


  if (loadingProfiles) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading profiles...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-slate-800 to-[#000104] text-white py-8 px-6 md:px-20">
    <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 mt-4">
      Discover Mentors and Mentees
    </h1>
  
    {/* Filter Section */}
    <div className="mb-12 p-6 rounded-lg shadow-md flex flex-wrap gap-4 justify-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-3 md:gap-4 lg:gap-6">
      <div className="w-full sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/4">
        <input
          type="text"
          name="role"
          placeholder="Filter by Role"
          value={filters.role}
          onChange={handleFilterChange}
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 w-full"
        />
      </div>
      <div className="w-full sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/4">
        <input
          type="text"
          name="skills"
          placeholder="Filter by Skills"
          value={filters.skills}
          onChange={handleFilterChange}
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 w-full"
        />
      </div>
      <div className="w-full sm:w-auto md:w-1/2 lg:w-1/3 xl:w-1/4">
        <input
          type="text"
          name="interests"
          placeholder="Filter by Interests"
          value={filters.interests}
          onChange={handleFilterChange}
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 w-full"
        />
      </div>
    </div>
  
    {/* Profiles Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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
  
  );
};

export default Discover;
