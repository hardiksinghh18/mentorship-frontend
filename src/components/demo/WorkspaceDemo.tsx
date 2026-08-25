import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface Application {
  id: string;
  fullName: string;
  username: string;
  bio: string;
  courseTitle: string;
}

interface WorkspaceDemoProps {
  onJoinTrack: () => void;
  onAcceptStudent: () => void;
  onDeclineStudent: () => void;
  pendingRequests: Application[];
  onRemoveApplication: (id: string) => void;
  initialSubFilter?: string;
  onSelectCourse?: (id: string) => void;
}

type SubFilter = 'my-roadmaps' | 'teaching' | 'learning' | 'pending' | 'applications';

const WorkspaceDemo: React.FC<WorkspaceDemoProps> = ({
  onJoinTrack,
  onAcceptStudent,
  onDeclineStudent,
  pendingRequests,
  onRemoveApplication,
  initialSubFilter = 'my-roadmaps',
  onSelectCourse,
}) => {
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilter>(initialSubFilter as SubFilter);
  const [activeTab, setActiveTab] = useState<'browse' | 'workspace'>('workspace');

  // Local state to track joined courses
  const [joinedCourseIds, setJoinedCourseIds] = useState<string[]>([]);
  const [requestedCourseIds, setRequestedCourseIds] = useState<string[]>([]);

  const publicCourses = [
    {
      id: 'react-arch',
      title: 'React Architecture & Design Systems',
      description: 'Master advanced React rendering, custom performance hooks, component hierarchy layout design, and component-driven architecture scaling.',
      durationValue: 6,
      durationUnit: 'weeks',
      creatorName: 'Sarah Jenkins',
      skills: ['React', 'TypeScript', 'Design Systems'],
    },
    {
      id: 'pm-agile',
      title: 'Product Management & Agile Roadmapping',
      description: 'Learn project requirements prioritization, OKR alignment, agile sprint scoping, and user story mapping for tech scaleups.',
      durationValue: 4,
      durationUnit: 'weeks',
      creatorName: 'Sarah Jenkins',
      skills: ['Agile', 'Product Lifecycle', 'OKRs'],
    },
    {
      id: 'ai-python',
      title: 'AI Prompt Engineering & Python Workflows',
      description: 'Discover generative model scripting, prompt orchestration templates, and building automation agents using FastAPI and LangChain.',
      durationValue: 5,
      durationUnit: 'weeks',
      creatorName: 'Sarah Jenkins',
      skills: ['Python', 'Generative AI', 'LangChain'],
    }
  ];

  const handleJoinLocal = (id: string, title: string) => {
    if (requestedCourseIds.includes(id)) return;
    setRequestedCourseIds(prev => [...prev, id]);
    onJoinTrack(); // Increment parent pending requests count
    toast.success(`Enrollment request sent to join "${title}"!`);
  };

  const handleManageRequest = (id: string, name: string, action: 'accepted' | 'declined') => {
    onRemoveApplication(id);
    if (action === 'accepted') {
      onAcceptStudent();
      toast.success(`Application approved! ${name} has been enrolled in the course.`);
    } else {
      onDeclineStudent();
      toast.warn(`Application declined for ${name}.`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header with main tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-200/60 text-left">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">
            Roadmaps Workspace
          </h2>
          <p className="text-zinc-500 text-xs font-medium max-w-xl">
            Syllabus-led collaborative study tracks.
          </p>
        </div>

        {/* Main Tab Pill */}
        <div className="relative flex items-center gap-1.5 bg-zinc-100 border border-zinc-200/60 p-1 rounded-full w-fit backdrop-blur-md shadow-sm h-10 select-none font-semibold">
          <div 
            className={`absolute top-1 bottom-1 left-1 w-28 rounded-full bg-white border border-zinc-200/50 shadow-sm transition-all duration-300 ease-out ${
              activeTab === 'browse' ? 'translate-x-0' : 'translate-x-[116px]'
            }`}
          />
          <button
            onClick={() => setActiveTab('browse')}
            className={`relative w-28 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 z-10 outline-none ${
              activeTab === 'browse' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('workspace')}
            className={`relative w-28 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 z-10 outline-none ${
              activeTab === 'workspace' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Workspace
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        /* Browse tab view */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {publicCourses.map((c) => {
            const hasJoined = joinedCourseIds.includes(c.id);
            const hasRequested = requestedCourseIds.includes(c.id);

            return (
              <div 
                key={c.id} 
                className="group relative bg-white border border-zinc-200 hover:border-zinc-350 p-6 rounded-[28px] transition-all flex flex-col justify-between h-72 shadow-xs"
              >
                <div className="space-y-3 cursor-pointer" onClick={() => onSelectCourse?.(c.id)}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-extrabold uppercase font-mono tracking-wider">
                      {c.durationValue} {c.durationUnit}
                    </span>
                    <span className="text-[10px] text-zinc-450 font-bold">
                      By: {c.creatorName}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-zinc-900 group-hover:text-violet-755 transition-colors leading-tight">
                    {c.title}
                  </h4>
                  <p className="text-xs text-zinc-550 leading-relaxed font-normal line-clamp-3">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-zinc-50">
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded bg-zinc-50 text-[9px] text-zinc-500 border border-zinc-150 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleJoinLocal(c.id, c.title)}
                    disabled={hasJoined || hasRequested}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] ${
                      hasJoined
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default'
                        : hasRequested
                        ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-default'
                        : 'bg-zinc-950 text-white hover:bg-zinc-800'
                    }`}
                  >
                    {hasJoined ? 'Enrolled' : hasRequested ? 'Request Sent' : 'Join Track'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Workspace filter views */
        <div className="space-y-8 text-left">
          {/* Sub filters list */}
          <div className="overflow-x-auto scrollbar-none pb-1">
            <div className="relative flex items-center gap-1 bg-zinc-100 border border-zinc-200/60 p-1 rounded-full w-fit backdrop-blur-md shadow-sm h-10 select-none font-semibold">
              <div 
                className={`absolute top-1 bottom-1 left-1 rounded-full bg-white border border-zinc-200/50 shadow-sm transition-all duration-300 ease-out ${
                  activeSubFilter === 'my-roadmaps' ? 'w-28 translate-x-0' :
                  activeSubFilter === 'teaching' ? 'w-24 translate-x-[118px]' :
                  activeSubFilter === 'learning' ? 'w-24 translate-x-[220px]' :
                  activeSubFilter === 'pending' ? 'w-32 translate-x-[322px]' :
                  'w-40 translate-x-[456px]'
                }`}
              />
              
              <button
                onClick={() => setActiveSubFilter('my-roadmaps')}
                className={`relative w-28 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
                  activeSubFilter === 'my-roadmaps' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                All Workspace
              </button>
              
              <button
                onClick={() => setActiveSubFilter('teaching')}
                className={`relative w-24 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
                  activeSubFilter === 'teaching' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Teaching
              </button>
              
              <button
                onClick={() => setActiveSubFilter('learning')}
                className={`relative w-24 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
                  activeSubFilter === 'learning' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Learning
              </button>

              <button
                onClick={() => setActiveSubFilter('pending')}
                className={`relative w-32 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
                  activeSubFilter === 'pending' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Pending Requests
              </button>

              <button
                onClick={() => setActiveSubFilter('applications')}
                className={`relative w-40 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
                  activeSubFilter === 'applications' ? 'text-zinc-950 font-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Student Applications
              </button>
            </div>
          </div>

          {/* Sub content grids */}
          <div>
            {activeSubFilter === 'applications' ? (
              pendingRequests.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-200 rounded-[28px] text-zinc-400 text-xs font-medium">
                  You have no pending student applications to review.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRequests.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-6 rounded-[24px] border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-black border border-zinc-800 shadow-sm shrink-0">
                              {app.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-extrabold text-zinc-900 leading-tight">{app.fullName}</div>
                              <div className="text-[10px] text-zinc-400 font-bold leading-tight mt-0.5">@{app.username}</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 text-zinc-500 font-mono">
                            APPLICANT
                          </span>
                        </div>
                        
                        <p className="text-xs text-zinc-550 leading-relaxed font-normal bg-zinc-50/50 p-3 rounded-xl border border-zinc-150/40 italic">
                          "{app.bio}"
                        </p>

                        <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 mt-2">
                          <span className="text-zinc-400">Target Track:</span> 
                          <span className="text-zinc-800 font-extrabold underline">{app.courseTitle}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-zinc-50">
                        <button
                          onClick={() => handleManageRequest(app.id, app.fullName, 'accepted')}
                          className="flex-1 py-2 rounded-xl bg-zinc-950 text-white text-xs font-bold tracking-tight hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleManageRequest(app.id, app.fullName, 'declined')}
                          className="flex-1 py-2 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold tracking-tight hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : activeSubFilter === 'learning' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simulated learning course card */}
                <div 
                  onClick={() => onSelectCourse?.('react-arch')}
                  className="group relative bg-white border border-zinc-200 p-6 rounded-[28px] transition-all flex flex-col justify-between h-56 shadow-xs cursor-pointer hover:border-zinc-350"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono bg-emerald-50 text-emerald-700 border-emerald-200/50">
                        Enrolled
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 group-hover:text-violet-750 transition-colors leading-tight">
                      React Architecture & Design Systems
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Learn to scale custom performance hooks and component trees.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-extrabold border-t border-zinc-100 pt-3">
                    <span>5 Modules</span>
                    <span>Starts in 2 days</span>
                  </div>
                </div>
              </div>
            ) : activeSubFilter === 'teaching' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simulated teaching course card */}
                <div 
                  onClick={() => onSelectCourse?.('pm-agile')}
                  className="group relative bg-white border border-zinc-200 p-6 rounded-[28px] transition-all flex flex-col justify-between h-56 shadow-xs cursor-pointer hover:border-zinc-350"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono bg-violet-50 text-violet-700 border-violet-200/50">
                        Teaching
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 group-hover:text-violet-750 transition-colors leading-tight">
                      Product Management & Agile Roadmapping
                    </h4>
                    <p className="text-xs text-zinc-500">
                      Manage sprints, define key OKRs, and scope product roadmaps.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-extrabold border-t border-zinc-100 pt-3">
                    <span>4 Modules</span>
                    <span>1 Student Active</span>
                  </div>
                </div>
              </div>
            ) : (
              /* All Workspace or fallback grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => onSelectCourse?.('react-arch')}
                  className="group relative bg-white border border-zinc-200 p-6 rounded-[28px] transition-all flex flex-col justify-between h-56 shadow-xs cursor-pointer hover:border-zinc-350"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono bg-emerald-50 text-emerald-700 border-emerald-200/50">
                        Enrolled
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 group-hover:text-violet-750 transition-colors leading-tight">
                      React Architecture & Design Systems
                    </h4>
                    <p className="text-xs text-zinc-550">
                      Master advanced React rendering, performance checks, and trees.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-extrabold border-t border-zinc-100 pt-3">
                    <span>5 Modules</span>
                    <span>In progress</span>
                  </div>
                </div>

                <div 
                  onClick={() => onSelectCourse?.('pm-agile')}
                  className="group relative bg-white border border-zinc-200 p-6 rounded-[28px] transition-all flex flex-col justify-between h-56 shadow-xs cursor-pointer hover:border-zinc-350"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono bg-violet-50 text-violet-700 border-violet-200/50">
                        Teaching
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-zinc-900 group-hover:text-violet-750 transition-colors leading-tight">
                      Product Management & Agile Roadmapping
                    </h4>
                    <p className="text-xs text-zinc-550">
                      Agile sprint planning and product lifecycles.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-extrabold border-t border-zinc-100 pt-3">
                    <span>4 Modules</span>
                    <span>Lead Mentor</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkspaceDemo;
