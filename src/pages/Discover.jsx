import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProfileCard from "../components/common/ProfileCard";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import DiscoverLoader from "../components/loaders/DiscoverLoader";

const CardSkeleton = () => (
  <div className="h-72 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] p-8 flex gap-8 animate-pulse">
    <div className="w-20 h-20 bg-white/[0.05] rounded-2xl shrink-0"></div>
    <div className="flex-1 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-white/[0.05] rounded-lg"></div>
          <div className="h-3 w-32 bg-white/[0.02] rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-white/[0.05] rounded-full"></div>
      </div>
      <div className="h-4 w-full bg-white/[0.02] rounded-lg"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-white/[0.03] rounded-lg"></div>
        <div className="h-6 w-20 bg-white/[0.03] rounded-lg"></div>
      </div>
    </div>
  </div>
);

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: "", skills: "", interests: "", name: "" });
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
      if (isInitial) {
        setLoadingProfiles(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: pageNumber,
        limit: 10,
        ...debouncedFilters,
      });

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/users?${params.toString()}`,
        { withCredentials: true }
      );
      
      const newUsers = response.data.users || [];
      const normalizedUsers = newUsers.map((u) => ({
        id: u?.id || "Unknown ID",
        username: u?.username,
        name: u?.fullName || u?.username || "Anonymous",
        role: u?.role,
        bio: u?.bio,
        skills: Array.isArray(u?.skills) ? u.skills : [],
        interests: Array.isArray(u?.interests) ? u.interests : [],
        receivedRequests: u?.receivedRequests,
        sentRequests: u?.sentRequests,
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
    <div className="min-h-screen bg-black text-white font-inter selection:bg-white selection:text-black pt-28">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row relative px-4 md:px-0">
        
        {/* Sidebar Filter - Refined Editorial Panel */}
        <div 
          className={`fixed inset-0 md:sticky md:top-10 md:self-start md:w-80 h-full md:h-[calc(100vh-2.5rem)] bg-black md:bg-transparent z-50 md:z-auto transition-transform duration-500 md:translate-x-0 ${
            showFilters ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col p-8 md:p-12 md:pt-6 space-y-10 border-r border-white/5 md:border-white/[0.03] overflow-y-auto no-scrollbar">
            {/* Mobile Close */}
            <button 
              onClick={toggleFilters}
              className="md:hidden self-end p-2 text-zinc-500 hover:text-white"
            >
              <FaTimes size={20} />
            </button>

            <div className="space-y-2">
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-zinc-400">
                Directory
              </h2>
              <div className="w-12 h-px bg-white/10" />
            </div>

            <div className="space-y-8 flex-grow">
              {/* Role Filter */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Categorization
                </label>
                <div className="relative group">
                  <select
                    name="role"
                    value={filters.role}
                    onChange={handleFilterChange}
                    className="appearance-none w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all cursor-pointer"
                  >
                    <option value="" className="bg-zinc-950">All Identities</option>
                    <option value="mentor" className="bg-zinc-950">Elite Mentors</option>
                    <option value="mentee" className="bg-zinc-950">Mentees</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-hover:text-white transition-colors text-[10px]">
                    ▼
                  </div>
                </div>
              </div>

              {/* Name Search */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Identity Search
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name or tag..."
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                />
              </div>

              {/* Skills Filter */}
              <div className="space-y-3">
                <label className="block text-[11px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1">
                  Proficiencies
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="UI, React, Strategy..."
                  value={filters.skills}
                  onChange={handleFilterChange}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-3.5 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                />
              </div>

              {/* Reset Action */}
              <button
                onClick={() => setFilters({ role: "", name: "", skills: "", interests: "" })}
                className="w-full py-3.5 text-[10px] font-black tracking-widest uppercase text-zinc-500 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl transition-all"
              >
                Flush All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Feed */}
        <div className="flex-1 p-6 md:p-12 md:pt-6 space-y-12">
          
          {/* Mobile Header Toggle */}
          <div className="md:hidden flex items-center justify-between mb-8">
            <button
              onClick={toggleFilters}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400"
            >
              <FaBars size={12} />
              Refine Feed
            </button>
          </div>

          {/* Editorial Header */}
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-white">
              Explore the <br/>
              <span className="text-zinc-500 italic font-medium">Synchronized</span> Collective
            </h1>
            <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed">
              Curating high-value mentorship connections through the Onyx network.
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-12 pb-20">
            {loadingProfiles && page === 1 ? (
              // Initial/Filter Loading State
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
              <div className="py-20 border border-white/5 rounded-[3rem] flex flex-col items-center justify-center space-y-4">
                <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No Matches Found</p>
                <button 
                  onClick={() => setFilters({ role: "", name: "", skills: "", interests: "" })}
                  className="text-white font-bold hover:underline"
                >
                  Clear search parameters
                </button>
              </div>
            )}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="space-y-12">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;