import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch, FiUser, FiCpu } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import ProfileCompletionBanner from '../../components/sections/ProfileCompletionBanner';
import ProfileCarousel from '../../components/sections/ProfileCarousel';
import { useGetUsersQuery, useGetMatchesQuery, useGetCoursesQuery } from '../../redux/api/apiSlice';

// Import subcomponents
import WelcomeHeader from './components/WelcomeHeader';
import WorkspaceMetrics from './components/WorkspaceMetrics';
import ActiveRoadmaps from './components/ActiveRoadmaps';
import UpcomingSessions from './components/UpcomingSessions';
import PendingRequestsAlert from './components/PendingRequestsAlert';

// Local helper to compute compatibility score and insights on the frontend matching the backend hybrid engine
const computeLocalScore = (currentUser: any, candidate: any) => {
    if (!currentUser || !candidate) return { compatibilityScore: 50, insights: [] };

    const isPeer = currentUser.role === candidate.role;

    const cleanSkills = (skills: any) => {
        if (!skills) return [];
        if (Array.isArray(skills)) return skills;
        try {
            const parsed = typeof skills === 'string' ? JSON.parse(skills) : skills;
            if (Array.isArray(parsed)) return parsed;
            return Object.values(parsed);
        } catch (e) {
            return String(skills).split(',');
        }
    };

    const userSkills = cleanSkills(currentUser.skills).map((s: string) => s.trim().toLowerCase());
    const candidateSkills = cleanSkills(candidate.skills).map((s: string) => s.trim().toLowerCase());

    const overlap = userSkills.filter((s: string) => candidateSkills.includes(s));
    const currentExp = currentUser.yearsOfExperience || 0;
    const candidateExp = candidate.yearsOfExperience || 0;

    let score = 50; // Base score
    const insights = [];

    // Simple semantic match mapping
    const semanticSim = 0.65; // Fixed default semantic similarity

    if (isPeer) {
        const expDiff = Math.abs(currentExp - candidateExp);
        const expScore = Math.max(0, 1 - expDiff / 10);
        const skillScore = overlap.length / Math.max(1, userSkills.length);
        score = (0.50 * semanticSim + 0.35 * skillScore + 0.15 * expScore) * 100;
        insights.push('Peer Match');
    } else {
        const expScore = candidateExp >= currentExp ? 1 : 0.2;
        const skillScore = overlap.length / Math.max(1, userSkills.length);
        score = (0.50 * semanticSim + 0.30 * skillScore + 0.20 * expScore) * 100;
        insights.push(candidate.role === 'mentor' ? 'Expert Guide' : 'Aspiring Learner');
        const expGap = candidateExp - currentExp;
        if (expGap >= 3 && expGap <= 6) {
            insights.push('Ideal Experience Match');
        }
    }

    if (overlap.length > 0) {
        insights.push(`${overlap.length} Shared Skill${overlap.length > 1 ? 's' : ''}`);
    }

    score = Math.max(15, Math.min(99, Math.round(score)));

    return { compatibilityScore: score, insights };
};

