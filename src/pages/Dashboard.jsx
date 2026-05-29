import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch, FiUser, FiCpu } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import axios from 'axios';
import { getGreeting } from './renderer';
import ProfileCompletionBanner from '../components/sections/ProfileCompletionBanner';
import ProfileCarousel from '../components/sections/ProfileCarousel';

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

    let semanticSim = 0.65; // Base similarity fallback
    if (overlap.length > 0) {
        semanticSim += Math.min(0.30, overlap.length * 0.10);
    }

    let skillScore = overlap.length > 0 ? Math.min(1.0, 0.4 + overlap.length * 0.2) : 0.2;
    let expScore = 0.5;

    if (isPeer) {
        const diff = Math.abs(currentExp - candidateExp);
        expScore = diff <= 1 ? 0.9 : diff <= 3 ? 0.7 : 0.4;
    } else {
        const gap = candidateExp - currentExp;
        if (candidate.role === 'mentor') {
            expScore = gap >= 5 ? 0.9 : gap >= 3 ? 0.8 : gap > 0 ? 0.6 : 0.3;
        } else {
            expScore = gap <= -5 ? 0.9 : gap <= -3 ? 0.8 : gap < 0 ? 0.6 : 0.3;
        }
    }

    let score = 0;
    let insights = [];

    if (isPeer) {
        score = (0.50 * semanticSim + 0.35 * skillScore + 0.15 * expScore) * 100;
        insights.push('Peer Match');
        if (Math.abs(currentExp - candidateExp) <= 1) {
            insights.push('Similar Career Level');
        }
    } else {
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
    const [exploreUsers, setExploreUsers] = useState([]);
    const [aiMatches, setAiMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.id) return;
            try {
                // Fetch both normal profiles and AI smart matches in parallel (limit = 5)
                const [exploreRes, aiRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/users?limit=5&currentUserId=${user.id}`, { withCredentials: true }),
                    axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/users/${user.id}/matches?limit=5`, { withCredentials: true })
                ]);
                
                const rawUsers = exploreRes?.data?.users || [];
                const rawMatches = aiRes?.data?.matches || [];

                const enrichedExploreUsers = rawUsers.map(u => {
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

                setExploreUsers(enrichedExploreUsers);
                setAiMatches(rawMatches);
            } catch (err) {
                console.error("Error loading suggested profiles:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-12 pb-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="space-y-4">
                        <h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none">
                            {getGreeting()}, {user?.fullName ? user.fullName.split(' ')[0] : user?.username}
                        </h1>
                        <p className="text-zinc-500 text-[9px] md:text-xs max-w-xl font-medium tracking-tight">
                            Manage your mentorships, chat with connections, and explore new opportunities.
                        </p>
                    </div>
                </div>

                <ProfileCompletionBanner variant="dashboard" />

                {/* Suggested Profiles Section */}
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                    <style>{`
                        .scrollbar-none::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white tracking-tight">Suggested Profiles</h2>
                    </div>

                    {/* Subsection 1: AI Smart Matches */}
                    <ProfileCarousel
                        title="AI Smart Matches"
                        subtitle="Top-tier neural recommendations computed dynamically from your profiles."
                        icon={HiSparkles}
                        iconBgClass="bg-violet-500/10 border border-violet-500/20 text-violet-400"
                        items={aiMatches}
                        loading={loading}
                        ctaLink="/explore?tab=ai-match"
                        ctaTitle={<>Unlock All <br />Matches</>}
                        ctaDesc="Reveal the full, hyper-curated list of candidates matching your direct skill compatibility matrix."
                        ctaActionLabel="Unlock Matches"
                        ctaIcon={FiCpu}
                        ctaBgClass="bg-gradient-to-br from-violet-950/20 to-fuchsia-950/20 border border-violet-500/10 hover:border-violet-500/30"
                        ctaLabelColorClass="text-violet-400 group-hover:text-white"
                    />

                    {/* Subsection 2: Recommended Connections (Normal) */}

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
    );
};

export default Dashboard;
