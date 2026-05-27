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
import { FiFilter } from 'react-icons/fi';
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
  const [users, setUsers] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: "",
    skills: "",
    name: "",
    minExperience: "",
    connectionStatus: "all"
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const observer = useRef();

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(1); // Also reset page when debounced filters change
    }, 500);

    return () => clearTimeout(handler);
  }, [filters]);

  const lastUserElementRef = useCallback(
    (node) => {
      if (loadingProfiles || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingProfiles, loadingMore, hasMore]
  );

  const fetchUsers = async (pageNumber, isInitial = false) => {
    try {
      setError(null); // Clear previous errors on retry/new fetch
      if (isInitial) {
        setLoadingProfiles(true);
      } else {
        setLoadingMore(true);
      }

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
        education: u?.education
      }));

      setUsers((prev) => (isInitial ? normalizedUsers : [...prev, ...normalizedUsers]));
      setHasMore(response.data.hasMore);
      setError(null);
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      setError("Failed to load user profiles. Please try again later.");
    } finally {
      setLoadingProfiles(false);
      setLoadingMore(false);
    }
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Initial load or filter change
  useEffect(() => {
    if (isLoggedIn) {
      fetchUsers(1, true);
    }
  }, [debouncedFilters, isLoggedIn]);

  // Load more pages
  useEffect(() => {
    if (page > 1 && isLoggedIn) {
      fetchUsers(page, false);
    }
  }, [page]);

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
          </div>

          <div className="mb-4">
            <ProfileCompletionBanner variant="explore" />
          </div>


          {/* Horizontal Filter Bar - LinkedIn Style */}
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

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-8 pb-20">
            {loadingProfiles && page === 1 ? (
              <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </>
            ) : users?.length > 0 ? (
              users.map((item, index) => {
                const isLast = users.length === index + 1;
                return item.id !== user?.id ? (
                  <div key={item.id} ref={isLast ? lastUserElementRef : null}>
                    <ProfileCard
                      profile={item}
                      currentUserId={user?.id}
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
            )}

            {loadingMore && (
              <div className="space-y-8">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;