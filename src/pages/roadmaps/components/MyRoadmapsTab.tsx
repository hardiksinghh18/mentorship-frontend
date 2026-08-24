import React, { useState, useEffect } from "react";
import { useGetCoursesQuery } from "../../../redux/api/apiSlice";
import { toast } from "react-toastify";
import RoadmapCard from "./RoadmapCard";
import EmptyState from "./EmptyState";
import { Course } from "../../../types/roadmap";

type SubFilter = "my-roadmaps" | "teaching" | "learning" | "pending";

const MyRoadmapsTab = () => {
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilter>("my-roadmaps");
  const { data: courses = [], isLoading, isError, error } = useGetCoursesQuery(
    { filter: activeSubFilter },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (isError && error) {
      const errMsg = (error as any)?.data?.message || "Failed to load roadmaps";
      toast.error(errMsg);
    }
  }, [isError, error]);

  const getEmptyMessage = () => {
    switch (activeSubFilter) {
      case "teaching":
        return "You haven't created any study roadmaps yet.";
      case "learning":
        return "You are not enrolled in any study roadmaps.";
      case "pending":
        return "No pending study roadmap applications.";
      default:
        return "You don't have any roadmaps in your workspace yet.";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Sub-Filters Pill Row */}
      <div className="overflow-x-auto scrollbar-none pb-2">
        <div className="relative flex items-center gap-1.5 bg-zinc-100 border border-zinc-200/60 p-1 rounded-full w-fit backdrop-blur-md shadow-sm h-10 select-none font-semibold">
          {/* Sliding Indicator */}
          <div 
            className={`absolute top-1 bottom-1 left-1 rounded-full bg-white border border-zinc-200/50 shadow-sm transition-all duration-300 ease-out ${
              activeSubFilter === "my-roadmaps" ? "w-32 translate-x-0" :
              activeSubFilter === "teaching" ? "w-24 translate-x-[134px]" :
              activeSubFilter === "learning" ? "w-24 translate-x-[236px]" :
              "w-36 translate-x-[338px]"
            }`}
          />
          
          <button
            onClick={() => setActiveSubFilter("my-roadmaps")}
            className={`relative w-32 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
              activeSubFilter === "my-roadmaps" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <span>All Workspace</span>
          </button>
          
          <button
            onClick={() => setActiveSubFilter("teaching")}
            className={`relative w-24 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
              activeSubFilter === "teaching" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <span>Teaching</span>
          </button>
          
          <button
            onClick={() => setActiveSubFilter("learning")}
            className={`relative w-24 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
              activeSubFilter === "learning" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <span>Learning</span>
          </button>
          
          <button
            onClick={() => setActiveSubFilter("pending")}
            className={`relative w-36 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${
              activeSubFilter === "pending" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <span>Pending Requests</span>
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-zinc-400 text-sm font-semibold">
          Loading roadmaps...
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          message={getEmptyMessage()}
          showCreateCTA={activeSubFilter === "teaching" || activeSubFilter === "my-roadmaps"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course: Course) => (
            <RoadmapCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRoadmapsTab;
