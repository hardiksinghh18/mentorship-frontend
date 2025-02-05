import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoggedIn } from "../redux/actions/authActions";
import { FiUser, FiBriefcase, FiTool, FiHeart, FiEdit } from "react-icons/fi";

const ProfileSetup = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    role: user?.role || "",
    skills: user?.skills || "",
    interests: user?.interests || "",
    bio: user?.bio || "",
  });

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/profile/update/${user.email}`,
        formData,
        { withCredentials: true }
      );
      
      if (response.data.loggedIn) {
        toast.success(response.data.message);
        dispatch(setLoggedIn());
        setTimeout(() => navigate(`/profile/${user.username}`), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] ">
      <div className="w-full max-w-2xl bg-[#0d0d0d] rounded-xl shadow-2xl border md:my-24 border-[#30363d] overflow-hidden">
        <div className="p-8 border-b border-[#30363d]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#238636] rounded-lg">
              <FiEdit className="text-md md:text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-sm md:text-2xl font-bold text-white">Complete Your Profile</h2>
              <p className="text-xs md:text-sm text-[#8b949e] mt-1">Help us match you with ideal mentors/mentees</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8b949e] group-focus-within:text-[#58a6ff]">
                <FiUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-white focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Select */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8b949e] group-focus-within:text-[#58a6ff]">
                <FiBriefcase className="w-5 h-5" />
              </div>
              <select
                name="role"
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-white focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] appearance-none transition-all"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="mentor" className="bg-[#161b22]">Mentor</option>
                <option value="mentee" className="bg-[#161b22]">Mentee</option>
              </select>
            </div>

            {/* Skills Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8b949e] group-focus-within:text-[#58a6ff]">
                <FiTool className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="skills"
                placeholder="Skills (comma separated)"
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-white focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>

            {/* Interests Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#8b949e] group-focus-within:text-[#58a6ff]">
                <FiHeart className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="interests"
                placeholder="Interests (comma separated)"
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-white focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                value={formData.interests}
                onChange={handleChange}
                required
              />
            </div>

            {/* Bio Textarea */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pt-3 pl-3 text-[#8b949e] group-focus-within:text-[#58a6ff]">
                <FiUser className="w-5 h-5" />
              </div>
              <textarea
                name="bio"
                placeholder="Tell us about yourself..."
                className="w-full pl-10 pr-4 py-3 bg-[#0d1117] rounded-lg border border-[#30363d] text-white focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all resize-none min-h-[120px]"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#238636] rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            >
              <FiEdit className="w-5 h-5" />
              Complete Profile
            </button>
          </form>
        </div>
        
        <div className="p-4 bg-[#0d1117] text-center border-t border-[#30363d]">
          <p className="text-sm text-[#8b949e]">
            Need help? <span className="text-[#58a6ff] cursor-pointer hover:underline">Contact support</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;