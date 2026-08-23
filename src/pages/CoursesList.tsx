import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CourseCard from "../components/courses/CourseCard";
import { Course, AuthState } from "../types/course";
import { useGetCoursesQuery } from "../redux/api/apiSlice";

const CoursesList = () => {
  const { isLoggedIn, user: authUser } = useSelector((state: AuthState) => state.auth);
  const [activeTab, setActiveTab] = useState<"explore" | "my-tracks" | "pending">("explore");
  
  // RTK Query hook retrieves active roadmaps
  const { data: courses = [], isLoading, isError, error } = useGetCoursesQuery({});

  useEffect(() => {
    if (isError && error) {
      const errMsg = (error as any)?.data?.message || "Failed to load courses";
      toast.error(errMsg);
    }
  }, [isError, error]);

  // Filter courses based on selected tab
  const filteredCourses = courses.filter((course) => {
    if (activeTab === "my-tracks") {
      return (
        course.creatorId === authUser?.id ||
        course.userEnrollmentStatus === "accepted"
      );
    }
    if (activeTab === "pending") {
      return course.userEnrollmentStatus === "pending";
    }
    return true; // 'explore' shows all
  });

  return (
    <div className="min-h-screen bg-white py-12 px-6 md:px-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Roadmaps
          </h1>
          <p className="text-zinc-400 text-xs mt-1 font-medium">
            Syllabus-led collaborative study tracks.
          </p>
        </div>

        {isLoggedIn && (
          <Link
            to="/courses/create"
            className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-700 text-xs font-semibold hover:border-zinc-900 hover:text-zinc-900 active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <span>Create Course</span>
            <span className="text-sm font-light">+</span>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      {isLoggedIn && (
        <div className="max-w-6xl mx-auto flex gap-6 border-b border-zinc-100 mb-8">
          <button
            onClick={() => setActiveTab("explore")}
            className={`text-xs font-bold tracking-tight pb-3 relative transition-all duration-300
              ${activeTab === "explore" ? "text-accent border-b-2 border-accent" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab("my-tracks")}
            className={`text-xs font-bold tracking-tight pb-3 relative transition-all duration-300
              ${activeTab === "my-tracks" ? "text-accent border-b-2 border-accent" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            My Tracks
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`text-xs font-bold tracking-tight pb-3 relative transition-all duration-300
              ${activeTab === "pending" ? "text-accent border-b-2 border-accent" : "text-zinc-400 hover:text-zinc-600"}`}
          >
            Pending Requests ({courses.filter(c => c.userEnrollmentStatus === "pending").length})
          </button>
        </div>
      )}

      {/* Grid List */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-zinc-400 text-sm font-semibold">
            Loading roadmaps...
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 rounded-[24px] text-zinc-400 text-sm font-medium bg-zinc-50/50">
            {activeTab === "explore" && "No study roadmaps are currently active."}
            {activeTab === "my-tracks" && "You haven't joined or created any roadmaps yet."}
            {activeTab === "pending" && "No pending join requests."}
            {activeTab === "explore" && isLoggedIn && (
              <Link to="/courses/create" className="text-accent font-bold mt-2 hover:underline">
                Create one now!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
