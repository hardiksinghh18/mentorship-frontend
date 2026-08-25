import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { HiPlus, HiTrash, HiSparkles } from 'react-icons/hi';

interface Resource {
  title: string;
  url: string;
}

interface Module {
  title: string;
  summary: string;
  resources: Resource[];
  meetingLink: string;
}

const RoadmapCreateDemo: React.FC = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // Prefilled general details
  const [title] = useState('Full-Stack Web Development Bootcamp');
  const [description] = useState('A comprehensive 8-week bootcamp covering modern web development from frontend to backend. Students will build production-ready applications using React, Node.js, and PostgreSQL while learning industry best practices for deployment and testing.');
  const [skills] = useState('React, Node.js, PostgreSQL, TypeScript, Docker, REST APIs');
  const [durationValue] = useState('8');
  const [durationUnit] = useState('Weeks');
  const [maxStudents] = useState('15');

  // Prefilled modules
  const [modules, setModules] = useState<Module[]>([
    {
      title: 'Frontend Foundations with React & TypeScript',
      summary: 'Learn component architecture, hooks, state management with Redux Toolkit, and build responsive UIs using Tailwind CSS. Covers JSX, props, lifecycle, and performance optimization.',
      resources: [
        { title: 'React Official Docs', url: 'https://react.dev' },
        { title: 'TypeScript Handbook', url: 'https://typescriptlang.org/docs' },
      ],
      meetingLink: 'https://meet.google.com/abc-defg-hij',
    },
    {
      title: 'Backend APIs with Node.js & Express',
      summary: 'Build RESTful APIs with Express.js, implement JWT authentication, connect to PostgreSQL with Prisma ORM, and write integration tests with Jest.',
      resources: [
        { title: 'Express.js Guide', url: 'https://expressjs.com/en/guide' },
        { title: 'Prisma Documentation', url: 'https://prisma.io/docs' },
      ],
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst',
    },
    {
      title: 'DevOps, Deployment & CI/CD',
      summary: 'Containerize applications with Docker, deploy to cloud platforms, set up CI/CD pipelines with GitHub Actions, and monitor production environments.',
      resources: [
        { title: 'Docker Getting Started', url: 'https://docs.docker.com/get-started' },
      ],
      meetingLink: '',
    },
  ]);

  const addModule = () => {
    setModules(prev => [...prev, {
      title: '',
      summary: '',
      resources: [{ title: '', url: '' }],
      meetingLink: '',
    }]);
  };

  const removeModule = (idx: number) => {
    if (modules.length <= 1) return;
    setModules(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublish = () => {
    toast.success('Course roadmap published successfully!');
    setStep(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Step Indicator */}
      <div className="flex justify-between items-center pb-5 border-b border-zinc-100">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            Step {step} of 2
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            {step === 1 ? 'Launch a Learning Track' : 'Design the Curriculum Roadmap'}
          </h2>
        </div>
        <div className="flex gap-2">
          <div className={`w-8 h-2 rounded-full transition-all duration-300 ${step === 1 ? 'bg-accent' : 'bg-zinc-200'}`} />
          <div className={`w-8 h-2 rounded-full transition-all duration-300 ${step === 2 ? 'bg-accent' : 'bg-zinc-200'}`} />
        </div>
      </div>

      {step === 1 ? (
        /* ───── STEP 1: General Details ───── */
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500">Course Title</label>
            <input
              type="text"
              value={title}
              readOnly
              className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500">Description</label>
            <textarea
              value={description}
              readOnly
              rows={3}
              className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium leading-relaxed focus:outline-none"
            />
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500">Skills Targeted (Comma separated)</label>
            <input
              type="text"
              value={skills}
              readOnly
              className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:outline-none"
            />
          </div>

          {/* Duration and Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500">Duration Value</label>
              <input
                type="number"
                value={durationValue}
                readOnly
                className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500">Duration Unit</label>
              <select
                value={durationUnit}
                disabled
                className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:outline-none"
              >
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500">Student Capacity</label>
              <input
                type="number"
                value={maxStudents}
                readOnly
                className="w-full px-5 py-3 rounded-xl bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Next button */}
          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
            >
              Syllabus Editor ›
            </button>
          </div>
        </div>
      ) : (
        /* ───── STEP 2: Syllabus Builder ───── */
        <div className="space-y-6">
          {modules.map((mod, mIdx) => (
            <div key={mIdx} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 relative animate-in fade-in duration-300">
              {/* Remove module */}
              {modules.length > 1 && (
                <button
                  onClick={() => removeModule(mIdx)}
                  className="absolute top-5 right-5 text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <HiTrash size={16} />
                </button>
              )}

              <h3 className="text-xs font-bold text-accent mb-3">Module #{mIdx + 1}</h3>

              <div className="space-y-3">
                {/* Module Title */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Module Title</label>
                  <input
                    type="text"
                    value={mod.title}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none"
                  />
                </div>

                {/* Module Summary */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-500">Module Summary</label>
                  <textarea
                    value={mod.summary}
                    readOnly
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium leading-relaxed focus:outline-none"
                  />
                </div>

                {/* Resources */}
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-zinc-500">Learning Resources</label>
                  {mod.resources.map((res, rIdx) => (
                    <div key={rIdx} className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded-lg border border-zinc-100">
                      <input
                        type="text"
                        value={res.title}
                        readOnly
                        className="px-3 py-2 rounded border border-zinc-200 text-[11px] font-medium focus:outline-none"
                      />
                      <input
                        type="text"
                        value={res.url}
                        readOnly
                        className="px-3 py-2 rounded border border-zinc-200 text-[11px] font-medium text-zinc-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Meeting Link */}
                {mod.meetingLink && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-zinc-500">Google Meet Link</label>
                    <input
                      type="text"
                      value={mod.meetingLink}
                      readOnly
                      className="w-full px-4 py-2.5 rounded-lg bg-white border border-zinc-200 text-zinc-900 text-xs font-medium focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Module Trigger */}
          <button
            onClick={addModule}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-accent text-zinc-500 hover:text-accent font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-zinc-50/50"
          >
            <HiPlus size={14} /> Add Course Module
          </button>

          {/* Step Controls */}
          <div className="pt-4 border-t border-zinc-100 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-full bg-zinc-100 text-zinc-700 text-sm font-bold tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all"
            >
              Back to Settings
            </button>
            <button
              onClick={handlePublish}
              className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Publish Course</span>
              <HiSparkles />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapCreateDemo;
