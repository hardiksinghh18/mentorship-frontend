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
    skills: Array.isArray(user?.skills) ? user.skills.join(", ") : (user?.skills || ""),
    interests: Array.isArray(user?.interests) ? user.interests.join(", ") : (user?.interests || ""),
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
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl bg-black rounded-[2.5rem] border border-white/[0.03] overflow-hidden">
        <div className="p-10 md:p-16">
          <div className="flex flex-col gap-2 mb-16">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2">Configuration</h2>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-4">
              Refine Your Identity
            </h1>
            <p className="text-zinc-500 text-sm font-medium tracking-tight">
              Adjust your trajectory to synchronize with the ideal mentorship network.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-8">
              {/* Name Field */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-600 group-focus-within:text-white transition-colors">
                    <FiUser size={18} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter full name"
                    className="w-full pl-12 pr-6 py-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] text-white placeholder:text-zinc-700 focus:border-white focus:bg-white/[0.05] transition-all outline-none font-bold"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Role Select */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Operational Role</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-600 group-focus-within:text-white transition-colors pointer-events-none">
                    <FiBriefcase size={18} />
                  </div>
                  <select
                    name="role"
                    className="w-full pl-12 pr-6 py-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] text-white focus:border-white focus:bg-white/[0.05] appearance-none transition-all outline-none font-bold"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" className="bg-zinc-950">Select Trajectory</option>
                    <option value="mentor" className="bg-zinc-950">Mentor</option>
                    <option value="mentee" className="bg-zinc-950">Mentee</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Skills Field */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Acquired Proficiencies</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-600 group-focus-within:text-white transition-colors">
                    <FiTool size={18} />
                  </div>
                  <input
                    type="text"
                    name="skills"
                    placeholder="Skills (comma separated)"
                    className="w-full pl-12 pr-6 py-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] text-white placeholder:text-zinc-700 focus:border-white focus:bg-white/[0.05] transition-all outline-none font-bold"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Interests Field */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Active Interests</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-600 group-focus-within:text-white transition-colors">
                    <FiHeart size={18} />
                  </div>
                  <input
                    type="text"
                    name="interests"
                    placeholder="Interests (comma separated)"
                    className="w-full pl-12 pr-6 py-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] text-white placeholder:text-zinc-700 focus:border-white focus:bg-white/[0.05] transition-all outline-none font-bold"
                    value={formData.interests}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Narrative</label>
                <div className="relative group">
                  <div className="absolute top-4 left-4 text-zinc-600 group-focus-within:text-white transition-colors">
                    <FiEdit size={18} />
                  </div>
                  <textarea
                    name="bio"
                    placeholder="Describe your journey..."
                    className="w-full pl-12 pr-6 py-4 bg-white/[0.02] rounded-2xl border border-white/[0.05] text-white placeholder:text-zinc-700 focus:border-white focus:bg-white/[0.05] transition-all outline-none font-bold resize-none min-h-[160px]"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-white/5 active:scale-[0.98]"
              >
                Apply Changes
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-10 py-8 bg-zinc-900/10 border-t border-white/[0.03]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 text-center">
            SkillSync <span className="text-zinc-800 mx-2">|</span> Identity Management Core
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;