import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiEdit3, FiChevronRight, FiUsers } from 'react-icons/fi';

interface CourseModule {
  id: string;
  title: string;
  orderIndex?: number;
}

interface ActiveCourse {
  id: string;
  title: string;
  creatorId: string;
  enrolled?: number;
  modules?: CourseModule[];
  completedModules?: number[];
}

interface ActiveRoadmapsProps {
  learningTracks: ActiveCourse[];
  teachingTracks: ActiveCourse[];
}

const ActiveRoadmaps: React.FC<ActiveRoadmapsProps> = ({ learningTracks, teachingTracks }) => {
  if (learningTracks.length === 0 && teachingTracks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900">Active Roadmaps</h2>
        <Link
          to="/roadmaps?tab=workspace"
          className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 hover:underline"
        >
          All Workspace <FiChevronRight />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Enrolled learning tracks */}
        {learningTracks.slice(0, 2).map((course) => {
          const completed = course.completedModules ? course.completedModules.length : 0;
          const total = course.modules ? course.modules.length : 0;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          return (
            <Link
              key={course.id}
              to={`/roadmaps/${course.id}`}
              className="bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-0.5 text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700">
                    <FiBookOpen className="w-2.5 h-2.5" />
                    Learning
                  </span>
                  <span className="text-[10px] text-zinc-450 font-bold uppercase tracking-wider font-mono">
                    {percent}%
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 group-hover:text-accent transition-colors line-clamp-1 mb-2 leading-tight">
                  {course.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100/60">
                <div className="h-1 rounded-full bg-zinc-100 overflow-hidden mb-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 font-semibold">
                  {completed}/{total} Lessons Complete
                </span>
              </div>
            </Link>
          );
        })}

        {/* Created teaching tracks */}
        {teachingTracks.slice(0, 2).map((course) => (
          <Link
            key={course.id}
            to={`/roadmaps/${course.id}`}
            className="bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 rounded-2xl flex flex-col justify-between transition-all group hover:-translate-y-0.5 text-left"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700">
                  <FiEdit3 className="w-2.5 h-2.5" />
                  Teaching
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  <FiUsers className="w-3.5 h-3.5 text-zinc-400" /> {course.enrolled || 0}
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-900 group-hover:text-accent transition-colors line-clamp-1 mb-2 leading-tight">
                {course.title}
              </h3>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100/60 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Creator & Lead</span>
              <span className="text-[10px] text-zinc-500 font-bold hover:underline flex items-center gap-0.5">
                Manage Track <FiChevronRight />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActiveRoadmaps;
