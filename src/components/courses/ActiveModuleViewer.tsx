import React from "react";
import { HiLink } from "react-icons/hi";
import { ActiveModuleViewerProps } from "../../types/course";

const ActiveModuleViewer = ({ module }: ActiveModuleViewerProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-accent">Active Lesson</span>
        <h2 className="text-xl font-bold tracking-tight text-zinc-900">{module.title}</h2>
        <p className="text-zinc-500 text-sm leading-relaxed mt-4">{module.summary}</p>
      </div>

      <div className="pt-6 border-t border-zinc-200 space-y-4">
        <h3 className="text-xs font-semibold text-zinc-400">Resources & Attachments</h3>
        <div className="space-y-2">
          {module.resources.map((res, idx) => (
            <a
              key={idx}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors group"
            >
              <span className="text-xs font-medium text-zinc-700 group-hover:text-accent transition-colors flex items-center gap-2">
                <HiLink /> {res.title}
              </span>
              <span className="text-xs text-zinc-400 group-hover:text-zinc-600">›</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveModuleViewer;
