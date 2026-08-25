import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { HiSparkles } from 'react-icons/hi';

interface CandidateCard {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  stage: 'discovered' | 'matched' | 'engaged' | 'enrolled';
}

const KanbanDemo: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateCard[]>([
    { id: 'c1', name: 'Akash Gupta', role: 'React Developer', matchScore: 98, stage: 'discovered' },
    { id: 'c2', name: 'Deepali Sharma', role: 'Product Designer', matchScore: 92, stage: 'matched' },
    { id: 'c3', name: 'John Doe', role: 'Python Developer', matchScore: 88, stage: 'engaged' },
    { id: 'c4', name: 'Sarah Jenkins', role: 'Staff Front-End', matchScore: 96, stage: 'enrolled' },
    { id: 'c5', name: 'Kabir Dev', role: 'Node JS Lead', matchScore: 90, stage: 'matched' }
  ]);

  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: 'discovered' | 'matched' | 'engaged' | 'enrolled') => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    if (!id) return;

    const candidate = candidates.find(c => c.id === id);
    if (!candidate || candidate.stage === targetStage) {
      setDraggedId(null);
      return;
    }

    toast.info(`Moved ${candidate.name} to ${targetStage.toUpperCase()}`);
    setCandidates(prev => prev.map(c =>
      c.id === id ? { ...c, stage: targetStage } : c
    ));
    setDraggedId(null);
  };

  const columns: { id: 'discovered' | 'matched' | 'engaged' | 'enrolled'; title: string; color: string }[] = [
    { id: 'discovered', title: 'Discovered', color: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
    { id: 'matched', title: 'Matched', color: 'bg-indigo-50 text-indigo-700 border-indigo-200/50' },
    { id: 'engaged', title: 'Engaged', color: 'bg-amber-50 text-amber-700 border-amber-200/50' },
    { id: 'enrolled', title: 'Enrolled', color: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 text-left">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">
          Interactive Matches Kanban
        </h2>
        <p className="text-zinc-500 text-xs font-medium max-w-xl">
          Drag and drop candidates across stage columns to manage matches, verify proof-of-work status, and track enrollment.
        </p>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {columns.map(col => {
          const colCandidates = candidates.filter(c => c.stage === col.id);
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className="flex flex-col rounded-[24px] bg-zinc-50 border border-zinc-200 p-4 min-h-[350px] transition-colors"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 px-2">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase border font-mono ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-[10px] font-black text-zinc-400 font-mono">
                  {colCandidates.length}
                </span>
              </div>

              {/* Cards area */}
              <div className="flex-1 space-y-3">
                {colCandidates.map(c => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, c.id)}
                    className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs cursor-grab active:cursor-grabbing hover:border-zinc-350 transition-all select-none space-y-2 group"
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-xs font-bold text-zinc-905 leading-snug group-hover:text-violet-750 transition-colors">
                        {c.name}
                      </span>
                      <span className="text-[8px] font-black text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100/50 shrink-0 flex items-center gap-0.5 leading-none">
                        <HiSparkles className="w-2.5 h-2.5" />
                        {c.matchScore}%
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-semibold">
                      {c.role}
                    </p>
                    {/* Visual drag handle dot bar */}
                    <div className="pt-2 border-t border-zinc-50 flex items-center justify-between">
                      <span className="text-[7px] font-black uppercase text-zinc-350 tracking-wider">Drag card</span>
                      <div className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-zinc-250"></span>
                        <span className="w-1 h-1 rounded-full bg-zinc-250"></span>
                        <span className="w-1 h-1 rounded-full bg-zinc-250"></span>
                      </div>
                    </div>
                  </div>
                ))}

                {colCandidates.length === 0 && (
                  <div className="flex items-center justify-center h-28 border border-dashed border-zinc-200/80 rounded-2xl text-[9px] font-bold text-zinc-350 select-none">
                    Drop candidates here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanDemo;
