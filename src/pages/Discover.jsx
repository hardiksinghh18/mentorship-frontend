import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileCard from "../components/common/ProfileCard";
import { useNavigate } from "react-router-dom";
import { RiSearchLine } from 'react-icons/ri';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import ProfileCompletionBanner from "../components/sections/ProfileCompletionBanner";
import FilterSidebar from "../components/sections/FilterSidebar";
import { DEFAULT_FILTERS } from "../utils/filterConstants";
import { useGetUsersQuery, useGetMatchesQuery } from "../redux/api/apiSlice";

const CardSkeleton = () => (
  <div className="bg-zinc-50 border border-zinc-200 rounded-[16px] p-6 flex flex-col md:flex-row gap-6 animate-pulse shadow-sm">
    {/* Left Column: Persona (Desktop) */}
    <div className="hidden md:flex shrink-0 flex-col items-center gap-4 min-w-[80px]">
      <div className="w-14 h-14 bg-zinc-200 rounded-full"></div>
      <div className="h-3 w-12 bg-zinc-200 rounded-md"></div>
    </div>

    {/* Content Section */}
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Avatar Placeholder */}
          <div className="md:hidden w-10 h-10 bg-zinc-200 rounded-full shrink-0"></div>

          <div className="space-y-2">
            <div className="h-6 w-48 bg-zinc-200 rounded-lg"></div>
            <div className="h-3 w-32 bg-zinc-200 rounded-md"></div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-3">
            <div className="h-4 w-4 bg-zinc-200 rounded-full"></div>
            <div className="h-4 w-4 bg-zinc-200 rounded-full"></div>
            <div className="h-4 w-4 bg-zinc-200 rounded-full"></div>
          </div>
          <div className="h-10 w-10 bg-zinc-200 rounded-full shrink-0"></div>
        </div>
      </div>

      {/* Info Grid Placeholder */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-zinc-200 rounded-sm"></div>
          <div className="h-3 w-2/3 bg-zinc-200 rounded-md"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-zinc-200 rounded-sm"></div>
          <div className="h-3 w-1/2 bg-zinc-200 rounded-md"></div>
        </div>
        <div className="flex items-start gap-3 pt-2">
          <div className="w-4 h-4 bg-zinc-200 rounded-sm mt-1"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 w-full bg-zinc-200/60 rounded-md"></div>
            <div className="h-3 w-4/5 bg-zinc-200/60 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Footer Section Placeholder */}
      <div className="pt-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-zinc-200 rounded-sm"></div>
          <div className="h-2 w-10 bg-zinc-200 rounded-sm uppercase"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-zinc-200/80 rounded-full border border-zinc-200"></div>
          <div className="h-6 w-20 bg-zinc-200/80 rounded-full border border-zinc-200"></div>
          <div className="h-6 w-14 bg-zinc-200/80 rounded-full border border-zinc-200"></div>
        </div>
      </div>
    </div>
  </div>
);

