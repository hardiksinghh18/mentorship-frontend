import React from "react";
import { HiCheckCircle } from "react-icons/hi";
import { SyllabusTimelineProps } from "../../../types/roadmap";

const SyllabusTimeline = ({
  modules,
  activeIdx,
  completedOrderIndexes,
  onSelect,
}: SyllabusTimelineProps) => {
  return (
    <div className="space-y-3">
      {modules.map((mod, idx) => {
        const isActive = activeIdx === idx;
        const isCompleted = completedOrderIndexes.includes(mod.orderIndex || idx + 1);

        return (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full text-left p-5 rounded-[20px] border transition-all duration-300 flex items-center justify-between group
              ${isActive 
                ? "border-accent bg-violet-50/80 text-zinc-900 shadow-sm" 
                : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-900"}`}
          >
            <div className="space-y-1">
              <span className={`text-xs font-semibold
                ${isActive ? "text-accent" : "text-zinc-400"}`}>
                Module {mod.orderIndex || idx + 1}
              </span>
              <h3 className="text-xs font-bold tracking-tight line-clamp-1">
                {mod.title}
              </h3>
            </div>
            {isCompleted && (
              <HiCheckCircle className={`text-lg shrink-0 ${isActive ? "text-accent" : "text-emerald-500"}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SyllabusTimeline;
