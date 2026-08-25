import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiRotateCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

// Import simulated subcomponents
import DashboardDemo from './DashboardDemo';
import ExploreDemo from './ExploreDemo';
import WorkspaceDemo from './WorkspaceDemo';
import PlayerDemo from './PlayerDemo';
import ChatDemo from './ChatDemo';
import KanbanDemo from './KanbanDemo';
import RoadmapCreateDemo from './RoadmapCreateDemo';

interface Application {
  id: string;
  fullName: string;
  username: string;
  bio: string;
  courseTitle: string;
}

interface HistoryState {
  view: string;
  filter?: string;
  extraId?: string | null;
}

// -------------------------------------------------------------
// Reusable Light macOS Browser Frame Component
// -------------------------------------------------------------
interface BrowserFrameProps {
  url: string;
  children: React.ReactNode;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  children,
  onBack,
  onForward,
  canGoBack = false,
  canGoForward = false,
}) => {
  return (
    <div className="w-full rounded-[28px] bg-zinc-50 border border-zinc-200/80 p-3 md:p-4 shadow-xl shadow-zinc-200/40 select-none group relative">
      <div className="w-full rounded-[20px] bg-white border border-zinc-200 shadow-sm flex flex-col overflow-hidden relative">

        {/* macOS Header Window bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 border-b border-zinc-200">
          {/* macOS controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/25"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/25"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/25"></span>
          </div>

          {/* Address Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
            <div className="flex items-center gap-1.5 text-zinc-400 shrink-0">
              <button
                onClick={onBack}
                disabled={!canGoBack}
                className={`p-1 rounded-md hover:bg-zinc-200 transition-colors ${canGoBack ? 'text-zinc-700 cursor-pointer' : 'text-zinc-300 pointer-events-none'
                  }`}
                title="Go back"
              >
                <FiArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onForward}
                disabled={!canGoForward}
                className={`p-1 rounded-md hover:bg-zinc-200 transition-colors ${canGoForward ? 'text-zinc-700 cursor-pointer' : 'text-zinc-300 pointer-events-none'
                  }`}
                title="Go forward"
              >
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
              <FiRotateCw className="w-3.5 h-3.5 ml-1 text-zinc-400 shrink-0" />
            </div>

            <div className="flex-1 bg-white border border-zinc-200 rounded-lg py-1 px-3 text-[10px] text-zinc-500 font-semibold tracking-wide font-mono flex items-center justify-start gap-1.5 shadow-inner">
              <span className="text-zinc-350">https://</span>
              <span>{url}</span>
            </div>
          </div>
          
          {/* Interactive Badge */}
          <div className="shrink-0 flex items-center justify-end animate-in fade-in zoom-in duration-500 delay-300">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 shadow-sm animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[9px] font-bold tracking-wider text-accent uppercase">
                Interactive
              </span>
            </div>
          </div>
        </div>

        {/* Viewport content */}
        <div className="h-[550px] overflow-y-auto p-6 md:p-8 bg-white select-text relative">
          {children}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Window 1: Simulated Dashboard Screen
// -------------------------------------------------------------
const DashboardWindow: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([{ view: 'dashboard' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex];
  const view = currentState.view;
  const workspaceFilter = currentState.filter || 'my-roadmaps';
  const activeCourseId = currentState.extraId || 'pm-agile';

  const [learningCount] = useState(1);
  const [teachingCount, setTeachingCount] = useState(1);
  const [pendingCount, setPendingCount] = useState(1);

  const [pendingRequests, setPendingRequests] = useState<Application[]>([
    {
      id: 'rahuls',
      fullName: 'Rahul Sharma',
      username: 'rahuls',
      bio: 'Self-taught frontend developer looking to build solid release coordination and backlog habits.',
      courseTitle: 'Product Management & Agile Roadmapping'
    }
  ]);

  const handleNavigate = (tab: string, filter?: string, extraId?: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({ view: tab, filter, extraId });
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const getUrl = () => {
    const base = 'synckro.co';
    if (view === 'dashboard') return `${base}/dashboard`;
    if (view === 'explore') return `${base}/explore`;
    if (view === 'player') return `${base}/roadmaps/player/${activeCourseId}`;
    return `${base}/roadmaps?tab=workspace&filter=${workspaceFilter === 'my-roadmaps' ? 'all' : workspaceFilter}`;
  };

  return (
    <BrowserFrame
      url={getUrl()}
      onBack={handleBack}
      onForward={handleForward}
      canGoBack={historyIndex > 0}
      canGoForward={historyIndex < history.length - 1}
    >
      {view === 'dashboard' && (
        <DashboardDemo
          learningCount={learningCount}
          teachingCount={teachingCount}
          pendingCount={pendingCount}
          pendingRequestsCount={pendingRequests.length}
          onNavigate={handleNavigate}
        />
      )}
      {view === 'explore' && (
        <ExploreDemo
          onSendRequest={() => setPendingCount(p => p + 1)}
          onSelectProfile={(username) => handleNavigate('explore', undefined, username || undefined)}
        />
      )}
      {view === 'workspace' && (
        <WorkspaceDemo
          onJoinTrack={() => setPendingCount(p => p + 1)}
          onAcceptStudent={() => setTeachingCount(t => t + 1)}
          onDeclineStudent={() => { }}
          pendingRequests={pendingRequests}
          onRemoveApplication={(id) => setPendingRequests(prev => prev.filter(a => a.id !== id))}
          initialSubFilter={workspaceFilter}
          onSelectCourse={(id) => handleNavigate('player', undefined, id)}
        />
      )}
      {view === 'player' && (
        <PlayerDemo
          courseId={activeCourseId}
          onNavigateBack={() => handleNavigate('workspace', 'my-roadmaps')}
        />
      )}
    </BrowserFrame>
  );
};

// -------------------------------------------------------------
// Window 2: Simulated Explore Screen (Interactive Profile detail)
// -------------------------------------------------------------
const ExploreWindow: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([{ view: 'explore', extraId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex];
  const view = currentState.view;
  const selectedUsername = currentState.extraId;

  const handleSelectProfile = (username: string | null) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({
      view: username ? 'profile' : 'explore',
      extraId: username
    });
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const getUrl = () => {
    const base = 'synckro.co/explore';
    if (view === 'profile') return `${base}/profile/${selectedUsername}`;
    return base;
  };

  return (
    <BrowserFrame
      url={getUrl()}
      onBack={handleBack}
      onForward={handleForward}
      canGoBack={historyIndex > 0}
      canGoForward={historyIndex < history.length - 1}
    >
      <ExploreDemo
        onSendRequest={() => { }}
        selectedUsername={selectedUsername}
        onSelectProfile={handleSelectProfile}
      />
    </BrowserFrame>
  );
};

// -------------------------------------------------------------
// Window 3: Simulated Roadmaps Workspace & Syllabus Player
// -------------------------------------------------------------
const RoadmapsWindow: React.FC = () => {
  const [history, setHistory] = useState<HistoryState[]>([{ view: 'workspace', extraId: null }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentState = history[historyIndex];
  const view = currentState.view;
  const activeCourseId = currentState.extraId || 'pm-agile';



  const [pendingRequests, setPendingRequests] = useState<Application[]>([
    {
      id: 'rahuls',
      fullName: 'Rahul Sharma',
      username: 'rahuls',
      bio: 'Self-taught frontend developer looking to build solid release coordination and backlog habits.',
      courseTitle: 'Product Management & Agile Roadmapping'
    }
  ]);



  const handleRemoveApplication = (id: string) => {
    setPendingRequests(prev => prev.filter(a => a.id !== id));
  };

  const handleSelectCourse = (id: string) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({ view: 'player', extraId: id });
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  };

  const handleBack = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const getUrl = () => {
    const base = 'synckro.co';
    if (view === 'player') return `${base}/roadmaps/player/${activeCourseId}`;
    return `${base}/roadmaps`;
  };

  return (
    <BrowserFrame
      url={getUrl()}
      onBack={handleBack}
      onForward={handleForward}
      canGoBack={historyIndex > 0}
      canGoForward={historyIndex < history.length - 1}
    >
      {view === 'workspace' && (
        <WorkspaceDemo
          onJoinTrack={handleJoinLocal}
          onAcceptStudent={() => { }}
          onDeclineStudent={() => { }}
          pendingRequests={pendingRequests}
          onRemoveApplication={handleRemoveApplication}
          initialSubFilter="my-roadmaps"
          onSelectCourse={handleSelectCourse}
        />
      )}
      {view === 'player' && (
        <PlayerDemo
          courseId={activeCourseId}
          onNavigateBack={() => handleBack()}
        />
      )}
    </BrowserFrame>
  );
};

// Helper stub for WorkspaceDemo Join trigger
const handleJoinLocal = () => { };

// -------------------------------------------------------------
// Main Showcase Grid stack
// -------------------------------------------------------------
const InteractiveDemo: React.FC = () => {
  useEffect(() => {
    // Show a premium toast on load indicating the demos are interactive
    const timer = setTimeout(() => {
      toast('✨ Pro tip: Try clicking around the mockups below! They are fully interactive without logging in.', {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          background: '#09090b', // zinc-950
          color: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #27272a', // zinc-800
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          fontSize: '13px',
          fontWeight: '500',
        }
      });
    }, 1500); // Small delay so they see the page first

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full space-y-24 pb-10">

      {/* 01. Dashboard Section (Text Left) */}
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-left space-y-3 max-w-2xl mr-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            01 • Core Workspace
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            Your Personal Control Center
          </h2>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Keep track of your active learning paths, scheduled mentor check-ins, pending student applications, and compatibility matches in one unified dashboard.
          </p>
        </div>
        <DashboardWindow />
      </div>

      {/* 02. Create Track Section (Text Right) */}
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-right space-y-3 max-w-2xl ml-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            02 • Course Builder
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            Create & Publish Learning Tracks
          </h2>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Design structured curriculum roadmaps with modules, resources, and meeting links. Publish courses for students and peers to discover and enroll in.
          </p>
        </div>
        <BrowserFrame url="synckro.co/roadmaps/create">
          <RoadmapCreateDemo />
        </BrowserFrame>
      </div>

      {/* 03. Roadmaps Section (Text Left) */}
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-left space-y-3 max-w-2xl mr-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            03 • Curriculum & Syllabi
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            Interactive Syllabus & Track Player
          </h2>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Browse public roadmaps or manage your active study groups. Open the syllabus player to check off completed modules, view lesson attachments, and see study group members.
          </p>
        </div>
        <RoadmapsWindow />
      </div>

      {/* 04. Explore Profiles Section (Text Right) */}
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-right space-y-3 max-w-2xl ml-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            04 • Discovery
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            AI Profile Explorer
          </h2>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Search for mentors and mentees by skill in real-time. View detailed user profiles, compatibility insight breakdowns, and send direct match connection requests.
          </p>
        </div>
        <ExploreWindow />
      </div>

      {/* 05. Chat Section (Text Left) */}
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-left space-y-3 max-w-2xl mr-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            05 • Communication
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            Mentorship Chat Rooms
          </h2>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Chat instantly with matching peers, mentees, or mentors. Experience real-time message sending and try talking to our simulated auto-reply chatbots.
          </p>
        </div>
        <BrowserFrame url="synckro.co/messages">
          <ChatDemo />
        </BrowserFrame>
      </div>

      {/* 06. Kanban Section (Text Right) */}
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="text-right space-y-3 max-w-2xl ml-auto">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            06 • Pipeline Management
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            Visual Match Pipeline Kanban
          </h2>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed">
            Manage matching candidates through stage columns. Drag and drop candidate cards to update match status dynamically.
          </p>
        </div>
        <BrowserFrame url="synckro.co/matches/kanban">
          <KanbanDemo />
        </BrowserFrame>
      </div>

    </div>
  );
};

export default InteractiveDemo;
