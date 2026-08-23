import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch, FiUser, FiCpu } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { getGreeting } from './renderer';
import ProfileCompletionBanner from '../components/sections/ProfileCompletionBanner';
import ProfileCarousel from '../components/sections/ProfileCarousel';
import { useGetUsersQuery, useGetMatchesQuery } from '../redux/api/apiSlice';

// Local helper to compute compatibility score and insights on the frontend matching the backend hybrid engine
const computeLocalScore = (currentUser, candidate) => {
    if (!currentUser || !candidate) return { compatibilityScore: 50, insights: [] };

    const isPeer = currentUser.role === candidate.role;

    const cleanSkills = (skills) => {
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

    const userSkills = cleanSkills(currentUser.skills).map(s => s.trim().toLowerCase());
    const candidateSkills = cleanSkills(candidate.skills).map(s => s.trim().toLowerCase());

    const overlap = userSkills.filter(s => candidateSkills.includes(s));
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

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    const { data: usersData, isFetching: loadingUsers } = useGetUsersQuery({
        limit: 5,
        currentUserId: user?.id
    }, { skip: !user?.id });

    const { data: matchesData, isFetching: loadingMatches } = useGetMatchesQuery(
        user?.id,
        { skip: !user?.id }
    );

    const loading = loadingUsers || loadingMatches;
    const aiMatches = matchesData?.matches || [];

    const exploreUsers = useMemo(() => {
        const rawUsers = usersData?.users || [];
        const rawMatches = matchesData?.matches || [];
        return rawUsers.map(u => {
            const match = rawMatches.find(m => m.user?.id === u.id);
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

    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-12 pb-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-zinc-900 leading-tight">
                            {getGreeting()}, <span className="font-semibold text-zinc-950">{user?.fullName ? user.fullName.split(' ')[0] : user?.username}</span>
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-base font-normal max-w-2xl tracking-normal leading-relaxed mt-2">
                            Manage your mentorships, chat with connections, and explore new opportunities.
                        </p>
                    </div>
                </div>

                <ProfileCompletionBanner variant="dashboard" />

                {/* Suggested Profiles Section */}
                <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <style>{`
                        .scrollbar-none::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-900">Suggested Profiles</h2>
                    </div>

                    {/* Subsection 1: AI Smart Matches */}
                    <div className="mt-8">
                        <ProfileCarousel
                            title="AI Smart Matches"
                            subtitle="Top-tier AI matches computed dynamically from your profiles."
                            icon={HiSparkles}
                            iconBgClass="bg-violet-50 border border-violet-200 text-violet-600"
                            items={aiMatches}
                            loading={loading}
                            ctaLink="/explore?tab=ai-match"
                            ctaTitle={<>All <br />Suggestions</>}
                            ctaDesc="Reveal the full, hyper-curated list of candidates matching your direct skill compatibility analysis."
                            ctaActionLabel="View Suggestions"
                            ctaIcon={FiCpu}
                            ctaBgClass="bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-200 hover:border-violet-400"
                            ctaLabelColorClass="text-violet-600 group-hover:text-violet-900"
                        />
                    </div>

                    {/* Subsection 2: Recommended Connections (Normal) */}
                    <div className="mt-4">
                        <ProfileCarousel
                            title="Recommended Connections"
                            subtitle="Explore active members across the skill-sync network."
                            icon={FiUser}
                            items={exploreUsers}
                            loading={loading}
                            ctaLink="/explore"
                            ctaTitle={<>Explore All <br />Profiles</>}
                            ctaDesc="Browse through our complete community of expert mentors and ambitious mentees."
                            ctaActionLabel="Show All Profiles"
                            ctaIcon={FiSearch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
