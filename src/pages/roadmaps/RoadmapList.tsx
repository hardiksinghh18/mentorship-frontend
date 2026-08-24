import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import BrowseTab from "./components/BrowseTab";
import MyRoadmapsTab from "./components/MyRoadmapsTab";
import { AuthState } from "../../types/roadmap";

const RoadmapList = () => {
  const { isLoggedIn } = useSelector((state: AuthState) => state.auth);
  const [activeTab, setActiveTab] = useState<"browse" | "my-roadmaps">("browse");

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-inter pt-8 pb-20 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="space-y-1 mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">
            Roadmaps
          </h1>
          <p className="text-zinc-500 text-xs font-medium max-w-xl">
            Syllabus-led collaborative study tracks.
          </p>
        </div>

        {/* Action Row: Tabs & Create Button */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-10 border-b border-zinc-200/60">
          {isLoggedIn ? (
            <div className="relative flex items-center gap-1.5 bg-zinc-100 border border-zinc-200/60 p-1 rounded-full w-fit backdrop-blur-md shadow-sm h-10 select-none font-semibold">
              {/* Sliding Indicator */}
              <div 
                className={`absolute top-1 bottom-1 left-1 w-32 rounded-full bg-white border border-zinc-200/50 shadow-sm transition-all duration-300 ease-out ${
                  activeTab === "browse" ? "translate-x-0" : "translate-x-[132px]"
                }`}
              />
              
              <button
                onClick={() => setActiveTab("browse")}
                className={`relative w-32 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 z-10 outline-none ${
                  activeTab === "browse" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <span>Browse</span>
              </button>
              
              <button
                onClick={() => setActiveTab("my-roadmaps")}
                className={`relative w-32 h-8 rounded-full text-xs font-bold tracking-tight transition-all duration-300 flex items-center justify-center gap-1.5 z-10 outline-none ${
                  activeTab === "my-roadmaps" ? "text-zinc-950 font-black" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <span>Workspace</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:block w-80" />
          )}

          {isLoggedIn && (
            <Link
              to="/roadmaps/create"
              className="px-5 py-2.5 rounded-full bg-zinc-950 text-white text-xs font-bold tracking-tight hover:bg-zinc-800 shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span>New Roadmap</span>
              <span className="text-sm font-light">+</span>
            </Link>
          )}
        </div>

        {/* Tab Panels */}
        <div>
          {activeTab === "browse" ? <BrowseTab /> : <MyRoadmapsTab />}
        </div>
      </div>
    </div>
  );
};

export default RoadmapList;