const Discover = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return new URLSearchParams(window.location.search).get("tab") === "ai-match" ? "ai-match" : "explore";
  });
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeFiltersCount = [
    filters.role,
    filters.name,
    filters.skills,
    filters.minExperience,
    filters.connectionStatus !== 'all' ? filters.connectionStatus : null
  ].filter(Boolean).length;

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [page, setPage] = useState(1);

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data: usersData, error: usersError, isFetching: loadingProfiles, refetch: refetchUsers } = useGetUsersQuery({
    page,
    limit: 10,
    currentUserId: user?.id,
    ...debouncedFilters
  }, { skip: !isLoggedIn });

  const { data: matchesData, error: matchesError, isFetching: loadingMatches, refetch: refetchMatches } = useGetMatchesQuery(
    user?.id,
    { skip: activeTab !== "ai-match" || !isLoggedIn || !user?.id }
  );

  const users = (usersData?.users || []).map((u) => ({
    id: u?.id || "Unknown ID",
    username: u?.username,
    name: u?.fullName || u?.username || "Anonymous",
    role: u?.role,
    bio: u?.bio,
    skills: Array.isArray(u?.skills) ? u.skills : [],
    receivedRequests: u?.receivedRequests,
    sentRequests: u?.sentRequests,
    experience: u?.experience,
    socialLinks: u?.socialLinks,
    education: u?.education,
    matchDetails: u?.matchDetails
  }));

  const totalPages = usersData?.totalPages || 1;
  const hasMore = usersData?.hasMore || false;

  const matchUsers = (matchesData?.matches || []).map((m) => {
    const u = m.user;
    return {
      compatibilityScore: m.compatibilityScore,
      matchType: m.matchType,
      insights: m.insights,
      profile: {
        id: u?.id || "Unknown ID",
        username: u?.username,
        name: u?.fullName || u?.username || "Anonymous",
        role: u?.role,
        bio: u?.bio,
        skills: Array.isArray(u?.skills) ? u.skills : [],
        receivedRequests: u?.receivedRequests || [],
        sentRequests: u?.sentRequests || [],
        experience: u?.experience,
        socialLinks: u?.socialLinks,
        education: u?.education
      }
    };
  });

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); // Also reset page when debounced filters change
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  const getPageRange = () => {
    const range = [];
    const delta = 1; // Show one page on either side of active page
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== '...') {
        range.push('...');
      }
    }
    return range;
  };

  const handleSendRequest = async (receiverId, senderId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`,
        { receiverId, senderId }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Initial load logic moved into the grid render to allow sidebar to remain visible

  if (usersError && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <h2 className="text-xl font-bold text-zinc-900">Error</h2>
          <p className="text-zinc-500 mt-2">Failed to load user profiles.</p>
          <button
            onClick={() => refetchUsers()}
            className="mt-6 px-6 py-2 bg-zinc-900 text-white font-bold rounded-full uppercase text-[10px] tracking-widest"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/login");
  }

  return (
    <>
      <div className="min-h-screen bg-white text-zinc-900 font-inter pt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Explore Header */}
          <div className="space-y-1 mb-6">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">
              Explore
            </h1>
            <p className="text-zinc-500 text-xs font-medium max-w-xl">
              Connect with expert mentors and ambitious mentees across the globe.
            </p>
          </div>

          <div className="mb-6">
            <ProfileCompletionBanner variant="explore" />
          </div>

          {/* Action Row: Search, Tabs, and Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
            {/* Left: Search input (only visible for explore tab) */}
            {activeTab === "explore" ? (
              <div className="relative w-full md:w-80 group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                  <RiSearchLine className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Search members by name..."
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full pl-11 pr-4 h-10 bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white transition-all outline-none shadow-sm"
                />
              </div>
            ) : (
              <div className="hidden md:block w-80" />
            )}

            {/* Right: Tabs switcher and Filter button */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {/* Tab Switcher */}
              <div className="relative flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 p-1 rounded-xl w-fit backdrop-blur-md shadow-sm h-10 overflow-hidden select-none">
                {/* Sliding Background Indicator */}
                <div 
                  className={`absolute top-1 bottom-1 left-1 w-36 rounded-lg transition-all duration-300 ease-out shadow-sm ${
                    activeTab === 'explore' 
                      ? 'bg-zinc-900 translate-x-0' 
                      : 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 translate-x-[150px]'
                  }`}
                />

                <button
                  onClick={() => setActiveTab("explore")}
                  className={`relative w-36 h-8 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 flex items-center justify-center gap-2 z-10 outline-none ${
                    activeTab === "explore"
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <span>Explore</span>
                </button>
                
                <button
                  onClick={() => setActiveTab("ai-match")}
                  className={`relative w-36 h-8 rounded-lg text-[10px] font-black tracking-widest transition-all duration-300 flex items-center justify-center gap-2 z-10 outline-none ${
                    activeTab === "ai-match"
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <HiSparkles className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    activeTab === 'ai-match' ? 'text-white' : 'text-violet-400'
                  }`} />
                  <span>AI Smart Match</span>
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                disabled={activeTab !== "explore"}
                className="flex items-center gap-2 px-4 h-10 bg-zinc-100 hover:bg-zinc-200 disabled:hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-700 disabled:text-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all select-none shadow-sm cursor-pointer"
              >
                <FiFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filter</span>
                {activeTab === "explore" && activeFiltersCount > 0 && (
                  <span className="bg-zinc-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filter Sidebar Component */}
          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            filters={filters}
            onApplyFilters={(newFilters) => setFilters(newFilters)}
            onClearFilters={() => setFilters({ ...DEFAULT_FILTERS })}
          />

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-8 pb-20">
            {activeTab === "explore" ? (
              // Discovery Feed
              loadingProfiles ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : users?.length > 0 ? (
                users.map((item) => {
                  return item.id !== user?.id ? (
                    <div key={item.id}>
                      <ProfileCard
                        profile={item}
                        currentUserId={user?.id}
                        matchDetails={item.matchDetails}
                        onSendRequest={handleSendRequest}
                      />
                    </div>
                  ) : null;
                })
              ) : (
                <div className="py-32 border border-zinc-200 rounded-[3rem] flex flex-col items-center justify-center space-y-6 bg-zinc-50/50">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                    <RiSearchLine size={24} className="text-zinc-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight block">No Matches Found</h2>
                    <p className="text-zinc-500 text-[11px] font-medium">Try adjusting your filters or search terms.</p>
                  </div>
                  <button
                    onClick={() => setFilters({ ...DEFAULT_FILTERS })}
                    className="px-8 py-2.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              )
            ) : (
              // AI Compatibility Feed
              loadingMatches ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : matchesError ? (
                <div className="py-24 border border-zinc-200 rounded-[3rem] flex flex-col items-center justify-center space-y-6 bg-zinc-50/50">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-200 text-red-600">
                    <FiFilter size={24} />
                  </div>
                  <div className="text-center space-y-2 max-w-sm">
                    <h3 className="text-xl font-bold text-zinc-900 tracking-tight">AI Matching Offline</h3>
                    <p className="text-zinc-600 text-xs leading-relaxed">{matchesError}</p>
                  </div>
                  <button
                    onClick={() => refetchMatches()}
                    className="px-8 py-2.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
                  >
                    Retry Calculation
                  </button>
                </div>
              ) : matchUsers.length > 0 ? (
                matchUsers.map((item) => (
                  <div key={item.profile.id}>
                    <ProfileCard
                      profile={item.profile}
                      currentUserId={user?.id}
                      matchDetails={{
                        compatibilityScore: item.compatibilityScore,
                        matchType: item.matchType,
                        insights: item.insights
                      }}
                      onSendRequest={handleSendRequest}
                    />
                  </div>
                ))
              ) : (
                <div className="py-24 border border-zinc-200 rounded-[3rem] flex flex-col items-center justify-center space-y-6 bg-zinc-50/50">
                  <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center border border-violet-200">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                    </span>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Neural Matching Locked</h2>
                    <p className="text-zinc-500 text-[11px] font-medium max-w-sm leading-relaxed">
                      Please complete your profile details (Role, Bio, Skills, and Experience) so our Gemini neural engine can synthesize your compatibility maps.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${user?.username}`)}
                    className="px-8 py-2.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all cursor-pointer shadow-sm"
                  >
                    Complete Profile Now
                  </button>
                </div>
              )
            )}
          </div>

          {/* Pagination Controls */}
          {activeTab === "explore" && !loadingProfiles && users.length > 0 && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pb-20 pt-6 border-t border-white/5 animate-in fade-in duration-500">
              <button
                disabled={page === 1}
                onClick={() => {
                  setPage(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-400 transition-all select-none w-full sm:w-auto justify-center"
              >
                <FiChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                {getPageRange().map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`dots-${idx}`} className="text-zinc-400 px-2 font-bold select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${page === p
                        ? 'bg-zinc-900 text-white font-black shadow-md'
                        : 'bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200'
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => {
                  setPage(prev => Math.min(totalPages, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-zinc-100 disabled:hover:text-zinc-400 transition-all select-none w-full sm:w-auto justify-center"
              >
                <span>Next</span>
                <FiChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Discover;