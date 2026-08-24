import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiBookOpen, FiEdit3, FiClock, FiUsers, FiChevronRight } from "react-icons/fi";
import { Course, AuthState } from "../../../types/roadmap";

interface RoadmapCardProps {
  course: Course;
}

const RoadmapCard = ({ course }: RoadmapCardProps) => {
  const { user: authUser } = useSelector((state: AuthState) => state.auth);

  const isCreator = authUser?.id && course.creatorId === authUser.id;
  const isEnrolled = course.userEnrollmentStatus === "accepted" && !isCreator;
  const isPending = course.userEnrollmentStatus === "pending";

  const durationText = course.duration || `${course.durationValue} ${course.durationUnit}`;
  const leadName = course.creator ? course.creator.fullName : (course.mentor || "Anonymous");

  return (
    <div className="bg-white border border-zinc-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_10px_30px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:border-zinc-400/80 rounded-[24px] p-8 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 ease-out group relative overflow-hidden">
      <div>
        {/* Header Info */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-4 border-b border-zinc-100/60">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-violet-600 bg-violet-50/70 border border-violet-100 rounded-full px-3 py-1 font-mono uppercase tracking-wider">
            <FiClock className="w-3.5 h-3.5 text-violet-500" />
            {durationText}
          </span>
          
          <div className="flex items-center gap-2">
            {/* Dynamic Role Badges */}
            {isCreator && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700">
                <FiEdit3 className="w-3 h-3" />
                Teaching
              </span>
            )}
            {isEnrolled && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700">
                <FiBookOpen className="w-3 h-3" />
                Learning
              </span>
            )}
            {isPending && (
              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700">
                <FiClock className="w-3 h-3" />
                Pending
              </span>
            )}

            <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold bg-zinc-50 border border-zinc-200/60 rounded-full px-3 py-1 font-mono uppercase tracking-wider">
              <FiUsers className="w-3.5 h-3.5 text-zinc-400" />
              {(course.enrolled ?? 0)}/{(course.capacity ?? 20)} Mentees
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 group-hover:text-accent transition-colors duration-300 mb-3 leading-snug">
          {course.title}
        </h2>
        <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {course.skillsTargeted.map((skill, index) => (
            <span
              key={index}
              className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 hover:border-zinc-300 transition-all duration-200 select-none cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="pt-5 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-black shadow-sm shrink-0 border border-zinc-800">
            {leadName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none">Track Lead</span>
            <span className="text-xs text-zinc-800 font-extrabold mt-1 leading-none">{leadName}</span>
          </div>
        </div>

        <Link
          to={`/roadmaps/${course.id}`}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold tracking-tight active:scale-[0.98] transition-all duration-300 flex items-center gap-1
            ${
              isPending
                ? "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200"
                : "bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm hover:shadow-md hover:scale-[1.02]"
            }`}
        >
          <span>{isPending ? "View Request" : "View Details"}</span>
          {!isPending && <FiChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />}
        </Link>
      </div>
    </div>
  );
};

export default RoadmapCard;