const Dashboard: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);

    const { data: usersData, isFetching: loadingUsers } = useGetUsersQuery({
        limit: 5,
        currentUserId: user?.id
    }, { skip: !user?.id });

    const { data: matchesData, isFetching: loadingMatches } = useGetMatchesQuery(
        user?.id,
        { skip: !user?.id }
    );

    // Fetch user workspace roadmaps (automatically retrieves associated syllabus modules and student completions)
    const { data: courses = [], isFetching: loadingRoadmaps } = useGetCoursesQuery(
        { filter: 'my-roadmaps' },
        { skip: !user?.id }
    );

    const loading = loadingUsers || loadingMatches || loadingRoadmaps;
    const aiMatches = matchesData?.matches || [];

    const exploreUsers = useMemo(() => {
        const rawUsers = usersData?.users || [];
        const rawMatches = matchesData?.matches || [];
        return rawUsers.map((u: any) => {
            const match = rawMatches.find((m: any) => m.user?.id === u.id);
            if (match) {
                return {
                    ...u,
                    compatibilityScore: match.compatibilityScore,
                    insights: match.insights
                };
            }

            const localMatch = computeLocalScore(user, u);
            return {
                ...u,
                compatibilityScore: localMatch.compatibilityScore,
                insights: localMatch.insights
            };
        });
    }, [usersData?.users, matchesData?.matches, user]);

    // Compute stats & filter tracks
    const learningTracks = useMemo(() => {
        return courses.filter((c: any) => c.userEnrollmentStatus === 'accepted' && c.creatorId !== user?.id);
    }, [courses, user?.id]);

    const teachingTracks = useMemo(() => {
        return courses.filter((c: any) => c.creatorId === user?.id);
    }, [courses, user?.id]);

    const pendingTracks = useMemo(() => {
        return courses.filter((c: any) => c.userEnrollmentStatus === 'pending');
    }, [courses]);

    // Sum of pending student application requests across all tracks created by the user
    const totalPendingRequests = useMemo(() => {
        return teachingTracks.reduce((acc: number, c: any) => acc + (c.pendingRequestsCount || 0), 0);
    }, [teachingTracks]);

    // Extract upcoming live Google Meet sessions from active roadmaps (both learning & teaching)
    const upcomingSessions = useMemo(() => {
        const now = new Date();
        const sessions: any[] = [];

        // Attending sessions (learning)
        learningTracks.forEach((course: any) => {
            if (course.modules) {
                course.modules.forEach((mod: any) => {
                    if (mod.meetingTime) {
                        const meetTime = new Date(mod.meetingTime);
                        if (meetTime > now) {
                            sessions.push({
                                courseId: course.id,
                                courseTitle: course.title,
                                moduleTitle: mod.title,
                                orderIndex: mod.orderIndex,
                                meetingTime: meetTime,
                                meetingLink: mod.meetingLink,
                                role: 'learning'
                            });
                        }
                    }
                });
            }
        });

        // Hosting sessions (teaching)
        teachingTracks.forEach((course: any) => {
            if (course.modules) {
                course.modules.forEach((mod: any) => {
                    if (mod.meetingTime) {
                        const meetTime = new Date(mod.meetingTime);
                        if (meetTime > now) {
                            sessions.push({
                                courseId: course.id,
                                courseTitle: course.title,
                                moduleTitle: mod.title,
                                orderIndex: mod.orderIndex,
                                meetingTime: meetTime,
                                meetingLink: mod.meetingLink,
                                role: 'teaching'
                            });
                        }
                    }
                });
            }
        });

        // Sort chronologically (earliest session first) and slice top 3
        return sessions.sort((a, b) => a.meetingTime.getTime() - b.meetingTime.getTime()).slice(0, 3);
    }, [learningTracks, teachingTracks]);

    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-12 pb-24 animate-in fade-in duration-500">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <WelcomeHeader fullName={user?.fullName} username={user?.username} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column (Main Feed - col-9) */}
                    <div className="lg:col-span-9 space-y-12">
                        <ProfileCompletionBanner variant="dashboard" />

                        <WorkspaceMetrics 
                            learningCount={learningTracks.length} 
                            teachingCount={teachingTracks.length} 
                            pendingCount={pendingTracks.length} 
                        />

                        <ActiveRoadmaps 
                            learningTracks={learningTracks} 
                            teachingTracks={teachingTracks} 
                        />

                        {/* Suggested Profiles (AI Matches) */}
                        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            <ProfileCarousel
                                title="AI Smart Matches"
                                subtitle="Top-tier AI matches computed dynamically from your profiles."
                                icon={HiSparkles}
                                iconBgClass="bg-violet-50 border border-violet-200 text-violet-600"
                                items={aiMatches.slice(0, 5)}
                                loading={loading}
                                ctaLink="/explore?tab=ai-match"
                                ctaTitle={(<>All <br />Suggestions</> as any)}
                                ctaDesc="Reveal the full, hyper-curated list of candidates matching your direct skill compatibility analysis."
                                ctaActionLabel="View Suggestions"
                                ctaIcon={FiCpu}
                                ctaBgClass="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200 hover:border-violet-400"
                                ctaLabelColorClass="text-violet-600 group-hover:text-violet-900"
                            />
                        </div>

                        {/* Subsection 2: Recommended Connections */}
                        <div>
                            <ProfileCarousel
                                title="Recommended Connections"
                                subtitle="Explore active members across the synckro network."
                                icon={FiUser}
                                items={exploreUsers}
                                loading={loading}
                                ctaLink="/explore"
                                ctaTitle={(<>Explore All <br />Profiles</> as any)}
                                ctaDesc="Browse through our complete community of expert mentors and ambitious mentees."
                                ctaActionLabel="Show All Profiles"
                                ctaIcon={FiSearch}
                            />
                        </div>
                    </div>

                    {/* Right Column (Sidebar Widgets - col-3) */}
                    <aside className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <PendingRequestsAlert count={totalPendingRequests} />
                        <UpcomingSessions sessions={upcomingSessions} />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
