import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiSparkles, HiUserAdd } from "react-icons/hi";
import { FiClock, FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import SyllabusTimeline from "./components/SyllabusTimeline";
import ActiveModuleViewer from "./components/ActiveModuleViewer";
import LiveSessionCard from "./components/LiveSessionCard";
import RoadmapViewHeader from "./components/RoadmapViewHeader";
import { AuthState } from "../../types/roadmap";
import {
  useGetCourseDetailsQuery,
  useRequestEnrollmentMutation,
  useGetEnrollmentRequestsQuery,
  useManageEnrollmentRequestMutation,
  useToggleModuleCompletionMutation,
} from "../../redux/api/apiSlice";

const RoadmapView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, user: authUser } = useSelector((state: AuthState) => state.auth);

  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  const {
    data: detailData,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useGetCourseDetailsQuery(id);

  const course = detailData?.course;
  const enrollmentStatus = detailData?.enrollmentStatus;
  const completedModules = detailData?.completedModules || [];

  const isCreator = course && authUser && course.creatorId === authUser.id;

  const { data: joinRequests = [] } = useGetEnrollmentRequestsQuery(id, {
    skip: !isCreator,
  });

  const [requestEnrollment, { isLoading: isJoinRequesting }] = useRequestEnrollmentMutation();
  const [manageEnrollmentRequest] = useManageEnrollmentRequestMutation();
  const [toggleModuleCompletion] = useToggleModuleCompletionMutation();

  const handleJoinRequest = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to request joining this track");
      return;
    }
    try {
      const res = await requestEnrollment(id).unwrap();
      toast.success(res.message || "Join request sent successfully!");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to send request");
    }
  };

  // Creator approves or declines enrollment
  const handleManageRequest = async (enrollmentId: string, status: "accepted" | "declined") => {
    try {
      await manageEnrollmentRequest({ enrollmentId, status }).unwrap();
      toast.success(`Application successfully ${status}`);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to respond to request");
    }
  };

  // Student checks off completed syllabus milestones
  const toggleCompleteModule = async () => {
    if (!course || !course.modules || !course.modules[activeModuleIndex]) return;
    const activeModule = course.modules[activeModuleIndex];
    const orderIndex = activeModule.orderIndex || activeModuleIndex + 1;

    try {
      await toggleModuleCompletion({ courseId: id, orderIndex }).unwrap();
      toast.success("Progress tracked successfully!");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update milestone progress");
    }
  };

  if (isDetailsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-zinc-400 text-sm font-semibold">
        Loading syllabus player...
      </div>
    );
  }

  if (detailsError || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <span className="text-zinc-500 text-sm font-medium">Roadmap track not found</span>
        <Link to="/roadmaps" className="text-accent font-bold hover:underline">Back to Roadmaps</Link>
      </div>
    );
  }

  const activeModule = course.modules && course.modules.length > 0 ? course.modules[activeModuleIndex] : null;
  const totalModules = course.modules ? course.modules.length : 0;
  const completedCount = completedModules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Render variables for access guards
  const isEnrolled = enrollmentStatus === "accepted" || isCreator;
  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-500">
      {/* Header banner */}
      <RoadmapViewHeader
        course={course}
        isEnrolled={isEnrolled}
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalModules={totalModules}
      />

      {/* Access Denied / Joining CTAs */}
      {!isEnrolled ? (
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 pb-24 animate-in fade-in duration-500">
          <div className="max-w-2xl mx-auto bg-white border border-zinc-200/80 rounded-[32px] p-10 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col items-center text-center">
            {/* Sparkle Glow Squircle */}
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-violet-100/50">
              <HiSparkles size={22} className="animate-pulse" />
            </div>
            
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 mb-3">Syllabus Enrollment Required</h2>
            
            <p className="text-zinc-500 text-sm leading-relaxed max-w-lg mb-6 font-normal">
              {course.description}
            </p>

            {/* Skills you will learn */}
            {course.skillsTargeted && course.skillsTargeted.length > 0 && (
              <div className="w-full pb-6 border-b border-zinc-100">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-3 text-center">Skills you will learn</span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {course.skillsTargeted.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors cursor-default select-none"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Access CTA Action */}
            <div className="w-full mt-6">
              {enrollmentStatus === "pending" ? (
                <div className="py-3 px-5 rounded-2xl border border-amber-200 bg-amber-50/50 text-amber-800 text-xs font-bold tracking-tight flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <FiClock className="text-amber-500 text-sm" /> Join Request Pending Approval
                </div>
              ) : enrollmentStatus === "declined" ? (
                <div className="py-3 px-5 rounded-2xl border border-rose-200 bg-rose-50/50 text-rose-800 text-xs font-bold tracking-tight flex items-center justify-center gap-2 max-w-xs mx-auto">
                  Your request to join was declined.
                </div>
              ) : (
                <button
                  onClick={handleJoinRequest}
                  disabled={isJoinRequesting}
                  className="px-6 py-3 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold tracking-tight shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  <HiUserAdd size={16} /> Request to Join Study Track
                </button>
              )}
            </div>
          </div>

          {/* Module Syllabus Preview List */}
          <div className="max-w-2xl mx-auto mt-16 pt-10 border-t border-zinc-150 text-left">
            <div className="text-center mb-6">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Syllabus Overview</span>
            </div>
            <div className="space-y-3">
              {course.modules?.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-zinc-200/60 bg-white hover:border-zinc-300 transition-all duration-200 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-zinc-100 text-zinc-500 flex items-center justify-center text-[10px] font-mono font-bold border border-zinc-200/40">
                      {mod.orderIndex || idx + 1}
                    </span>
                    <span className="text-xs font-bold text-zinc-850">{mod.title}</span>
                  </div>
                  <span className="text-zinc-300 group-hover:text-zinc-500 transition-colors pr-1">
                    <FiLock className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Accepted Student player layout */
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-12 py-10">
          {/* Left timeline menu (col-4) */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="text-xs font-semibold text-zinc-400 mb-4">Course Syllabus</h2>
            {course.modules && course.modules.length > 0 ? (
              <SyllabusTimeline
                modules={course.modules}
                activeIdx={activeModuleIndex}
                completedOrderIndexes={completedModules}
                onSelect={setActiveModuleIndex}
              />
            ) : (
              <div className="text-zinc-400 text-xs font-medium">No syllabus modules added.</div>
            )}
          </div>

          {/* Center active module details (col-5) */}
          <div className="md:col-span-5 space-y-6">
            {activeModule ? (
              <ActiveModuleViewer module={activeModule} />
            ) : (
              <div className="text-zinc-400 text-xs font-medium">Select a module to view details.</div>
            )}
          </div>

          {/* Right side checkins and requests drawer (col-3) */}
          <div className="md:col-span-3 space-y-8">
            {activeModule && (
              <LiveSessionCard
                meetingLink={activeModule.meetingLink}
                meetingTime={activeModule.meetingTime}
                isCompleted={completedModules.includes(activeModule.orderIndex || activeModuleIndex + 1)}
                onToggleComplete={toggleCompleteModule}
              />
            )}

            {/* Creator requests drawer */}
            {isCreator && joinRequests.length > 0 && (
              <div className="pt-6 border-t border-zinc-200 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Pending Applications</h3>
                <div className="space-y-3">
                  {joinRequests.map((req: any) => (
                    <div key={req.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{req.user.fullName}</div>
                        <div className="text-[10px] text-zinc-400 font-medium">@{req.user.username}</div>
                        {req.user.bio && (
                          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{req.user.bio}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleManageRequest(req.id, "accepted")}
                          className="flex-1 py-1.5 rounded-lg bg-accent text-white text-[10px] font-bold tracking-tight hover:bg-accent/90"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleManageRequest(req.id, "declined")}
                          className="flex-1 py-1.5 rounded-lg bg-zinc-200 text-zinc-800 text-[10px] font-bold tracking-tight hover:bg-zinc-300"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapView;
