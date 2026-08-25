import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiBriefcase, FiTerminal } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import CarouselLoader from '../loaders/CarouselLoader';

const ProfileCarousel = ({
    title,
    subtitle,
    icon: Icon,
    iconBgClass = "bg-zinc-100 border border-zinc-200 text-zinc-600",
    items = [],
    loading = false,
    ctaLink = "/discover",
    ctaTitle = "Explore All Profiles",
    ctaDesc = "Browse through our complete community of expert mentors and ambitious mentees.",
    ctaActionLabel = "Show All Profiles",
    ctaIcon: CtaIcon,
    ctaBgClass = "bg-zinc-50 border border-zinc-200 hover:border-zinc-300 shadow-sm",
    ctaLabelColorClass = "text-zinc-500 group-hover:text-zinc-900"
}) => {
    const containerRef = useRef(null);

    // Force scroll position to 0 on initial load to prevent auto-scrolling issues
    useEffect(() => {
        if (!loading && containerRef.current) {
            containerRef.current.scrollLeft = 0;
        }
    }, [loading, items]);

    const scroll = (direction) => {
        if (containerRef.current) {
            const cardWidth = 324; // Card width + gap
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBgClass}`}>
                            {Icon && <Icon className="w-4 h-4" />}
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-semibold tracking-tight text-zinc-900 leading-tight">{title}</h3>
                            <p className="text-zinc-500 text-sm font-normal mt-1">{subtitle}</p>
                        </div>
                    </div>
                </div>
                <CarouselLoader />
            </div>
        );
    }

    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${iconBgClass}`}>
                        {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                        <h3 className="text-base md:text-md font-semibold tracking-tight text-zinc-900 leading-tight">{title}</h3>
                        <p className="text-zinc-500 text-xs font-normal mt-1">{subtitle}</p>
                    </div>
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center hover:bg-zinc-200 active:scale-95 transition-all text-zinc-500 hover:text-zinc-900"
                    >
                        <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center hover:bg-zinc-200 active:scale-95 transition-all text-zinc-500 hover:text-zinc-900"
                    >
                        <FiChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scrolling Container */}
            <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-6 scrollbar-none snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => {
                    const hasNestedUser = item.user !== undefined;
                    const candidate = hasNestedUser ? item.user : item;
                    const score = item.compatibilityScore || null;
                    const insights = item.insights || [];
                    const isAiMatch = score !== null;

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
                    const skills = cleanSkills(candidate.skills);

                    const parsedExperience = typeof candidate.experience === 'string'
                        ? JSON.parse(candidate.experience)
                        : candidate.experience;
                    const latestExperience = parsedExperience && Array.isArray(parsedExperience) && parsedExperience.length > 0
                        ? parsedExperience.find(exp => exp.currentlyWorking) || parsedExperience[0]
                        : null;

                    return (
                        <div
                            key={candidate.id}
                            className="w-[300px] shrink-0 snap-start block select-none"
                        >
                            <div className={`relative bg-zinc-50 border border-zinc-200 p-5 transition-all duration-300 flex flex-col h-[250px] rounded-2xl shadow-sm ${isAiMatch
                                ? 'hover:border-violet-400'
                                : 'hover:border-zinc-400'
                                }`}>

                                {isAiMatch && score !== null && (
                                    <div className="absolute top-5 right-5">
                                        <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black tracking-widest uppercase border ${score >= 60
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : score >= 20
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                                            }`}>
                                            {score}% Match
                                        </span>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-700">
                                            {candidate.fullName ? candidate.fullName[0].toUpperCase() : candidate.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <Link
                                                to={`/profile/${candidate.username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline block w-fit"
                                            >
                                                <h4 className="text-sm font-bold text-zinc-900 tracking-tight transition-colors truncate max-w-[160px] hover:text-violet-600">
                                                    {candidate.fullName || candidate.username}
                                                </h4>
                                            </Link>
                                            <span className={`inline-block px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-widest border mt-0.5 border-zinc-200 bg-zinc-100 ${candidate.role === 'mentor' ? 'text-emerald-600' : 'text-amber-600'
                                                }`}>
                                                {candidate.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 font-medium">
                                        {candidate.bio || "No biography provided."}
                                    </p>

                                    {/* Experience directly below Bio */}
                                    {latestExperience && (
                                        <div className="flex items-center gap-1.5 min-w-0 text-[10px] text-zinc-500 font-bold">
                                            <FiBriefcase className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                            <span className="truncate normal-case font-bold tracking-tight text-[11px] text-zinc-600">
                                                {latestExperience.role} at <span className="text-zinc-900 font-bold">{latestExperience.company}</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Tags/Chips Area with Distinct Rows */}
                                    <div className="space-y-3 pt-1">
                                        {/* Row 1: Skills (directly below bio, explicitly indicated!) */}
                                        {skills && skills.length > 0 && (
                                            <div className="flex gap-2 items-start">
                                                <FiTerminal className="w-3.5 h-3.5 text-zinc-400 shrink-0 select-none mt-0.5" />
                                                <div className="flex flex-wrap gap-1.5 gap-y-2">
                                                    {skills.slice(0, 3).map((skillItem, idx) => (
                                                        <span
                                                            key={`skill-${idx}`}
                                                            className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded-[4px] text-[8px] font-bold uppercase tracking-wider text-zinc-500 hover:border-zinc-300 transition-all"
                                                        >
                                                            {skillItem}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Row 2: AI Insights (indicated with high-fidelity sparkles AI icon!) */}
                                        {insights && insights.length > 0 && (
                                            <div className="flex gap-2 items-start">
                                                <HiSparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 select-none mt-0.5" />
                                                <div className="flex flex-wrap gap-1.5 gap-y-2">
                                                    {insights.map((tagItem, idx) => {
                                                        const isOverlap = tagItem.includes('Shared');
                                                        const isSync = tagItem.includes('Peer') || tagItem.includes('Level');
                                                        const isMentor = tagItem.includes('Guide') || tagItem.includes('Learner') || tagItem.includes('Experience');
                                                        return (
                                                            <span
                                                                key={`insight-${idx}`}
                                                                className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${isOverlap
                                                                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20'
                                                                    : isSync
                                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                                        : isMentor
                                                                            ? 'bg-blue-500/10 text-blue-400 border-blue-200 hover:bg-blue-500/20'
                                                                            : 'bg-white/[0.02] text-white/50 border-white/[0.05]'
                                                                    }`}
                                                            >
                                                                {tagItem}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* End Card CTA */}
                <div className="w-[300px] shrink-0 snap-start">
                    <Link
                        to={ctaLink}
                        className={`group relative rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between h-[250px] ${ctaBgClass}`}
                    >
                        <div className="space-y-3">
                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                {CtaIcon && <CtaIcon className="w-4 h-4 text-zinc-400" />}
                            </div>
                            <h4 className="text-sm font-black tracking-tight text-zinc-900 leading-tight mt-1">
                                {ctaTitle}
                            </h4>
                            <p className="text-zinc-500 text-xs leading-relaxed font-medium line-clamp-2">
                                {ctaDesc}
                            </p>
                        </div>

                        <div className={`flex items-center justify-between text-[9px] font-black uppercase tracking-widest transition-colors pt-3 border-t border-zinc-200 ${ctaLabelColorClass}`}>
                            <span>{ctaActionLabel}</span>
                            <FiArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfileCarousel;
