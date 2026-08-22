import React from 'react';
import { FiBookOpen, FiSettings, FiZap, FiCheck, FiUser, FiMapPin, FiLinkedin, FiGithub, FiTwitter, FiLink, FiUserPlus, FiClock } from 'react-icons/fi';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const ProfileInfo = ({ profile, isOwnProfile, onSendRequest, currentUserId, connectionCount }) => {

  
  const getDurationString = (start, end) => {
    if (!start) return "";
    const startDate = dayjs(start);
    const endDate = end ? dayjs(end) : dayjs();
    const diff = dayjs.duration(endDate.diff(startDate));
    const years = diff.years();
    const months = diff.months();
    let parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    return parts.join(' ');
  };

  const groupExperience = (experiences) => {
    if (!experiences || experiences.length === 0) return [];
    const sorted = [...experiences].sort((a, b) => dayjs(b.startDate).diff(dayjs(a.startDate)));
    const groups = [];
    sorted.forEach(exp => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.company === exp.company) {
        lastGroup.roles.push(exp);
      } else {
        groups.push({ company: exp.company, location: exp.location, roles: [exp] });
      }
    });
    groups.forEach(group => {
      let totalMonths = 0;
      group.roles.forEach(role => {
        const start = dayjs(role.startDate);
        const end = role.endDate ? dayjs(role.endDate) : dayjs();
        totalMonths += end.diff(start, 'month');
      });
      const yrs = Math.floor(totalMonths / 12);
      const mos = totalMonths % 12;
      group.totalDuration = `${yrs > 0 ? `${yrs} yr${yrs > 1 ? 's' : ''} ` : ''}${mos > 0 ? `${mos} mo${mos > 1 ? 's' : ''}` : ''}`;
    });
    return groups;
  };

  const experienceGroups = groupExperience(profile?.experience);
  const isRequestSent = profile?.receivedRequests?.some(req => req.senderId === currentUserId);
  const isConnected = profile?.sentRequests?.some(req => req.receiverId === currentUserId && req.status === 'accepted') || 
                      profile?.receivedRequests?.some(req => req.senderId === currentUserId && req.status === 'accepted');

  return (
    <div className="w-full">
      {/* Premium Header System */}
      <div className="relative mb-12">
        {/* Banner Area */}
        <div className="h-32 md:h-40 w-full bg-gradient-to-r from-slate-100 via-zinc-100 to-slate-200 border border-zinc-200 rounded-[2rem] overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.8),transparent)]" />
        </div>

        {/* Identity & Actions Container */}
        <div className="px-8 md:px-12 -mt-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                {/* Avatar & Name */}
                <div className="flex-1 space-y-4">
                    <div className="w-20 h-20 md:w-28 md:h-28 bg-zinc-100 border-4 border-white rounded-[1.5rem] flex items-center justify-center text-zinc-700 shadow-lg relative overflow-hidden group">
                        <FiUser size={32} className="group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                            {profile?.fullName}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-bold text-zinc-500 tracking-tight lowercase">
                                    @{profile?.username}
                                </p>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                    profile?.role === 'mentor' 
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                }`}>
                                    {profile?.role}
                                </span>
                            </div>

                            {/* Social Presence Icons Inline with Username */}
                            {(() => {
                                const links = typeof profile?.socialLinks === 'string' 
                                    ? JSON.parse(profile.socialLinks) 
                                    : profile?.socialLinks;
                                
                                if (!links && isOwnProfile) return null;

                                return (
                                    <div className="flex items-center gap-6">
                                        {links && (
                                            <div className="flex items-center gap-4 pl-4 border-l border-zinc-200">
                                                {links.linkedin && links.linkedin.trim() !== "" && (
                                                    <Tooltip title="LinkedIn" arrow>
                                                        <a 
                                                            href={links.linkedin.trim().startsWith('http') ? links.linkedin.trim() : `https://${links.linkedin.trim()}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-zinc-500 hover:text-[#0077b5] transition-all hover:scale-110"
                                                        >
                                                            <FiLinkedin size={16} />
                                                        </a>
                                                    </Tooltip>
                                                )}
                                                {links.github && links.github.trim() !== "" && (
                                                    <Tooltip title="GitHub" arrow>
                                                        <a 
                                                            href={links.github.trim().startsWith('http') ? links.github.trim() : `https://${links.github.trim()}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-zinc-500 hover:text-zinc-900 transition-all hover:scale-110"
                                                        >
                                                            <FiGithub size={16} />
                                                        </a>
                                                    </Tooltip>
                                                )}
                                                {links.twitter && links.twitter.trim() !== "" && (
                                                    <Tooltip title="Twitter (X)" arrow>
                                                        <a 
                                                            href={links.twitter.trim().startsWith('http') ? links.twitter.trim() : `https://${links.twitter.trim()}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-zinc-500 hover:text-[#1DA1F2] transition-all hover:scale-110"
                                                        >
                                                            <FiTwitter size={16} />
                                                        </a>
                                                    </Tooltip>
                                                )}
                                                {links.portfolio && links.portfolio.trim() !== "" && (
                                                    <Tooltip title="Portfolio" arrow>
                                                        <a 
                                                            href={links.portfolio.trim().startsWith('http') ? links.portfolio.trim() : `https://${links.portfolio.trim()}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-zinc-500 hover:text-zinc-900 transition-all hover:scale-110"
                                                        >
                                                            <FiLink size={16} />
                                                        </a>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        )}

                                        {!isOwnProfile && (
                                            <div className={links ? "pl-6 border-l border-white/10" : ""}>
                                                <Tooltip title={isConnected ? "Connected" : isRequestSent ? "Pending Request" : "Send Connection Request"} arrow>
                                                    <button 
                                                        onClick={() => !isRequestSent && !isConnected && onSendRequest(profile.id, currentUserId)}
                                                        disabled={isRequestSent || isConnected}
                                                        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all active:scale-[0.98] shadow-2xl
                                                            ${isConnected 
                                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 cursor-default' 
                                                                : isRequestSent 
                                                                    ? 'bg-white/5 text-zinc-500 border-white/10 cursor-default' 
                                                                    : 'bg-white text-black border-white hover:bg-zinc-200'}`}
                                                    >
                                                        {isConnected ? (
                                                            <FiCheck size={14} />
                                                        ) : isRequestSent ? (
                                                            <FiClock size={14} />
                                                        ) : (
                                                            <FiUserPlus size={14} />
                                                        )}
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                        
                        <div className="pt-2">
                            <Link 
                                to={`/profile/${profile?.username}/connections`}
                                className="text-[10px] font-black text-zinc-500 hover:text-zinc-900 transition-all uppercase tracking-[0.3em] border-b border-zinc-200 hover:border-zinc-900 pb-1 w-fit"
                            >
                                {connectionCount} {connectionCount === 1 ? 'Connection' : 'Connections'}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Actions (Only for Own Profile Settings) */}
                {isOwnProfile && (
                    <div className="flex items-center gap-3 md:pb-4">
                        <Link 
                            to="/profile/setup"
                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-2xl hover:bg-zinc-200 hover:text-zinc-900 transition-all group"
                            title="Edit Profile"
                        >
                            <FiSettings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                        </Link>
                    </div>
                )}
                </div>
            </div>
        </div>

        <div className="px-8 md:px-12 space-y-12 border-t border-zinc-200 pt-10">
        {/* Bio Section */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight block">About</h2>
          <p className="text-zinc-600 text-sm md:text-base font-medium leading-relaxed tracking-tight max-w-4xl">
            {profile?.bio || "No bio provided."}
          </p>
        </section>

        {/* Experience Section */}
        {experienceGroups.length > 0 && (
          <section className="space-y-10">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight block">Experience</h2>
            <div className="space-y-12">
              {experienceGroups.map((group, gIndex) => (
                <div key={gIndex} className="flex gap-6 relative">
                  <div className="flex-shrink-0 w-14 h-14 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-center text-zinc-700 text-xl font-black">
                    {group.company.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 tracking-tight">{group.company}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mt-1 uppercase tracking-wider">
                        <span>{group.totalDuration}</span>
                        {group.location && (
                          <><span className="text-zinc-400">•</span><span>{group.location}</span></>
                        )}
                      </div>
                    </div>
                    <div className="space-y-8 relative ml-1">
                      {group.roles.length > 1 && (
                        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-zinc-200" />
                      )}
                      {group.roles.map((role, rIndex) => (
                        <div key={rIndex} className="flex gap-5 relative group/role">
                          <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 mt-1.5
                            ${group.roles.length > 1 ? 'bg-zinc-100 border-zinc-300 group-hover/role:border-zinc-900 group-hover/role:scale-125' : 'hidden'}`} 
                          />
                          <div className="space-y-1 flex-1">
                             <h4 className="text-xs font-black text-zinc-900 tracking-tight leading-none">{role.role}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                              <span>{role.employmentType}</span>
                              <span className="text-zinc-800">•</span>
                              <span className="text-zinc-500">
                                {dayjs(role.startDate).format('MMM YYYY')} — {role.endDate ? dayjs(role.endDate).format('MMM YYYY') : 'Present'}
                              </span>
                              <span className="text-zinc-800">•</span>
                              <span>{getDurationString(role.startDate, role.endDate)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {profile?.education?.length > 0 && (
          <section className="space-y-10">
            <h2 className="text-xl font-bold text-white tracking-tight block">Education</h2>
            <div className="space-y-8">
              {profile.education.map((edu, index) => (
                <div key={index} className="flex gap-6 group/edu">
                  <div className="flex-shrink-0 w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center text-zinc-600 group-hover/edu:text-white group-hover/edu:bg-white/[0.05] transition-all duration-500">
                    <FiBookOpen size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white tracking-tight leading-none">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </h3>
                    <p className="text-zinc-500 font-bold text-sm tracking-tight">{edu.college}</p>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 pt-1">
                      {edu.startYear ? dayjs(edu.startYear).format('YYYY') : 'N/A'} — {edu.endYear ? dayjs(edu.endYear).format('YYYY') : 'Present'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;