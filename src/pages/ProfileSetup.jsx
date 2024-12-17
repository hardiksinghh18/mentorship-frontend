import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileSetup = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    role: user?.role || "",
    skills: user?.skills || "",
    interests: user?.interests || "",
    bio: user?.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/api/profile/setup",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile.");
    }
  };

  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000104] to-slate-800 p-6">
      <div className="w-full max-w-2xl mt-10 bg-[#000104] rounded-2xl shadow-lg overflow-hidden p-8">
        <h2 className="text-4xl font-bold text-white text-center mb-6">
          Complete Your Profile
        </h2>
        <p className="text-gray-400 text-center mb-10">
          Personalize your profile to get tailored mentorship recommendations.
        </p>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-6">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              name="role"
              id="role"
              className="w-full px-4 py-3 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="mentor">Mentor</option>
              <option value="mentee">Mentee</option>
            </select>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="skills"
            >
              Skills
            </label>
            <input
              type="text"
              name="skills"
              id="skills"
              placeholder="E.g., React, Node.js"
              className="w-full px-4 py-3 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-blue-500"
              value={formData.skills}
              onChange={handleChange}
              required
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="interests"
            >
              Interests
            </label>
            <input
              type="text"
              name="interests"
              id="interests"
              placeholder="E.g., Web Development, AI"
              className="w-full px-4 py-3 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-blue-500"
              value={formData.interests}
              onChange={handleChange}
              required
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label
              className="block text-lg font-medium text-gray-300 mb-2"
              htmlFor="bio"
            >
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              placeholder="Write something about yourself"
              className="w-full px-4 py-3 rounded-md bg-slate-900 text-white focus:ring-2 focus:ring-blue-500"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
