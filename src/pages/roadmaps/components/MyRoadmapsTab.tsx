import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetCoursesQuery,
  useGetCreatorEnrollmentRequestsQuery,
  useManageEnrollmentRequestMutation
} from "../../../redux/api/apiSlice";
import { toast } from "react-toastify";
import RoadmapCard from "./RoadmapCard";
import EmptyState from "./EmptyState";
import { Course } from "../../../types/roadmap";
import RoadmapsLoader from "../../../components/loaders/RoadmapsLoader";
import ApplicationsLoader from "../../../components/loaders/ApplicationsLoader";

type SubFilter = "my-roadmaps" | "teaching" | "learning" | "pending" | "applications";

const MyRoadmapsTab = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSubFilter = (() => {
    const f = searchParams.get("filter");
    if (f === "all") return "my-roadmaps";
    if (f === "teaching") return "teaching";
    if (f === "learning") return "learning";
    if (f === "pending") return "pending";
    if (f === "applications") return "applications";
    return "my-roadmaps";
  })() as SubFilter;

  const setActiveSubFilter = (filter: SubFilter) => {
    const filterParam =
      filter === "my-roadmaps" ? "all" :
        filter === "teaching" ? "teaching" :
          filter === "learning" ? "learning" :
            filter === "pending" ? "pending" :
              "applications";
    setSearchParams({ tab: "workspace", filter: filterParam });
  };

  const { data: courses = [], isLoading, isError, error } = useGetCoursesQuery(
    { filter: activeSubFilter },
    { refetchOnMountOrArgChange: true, skip: activeSubFilter === "applications" }
  );

  const { data: applications = [], isLoading: loadingApps } = useGetCreatorEnrollmentRequestsQuery(
    undefined,
    { skip: activeSubFilter !== "applications" }
  );

  const [manageEnrollment] = useManageEnrollmentRequestMutation();

  useEffect(() => {
    if (isError && error) {
      const errMsg = (error as any)?.data?.message || "Failed to load roadmaps";
      toast.error(errMsg);
    }
  }, [isError, error]);

  const handleManageRequest = async (enrollmentId: string, status: "accepted" | "declined") => {
    try {
      await manageEnrollment({ enrollmentId, status }).unwrap();
      toast.success(`Application request ${status === "accepted" ? "approved" : "declined"} successfully`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to respond to request");
    }
  };

  const getEmptyMessage = () => {
    switch (activeSubFilter) {
      case "teaching":
        return "You haven't created any study roadmaps yet.";
      case "learning":
        return "You are not enrolled in any study roadmaps.";
      case "pending":
        return "No pending study roadmap applications.";
      case "applications":
        return "You have no pending student applications to review.";
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
            className={`absolute top-1 bottom-1 left-1 rounded-full bg-white border border-zinc-200/50 shadow-sm transition-all duration-300 ease-out ${activeSubFilter === "my-roadmaps" ? "w-32 translate-x-0" :
                activeSubFilter === "teaching" ? "w-24 translate-x-[134px]" :
                  activeSubFilter === "learning" ? "w-24 translate-x-[236px]" :
                    activeSubFilter === "pending" ? "w-36 translate-x-[338px]" :
                      "w-44 translate-x-[488px]"
              }`}
          />

          <button
            onClick={() => setActiveSubFilter("my-roadmaps")}
            className={`relative w-32 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${activeSubFilter === "my-roadmaps" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <span>All Workspace</span>
          </button>

          <button
            onClick={() => setActiveSubFilter("teaching")}
            className={`relative w-24 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${activeSubFilter === "teaching" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <span>Teaching</span>
          </button>

          <button
            onClick={() => setActiveSubFilter("learning")}
            className={`relative w-24 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${activeSubFilter === "learning" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <span>Learning</span>
          </button>

          <button
            onClick={() => setActiveSubFilter("pending")}
            className={`relative w-36 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${activeSubFilter === "pending" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <span>Pending Requests</span>
          </button>

          <button
            onClick={() => setActiveSubFilter("applications")}
            className={`relative w-44 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center z-10 outline-none ${activeSubFilter === "applications" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <span>Student Applications</span>
          </button>
        </div>
      </div>

      {/* Grid / Applications Content */}
      {isLoading || (activeSubFilter === "applications" && loadingApps) ? (
        activeSubFilter === "applications" ? <ApplicationsLoader /> : <RoadmapsLoader />
      ) : activeSubFilter === "applications" ? (
        applications.length === 0 ? (
          <EmptyState
            message={getEmptyMessage()}
            showCreateCTA={false}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((app: any) => (
              <div
                key={app.id}
                className="p-6 rounded-[24px] border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col justify-between text-left gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-black border border-zinc-800 shadow-sm shrink-0">
                        {app.user?.fullName?.charAt(0) || app.user?.username?.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-zinc-900 leading-tight">{app.user?.fullName}</div>
                        <div className="text-[10px] text-zinc-400 font-bold leading-tight mt-0.5">@{app.user?.username}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200 text-zinc-500 font-mono">
                      APPLICANT
                    </span>
                  </div>

                  {app.user?.bio && (
                    <p className="text-xs text-zinc-550 leading-relaxed font-normal bg-zinc-50/50 p-3 rounded-xl border border-zinc-150/40 italic">
                      "{app.user.bio}"
                    </p>
                  )}

                  <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 mt-2">
                    <span className="text-zinc-400">Target Track:</span>
                    <span className="text-zinc-800 font-extrabold underline">{app.course?.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-50">
                  <button
                    onClick={() => handleManageRequest(app.id, "accepted")}
                    className="flex-1 py-2 rounded-xl bg-zinc-950 text-white text-xs font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleManageRequest(app.id, "declined")}
                    className="flex-1 py-2 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-bold tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
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
