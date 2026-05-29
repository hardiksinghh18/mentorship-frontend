import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import CarouselLoader from '../loaders/CarouselLoader';

const ProfileCarousel = ({
    title,
    subtitle,
    icon: Icon,
    iconBgClass = "bg-white/5 border border-white/10 text-zinc-400",
    items = [],
    loading = false,
    ctaLink = "/discover",
    ctaTitle = "Explore All Profiles",
    ctaDesc = "Browse through our complete community of expert mentors and ambitious mentees.",
    ctaActionLabel = "Show All Profiles",
    ctaIcon: CtaIcon,
    ctaBgClass = "bg-white/[0.02] border border-white/5 hover:border-white/15",
    ctaLabelColorClass = "text-zinc-400 group-hover:text-white"
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
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgClass}`}>
                            {Icon && <Icon className="w-4 h-4" />}
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">{title}</h3>
                            <p className="text-zinc-500 text-[10px] font-medium mt-0.5">{subtitle}</p>
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
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBgClass}`}>
                        {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">{title}</h3>
                        <p className="text-zinc-500 text-[10px] font-medium mt-0.5">{subtitle}</p>
                    </div>
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-white/[0.05] active:scale-95 transition-all text-zinc-400 hover:text-white"
                    >
                        <FiChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center hover:bg-white/[0.05] active:scale-95 transition-all text-zinc-400 hover:text-white"
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

                    return (
                        <div key={candidate.id} className="w-[300px] shrink-0 snap-start">
                            <div className={`group relative bg-zinc-950/40 border p-5 transition-all duration-300 flex flex-col justify-between h-[250px] rounded-2xl ${
                                isAiMatch 
                                    ? 'border-white/5 hover:border-violet-500/20' 
                                    : 'border-white/5 hover:border-white/15'
                            }`}>
                                
                                {isAiMatch && score !== null && (
                                    <div className="absolute top-5 right-5">
                                        <span className={`px-2 py-0.5 rounded-[4px] text-[7px] font-black tracking-widest uppercase border ${
                                            score >= 80 
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                : score >= 60 
                                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                            {score}% Match
                                        </span>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {/* Header */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-sm font-bold text-white/50">
                                            {candidate.fullName ? candidate.fullName[0].toUpperCase() : candidate.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className={`text-xs font-bold text-white tracking-tight transition-colors truncate max-w-[120px] ${
                                                isAiMatch ? 'group-hover:text-violet-400' : 'group-hover:text-white'
                                            }`}>
                                                {candidate.fullName || candidate.username}
                                            </h4>
                                            <span className={`inline-block px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-widest border mt-0.5 border-white/5 bg-white/[0.02] ${
                                                candidate.role === 'mentor' ? 'text-emerald-400' : 'text-amber-400'
                                            }`}>
                                                {candidate.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-zinc-500 text-[10px] leading-relaxed line-clamp-2 font-medium">
                                        {candidate.bio || "No biography provided."}
                                    </p>

                                    {/* Tags/Chips Area with Distinct Rows */}
                                    <div className="space-y-1.5 pt-1">
                                        {/* Row 1: Skills (directly below bio, explicitly indicated!) */}
                                        {skills && skills.length > 0 && (
                                            <div className="flex gap-1.5 items-start">
                                                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 shrink-0 mt-0.5 select-none">
                                                    Skills:
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {skills.slice(0, 3).map((skillItem, idx) => (
                                                        <span 
                                                            key={`skill-${idx}`} 
                                                            className="px-1.5 py-0.5 bg-white/[0.02] border border-white/5 rounded-[4px] text-[7px] font-black uppercase tracking-widest text-zinc-400 hover:border-white/15 transition-all"
                                                        >
                                                            {skillItem}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Row 2: AI Insights (indicated with high-fidelity sparkles AI icon!) */}
                                        {insights && insights.length > 0 && (
                                            <div className="flex gap-1.5 items-start">
                                                <HiSparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 select-none mt-0.5" />
                                                <div className="flex flex-wrap gap-1">
                                                    {insights.map((tagItem, idx) => {
                                                        const isOverlap = tagItem.includes('Shared');
                                                        const isSync = tagItem.includes('Peer') || tagItem.includes('Level');
                                                        const isMentor = tagItem.includes('Guide') || tagItem.includes('Learner') || tagItem.includes('Experience');
                                                        return (
                                                            <span
                                                                key={`insight-${idx}`}
                                                                className={`px-1.5 py-0.5 rounded-[4px] text-[7px] font-black uppercase tracking-widest border transition-all duration-300 ${
                                                                    isOverlap 
                                                                        ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20' 
                                                                        : isSync
                                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                                            : isMentor
                                                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20'
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

                                {/* Footer (View Profile text adjacent to arrow icon on right end) */}
                                <div className="pt-3 border-t border-white/5 flex justify-end">
                                    <Link 
                                        to={`/profile/${candidate.username}`}
                                        className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <span>View Profile</span>
                                        <FiChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* End Card CTA */}
                <div className="w-[300px] shrink-0 snap-start">
                    <Link 
                        to={ctaLink}
                        className={`group relative rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between h-[250px] ${ctaBgClass}`}
                    >
                        <div className="space-y-3">
                            <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                {CtaIcon && <CtaIcon className="w-4 h-4 text-zinc-400" />}
                            </div>
                            <h4 className="text-sm font-black tracking-tight text-white leading-tight mt-1">
                                {ctaTitle}
                            </h4>
                            <p className="text-zinc-500 text-[10px] leading-relaxed font-medium line-clamp-2">
                                {ctaDesc}
                            </p>
                        </div>

                        <div className={`flex items-center justify-between text-[8px] font-black uppercase tracking-widest transition-colors pt-3 border-t border-white/5 ${ctaLabelColorClass}`}>
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
