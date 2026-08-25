import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiEdit3, FiClock } from 'react-icons/fi';

interface WorkspaceMetricsProps {
  learningCount: number;
  teachingCount: number;
  pendingCount: number;
}

const WorkspaceMetrics: React.FC<WorkspaceMetricsProps> = ({
  learningCount,
  teachingCount,
  pendingCount,
}) => {
  return (
    <div className="bg-zinc-50 border border-zinc-200/60 p-6 rounded-[24px] grid grid-cols-3 gap-4">
      <Link
        to="/roadmaps?tab=workspace&filter=learning"
        className="flex flex-col p-4 rounded-2xl bg-white border border-zinc-200/50 hover:border-zinc-300 hover:shadow-sm transition-all text-left"
      >
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Learning</span>
        <span className="text-2xl font-black text-zinc-900 mt-1">{learningCount}</span>
        <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
          <FiBookOpen className="w-3.5 h-3.5" /> Active tracks
        </span>
      </Link>
      <Link
        to="/roadmaps?tab=workspace&filter=teaching"
        className="flex flex-col p-4 rounded-2xl bg-white border border-zinc-200/50 hover:border-zinc-300 hover:shadow-sm transition-all text-left"
      >
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Teaching</span>
        <span className="text-2xl font-black text-zinc-900 mt-1">{teachingCount}</span>
        <span className="text-[10px] text-violet-600 font-semibold mt-1 flex items-center gap-1">
          <FiEdit3 className="w-3.5 h-3.5" /> Led tracks
        </span>
      </Link>
      <Link
        to="/roadmaps?tab=workspace&filter=pending"
        className="flex flex-col p-4 rounded-2xl bg-white border border-zinc-200/50 hover:border-zinc-300 hover:shadow-sm transition-all text-left"
      >
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pending</span>
        <span className="text-2xl font-black text-zinc-900 mt-1">{pendingCount}</span>
        <span className="text-[10px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
          <FiClock className="w-3.5 h-3.5" /> Pending requests
        </span>
      </Link>
    </div>
  );
};

export default WorkspaceMetrics;
