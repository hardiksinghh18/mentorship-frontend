import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCheck, FaClock, FaLinkedin, FaGithub, FaTwitter, FaLink, FaExternalLinkAlt, FaGraduationCap } from "react-icons/fa";
import { FiBriefcase, FiTerminal, FiAlignLeft, FiUserPlus } from "react-icons/fi";
import { Tooltip, Chip } from "@mui/material";

const ProfileCard = ({ profile, currentUserId, matchScore, matchDetails }) => {
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

  const determineButtonStatus = useCallback(() => {
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
  }, [receivedRequests, sentRequests, currentUserId, id]);

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
  }, [determineButtonStatus]);

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
          icon: <FaUserCheck size={16} />,
          className: "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default font-bold"
        };
      case "pending":
        return {
          text: "Pending",
          icon: <FaClock size={16} />,
          className: "bg-zinc-100 text-zinc-500 border border-zinc-200 cursor-default font-bold"
        };
      default:
        return {
          text: "",
          icon: <FiUserPlus size={16} />,
          className: isProfileComplete 
            ? "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-900 shadow-sm font-bold" 
            : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
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
    <div className="group relative bg-zinc-50 transition-all duration-500 rounded-[16px] p-6 border border-zinc-200 hover:border-zinc-300 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Persona (Desktop) */}
        <div className="hidden md:flex shrink-0 flex-col items-center gap-4 min-w-[80px]">
          <div className="relative">
            <Link to={`/profile/${username}`} className="block w-14 h-14 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 group-hover:border-zinc-400 transition-all duration-500">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-700 transition-colors">
                {username[0]?.toUpperCase()}
              </div>
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3">
            {role && (
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${role === 'mentor'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}>
                {role}
              </span>
            )}
            
            {matchDetails && (
              <div className="relative flex items-center justify-center w-12 h-12 mt-1">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke="#e4e4e7"
                    strokeWidth="3"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    stroke={matchDetails.compatibilityScore >= 60 ? "#10b981" : matchDetails.compatibilityScore >= 20 ? "#3b82f6" : "#71717a"}
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 - (matchDetails.compatibilityScore / 100) * (2 * Math.PI * 18)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-[10px] font-black tracking-tight text-zinc-900">
                  {matchDetails.compatibilityScore}%
                </span>
              </div>
            )}
            
            {matchScore && !matchDetails && (
              <span className="text-[10px] font-bold text-zinc-600 tracking-tight">
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
                <Link to={`/profile/${username}`} className="block w-10 h-10 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-zinc-700">
                    {username[0]?.toUpperCase()}
                  </div>
                </Link>
                {role && (
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${role === 'mentor'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                    {role}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight truncate">
                      {name}
                    </h3>
                    <Tooltip title="View Full Profile" arrow>
                      <Link
                        to={`/profile/${username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-zinc-900 transition-all hover:scale-110 active:scale-95 shrink-0"
                      >
                        <FaExternalLinkAlt size={13} />
                      </Link>
                    </Tooltip>
                  </div>
                  {matchDetails && (
                    <span className={`md:hidden px-2 py-0.5 rounded-[4px] text-[9px] font-black tracking-widest uppercase border transition-all duration-300 flex items-center gap-1.5 ${
                      matchDetails.compatibilityScore >= 60 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : matchDetails.compatibilityScore >= 20 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                    }`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        matchDetails.compatibilityScore >= 60 ? 'bg-emerald-500 animate-pulse' : matchDetails.compatibilityScore >= 20 ? 'bg-blue-500' : 'bg-zinc-400'
                      }`} />
                      <span>
                        {matchDetails.compatibilityScore}% Match
                      </span>
                    </span>
                  )}
                  {matchScore && !matchDetails && (
                    <span className={`md:hidden px-2 py-0.5 rounded-[4px] text-[9px] font-black tracking-widest uppercase border flex items-center gap-1.5 ${
                      matchScore >= 60 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : matchScore >= 20 
                          ? 'bg-blue-50 border-blue-200 text-blue-700' 
                          : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                    }`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                        matchScore >= 60 ? 'bg-emerald-500 animate-pulse' : matchScore >= 20 ? 'bg-blue-500' : 'bg-zinc-400'
                      }`} />
                      <span>
                        {matchScore}% Match
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-zinc-500 text-sm font-bold tracking-tight lowercase">
                    @{username}
                  </span>
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
                        <FaGithub className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer" size={16} />
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
                        <FaLink className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer" size={16} />
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


          {/* Info Grid with Right-Aligned AI Match Badges */}
          <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
            {/* Left Column: Core Profile Details */}
            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {currentExperience && (
                <div className="flex items-center gap-3 text-zinc-700">
                  <FiBriefcase size={14} className="text-zinc-500 shrink-0" />
                  <p className="text-[13px] font-bold tracking-tight truncate">
                    {currentExperience.role} <span className="text-zinc-400 mx-1">at</span> <span className="text-zinc-900">{currentExperience.company}</span>
                  </p>
                </div>
              )}

              {currentEducation && (
                <div className="flex items-center gap-3 text-zinc-700">
                  <FaGraduationCap size={14} className="text-zinc-500 shrink-0" />
                  <p className="text-[13px] font-bold tracking-tight truncate">
                    {currentEducation.degree} <span className="text-zinc-400 mx-1">from</span> <span className="text-zinc-900">{currentEducation.college}</span>
                  </p>
                </div>
              )}

              {bio && (
                <div className="flex items-start gap-3 text-zinc-700">
                  <FiAlignLeft size={14} className="text-zinc-500 shrink-0 mt-1" />
                  <p className="text-[13px] leading-relaxed font-medium text-zinc-600">
                    {bio.length > 180 ? `${bio.slice(0, 177)}...` : bio}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: AI Smart Match Badges */}
            {matchDetails?.insights && (
              <div className="flex md:flex-col flex-wrap gap-2 md:items-end shrink-0 max-w-full md:max-w-[220px] mt-2 md:mt-0">
                {matchDetails.insights.map((insight, idx) => {
                  const isOverlap = insight.includes('Shared');
                  const isSync = insight.includes('Peer') || insight.includes('Level');
                  const isMentor = insight.includes('Guide') || insight.includes('Learner') || insight.includes('Experience');
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-[6px] text-[9px] font-black uppercase tracking-widest border transition-all duration-300 ${
                        isOverlap 
                          ? 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100' 
                          : isSync
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : isMentor
                              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                              : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {insight}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-zinc-400">
                <FiTerminal size={14} />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills?.slice(0, 3).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      color: '#3f3f46',
                      fontSize: '10px',
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
                  <span className="px-2 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
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
