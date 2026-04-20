import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setLoggedOut } from "../../redux/actions/authActions";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FiBriefcase, FiMail } from "react-icons/fi";

const ProfileInfo = ({ profile, isOwnProfile, currentUserId, onSendRequest }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { receivedRequests, sentRequests } = profile;

  const [buttonStatus, setButtonStatus] = useState("connect");

  const determineButtonStatus = () => {
    const receivedRequest = profile?.receivedRequests?.find(
      (req) => req.senderId === currentUserId && req.receiverId === profile?.id
    );
    const sentRequest = profile?.sentRequests?.find(
      (req) => req.receiverId === currentUserId && req.senderId === profile?.id
    );

    if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
      return "connected";
    }
    if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
      return "pending";
    }
    return "connect";
  };

  const handleLogout = () => {
    dispatch(setLoggedOut());
    navigate("/login");
  };

  useEffect(() => {
    setButtonStatus(determineButtonStatus());
  }, [receivedRequests, sentRequests, currentUserId, profile?.id]);

  const handleButtonClick = async () => {
    if (buttonStatus === "connect") {
      await onSendRequest(profile?.id, currentUserId);
      setButtonStatus("pending");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-black rounded-[2.5rem] overflow-hidden border border-white/[0.03]">
      {/* Editorial Cover Section */}
      <div className="h-40 bg-zinc-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/[0.02] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />
      </div>

      {/* Identity Stack */}
      <div className="relative px-8 pb-10">
        {/* Avatar positioned partially over cover */}
        <div className="absolute -top-16 left-8">
          <div className="w-32 h-32 bg-zinc-950 rounded-[2rem] border-4 border-black flex items-center justify-center shadow-2xl overflow-hidden group">
            <FaUserCircle className="text-zinc-800 text-9xl group-hover:text-white transition-colors duration-500" />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="pt-20">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                  {profile?.fullName || profile?.username}
                </h1>
                {profile?.role && (
                  <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded">
                    {profile.role}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Link to={`/profile/${profile?.username}`} className="text-zinc-500 text-lg font-bold italic tracking-tight hover:text-white transition-colors">
                  @{profile?.username}
                </Link>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <div className="flex items-center gap-2 text-zinc-400 group cursor-default">
                    <FiMail className="text-sm group-hover:text-white transition-colors" />
                    <span className="text-xs font-medium tracking-wide">{profile?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Group */}
            <div className="w-full md:w-auto pt-4 md:pt-0">
              {!isOwnProfile ? (
                <button
                  onClick={handleButtonClick}
                  className={`w-full md:w-48 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${buttonStatus === "pending"
                      ? "bg-zinc-900 text-zinc-500 border-white/5 cursor-not-allowed"
                      : buttonStatus === "connected"
                        ? "bg-white text-black border-white"
                        : "bg-white text-black border-white hover:bg-black hover:text-white"
                    }`}
                  disabled={buttonStatus !== "connect"}
                >
                  {buttonStatus === "pending" ? "Pending" : buttonStatus === "connected" ? "Connected" : "Connect"}
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/profile/setup"
                    className="px-10 py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-zinc-200 transition-all text-center shadow-lg hover:shadow-white/10"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-8 py-3 bg-zinc-900 text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] rounded-full hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Architectural Bar */}
          <div className="flex gap-12 mt-12 pt-8 border-t border-white/[0.03]">
            <div className="group">
              <p className="text-2xl font-black text-white tracking-tighter group-hover:translate-y-[-2px] transition-transform">0</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Connections</p>
            </div>
            <div className="group">
              <p className="text-2xl font-black text-white tracking-tighter group-hover:translate-y-[-2px] transition-transform">{profile?.skills?.length || 0}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Acquired Skills</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-12 space-y-16">
          <section className="space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600 block mb-6">Brief Narrative</h2>
            <p className="text-zinc-400 text-lg leading-[1.6] font-medium max-w-3xl">
              {profile?.bio || "Trajectory details currently undisclosed."}
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Core Proficiencies</h2>
            <div className="flex flex-wrap gap-2">
              {profile?.skills?.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-white/[0.02] border border-white/[0.05] rounded-lg text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Active Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile?.interests?.map((interest, index) => (
                <span key={index} className="px-4 py-2 bg-transparent border border-white/5 rounded-lg text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-all cursor-default">
                  {interest}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;