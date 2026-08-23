import React from "react";
import { Link } from "react-router-dom";
import { CourseCardProps } from "../../types/course";

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="bg-zinc-50 border border-zinc-200/80 rounded-[24px] p-8 flex flex-col justify-between hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 group">
      <div>
        {/* Header Info */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <span className="text-xs font-semibold text-accent">
            {course.duration || `${course.durationValue} ${course.durationUnit}`}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            {(course.enrolled ?? 0)}/{(course.capacity ?? 20)} Mentees Enrolled
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-accent transition-colors duration-300 mb-3">
          {course.title}
        </h2>
        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
          {course.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {course.skillsTargeted.map((skill, index) => (
            <span
              key={index}
              className="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="pt-6 border-t border-zinc-200 flex items-center justify-between">
        <span className="text-xs text-zinc-400 font-semibold">
          Lead: {course.creator ? course.creator.fullName : (course.mentor || 'Anonymous')}
        </span>
        <Link
          to={`/courses/${course.id}`}
          className="px-5 py-2.5 rounded-full bg-zinc-200/80 text-zinc-800 text-xs font-bold tracking-tight hover:bg-zinc-900 hover:text-white active:scale-[0.98] transition-all"
        >
          View Syllabus
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
