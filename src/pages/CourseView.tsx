import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiArrowLeft, HiSparkles, HiCheckCircle, HiUserAdd, HiClock } from "react-icons/hi";
import { toast } from "react-toastify";
import SyllabusTimeline from "../components/courses/SyllabusTimeline";
import ActiveModuleViewer from "../components/courses/ActiveModuleViewer";
import LiveSessionCard from "../components/courses/LiveSessionCard";
import { AuthState } from "../types/course";
import {
  useGetCourseDetailsQuery,
  useRequestEnrollmentMutation,
  useGetEnrollmentRequestsQuery,
  useManageEnrollmentRequestMutation,
  useToggleModuleCompletionMutation,
} from "../redux/api/apiSlice";

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, user: authUser } = useSelector((state: AuthState) => state.auth);

  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // RTK Query course detail hook
  const {
    data: detailData,
    isLoading: isDetailsLoading,
    error: detailsError,
  } = useGetCourseDetailsQuery(id);

  const course = detailData?.course;
  const enrollmentStatus = detailData?.enrollmentStatus;
  const completedModules = detailData?.completedModules || [];

  const isCreator = course && authUser && course.creatorId === authUser.id;

  // Fetch pending join requests only for creators
  const { data: joinRequests = [] } = useGetEnrollmentRequestsQuery(id, {
    skip: !isCreator,
  });

  // Action mutations
  const [requestEnrollment, { isLoading: isJoinRequesting }] = useRequestEnrollmentMutation();
  const [manageEnrollmentRequest] = useManageEnrollmentRequestMutation();
  const [toggleModuleCompletion] = useToggleModuleCompletionMutation();

  // Handle join requests
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
        <Link to="/courses" className="text-accent font-bold hover:underline">Back to Roadmaps</Link>
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
      <div className="border-b border-zinc-200 bg-zinc-50/50 py-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <Link to="/courses" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-semibold mb-2">
              <HiArrowLeft /> Back to Courses
            </Link>
            <span className="text-xs font-semibold text-accent">{course.duration || `${course.durationValue} ${course.durationUnit}`}</span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-900 mt-1">{course.title}</h1>
            
            {isEnrolled && (
              <div className="pt-2 flex items-center gap-3 max-w-sm">
                <div className="flex-1 h-1.5 rounded-full bg-zinc-200/80 overflow-hidden">
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-zinc-500 shrink-0">
                  {progressPercent}% Complete ({completedCount}/{totalModules} Lessons)
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-zinc-400">Track Lead</div>
              <div className="text-sm font-bold text-zinc-900 mt-0.5">{course.creator ? course.creator.fullName : (course.mentor || 'Anonymous')}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-sm">
              {(course.creator ? course.creator.fullName : (course.mentor || 'U')).charAt(0)}
            </div>
          </div>
        </div>
      </div>

      {/* Access Denied / Joining CTAs */}
      {!isEnrolled ? (
        <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
            <HiSparkles size={28} className="animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Syllabus Enrollment Required</h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              This learning track is syllabus-guided. You need to enroll to view learning resources, check off completed days, and join live check-ins.
            </p>
          </div>

          {enrollmentStatus === "pending" ? (
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 font-semibold text-xs flex items-center justify-center gap-2 max-w-xs mx-auto">
              <HiClock className="text-amber-500 text-sm" /> Join Request Pending Approval
            </div>
          ) : enrollmentStatus === "declined" ? (
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-rose-500 font-semibold text-xs flex items-center justify-center gap-2 max-w-xs mx-auto">
              Your request to join was declined.
            </div>
          ) : (
            <button
              onClick={handleJoinRequest}
              disabled={isJoinRequesting}
              className="px-6 py-3 rounded-full bg-accent text-white text-xs font-bold tracking-tight hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto shadow-md shadow-accent/10 disabled:opacity-50"
            >
              <HiUserAdd size={16} /> Request to Join Study Track
            </button>
          )}

          {/* Module Syllabus Preview List */}
          <div className="pt-10 border-t border-zinc-100 text-left">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4">Syllabus Overview</h3>
            <div className="space-y-3">
              {course.modules?.map((mod, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-400">Day {mod.orderIndex || idx + 1}:</span>
                  <span className="text-xs font-bold text-zinc-800">{mod.title}</span>
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

export default CourseView;
