import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileCard from "../components/common/ProfileCard";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import DiscoverLoader from "../components/loaders/DiscoverLoader";
import { Select, MenuItem, FormControl } from "@mui/material";
import { RiSearchLine } from 'react-icons/ri';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import ProfileCompletionBanner from "../components/sections/ProfileCompletionBanner";

const CardSkeleton = () => (
  <div className="bg-white/[0.02] border border-white/[0.05] rounded-[16px] p-6 flex flex-col md:flex-row gap-6 animate-pulse">
    {/* Left Column: Persona (Desktop) */}
    <div className="hidden md:flex shrink-0 flex-col items-center gap-4 min-w-[80px]">
      <div className="w-14 h-14 bg-white/[0.05] rounded-full"></div>
      <div className="h-3 w-12 bg-white/[0.03] rounded-md"></div>
    </div>

    {/* Content Section */}
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Avatar Placeholder */}
          <div className="md:hidden w-10 h-10 bg-white/[0.05] rounded-full shrink-0"></div>

          <div className="space-y-2">
            <div className="h-6 w-48 bg-white/[0.05] rounded-lg"></div>
            <div className="h-3 w-32 bg-white/[0.02] rounded-md"></div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex gap-3">
            <div className="h-4 w-4 bg-white/[0.03] rounded-full"></div>
            <div className="h-4 w-4 bg-white/[0.03] rounded-full"></div>
            <div className="h-4 w-4 bg-white/[0.03] rounded-full"></div>
          </div>
          <div className="h-10 w-10 bg-white/[0.05] rounded-full shrink-0"></div>
        </div>
      </div>

      {/* Info Grid Placeholder */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-white/[0.03] rounded-sm"></div>
          <div className="h-3 w-2/3 bg-white/[0.02] rounded-md"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-white/[0.03] rounded-sm"></div>
          <div className="h-3 w-1/2 bg-white/[0.02] rounded-md"></div>
        </div>
        <div className="flex items-start gap-3 pt-2">
          <div className="w-4 h-4 bg-white/[0.03] rounded-sm mt-1"></div>
          <div className="space-y-2 flex-1">
            <div className="h-3 w-full bg-white/[0.01] rounded-md"></div>
            <div className="h-3 w-4/5 bg-white/[0.01] rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Footer Section Placeholder */}
      <div className="pt-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-white/[0.03] rounded-sm"></div>
          <div className="h-2 w-10 bg-white/[0.02] rounded-sm uppercase"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-white/[0.02] rounded-full border border-white/[0.03]"></div>
          <div className="h-6 w-20 bg-white/[0.02] rounded-full border border-white/[0.03]"></div>
          <div className="h-6 w-14 bg-white/[0.02] rounded-full border border-white/[0.03]"></div>
        </div>
      </div>
    </div>
  </div>
);

