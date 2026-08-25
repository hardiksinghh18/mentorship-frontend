import React from 'react';
import { HiSparkles as SparklesIcon } from 'react-icons/hi';
import { FiBookOpen, FiEdit3, FiClock, FiVideo, FiChevronRight, FiUsers, FiBell, FiTerminal } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface DashboardDemoProps {
  learningCount: number;
  teachingCount: number;
  pendingCount: number;
  pendingRequestsCount: number;
  onNavigate: (tab: string, filter?: string, extraId?: string) => void;
}

const DashboardDemo: React.FC<DashboardDemoProps> = ({
  learningCount,
  teachingCount,
  pendingCount,
  pendingRequestsCount,
  onNavigate,
}) => {
  const activeRoadmaps = [
    {
      id: 'react-arch',
      title: 'React Architecture & Design Systems',
      progressPercent: 60,
      completedCount: 3,
      totalModules: 5,
      tag: 'LEARNING',
    },
    {
      id: 'pm-agile',
      title: 'Product Management & Agile Roadmapping',
      progressPercent: 25,
      completedCount: 1,
      totalModules: 4,
      tag: 'TEACHING',
      enrolled: 2
    }
  ];

  const aiMatches = [
    {
      fullName: 'Aarav Verma',
      username: 'aaravv',
      role: 'mentor',
      compatibilityScore: 82,
      company: 'Engineering Manager at Meta',
      skills: ['Product Management', 'Java'],
      insights: ['1 Shared Skill', 'Peer Match'],
      bio: 'Product manager bridging the gap between business goals and tech.',
    },
    {
      fullName: 'Karan Malhotra',
      username: 'karanm',
      role: 'mentor',
      compatibilityScore: 76,
      company: 'Product Manager at Amazon',
      skills: ['Spring Boot', 'Product Management'],
      insights: ['Peer Match', 'Ideal Experience Match'],
      bio: 'Data scientist exploring the intersections of AI and human psychology.',
    },
    {
      fullName: 'Sahil Malhotra',
      username: 'sahilm',
      role: 'mentor',
      compatibilityScore: 75,
      company: 'UX Designer at Spotify',
      skills: ['Product Management', 'Figma', 'Agile'],
      insights: ['Aspiring Learner', '2 Shared Skills'],
      bio: 'Passionate software engineer with a focus on high-performance systems.',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Greetings Banner */}
      <div className="text-left">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight leading-tight font-sans">
          Good morning, Hardik
        </h2>
        <p className="text-zinc-500 text-sm font-semibold mt-1">
          Manage your mentorships, chat with connections, and explore new opportunities.
        </p>
      </div>

      {/* Grid Layout matches production layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (col-9) */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* Workspace metrics in single row */}
          <div className="bg-zinc-50 border border-zinc-200/60 p-6 rounded-[24px] grid grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('workspace', 'learning')}
              className="flex flex-col p-4 rounded-2xl bg-white border border-zinc-200/50 hover:border-zinc-300 hover:shadow-sm transition-all text-left"
            >
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Learning</span>
              <span className="text-2xl font-black text-zinc-900 mt-1">{learningCount}</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <FiBookOpen className="w-3.5 h-3.5" /> Active tracks
              </span>
            </button>
            <button
              onClick={() => onNavigate('workspace', 'teaching')}
              className="flex flex-col p-4 rounded-2xl bg-white border border-zinc-200/50 hover:border-zinc-300 hover:shadow-sm transition-all text-left"
            >
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Teaching</span>
              <span className="text-2xl font-black text-zinc-900 mt-1">{teachingCount}</span>
              <span className="text-[10px] text-violet-600 font-semibold mt-1 flex items-center gap-1">
                <FiEdit3 className="w-3.5 h-3.5" /> Led tracks
              </span>
            </button>
            <button
              onClick={() => onNavigate('workspace', 'pending')}
              className="flex flex-col p-4 rounded-2xl bg-white border border-zinc-200/50 hover:border-zinc-300 hover:shadow-sm transition-all text-left"
            >
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pending</span>
              <span className="text-2xl font-black text-zinc-900 mt-1">{pendingCount}</span>
              <span className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                <FiClock className="w-3.5 h-3.5" /> Pending requests
              </span>
            </button>
          </div>

          {/* Active Roadmaps list */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-left">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900">Active Roadmaps</h2>
              <button
                onClick={() => onNavigate('workspace', 'my-roadmaps')}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 hover:underline"
              >
                All Workspace <FiChevronRight />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeRoadmaps.map((course) => {
                const isTeaching = course.tag === 'TEACHING';
                return (
                  <div
                    key={course.id}
                    onClick={() => onNavigate('player', undefined, course.id)}
                    className="bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 rounded-2xl flex flex-col transition-all group hover:-translate-y-0.5 text-left cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        {isTeaching ? (
                          <>
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700">
                              <FiEdit3 className="w-2.5 h-2.5" />
                              Teaching
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                              <FiUsers className="w-3.5 h-3.5 text-zinc-400" /> {course.enrolled || 0}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700">
                              <FiBookOpen className="w-2.5 h-2.5" />
                              Learning
                            </span>
                            <span className="text-[10px] text-zinc-455 font-bold uppercase tracking-wider font-mono">
                              {course.progressPercent}%
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 group-hover:text-violet-750 transition-colors line-clamp-1 mb-2 leading-tight">
                        {course.title}
                      </h3>
                    </div>

                    {isTeaching ? (
                      <div className="mt-4 pt-3 border-t border-zinc-100/60 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 font-semibold">Creator & Lead</span>
                        <span className="text-[10px] text-zinc-500 font-bold hover:underline flex items-center gap-0.5">
                          Manage Track <FiChevronRight />
                        </span>
                      </div>
                    ) : (
                      <div className="mt-4 pt-3 border-t border-zinc-100/60">
                        <div className="h-1 rounded-full bg-zinc-100 overflow-hidden mb-2">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${course.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-400 font-semibold">
                          {course.completedCount}/{course.totalModules} Lessons Complete
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Matches */}
          <div className="space-y-6">
            <div className="flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-200/80">
                  <SparklesIcon className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold tracking-tight text-zinc-900 leading-tight">AI Smart Matches</h3>
                  <p className="text-zinc-500 text-xs font-normal mt-1">Top-tier AI matches computed dynamically from your profiles.</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 hover:underline"
              >
                Find more <FiChevronRight />
              </button>
            </div>

            <div className="flex gap-6 overflow-x-auto scrollbar-none pb-2">
              {aiMatches.map((match) => (
                <div
                  key={match.username}
                  className="w-72 shrink-0 border border-zinc-200 bg-white rounded-[24px] p-6 text-left hover:border-zinc-350 transition-all flex flex-col gap-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-650 flex items-center justify-center text-xs font-black shrink-0">
                          {match.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-900">{match.fullName}</div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest uppercase bg-zinc-50 border border-zinc-200 text-zinc-500 font-mono inline-block mt-0.5">
                            Mentor
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-violet-750 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                        {match.compatibilityScore}% MATCH
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-550 leading-relaxed font-normal">
                      {match.bio}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-bold block pt-1">
                      💼 {match.company}
                    </span>
                  </div>

                  {/* Skills (Terminal style) & AI Insights stacked section */}
                  <div className="space-y-3 pt-3 border-t border-zinc-100">
                    
                    {/* Row 1: Skills (Terminal) */}
                    <div className="flex gap-2 items-start">
                      <FiTerminal className="w-3.5 h-3.5 text-zinc-400 shrink-0 select-none mt-0.5" />
                      <div className="flex flex-wrap gap-1.5">
                        {match.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded-[4px] text-[8px] font-bold uppercase tracking-wider text-zinc-500 hover:border-zinc-300 transition-all"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Row 2: AI Insights (Sparkles) */}
                    <div className="flex gap-2 items-start">
                      <SparklesIcon className="w-3.5 h-3.5 text-violet-400 shrink-0 select-none mt-0.5" />
                      <div className="flex flex-wrap gap-1.5">
                        {match.insights.map((insight) => {
                          const isOverlap = insight.includes('Shared');
                          return (
                            <span
                              key={insight}
                              className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${
                                isOverlap
                                  ? 'bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/20'
                                  : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20'
                              }`}
                            >
                              {insight}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        toast.success(`Request sent to ${match.fullName}!`);
                      }}
                      className="w-full text-center py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors mt-2"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (col-3) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Action Required Banner */}
          {pendingRequestsCount > 0 && (
            <div 
              className="p-6 rounded-[28px] bg-white border border-zinc-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col gap-4 text-left group hover:border-zinc-350 transition-all duration-300 cursor-pointer"
              onClick={() => onNavigate('workspace', 'applications')}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:bg-zinc-150 group-hover:border-zinc-300">
                  <FiBell className="w-4 h-4 animate-pulse text-zinc-800" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none block">
                    Action Required
                  </span>
                  <p className="text-xs text-zinc-655 font-bold leading-relaxed">
                    You have <span className="text-zinc-950 font-black underline decoration-zinc-950/20 underline-offset-2">{pendingRequestsCount} pending student requests</span> waiting for your approval.
                  </p>
                </div>
              </div>
              <button
                className="w-full text-center py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold tracking-tight active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-zinc-950/10"
              >
                <span>Review Applications</span>
                <FiChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          )}

          {/* Live Check-ins */}
          <div className="p-6 rounded-[24px] bg-white border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.015),0_10px_30px_-10px_rgba(0,0,0,0.02)] text-left">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center shrink-0 border border-zinc-800 shadow-sm">
                <FiVideo className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest leading-none">
                Live Check-ins
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150 flex flex-col gap-3 group hover:border-zinc-250 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] text-zinc-550 font-black uppercase tracking-wider font-mono">
                      Tue, Aug 25, 05:00 PM
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest uppercase border font-mono bg-violet-50 text-violet-700 border-violet-200/50">
                      Host
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-accent transition-colors line-clamp-1 leading-tight">
                    Product Management & Agile...
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold line-clamp-1 mt-0.5">
                    Lesson 1: Product Strategy & Requirements...
                  </p>
                </div>
                <button
                  onClick={() => alert("Simulating Google Meet Join Call!")}
                  className="w-full text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold tracking-tight shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <FiVideo /> Join Google Meet
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-150 flex flex-col gap-3 group hover:border-zinc-250 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[9px] text-zinc-550 font-black uppercase tracking-wider font-mono">
                      Wed, Aug 26, 10:00 AM
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[7px] font-black tracking-widest uppercase border font-mono bg-emerald-50 text-emerald-700 border-emerald-200/50">
                      Join
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-accent transition-colors line-clamp-1 leading-tight">
                    Product Management & Agile...
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-semibold line-clamp-1 mt-0.5">
                    Lesson 2: Prioritization & Sprint Execution
                  </p>
                </div>
                <button
                  onClick={() => alert("Simulating Google Meet Join Call!")}
                  className="w-full text-center py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-[10px] font-bold tracking-tight shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  <FiVideo /> Join Google Meet
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardDemo;
