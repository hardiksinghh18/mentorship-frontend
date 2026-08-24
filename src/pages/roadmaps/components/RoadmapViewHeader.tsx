import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiUsers } from "react-icons/fi";
import { Course } from "../../../types/roadmap";

interface RoadmapViewHeaderProps {
  course: Course;
  isEnrolled: boolean;
  progressPercent: number;
  completedCount: number;
  totalModules: number;
}

const RoadmapViewHeader = ({
  course,
  isEnrolled,
  progressPercent,
  completedCount,
  totalModules,
}: RoadmapViewHeaderProps) => {
  const leadName = course.creator ? course.creator.fullName : (course.mentor || "Anonymous");
  const durationText = course.duration || `${course.durationValue} ${course.durationUnit}`;
  const creatorUsername = course.creator?.username;

  return (
    <div className="border-b border-zinc-100 bg-white py-8">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mb-4 select-none">
          <Link to="/roadmaps" className="hover:text-zinc-900 transition-colors">
            Roadmaps
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="text-zinc-600 font-semibold truncate max-w-[240px]">
            {course.title}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
          {course.title}
        </h1>

        {/* Consolidated Metadata Row */}
        <div className="flex flex-wrap items-center gap-y-3 gap-x-4 text-xs text-zinc-500 font-medium mt-4">
          {/* Lead Creator */}
          {creatorUsername ? (
            <a
              href={`/profile/${creatorUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-85 transition-opacity group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-black border border-zinc-800 shadow-sm shrink-0">
                {leadName.charAt(0)}
              </div>
              <span className="text-zinc-800 font-bold group-hover:underline group-hover:text-zinc-950">{leadName}</span>
              <span className="text-zinc-400 text-[9px] bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/50 font-bold uppercase tracking-wider scale-90">Lead</span>
            </a>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px] font-black border border-zinc-800 shadow-sm shrink-0">
                {leadName.charAt(0)}
              </div>
              <span className="text-zinc-800 font-bold">{leadName}</span>
              <span className="text-zinc-400 text-[9px] bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200/50 font-bold uppercase tracking-wider scale-90">Lead</span>
            </div>
          )}

          <span className="text-zinc-300 select-none hidden sm:inline">•</span>

          {/* Duration */}
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-violet-600 bg-violet-50/70 border border-violet-100 rounded-full px-2.5 py-0.5 font-mono uppercase tracking-wider">
            <FiClock className="w-3.5 h-3.5 text-violet-500" />
            {durationText}
          </span>

          <span className="text-zinc-300 select-none hidden sm:inline">•</span>

          {/* Capacity */}
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-50 border border-zinc-200/60 rounded-full px-2.5 py-0.5 font-mono uppercase tracking-wider">
            <FiUsers className="w-3.5 h-3.5 text-zinc-400" />
            {(course.enrolled ?? 0)}/{(course.capacity ?? 20)} Mentees
          </span>
        </div>

        {/* Enrolled Progress Bar */}
        {isEnrolled && (
          <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center gap-3 max-w-xl">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/30">
              <div 
                className="h-full bg-accent rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-zinc-500 shrink-0 font-mono tracking-wider">
              {progressPercent}% COMPLETE ({completedCount}/{totalModules} LESSONS)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapViewHeader;