const Discover = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return new URLSearchParams(window.location.search).get("tab") === "ai-match" ? "ai-match" : "explore";
  });
  const [users, setUsers] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [error, setError] = useState(null);

  // AI Compatibility Engine states
  const [matchUsers, setMatchUsers] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchesError, setMatchesError] = useState(null);
  const [hasLoadedMatches, setHasLoadedMatches] = useState(false);

  const [filters, setFilters] = useState({
    role: "",
    skills: "",
    name: "",
    minExperience: "",
    connectionStatus: "all"
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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

  const fetchUsers = async (pageNumber) => {
    try {
      setError(null); // Clear previous errors on retry/new fetch
      setLoadingProfiles(true);

      const params = new URLSearchParams({
        page: pageNumber,
        limit: 10,
        currentUserId: user?.id,
        ...debouncedFilters,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users?${params.toString()}`,
        { withCredentials: true }
      );

      const newUsers = response?.data.users || [];
      const normalizedUsers = newUsers.map((u) => ({
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

      setUsers(normalizedUsers);
      setTotalPages(response?.data.totalPages || 1);
      setTotalCount(response?.data.totalCount || 0);
      setHasMore(response?.data.hasMore);
      setError(null);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError("Failed to load user profiles. Please try again later.");
    } finally {
      setLoadingProfiles(false);
    }
  };

  const fetchAIMatches = async () => {
    if (!user?.id) return;
    try {
      setLoadingMatches(true);
      setMatchesError(null);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${user.id}/matches`,
        { withCredentials: true }
      );

      const fetchedMatches = response?.data?.matches || [];
      const normalizedMatches = fetchedMatches.map((m) => {
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

      setMatchUsers(normalizedMatches);
      setHasLoadedMatches(true);
    } catch (error) {
      console.error("Error fetching AI matches:", error);
      setMatchesError("Failed to load smart compatibility matches. Complete your profile details (Role, Bio, Skills, and Experience) to let the AI process calculations.");
      setHasLoadedMatches(false);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai-match" && isLoggedIn && !hasLoadedMatches && !loadingMatches) {
      fetchAIMatches();
    }
  }, [activeTab, isLoggedIn, hasLoadedMatches, loadingMatches]);

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

  // Load pages when filter or page changes
  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers(page);
    }
  }, [page, debouncedFilters, isLoggedIn]);

  // Initial load logic moved into the grid render to allow sidebar to remain visible

  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Error</h2>
          <p className="text-zinc-500 mt-2">{error}</p>
          <button
            onClick={() => fetchUsers(1, true)}
            className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full uppercase text-[10px] tracking-widest"
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
      <div className="min-h-screen bg-black text-white font-inter selection:bg-white selection:text-black pt-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Explore
              </h1>
              <p className="text-zinc-500 text-sm font-medium max-w-xl">
                Connect with expert mentors and ambitious mentees across the globe.
              </p>
            </div>

            {/* Obsidian Noir Tab Switcher */}
            <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-white/5 p-1 rounded-full w-fit shrink-0 backdrop-blur-md shadow-2xl">
              <button
                onClick={() => setActiveTab("explore")}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${activeTab === "explore"
                  ? "bg-white text-black shadow-lg shadow-white/5"
                  : "text-zinc-500 hover:text-white hover:bg-white/[0.02]"
                  }`}
              >
                Discovery Feed
              </button>
              <button
                onClick={() => setActiveTab("ai-match")}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${activeTab === "ai-match"
                  ? "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 text-white border-violet-500/20 shadow-lg shadow-violet-500/20"
                  : "text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.02] hover:border-white/5"
                  }`}
              >
                <HiSparkles className={`w-3.5 h-3.5 transition-colors duration-300 ${activeTab === 'ai-match' ? 'text-white animate-pulse' : 'text-violet-400'}`} />
                <span>AI Smart Match</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <ProfileCompletionBanner variant="explore" />
          </div>


          {/* Horizontal Filter Bar - LinkedIn Style */}
          {activeTab === "explore" && (
            <div className="flex flex-wrap items-center gap-y-3 gap-x-0 mb-12 p-1 bg-white/[0.02] sm:bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-xl sticky top-4 z-40 w-full">
              <div className="hidden sm:flex items-center justify-center pl-4 pr-1 text-zinc-500 shrink-0">
                <FiFilter size={14} />
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

              {/* GROUP 1: DROPDOWNS */}
              <div className="flex flex-wrap items-center w-full sm:w-auto">
                {/* Role Filter */}
                <div className="shrink-0 min-w-[130px]">
                  <FormControl fullWidth size="small">
                    <Select
                      name="role"
                      value={filters.role}
                      onChange={handleFilterChange}
                      displayEmpty
                      className="bg-transparent text-xs font-bold text-white transition-all cursor-pointer"
                      sx={{
                        '& .MuiSelect-select': { py: 1.5, px: 2, color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSvgIcon-root': { color: '#3f3f46' },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#09090b',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#71717a',
                              py: 1.5,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="">All Members</MenuItem>
                      <MenuItem value="mentor">Mentors Only</MenuItem>
                      <MenuItem value="mentee">Mentees Only</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

                {/* Experience Filter */}
                <div className="shrink-0 min-w-[130px] flex-1 sm:flex-none">
                  <FormControl fullWidth size="small">
                    <Select
                      name="minExperience"
                      value={filters.minExperience}
                      onChange={handleFilterChange}
                      displayEmpty
                      className="bg-transparent text-xs font-bold text-white transition-all cursor-pointer"
                      sx={{
                        '& .MuiSelect-select': { py: 1.5, px: 2, color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSvgIcon-root': { color: '#3f3f46' },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#09090b',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#71717a',
                              py: 1.5,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="">Any Experience</MenuItem>
                      <MenuItem value="0">Entry Level</MenuItem>
                      <MenuItem value="2">2+ Years</MenuItem>
                      <MenuItem value="5">5+ Years</MenuItem>
                      <MenuItem value="10">10+ Years</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

                {/* Connection Status Filter */}
                <div className="shrink-0 min-w-[130px] flex-1 sm:flex-none">
                  <FormControl fullWidth size="small">
                    <Select
                      name="connectionStatus"
                      value={filters.connectionStatus}
                      onChange={handleFilterChange}
                      displayEmpty
                      className="bg-transparent text-xs font-bold text-white transition-all cursor-pointer"
                      sx={{
                        '& .MuiSelect-select': { py: 1.5, px: 2, color: 'white' },
                        '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                        '& .MuiSvgIcon-root': { color: '#3f3f46' },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            bgcolor: '#09090b',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            mt: 1,
                            '& .MuiMenuItem-root': {
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#71717a',
                              py: 1.5,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' }
                            }
                          }
                        }
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="connected">Connected</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="not_connected">Not Connected</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

              {/* GROUP 2: INPUTS */}
              <div className="flex items-center flex-wrap flex-1 min-w-full sm:min-w-[300px]">
                {/* Name Search */}
                <div className="flex-1 min-w-[150px]">
                  <input
                    type="text"
                    name="name"
                    placeholder="Search name..."
                    value={filters.name}
                    onChange={handleFilterChange}
                    className="w-full bg-transparent px-4 py-2 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none transition-all"
                  />
                </div>

                <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

                {/* Skills Filter */}
                <div className="flex-1 min-w-full sm:min-w-[150px]">
                  <input
                    type="text"
                    name="skills"
                    placeholder="Skills (React, Python)..."
                    value={filters.skills}
                    onChange={handleFilterChange}
                    className="w-full bg-transparent px-4 py-2 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Reset Action */}
              {(filters.role || filters.name || filters.skills || filters.minExperience || filters.connectionStatus !== 'all') && (
                <>
                  <div className="block w-px h-6 bg-white/10 shrink-0 mx-1" />
                  <button
                    onClick={() => setFilters({
                      role: "",
                      name: "",
                      skills: "",
                      minExperience: "",
                      connectionStatus: "all"
                    })}
                    className="px-4 py-2 text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-white transition-all whitespace-nowrap"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
          )}

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
                <div className="py-32 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 bg-white/[0.01]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <RiSearchLine size={24} className="text-zinc-700" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-white tracking-tight block">No Matches Found</h2>
                    <p className="text-zinc-600 text-[11px] font-medium">Try adjusting your filters or search terms.</p>
                  </div>
                  <button
                    onClick={() => setFilters({ role: "", name: "", skills: "" })}
                    className="px-8 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all"
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
                <div className="py-24 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 bg-white/[0.01]">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-500">
                    <FiFilter size={24} />
                  </div>
                  <div className="text-center space-y-2 max-w-sm">
                    <h3 className="text-xl font-bold text-white tracking-tight">AI Matching Offline</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">{matchesError}</p>
                  </div>
                  <button
                    onClick={fetchAIMatches}
                    className="px-8 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all"
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
                <div className="py-24 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-6 bg-white/[0.01]">
                  <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                    </span>
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-white tracking-tight">Neural Matching Locked</h2>
                    <p className="text-zinc-600 text-[11px] font-medium max-w-sm leading-relaxed">
                      Please complete your profile details (Role, Bio, Skills, and Experience) so our Gemini neural engine can synthesize your compatibility maps.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/profile/${user?.username}`)}
                    className="px-8 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all"
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
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all select-none w-full sm:w-auto justify-center"
              >
                <FiChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                {getPageRange().map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`dots-${idx}`} className="text-zinc-600 px-2 font-bold select-none">
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
                          ? 'bg-white text-black font-black shadow-lg shadow-white/5'
                          : 'bg-white/[0.02] border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10'
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
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 hover:text-white hover:bg-white/[0.05] disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all select-none w-full sm:w-auto justify-center"
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