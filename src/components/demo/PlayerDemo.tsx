import React, { useState } from 'react';
import SyllabusTimeline from '../../pages/roadmaps/components/SyllabusTimeline';
import LiveSessionCard from '../../pages/roadmaps/components/LiveSessionCard';
import MembersPanel from '../../pages/roadmaps/components/MembersPanel';
import { toast } from 'react-toastify';
import { Module, Resource } from '../../types/roadmap';

interface PlayerDemoProps {
  courseId: string;
  onNavigateBack: () => void;
}

const PlayerDemo: React.FC<PlayerDemoProps> = ({ courseId, onNavigateBack }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([1]);

  const pmCourse = {
    title: 'Product Management & Agile Roadmapping',
    modules: [
      {
        orderIndex: 1,
        title: 'Introduction to Agile Frameworks',
        summary: 'Understanding sprint scopes, scrum vs. kanban ceremonies, and setting up collaborative backlogs.',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        meetingTime: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
        resources: [
          { title: 'Scrum Guides', url: 'https://scrumguides.org' },
          { title: 'Agile Manifesto', url: 'https://agilemanifesto.org' }
        ] as Resource[]
      },
      {
        orderIndex: 2,
        title: 'Defining OKRs & Deliverables',
        summary: 'Formulating quarterly key results, aligning team metrics to milestones, and tracking impact metrics.',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        meetingTime: new Date(Date.now() + 3600000 * 4).toISOString(), // 4 hours from now
        resources: [
          { title: 'Measure What Matters Summary', url: 'https://www.whatmatters.com/' },
          { title: 'OKR Template Sheet', url: 'https://docs.google.com' }
        ] as Resource[]
      },
      {
        orderIndex: 3,
        title: 'Story Mapping & Prioritization',
        summary: 'How to decompose features into user stories, draw horizontal release slices, and prioritize with RICE.',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        meetingTime: new Date(Date.now() + 3600000 * 24).toISOString(), // 24 hours from now
        resources: [
          { title: 'RICE Calculator Sheet', url: 'https://docs.google.com' },
          { title: 'User Story Mapping Guide', url: 'https://www.jpattonassociates.com/user-story-mapping/' }
        ] as Resource[]
      },
      {
        orderIndex: 4,
        title: 'Launch & Release Postmortems',
        summary: 'Structuring safe feature rollouts, setting up feature flags, and writing retrospective reports.',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        meetingTime: new Date(Date.now() + 3600000 * 48).toISOString(),
        resources: [
          { title: 'Postmortem Template Doc', url: 'https://docs.google.com' },
          { title: 'Rollout Checklist', url: 'https://docs.google.com' }
        ] as Resource[]
      }
    ],
    members: [
      { id: 'sarahj', fullName: 'Sarah Jenkins', username: 'sarahj', isCreator: true },
      { id: 'aravinds', fullName: 'Aravind Swamy', username: 'aravinds' },
      { id: 'emilyw', fullName: 'Emily Watson', username: 'emilyw' },
      { id: 'rahuls', fullName: 'Rahul Sharma', username: 'rahuls' },
      { id: 'amitk', fullName: 'Amit Kumar', username: 'amitk' },
      { id: 'priyas', fullName: 'Priya Sen', username: 'priyas' }
    ]
  };

  const reactCourse = {
    title: 'React Architecture & Design Systems',
    modules: [
      {
        orderIndex: 1,
        title: 'Mastering Custom Hooks',
        summary: 'Encapsulating complex local states, performance triggers, and side-effects inside custom hook signatures.',
        meetingLink: 'https://meet.google.com/xyz-pdqr-wxy',
        meetingTime: new Date(Date.now() + 3600000 * 3).toISOString(),
        resources: [
          { title: 'React Custom Hooks Docs', url: 'https://react.dev' },
          { title: 'Performance Optimization Guidelines', url: 'https://react.dev' }
        ] as Resource[]
      },
      {
        orderIndex: 2,
        title: 'State Management Paradigms',
        summary: 'Comparing Context API, Redux Toolkit, and atomic state libraries for large enterprise products.',
        meetingLink: 'https://meet.google.com/xyz-pdqr-wxy',
        meetingTime: new Date(Date.now() + 3600000 * 28).toISOString(),
        resources: [
          { title: 'RTK Query Cheatsheet', url: 'https://redux-toolkit.js.org' },
          { title: 'Atomic State Comparisons', url: 'https://jotai.org' }
        ] as Resource[]
      },
      {
        orderIndex: 3,
        title: 'Compound Component Patterns',
        summary: 'Building flexible component packages using Context provider mappings to build highly decoupled components.',
        meetingLink: 'https://meet.google.com/xyz-pdqr-wxy',
        meetingTime: new Date(Date.now() + 3600000 * 50).toISOString(),
        resources: [
          { title: 'Compound Pattern Examples', url: 'https://react.dev' },
          { title: 'Clean API Component Principles', url: 'https://react.dev' }
        ] as Resource[]
      },
      {
        orderIndex: 4,
        title: 'Design System Spacing Rules',
        summary: 'Mapping layout spacing arrays to CSS classes, typography hierarchies, and theming tokens.',
        meetingLink: 'https://meet.google.com/xyz-pdqr-wxy',
        meetingTime: new Date(Date.now() + 3600000 * 72).toISOString(),
        resources: [
          { title: 'Design Token Config File', url: 'https://github.com' },
          { title: 'Theme Mapping Blueprint', url: 'https://github.com' }
        ] as Resource[]
      },
      {
        orderIndex: 5,
        title: 'Bundle Splits & Suspense',
        summary: 'Using dynamic imports and lazy loading boundaries to optimize load times.',
        meetingLink: 'https://meet.google.com/xyz-pdqr-wxy',
        meetingTime: new Date(Date.now() + 3600000 * 96).toISOString(),
        resources: [
          { title: 'Bundle Analyzer Docs', url: 'https://github.com' },
          { title: 'Suspense Boundary Layouts', url: 'https://react.dev' }
        ] as Resource[]
      }
    ],
    members: [
      { id: 'sarahj', fullName: 'Sarah Jenkins', username: 'sarahj', isCreator: true },
      { id: 'emilyw', fullName: 'Emily Watson', username: 'emilyw' },
      { id: 'aravinds', fullName: 'Aravind Swamy', username: 'aravinds' },
      { id: 'neham', fullName: 'Neha Mehta', username: 'neham' }
    ]
  };

  const currentCourse = courseId === 'pm-agile' ? pmCourse : reactCourse;
  const activeModule = currentCourse.modules[activeModuleIndex] as Module;

  const toggleCompleteModule = () => {
    const num = activeModule.orderIndex || 1;
    if (completedModules.includes(num)) {
      setCompletedModules(prev => prev.filter(n => n !== num));
      toast.info('Milestone marked incomplete.');
    } else {
      setCompletedModules(prev => [...prev, num]);
      toast.success('Milestone marked complete! Progress updated.');
    }
  };

  const progressPercent = Math.round(
    (completedModules.length / currentCourse.modules.length) * 100
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-left">
      {/* Breadcrumb back navigation header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <button 
            onClick={onNavigateBack} 
            className="hover:text-zinc-900 transition-colors underline underline-offset-2"
          >
            Roadmaps
          </button>
          <span>/</span>
          <span className="text-zinc-900 truncate max-w-[200px]">{currentCourse.title}</span>
        </div>
      </div>

      {/* Title block */}
      <div>
        <h3 className="text-lg font-black text-zinc-900 leading-tight">
          {currentCourse.title}
        </h3>
        {/* Progress indicator */}
        <div className="mt-4 max-w-sm space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
            <span>Syllabus Completed</span>
            <span className="text-zinc-950 font-black">{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-150 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-zinc-900 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        {/* Left column (SyllabusTimeline - col-4) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-semibold text-zinc-400">Course Syllabus</h4>
          <SyllabusTimeline
            modules={currentCourse.modules as Module[]}
            activeIdx={activeModuleIndex}
            completedOrderIndexes={completedModules}
            onSelect={setActiveModuleIndex}
          />
        </div>

        {/* Center column (Module viewer - col-5) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-zinc-200/80 rounded-[24px] p-6 space-y-4">
            <div>
              <span className="text-[9px] font-black uppercase text-accent font-mono">
                Active Module {activeModule.orderIndex}
              </span>
              <h3 className="text-sm font-extrabold text-zinc-900 mt-1 leading-tight">
                {activeModule.title}
              </h3>
            </div>
            <p className="text-xs text-zinc-550 leading-relaxed font-normal">
              {activeModule.summary}
            </p>
            {activeModule.resources && activeModule.resources.length > 0 && (
              <div className="pt-4 border-t border-zinc-100">
                <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Resources</h5>
                <ul className="space-y-15">
                  {activeModule.resources.map(res => (
                    <li key={res.title}>
                      <a 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-zinc-650 hover:text-violet-750 transition-colors flex items-center gap-1.5 cursor-pointer hover:underline"
                      >
                        📄 {res.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right column (LiveSessionCard & MembersPanel - col-3) */}
        <div className="md:col-span-3 space-y-8">
          <LiveSessionCard
            meetingLink={activeModule.meetingLink}
            meetingTime={activeModule.meetingTime}
            isCompleted={completedModules.includes(activeModule.orderIndex || 1)}
            onToggleComplete={toggleCompleteModule}
          />
          <MembersPanel members={currentCourse.members} />
        </div>
      </div>

    </div>
  );
};

export default PlayerDemo;
