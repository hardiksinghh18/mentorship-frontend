import React, { useEffect } from "react";
import { useGetCoursesQuery } from "../../../redux/api/apiSlice";
import { toast } from "react-toastify";
import RoadmapCard from "./RoadmapCard";
import EmptyState from "./EmptyState";
import { Course } from "../../../types/roadmap";

const BrowseTab = () => {
  const { data: courses = [], isLoading, isError, error } = useGetCoursesQuery({ filter: "browse" });

  useEffect(() => {
    if (isError && error) {
      const errMsg = (error as any)?.data?.message || "Failed to load roadmaps";
      toast.error(errMsg);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-zinc-400 text-sm font-semibold">
        Loading roadmaps...
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <EmptyState
        message="No study roadmaps are currently available to browse."
        showCreateCTA={true}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
      {courses.map((course: Course) => (
        <RoadmapCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default BrowseTab;
