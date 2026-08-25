import React, { useState } from 'react';
import { RiSearch2Line } from 'react-icons/ri';
import { HiSparkles } from 'react-icons/hi';
import { 
  FiArrowLeft, 
  FiBriefcase, 
  FiTerminal, 
  FiAlignLeft, 
  FiExternalLink, 
  FiUserPlus, 
  FiCheck 
} from 'react-icons/fi';
import { 
  FaGraduationCap, 
  FaLinkedin, 
  FaGithub, 
  FaTwitter, 
  FaLink 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Candidate {
  id: string;
  fullName: string;
  username: string;
  role: 'mentor' | 'mentee';
  compatibilityScore: number;
  company: string;
  education: string;
  bio: string;
  skills: string[];
  insights: string[];
  isSent?: boolean;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
}

interface ExploreDemoProps {
  onSendRequest: () => void;
  selectedUsername?: string | null;
  onSelectProfile?: (username: string | null) => void;
}

const ExploreDemo: React.FC<ExploreDemoProps> = ({ 
  onSendRequest,
  selectedUsername,
  onSelectProfile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'ai'>('explore');
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 'adityam',
      fullName: 'Aditya Malhotra',
      username: 'adityamalhotra500',
      role: 'mentee',
      compatibilityScore: 42,
      company: 'Data Scientist at Apple',
      education: 'Bachelor of Technology from IIT Delhi',
      bio: 'Building modern web applications with a focus on simplicity.',
      skills: ['Node.js', 'React', 'SQL'],
      insights: ['Aspiring Learner'],
      socialLinks: { linkedin: '#', github: '#', twitter: '#', portfolio: '#' }
    },
    {
      id: 'ananyap',
      fullName: 'Ananya Patel',
      username: 'ananyapatel845',
      role: 'mentor',
      compatibilityScore: 54,
      company: 'Engineering Manager at Tesla',
      education: 'Bachelor of Technology from Stanford University',
      bio: 'Building modern web applications with a focus on simplicity.',
      skills: ['Cybersecurity', 'Data Science', 'Spring Boot'],
      insights: ['Peer Match', 'Similar Career Level'],
      socialLinks: { linkedin: '#', github: '#', twitter: '#', portfolio: '#' }
    },
    {
      id: 'saishav',
      fullName: 'Saisha Verma',
      username: 'saishaverma327',
      role: 'mentee',
      compatibilityScore: 76,
      company: 'Senior Developer at Microsoft',
      education: 'Bachelor of Technology from University of Oxford',
      bio: 'Building modern web applications with a focus on simplicity.',
      skills: ['React', 'System Design', 'TypeScript'],
      insights: ['Aspiring Learner'],
      socialLinks: { linkedin: '#', github: '#', twitter: '#', portfolio: '#' }
    },
    {
      id: 'sarahj',
      fullName: 'Sarah Jenkins',
      username: 'sarahj',
      role: 'mentor',
      compatibilityScore: 96,
      company: 'Staff Engineer at Stripe',
      education: 'Master of Computer Science from Stanford University',
      bio: 'Staff Engineer at Stripe. Passionate about frontend performance, scalable component architectures, and web vitals.',
      skills: ['React', 'System Design', 'TypeScript', 'Node.js'],
      insights: ['Ideal Guide', '2 Shared Skills'],
      socialLinks: { linkedin: '#', github: '#', twitter: '#' }
    }
  ]);

  const handleSendRequestLocal = (id: string, name: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        if (c.isSent) return c;
        onSendRequest(); // Increment pending count
        toast.success(`Connection request sent to ${name}!`);
        return { ...c, isSent: true };
      }
      return c;
    }));
  };

  // filter profiles based on active tab and search criteria
  const filteredCandidates = candidates.filter(c => {
    // Search filter
    const matchesSearch = 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    // AI Smart Match filter (e.g. only profiles with compatibility score >= 60%)
    if (activeTab === 'ai') {
      return c.compatibilityScore >= 60;
    }
    
    return true;
  });

  // If a profile username is selected, render the profile details view
  if (selectedUsername) {
    const profile = candidates.find(c => c.username === selectedUsername);
    if (profile) {
      return (
        <div className="space-y-8 animate-in fade-in duration-300 text-left">
          {/* Back link */}
          <button 
            onClick={() => onSelectProfile?.(null)}
            className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Back to Explore
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-zinc-950 text-white border border-zinc-850 flex items-center justify-center text-lg font-black shrink-0 shadow-sm">
                {profile.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 leading-tight">{profile.fullName}</h3>
                <p className="text-xs text-zinc-400 font-bold mt-1">@{profile.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono ${
                    profile.role === 'mentor'
                      ? 'bg-violet-55/10 text-violet-700 border-violet-200/50'
                      : 'bg-emerald-55/10 text-emerald-700 border-emerald-200/50'
                  }`}>
                    {profile.role === 'mentor' ? 'Mentor' : 'Mentee'}
                  </span>
                  <span className="text-[10px] text-zinc-450 font-bold">
                    {profile.compatibilityScore}% Compatibility
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    className="text-zinc-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    className={profile.compatibilityScore >= 60 ? "text-emerald-500" : "text-blue-500"}
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 - (profile.compatibilityScore / 100) * (2 * Math.PI * 18)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-zinc-800">
                  {profile.compatibilityScore}%
                </span>
              </div>
              <button
                onClick={() => handleSendRequestLocal(profile.id, profile.fullName)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] ${
                  profile.isSent
                    ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-default animate-none'
                    : 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm'
                }`}
              >
                {profile.isSent ? 'Pending Approval' : 'Send Match Request'}
              </button>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Content (col-8) */}
            <div className="md:col-span-8 space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">Biography</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                  {profile.bio}
                </p>
              </div>

              {/* Mock Projects */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider">Verified Proof of Work</h4>
                <div className="border border-zinc-200 rounded-2xl p-5 space-y-3 bg-zinc-50/50">
                  <div className="flex items-center gap-2 text-zinc-800">
                    <FiTerminal className="w-4 h-4 text-zinc-650" />
                    <span className="text-xs font-bold">{profile.role === 'mentor' ? 'Enterprise Component Library' : 'Personal Developer Portfolio'}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Designed and built a modular framework using React, custom hooks, and utility components. Backed by verified GitHub commits.
                  </p>
                </div>
              </div>
            </div>

            {/* Right sidebar skills (col-4) */}
            <div className="md:col-span-4 space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-150">
                <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-4">Target Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded bg-white text-[9px] text-zinc-500 border border-zinc-155 font-bold uppercase tracking-tight font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-left space-y-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">Explore</h2>
        <p className="text-zinc-500 text-xs font-medium max-w-xl">
          Connect with expert mentors and ambitious mentees across the globe.
        </p>
      </div>

      {/* Action Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-zinc-100">
        
        {/* Search input (left) */}
        <div className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
            <RiSearch2Line className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search members by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200/80 rounded-xl text-xs font-semibold placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 transition-all duration-300"
          />
        </div>

        {/* Tab Controls (right) */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
          
          {/* Tab Button: Explore */}
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 border rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] ${
              activeTab === 'explore'
                ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                : 'bg-white border-zinc-200/80 text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            Explore
          </button>

          {/* Tab Button: AI Smart Match */}
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 border rounded-xl text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 active:scale-[0.98] ${
              activeTab === 'ai'
                ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm'
                : 'bg-white border-zinc-200/80 text-violet-650 hover:bg-zinc-50'
            }`}
          >
            <HiSparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
            <span>AI Smart Match</span>
          </button>

        </div>

      </div>

      {/* List Grid */}
      <div className="space-y-6">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-200 rounded-[28px] text-zinc-400 text-xs font-medium">
            No smart matching profiles found. Try checking the filters or searching for skills.
          </div>
        ) : (
          filteredCandidates.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-zinc-200/80 hover:border-zinc-350 hover:shadow-xs p-6 rounded-[28px] transition-all flex gap-6 text-left"
            >
              
              {/* Column 1: Left column avatar & circular progress */}
              <div className="flex flex-col items-center gap-4 shrink-0 w-20">
                <div 
                  className="w-14 h-14 bg-zinc-100 border border-zinc-200 rounded-full flex items-center justify-center text-sm font-bold font-mono text-zinc-600 hover:border-zinc-300 transition-colors cursor-pointer"
                  onClick={() => onSelectProfile?.(c.username)}
                >
                  {c.fullName.charAt(0)}
                </div>
                
                {/* Role label */}
                <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono text-center w-full ${
                  c.role === 'mentor'
                    ? 'bg-violet-50 border-violet-100 text-violet-755'
                    : 'bg-amber-50 border-amber-100 text-amber-700'
                }`}>
                  {c.role}
                </span>

                {/* Compatibility Circle Progress SVG */}
                <div className="relative w-12 h-12 flex items-center justify-center mt-1">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      className="text-zinc-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="18"
                      className={c.compatibilityScore >= 60 ? "text-emerald-500" : "text-blue-500"}
                      strokeWidth="3.5"
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 - (c.compatibilityScore / 100) * (2 * Math.PI * 18)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-zinc-800">
                    {c.compatibilityScore}%
                  </span>
                </div>
              </div>

              {/* Column 2: Middle details */}
              <div className="flex-1 space-y-3.5 min-w-0">
                {/* Name & Handle */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 
                      className="text-sm font-black text-zinc-900 leading-none cursor-pointer hover:text-violet-700 transition-colors"
                      onClick={() => onSelectProfile?.(c.username)}
                    >
                      {c.fullName}
                    </h4>
                    <FiExternalLink 
                      className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-650 cursor-pointer shrink-0 transition-colors" 
                      onClick={() => onSelectProfile?.(c.username)}
                      title="View full profile"
                    />
                    <span className="text-[10px] text-zinc-400 font-bold">@{c.username}</span>
                  </div>
                </div>

                {/* Info Rows */}
                <div className="space-y-2">
                  
                  {/* Job/Role */}
                  <div className="flex items-center gap-2.5 text-zinc-700">
                    <FiBriefcase className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-xs font-bold leading-none tracking-tight">{c.company}</span>
                  </div>

                  {/* Education */}
                  <div className="flex items-center gap-2.5 text-zinc-600">
                    <FaGraduationCap className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="text-xs font-bold leading-none tracking-tight">{c.education}</span>
                  </div>

                  {/* Bio */}
                  <div className="flex items-start gap-2.5 text-zinc-550 leading-relaxed font-normal">
                    <FiAlignLeft className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">{c.bio}</span>
                  </div>

                </div>

                {/* Skills row */}
                <div className="flex gap-2 items-start pt-2 border-t border-zinc-50">
                  <FiTerminal className="w-3.5 h-3.5 text-zinc-400 shrink-0 select-none mt-1" />
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded-[4px] text-[8px] font-bold uppercase tracking-wider text-zinc-550 hover:border-zinc-300 transition-all font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Column 3: Right details */}
              <div className="flex flex-col items-end justify-between shrink-0 pl-4 w-44">
                
                {/* Social icons & Connection Button */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 mr-2">
                    <button type="button" className="text-zinc-400 hover:text-[#0077b5] transition-colors"><FaLinkedin className="w-3.5 h-3.5" /></button>
                    <button type="button" className="text-zinc-400 hover:text-zinc-900 transition-colors"><FaGithub className="w-3.5 h-3.5" /></button>
                    <button type="button" className="text-zinc-400 hover:text-[#1DA1F2] transition-colors"><FaTwitter className="w-3.5 h-3.5" /></button>
                    <button type="button" className="text-zinc-400 hover:text-zinc-900 transition-colors"><FaLink className="w-3.5 h-3.5" /></button>
                  </div>

                  {/* Connect Button */}
                  <button
                    onClick={() => handleSendRequestLocal(c.id, c.fullName)}
                    disabled={c.isSent}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-[0.98] ${
                      c.isSent
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-zinc-950 border-zinc-950 text-white hover:bg-zinc-800 shadow-sm'
                    }`}
                    title={c.isSent ? 'Connection pending' : 'Connect'}
                  >
                    {c.isSent ? <FiCheck className="w-4 h-4" /> : <FiUserPlus className="w-4 h-4" />}
                  </button>
                </div>

                {/* AI smart matches tags */}
                <div className="flex flex-col gap-1.5 items-end max-w-full">
                  {c.insights.map((insight, idx) => {
                    const isOverlap = insight.includes('Shared');
                    const isSync = insight.includes('Peer') || insight.includes('Level');
                    const isMentor = insight.includes('Guide') || insight.includes('Learner') || insight.includes('Experience');
                    return (
                      <span
                        key={idx}
                        className={`px-2.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${
                          isOverlap 
                            ? 'bg-violet-50 text-violet-755 border-violet-200 hover:bg-violet-100' 
                            : isSync
                              ? 'bg-emerald-50 text-emerald-755 border-emerald-200 hover:bg-emerald-100'
                              : isMentor
                                ? 'bg-blue-50 text-blue-755 border-blue-200 hover:bg-blue-100'
                                : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                        }`}
                      >
                        {insight}
                      </span>
                    );
                  })}
                </div>

              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExploreDemo;
