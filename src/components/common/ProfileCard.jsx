import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCheck, FaClock, FaLinkedin, FaGithub, FaTwitter, FaLink, FaExternalLinkAlt, FaGraduationCap } from "react-icons/fa";
import { FiBriefcase, FiTerminal, FiAlignLeft, FiUserPlus } from "react-icons/fi";
import { Tooltip, Chip } from "@mui/material";

const ProfileCard = ({ profile, currentUserId, matchScore }) => {
  const { id, name, role, skills, username, bio, receivedRequests, sentRequests, experience, socialLinks, education } = profile;

  // Safely parse JSON fields
  const parsedExperience = typeof experience === 'string' ? JSON.parse(experience) : experience;
  const parsedSocialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
  const parsedEducation = typeof education === 'string' ? JSON.parse(education) : education;

  // Get current role and company
  const currentExperience = parsedExperience && Array.isArray(parsedExperience) && parsedExperience.length > 0
    ? parsedExperience.find(exp => exp.currentlyWorking) || parsedExperience[0]
    : null;

  // Get latest education
  const currentEducation = parsedEducation && Array.isArray(parsedEducation) && parsedEducation.length > 0
    ? [...parsedEducation].sort((a, b) => new Date(b.endYear) - new Date(a.endYear))[0]
    : null;

  const { user: currentUser } = useSelector((state) => state.auth);

  // Calculate if the LOGGED-IN user has a complete profile
  const isProfileComplete = (() => {
    const fields = ['role', 'skills', 'bio', 'education', 'experience'];
    return fields.every(field => {
      const val = currentUser?.[field];
      return Array.isArray(val) ? val.length > 0 : !!val;
    });
  })();

  const [buttonStatus, setButtonStatus] = useState("connect");

  const determineButtonStatus = () => {
    const receivedRequest = receivedRequests?.find(
      (req) => req.senderId === currentUserId && req.receiverId === id
    );
    const sentRequest = sentRequests?.find(
      (req) => req.receiverId === currentUserId && req.senderId === id
    );

    if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
      return "connected";
    }
    if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
      return "pending";
    }
    return "connect";
  };

  const onSendRequest = async (receiverId, senderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
      toast.success(response.data.message);
      setButtonStatus("pending");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    }
  };

  useEffect(() => {
    setButtonStatus(determineButtonStatus());
  }, [receivedRequests, sentRequests, currentUserId, id]);

  const handleSendRequest = async () => {
    if (buttonStatus === "connect" && isProfileComplete) {
      await onSendRequest(id, currentUserId);
    }
  };

  const getButtonConfig = () => {
    switch (buttonStatus) {
      case "connected":
        return {
          text: "Connected",
          icon: <FaUserCheck size={14} />,
          className: "bg-white/10 text-white cursor-default"
        };
      case "pending":
        return {
          text: "Pending",
          icon: <FaClock size={14} />,
          className: "bg-white/5 text-white/50 cursor-default"
        };
      default:
        return {
          text: "",
          icon: <FiUserPlus size={18} />,
          className: isProfileComplete 
            ? "border-white/20 text-white hover:bg-white/10 hover:border-white/40" 
            : "border-white/10 text-white/20 cursor-not-allowed"
        };
    }
  };

  const btnConfig = getButtonConfig();

  // Helper for the tooltip message
  const getTooltipTitle = () => {
    if (buttonStatus !== "connect") return btnConfig.text || buttonStatus;
    if (!isProfileComplete) return "Complete your profile to start connecting with others";
    return "Connect with User";
  };

  return (
    <div className="group relative bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 rounded-[16px] p-6 border border-white/[0.05] hover:border-white/10">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Persona (Desktop) */}
        <div className="hidden md:flex shrink-0 flex-col items-center gap-4 min-w-[80px]">
          <div className="relative">
            <Link to={`/profile/${username}`} className="block w-14 h-14 rounded-full overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-all duration-500">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
                {username[0]?.toUpperCase()}
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            {role && (
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${role === 'mentor'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                {role}
              </span>
            )}
            {matchScore && (
              <span className="text-[9px] font-bold text-white/30 tracking-tight">
                {matchScore}% Match
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Mobile Avatar */}
              <div className="md:hidden shrink-0 flex flex-col items-center gap-2">
                <Link to={`/profile/${username}`} className="block w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-white/5">
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white/40">
                    {username[0]?.toUpperCase()}
                  </div>
                </Link>
                {role && (
                  <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border ${role === 'mentor'
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                    {role}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-white tracking-tight truncate">
                    {name}
                  </h3>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-zinc-500 text-xs font-bold tracking-tight lowercase">
                    @{username}
                  </span>
                  <Tooltip title="View Full Profile" arrow>
                    <Link
                      to={`/profile/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 hover:text-white transition-all hover:scale-110 active:scale-95"
                    >
                      <FaExternalLinkAlt size={14} />
                    </Link>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {parsedSocialLinks && (
                <div className="flex items-center gap-4">
                  {parsedSocialLinks.linkedin && (
                    <Tooltip title="LinkedIn" arrow>
                      <a href={parsedSocialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <FaLinkedin className="text-zinc-600 hover:text-[#0077b5] transition-colors cursor-pointer" size={16} />
                      </a>
                    </Tooltip>
                  )}
                  {parsedSocialLinks.github && (
                    <Tooltip title="GitHub" arrow>
                      <a href={parsedSocialLinks.github} target="_blank" rel="noopener noreferrer">
                        <FaGithub className="text-zinc-600 hover:text-white transition-colors cursor-pointer" size={16} />
                      </a>
                    </Tooltip>
                  )}
                  {parsedSocialLinks.twitter && (
                    <Tooltip title="Twitter / X" arrow>
                      <a href={parsedSocialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <FaTwitter className="text-zinc-600 hover:text-[#1DA1F2] transition-colors cursor-pointer" size={16} />
                      </a>
                    </Tooltip>
                  )}
                  {parsedSocialLinks.portfolio && (
                    <Tooltip title="Portfolio" arrow>
                      <a href={parsedSocialLinks.portfolio} target="_blank" rel="noopener noreferrer">
                        <FaLink className="text-zinc-600 hover:text-white transition-colors cursor-pointer" size={16} />
                      </a>
                    </Tooltip>
                  )}
                </div>
              )}

              <Tooltip title={getTooltipTitle()} arrow>
                <span>
                  <button
                    onClick={handleSendRequest}
                    disabled={buttonStatus !== "connect" || !isProfileComplete}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all active:scale-[0.98] ${btnConfig.className}`}
                  >
                    {btnConfig.icon}
                  </button>
                </span>
              </Tooltip>
            </div>
          </div>


          {/* Info Grid */}
          <div className="flex flex-col gap-3">
            {currentExperience && (
              <div className="flex items-center gap-3 text-white/60">
                <FiBriefcase size={14} className="text-zinc-700 shrink-0" />
                <p className="text-[12px] font-bold tracking-tight truncate">
                  {currentExperience.role} <span className="text-zinc-700 mx-1">at</span> <span className="text-white/90">{currentExperience.company}</span>
                </p>
              </div>
            )}

            {currentEducation && (
              <div className="flex items-center gap-3 text-white/60">
                <FaGraduationCap size={14} className="text-zinc-700 shrink-0" />
                <p className="text-[12px] font-bold tracking-tight truncate">
                  {currentEducation.degree} <span className="text-zinc-700 mx-1">from</span> <span className="text-white/90">{currentEducation.college}</span>
                </p>
              </div>
            )}

            {bio && (
              <div className="flex items-start gap-3 text-white/60">
                <FiAlignLeft size={14} className="text-zinc-700 shrink-0 mt-1" />
                <p className="text-[12px] leading-relaxed font-medium text-zinc-400">
                  {bio.length > 180 ? `${bio.slice(0, 177)}...` : bio}
                </p>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-700">
                <FiTerminal size={14} />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills?.slice(0, 3).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      color: '#a1a1aa',
                      fontSize: '9px',
                      fontWeight: 800,
                      height: '24px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRadius: '4px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  />
                ))}
                {skills?.length > 3 && (
                  <span className="px-2 py-1 text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
                    +{skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Light Leak */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default ProfileCard;
